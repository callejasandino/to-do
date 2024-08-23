import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/auth/login/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/register/Register.vue')
  },
  {
    path: '/task',
    name: 'task',
    meta: { requiresAuth: true },
    component: () => import('../views/tasks/Tasks.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const token = Cookies.get('token') ?? null

  if (token === null) {
    // If there is no token and the route requires authentication, redirect to login
    if (to.meta.requiresAuth) {
      next({ name: 'login' })
    } else {
      // If the route does not require authentication, proceed as normal
      next()
    }
    return
  }

  const authStore = useAuthStore()

  try {
    await authStore.validateToken()
    const isValid = authStore.getIsValidated.valueOf()

    if (isValid !== true) {
      // If the token is not valid, remove the token and redirect to login
      Cookies.remove('token')
      next({ name: 'login' })
      return
    }

    // If the user is authenticated and tries to navigate to login, redirect to home
    if (to.name === 'login' || to.name === 'register') {
      next({ name: 'task' })
    } else {
      next()
    }
  } catch (error) {
    Cookies.remove('token')
    next({ name: 'login' })
  }
})

export default router
