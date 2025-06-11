<template>
  <section class="flex flex-col items-center gap-2 mx-auto py-8 md:py-12 lg:py-24 md:pb-8 lg:pb-20 max-w-[980px]">

    <h1 class="font-bold text-3xl md:text-6xl text-center leading-tight lg:leading-[1.1] tracking-tighter">
      <slot name="title"/>
    </h1>
    <span class="max-w-[750px] text-muted-foreground text-lg sm:text-xl text-center">
      <slot name="description"/>
    </span>

    <section class="flex justify-center items-center gap-4 py-4 md:pb-10 w-full">
      <NuxtLink
        v-for="(action, i) in actions"
        :key="i"
        :to="action.to"
      >
        <Button :variant="action.variant">
          <component v-if="action.leftIcon" :is="action.leftIcon" class="mr-1" />
          {{ action.name }}
          <component v-if="action.rightIcon" :is="action.rightIcon" class="ml-1" />
        </Button>
      </NuxtLink>
    </section>
  </section>
</template>

<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next';
import { Button } from '~ui/components/ui/button';

export interface HeroProps {
  announcement?: {
    to?: string;
    icon?: LucideIcon;
    title: string;
  };
  actions: {
    name: string;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost';
    to: string;
  }[];
}

defineProps<HeroProps>();
defineSlots();
</script>
