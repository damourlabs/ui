<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '~ui/lib/utils'
import { NuxtLink } from '#components';

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
  as: NuxtLink,
  asChild: false,
  class: undefined,
})
</script>

<template>
  <Primitive data-slot="breadcrumb-link" :as="as" :as-child="asChild"
    :class="cn('hover:text-foreground transition-colors', props.class)">
    <slot />
  </Primitive>
</template>
