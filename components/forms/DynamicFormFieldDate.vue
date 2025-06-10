<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { toDate } from 'reka-ui/date'
import { computed, h, ref } from 'vue'
import { cn } from '~ui/lib/utils'
import { Button } from '~ui/components/ui/button'
import { Calendar } from '~ui/components/ui/calendar'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~ui/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '~ui/components/ui/popover'
import {  type DynamicFormFieldProps } from '.';
 import { useField, type RuleExpression } from 'vee-validate';

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const { name } = defineProps<DynamicFormFieldProps<RuleExpression<unknown>>>()

const placeholder = ref()

const { setValue, value: fieldValue } = useField<string>(name)

const compValue = computed({
  get: () => fieldValue.value ? parseDate(fieldValue.value) : undefined,
  set: val => val,
})


</script>

<template>
      <Popover>
        <PopoverTrigger as-child>
          <FormControl>
            <Button variant="outline" :class="cn(
              'w-[240px] ps-3 text-start font-normal',
              !compValue && 'text-muted-foreground',
            )">
              <span>{{ compValue ? df.format(toDate(compValue)) : "Pick a date" }}</span>
              <CalendarIcon class="opacity-50 ms-auto w-4 h-4" />
            </Button>
            <input hidden>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent class="p-0 w-auto">
          <Calendar :placeholder="placeholder" :model-value="compValue" :calendar-label="opts.label" initial-focus
            :default-value="today(getLocalTimeZone())"
            :min-value="new CalendarDate(1900, 1, 1)" :max-value="new CalendarDate(2999,12,31)" @update:model-value="(v) => {
              if (v) {
                setValue(v.toString());
              }
              else {
                setValue('');
              }
            }" />
        </PopoverContent>
      </Popover>

</template>
