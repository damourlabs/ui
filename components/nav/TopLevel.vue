<script lang="ts" setup>

import { GalleryVerticalEnd } from 'lucide-vue-next';

defineProps<{
  mainMenuUrl: string;
}>();

</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" as-child>
        <NuxtLink :to="mainMenuUrl" class="flex items-center gap-2 w-full h-full">
          <div
            class="flex justify-center items-center bg-sidebar-primary rounded-lg size-8 aspect-square text-sidebar-primary-foreground">
            <GalleryVerticalEnd class="size-4" />
          </div>
          <div class="flex flex-col gap-0.5 leading-none">
            <span class="font-semibold">Euro Clinical Trials</span>
          </div>
        </NuxtLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
