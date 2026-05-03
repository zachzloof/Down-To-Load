<template>
  <div class="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
    <!-- Nav -->
    <header
      v-if="showNav"
      class="flex-none flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm z-10"
    >
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
          <ArrowDownToLine :size="15" class="text-white" />
        </div>
        <span class="font-bold text-base tracking-tight">Down-To-Load</span>
      </div>

      <nav class="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
          :class="$route.path === link.to
            ? 'bg-slate-700 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200'"
        >
          {{ link.label }}
        </router-link>
      </nav>
    </header>

    <main class="flex-1 overflow-hidden">
      <router-view />
    </main>

    <NotificationToast />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowDownToLine } from 'lucide-vue-next'
import NotificationToast from './components/NotificationToast.vue'

const route = useRoute()
const showNav = computed(() => route.path !== '/setup')
const navLinks = [
  { to: '/sorter', label: 'Sorter' },
  { to: '/config', label: 'Config' },
]
</script>
