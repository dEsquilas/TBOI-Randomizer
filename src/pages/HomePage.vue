<script setup>
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useRandomizer } from '@/composables/useRandomizer'
import OptionsPanel from '@/components/options/OptionsPanel.vue'
import CompletionPanel from '@/components/completion/CompletionPanel.vue'
import RandomizeButton from '@/components/ui/RandomizeButton.vue'
import FullDisplay from '@/components/display/FullDisplay.vue'
import SimpleDisplayA from '@/components/display/SimpleDisplayA.vue'
import SimpleDisplayB from '@/components/display/SimpleDisplayB.vue'
import PlainTextDisplay from '@/components/display/PlainTextDisplay.vue'

const store = useGameStore()
const { load, setupAutoSave } = useLocalStorage()
const { markCurrentAsComplete } = useRandomizer()

const bgColor = computed(() => `#${store.chromaBgColor}`)
const chromaStyle = computed(() => store.chromaStyle)
const isGameChallenge = computed(() => !!store.results.gameChallenge)

// Textual End display computed properties
const hasTextualContent = computed(() => store.results.players.length > 0)
const displayPlayerName = computed(() => {
  if (store.isSpinning && store.spinningPlayers.length > 0) {
    return store.spinningPlayers[0]?.name || ''
  }
  return store.results.players[0]?.name || ''
})
const displayObjectiveName = computed(() => {
  if (store.isSpinning && store.spinningObjectives.length > 0) {
    return store.spinningObjectives[0]?.name || ''
  }
  return store.results.objectives[0]?.name || ''
})

const canMarkComplete = computed(() => {
  // Can mark game challenge as complete
  if (isGameChallenge.value) return true
  // Can mark normal result as complete (single player, not custom)
  return store.results.players.length > 0 &&
    store.numberPlayers === 1 &&
    !store.results.players[0]?.isCustom
})

onMounted(() => {
  load()
  setupAutoSave()
})

function handleError(message) {
  alert(message)
}
</script>

<template>
  <div class="flex min-h-screen transition-colors duration-300" :style="{ backgroundColor: bgColor }">
    <!-- Options Panel (left side) -->
    <aside class="w-[400px] shrink-0 overflow-y-auto max-h-screen">
      <OptionsPanel />
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center justify-center p-5 gap-5">
      <!-- Display Area -->
      <div class="flex justify-center items-center">
        <FullDisplay v-if="chromaStyle === 'full'" />
        <SimpleDisplayA v-else-if="chromaStyle === 'simpleA'" />
        <SimpleDisplayB v-else-if="chromaStyle === 'simpleB'" />
        <PlainTextDisplay v-else-if="chromaStyle === 'plainText'" />
      </div>

      <!-- Textual End Display -->
      <div
        v-if="store.textualEndEnabled && !store.results.gameChallenge"
        class="flex flex-col items-center"
      >
        <p
          class="font-isaac text-2xl text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          :style="{ color: `#${store.textualEndTextColor}` }"
        >
          {{ displayPlayerName || '?' }}
        </p>
        <p
          class="font-isaac text-2xl text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          :style="{ color: `#${store.textualEndTextColor}` }"
        >
          {{ displayObjectiveName || '?' }}
        </p>
      </div>

      <!-- Randomize Button -->
      <div class="flex justify-center">
        <RandomizeButton @error="handleError" />
      </div>

      <!-- Mark as Complete -->
      <div class="flex justify-center">
        <button
          @click="markCurrentAsComplete"
          :disabled="!canMarkComplete"
          class="flex items-center gap-2 px-4 py-2 bg-black/70 text-white border border-gray-600 rounded text-sm transition-opacity"
          :class="canMarkComplete ? 'cursor-pointer hover:bg-black/80' : 'opacity-40 cursor-not-allowed'"
        >
          <img src="/img/check.svg" alt="" class="w-5 h-5" />
          {{ isGameChallenge ? 'Mark challenge as complete' : 'Mark current objectives as complete' }}
        </button>
      </div>

      <!-- Streak Display (visual only, config in sidebar) -->
      <div
        v-if="store.streakVisible"
        class="font-isaac text-2xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        :style="{ color: `#${store.streakTextColor}` }"
      >
        PB: {{ store.streakPB }} | Streak: {{ store.streak }}
      </div>

    </main>

    <!-- Completion Panel (right side) -->
    <aside class="w-[400px] shrink-0 overflow-y-auto max-h-screen">
      <CompletionPanel />
    </aside>

    <!-- Ladder Button (fixed bottom center) -->
    <a
      href="/ladder"
      target="_blank"
      class="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 text-white border border-gray-600 rounded hover:bg-black/90 transition-colors text-sm"
    >
      🏆 Ladder
    </a>
  </div>
</template>
