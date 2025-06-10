<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Card :class="sizeClasses[size || 'sm']">
    <slot />
  </Card>
</template>

<script setup lang="ts">


defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}>();

const sizeClasses = {
  xs: 'col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2',
  sm: 'col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3',
  md: 'col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-4',
  lg: 'col-span-3 md:col-span-3 lg:col-span-4 xl:col-span-5',
  xl: 'col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6',
};
</script>
