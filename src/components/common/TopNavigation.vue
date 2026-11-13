<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const isMenuOpen = shallowRef(false)

const navigationLinks = [
  { to: '/', label: 'Home' },
  { to: '/trees', label: 'Baumarten' },
  { to: '/map', label: 'Karte' },
  { to: '/about', label: 'Über uns' },
  { to: '/privacy', label: 'Datenschutzerklärung' },
  { to: '/spendenvonbaume', label: 'Spenden von Bäumen' },
]

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  },
)

function handleLogout() {
  isMenuOpen.value = false
  authStore.logout()
  void router.push('/login')
}
</script>

<template>
  <nav aria-label="Hauptnavigation" class="relative bg-white dark:bg-gray-900">
    <div class="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center gap-x-4 px-4 py-4">
      <RouterLink
        to="/"
        class="flex shrink-0 items-center gap-3 !text-gray-900 no-underline dark:!text-white"
        @click="isMenuOpen = false"
      >
        <img src="/img/WurzelPartner-Logo.svg" class="h-10 w-10" alt="" />
        <span class="whitespace-nowrap text-xl font-semibold">Wurzelpartner</span>
      </RouterLink>

      <div class="ml-auto flex items-center gap-2 xl:order-2">
        <ThemeToggle />
        <div class="hidden items-center gap-2 xl:flex">
          <template v-if="!authStore.isAuthenticated">
            <RouterLink
              to="/login"
              class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium !text-white hover:bg-brand-400"
              >Anmelden</RouterLink
            >
            <RouterLink
              to="/signup"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium !text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:!text-white dark:hover:bg-gray-800"
              >Registrieren</RouterLink
            >
          </template>
          <template v-else>
            <span class="max-w-32 truncate text-sm text-gray-900 dark:text-white">
              Hallo, {{ authStore.username }}
            </span>
            <button
              type="button"
              class="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
              @click="handleLogout"
            >
              Abmelden
            </button>
          </template>
        </div>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-700 xl:hidden"
          aria-controls="navbar-default"
          :aria-expanded="isMenuOpen"
          :aria-label="isMenuOpen ? 'Menü schließen' : 'Menü öffnen'"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg
            class="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>

      <div
        id="navbar-default"
        :class="{ hidden: !isMenuOpen }"
        class="absolute top-full left-0 z-50 max-h-[calc(100dvh_-_100%)] w-full overflow-y-auto bg-white px-4 pb-4 shadow-lg dark:bg-gray-900 xl:static xl:order-1 xl:flex xl:max-h-none xl:w-auto xl:overflow-visible xl:bg-transparent xl:p-0 xl:shadow-none xl:dark:bg-transparent"
      >
        <ul class="mt-4 flex flex-col gap-1 font-medium xl:mt-0 xl:flex-row xl:items-center">
          <li v-for="link in navigationLinks" :key="link.to">
            <RouterLink
              :to="link.to"
              class="block rounded-lg px-3 py-2 !text-gray-700 hover:bg-gray-100 dark:!text-gray-200 dark:hover:bg-gray-800"
              @click="isMenuOpen = false"
            >
              <template #default="{ isExactActive }">
                <span :class="isExactActive ? 'text-brand-500 dark:text-green-400' : ''">
                  {{ link.label }}
                </span>
              </template>
            </RouterLink>
          </li>
          <template v-if="!authStore.isAuthenticated">
            <li class="mt-2 xl:hidden">
              <RouterLink
                to="/login"
                class="block rounded-lg bg-brand-500 px-3 py-2 text-center !text-white hover:bg-brand-400"
                @click="isMenuOpen = false"
                >Anmelden</RouterLink
              >
            </li>
            <li class="xl:hidden">
              <RouterLink
                to="/signup"
                class="block rounded-lg border border-gray-300 px-3 py-2 text-center !text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:!text-white dark:hover:bg-gray-800"
                @click="isMenuOpen = false"
                >Registrieren</RouterLink
              >
            </li>
          </template>
          <template v-else>
            <li class="mt-2 px-3 py-2 text-gray-900 dark:text-white xl:hidden">
              Hallo, {{ authStore.username }}
            </li>
            <li class="xl:hidden">
              <button
                type="button"
                class="w-full rounded-lg bg-red-700 px-3 py-2 text-white hover:bg-red-800"
                @click="handleLogout"
              >
                Abmelden
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>
