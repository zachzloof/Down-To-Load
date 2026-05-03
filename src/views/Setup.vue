<template>
  <div class="h-full flex items-center justify-center bg-slate-900 p-8 overflow-y-auto">
    <div class="w-full max-w-md py-8">

      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-600 shadow-lg shadow-violet-900/40 mb-5">
          <ArrowDownToLine :size="30" class="text-white" />
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">Down-To-Load</h1>
        <p class="text-slate-500 mt-2 text-sm">Let's get you set up in two steps.</p>
      </div>

      <!-- Step dots -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <div
          v-for="i in 2"
          :key="i"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="[
            i <= step ? 'bg-violet-500' : 'bg-slate-700',
            i === step ? 'w-8' : 'w-3',
          ]"
        />
      </div>

      <!-- ── Step 1 ── -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 1" key="step1" class="space-y-5">
          <div class="mb-2">
            <p class="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">Step 1 of 2</p>
            <h2 class="text-xl font-bold text-white">Select your Downloads folder</h2>
            <p class="text-slate-500 text-sm mt-1">This is the folder Down-To-Load will watch for files.</p>
          </div>

          <button
            @click="selectDownloadsFolder"
            class="w-full flex items-center gap-4 p-4 bg-slate-800 hover:bg-slate-750 border rounded-xl transition-all group"
            :class="downloadsFolder
              ? 'border-violet-500/40 hover:border-violet-500/70'
              : 'border-slate-700 hover:border-slate-600'"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-none"
              :class="downloadsFolder ? 'bg-violet-500/20' : 'bg-slate-700 group-hover:bg-slate-600'"
            >
              <Folder :size="22" :class="downloadsFolder ? 'text-violet-400' : 'text-slate-400'" />
            </div>
            <div class="flex-1 text-left min-w-0">
              <p class="text-sm font-semibold text-slate-200 truncate">
                {{ downloadsFolder || 'Click to select folder' }}
              </p>
              <p class="text-xs text-slate-600 mt-0.5">
                {{ downloadsFolder ? 'Click to change' : 'No folder selected yet' }}
              </p>
            </div>
            <ChevronRight :size="16" class="text-slate-600 flex-none" />
          </button>

          <button
            @click="step = 2"
            :disabled="!downloadsFolder"
            class="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-900/30"
          >
            Continue →
          </button>
        </div>
      </Transition>

      <!-- ── Step 2 ── -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 2" key="step2" class="space-y-5">
          <div class="mb-2">
            <p class="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">Step 2 of 2</p>
            <h2 class="text-xl font-bold text-white">Add preset destinations</h2>
            <p class="text-slate-500 text-sm mt-1">Add at least one folder you frequently sort files into.</p>
          </div>

          <!-- Saved destinations -->
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <TransitionGroup name="list">
              <div
                v-for="(dest, i) in destinations"
                :key="dest.id"
                class="flex items-center gap-3 px-3 py-2.5 bg-slate-800 rounded-xl border border-slate-700"
              >
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-none" :style="{ background: dest.color + '22' }">
                  <FolderOpen :size="15" :style="{ color: dest.color }" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-200 truncate">{{ dest.name }}</p>
                  <p class="text-xs text-slate-600 truncate">{{ dest.path }}</p>
                </div>
                <button @click="destinations.splice(i, 1)" class="text-slate-700 hover:text-red-400 transition-colors flex-none">
                  <X :size="14" />
                </button>
              </div>
            </TransitionGroup>
            <p v-if="!destinations.length" class="text-center py-3 text-slate-700 text-sm">
              No destinations added yet
            </p>
          </div>

          <!-- Add form -->
          <div class="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
            <p class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Add a destination</p>
            <div class="flex gap-2">
              <input
                v-model="newName"
                @keydown.enter="addDestination"
                placeholder="Name (e.g. Music, Work...)"
                class="flex-1 bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-700 outline-none transition-colors"
              />
              <input
                type="color"
                v-model="newColor"
                class="w-10 h-9 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer p-0.5 flex-none"
                title="Pick a colour"
              />
            </div>
            <div class="flex gap-2">
              <div class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm min-w-0 truncate"
                   :class="newPath ? 'text-slate-300' : 'text-slate-700'">
                {{ newPath || 'No folder selected' }}
              </div>
              <button
                @click="selectDestFolder"
                class="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors whitespace-nowrap flex-none"
              >
                Browse
              </button>
            </div>
            <button
              @click="addDestination"
              :disabled="!newName || !newPath"
              class="w-full py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm text-slate-200 font-medium transition-colors"
            >
              + Add Destination
            </button>
          </div>

          <div class="flex gap-3">
            <button
              @click="step = 1"
              class="flex-none px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 font-medium rounded-xl transition-all"
            >
              ← Back
            </button>
            <button
              @click="finishSetup"
              :disabled="!destinations.length || saving"
              class="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-900/30"
            >
              {{ saving ? 'Saving…' : 'Get Started' }}
            </button>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDownToLine, Folder, FolderOpen, ChevronRight, X } from 'lucide-vue-next'
import { useAppStore } from '../stores/appStore.js'
import { useNotifications } from '../composables/useNotifications.js'

const router = useRouter()
const appStore = useAppStore()
const { notify } = useNotifications()

const step            = ref(1)
const downloadsFolder = ref('')
const destinations    = ref([])
const newName         = ref('')
const newPath         = ref('')
const newColor        = ref('#8b5cf6')
const saving          = ref(false)

async function selectDownloadsFolder() {
  const folder = await window.electronAPI.selectFolder()
  if (folder) downloadsFolder.value = folder
}

async function selectDestFolder() {
  const folder = await window.electronAPI.selectFolder()
  if (!folder) return
  newPath.value = folder
  if (!newName.value) newName.value = folder.split(/[/\\]/).pop()
}

function addDestination() {
  if (!newName.value || !newPath.value) return
  destinations.value.push({
    id: Date.now().toString(),
    name: newName.value.trim(),
    path: newPath.value,
    color: newColor.value,
  })
  newName.value  = ''
  newPath.value  = ''
  newColor.value = '#8b5cf6'
}

async function finishSetup() {
  if (!destinations.value.length || saving.value) return
  saving.value = true
  try {
    const result = await appStore.saveConfig({
      downloadsFolder: downloadsFolder.value,
      destinations: destinations.value,
    })
    if (result.success) {
      router.push('/sorter')
    } else {
      notify({ type: 'error', title: 'Could not save config', message: result.error })
    }
  } catch (e) {
    notify({ type: 'error', title: 'Unexpected error', message: e.message })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.fade-enter-from { opacity: 0; transform: translateX(10px); }
.fade-leave-to   { opacity: 0; transform: translateX(-10px); }
.list-enter-active, .list-leave-active { transition: all 0.2s; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
