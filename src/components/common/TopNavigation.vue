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
  { to: '/TreeCare', label: 'Baumpflege' },
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
  <nav aria-label="Hauptnavigation" class="relative bg-page-surface">
    <div class="page-shell flex flex-wrap items-center gap-x-2 py-4 sm:gap-x-4">
      <RouterLink
        to="/"
        class="flex shrink-0 items-center gap-2 text-heading! no-underline sm:gap-3"
        @click="isMenuOpen = false"
      >
        <img src="/img/WurzelPartner-Logo.svg" class="h-8 w-8 sm:h-10 sm:w-10" alt="" />
        <span class="whitespace-nowrap text-lg font-semibold sm:text-xl">Wurzelpartner</span>
      </RouterLink>

      <div class="ml-auto flex items-center gap-2 xl:order-2">
        <ThemeToggle />
        <div class="hidden items-center gap-2 xl:flex">
          <template v-if="!authStore.isAuthenticated">
            <RouterLink
              to="/login"
              class="nav-action nav-action-primary px-4 py-2 text-sm font-medium"
              >Anmelden</RouterLink
            >
            <RouterLink
              to="/signup"
              class="nav-action nav-action-secondary px-4 py-2 text-sm font-medium"
              >Registrieren</RouterLink
            >
          </template>
          <template v-else>
            <span class="max-w-32 truncate text-sm text-heading">
              Hallo, {{ authStore.username }}
            </span>
            <button
              type="button"
              class="nav-action nav-action-danger px-4 py-2 text-sm font-medium"
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
        class="absolute top-full left-0 z-50 max-h-[calc(100dvh-100%)] w-full overflow-y-auto bg-page-surface px-page-gutter pb-4 shadow-lg xl:static xl:order-1 xl:flex xl:max-h-none xl:w-auto xl:overflow-visible xl:bg-transparent xl:p-0 xl:shadow-none"
      >
        <ul class="mt-4 flex flex-col gap-1 font-medium xl:mt-0 xl:flex-row xl:items-center">
          <li v-for="link in navigationLinks" :key="link.to">
            <RouterLink
              :to="link.to"
              class="block rounded-lg px-3 py-2 text-gray-700! hover:bg-gray-100 dark:text-gray-200! dark:hover:bg-gray-800"
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
                class="nav-action nav-action-primary block px-3 py-2 text-center"
                @click="isMenuOpen = false"
                >Anmelden</RouterLink
              >
            </li>
            <li class="xl:hidden">
              <RouterLink
                to="/signup"
                class="nav-action nav-action-secondary block px-3 py-2 text-center"
                @click="isMenuOpen = false"
                >Registrieren</RouterLink
              >
            </li>
          </template>
          <template v-else>
            <li class="mt-2 px-3 py-2 text-heading xl:hidden">Hallo, {{ authStore.username }}</li>
            <li class="xl:hidden">
              <RouterLink
                to="/dashboard"
                class="nav-action nav-action-primary block px-3 py-2 text-center"
                @click="isMenuOpen = false"
                >Zum Dashboard</RouterLink
              >
            </li>
            <li class="xl:hidden">
              <RouterLink
                to="/profile"
                class="nav-action nav-action-secondary block px-3 py-2 text-center"
                @click="isMenuOpen = false"
                >Profil verwalten</RouterLink
              >
            </li>
            <li class="xl:hidden">
              <button
                type="button"
                class="nav-action nav-action-danger w-full px-3 py-2"
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
