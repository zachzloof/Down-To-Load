import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppStore } from '../stores/appStore.js'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',        redirect: '/sorter' },
    { path: '/setup',   component: () => import('../views/Setup.vue') },
    { path: '/sorter',  component: () => import('../views/Sorter.vue') },
    { path: '/config',  component: () => import('../views/Config.vue') },
  ],
})

router.beforeEach(async (to) => {
  if (to.path === '/setup') return true
  const store = useAppStore()
  if (!store.config) await store.loadConfig()
  if (!store.config && to.path !== '/setup') return '/setup'
  return true
})

export default router
