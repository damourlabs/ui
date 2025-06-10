export default defineAppConfig({
  ui: {
    message: 'Hello from Nuxt layer'
  }
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    ui?: {
      /** Project name */
      message?: string
    }
  }
}
