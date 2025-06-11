<script setup lang="ts">

import SideBar, { type NavigationSidebarProps } from "~ui/components/nav/SideBar.vue"
import Footer, { type FooterProps } from "~ui/components/nav/Footer.vue"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '~ui/components/ui/breadcrumb';

interface LayoutProps {
  footerConfig: FooterProps;
}

defineProps<LayoutProps>();

const { navigationConfig } = useNavigation();


const route = useRoute();
watch(() => route.path, () => {
  // Logic to update sidebar based on the current route
  // For example, you might want to fetch new sidebar items based on the route
  // dashboardSidebarProps.value.items = fetchSidebarItems(newPath);
});

const breadCrumbs = computed(() => {
  // Logic to generate breadcrumbs based on the current route
  // Get the current route and generate breadcrumbs accordingly
  const pathSegments = route.path.split('/').filter((segment: string) => segment);

  return pathSegments.map((segment: string, index: number) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1), // Capitalize the first letter
      href: href,
    };
  });
});
const defaultOpen = useCookie<boolean>("sidebar_state");

</script>

<template>
  <div>
    <SidebarProvider :default-open="defaultOpen">

      <SideBar v-bind="navigationConfig" />

      <SidebarInset>
        <header
          class="flex items-center gap-2 h-16 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 transition-[width,height] ease-linear shrink-0" v-if="navigationConfig.hasBreadcrumbs">
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
            <Separator orientation="vertical" class="mr-2 h-4" />
            <Breadcrumb class="flex-1">
              <BreadcrumbList>
                <BreadcrumbItem v-for="(crumb, index) in breadCrumbs" :key="index">
                  <BreadcrumbLink :href="crumb.href" class="font-medium text-sm">
                    {{ crumb.label }}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div class="flex flex-col flex-1 gap-4 pt-0 h-full min-h-svh">
          <slot />
        </div>
        <!-- Footer -->
        <Footer v-bind="footerConfig"/>

      </SidebarInset>
    </SidebarProvider>


  </div>
</template>
