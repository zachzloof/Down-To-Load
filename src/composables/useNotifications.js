import { ref } from 'vue'

const notifications = ref([])
let nextId = 0

export function useNotifications() {
  function notify({ type = 'success', title, message, duration = 3500 }) {
    const id = ++nextId
    notifications.value.push({ id, type, title, message })
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, duration)
  }

  function dismiss(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return { notifications, notify, dismiss }
}
