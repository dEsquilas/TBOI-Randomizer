<script setup>
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div class="mb-4 space-y-3">
    <div class="flex items-center gap-2">
      <label class="text-sm">Text color:</label>
      <input
        type="color"
        :value="`#${store.chromaTextColor}`"
        @input="store.chromaTextColor = $event.target.value.slice(1).toUpperCase()"
        class="w-8 h-6 cursor-pointer border border-gray-500 rounded"
      />
      <span class="text-xs text-gray-400">#{{ store.chromaTextColor }}</span>
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm">Background:</label>
      <input
        type="color"
        :value="`#${store.chromaBgColor}`"
        @input="store.chromaBgColor = $event.target.value.slice(1).toUpperCase()"
        class="w-8 h-6 cursor-pointer border border-gray-500 rounded"
      />
      <span class="text-xs text-gray-400">#{{ store.chromaBgColor }}</span>
    </div>

    <p class="text-xs text-gray-500">
      Alignment works in Simple/Plain text modes. Text color only in Plain text mode.
    </p>
  </div>
</template>
