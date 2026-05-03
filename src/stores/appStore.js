import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const config = ref(null)

  async function loadConfig() {
    config.value = await window.electronAPI.getConfig()
    return config.value
  }

  async function saveConfig(newConfig) {
    // Strip Vue reactivity Proxies — Electron IPC uses structured clone, which can't serialize them
    const plain = JSON.parse(JSON.stringify(newConfig))
    const result = await window.electronAPI.saveConfig(plain)
    if (result.success) config.value = plain
    return result
  }

  return { config, loadConfig, saveConfig }
})
