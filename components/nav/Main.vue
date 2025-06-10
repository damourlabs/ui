<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import type { NavigationSidebarItem } from './SideBar.vue';

defineProps<{
  items: NavigationSidebarItem[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible v-for="item in items" :key="item.title" as-child :default-open="item.isActive"
        class="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>

            <SidebarMenuButton :tooltip="item.title">
              <NuxtLink :to="item.url">
                <component :is="item.icon" v-if="item.icon"
                  class="group-data-[state=open]/collapsible:scale-[1.05] transition-transform duration-200" />
              </NuxtLink>
              <span>{{ item.title }}</span>
              <ChevronRight
                class="ml-auto group-data-[state=open]/collapsible:rotate-90 transition-transform duration-200" />
            </SidebarMenuButton>

          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                <SidebarMenuSubButton as-child>
                  <NuxtLink :to="subItem.url" :class="{ 'text-primary': subItem.isActive }">
                    <span>{{ subItem.title }}</span>
                  </NuxtLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
