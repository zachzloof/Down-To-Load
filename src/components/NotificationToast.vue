<template>
  <div class="fixed bottom-4 right-4 flex flex-col gap-2 z-[100] pointer-events-none">
    <TransitionGroup
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-6 scale-95"
      enter-to-class="opacity-100 translate-x-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in absolute"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="n in notifications"
        :key="n.id"
        class="pointer-events-auto flex items-start gap-3 min-w-60 max-w-xs p-3.5 rounded-xl border shadow-2xl shadow-black/40"
        :class="n.type === 'error'
          ? 'bg-red-950/90 border-red-800/60'
          : 'bg-slate-800 border-slate-700'"
      >
        <div
          class="w-6 h-6 rounded-md flex-none flex items-center justify-center mt-0.5"
          :class="n.type === 'error' ? 'bg-red-500/20' : 'bg-emerald-500/20'"
        >
          <CheckCircle2 v-if="n.type !== 'error'" :size="13" class="text-emerald-400" />
          <XCircle v-else :size="13" class="text-red-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold leading-snug" :class="n.type === 'error' ? 'text-red-200' : 'text-slate-100'">
            {{ n.title }}
          </p>
          <p v-if="n.message" class="text-xs mt-0.5" :class="n.type === 'error' ? 'text-red-400' : 'text-slate-500'">
            {{ n.message }}
          </p>
        </div>
        <button
          @click="dismiss(n.id)"
          class="flex-none text-slate-600 hover:text-slate-400 transition-colors mt-0.5"
        >
          <X :size="13" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { CheckCircle2, XCircle, X } from 'lucide-vue-next'
import { useNotifications } from '../composables/useNotifications.js'

const { notifications, dismiss } = useNotifications()
</script>
