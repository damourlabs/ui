<template>
  <Collapsible v-model:open="isOpen">
    <Card v-bind="props" class="w-full">
      <CardHeader class="flex justify-between items-center">
        <CardTitle>
          {{ opts.label }}
        </CardTitle>
        <CardDescription>
          {{ description }}
        </CardDescription>
        <CollapsibleTrigger>
          <Button variant="ghost">
            <ChevronUp v-if="isOpen" class="w-4 h-4" />
            <ChevronDown v-else class="w-4 h-4" />
            <span class="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </CardHeader>
      <CollapsibleContent class="space-y-2">
        <CardContent class="gap-4 space-y-6 grid grid-cols-1">
          <DynamicFormField v-for="(subfield, index) in subfields" :key="`${subfield.name}-${index}`"
            v-bind="{ ...subfield, name: `${name}.${subfield.name}` }" />
        </CardContent>

      </CollapsibleContent>
    </Card>
  </Collapsible>

</template>


<script setup lang="ts">
import { ChevronDown, ChevronUp } from 'lucide-vue-next';
import { DynamicFormField, type DynamicFormFieldProps } from '.';
import type { RuleExpression } from 'vee-validate';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '~ui/components/ui/collapsible';


const props = defineProps<DynamicFormFieldProps<RuleExpression<unknown>>>();


const isOpen = ref(true)

</script>
