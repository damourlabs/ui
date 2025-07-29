import type { RuleExpression } from "vee-validate";
import type { DynamicFormFieldProps, FormSchema } from '~ui/components/forms';
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod';

export type ResourceFieldIndicator = {
  field: string;
  store: string;
  displayField?: string;
};

export type FieldTypeMapping = {
  [K in z.ZodFirstPartyTypeKind]?: {
    as?: string;
    inputType?: string;
    handler?: FieldHandler<any>;
  };
};

export type FieldHandler<T extends z.ZodType<any, any, any>> = (
  fieldSchema: T,
  field: DynamicFormFieldProps<z.ZodType<unknown, z.ZodTypeDef, unknown>>,
  context: FieldHandlerContext
) => void;

export type FieldHandlerContext = {
  key: string;
  options: CreateDynamicFormOptions;
  initialValues: Record<string, unknown>;
  metadata: SchemaWrapperInfo;
};

export type CreateDynamicFormOptions = {
  resourceFields?: ResourceFieldIndicator[];
  fieldsToIgnore?: string[];
  fieldTypeMapping?: Partial<FieldTypeMapping>;
};

export type SchemaWrapperInfo = {
  isNullable: boolean;
  isOptional: boolean;
  hasDefault: boolean;
  defaultValue?: unknown;
  isLazy: boolean;
  hasEffects: boolean;
};

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

// Helper function to format field labels
function formatFieldLabel(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase());
}

// Helper function to calculate empty values for nested objects
function calculateEmptyValue(schema: z.ZodObject<any, any, any>): Record<string, unknown> {
  const emptyValue: Record<string, unknown> = {};
  
  for (const itemKey in schema.shape) {
    const { metadata: itemMetadata } = unwrapSchemaWithMetadata(schema.shape[itemKey]);
    
    if (itemMetadata.hasDefault) {
      emptyValue[itemKey] = itemMetadata.defaultValue;
    } else {
      emptyValue[itemKey] = undefined;
    }
  }
  
  return emptyValue;
}

// Helper function to detect and configure resource fields
function configureResourceField(
  key: string,
  field: DynamicFormFieldProps<z.ZodType<unknown, z.ZodTypeDef, unknown>>,
  resourceFields: ResourceFieldIndicator[],
  initialValues: Record<string, unknown>,
  resourceKeyPattern: RegExp = /Id$/
): boolean {
  const resourceStoreKey = key.replace(resourceKeyPattern, '');
  const resourceField = resourceFields.find((item) => item.field === resourceStoreKey);
  
  if (resourceField) {
    console.log('Resource store key is in the resourceFields array:', resourceStoreKey);
    field.as = 'resource-finder';
    field.resourceStore = resourceField.store;
    field.displayField = resourceField.displayField || "id";
    return true;
  } else {
    initialValues[key] = crypto.randomUUID();
    return false;
  }
}

// Helper function to handle nested schema processing
function processNestedSchema(
  schema: z.ZodType<any, any, any>,
  options: CreateDynamicFormOptions,
  field: DynamicFormFieldProps<z.ZodType<unknown, z.ZodTypeDef, unknown>>
): void {
  const { coreSchema: resolveFieldSchema } = unwrapSchemaWithMetadata(schema);
  
  if (resolveFieldSchema instanceof z.ZodObject) {
    field.subfields = _createDynamicForm(resolveFieldSchema, options).sections;
    field.emptyValue = calculateEmptyValue(resolveFieldSchema);
  } else {
    field.subfields = [];
    field.emptyValue = undefined;
  }
}

// Field handler for ZodObject
const handleZodObject: FieldHandler<z.ZodObject<any, any, any>> = (fieldSchema, field, context) => {
  field.as = 'object';
  const fieldObject = _createDynamicForm(fieldSchema, context.options);
  field.subfields = fieldObject.sections;
  context.initialValues[context.key] = fieldObject.initialValues;
};

// Field handler for ZodArray
const handleZodArray: FieldHandler<z.ZodArray<any, any>> = (fieldSchema, field, context) => {
  field.as = 'array';
  
  processNestedSchema(fieldSchema.element, context.options, field);
  
  // Remove the final 's' from the label for arrays
  field.opts.label = field.opts.label.endsWith('s') ? field.opts.label.slice(0, -1) : field.opts.label;
  
  // Try to configure as resource field (for arrays, remove 's' suffix)
  configureResourceField(context.key, field, context.options.resourceFields || [], context.initialValues, /s$/);
};

// Field handler for ZodRecord
const handleZodRecord: FieldHandler<z.ZodRecord<any, any>> = (fieldSchema, field, context) => {
  field.as = 'record';
  processNestedSchema(fieldSchema.valueSchema, context.options, field);
};

// Field handler for ZodEnum
const handleZodEnum: FieldHandler<z.ZodEnum<any>> = (fieldSchema, field, context) => {
  field.as = 'select';
  field.selectOptions = createSelectOptionsFromEnum(fieldSchema);
};

// Field handler for ZodString
const handleZodString: FieldHandler<z.ZodString> = (fieldSchema, field, context) => {
  field.inputType = 'text';
  
  if (fieldSchema.isEmail) {
    field.inputType = 'email';
  } else if (fieldSchema.isURL) {
    field.inputType = 'url';
  } else if (fieldSchema.isDate) {
    field.as = 'calendar-date';
    field.inputType = 'calendar-date';
  } else if (fieldSchema.isUUID) {
    field.inputType = 'uuid';
    
    // Try to configure as resource field
    configureResourceField(context.key, field, context.options.resourceFields || [], context.initialValues);
  }
};

// Field handler for ZodBoolean
const handleZodBoolean: FieldHandler<z.ZodBoolean> = (fieldSchema, field, context) => {
  field.as = 'checkbox';
  field.inputType = 'checkbox';
};

// Field handler for ZodNumber
const handleZodNumber: FieldHandler<z.ZodNumber> = (fieldSchema, field, context) => {
  field.as = 'number';
  field.inputType = 'number';
};

// Field handler for ZodDate
const handleZodDate: FieldHandler<z.ZodDate> = (fieldSchema, field, context) => {
  field.as = 'date';
  field.inputType = 'date';
};

// Default field type mappings
const DEFAULT_FIELD_TYPE_MAPPING: FieldTypeMapping = {
  [z.ZodFirstPartyTypeKind.ZodObject]: { handler: handleZodObject },
  [z.ZodFirstPartyTypeKind.ZodArray]: { handler: handleZodArray },
  [z.ZodFirstPartyTypeKind.ZodRecord]: { handler: handleZodRecord },
  [z.ZodFirstPartyTypeKind.ZodEnum]: { handler: handleZodEnum },
  [z.ZodFirstPartyTypeKind.ZodString]: { handler: handleZodString },
  [z.ZodFirstPartyTypeKind.ZodBoolean]: { handler: handleZodBoolean },
  [z.ZodFirstPartyTypeKind.ZodNumber]: { handler: handleZodNumber },
  [z.ZodFirstPartyTypeKind.ZodDate]: { handler: handleZodDate },
};

// Main field processing function
function processField(
  key: string,
  fieldSchema: z.ZodType<any, any, any>,
  metadata: SchemaWrapperInfo,
  options: CreateDynamicFormOptions,
  initialValues: Record<string, unknown>
): DynamicFormFieldProps<z.ZodType<unknown, z.ZodTypeDef, unknown>> {
  const field: DynamicFormFieldProps<z.ZodType<unknown, z.ZodTypeDef, unknown>> = {
    as: 'input',
    description: fieldSchema.description ?? '',
    opts: {
      label: formatFieldLabel(key),
      validateOnValueUpdate: true,
      validateOnMount: false,
    },
    name: key,
    label: formatFieldLabel(key),
    subfields: [],
    displayField: 'id',
    rules: fieldSchema,
    inputType: 'text',
  };

  // Get field type mapping (merge user config with defaults)
  const fieldTypeMapping = {
    ...DEFAULT_FIELD_TYPE_MAPPING,
    ...options.fieldTypeMapping,
  };

  // Get the handler for this field type
  const typeKind = fieldSchema._def.typeName as z.ZodFirstPartyTypeKind;
  const mapping = fieldTypeMapping[typeKind];

  if (mapping) {
    // Apply base configuration from mapping
    if (mapping.as) field.as = mapping.as;
    if (mapping.inputType) field.inputType = mapping.inputType;

    // Apply custom handler if available
    if (mapping.handler) {
      const context: FieldHandlerContext = {
        key,
        options,
        initialValues,
        metadata,
      };
      mapping.handler(fieldSchema, field, context);
    }
  }

  return field;
}

function _createDynamicForm(
  schema: z.ZodObject<z.ZodRawShape, z.UnknownKeysParam, z.ZodTypeAny>,
  options: CreateDynamicFormOptions = {
    resourceFields: [],
    fieldsToIgnore: [],
  }
): FormSchema<z.ZodType<unknown, z.ZodTypeDef, unknown>> {
  const { resourceFields = [], fieldsToIgnore = [] } = options;
  const fields: DynamicFormFieldProps<z.ZodType<unknown, z.ZodTypeDef, unknown>>[] = [];
  const initialValues: Record<string, unknown> = {};

  for (const key in schema.shape) {
    const originalFieldSchema = schema.shape[key];
    if (!originalFieldSchema) {
      console.warn(`Field "${key}" has no schema defined. Skipping.`);
      continue;
    }

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

    // Special handling for ID/UUID fields
    if (key === 'id' || key === 'uuid') {
      initialValue = crypto.randomUUID();
    }

    initialValues[key] = initialValue;

    // Skip ignored fields
    if (fieldsToIgnore?.includes(key)) {
      if (initialValues[key] === null || initialValues[key] === undefined) {
        console.warn(`Removing initial value for ignored field "${key}".`);
        delete initialValues[key];
      }
      console.warn(`Field "${key}" is in the ignore list. Skipping.`);
      continue;
    }

    // Process the field using the new modular approach
    const field = processField(key, fieldSchema, metadata, options, initialValues);
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

// Helper function to create custom field handlers
export function createFieldHandler<T extends z.ZodType<any, any, any>>(
  handler: FieldHandler<T>
): FieldHandler<T> {
  return handler;
}

// Helper function to create custom field type mappings
export function createFieldTypeMapping(mapping: Partial<FieldTypeMapping>): Partial<FieldTypeMapping> {
  return mapping;
}

// Helper function to extend existing field type mappings
export function extendFieldTypeMapping(
  base: Partial<FieldTypeMapping>,
  extension: Partial<FieldTypeMapping>
): Partial<FieldTypeMapping> {
  return { ...base, ...extension };
}

// Export the default field type mapping for reference and extension
export const DEFAULT_FIELD_TYPE_MAPPING_EXPORT = DEFAULT_FIELD_TYPE_MAPPING;

// Export utility functions
export { formatFieldLabel, calculateEmptyValue, configureResourceField, processNestedSchema, unwrapSchemaWithMetadata };

