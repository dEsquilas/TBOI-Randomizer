<script setup>
import ChromaStyleSelector from './ChromaStyleSelector.vue'
import ColorPickers from './ColorPickers.vue'
import PresetButtons from './PresetButtons.vue'
import ChallengeSelector from './ChallengeSelector.vue'
import GameChallengeSelector from './GameChallengeSelector.vue'
</script>

<template>
  <div class="bg-black/90 text-white p-4 min-h-screen max-h-screen overflow-y-auto">
    <div class="max-w-md">
      <!-- Chroma Options -->
      <div class="mb-4">
        <ChromaStyleSelector />
        <ColorPickers />
      </div>

      <hr class="border-gray-600 my-4" />
      <PresetButtons />

      <hr class="border-gray-600 my-4" />
      <ChallengeSelector />

      <hr class="border-gray-600 my-4" />
      <GameChallengeSelector />

    </div>
  </div>
</template>
