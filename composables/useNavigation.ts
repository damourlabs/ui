import type { NavigationSidebarProps } from "~ui/components/nav/SideBar.vue";

export const useNavigation = () => {
  const navigationConfig = useState<NavigationSidebarProps>('navigation-config', () => ({
    side: 'left',
    variant: 'sidebar',
    collapsible: 'offcanvas',
    class: '',
    mainMenuUrl: '',
    items: [],
    links: [],
    user: {
      name: '',
      email: '',
      avatar: ''
    }
  }))

  function updateNavigationConfig(newConfig: NavigationSidebarProps) {
    navigationConfig.value = newConfig;
  }

  return {
    navigationConfig: navigationConfig,
    updateNavigationConfig
  }
}
