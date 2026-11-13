<script setup lang="ts">
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useAuthStore } from '@/stores/authStore'
import { FwbButton } from 'flowbite-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

// Theme
const linkEntryStyle =
  'flex py-2 px-3 text-brand-600 rounded-sm hover:bg-brand-900 border-0 xl:hover:text-brand-700 dark:text-white xl:dark:hover:text-green-500 dark:hover:bg-brand-100 dark:hover:text-white xl:dark:hover:bg-transparent'
</script>

<template>
  <!-- Header -->
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <!-- Header content -->
    <div class="mx-auto flex flex-wrap items-center justify-between p-4">
      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-3 mr-5">
        <img src="/img/WurzelPartner-Logo.svg" class="h-15" alt="Flowbite Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          Wurzelpartner
        </span>
      </router-link>
      <!-- Right  -->
      <div class="flex items-center ml-auto xl:order-2">
        <!-- Theme Toggle -->
        <ThemeToggle class="mr-2" />
        <div class="hidden xl:flex xl:space-x-2">
          <!-- Only if not logged in -->
          <template v-if="!authStore.isAuthenticated">
            <!-- Login -->
            <fwb-button
              color="green"
              size="md"
              href="/login"
              class="px-5 py-2.5 h-10 inline-flex items-center justify-center bg-brand-600 hover:bg-brand-700"
            >
              <span class="text-white">Anmelden</span>
            </fwb-button>
            <!-- Register -->
            <fwb-button
              color="alternative"
              size="md"
              class="px-5 py-2.5 h-10 inline-flex items-center justify-center"
              href="/signup"
            >
              Registrieren
            </fwb-button>
          </template>
          <template v-else>
            <!--
            <div class="relative" @mouseenter="openProfileMenu" ref="profileMenuRef">
              <button
                @click="toggleProfileMenu"
                class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand-600 text-sm font-semibold text-white shadow-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  :alt="`Avatar für ${authStore.username}`"
                  class="h-full w-full object-cover"
                />
                <span v-else>{{ userInitial }}</span>
              </button>
              <div
                v-if="isProfileMenuOpen"
                class="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div class="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Angemeldet als</p>
                  <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {{ authStore.username }}
                  </p>
                </div>

                <button
                @click="goToDashboard"
                  class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Dashboard
                </button>
                <button
                  @click="goToProfile"
                  class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Profil
                </button>

                <button
                  @click="handleLogout"
                  class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/40"
                >
                  Abmelden
                </button>
              </div>
            </div>
            -->
          </template>
        </div>
        <!-- Burger menu trigger -->
        <button
          @click="toggleMenu"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <svg
            class="w-5 h-5"
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
        :class="{ hidden: !isMenuOpen }"
        class="w-full xl:flex xl:w-auto xl:order-1"
        id="navbar-default"
      >
        <ul
          class="font-medium flex flex-col xl:p-05 mt-4 ml-4 xl:flex-row xl:space-x-2 rtl:space-x-reverse xl:mt-1"
        >
          <!-- Home -->
          <li>
            <router-link to="/" :class="linkEntryStyle"> Home </router-link>
          </li>
          <!-- Trees -->
          <li>
            <router-link to="/trees" :class="linkEntryStyle"> Baumarten </router-link>
          </li>
          <!-- Map -->
          <li>
            <router-link to="/map" :class="linkEntryStyle"> Karte </router-link>
          </li>
          <!-- About -->
          <li>
            <router-link to="/about" :class="linkEntryStyle"> Über uns </router-link>
          </li>
          <!-- Privacy -->
          <li>
            <router-link to="/privacy" :class="linkEntryStyle"> Datenschutzerklärung </router-link>
          </li>
          <!-- Donation -->
          <li>
            <router-link to="/donation" :class="linkEntryStyle"> Spenden </router-link>
          </li>
          <!-- Accesibility -->
          <li>
            <router-link to="/accesibility" :class="linkEntryStyle"> Barrierefreiheit </router-link>
          </li>
          <template v-if="!authStore.isAuthenticated">
            <li class="xl:hidden mt-4">
              <!-- Login -->
              <router-link
                to="/login"
                class="block w-full text-center py-2 px-3 text-white bg-brand-600 rounded-lg hover:bg-brand-700"
              >
                Anmelden
              </router-link>

              <!-- Register -->
              <router-link
                to="/signup"
                class="block w-full text-center py-2 px-3 text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Registrieren
              </router-link>
            </li>
            <li class="xl:hidden mt-2"></li>
          </template>
          <template v-else>
            <li class="xl:hidden mt-4">
              <span class="block w-full text-center py-2 px-3 text-gray-900 dark:text-white">
                Hallo, {{ authStore.username }}
              </span>
            </li>
            <li class="xl:hidden mt-2">
              <router-link
                to="/dashboard"
                class="block w-full text-center py-2 px-3 text-white bg-brand-600 rounded-lg hover:bg-brand-700"
              >
                Zum Dashboard
              </router-link>
            </li>
            <li class="xl:hidden mt-2">
              <router-link
                to="/profile"
                class="block w-full text-center py-2 px-3 text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Profil verwalten
              </router-link>
            </li>
            <!-- Logout -->
            <li class="xl:hidden mt-2">
              <button
                @click="handleLogout"
                class="block w-full text-center py-2 px-3 text-white bg-red-600 rounded-lg hover:bg-red-700"
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
