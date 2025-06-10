<template>

  <template v-if="isAsOfType(as, 'array')">
    <DynamicFormFieldArray v-bind="props" />
  </template>

  <template v-else-if="isAsOfType(as, 'object')">
    <DynamicFormFieldNested v-bind="props" />
  </template>

  <FormItem v-else>

    <FormLabel>
      {{ opts.label }}
    </FormLabel>



    <!-- Handle select type -->
    <template v-if="isSelect(as)">
      <Select v-model="value">
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </FormControl>

        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="option in selectOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </template>

    <template v-else-if="isAsOfType(as, 'checkbox')">
      <FormItem class="flex flex-row justify-start items-center gap-x-3 space-y-0 shadow p-4 border rounded-md">
        <FormControl>
          <Checkbox :model-value="checked" @update:model-value="handleChange" />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel>{{ opts.label }}</FormLabel>
          <FormDescription>
            {{ description }}
          </FormDescription>
          <FormMessage />
        </div>
      </FormItem>
    </template>

    <!-- Handle Section -->
    <template v-else-if="isSection(as)">
      <FormItem>
        <Card :key="name" :class="{
          'col-span-4': hasArrayFields(subfields ? subfields : []),
          'col-span-1': !hasArrayFields(subfields ? subfields : []),
        }">

          <CardHeader class="min-h-[8rem]">
            <CardTitle>
              {{ opts.label }}
            </CardTitle>
            <CardDescription>
              {{ description }}
            </CardDescription>
          </CardHeader>

          <Separator class="my-4" />

          <CardContent class="space-y-6">
            <FormControl>

              <DynamicFormField v-for="(subfield) in subfields" :key="subfield.name"
                v-bind="{ ...subfield, name: `${name}.${subfield.name}` }" />
            </FormControl>
          </CardContent>

        </Card>
      </FormItem>
    </template>


    <!-- Handle number field -->
    <template v-else-if="isAsOfType(as, 'number')">
      <FormControl>
        <NumberField class="max-w-[10rem]" :model-value="value" :min="min" :max="max" :step="step" @update:model-value="(v) => {
          if (v) {
            setValue(v);
          }
          else {
            setValue(null);
          }
        }">
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </FormControl>
    </template>

    <!-- Handle range type -->
    <!-- <template v-else-if="isAsOfType(as, 'range')">
          <FormControl>
            <Slider :model-value="componentField.modelValue" :min="min" :max="max" :step="step"
              :name="componentField.name" @update:model-value="componentField['onUpdate:modelValue']" />
          </FormControl>
        </template> -->

    <!-- Handle date type -->
    <template v-else-if="isAsOfType(as, 'calendar-date')">
      <DynamicFormFieldDate v-bind="props"/>
    </template>

    <!-- Handle resource finder type -->
    <template v-else-if="isResourceFinder(as)">
      <ResourceFinder
        v-model="value"
        v-bind="props"
      />
    </template>

    <!-- Handle input type -->
    <template v-else-if="isInput(as)">
      <FormControl>
        <Input v-model="value" :type="inputType" />
      </FormControl>
    </template>

    <!-- Handle other types -->
    <template v-else>
      <span>
        Something else
      </span>

    </template>

    <FormDescription>
      {{ description }}
    </FormDescription>

    <FormMessage :name="name" />

  </FormItem>
</template>

<script setup lang="ts">
  import { useField, type RuleExpression } from 'vee-validate';
  import { DynamicFormFieldArray, DynamicFormFieldNested, DynamicFormFieldDate, ResourceFinder, type DynamicFormFieldProps } from '.';
  import { FormItem, FormControl, FormLabel, FormMessage } from '~ui/components/ui/form'
  import { Checkbox } from '~ui/components/ui/checkbox'
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '~ui/components/ui/select'
  import { isAsOfType, isSelect, isInput, isSection, hasArrayFields, isResourceFinder } from '~ui/utils/form';
  import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '../ui/number-field';
  import { DateFormatter } from '@internationalized/date'

  import type { AcceptableValue } from 'reka-ui';
  const props = defineProps<DynamicFormFieldProps<RuleExpression<unknown>>>();

  const { value, handleChange, setValue, checked } = useField<AcceptableValue | AcceptableValue[]>(props.name)

  const selectOptions = computed(() => {
    return props.selectOptions?.filter(child => isAsOfType(child.tag, 'select-option')) || [];
  });


</script>
