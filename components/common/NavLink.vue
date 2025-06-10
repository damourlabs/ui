<template>
  <NuxtLink v-bind="props" :class="{
    'text-primary-500 hover:text-primary-600': isActive,
    'text-gray-700 hover:text-gray-900': !isActive,
    'flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200': true,
  }">
    <Button>
      <slot />
    </Button>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { NuxtLinkProps } from '#app';
import { Button } from '~ui/components/ui/button';
interface NavLinkProps extends NuxtLinkProps {
  isActive?: boolean;
}

const props = defineProps<NavLinkProps>();

</script>
