import { useBreakpoints } from "@vueuse/core";

import type { FieldOptions } from 'vee-validate'

export { default as DynamicFormFieldDate } from './DynamicFormFieldDate.vue';
export { default as DynamicFormFieldNested } from './DynamicFormFieldNested.vue';
export { default as DynamicFormFieldArray } from './DynamicFormFieldArray.vue';
export { default as DynamicFormField } from './DynamicFormField.vue';
export { default as DynamicForm } from './DynamicForm.vue';
export { default as ResourceFinder } from './ResourceFinder.vue';
// This file exports components related to dynamic forms in the UI library.

// Create a tabs orientation context
export const BREAKPOINTS = useBreakpoints({
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
});


export type FormSchema<TRules> = {
  schema: TRules; // Array of form fields
  sections: DynamicFormFieldProps<TRules>[];
  initialValues: Record<string, unknown>; // Initial values for the form fields
};

export interface DynamicFormFieldProps<TRules> {
  as: string; // e.g., 'input', 'select', etc.
  description: string;
  emptyValue?: Record<string | number | symbol, unknown>; // Default value when the field is empty
  name: string;
  rules: TRules;
  label: string; // Label for the field
  storeKey?: string; // Optional key for storing the field value in a Pinia store
  inputType?: string; // e.g., 'text', 'email', etc.
  subfields: Array<DynamicFormFieldProps<TRules>>; // For nested fields
  selectOptions?: Array<{
    tag: string; // e.g., 'option'
    value: string; // e.g., 'option1'
    label: string; // e.g., 'Option 1'
  }>; // For select options
  min?: number; // Minimum value for numeric fields
  max?: number; // Maximum value for numeric fields
  step?: number; // Step value for numeric fields, e.g., '0.01' for decimal inputs
  props?: Record<string, unknown>; // Additional properties for the field
  opts: FieldOptionsWithLabel; // VeeValidate field options
  // Resource finder specific properties
  resourceStore?: any; // Pinia store for fetching resources
  displayField?: string; // Field to display in the resource finder
  subTextField?: string; // Secondary field to display
  searchFields?: string[]; // Fields to search in
  allowClear?: boolean; // Allow clearing the selection

}

interface FieldOptionsWithLabel extends FieldOptions {
  label: string; // Label for the field
}
