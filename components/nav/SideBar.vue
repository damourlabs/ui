<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next';
import type { SidebarProps } from '../ui/sidebar';
import Main from '../nav/Main.vue';
import Links from '../nav/Links.vue';
import User from '../nav/User.vue';
import TopLevel from '../nav/TopLevel.vue';

export type NavigationSidebarProps = SidebarProps & {
  hasBreadcrumbs?: boolean;
  mainMenuUrl: string;
  items: Array<NavigationSidebarItem>;
  links: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
  user: {
    name: string;
    email: string;
    avatar: string;
  };
};

export type NavigationSidebarItem = {
  title: string;
  icon?: LucideIcon
  url: string;
  isActive?: boolean
  items: {
    title: string;
    url: string;
    isActive: boolean;
  }[];
}

const props = withDefaults(defineProps<NavigationSidebarProps>(), {
  collapsible: 'icon',

});



</script>

<template>

  <Sidebar v-bind="props">

    <SidebarHeader>
      <TopLevel :main-menu-url="mainMenuUrl" />
    </SidebarHeader>

    <SidebarContent>
      <Main :items="items" />
      <Links :links="links" />
    </SidebarContent>
    <SidebarFooter>
      <User :user="user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>

</template>
