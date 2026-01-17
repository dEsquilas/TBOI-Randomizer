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
        <div class="mt-2 ml-6 flex items-center gap-2">
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

      <!-- Streak Display Option -->
      <div class="mb-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="store.streakVisible"
            class="cursor-pointer"
          />
          <span class="text-sm">Streak Display</span>
        </label>
        <div class="mt-2 ml-6 flex items-center gap-2">
          <label class="text-sm">Text color:</label>
          <input
            type="color"
            :value="`#${store.streakTextColor}`"
            @input="store.streakTextColor = $event.target.value.slice(1)"
            class="w-8 h-6 cursor-pointer border border-gray-500 rounded"
          />
          <span class="text-xs text-gray-400">#{{ store.streakTextColor.toUpperCase() }}</span>
        </div>

        <!-- Streak Controls -->
        <div class="mt-2 ml-6 space-y-2">
          <div class="flex gap-4">
            <!-- Streak -->
            <div class="flex items-center gap-1">
              <span class="text-xs text-gray-400 w-10">Streak:</span>
              <button
                @click="store.decrementStreak()"
                class="w-6 h-6 bg-red-700 hover:bg-red-600 text-white rounded text-xs transition-colors"
              >-</button>
              <span class="w-6 text-center text-sm font-mono">{{ store.streak }}</span>
              <button
                @click="store.incrementStreak()"
                class="w-6 h-6 bg-green-700 hover:bg-green-600 text-white rounded text-xs transition-colors"
              >+</button>
            </div>

            <!-- PB -->
            <div class="flex items-center gap-1">
              <span class="text-xs text-gray-400 w-6">PB:</span>
              <button
                @click="store.decrementPB()"
                class="w-6 h-6 bg-red-700 hover:bg-red-600 text-white rounded text-xs transition-colors"
              >-</button>
              <span class="w-6 text-center text-sm font-mono">{{ store.streakPB }}</span>
              <button
                @click="store.incrementPB()"
                class="w-6 h-6 bg-green-700 hover:bg-green-600 text-white rounded text-xs transition-colors"
              >+</button>
            </div>
          </div>

          <!-- Reset Buttons -->
          <div class="flex gap-2">
            <button
              @click="store.resetStreak()"
              class="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
            >Reset Streak</button>
            <button
              @click="store.resetPB()"
              class="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
            >Reset PB</button>
          </div>
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
