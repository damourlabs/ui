<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next';
import NavLink from '../common/NavLink.vue';


export interface FooterProps {
  credits: string;
  links: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}


defineProps<FooterProps>();

</script>

<template>


<footer class="bg-white dark:bg-gray-900 shadow-sm m-4 rounded-lg">
    <div class="mx-auto p-4 md:py-8 w-full max-w-screen-xl">
        <div class="sm:flex sm:justify-between sm:items-center">
            <NuxtLink to="/" class="flex items-center space-x-3 rtl:space-x-reverse mb-4 sm:mb-0">
                <span class="self-center font-semibold dark:text-white text-2xl whitespace-nowrap">Euro Clinical Trials</span>
            </NuxtLink>

            <ul class="flex flex-wrap items-center mb-6 sm:mb-0 font-medium text-gray-500 dark:text-gray-400 text-sm">
                <li class="mr-4 md:mr-6" v-for="link in links" :key="link.name">
                    <NuxtLink :to="link.url" class="flex items-center space-x-1 rtl:space-x-reverse hover:underline">
                        <component :is="link.icon" class="w-4 h-4" />
                        <span>{{ link.name }}</span>
                    </NuxtLink>
                </li>

            </ul>
        </div>
        <hr class="sm:mx-auto my-6 lg:my-8 border-gray-200 dark:border-gray-700" />
        <span class="block mb-4 text-gray-500 dark:text-gray-400 text-sm sm:text-center">
            {{ credits }}. All Rights Reserved.
        </span>
    </div>
</footer>


</template>
