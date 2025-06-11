<template>
  <Card class="group hover:shadow-lg p-6 transition-all">
    <CardHeader class="pb-4">
      <div class="flex items-start gap-4">
        <div 
          class="p-3 rounded-lg" 
          :class="iconBg">
          <component 
            :is="icon" 
            class="w-6 h-6" 
            :class="iconColor" />
        </div>
        <div class="flex-1">
          <CardTitle class="font-semibold text-gray-900 group-hover:text-blue-600 text-lg transition-colors">
            {{ title }}
          </CardTitle>
          <p class="mt-2 text-gray-600 text-sm leading-relaxed">
            {{ description }}
          </p>
        </div>
      </div>
    </CardHeader>
    <CardFooter class="pt-4">
      <UiCommonNavLink 
        :to="link" 
        variant="outline" 
        size="sm"
        class="justify-center group-hover:border-blue-600 w-full group-hover:text-blue-600 transition-colors">
        Learn More
        <ChevronRight class="ml-1 w-4 h-4" />
      </UiCommonNavLink>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { CardHeader, CardTitle, CardFooter } from '~ui/components/ui/card'
import { ChevronRight } from 'lucide-vue-next'

import type { Component } from 'vue'

interface Props {
  title: string
  description: string
  icon: Component
  link: string
}

defineProps<Props>()

const iconBg = 'bg-blue-50'
const iconColor = 'text-blue-600'
</script>
