<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const currentYear = new Date().getFullYear()

const menuGroups = computed(() => [
  {
    id: 'discover',
    title: 'Entdecken',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Baumarten', to: '/trees' },
      { label: 'Karte', to: '/map' },
    ],
  },
  {
    id: 'participate',
    title: 'Mitmachen',
    links: [
      { label: 'Spenden', to: '/donation' },
      { label: 'Baum pflanzen', to: '/createtree' },
    ],
  },
  {
    id: 'account',
    title: 'Mein Konto',
    links: authStore.isAuthenticated
      ? [
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Profil verwalten', to: '/profile' },
        ]
      : [
          { label: 'Anmelden', to: '/login' },
          { label: 'Registrieren', to: '/signup' },
        ],
  },
  {
    id: 'information',
    title: 'Informationen',
    links: [
      { label: 'Über uns', to: '/about' },
      { label: 'Kontakt', to: '/contact' },
      { label: 'Datenschutzerklärung', to: '/privacy' },
      { label: 'Barrierefreiheit', to: '/accesibility' },
    ],
  },
])

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <footer
    class="mega-footer mt-12 border-t border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="container mx-auto px-4 pb-6 pt-10 sm:pt-12">
      <div class="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] xl:gap-16">
        <div>
          <router-link to="/" class="footer-brand inline-flex items-center gap-3 rounded-sm">
            <img src="/img/WurzelPartner-Logo.svg" class="h-14 w-14 rounded-full bg-white" alt="" />
            <span class="text-xl font-semibold">Wurzelpartner</span>
          </router-link>
          <p class="mt-4 max-w-xs text-sm text-gray-600 dark:text-gray-300">
            Ein Projekt des BSZ Radolfzell.
          </p>
        </div>

        <nav
          aria-label="Footernavigation"
          class="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          <section
            v-for="group in menuGroups"
            :key="group.id"
            :aria-labelledby="`footer-${group.id}`"
          >
            <h2
              :id="`footer-${group.id}`"
              class="footer-heading mb-3 text-gray-900 dark:text-white"
            >
              {{ group.title }}
            </h2>
            <ul class="space-y-1">
              <li v-for="link in group.links" :key="link.to">
                <router-link :to="link.to" class="footer-link">{{ link.label }}</router-link>
              </li>
              <li v-if="group.id === 'account' && authStore.isAuthenticated">
                <button
                  type="button"
                  class="footer-link cursor-pointer text-left"
                  @click="handleLogout"
                >
                  Abmelden
                </button>
              </li>
            </ul>
          </section>
        </nav>
      </div>

      <div class="mt-10 border-t border-gray-300 pt-6 dark:border-gray-600">
        <p class="mb-0 text-sm text-gray-600 dark:text-gray-300">
          &copy; {{ currentYear }} Wurzelpartner made with ♥️ by BSZ Radolfzell. All rights
          reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.mega-footer {
  --footer-link-color: var(--color-gray-700);
  --footer-brand-color: var(--color-gray-900);
  --footer-accent-color: var(--color-brand-500);
}

.mega-footer:where(.dark *) {
  --footer-link-color: var(--color-gray-300);
  --footer-brand-color: var(--color-white);
  --footer-accent-color: var(--color-brand-800);
}

.footer-heading {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
}

.footer-brand {
  color: var(--footer-brand-color);
}

.footer-link {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  max-width: 100%;
  padding-block: 0.5rem;
  color: var(--footer-link-color);
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
  text-decoration: none;
  text-underline-offset: 0.25rem;
}

.footer-link:hover,
.footer-brand:hover {
  color: var(--footer-accent-color);
  text-decoration: underline;
}

.mega-footer :is(a, button):focus-visible {
  outline: 2px solid var(--footer-accent-color);
  outline-offset: 4px;
  border-radius: 2px;
}
</style>
