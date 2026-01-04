<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { CHARACTERS, OBJECTIVES, TIMED_OBJECTIVES } from '@/constants/gameData'

const store = useGameStore()

const activeTab = ref('tracker') // 'tracker' | 'config'

const allObjectives = [...OBJECTIVES, ...TIMED_OBJECTIVES]
const allCharacters = [...CHARACTERS.normal, ...CHARACTERS.tainted]

// Tracker functions
function isCompleted(charId, objId) {
  return store.getCompletion(charId, objId)
}

function toggleCompletion(charId, objId) {
  const current = store.getCompletion(charId, objId)
  store.setCompletion(charId, objId, !current)
}

function getCompletionCount(charId) {
  return allObjectives.filter(obj =>
    store.isTargeting(charId, obj.id) && store.getCompletion(charId, obj.id)
  ).length
}

function getTargetCount(charId) {
  return allObjectives.filter(obj => store.isTargeting(charId, obj.id)).length
}

function isCharacterComplete(charId) {
  const targetCount = getTargetCount(charId)
  if (targetCount === 0) return false
  return getCompletionCount(charId) === targetCount
}

// Config functions
function isTargeting(charId, objId) {
  return store.isTargeting(charId, objId)
}

function toggleTargeting(charId, objId) {
  store.setTargeting(charId, objId, !store.isTargeting(charId, objId))
}

function enableAllForCharacter(charId) {
  store.setAllTargetsForCharacter(charId, true)
}

function disableAllForCharacter(charId) {
  store.setAllTargetsForCharacter(charId, false)
}

function hasAllTargets(charId) {
  return allObjectives.every(obj => store.isTargeting(charId, obj.id))
}

function toggleAllForCharacter(charId) {
  if (hasAllTargets(charId)) {
    store.setAllTargetsForCharacter(charId, false)
  } else {
    store.setAllTargetsForCharacter(charId, true)
  }
}

// Total stats
const totalMarks = allCharacters.length * allObjectives.length

function getTotalTargeted() {
  let count = 0
  allCharacters.forEach(char => {
    allObjectives.forEach(obj => {
      if (store.isTargeting(char.id, obj.id)) count++
    })
  })
  return count
}

function getTotalCompleted() {
  let count = 0
  allCharacters.forEach(char => {
    allObjectives.forEach(obj => {
      if (store.isTargeting(char.id, obj.id) && store.getCompletion(char.id, obj.id)) count++
    })
  })
  return count
}
</script>

<template>
  <div class="bg-black/90 text-white p-4 max-h-screen overflow-y-auto">
    <div class="max-w-md">
      <!-- Tabs -->
      <div class="flex gap-2 mb-4">
        <button
          @click="activeTab = 'tracker'"
          class="px-3 py-1 text-sm rounded transition-colors"
          :class="activeTab === 'tracker' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
        >
          Tracker
        </button>
        <button
          @click="activeTab = 'config'"
          class="px-3 py-1 text-sm rounded transition-colors"
          :class="activeTab === 'config' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
        >
          Config
        </button>
      </div>

      <!-- Tracker Tab -->
      <div v-if="activeTab === 'tracker'">
        <h2 class="text-lg font-bold mb-4">
          Completion Tracker
          <span class="text-sm font-normal text-gray-400">({{ getTotalCompleted() }}/{{ getTotalTargeted() }})</span>
        </h2>

        <!-- Objective Icons Header -->
        <div class="flex items-center gap-1 mb-2">
          <span class="w-[94px] shrink-0"></span>
          <div
            v-for="obj in allObjectives"
            :key="obj.id"
            class="w-6 h-6 flex items-center justify-center"
          >
            <img
              :src="`/img/${obj.icon}`"
              :alt="obj.name"
              :title="obj.name"
              class="w-4 h-4 object-contain"
            />
          </div>
        </div>

        <!-- Normal Characters -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-400 mb-2">Normal</h3>
          <div class="space-y-1">
            <div
              v-for="char in CHARACTERS.normal"
              :key="char.id"
              class="flex items-center gap-1"
              :class="{ 'opacity-50': isCharacterComplete(char.id) }"
            >
              <span class="w-[100px] shrink-0 text-xs truncate" :title="char.name">
                {{ char.name }}
              </span>
              <button
                v-for="obj in allObjectives"
                :key="obj.id"
                @click="toggleCompletion(char.id, obj.id)"
                :disabled="!isTargeting(char.id, obj.id)"
                class="w-6 h-6 border border-gray-600 rounded flex items-center justify-center transition-colors"
                :class="[
                  !isTargeting(char.id, obj.id) ? 'bg-gray-900 border-gray-800 opacity-30' :
                  isCompleted(char.id, obj.id) ? 'bg-green-600 border-green-500' : 'bg-gray-800 hover:bg-gray-700'
                ]"
                :title="`${char.name} - ${obj.name}`"
              >
                <span v-if="isCompleted(char.id, obj.id) && isTargeting(char.id, obj.id)" class="text-xs">✓</span>
              </button>
              <span class="text-xs text-gray-500 ml-1">
                {{ getCompletionCount(char.id) }}/{{ getTargetCount(char.id) }}
              </span>
            </div>
          </div>
        </div>

        <hr class="border-gray-600 my-4" />

        <!-- Tainted Characters -->
        <div>
          <h3 class="text-sm font-semibold text-gray-400 mb-2">Tainted</h3>
          <div class="space-y-1">
            <div
              v-for="char in CHARACTERS.tainted"
              :key="char.id"
              class="flex items-center gap-1"
              :class="{ 'opacity-50': isCharacterComplete(char.id) }"
            >
              <span class="w-[100px] shrink-0 text-xs truncate" :title="char.name">
                {{ char.name.replace('Tainted ', 'T. ') }}
              </span>
              <button
                v-for="obj in allObjectives"
                :key="obj.id"
                @click="toggleCompletion(char.id, obj.id)"
                :disabled="!isTargeting(char.id, obj.id)"
                class="w-6 h-6 border border-gray-600 rounded flex items-center justify-center transition-colors"
                :class="[
                  !isTargeting(char.id, obj.id) ? 'bg-gray-900 border-gray-800 opacity-30' :
                  isCompleted(char.id, obj.id) ? 'bg-green-600 border-green-500' : 'bg-gray-800 hover:bg-gray-700'
                ]"
                :title="`${char.name} - ${obj.name}`"
              >
                <span v-if="isCompleted(char.id, obj.id) && isTargeting(char.id, obj.id)" class="text-xs">✓</span>
              </button>
              <span class="text-xs text-gray-500 ml-1">
                {{ getCompletionCount(char.id) }}/{{ getTargetCount(char.id) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Config Tab -->
      <div v-if="activeTab === 'config'">
        <h2 class="text-lg font-bold mb-4">
          Target Config
          <span class="text-sm font-normal text-gray-400">({{ getTotalTargeted() }}/{{ totalMarks }})</span>
        </h2>

        <!-- Objective Icons Header -->
        <div class="flex items-center gap-1 mb-2">
          <span class="w-[94px] shrink-0"></span>
          <div
            v-for="obj in allObjectives"
            :key="obj.id"
            class="w-6 h-6 flex items-center justify-center"
          >
            <img
              :src="`/img/${obj.icon}`"
              :alt="obj.name"
              :title="obj.name"
              class="w-4 h-4 object-contain"
            />
          </div>
          <span class="w-12 shrink-0"></span>
        </div>

        <!-- Normal Characters -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-400 mb-2">Normal</h3>
          <div class="space-y-1">
            <div
              v-for="char in CHARACTERS.normal"
              :key="char.id"
              class="flex items-center gap-1"
            >
              <span class="w-[100px] shrink-0 text-xs truncate" :title="char.name">
                {{ char.name }}
              </span>
              <button
                v-for="obj in allObjectives"
                :key="obj.id"
                @click="toggleTargeting(char.id, obj.id)"
                class="w-6 h-6 border border-gray-600 rounded flex items-center justify-center transition-colors"
                :class="isTargeting(char.id, obj.id) ? 'bg-blue-600 border-blue-500' : 'bg-gray-800 hover:bg-gray-700'"
                :title="`${char.name} - ${obj.name}`"
              >
                <span v-if="isTargeting(char.id, obj.id)" class="text-xs">✓</span>
              </button>
              <button
                @click="toggleAllForCharacter(char.id)"
                class="ml-1 px-2 py-0.5 text-xs rounded transition-colors"
                :class="hasAllTargets(char.id) ? 'bg-red-700 hover:bg-red-600' : 'bg-green-700 hover:bg-green-600'"
              >
                {{ hasAllTargets(char.id) ? 'Clear' : 'All' }}
              </button>
            </div>
          </div>
        </div>

        <hr class="border-gray-600 my-4" />

        <!-- Tainted Characters -->
        <div>
          <h3 class="text-sm font-semibold text-gray-400 mb-2">Tainted</h3>
          <div class="space-y-1">
            <div
              v-for="char in CHARACTERS.tainted"
              :key="char.id"
              class="flex items-center gap-1"
            >
              <span class="w-[100px] shrink-0 text-xs truncate" :title="char.name">
                {{ char.name.replace('Tainted ', 'T. ') }}
              </span>
              <button
                v-for="obj in allObjectives"
                :key="obj.id"
                @click="toggleTargeting(char.id, obj.id)"
                class="w-6 h-6 border border-gray-600 rounded flex items-center justify-center transition-colors"
                :class="isTargeting(char.id, obj.id) ? 'bg-blue-600 border-blue-500' : 'bg-gray-800 hover:bg-gray-700'"
                :title="`${char.name} - ${obj.name}`"
              >
                <span v-if="isTargeting(char.id, obj.id)" class="text-xs">✓</span>
              </button>
              <button
                @click="toggleAllForCharacter(char.id)"
                class="ml-1 px-2 py-0.5 text-xs rounded transition-colors"
                :class="hasAllTargets(char.id) ? 'bg-red-700 hover:bg-red-600' : 'bg-green-700 hover:bg-green-600'"
              >
                {{ hasAllTargets(char.id) ? 'Clear' : 'All' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
