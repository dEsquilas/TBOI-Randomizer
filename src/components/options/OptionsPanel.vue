<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import ChromaStyleSelector from './ChromaStyleSelector.vue'
import ColorPickers from './ColorPickers.vue'
import PresetButtons from './PresetButtons.vue'
import TimedObjectiveSelector from './TimedObjectiveSelector.vue'
import ChallengeSelector from './ChallengeSelector.vue'
import GameChallengeSelector from './GameChallengeSelector.vue'

const store = useGameStore()

const characterScale = computed({
  get: () => store.characterScale,
  set: (val) => { store.characterScale = val }
})

const objectiveScale = computed({
  get: () => store.objectiveScale,
  set: (val) => { store.objectiveScale = val }
})
</script>

<template>
  <div class="bg-black/90 text-white p-4 min-h-screen max-h-screen overflow-y-auto">
    <div class="max-w-md">
      <!-- Chroma Options -->
      <div class="mb-4">
        <ChromaStyleSelector />
        <ColorPickers />
      </div>

      <!-- Scale Options -->
      <div class="mb-4">
        <p class="font-bold mb-2">Scale:</p>
        <div class="space-y-3">
          <div>
            <label class="flex items-center gap-2 text-sm">
              Character: {{ characterScale }}%
            </label>
            <input
              type="range"
              v-model.number="characterScale"
              min="50"
              max="150"
              step="5"
              class="w-full accent-amber-500"
            />
          </div>
          <div>
            <label class="flex items-center gap-2 text-sm">
              Objective: {{ objectiveScale }}%
            </label>
            <input
              type="range"
              v-model.number="objectiveScale"
              min="50"
              max="150"
              step="5"
              class="w-full accent-amber-500"
            />
          </div>
        </div>
      </div>

      <!-- Textual End Option -->
      <div class="mb-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="store.textualEndEnabled"
            class="cursor-pointer"
          />
          <span class="text-sm">Textual End</span>
        </label>
        <!-- Text color picker (only when enabled) -->
        <div v-if="store.textualEndEnabled" class="mt-2 ml-6 flex items-center gap-2">
          <label class="text-sm">Text color:</label>
          <input
            type="color"
            :value="`#${store.textualEndTextColor}`"
            @input="store.textualEndTextColor = $event.target.value.slice(1)"
            class="w-8 h-6 cursor-pointer border border-gray-500 rounded"
          />
          <span class="text-xs text-gray-400">#{{ store.textualEndTextColor.toUpperCase() }}</span>
        </div>
      </div>

      <hr class="border-gray-600 my-4" />
      <PresetButtons />

      <hr class="border-gray-600 my-4" />
      <TimedObjectiveSelector />

      <hr class="border-gray-600 my-4" />
      <ChallengeSelector />

      <hr class="border-gray-600 my-4" />
      <GameChallengeSelector />

    </div>
  </div>
</template>
