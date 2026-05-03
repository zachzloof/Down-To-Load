<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-2xl mx-auto px-6 py-8 space-y-10">

      <!-- Page title -->
      <div>
        <h1 class="text-2xl font-bold text-white">Configuration</h1>
        <p class="text-slate-500 text-sm mt-1">Manage your source folder and sort destinations.</p>
      </div>

      <!-- ── Downloads folder ── -->
      <section>
        <h2 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Downloads Folder</h2>
        <div class="bg-slate-800 rounded-xl border border-slate-700 p-4 flex items-center gap-4">
          <div class="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center flex-none">
            <FolderDown :size="20" class="text-blue-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-200 truncate">{{ config?.downloadsFolder || 'Not configured' }}</p>
            <p class="text-xs text-slate-600 mt-0.5">Files are read from this folder</p>
          </div>
          <button
            @click="changeDownloads"
            class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-sm text-slate-300 font-medium rounded-lg transition-colors whitespace-nowrap flex-none"
          >
            Change
          </button>
        </div>
      </section>

      <!-- ── Destinations ── -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-bold text-slate-500 uppercase tracking-widest">Preset Destinations</h2>
          <span class="text-xs text-slate-700 font-medium">{{ config?.destinations?.length || 0 }} saved</span>
        </div>

        <div class="space-y-2 mb-4">
          <TransitionGroup name="list">
            <div
              v-for="(dest, i) in config?.destinations"
              :key="dest.id"
              class="flex items-center gap-3 p-3.5 bg-slate-800 rounded-xl border transition-all"
              :class="editIndex === i ? 'border-violet-500/50' : 'border-slate-700'"
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
              <div class="flex items-center gap-0.5 flex-none">
                <button
                  @click="openFolder(dest.path)"
                  title="Open in Explorer"
                  class="p-1.5 text-slate-700 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-all"
                >
                  <ExternalLink :size="13" />
                </button>
                <button
                  @click="startEdit(i)"
                  title="Edit"
                  class="p-1.5 text-slate-700 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-all"
                >
                  <Pencil :size="13" />
                </button>
                <button
                  @click="deleteDest(i)"
                  title="Delete"
                  class="p-1.5 text-slate-700 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 :size="13" />
                </button>
              </div>
            </div>
          </TransitionGroup>

          <div
            v-if="!config?.destinations?.length"
            class="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-slate-800 text-slate-700 text-sm gap-2"
          >
            <FolderOpen :size="28" />
            No destinations saved yet
          </div>
        </div>

        <!-- Add / Edit form -->
        <div class="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {{ editIndex !== null ? 'Edit Destination' : 'Add Destination' }}
          </p>

          <div class="flex gap-2">
            <input
              v-model="form.name"
              placeholder="Name (e.g. Music, Projects…)"
              class="flex-1 bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-700 outline-none transition-colors"
            />
            <input
              type="color"
              v-model="form.color"
              title="Pick a colour"
              class="w-10 h-9 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer p-0.5 flex-none"
            />
          </div>

          <div class="flex gap-2">
            <div
              class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm min-w-0 truncate"
              :class="form.path ? 'text-slate-300' : 'text-slate-700'"
            >
              {{ form.path || 'No folder selected' }}
            </div>
            <button
              @click="browseForm"
              class="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors whitespace-nowrap flex-none"
            >
              Browse
            </button>
          </div>

          <div class="flex gap-2">
            <button
              v-if="editIndex !== null"
              @click="cancelEdit"
              class="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-400 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveDest"
              :disabled="!form.name || !form.path"
              class="flex-1 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm text-white font-semibold transition-colors"
            >
              {{ editIndex !== null ? 'Save Changes' : '+ Add Destination' }}
            </button>
          </div>
        </div>
      </section>

      <!-- ── Config file ── -->
      <section>
        <h2 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Config File</h2>
        <div class="bg-slate-800 rounded-xl border border-slate-700 p-4 flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-slate-300">config.json</p>
            <p class="text-xs text-slate-600 mt-0.5">Stored in the app's user data directory — editable in any text editor.</p>
          </div>
          <button
            @click="revealConfig"
            class="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors whitespace-nowrap flex-none"
          >
            <FolderOpen :size="14" />
            Reveal
          </button>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { FolderDown, FolderOpen, Pencil, Trash2, ExternalLink } from 'lucide-vue-next'
import { useAppStore } from '../stores/appStore.js'
import { useNotifications } from '../composables/useNotifications.js'

const appStore = useAppStore()
const { notify } = useNotifications()

const config    = computed(() => appStore.config)
const editIndex = ref(null)

const form = reactive({ name: '', path: '', color: '#8b5cf6' })

function resetForm() {
  form.name  = ''
  form.path  = ''
  form.color = '#8b5cf6'
  editIndex.value = null
}

function startEdit(i) {
  const d = config.value.destinations[i]
  form.name  = d.name
  form.path  = d.path
  form.color = d.color || '#8b5cf6'
  editIndex.value = i
}

function cancelEdit() { resetForm() }

async function browseForm() {
  const folder = await window.electronAPI.selectFolder()
  if (!folder) return
  form.path = folder
  if (!form.name) form.name = folder.split(/[/\\]/).pop()
}

async function saveDest() {
  if (!form.name || !form.path) return
  const destinations = [...(config.value.destinations || [])]

  if (editIndex.value !== null) {
    destinations[editIndex.value] = {
      ...destinations[editIndex.value],
      name: form.name.trim(),
      path: form.path,
      color: form.color,
    }
  } else {
    destinations.push({
      id: Date.now().toString(),
      name: form.name.trim(),
      path: form.path,
      color: form.color,
    })
  }

  const result = await appStore.saveConfig({ ...config.value, destinations })
  if (result.success) {
    notify({ type: 'success', title: editIndex.value !== null ? 'Destination updated' : 'Destination added' })
    resetForm()
  } else {
    notify({ type: 'error', title: 'Failed to save', message: result.error })
  }
}

async function deleteDest(i) {
  const destinations = config.value.destinations.filter((_, idx) => idx !== i)
  const result = await appStore.saveConfig({ ...config.value, destinations })
  if (result.success) notify({ type: 'success', title: 'Destination removed' })
}

async function changeDownloads() {
  const folder = await window.electronAPI.selectFolder()
  if (!folder) return
  const result = await appStore.saveConfig({ ...config.value, downloadsFolder: folder })
  if (result.success) notify({ type: 'success', title: 'Downloads folder updated' })
}

function openFolder(path) { window.electronAPI.openFolder(path) }
function revealConfig()    { window.electronAPI.revealConfig() }
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.2s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
