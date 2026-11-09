import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'
// Routes
import AboutView from '../views/AboutView.vue'
import AcessibilityView from '../views/AcessibilityView.vue'
import DonateMoneyView from '../views/DonateMoneyView.vue'
import DonateTreeView from '../views/DonateTreeView.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import MapView from '../views/MapView.vue'
import PartnerDetailView from '../views/PartnerDetailView.vue'
import PlantATreeView from '../views/PlantATreeView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import SignUpView from '../views/SignUpView.vue'
import TreeDetails from '../views/TreeDetails.vue'
import TreeOverviewView from '../views/TreeOverviewView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Home
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // Trees
    {
      path: '/trees',
      name: 'trees',
      component: TreeOverviewView,
    },
    // Tree details
    {
      path: '/tree/:id',
      name: 'tree-details',
      component: TreeDetails,
      props: true,
    },
    // About
    {
      path: '/about',
      name: 'about-us',
      component: AboutView,
    },
    // Data-protection
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyPolicyView,
    },
    // Status about acessibility
    {
      path: '/accesibility',
      name: 'acessibility',
      component: AcessibilityView,
    },
    // Map
    {
      path: '/map',
      name: 'map',
      component: MapView,
    },
    // Create a tree
    {
      path: '/createtree',
      name: 'create-a-tree',
      component: PlantATreeView,
    },
    // Partner details
    {
      path: '/partner/:id',
      name: 'partner-details',
      component: PartnerDetailView,
      props: true,
    },
    // Login
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        hideLayout: true,
      },
    },
    // Sign up
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
      meta: {
        hideLayout: true,
      },
    },
    // Donate tree
    {
      path: '/spendenvonbaume',
      name: 'donate-tree',
      component: DonateTreeView,
    },
    // Donate money
    {
      path: '/donation',
      name: 'donate-money',
      component: DonateMoneyView,
    },
  ],
})

// Navigation Guard für geschützte Routen
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Route erfordert keine Authentifizierung -> weiter
  if (!requiresAuth) {
    return true
  }

  // Bereits authentifiziert -> weiter
  if (authStore.isAuthenticated) {
    return true
  }

  // Token prüfen und ggf. erneuern
  const tokenValid = await authStore.checkAndRefreshToken()

  if (!tokenValid) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  return true
})

// Export router
export default router
