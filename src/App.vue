<script setup lang="ts">
import FooterBar from './components/common/FooterBar.vue'
import TopNavigation from './components/common/TopNavigation.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const hideLayout = computed(() => route.meta.hideLayout === true)
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
  >
    <header v-if="!hideLayout">
      <TopNavigation class="top-0 left-0 z-500 flex w-full" />
    </header>
    <main class="container mx-auto px-4 flex-1">
      <RouterView />
    </main>
    <FooterBar v-if="!hideLayout" />
  </div>
</template>
