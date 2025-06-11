<template>
  <Card class="hover:shadow-lg p-6 text-center transition-all">
    <CardContent class="space-y-3">
      <div class="flex justify-center">
        <component 
          :is="icon" 
          :class="iconColors[color]" 
          class="w-8 h-8" />
      </div>
      <div 
        class="font-bold text-3xl" 
        :class="textColors[color]">
        {{ value }}
      </div>
      <div class="text-gray-600 text-sm">
        {{ label }}
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { CardContent } from '~ui/components/ui/card'

import type { Component } from 'vue'

interface Props {
  value: number | string
  label: string
  icon: Component
  color: 'blue' | 'green' | 'purple' | 'teal' | 'red' | 'yellow'
}

defineProps<Props>()

const iconColors = {
  blue: 'text-blue-600',
  green: 'text-green-600', 
  purple: 'text-purple-600',
  teal: 'text-teal-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600'
}

const textColors = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600', 
  teal: 'text-teal-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600'
}
</script>
