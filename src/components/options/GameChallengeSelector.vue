<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()

const gameChallengesEnabled = computed({
  get: () => store.gameChallengesEnabled,
  set: (val) => { store.gameChallengesEnabled = val }
})
</script>

<template>
  <div class="mb-4">
    <h3 class="font-bold mb-2">Game Challenges</h3>
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" v-model="gameChallengesEnabled" class="cursor-pointer" />
      <span class="text-sm">Include game challenges in completion tracker</span>
    </label>
    <p class="text-xs text-gray-500 mt-1">
      Track the 45 official Isaac challenges in the completion panel.
    </p>
  </div>
</template>
