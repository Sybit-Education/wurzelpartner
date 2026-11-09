import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'
// Routes
import AboutView from '../views/AboutView.vue'
import HomeView from '../views/HomeView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import TreeDetails from '../views/TreeDetails.vue'
import TreeOverviewView from '../views/TreeOverviewView.vue'
import AcessibilityView from '../views/AcessibilityView.vue'
import MapView from '../views/MapView.vue'
import PlantATreeView from '../views/PlantATreeView.vue'
import PartnerDetailView from '../views/PartnerDetailView.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '../views/SignUpView.vue'
import DonateTreeView from '../views/DonateTreeView.vue'
import DonateMoneyView from '../views/DonateMoneyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Home
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    // Trees
    {
      path: '/trees',
      name: 'Trees',
      component: TreeOverviewView,
    },
    // Tree details
    {
      path: '/tree/:id',
      name: 'Tree details',
      component: TreeDetails,
      props: true,
    },
    // About
    {
      path: '/about',
      name: 'About us',
      component: AboutView,
    },
    // Data-protection
    {
      path: '/privacy',
      name: 'Privacy',
      component: PrivacyPolicyView,
    },
    // Status about acessibility
    {
      path: '/accesibility',
      name: 'Acessibility',
      component: AcessibilityView,
    },
    // Map
    {
      path: '/map',
      name: 'Map',
      component: MapView,
    },
    // Create a tree
    {
      path: '/createtree',
      name: 'Create a tree',
      component: PlantATreeView,
    },
    // Partner details
    {
      path: '/partner/:id',
      name: 'Partner details',
      component: PartnerDetailView,
      props: true,
    },
    // Login
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: {
        hideLayout: true
      },
    },
    // Sign up
    {
      path: '/signup',
      name: 'Signup',
      component: SignUpView,
      meta: {
        hideLayout: true
      },
    },
    // Donate tree
    {
      path: '/spendenvonbaume',
      name: 'Donate tree',
      component: DonateTreeView,
    },
    // Donate money
    {
      path: '/donation',
      name: 'Donate money',
      component: DonateMoneyView,
    },
  ],
})

// Navigation Guard für geschützte Routen
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Wenn die Route keine Authentifizierung erfordert, weiter zur Route
  if (!requiresAuth) {
    return next()
  }

  // Prüfen, ob der Benutzer authentifiziert ist
  const isAuthenticated = authStore.isAuthenticated

  // Wenn nicht authentifiziert, zur Login-Seite umleiten
  if (!isAuthenticated) {
    // Token überprüfen und ggf. erneuern
    const tokenValid = await authStore.checkAndRefreshToken()

    if (!tokenValid) {
      return next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    }
  }

  // Benutzer ist authentifiziert, weiter zur Route
  next()
})

// Export router
export default router
