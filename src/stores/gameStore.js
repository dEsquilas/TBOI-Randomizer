import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ALL_CHARACTERS, OBJECTIVES, TIMED_OBJECTIVES, CHALLENGES, CUSTOM_CHARACTER_COUNT } from '@/constants/gameData'

export const useGameStore = defineStore('game', () => {
  // Chroma settings
  const chromaStyle = ref('full') // 'full' | 'simpleA' | 'simpleB' | 'plainText'
  const chromaAlignment = ref('left') // 'left' | 'center' | 'right'
  const chromaTextColor = ref('FFFFFF')
  const chromaBgColor = ref('00FF00')

  // Game settings
  const numberPlayers = ref(1)
  const duplicateCheck = ref(false)
  const completionCheck = ref(false)

  // Characters
  const selectedCharacters = ref(new Set(ALL_CHARACTERS.map(c => c.id)))
  const characterWeights = ref(
    Object.fromEntries(ALL_CHARACTERS.map(c => [c.id, 1.0]))
  )
  const weightsVisible = ref(false)

  // Custom characters
  const customCharactersEnabled = ref(false)
  const customCharactersVisible = ref(false)
  const customCharacters = ref(
    Array.from({ length: CUSTOM_CHARACTER_COUNT }, (_, i) => ({
      id: `customc${i + 1}`,
      enabled: false,
      name: '',
      weight: 1.0
    }))
  )

  // Objectives
  const selectedObjectives = ref(new Set(OBJECTIVES.map(o => o.id)))
  const objectiveWeights = ref(
    Object.fromEntries(OBJECTIVES.map(o => [o.id, 1.0]))
  )
  const objectiveWeightsVisible = ref(false)

  // Timed objectives
  const timedEnabled = ref(true)
  const timedChance = ref(50)
  const selectedTimedObjectives = ref(new Set(TIMED_OBJECTIVES.map(t => t.id)))

  // Challenges
  const challengeEnabled = ref(false)
  const challengeChance = ref(20)
  const selectedChallenges = ref(new Set(CHALLENGES.map(c => c.id)))

  // Completion tracking
  const completion = ref({})
  // Completion targets - which objectives each character is targeting (all enabled by default)
  const completionTargets = ref({})

  // UI state
  const isRandomizing = ref(false)
  const isSpinning = ref(false)
  const optionsPanelOpen = ref(false)

  // Spinning animation state
  const spinningPlayers = ref([])
  const spinningObjectives = ref([])

  // Results
  const results = ref({
    players: [],
    objectives: [],
    challenges: []
  })

  // Computed
  const allCharacterIds = computed(() => [
    ...ALL_CHARACTERS.map(c => c.id),
    ...customCharacters.value.filter(c => c.enabled && c.name).map(c => c.id)
  ])

  const selectedCharacterCount = computed(() => {
    let count = selectedCharacters.value.size
    if (customCharactersEnabled.value) {
      count += customCharacters.value.filter(c => c.enabled && c.name).length
    }
    return count
  })

  const selectedObjectiveCount = computed(() => selectedObjectives.value.size)

  // Actions
  function toggleCharacter(id) {
    if (selectedCharacters.value.has(id)) {
      selectedCharacters.value.delete(id)
    } else {
      selectedCharacters.value.add(id)
    }
    selectedCharacters.value = new Set(selectedCharacters.value)
  }

  function toggleObjective(id) {
    if (selectedObjectives.value.has(id)) {
      selectedObjectives.value.delete(id)
    } else {
      selectedObjectives.value.add(id)
    }
    selectedObjectives.value = new Set(selectedObjectives.value)
  }

  function toggleTimedObjective(id) {
    if (selectedTimedObjectives.value.has(id)) {
      selectedTimedObjectives.value.delete(id)
    } else {
      selectedTimedObjectives.value.add(id)
    }
    selectedTimedObjectives.value = new Set(selectedTimedObjectives.value)
  }

  function toggleChallenge(id) {
    if (selectedChallenges.value.has(id)) {
      selectedChallenges.value.delete(id)
    } else {
      selectedChallenges.value.add(id)
    }
    selectedChallenges.value = new Set(selectedChallenges.value)
  }

  function setCharacterWeight(id, weight) {
    characterWeights.value[id] = Math.max(0.1, Math.min(1.0, weight))
  }

  function setObjectiveWeight(id, weight) {
    objectiveWeights.value[id] = Math.max(0.1, Math.min(1.0, weight))
  }

  function selectAllCharacters() {
    selectedCharacters.value = new Set(ALL_CHARACTERS.map(c => c.id))
  }

  function selectNormalCharacters() {
    selectedCharacters.value = new Set(
      ALL_CHARACTERS.filter((_, i) => i < 17).map(c => c.id)
    )
  }

  function selectTaintedCharacters() {
    selectedCharacters.value = new Set(
      ALL_CHARACTERS.filter((_, i) => i >= 17).map(c => c.id)
    )
  }

  function deselectAllCharacters() {
    selectedCharacters.value = new Set()
  }

  function selectAllObjectives() {
    selectedObjectives.value = new Set(OBJECTIVES.map(o => o.id))
  }

  function deselectAllObjectives() {
    selectedObjectives.value = new Set()
  }

  function selectAllChallenges() {
    selectedChallenges.value = new Set(CHALLENGES.map(c => c.id))
  }

  function deselectAllChallenges() {
    selectedChallenges.value = new Set()
  }

  function resetAllWeights() {
    characterWeights.value = Object.fromEntries(ALL_CHARACTERS.map(c => [c.id, 1.0]))
    customCharacters.value.forEach(c => { c.weight = 1.0 })
  }

  function resetObjectiveWeights() {
    objectiveWeights.value = Object.fromEntries(OBJECTIVES.map(o => [o.id, 1.0]))
  }

  function applyPreset(preset) {
    selectedCharacters.value = new Set(preset.characters)
    selectedObjectives.value = new Set(preset.objectives)
    selectedTimedObjectives.value = new Set(preset.timedObjectives)
  }

  function setCompletion(charId, goalId, completed) {
    const key = `${charId}_${goalId}`
    completion.value[key] = completed
  }

  function getCompletion(charId, goalId) {
    const key = `${charId}_${goalId}`
    return completion.value[key] || false
  }

  function isTargeting(charId, goalId) {
    const key = `${charId}_${goalId}`
    // Default is true (all objectives enabled by default)
    return completionTargets.value[key] !== false
  }

  function setTargeting(charId, goalId, targeting) {
    const key = `${charId}_${goalId}`
    completionTargets.value[key] = targeting
  }

  function setAllTargetsForCharacter(charId, targeting) {
    const allObjectives = [...OBJECTIVES, ...TIMED_OBJECTIVES]
    allObjectives.forEach(obj => {
      const key = `${charId}_${obj.id}`
      completionTargets.value[key] = targeting
    })
  }

  function setResults(newResults) {
    results.value = newResults
  }

  function clearResults() {
    results.value = { players: [], objectives: [], challenges: [] }
  }

  // Export state for localStorage
  function exportState() {
    return {
      chromaStyle: chromaStyle.value,
      chromaAlignment: chromaAlignment.value,
      chromaTextColor: chromaTextColor.value,
      chromaBgColor: chromaBgColor.value,
      numberPlayers: numberPlayers.value,
      duplicateCheck: duplicateCheck.value,
      completionCheck: completionCheck.value,
      selectedCharacters: [...selectedCharacters.value],
      characterWeights: characterWeights.value,
      weightsVisible: weightsVisible.value,
      customCharactersEnabled: customCharactersEnabled.value,
      customCharactersVisible: customCharactersVisible.value,
      customCharacters: customCharacters.value,
      selectedObjectives: [...selectedObjectives.value],
      objectiveWeights: objectiveWeights.value,
      objectiveWeightsVisible: objectiveWeightsVisible.value,
      timedEnabled: timedEnabled.value,
      timedChance: timedChance.value,
      selectedTimedObjectives: [...selectedTimedObjectives.value],
      challengeEnabled: challengeEnabled.value,
      challengeChance: challengeChance.value,
      selectedChallenges: [...selectedChallenges.value],
      completion: completion.value,
      completionTargets: completionTargets.value
    }
  }

  // Import state from localStorage
  function importState(state) {
    if (state.chromaStyle) chromaStyle.value = state.chromaStyle
    if (state.chromaAlignment) chromaAlignment.value = state.chromaAlignment
    if (state.chromaTextColor) chromaTextColor.value = state.chromaTextColor
    if (state.chromaBgColor) chromaBgColor.value = state.chromaBgColor
    if (state.numberPlayers) numberPlayers.value = state.numberPlayers
    if (state.duplicateCheck !== undefined) duplicateCheck.value = state.duplicateCheck
    if (state.completionCheck !== undefined) completionCheck.value = state.completionCheck
    if (state.selectedCharacters) selectedCharacters.value = new Set(state.selectedCharacters)
    if (state.characterWeights) characterWeights.value = state.characterWeights
    if (state.weightsVisible !== undefined) weightsVisible.value = state.weightsVisible
    if (state.customCharactersEnabled !== undefined) customCharactersEnabled.value = state.customCharactersEnabled
    if (state.customCharactersVisible !== undefined) customCharactersVisible.value = state.customCharactersVisible
    if (state.customCharacters) customCharacters.value = state.customCharacters
    if (state.selectedObjectives) selectedObjectives.value = new Set(state.selectedObjectives)
    if (state.objectiveWeights) objectiveWeights.value = state.objectiveWeights
    if (state.objectiveWeightsVisible !== undefined) objectiveWeightsVisible.value = state.objectiveWeightsVisible
    if (state.timedEnabled !== undefined) timedEnabled.value = state.timedEnabled
    if (state.timedChance) timedChance.value = state.timedChance
    if (state.selectedTimedObjectives) selectedTimedObjectives.value = new Set(state.selectedTimedObjectives)
    if (state.challengeEnabled !== undefined) challengeEnabled.value = state.challengeEnabled
    if (state.challengeChance) challengeChance.value = state.challengeChance
    if (state.selectedChallenges) selectedChallenges.value = new Set(state.selectedChallenges)
    if (state.completion) completion.value = state.completion
    if (state.completionTargets) completionTargets.value = state.completionTargets
  }

  return {
    // Chroma
    chromaStyle,
    chromaAlignment,
    chromaTextColor,
    chromaBgColor,
    // Game settings
    numberPlayers,
    duplicateCheck,
    completionCheck,
    // Characters
    selectedCharacters,
    characterWeights,
    weightsVisible,
    // Custom characters
    customCharactersEnabled,
    customCharactersVisible,
    customCharacters,
    // Objectives
    selectedObjectives,
    objectiveWeights,
    objectiveWeightsVisible,
    // Timed
    timedEnabled,
    timedChance,
    selectedTimedObjectives,
    // Challenges
    challengeEnabled,
    challengeChance,
    selectedChallenges,
    // Completion
    completion,
    completionTargets,
    // UI
    isRandomizing,
    isSpinning,
    optionsPanelOpen,
    // Spinning
    spinningPlayers,
    spinningObjectives,
    // Results
    results,
    // Computed
    allCharacterIds,
    selectedCharacterCount,
    selectedObjectiveCount,
    // Actions
    toggleCharacter,
    toggleObjective,
    toggleTimedObjective,
    toggleChallenge,
    setCharacterWeight,
    setObjectiveWeight,
    selectAllCharacters,
    selectNormalCharacters,
    selectTaintedCharacters,
    deselectAllCharacters,
    selectAllObjectives,
    deselectAllObjectives,
    selectAllChallenges,
    deselectAllChallenges,
    resetAllWeights,
    resetObjectiveWeights,
    applyPreset,
    setCompletion,
    getCompletion,
    isTargeting,
    setTargeting,
    setAllTargetsForCharacter,
    setResults,
    clearResults,
    exportState,
    importState
  }
})
