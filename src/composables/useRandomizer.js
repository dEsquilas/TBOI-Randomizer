import { useGameStore } from '@/stores/gameStore'
import { ALL_CHARACTERS, OBJECTIVES, TIMED_OBJECTIVES, CHALLENGES, CHALLENGE_INCOMPATIBILITIES, ALL_GAME_CHALLENGES } from '@/constants/gameData'

export function useRandomizer() {
  const store = useGameStore()

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function buildWeightedArray(items, weights, selected) {
    const result = []

    items.forEach(item => {
      if (!selected.has(item.id)) return

      const weight = weights[item.id] || 1.0
      const count = Math.round(weight * 10)

      for (let i = 0; i < count; i++) {
        result.push(item)
      }
    })

    return result
  }

  function getCharacterById(id) {
    // Check regular characters
    const char = ALL_CHARACTERS.find(c => c.id === id)
    if (char) return char

    // Check custom characters
    const custom = store.customCharacters.find(c => c.id === id)
    if (custom) {
      return { id: custom.id, name: custom.name, isCustom: true }
    }

    return null
  }

  function getObjectiveById(id) {
    const obj = OBJECTIVES.find(o => o.id === id)
    if (obj) return obj

    const timed = TIMED_OBJECTIVES.find(t => t.id === id)
    if (timed) return { ...timed, isTimed: true }

    return null
  }

  function getChallengeById(id) {
    return CHALLENGES.find(c => c.id === id)
  }

  function getGameChallengeById(id) {
    return ALL_GAME_CHALLENGES.find(c => c.id === id)
  }

  function randomize(skipSet = false) {
    const checkCompletion = store.completionCheck
    const allObjectives = [...OBJECTIVES, ...TIMED_OBJECTIVES]

    // Build pool of available objectives from targets (panel derecho)
    // An objective is available if at least one character has it targeted (and not completed if checkCompletion)
    const availableObjectives = allObjectives.filter(obj => {
      // Check if any character has this objective targeted and not completed
      return ALL_CHARACTERS.some(char => {
        const isTargeted = store.isTargeting(char.id, obj.id)
        if (!isTargeted) return false
        if (checkCompletion && store.getCompletion(char.id, obj.id)) return false
        return true
      })
    })

    // Build pool of available game challenges
    let availableGameChallenges = []
    if (store.gameChallengesEnabled) {
      availableGameChallenges = ALL_GAME_CHALLENGES.filter(ch => {
        if (!store.isGameChallengeTargeting(ch.id)) return false
        if (checkCompletion && store.getGameChallengeCompletion(ch.id)) return false
        return true
      })
    }

    // Total options: each objective + challenges as ONE option (if available)
    const hasGameChallenges = availableGameChallenges.length > 0
    const totalOptions = availableObjectives.length + (hasGameChallenges ? 1 : 0)

    if (totalOptions === 0) {
      throw new Error('No objectives or challenges available. Check your target config.')
    }

    // Roll for what to do
    const roll = randomInt(0, totalOptions - 1)

    // Check if game challenge was selected
    if (hasGameChallenges && roll === availableObjectives.length) {
      // Game challenge selected!
      const challengeIdx = randomInt(0, availableGameChallenges.length - 1)
      const selectedChallenge = availableGameChallenges[challengeIdx]

      const results = {
        players: [],
        objectives: [],
        challenges: [],
        gameChallenge: selectedChallenge
      }

      if (!skipSet) {
        store.setResults(results)
      }

      return results
    }

    // Objective selected - pick which one based on roll
    const selectedObjective = availableObjectives[roll]

    // Find characters that have this objective targeted (and not completed)
    const availableCharacters = ALL_CHARACTERS.filter(char => {
      const isTargeted = store.isTargeting(char.id, selectedObjective.id)
      if (!isTargeted) return false
      if (checkCompletion && store.getCompletion(char.id, selectedObjective.id)) return false
      return true
    })

    if (availableCharacters.length === 0) {
      throw new Error('No characters available for this objective.')
    }

    // Pick random character
    const charIdx = randomInt(0, availableCharacters.length - 1)
    const selectedCharacter = availableCharacters[charIdx]

    // Select extra challenges (restricciones)
    const selectedChallenges = []
    if (store.selectedChallenges.size > 0) {
      const extraChallenges = CHALLENGES.filter(ch => {
        if (!store.selectedChallenges.has(ch.id)) return false
        const incompatible = CHALLENGE_INCOMPATIBILITIES[ch.id]
        if (incompatible && incompatible.includes(selectedObjective.id)) return false
        return true
      })

      extraChallenges.forEach(ch => {
        const chRoll = randomInt(1, 100)
        if (chRoll <= store.challengeChance) {
          selectedChallenges.push(ch)
        }
      })

      if (store.challengeEnabled && selectedChallenges.length === 0 && extraChallenges.length > 0) {
        const idx = randomInt(0, extraChallenges.length - 1)
        selectedChallenges.push(extraChallenges[idx])
      }
    }

    // Build results
    const results = {
      players: [{
        id: selectedCharacter.id,
        name: selectedCharacter.name,
        isCustom: false
      }],
      objectives: [selectedObjective],
      challenges: selectedChallenges,
      gameChallenge: null
    }

    if (!skipSet) {
      store.setResults(results)
    }

    return results
  }

  function markCurrentAsComplete() {
    const { players, objectives, gameChallenge } = store.results

    // If it's a game challenge, mark it as complete
    if (gameChallenge) {
      store.setGameChallengeCompletion(gameChallenge.id, true)
      return
    }

    if (players.length !== 1) return // Only for single player

    const charId = players[0].id
    if (players[0].isCustom) return // Don't track custom characters

    objectives.forEach(obj => {
      store.setCompletion(charId, obj.id, true)
    })
  }

  return {
    randomize,
    markCurrentAsComplete,
    getCharacterById,
    getObjectiveById,
    getChallengeById,
    getGameChallengeById
  }
}
