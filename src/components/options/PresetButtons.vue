<script setup>
import { useGameStore } from '@/stores/gameStore'
import { PRESETS } from '@/constants/gameData'

const store = useGameStore()

function applyPreset(presetName) {
  const preset = PRESETS[presetName]
  if (preset) {
    store.applyPresetToTargets(preset)
  }
}
</script>

<template>
  <div class="mb-4">
    <h3 class="font-bold mb-1">Presets</h3>
    <p class="text-xs text-gray-500 mb-2">Sets targets for the selected game version.</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="preset in ['rebirth', 'afterbirth', 'antibirth', 'afterbirthPlus', 'repentance']"
        :key="preset"
        @click="applyPreset(preset)"
        class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded text-sm capitalize"
      >
        {{ preset === 'afterbirthPlus' ? 'Afterbirth+' : preset }}
      </button>
    </div>
  </div>
</template>
