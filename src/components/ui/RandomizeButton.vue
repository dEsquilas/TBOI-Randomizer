<script setup>
import { useGameStore } from '@/stores/gameStore'
import { useRandomizer } from '@/composables/useRandomizer'
import { ALL_CHARACTERS, OBJECTIVES, TIMED_OBJECTIVES } from '@/constants/gameData'

const store = useGameStore()
const { randomize } = useRandomizer()

const emit = defineEmits(['error'])

function getRandomCharacter() {
  const chars = ALL_CHARACTERS.filter(c => store.selectedCharacters.has(c.id))
  if (chars.length === 0) return ALL_CHARACTERS[0]
  return chars[Math.floor(Math.random() * chars.length)]
}

function getRandomObjective() {
  const objs = OBJECTIVES.filter(o => store.selectedObjectives.has(o.id))
  if (objs.length === 0) return OBJECTIVES[0]
  return objs[Math.floor(Math.random() * objs.length)]
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function spinAnimation(finalResults) {
  const numPlayers = store.numberPlayers
  const totalSpins = 15
  const baseDelay = 50

  store.isSpinning = true

  for (let i = 0; i < totalSpins; i++) {
    // Generate random characters for each player
    const spinChars = []
    for (let p = 0; p < numPlayers; p++) {
      const randomChar = getRandomCharacter()
      spinChars.push({
        id: randomChar.id,
        name: randomChar.name,
        isCustom: false
      })
    }
    store.spinningPlayers = spinChars

    // Generate random objective
    const randomObj = getRandomObjective()
    store.spinningObjectives = [randomObj]

    // Easing: start fast, slow down towards the end
    const progress = i / totalSpins
    const delay = baseDelay + Math.pow(progress, 2) * 200
    await sleep(delay)
  }

  // Final result
  store.spinningPlayers = []
  store.spinningObjectives = []
  store.isSpinning = false
  store.setResults(finalResults)
}

async function handleClick() {
  if (store.isRandomizing) return
  store.isRandomizing = true
  store.clearResults()

  try {
    const finalResults = randomize(true) // Pass true to not set results immediately
    await spinAnimation(finalResults)
  } catch (e) {
    store.isSpinning = false
    store.spinningPlayers = []
    emit('error', e.message)
  } finally {
    store.isRandomizing = false
  }
}
</script>

<template>
  <button
    class="bg-transparent border-none cursor-pointer p-0 transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
    :class="{ 'scale-95': store.isRandomizing }"
    @click="handleClick"
    :disabled="store.isRandomizing"
  >
    <img src="/img/randomize.png" alt="Randomize" class="max-w-[200px] h-auto" />
  </button>
</template>
