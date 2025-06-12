<template>
  <DropdownMenu class="w-full">
    <DropdownMenuTrigger as-child>
      <FormControl>
        <Button variant="outline" role="combobox" :aria-expanded="isOpen" :class="cn(
          'w-full justify-between',
          !selectedResource && 'text-muted-foreground'
        )">

          {{ selectedResource ? getDisplayText(selectedResource) : `Select ${label.toLowerCase()}...` }}
          <ChevronsUpDown class="opacity-50 ml-2 w-4 h-4 shrink-0" />
        </Button>
      </FormControl>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {{ label }}
        </DropdownMenuLabel>
        <!-- <div>

          <Input v-model="searchQuery" placeholder="Search..." class="h-8" @input="onSearchInput" />
        </div> -->

        <DropdownMenuSeparator />

        <DropdownMenuItem v-for="resource in filteredResources" :key="resource.id"
          class="flex justify-between items-center hover:bg-accent p-2 text-sm hover:text-accent-foreground cursor-pointer"
          @click="selectResource(resource)">
          <div class="flex flex-col">
            <span class="font-medium">{{ getDisplayText(resource) }}</span>
            <span v-if="getSubText(resource)" class="text-muted-foreground text-xs">
              {{ getSubText(resource) }}
            </span>
          </div>
          <Check v-if="modelValue === resource.id" class="ml-2 w-4 h-4" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem v-if="modelValue && allowClear" @click="clearSelection">
          <X class="mr-2 w-4 h-4" />
          Clear selection
        </DropdownMenuItem>
      </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
  import { Check, ChevronsUpDown, X } from 'lucide-vue-next'
  import  type {  DynamicFormFieldProps } from '.';
  import { cn } from '~ui/lib/utils'
  import { storeToRefs, type StoreDefinition } from 'pinia'
  import { Button } from '~ui/components/ui/button'
  import { Input } from '~ui/components/ui/input'
  import { Popover, PopoverContent, PopoverTrigger } from '~ui/components/ui/popover'
  import { FormControl } from '~ui/components/ui/form'
import type { RuleExpression } from 'vee-validate';

  interface Entity {
    id: string | number
    [key: string]: any // Allow any additional properties
  }

  type ResourceFinderProps = DynamicFormFieldProps<RuleExpression<unknown>> & {
    modelValue: string | number | null
  }

  const props = withDefaults(defineProps<ResourceFinderProps>(), {
    label: 'Resource',
    displayField: 'name',
    subTextField: '',
    modelValue: null as string | number | null,
    searchFields: () => ['id','name', 'description'], // Default search fields
    allowClear: true
  })

  interface Emits {
    (e: 'update:modelValue', value: string | number | null): void
  }

  const emit = defineEmits<Emits>()

  // Reactive state
  const isOpen = ref(false)
  const searchQuery = ref('')


  // Get the store from the parent component
  console.log('Attempting to inject resource store:', props.resourceStore)

  const store = inject(props.resourceStore);

// if(!store) {
//     throw new Error(`Resource store "${props.storeKey}" not found. Ensure it is provided in the parent component.`)
// }

  // @ts-expect-error Assuming the store has these methods
const { fetchAll, fetchById } = store;

  // @ts-expect-error Assuming the store has these properties
  const { items, loading } = storeToRefs(store)

  // Computed properties - handle both reactive refs and plain value
  const selectedResourceData = ref<Entity | null>(null)

  const selectedResource = computed(() => selectedResourceData.value)

  // Watch for modelValue changes and fetch the resource
  watch(() => props.modelValue, async (newValue) => {
    if (!newValue) {
      selectedResourceData.value = null
      return
    }
    try {
      selectedResourceData.value = await fetchById(newValue) || null
    } catch (error) {
      console.error('Error fetching resource:', error)
      selectedResourceData.value = null
    }
  }, { immediate: true })

  const filteredResources = computed(() => {
    if (items.value === undefined) {
      console.warn(`Resource store "${props.resourceStore}" not found. Ensure it is provided in the parent component.`)
      return []
    }
    if (!searchQuery.value) return items.value

    const query = searchQuery.value.toLowerCase()
    return items.value.filter((item: Entity) => {
      return props.searchFields.some(field => {
        const value = getNestedValue(item, field)
        return value && value.toString().toLowerCase().includes(query)
      })
    })
  })

  // Helper functions
  const getNestedValue = (obj: any, path: string): any => {
    console.log('Getting nested value for path:', path, 'on object:', obj)
    const nestedValue = path.split('.').reduce((current, key) => current?.[key], obj)

    console.log('Nested value found:', nestedValue)
    return nestedValue
  }

  const getDisplayText = (resource: Entity): string => {
    return getNestedValue(resource, props.displayField) || 'Unknown'
  }

  const getSubText = (resource: Entity): string => {
    if (!props.subTextField) return ''
    return getNestedValue(resource, props.subTextField) || ''
  }

  // Event handlers
  const selectResource = (resource: Entity) => {
    emit('update:modelValue', resource.id)
    isOpen.value = false
    searchQuery.value = ''
  }

  const clearSelection = () => {
    emit('update:modelValue', null)
    isOpen.value = false
    searchQuery.value = ''
  }

  const onSearchInput = () => {
    // Debounce logic could be added here if needed
  }

  // Lifecycle
  onMounted(async () => {
    await fetchAll()
    if(store === undefined) {
      throw createError(`Resource store "${props.resourceStore}" not found. Ensure it is provided in the parent component.`)
    }
    // Fetch resources if not already loaded
    if (items.value !== undefined && !items.value.length && !loading.value) {
      await fetchAll()
    }
  })

</script>
