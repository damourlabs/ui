import tailwindcss from '@tailwindcss/vite'

import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    '@pinia/nuxt',
    "shadcn-nuxt",
    "nuxt-charts",
    '@nuxtjs/color-mode'
  ],
  alias: { '~ui': fileURLToPath(new URL('.', import.meta.url)) },
  css: ['~ui/assets/css/tailwind.css'],
  components: [
    { path: '~ui/components', prefix: 'Ui' },
  ],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: '~ui/components/ui'
  },
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode'
  }
})
