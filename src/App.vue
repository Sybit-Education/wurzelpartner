<script setup lang="ts">
import FooterBar from './components/common/FooterBar.vue'
import TopNavigation from './components/common/TopNavigation.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const hideLayout = computed(() => route.meta.hideLayout === true)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-page-surface text-page-text">
    <header v-if="!hideLayout">
      <TopNavigation class="top-0 left-0 z-500 flex w-full" />
    </header>
    <main class="page-shell flex-1">
      <RouterView />
    </main>
    <footer v-if="!hideLayout" class="mt-section-gap bg-gray-100 py-section-gap dark:bg-gray-800">
      <FooterBar class="page-shell" />
    </footer>
  </div>
</template>
