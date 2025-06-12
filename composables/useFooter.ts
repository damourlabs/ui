import type { FooterProps } from "~ui/components/nav/Footer.vue";

export const useFooter = () => {
  const footerConfig = useState<FooterProps>('footer-config', () => ({

  }))

  function updateFooterConfig(newConfig: FooterProps) {
    console.log('Updating footer config:', newConfig);
    footerConfig.value = newConfig;
  }

  return {
    footerConfig: footerConfig,
    updateFooterConfig
  }
}
