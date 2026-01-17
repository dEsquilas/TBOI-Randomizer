<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { CHARACTERS, OBJECTIVES, TIMED_OBJECTIVES, GAME_CHALLENGES, ALL_GAME_CHALLENGES } from '@/constants/gameData'

const store = useGameStore()

const activeTab = ref('tracker') // 'tracker' | 'config' | 'stats'

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

function hasAllTargetsForObjective(objId) {
  return allCharacters.every(char => store.isTargeting(char.id, objId))
}

function toggleAllForObjective(objId) {
  const enableAll = !hasAllTargetsForObjective(objId)
  allCharacters.forEach(char => {
    store.setTargeting(char.id, objId, enableAll)
  })
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

// Game challenge functions
function isChallengeCompleted(challengeId) {
  return store.getGameChallengeCompletion(challengeId)
}

function toggleChallengeCompletion(challengeId) {
  const current = store.getGameChallengeCompletion(challengeId)
  store.setGameChallengeCompletion(challengeId, !current)
}

function isChallengeTargeting(challengeId) {
  return store.isGameChallengeTargeting(challengeId)
}

function toggleChallengeTargeting(challengeId) {
  store.setGameChallengeTargeting(challengeId, !store.isGameChallengeTargeting(challengeId))
}

function getChallengeStats() {
  const targeted = ALL_GAME_CHALLENGES.filter(ch => store.isGameChallengeTargeting(ch.id)).length
  const completed = ALL_GAME_CHALLENGES.filter(ch =>
    store.isGameChallengeTargeting(ch.id) && store.getGameChallengeCompletion(ch.id)
  ).length
  return { targeted, completed }
}

function hasAllChallengeTargets() {
  return ALL_GAME_CHALLENGES.every(ch => store.isGameChallengeTargeting(ch.id))
}

function toggleAllChallengeTargets() {
  if (hasAllChallengeTargets()) {
    store.setAllGameChallengeTargets(false)
  } else {
    store.setAllGameChallengeTargets(true)
  }
}

// Stats functions
const showAddRun = ref(false)
const showStatButtons = ref(false)
const manualCharacter = ref('')
const manualObjective = ref('')
const manualBossRush = ref(false)
const manualHush = ref(false)

function addManualRun() {
  if (!manualCharacter.value || !manualObjective.value) return

  store.incrementCharacterStat(manualCharacter.value)
  store.incrementObjectiveStat(manualObjective.value)

  if (manualBossRush.value) {
    store.incrementObjectiveStat('t1') // Boss Rush
  }
  if (manualHush.value) {
    store.incrementObjectiveStat('t2') // Hush
  }

  // Reset form
  manualCharacter.value = ''
  manualObjective.value = ''
  manualBossRush.value = false
  manualHush.value = false
}

const sortedCharacterStats = computed(() => {
  return allCharacters
    .map(char => ({
      ...char,
      count: store.characterStats[char.id] || 0
    }))
    .filter(char => char.count > 0)
    .sort((a, b) => b.count - a.count)
})

const sortedObjectiveStats = computed(() => {
  return allObjectives
    .map(obj => ({
      ...obj,
      count: store.objectiveStats[obj.id] || 0
    }))
    .filter(obj => obj.count > 0)
    .sort((a, b) => b.count - a.count)
})

function getTotalCharacterRolls() {
  return Object.values(store.characterStats).reduce((sum, count) => sum + count, 0)
}

function getTotalObjectiveRolls() {
  return Object.values(store.objectiveStats).reduce((sum, count) => sum + count, 0)
}
</script>

<template>
  <div class="bg-black/90 text-white p-4 min-h-screen max-h-screen overflow-y-auto">
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
        <button
          @click="activeTab = 'stats'"
          class="px-3 py-1 text-sm rounded transition-colors"
          :class="activeTab === 'stats' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
        >
          Stats
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
            class="w-5 h-5 mr-[3px] flex items-center justify-center"
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

        <!-- Game Challenges Section -->
        <template v-if="store.gameChallengesEnabled">
          <hr class="border-gray-600 my-4" />
          <div>
            <h3 class="text-sm font-semibold text-gray-400 mb-2">
              Challenges
              <span class="text-xs font-normal">({{ getChallengeStats().completed }}/{{ getChallengeStats().targeted }})</span>
            </h3>

            <!-- Rebirth Challenges -->
            <div class="mb-4">
              <h4 class="text-sm text-gray-500 mb-2">Rebirth</h4>
              <div class="space-y-2">
                <label
                  v-for="ch in GAME_CHALLENGES.rebirth"
                  :key="ch.id"
                  class="flex items-center gap-3 cursor-pointer"
                  :class="{ 'opacity-30': !isChallengeTargeting(ch.id) }"
                >
                  <input
                    type="checkbox"
                    :checked="isChallengeCompleted(ch.id)"
                    :disabled="!isChallengeTargeting(ch.id)"
                    @change="toggleChallengeCompletion(ch.id)"
                    class="cursor-pointer accent-green-600 w-4 h-4"
                  />
                  <span class="text-sm">{{ ch.num }}. {{ ch.name }}</span>
                </label>
              </div>
            </div>

            <!-- Afterbirth Challenges -->
            <div class="mb-4">
              <h4 class="text-sm text-gray-500 mb-2">Afterbirth</h4>
              <div class="space-y-2">
                <label
                  v-for="ch in GAME_CHALLENGES.afterbirth"
                  :key="ch.id"
                  class="flex items-center gap-3 cursor-pointer"
                  :class="{ 'opacity-30': !isChallengeTargeting(ch.id) }"
                >
                  <input
                    type="checkbox"
                    :checked="isChallengeCompleted(ch.id)"
                    :disabled="!isChallengeTargeting(ch.id)"
                    @change="toggleChallengeCompletion(ch.id)"
                    class="cursor-pointer accent-green-600 w-4 h-4"
                  />
                  <span class="text-sm">{{ ch.num }}. {{ ch.name }}</span>
                </label>
              </div>
            </div>

            <!-- Afterbirth+ Challenges -->
            <div class="mb-4">
              <h4 class="text-sm text-gray-500 mb-2">Afterbirth+</h4>
              <div class="space-y-2">
                <label
                  v-for="ch in GAME_CHALLENGES.afterbirthPlus"
                  :key="ch.id"
                  class="flex items-center gap-3 cursor-pointer"
                  :class="{ 'opacity-30': !isChallengeTargeting(ch.id) }"
                >
                  <input
                    type="checkbox"
                    :checked="isChallengeCompleted(ch.id)"
                    :disabled="!isChallengeTargeting(ch.id)"
                    @change="toggleChallengeCompletion(ch.id)"
                    class="cursor-pointer accent-green-600 w-4 h-4"
                  />
                  <span class="text-sm">{{ ch.num }}. {{ ch.name }}</span>
                </label>
              </div>
            </div>

            <!-- Repentance Challenges -->
            <div>
              <h4 class="text-sm text-gray-500 mb-2">Repentance</h4>
              <div class="space-y-2">
                <label
                  v-for="ch in GAME_CHALLENGES.repentance"
                  :key="ch.id"
                  class="flex items-center gap-3 cursor-pointer"
                  :class="{ 'opacity-30': !isChallengeTargeting(ch.id) }"
                >
                  <input
                    type="checkbox"
                    :checked="isChallengeCompleted(ch.id)"
                    :disabled="!isChallengeTargeting(ch.id)"
                    @change="toggleChallengeCompletion(ch.id)"
                    class="cursor-pointer accent-green-600 w-4 h-4"
                  />
                  <span class="text-sm">{{ ch.num }}. {{ ch.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Config Tab -->
      <div v-if="activeTab === 'config'">
        <h2 class="text-lg font-bold mb-4">
          Target Config
          <span class="text-sm font-normal text-gray-400">({{ getTotalTargeted() }}/{{ totalMarks }})</span>
        </h2>

        <!-- Objective Icons Header -->
        <div class="flex items-center gap-1 mb-2">
          <span class="w-[100px] shrink-0"></span>
          <button
            v-for="obj in allObjectives"
            :key="obj.id"
            @click="toggleAllForObjective(obj.id)"
            class="w-5 h-6 border border-transparent flex items-center justify-center cursor-pointer hover:bg-gray-700 rounded transition-colors"
            :class="hasAllTargetsForObjective(obj.id) ? 'bg-blue-600/30' : ''"
            :title="`Toggle ${obj.name} for all characters`"
          >
            <img
              :src="`/img/${obj.icon}`"
              :alt="obj.name"
              class="w-4 h-4 object-contain"
            />
          </button>
          <span class="shrink-0"></span>
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
                class="ml-1 w-10 py-0.5 text-xs rounded transition-colors text-center"
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
                class="ml-1 w-10 py-0.5 text-xs rounded transition-colors text-center"
                :class="hasAllTargets(char.id) ? 'bg-red-700 hover:bg-red-600' : 'bg-green-700 hover:bg-green-600'"
              >
                {{ hasAllTargets(char.id) ? 'Clear' : 'All' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Game Challenges Config Section -->
        <template v-if="store.gameChallengesEnabled">
          <hr class="border-gray-600 my-4" />
          <div>
            <h3 class="text-sm font-semibold text-gray-400 mb-2">
              Challenges Config
              <span class="text-xs font-normal">({{ getChallengeStats().targeted }}/45)</span>
            </h3>

            <div class="flex gap-2 mb-3">
              <button
                @click="toggleAllChallengeTargets()"
                class="w-20 py-0.5 text-xs rounded transition-colors text-center"
                :class="hasAllChallengeTargets() ? 'bg-red-700 hover:bg-red-600' : 'bg-green-700 hover:bg-green-600'"
              >
                {{ hasAllChallengeTargets() ? 'Clear All' : 'Select All' }}
              </button>
            </div>

            <!-- Rebirth Challenges -->
            <div class="mb-4">
              <h4 class="text-sm text-gray-500 mb-2">Rebirth</h4>
              <div class="space-y-2">
                <label
                  v-for="ch in GAME_CHALLENGES.rebirth"
                  :key="ch.id"
                  class="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="isChallengeTargeting(ch.id)"
                    @change="toggleChallengeTargeting(ch.id)"
                    class="cursor-pointer accent-blue-600 w-4 h-4"
                  />
                  <span class="text-sm">{{ ch.num }}. {{ ch.name }}</span>
                </label>
              </div>
            </div>

            <!-- Afterbirth Challenges -->
            <div class="mb-4">
              <h4 class="text-sm text-gray-500 mb-2">Afterbirth</h4>
              <div class="space-y-2">
                <label
                  v-for="ch in GAME_CHALLENGES.afterbirth"
                  :key="ch.id"
                  class="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="isChallengeTargeting(ch.id)"
                    @change="toggleChallengeTargeting(ch.id)"
                    class="cursor-pointer accent-blue-600 w-4 h-4"
                  />
                  <span class="text-sm">{{ ch.num }}. {{ ch.name }}</span>
                </label>
              </div>
            </div>

            <!-- Afterbirth+ Challenges -->
            <div class="mb-4">
              <h4 class="text-sm text-gray-500 mb-2">Afterbirth+</h4>
              <div class="space-y-2">
                <label
                  v-for="ch in GAME_CHALLENGES.afterbirthPlus"
                  :key="ch.id"
                  class="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="isChallengeTargeting(ch.id)"
                    @change="toggleChallengeTargeting(ch.id)"
                    class="cursor-pointer accent-blue-600 w-4 h-4"
                  />
                  <span class="text-sm">{{ ch.num }}. {{ ch.name }}</span>
                </label>
              </div>
            </div>

            <!-- Repentance Challenges -->
            <div>
              <h4 class="text-sm text-gray-500 mb-2">Repentance</h4>
              <div class="space-y-2">
                <label
                  v-for="ch in GAME_CHALLENGES.repentance"
                  :key="ch.id"
                  class="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="isChallengeTargeting(ch.id)"
                    @change="toggleChallengeTargeting(ch.id)"
                    class="cursor-pointer accent-blue-600 w-4 h-4"
                  />
                  <span class="text-sm">{{ ch.num }}. {{ ch.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Stats Tab -->
      <div v-if="activeTab === 'stats'">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">Roll Stats</h2>
          <button
            @click="showStatButtons = !showStatButtons"
            class="px-2 py-1 text-xs rounded transition-colors"
            :class="showStatButtons ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'"
          >
            +/-
          </button>
        </div>

        <!-- Character Stats -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-gray-400 mb-2">
            Characters
            <span class="text-xs font-normal">({{ getTotalCharacterRolls() }} rolls)</span>
          </h3>

          <div v-if="sortedCharacterStats.length === 0" class="text-gray-500 text-sm">
            No characters rolled yet
          </div>

          <div class="space-y-1">
            <div
              v-for="(char, index) in sortedCharacterStats"
              :key="char.id"
              class="flex items-center gap-2"
            >
              <span class="w-6 text-xs text-gray-500 text-right">{{ index + 1 }}.</span>
              <span class="flex-1 text-sm truncate" :title="char.name">
                {{ char.name.replace('Tainted ', 'T. ') }}
              </span>
              <span class="w-8 text-sm text-right font-mono">{{ char.count }}</span>
              <div v-if="showStatButtons" class="flex gap-1">
                <button
                  @click="store.incrementCharacterStat(char.id)"
                  class="w-6 h-6 bg-green-700 hover:bg-green-600 rounded text-xs transition-colors"
                >
                  +
                </button>
                <button
                  @click="store.decrementCharacterStat(char.id)"
                  class="w-6 h-6 bg-red-700 hover:bg-red-600 rounded text-xs transition-colors"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr class="border-gray-600 my-4" />

        <!-- Objective Stats -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-gray-400 mb-2">
            Objectives
            <span class="text-xs font-normal">({{ getTotalObjectiveRolls() }} rolls)</span>
          </h3>

          <div v-if="sortedObjectiveStats.length === 0" class="text-gray-500 text-sm">
            No objectives rolled yet
          </div>

          <div class="space-y-1">
            <div
              v-for="(obj, index) in sortedObjectiveStats"
              :key="obj.id"
              class="flex items-center gap-2"
            >
              <span class="w-6 text-xs text-gray-500 text-right">{{ index + 1 }}.</span>
              <img
                :src="`/img/${obj.icon}`"
                :alt="obj.name"
                class="w-4 h-4 object-contain"
              />
              <span class="flex-1 text-sm truncate" :title="obj.name">
                {{ obj.name }}
              </span>
              <span class="w-8 text-sm text-right font-mono">{{ obj.count }}</span>
              <div v-if="showStatButtons" class="flex gap-1">
                <button
                  @click="store.incrementObjectiveStat(obj.id)"
                  class="w-6 h-6 bg-green-700 hover:bg-green-600 rounded text-xs transition-colors"
                >
                  +
                </button>
                <button
                  @click="store.decrementObjectiveStat(obj.id)"
                  class="w-6 h-6 bg-red-700 hover:bg-red-600 rounded text-xs transition-colors"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr class="border-gray-600 my-4" />

        <!-- Add Manual Run -->
        <div class="mb-4">
          <button
            @click="showAddRun = !showAddRun"
            class="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2 hover:text-gray-300 transition-colors"
          >
            <span>{{ showAddRun ? '▼' : '▶' }}</span>
            Add Run
          </button>

          <div v-if="showAddRun" class="space-y-2">
            <!-- Character Select -->
            <select
              v-model="manualCharacter"
              class="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
            >
              <option value="">Select character...</option>
              <optgroup label="Normal">
                <option v-for="char in CHARACTERS.normal" :key="char.id" :value="char.id">
                  {{ char.name }}
                </option>
              </optgroup>
              <optgroup label="Tainted">
                <option v-for="char in CHARACTERS.tainted" :key="char.id" :value="char.id">
                  {{ char.name }}
                </option>
              </optgroup>
            </select>

            <!-- Objective Select -->
            <select
              v-model="manualObjective"
              class="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
            >
              <option value="">Select objective...</option>
              <option v-for="obj in OBJECTIVES" :key="obj.id" :value="obj.id">
                {{ obj.name }}
              </option>
            </select>

            <!-- Timed Objectives -->
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="manualBossRush"
                  class="accent-blue-600"
                />
                <span class="text-sm">Boss Rush</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="manualHush"
                  class="accent-blue-600"
                />
                <span class="text-sm">Hush</span>
              </label>
            </div>

            <!-- Add Button -->
            <button
              @click="addManualRun"
              :disabled="!manualCharacter || !manualObjective"
              class="w-full py-1.5 bg-blue-700 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded text-sm transition-colors"
            >
              Add Run
            </button>
          </div>
        </div>

        <hr class="border-gray-600 my-4" />

        <!-- Reset Button -->
        <button
          @click="store.resetStats()"
          class="w-full py-2 bg-red-700 hover:bg-red-600 rounded text-sm transition-colors"
        >
          Reset Stats
        </button>
      </div>
    </div>
  </div>
</template>
