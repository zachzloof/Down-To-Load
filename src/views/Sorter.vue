<template>
  <div class="h-full flex flex-col overflow-hidden">

    <!-- Filter bar -->
    <div class="flex-none px-6 pt-4 pb-3 border-b border-slate-800">
      <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        <button
          v-for="f in filters"
          :key="f.key"
          @click="activeFilter = f.key"
          class="flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap border"
          :style="activeFilter === f.key
            ? { background: f.color + '20', color: f.color, borderColor: f.color + '50' }
            : { borderColor: 'transparent' }"
          :class="activeFilter === f.key ? '' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'"
        >
          {{ f.label }}
          <span
            class="text-xs px-1.5 py-0.5 rounded-full font-semibold"
            :style="activeFilter === f.key ? { background: f.color + '30' } : {}"
            :class="activeFilter === f.key ? '' : 'bg-slate-800 text-slate-600'"
          >{{ f.count }}</span>
        </button>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex-none flex items-center justify-between px-6 py-2.5">
      <p class="text-sm text-slate-600">
        <span class="text-slate-300 font-medium">{{ filteredFiles.length }}</span> files
        <span v-if="selection.size" class="ml-3 text-violet-400 font-medium">{{ selection.size }} selected</span>
      </p>
      <div class="flex items-center gap-1">
        <button
          v-if="filteredFiles.length"
          @click="toggleSelectAll"
          class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all"
        >
          {{ selection.size === filteredFiles.length ? 'Deselect all' : 'Select all' }}
        </button>
        <button
          @click="loadFiles"
          :title="'Refresh'"
          class="p-1.5 text-slate-600 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all"
        >
          <RefreshCw :size="14" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- File grid -->
    <div class="flex-1 overflow-y-auto px-6 pb-28">

      <div v-if="loading" class="flex items-center justify-center h-48 gap-3 text-slate-600">
        <RefreshCw :size="18" class="animate-spin" />
        <span class="text-sm">Loading files…</span>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center h-48 gap-3 text-center">
        <AlertCircle :size="36" class="text-red-500/50" />
        <p class="text-sm text-slate-600 max-w-xs">{{ error }}</p>
        <button @click="loadFiles" class="text-xs text-violet-400 hover:text-violet-300 transition-colors">Try again</button>
      </div>

      <div v-else-if="!filteredFiles.length" class="flex flex-col items-center justify-center h-48 gap-3">
        <Inbox :size="40" class="text-slate-800" />
        <p class="text-sm text-slate-700">
          {{ !files.length ? 'No files in your downloads folder' : 'No files match this filter' }}
        </p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        <div
          v-for="file in filteredFiles"
          :key="file.path"
          @click="toggleSelect(file.path)"
          class="relative flex flex-col p-3.5 rounded-xl border cursor-pointer select-none transition-all group"
          :class="selection.has(file.path)
            ? 'bg-violet-600/10 border-violet-500/50 shadow-md shadow-violet-950/20'
            : 'bg-slate-800/50 border-slate-700/40 hover:bg-slate-800 hover:border-slate-600/60'"
        >
          <!-- Checkbox -->
          <div class="absolute top-2.5 right-2.5">
            <div
              class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
              :class="selection.has(file.path)
                ? 'bg-violet-600 border-violet-600'
                : 'border-slate-600 bg-transparent opacity-0 group-hover:opacity-100'"
            >
              <Check v-if="selection.has(file.path)" :size="11" class="text-white" stroke-width="3" />
            </div>
          </div>

          <!-- Extension badge -->
          <div
            class="w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-xs font-bold uppercase tracking-wider flex-none"
            :style="{ background: catFor(file).darkBg, color: catFor(file).color }"
          >
            {{ file.ext || '?' }}
          </div>

          <!-- Info -->
          <p class="text-sm font-medium text-slate-200 truncate leading-tight" :title="file.name">
            {{ file.name }}
          </p>
          <div class="flex items-center justify-between mt-1.5 gap-1">
            <span class="text-xs text-slate-600 flex-none">{{ formatFileSize(file.size) }}</span>
            <span class="text-xs text-slate-700 truncate text-right">{{ formatDate(file.modified) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Bottom action bar ── -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="selection.size"
        class="fixed bottom-0 left-0 right-0 px-6 py-4 bg-slate-900/85 backdrop-blur-md border-t border-slate-800"
      >
        <div class="flex items-center justify-between gap-4 max-w-screen-2xl mx-auto">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-violet-900/40">
              {{ selection.size }}
            </div>
            <span class="text-sm text-slate-300 font-medium">
              {{ selection.size === 1 ? '1 file selected' : `${selection.size} files selected` }}
            </span>
            <button @click="selection = new Set()" class="text-xs text-slate-700 hover:text-slate-500 transition-colors ml-1">
              Clear
            </button>
          </div>
          <button
            @click="showModal = true"
            class="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-900/30 active:scale-95"
          >
            <MoveRight :size="16" />
            Move to…
          </button>
        </div>
      </div>
    </Transition>

    <!-- ── Move modal ── -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        @click.self="showModal = false"
      >
        <div class="w-full max-w-sm bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          <div class="flex items-start justify-between p-5 border-b border-slate-700/60">
            <div>
              <h3 class="font-bold text-white">
                Move {{ selection.size }} {{ selection.size === 1 ? 'file' : 'files' }}
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Choose a destination folder</p>
            </div>
            <button @click="showModal = false" class="text-slate-600 hover:text-slate-300 transition-colors mt-0.5">
              <X :size="18" />
            </button>
          </div>

          <div class="p-2 max-h-72 overflow-y-auto">
            <button
              v-for="dest in appStore.config?.destinations"
              :key="dest.id"
              @click="moveFiles(dest)"
              :disabled="moving"
              class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/50 disabled:opacity-50 transition-all group text-left"
            >
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center flex-none"
                :style="{ background: (dest.color || '#8b5cf6') + '22' }"
              >
                <FolderOpen :size="18" :style="{ color: dest.color || '#8b5cf6' }" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-200">{{ dest.name }}</p>
                <p class="text-xs text-slate-600 truncate">{{ dest.path }}</p>
              </div>
              <ArrowRight :size="14" class="text-slate-700 group-hover:text-slate-400 transition-colors flex-none" />
            </button>
          </div>

          <div v-if="moving" class="flex items-center justify-center gap-2 p-4 border-t border-slate-700/60 text-sm text-slate-500">
            <RefreshCw :size="14" class="animate-spin" /> Moving files…
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  RefreshCw, Check, X, Inbox, AlertCircle,
  MoveRight, FolderOpen, ArrowRight,
} from 'lucide-vue-next'
import { useAppStore } from '../stores/appStore.js'
import { useNotifications } from '../composables/useNotifications.js'
import {
  getFileCategory, getCategoryConfig,
  formatFileSize, formatDate, FILE_CATEGORIES,
} from '../utils/fileUtils.js'

const appStore = useAppStore()
const { notify } = useNotifications()

const files       = ref([])
const loading     = ref(false)
const error       = ref(null)
const activeFilter = ref('all')
const selection   = ref(new Set())
const showModal   = ref(false)
const moving      = ref(false)

// ── Computed ─────────────────────────────────────────────────────────────────

const filters = computed(() => {
  const counts = {}
  for (const f of files.value) {
    const cat = getFileCategory(f.ext)
    counts[cat] = (counts[cat] || 0) + 1
  }
  const items = [{ key: 'all', label: 'All', color: '#94a3b8', count: files.value.length }]
  for (const [key, cat] of Object.entries(FILE_CATEGORIES)) {
    if (key !== 'other' && counts[key]) {
      items.push({ key, label: cat.label, color: cat.color, count: counts[key] })
    }
  }
  if (counts.other) {
    items.push({ key: 'other', label: 'Other', color: '#94a3b8', count: counts.other })
  }
  return items
})

const filteredFiles = computed(() =>
  activeFilter.value === 'all'
    ? files.value
    : files.value.filter(f => getFileCategory(f.ext) === activeFilter.value)
)

function catFor(file) {
  return getCategoryConfig(getFileCategory(file.ext))
}

// ── Selection ─────────────────────────────────────────────────────────────────

function toggleSelect(path) {
  const s = new Set(selection.value)
  s.has(path) ? s.delete(path) : s.add(path)
  selection.value = s
}

function toggleSelectAll() {
  if (selection.value.size === filteredFiles.value.length) {
    selection.value = new Set()
  } else {
    selection.value = new Set(filteredFiles.value.map(f => f.path))
  }
}

// ── Load files ────────────────────────────────────────────────────────────────

async function loadFiles() {
  if (!appStore.config?.downloadsFolder) return
  loading.value = true
  error.value   = null
  selection.value = new Set()

  const result = await window.electronAPI.getFiles(appStore.config.downloadsFolder)

  if (result?.error) {
    error.value = result.error
    files.value = []
  } else {
    files.value = result || []
  }

  if (activeFilter.value !== 'all') {
    const validKeys = new Set(filters.value.map(f => f.key))
    if (!validKeys.has(activeFilter.value)) activeFilter.value = 'all'
  }

  loading.value = false
}

// ── Move ──────────────────────────────────────────────────────────────────────

async function moveFiles(dest) {
  if (moving.value) return
  moving.value = true
  const filePaths = Array.from(selection.value)

  const results = await window.electronAPI.moveFiles({ filePaths, destFolder: dest.path })

  const ok   = results.filter(r => r.success).length
  const fail = results.filter(r => !r.success).length

  if (ok)   notify({ type: 'success', title: `Moved ${ok} ${ok === 1 ? 'file' : 'files'}`, message: `→ ${dest.name}` })
  if (fail) notify({ type: 'error', title: `${fail} ${fail === 1 ? 'file' : 'files'} failed to move` })

  showModal.value = false
  moving.value    = false
  await loadFiles()
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

watch(() => appStore.config?.downloadsFolder, (folder) => {
  if (folder) loadFiles()
})

onMounted(loadFiles)
</script>
