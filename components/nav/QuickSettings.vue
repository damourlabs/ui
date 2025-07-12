<script lang="ts" setup>
import { useSidebar } from '../ui/sidebar';
const { isMobile } = useSidebar()
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <Popover>
        <PopoverTrigger as-child>
          <SidebarMenuButton size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <span>Quick Settings<div class="flex-1 grid text-sm text-left leading-tight">
            </div>
            </span>
          <Icon name="lucide:cog" size="1.5rem"/>
          </SidebarMenuButton>
        </PopoverTrigger>
        <PopoverContent class="rounded-lg w-[--reka-dropdown-menu-trigger-width] min-w-56"
        :side="isMobile ? 'bottom' : 'right'" align="end" :side-offset="4">
        </PopoverContent>
      </Popover>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
