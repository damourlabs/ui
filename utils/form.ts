import type { RuleExpression } from "vee-validate";
import type { DynamicFormFieldProps, FormSchema } from '~ui/components/forms';
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod';

export const isAsOfType = (as: string, type: string): boolean => {
  return as === type;
};
export const isArray = (as: string) => {
  return isAsOfType(as, 'array') || isAsOfType(as, 'array-field') || isAsOfType(as, 'array-item');
};

export const isSection = (as: string) => {
  return isAsOfType(as, 'section') || isAsOfType(as, 'form-section');
};

export const isSelect = (as: string): boolean => {
  return isAsOfType(as, 'select') || isAsOfType(as, 'select-option');
};

export const isInput = (as: string) => {
  return isAsOfType(as, 'input') || isAsOfType(as, 'text') || isAsOfType(as, 'email') || isAsOfType(as, 'password');
};

export const isObject = (as: string) => {
  return isAsOfType(as, 'object') || isAsOfType(as, 'nested-object');
};

export const hasArrayFields = (fields: Omit<DynamicFormFieldProps<RuleExpression<unknown>>, "rules">[]) => {
  return fields.some(field => isArray(field.as));
}


// Create a select options from a Zod enum schema
export function createSelectOptionsFromEnum<T extends z.ZodEnum<[string, ...string[]]>>(enumSchema: T): { label: string; value: string; tag: string }[] {
  return Object.entries(enumSchema.enum).map(([key, value]) => ({
    tag: 'select-option',
    label: key,
    value: value.toString(),
  }));
}


const applyTypeSchemaToRules = (object: DynamicFormFieldProps<z.ZodType<unknown, z.ZodTypeDef, unknown>>) => {

  const typedObject: DynamicFormFieldProps<RuleExpression<unknown>> = {
    ...object,
    rules: toTypedSchema(object.rules),
    subfields: object.subfields.map((subfield) => applyTypeSchemaToRules(subfield)) || []

  }

  return typedObject
}

// Create a dyanmica for schema based on a Zod schema
type CreateDynamicFormOptions = {
  resourceFields?: string[];
  fieldsToIgnore?: string[];
};

function _createDynamicForm(
  schema: z.ZodObject<z.ZodRawShape, z.UnknownKeysParam, z.ZodTypeAny>,
  options: CreateDynamicFormOptions = {
    resourceFields: [],
    fieldsToIgnore: []
  }
): FormSchema<z.ZodType<unknown, z.ZodTypeDef, unknown>> {
  const { resourceFields, fieldsToIgnore } = options;
  const fields: DynamicFormFieldProps<z.ZodType<unknown, z.ZodTypeDef, unknown>>[] = [];
  const initialValues: Record<string, unknown> = {};

  for (const key in schema.shape) {
    if (fieldsToIgnore?.includes(key)) continue;

    let fieldSchema = schema.shape[key];

    if (fieldSchema instanceof z.ZodLazy) {
      fieldSchema = fieldSchema._def.getter();
    }

    const field: DynamicFormFieldProps<z.ZodType<unknown, z.ZodTypeDef, unknown>> = {
      as: 'input',
      description: fieldSchema.description ?? '',
      opts: {
        label: key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase()),
        validateOnValueUpdate: true,
        validateOnMount: false,
      },
      name: key,
      label: key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase()),
      subfields: [],
      displayField: 'id',
      rules: fieldSchema,
      inputType: 'text',
    };

    if (fieldSchema instanceof z.ZodEffects) {
      fieldSchema = fieldSchema.innerType();
    }

    if (fieldSchema instanceof z.ZodDefault) {
      initialValues[key] = fieldSchema._def.defaultValue();
      fieldSchema = fieldSchema._def.innerType;
    } else {
    }

    // Get the default value for the field if it exists and the field has no children
    if (fieldSchema instanceof z.ZodDefault) {
      // If the field has a default value, we can use it as the initial value
      initialValues[key] = fieldSchema._def.defaultValue();

      // Unwrap the schema to get the inner schema
      fieldSchema = fieldSchema._def.innerType;
    } else {
      // If the field does not have a default value, we can set the initial value to an empty object
      initialValues[key] = undefined;
    }

    // Handle nested objects
    if (fieldSchema instanceof z.ZodObject) {
      // If the field is an object, we can use the inner schema for the object properties
      field.as = 'object'; // Change the field type to object

      const fieldObject = _createDynamicForm(fieldSchema, options); // Recursively create fields for the object properties
      field.subfields = fieldObject.sections; // Set the children to the created fields
      initialValues[key] = fieldObject.initialValues; // Set the initial value for the object
    }

    // Figure out what type of field to create based on the schema
    if (fieldSchema instanceof z.ZodOptional || fieldSchema instanceof z.ZodNullable) {
      // If the field is optional, we can just use the inner schema
      fieldSchema = fieldSchema.unwrap();
    }






    // --- Deal with arrays ---
    if (fieldSchema instanceof z.ZodArray) {
      // If the field is an array, we can use the inner schema for the array items
      field.as = 'array'; // Change the field type to array
      //
      let resolveFieldSchema = fieldSchema.element;
      if (fieldSchema.element instanceof z.ZodLazy) {
        resolveFieldSchema = resolveFieldSchema._def.getter();

      }
      field.subfields = _createDynamicForm(resolveFieldSchema, options).sections; // Recursively create fields for the array items

      // For the empty value field, we need to find what are the default values of all the fields in the resolveFieldSchema
      field.emptyValue = {};

      for (const itemKey in resolveFieldSchema.shape) {
        let itemFieldSchema = resolveFieldSchema.shape[itemKey];
        // If the item field is a lazy schema, we can resolve it

        if (itemFieldSchema instanceof z.ZodLazy) {
          itemFieldSchema = itemFieldSchema._def.getter()

          if (itemFieldSchema instanceof z.ZodDefault) {
            field.emptyValue[itemKey] = itemFieldSchema._def.defaultValue();
          }
        } else if (itemFieldSchema instanceof z.ZodDefault) {
          field.emptyValue[itemKey] = itemFieldSchema._def.defaultValue();
        } else {
          field.emptyValue[itemKey] = undefined; // Default to undefined if no default value is available
        }
      }

      // Set the label to be without the final 's'
      field.opts.label = field.opts.label.endsWith('s') ? field.opts.label.slice(0, -1) : field.opts.label; // Remove the final 's' from the label



      // Get the resource store key from the key since we assume that the key is in the form '[resource]Id'
      const resourceStoreKey = key.replace(/s$/, ''); // Remove the 'Id' suffix and add 's' to get the store key

      console.log('Resource store key from array:', resourceStoreKey);
      if (resourceFields.includes(resourceStoreKey)) {
        field.resourceStore = resourceStoreKey + 'sStore';
        field.displayField = 'name'; // Default display field is the name
        console.log('Resource store key is in the resourceFields array:', field.resourceStore);
      } else {

        // initialValues[key] = crypto.randomUUID(); // Generate a random UUID as the initial value
        // field.as = 'generate-uuid'; // Change the field type to generate-uuid
      }


      // console.log('Field schema for array:', fieldSchema);
    }

    // --- Deal with Records ---
    if (fieldSchema instanceof z.ZodRecord) {
      // If the field is a record, we can use the inner schema for the record values
      field.as = 'record'; // Change the field type to record
      //
      let resolveFieldSchema = fieldSchema.valueSchema;
      if (resolveFieldSchema instanceof z.ZodLazy) {
        resolveFieldSchema = resolveFieldSchema._def.getter();

      }
      field.subfields = _createDynamicForm(resolveFieldSchema, options).sections; // Recursively create fields for the record values

      // For the empty value field, we need to find what are the default values of all the fields in the resolveFieldSchema
      field.emptyValue = {};

      if (resolveFieldSchema instanceof z.ZodObject) {
        for (const itemKey in resolveFieldSchema.shape) {
          let itemFieldSchema = resolveFieldSchema.shape[itemKey];
          // If the item field is a lazy schema, we can resolve it

          if (itemFieldSchema instanceof z.ZodLazy) {
            itemFieldSchema = itemFieldSchema._def.getter()

            if (itemFieldSchema instanceof z.ZodDefault) {
              field.emptyValue[itemKey] = itemFieldSchema._def.defaultValue();
            }
          } else if (itemFieldSchema instanceof z.ZodDefault) {
            field.emptyValue[itemKey] = itemFieldSchema._def.defaultValue();
          } else {
            field.emptyValue[itemKey] = undefined; // Default to undefined if no default value is available
          }
        }
      } else {
        field.emptyValue = undefined; // Default to undefined if no default value is available
      }

    }

    // --- Deal with enums ---
    if (fieldSchema instanceof z.ZodEnum) {
      // If the field is an enum, we can create select options
      field.as = 'select'; // Change the field type to select
      field.selectOptions = createSelectOptionsFromEnum(fieldSchema);
    }


    // --- Deal with strings ---
    if (fieldSchema instanceof z.ZodString) {
      // If the field is a string, we can set the type to text
      field.inputType = 'text';
    }
    if (fieldSchema instanceof z.ZodString && fieldSchema.isEmail) {
      // If the field is a string and is an email, we can set the type to email
      field.inputType = 'email';
    }
    if (fieldSchema instanceof z.ZodString && fieldSchema.isURL) {
      // If the field is a string and is a URL, we can set the type to url
      field.inputType = 'url';
    }
    if (fieldSchema instanceof z.ZodString && fieldSchema.isDate) {
      // If the field is a string and is a date, we can set the type to date
      field.inputType = 'date';
    }
    if (fieldSchema instanceof z.ZodString && fieldSchema.isUUID) {
      // If the field is a string and is a date, we can set the type to date
      field.inputType = 'uuid'; // Set the type to uuid

      // Get the resource store key from the key since we assume that the key is in the form '[resource]Id'
      const resourceStoreKey = key.replace(/Id$/, ''); // Remove the 'Id' suffix and add 's' to get the store key


      if (resourceFields.includes(resourceStoreKey)) {
        console.log('Resource store key is in the resourceFields array:', resourceStoreKey);

        field.as = 'resource-finder';
        field.resourceStore = resourceStoreKey + 'sStore';
      } else {

        initialValues[key] = crypto.randomUUID(); // Generate a random UUID as the initial value
        // field.as = 'generate-uuid'; // Change the field type to generate-uuid
      }
    }

    // --- Deal with booleans ---
    if (fieldSchema instanceof z.ZodBoolean) {
      // If the field is a boolean, we can set the type to checkbox
      field.as = 'checkbox'; // Change the field type to checkbox
      field.inputType = 'checkbox'; // Set the type to checkbox
    }


    // --- Deal with numbers ---
    //
    if (fieldSchema instanceof z.ZodNumber) {
      // If the field is a number, we can set the type to number
      field.as = 'number';
      field.inputType = 'number'; // Set the type to number

    }

    // --- Deal with date
    if (fieldSchema instanceof z.ZodDate) {
      // If the field is a date, we can set the type to date
      field.as = 'date'; // Change the field type to date
      field.inputType = 'date'; // Set the type to date
    }

    // This is a bit hacky but we assume that each date field has "date" in its key
    if (key.toLowerCase().includes('date') && !isAsOfType(field.as, 'calendar-date')) {
      field.as = 'calendar-date'; // Change the field type to date
      field.inputType = 'calendar-date'; // Set the type to date
    }






    fields.push(field);
  }

  return {
    sections: fields,
    schema: schema,
    initialValues
  };

}


export function createDynamicForm(schema: z.ZodObject<z.ZodRawShape, z.UnknownKeysParam, z.ZodTypeAny>,
  options: CreateDynamicFormOptions = {}
): FormSchema<RuleExpression<unknown>> {
  // Create a dynamic form based on the Zod schema
  const dynamicForm = _createDynamicForm(schema, options);
  // Apply the type schema to the rules
  return {
    ...dynamicForm,
    schema: toTypedSchema(dynamicForm.schema),
    sections: dynamicForm.sections.map((field) => applyTypeSchemaToRules(field))
  }
}

// New helper function to check if a field is a resource finder
export const isResourceFinder = (as: string): boolean => {
  return isAsOfType(as, 'resource-finder') || isAsOfType(as, 'resource');
};

// Create a resource finder field helper
export function createResourceFinderField<TRules>(
  name: string,
  label: string,
  storeKey: string,
  options: {
    description?: string
    displayField?: string
    subTextField?: string
    searchFields?: string[]
    rules?: TRules
  } = {}
): DynamicFormFieldProps<TRules> {
  return {
    as: 'resource-finder',
    name,
    description: options.description || `Select a ${label.toLowerCase()}`,
    opts: {
      label,
      validateOnValueUpdate: true,
      validateOnMount: false,
    },
    rules: options.rules || (toTypedSchema(z.string().optional()) as TRules),
    inputType: 'text',
    subfields: [],
    label: label,
    resourceStore: storeKey,
    displayField: options.displayField || 'name',
    subTextField: options.subTextField,
    searchFields: options.searchFields || ['name', 'title']
  }
}

