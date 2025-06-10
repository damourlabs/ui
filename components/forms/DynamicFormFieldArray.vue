<template>
  <Collapsible v-model:open="isOpen">



    <Card>
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

      <Separator class="my-4" />
      <CollapsibleContent class="space-y-2">
        <CardContent class="space-y-6">
          <Button type="button" variant="secondary" @click="addField">
            Add {{ opts.label }}
            <PlusIcon />
          </Button>
           <Button type="button" variant="secondary" @click="finding = true" v-if="resourceStore">
            Find {{ opts.label }}

            <Search />
          </Button>
          <Button type="button" variant="destructive" @click="clearAll">
            Clear All
            <CircleXIcon />
          </Button>

          <template v-if="resourceStore && finding">
            <ResourceFinder
              v-model="findingValue"
              :label="opts.label"
              :storeKey="resourceStore"
              :display-field="props.displayField || 'name'"
              :sub-text-field="props.subTextField"
              :search-fields="props.searchFields || ['name', 'title']"
              :allow-clear="true"
            />
          </template>
          <template v-if="fields.length === 0">
            <p class="text-muted-foreground">
              No fields defined for this array. Please add fields to the schema.
            </p>
          </template>

          <Tabs v-else class="w-full h-full" :model-value="currentFieldIndex" @update:model-value="onFieldChange">
            <TabsList class="gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-2 w-full h-full"
              :orientation="tabsOrientation" :class="`xl:grid-cols-${fields.length}`">
              <TabsTrigger v-for="(field, idx) in fields" :key="field.key" :value="field.key">
                {{ opts.label }} {{ idx + 1 }}
              </TabsTrigger>
            </TabsList>
            <TabsContent v-for="(field, idx) in fields" :key="field.key" :value="field.key">
              <fieldset>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {{ opts.label }} {{ idx + 1 }}
                    </CardTitle>
                    <CardAction>
                      <Button type="button" variant="destructive" @click="removeField(idx)">
                        Remove
                        <MinusIcon />
                      </button>
                    </CardAction>
                  </CardHeader>

                  <CardContent class="space-y-6">

                    <DynamicFormField v-for="(subfield, index) in subfields" :key="`${field.key}.${index}`"
                      v-bind="{ ...subfield, name: `${name}[${idx}].${subfield.name}` }" />

                  </CardContent>
                </Card>
              </fieldset>

            </TabsContent>

          </Tabs>
        </CardContent>
      </CollapsibleContent>
    </Card>
  </Collapsible>
</template>

<script setup lang="ts">
  import { useFieldArray, type RuleExpression } from 'vee-validate';
  import { BREAKPOINTS, type DynamicFormFieldProps, ResourceFinder } from '.';
  import { DynamicFormField } from '.';
  import { ChevronDown, ChevronUp, CircleXIcon, MinusIcon, PlusIcon, Search } from 'lucide-vue-next';
  import { Button } from '~ui/components/ui/button';
  import { Tabs } from '~ui/components/ui/tabs';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~ui/components/ui/collapsible';



  const props = defineProps<DynamicFormFieldProps<RuleExpression<unknown>>>();
  const { fields, push, remove } = useFieldArray(props.name)
  const currentFieldIndex = ref<number | string>(0)


  const onFieldChange = (value: number | string) => {
    if (typeof value === 'string') {
      value = parseInt(value, 10);
    }
    currentFieldIndex.value = value;
  };

  const lastField = computed<number | string>(() => {
    const idx = fields.value.find((field) => field.isLast);
    if (idx) {
      return idx.key;
    }
    return -1;
  });

  const addField = () => {
    push({})
    currentFieldIndex.value = lastField.value;
  };

  const removeField = (index: number) => {
    remove(index);
    currentFieldIndex.value = lastField.value;
  };

  const clearAll = () => {
    for (let i = fields.value.length - 1; i >= 0; i--) {
      remove(i);
    }

  };


  const { sm } = BREAKPOINTS;
  const tabsOrientation = computed(() => {
    return sm.value ? 'horizontal' : 'vertical';
  });


  const isOpen = ref(true)




const finding = ref(false);
const findingValue = ref<string | number | null>(null);
</script>
