<template>
  <div class="space-y-6">

    <form class="space-y-6 container" @reset="onFormReset" @submit="onFormSubmit">

    <Card>
      <CardHeader>
        <CardTitle>
          Form Actions
        </CardTitle>
        <CardDescription>
          Use the buttons below to reset, save, or submit the form. The form will auto-save every 30 seconds.
          <br >
          Last saved: {{ lastSaved.toLocaleTimeString() }}
        </CardDescription>
      </CardHeader>
      <CardContent class="flex sm:flex-row flex-col items-start sm:items-center gap-4">
        <Button type="reset" variant="destructive">
          Reset
        </Button>
        <Button type="button" variant="secondary" @click="saveDraft">
          Save
        </Button>
        <Button type="submit" variant="success">
          Submit
        </Button>
      </CardContent>
    </Card>




      <Card v-if="isSectionned">
        <CardHeader>
          <CardTitle>
            Form Sections
          </CardTitle>
          <CardDescription>
            This form is divided into multiple sections. Use the tabs below to navigate between them.
            <br>
            You can also see validation errors for each section.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">


          <Tabs class="gap-[3rem] w-full" :orientation="tabsOrientation" :model-value="currentTab"
            @update:model-value="onTabChange">

            <TabsList
              :class="`h-full p-2 gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-${schema.sections.length}`">


              <TabsTrigger v-for="section in schema.sections" :key="section.name" :value="section.name"
                class="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[150px] font-medium text-gray-700 text-sm transition-colors duration-200"
                :class="{
                  ' data-[state=active]:bg-red-200 data-[state=inactive]:bg-red-300': hasSectionErrors(section.name),

                }">

                <template v-if="isCurrentTab(section.name)">

                  <FolderOpenIcon class="mr-2 w-4 h-4" />
                </template>
                <template v-else>
                  <FolderIcon class="mr-2 w-4 h-4" />
                </template>

                <span>
                  {{ section.opts.label }}
                </span>

                <OctagonAlertIcon v-if="hasSectionErrors(section.name)" class="w-4 h-4 text-red-500" />
              </TabsTrigger>
            </TabsList>
            <TabsContent v-for="section in schema.sections" :key="section.name" :value="section.name">
              <DynamicFormField v-bind="section" />
            </TabsContent>

          </Tabs>




        </CardContent>
      </Card>
      <Card v-else>
        <CardHeader>
          <CardTitle>
            Form Fields
          </CardTitle>
          <CardDescription>
            This form has no sections. All fields are displayed below.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <DynamicFormField v-for="(field, index) in schema.sections" :key="index" v-bind="field" />
        </CardContent>
      </Card>

    </form>

    <Card>
      <CardHeader>
        <CardTitle>
          Form Preview
        </CardTitle>
        <CardDescription>
          This is a preview of the form structure. You can switch between sections using the tabs below.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <pre class="bg-gray-100 p-4 rounded-md">
      {{ JSON.stringify(form.values, null, 2) }}
    </pre>
      </CardContent>
    </Card>

  </div>
</template>

<script setup lang="ts">
import { BREAKPOINTS, type FormSchema } from '.';
import { useForm, type RuleExpression } from 'vee-validate';
import { Button } from '~ui/components/ui/button';
import DynamicFormField from './DynamicFormField.vue';
import { FolderIcon, FolderOpenIcon, OctagonAlertIcon } from 'lucide-vue-next'
import { useSessionStorage } from '@vueuse/core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~ui/components/ui/tabs';

const { schema, submitFn, sections } = defineProps<{
  schema: FormSchema<RuleExpression<unknown>>,
  sections?: boolean,
  submitFn: (values: Record<string, unknown>) => void;
}>();

const isSectionned = computed(() => {
  return sections;
});


const form = useForm({
  validationSchema: schema.schema,
  initialValues: schema.initialValues,
  validateOnMount: false,

  keepValuesOnUnmount: true,

});

const onFormSubmit = form.handleSubmit(submitFn);
const onFormReset = form.handleReset;


// const formRef = useTemplateRef<FormContext>('formRef');

// const formValues = computed(() => {
//   return formRef.value?.values || {};
// });

const formData = useState('trial-form-data', () => ({
  initialValues: schema.initialValues,
  values: schema.initialValues,
}));

const lastSaved = useState<Date>('formLastSaved', () => new Date(0));

const draftStorage = useSessionStorage<unknown>('draft-form-data', formData.value.initialValues, {
  listenToStorageChanges: true,
  deep: true,
});


watch(form.values, (newValues) => {
  // Update the formData state whenever formValues change
  formData.value.values = newValues;
}, { deep: true });


// Save draft
const saveDraft = () => {
  lastSaved.value.setTime(Date.now());
  // Use session storage to save the form data
  draftStorage.value = form.values.value;

}



// Auto-save every 30 seconds (optional)
onMounted(() => {
  const autoSaveInterval = setInterval(() => {
    saveDraft()
  }, 30000) // 30 seconds

  onUnmounted(() => {
    clearInterval(autoSaveInterval)
  })
})




const onTabChange = async (value: string | number) => {
  currentTab.value = value;
  // Save the current tab to session storage
  saveDraft();
};

const { sm } = BREAKPOINTS;

const currentTab = ref<string | number>(schema.sections[0].name);
const tabsOrientation = computed(() => {
  return sm.value ? 'horizontal' : 'vertical';
});

const isCurrentTab = (sectionName: string) => {
  return currentTab.value === sectionName;
};


const hasSectionErrors = (sectionName: string) => {
  return Object.keys(form.errors.value).some((key) => key.startsWith(sectionName));
};


</script>
