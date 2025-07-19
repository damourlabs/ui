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

// Type to hold metadata about wrapper schemas
type SchemaWrapperInfo = {
  isNullable: boolean;
  isOptional: boolean;
  hasDefault: boolean;
  defaultValue?: unknown;
  isLazy: boolean;
  hasEffects: boolean;
};

// Helper function to recursively unwrap schema and collect wrapper information
function unwrapSchemaWithMetadata(
  schema: z.ZodType<any, any, any>
): { coreSchema: z.ZodType<any, any, any>; metadata: SchemaWrapperInfo } {
  const metadata: SchemaWrapperInfo = {
    isNullable: false,
    isOptional: false,
    hasDefault: false,
    isLazy: false,
    hasEffects: false,
  };

  let currentSchema = schema;

  // Keep unwrapping until we reach the core schema
  while (true) {
    if (currentSchema instanceof z.ZodLazy) {
      metadata.isLazy = true;
      currentSchema = currentSchema._def.getter();
      continue;
    }

    if (currentSchema instanceof z.ZodEffects) {
      metadata.hasEffects = true;
      currentSchema = currentSchema.innerType();
      continue;
    }

    if (currentSchema instanceof z.ZodNullable) {
      metadata.isNullable = true;
      currentSchema = currentSchema.unwrap();
      continue;
    }

    if (currentSchema instanceof z.ZodDefault) {
      metadata.hasDefault = true;
      metadata.defaultValue = currentSchema._def.defaultValue();
      currentSchema = currentSchema._def.innerType;
      continue;
    }

    if (currentSchema instanceof z.ZodOptional) {
      metadata.isOptional = true;
      currentSchema = currentSchema.unwrap();
      continue;
    }

    // No more wrappers found, break out of loop
    break;
  }

  return { coreSchema: currentSchema, metadata };
}

function _createDynamicForm(
  schema: z.ZodObject<z.ZodRawShape, z.UnknownKeysParam, z.ZodTypeAny>,
  options: CreateDynamicFormOptions = {
    resourceFields: [],
    fieldsToIgnore: []
  }
): FormSchema<z.ZodType<unknown, z.ZodTypeDef, unknown>> {
  const { resourceFields = [], fieldsToIgnore = [] } = options;
  const fields: DynamicFormFieldProps<z.ZodType<unknown, z.ZodTypeDef, unknown>>[] = [];
  const initialValues: Record<string, unknown> = {};

  for (const key in schema.shape) {
    if (fieldsToIgnore?.includes(key)) continue;

    const originalFieldSchema = schema.shape[key];
    const { coreSchema: fieldSchema, metadata } = unwrapSchemaWithMetadata(originalFieldSchema);

    // Handle initial values based on metadata
    let initialValue: unknown = undefined;

    if (metadata.hasDefault) {
      initialValue = metadata.defaultValue;
    }

    // Check for conflicting wrapper types and warn
    const conflictingWrappers: string[] = [];
    if (metadata.hasDefault && metadata.isNullable) conflictingWrappers.push('default + nullable');
    if (metadata.hasDefault && metadata.isOptional) conflictingWrappers.push('default + optional');

    if (conflictingWrappers.length > 0) {
      console.warn(`Field "${key}" has conflicting wrapper types: ${conflictingWrappers.join(', ')}. Setting initial value to null.`);
      initialValue = null;
    }

    initialValues[key] = initialValue;

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




    // Handle nested objects
    if (fieldSchema instanceof z.ZodObject) {
      // If the field is an object, we can use the inner schema for the object properties
      field.as = 'object'; // Change the field type to object

      const fieldObject = _createDynamicForm(fieldSchema, options); // Recursively create fields for the object properties
      field.subfields = fieldObject.sections; // Set the children to the created fields
      initialValues[key] = fieldObject.initialValues; // Set the initial value for the object
    }







    // --- Deal with arrays ---
    if (fieldSchema instanceof z.ZodArray) {
      // If the field is an array, we can use the inner schema for the array items
      field.as = 'array'; // Change the field type to array

      // Use our new unwrapping function for the array element
      const { coreSchema: resolveFieldSchema } = unwrapSchemaWithMetadata(fieldSchema.element);

      // Only process as nested fields if the core schema is a ZodObject
      if (resolveFieldSchema instanceof z.ZodObject) {
        field.subfields = _createDynamicForm(resolveFieldSchema, options).sections; // Recursively create fields for the array items

        // For the empty value field, we need to find what are the default values of all the fields in the resolveFieldSchema
        field.emptyValue = {};

        for (const itemKey in resolveFieldSchema.shape) {
          const { metadata: itemMetadata } = unwrapSchemaWithMetadata(resolveFieldSchema.shape[itemKey]);

          if (itemMetadata.hasDefault) {
            field.emptyValue[itemKey] = itemMetadata.defaultValue;
          } else {
            field.emptyValue[itemKey] = undefined; // Default to undefined if no default value is available
          }
        }
      } else {
        // For non-object array elements, set empty subfields and emptyValue
        field.subfields = [];
        field.emptyValue = undefined;
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

      // Use our new unwrapping function for the record value schema
      const { coreSchema: resolveFieldSchema } = unwrapSchemaWithMetadata(fieldSchema.valueSchema);

      // Only process as nested fields if the core schema is a ZodObject
      if (resolveFieldSchema instanceof z.ZodObject) {
        field.subfields = _createDynamicForm(resolveFieldSchema, options).sections; // Recursively create fields for the record values

        // For the empty value field, we need to find what are the default values of all the fields in the resolveFieldSchema
        field.emptyValue = {};

        for (const itemKey in resolveFieldSchema.shape) {
          const { metadata: itemMetadata } = unwrapSchemaWithMetadata(resolveFieldSchema.shape[itemKey]);

          if (itemMetadata.hasDefault) {
            field.emptyValue[itemKey] = itemMetadata.defaultValue;
          } else {
            field.emptyValue[itemKey] = undefined; // Default to undefined if no default value is available
          }
        }
      } else {
        // For non-object record values, set empty subfields and emptyValue
        field.subfields = [];
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

