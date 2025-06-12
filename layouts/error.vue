<script setup lang="ts">
import { AlertTriangle, Home, RefreshCcw } from 'lucide-vue-next'
import { Button } from '~ui/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~ui/components/ui/card'

interface ErrorLayoutProps {
  error?: {
    statusCode?: number
    statusMessage?: string
    message?: string
    stack?: string
  }
}

const props = withDefaults(defineProps<ErrorLayoutProps>(), {
  error: () => ({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    message: 'An unexpected error occurred'
  })
})

// Error handling actions
const goHome = () => {
  navigateTo('/')
}

const { back } = useRouter()
const { } = useRoute()

const retry = () => {
  // Reload the current page
  reloadNuxtApp()
}


const goBack = () => {
  back()
}


const errorTitle = computed(() => {
  const code = props.error?.statusCode || 500
  if (code === 404) return 'Page Not Found'
  if (code === 403) return 'Access Forbidden'
  if (code === 401) return 'Unauthorized'
  if (code >= 500) return 'Server Error'
  return 'Something went wrong'
})

const errorDescription = computed(() => {
  const code = props.error?.statusCode || 500
  if (code === 404) return 'The page you are looking for does not exist or has been moved.'
  if (code === 403) return 'You do not have permission to access this resource.'
  if (code === 401) return 'Please log in to access this page.'
  if (code >= 500) return 'We are experiencing technical difficulties. Please try again later.'
  return props.error?.message || 'An unexpected error occurred. Please try again.'
})
</script>

<template>
  <div class="flex justify-center items-center bg-background p-4 min-h-screen">
    <div class="w-full max-w-md">

      <Card class="border-destructive/20">
        <CardHeader class="pb-4 text-center">
          <div class="flex justify-center items-center bg-destructive/10 mx-auto mb-4 rounded-full w-16 h-16">
            <AlertTriangle class="w-8 h-8 text-destructive" />
          </div>

          <CardTitle class="font-bold text-destructive text-2xl">
            {{ errorTitle }}
          </CardTitle>

          <div class="mb-2 font-bold text-muted-foreground/30 text-6xl">
            {{ error?.statusCode || 500 }}
          </div>
        </CardHeader>

        <CardContent class="space-y-6">
          <CardDescription class="text-base text-center leading-relaxed">
            {{ errorDescription }}
          </CardDescription>

          <!-- Error details (only in development or for certain error types) -->
          <div v-if="error?.message && error.message !== errorDescription" class="bg-muted p-3 rounded-md">
            <p class="font-mono text-muted-foreground text-sm">
              {{ error.message }}
            </p>
          </div>

          <!-- Action buttons -->
          <div class="flex sm:flex-row flex-col gap-3">
            <Button @click="goHome" class="flex-1" variant="default">
              <Home class="mr-2 w-4 h-4" />
              Go Home
            </Button>

            <Button @click="retry" class="flex-1" variant="outline">
              <RefreshCcw class="mr-2 w-4 h-4" />
              Try Again
            </Button>
          </div>

          <div class="text-center">
            <Button @click="goBack" variant="ghost" size="sm" class="text-muted-foreground">
              ← Go Back
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Additional help text -->
      <div class="mt-6 text-muted-foreground text-sm text-center">
        <p>
          If this problem persists, please
          <a href="mailto:support@damourlabs.com" class="text-primary hover:underline">
            contact support
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styling if needed */
.error-container {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%);
}
</style>
