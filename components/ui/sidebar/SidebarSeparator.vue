<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~ui/lib/utils'
import { Separator } from '~ui/components/ui/separator'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Separator
    data-slot="sidebar-separator"
    data-sidebar="separator"
    :class="cn('bg-sidebar-border mx-2 w-auto', props.class)"
  >
    <slot />
  </Separator>
</template>
