import { watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const STORAGE_KEY = 'tboi-random-generator'
const STORAGE_VERSION = 9

export function useLocalStorage() {
  const store = useGameStore()

  function save() {
    const data = {
      version: STORAGE_VERSION,
      state: store.exportState()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return false

      const data = JSON.parse(raw)

      // Check version compatibility
      if (data.version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch, using defaults')
        return false
      }

      store.importState(data.state)
      return true
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
      return false
    }
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY)
  }

  function setupAutoSave() {
    // Watch for changes and auto-save
    watch(
      () => store.exportState(),
      () => save(),
      { deep: true }
    )
  }

  // Export settings to JSON file
  function exportToFile() {
    const data = {
      version: STORAGE_VERSION,
      state: store.exportState(),
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `tboi-settings-${Date.now()}.json`
    a.click()

    URL.revokeObjectURL(url)
  }

  // Import settings from JSON file
  function importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)

          if (!data.state) {
            reject(new Error('Invalid file format'))
            return
          }

          store.importState(data.state)
          save()
          resolve(true)
        } catch (err) {
          reject(err)
        }
      }

      reader.onerror = () => reject(reader.error)
      reader.readAsText(file)
    })
  }

  return {
    save,
    load,
    clear,
    setupAutoSave,
    exportToFile,
    importFromFile
  }
}
