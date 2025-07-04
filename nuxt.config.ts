
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
    "nuxt-charts"
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
  }
})
