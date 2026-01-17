import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { useRandomizer } from '@/composables/useRandomizer'
import { ALL_CHARACTERS, OBJECTIVES, TIMED_OBJECTIVES, CHALLENGES } from '@/constants/gameData'

describe('useRandomizer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('randomize', () => {
    it('should return a result with player and objective', () => {
      const { randomize } = useRandomizer()
      const result = randomize()

      expect(result.players).toHaveLength(1)
      expect(result.objectives).toHaveLength(1)
      expect(result.gameChallenge).toBeNull()
    })

    it('should return valid character from available pool', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      // Disable all targets except Isaac + g1
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })
      store.setTargeting('c1', 'g1', true)

      const result = randomize()

      expect(result.players[0].id).toBe('c1')
      expect(result.players[0].name).toBe('Isaac')
    })

    it('should return valid objective from available pool', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      // Disable all targets except c1 + g1
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })
      store.setTargeting('c1', 'g1', true)
      store.timedAsExtra = true

      const result = randomize()

      expect(result.objectives[0].id).toBe('g1')
    })

    it('should throw error when no objectives available', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      // Disable all targets
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })
      store.gameChallengesEnabled = false

      expect(() => randomize()).toThrow('No objectives or challenges available')
    })

    it('should respect completion check', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      // Disable all targets except c1 + g1
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })
      store.setTargeting('c1', 'g1', true)
      store.gameChallengesEnabled = false

      // Mark as complete
      store.setCompletion('c1', 'g1', true)
      store.completionCheck = true

      expect(() => randomize()).toThrow()
    })

    it('should include timed objectives as extras when timedAsExtra is true', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      store.timedAsExtra = true
      store.timedEnabled = true
      store.timedChance = 100 // Guarantee timed objectives

      // Run multiple times to increase chance of getting timed objectives
      let foundTimed = false
      for (let i = 0; i < 20; i++) {
        const result = randomize()
        if (result.timedObjectives.length > 0) {
          foundTimed = true
          break
        }
      }

      expect(foundTimed).toBe(true)
    })
  })

  describe('game challenges', () => {
    it('should select game challenge when enabled', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      store.gameChallengesEnabled = true

      // Disable all character/objective combos to force challenge selection
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })

      const result = randomize()

      expect(result.gameChallenge).not.toBeNull()
      expect(result.players).toHaveLength(0)
    })
  })

  describe('extra challenges', () => {
    it('should add extra challenges based on chance', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      store.challengeEnabled = true
      store.challengeChance = 100 // Guarantee at least one challenge
      store.selectedChallenges = new Set(CHALLENGES.map(c => c.id))

      // Run multiple times
      let foundChallenge = false
      for (let i = 0; i < 10; i++) {
        const result = randomize()
        if (result.challenges.length > 0) {
          foundChallenge = true
          break
        }
      }

      expect(foundChallenge).toBe(true)
    })

    it('should respect challenge incompatibilities', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      // Disable all targets except c1 + g4 (Ultra Greed)
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })
      store.setTargeting('c1', 'g4', true)
      store.timedAsExtra = true
      store.challengeEnabled = true
      store.challengeChance = 100
      store.selectedChallenges = new Set(['ch10']) // Alternate path only (incompatible with g4)

      // Run multiple times
      for (let i = 0; i < 10; i++) {
        const result = randomize()
        // ch10 should never appear with g4
        const hasCh10 = result.challenges.some(c => c.id === 'ch10')
        expect(hasCh10).toBe(false)
      }
    })
  })

  describe('markCurrentAsComplete', () => {
    it('should mark current result as complete', () => {
      const store = useGameStore()
      const { randomize, markCurrentAsComplete } = useRandomizer()

      // Disable all targets except c1 + g1
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })
      store.setTargeting('c1', 'g1', true)
      store.timedAsExtra = true

      randomize()
      markCurrentAsComplete()

      expect(store.getCompletion('c1', 'g1')).toBe(true)
    })

    it('should mark game challenge as complete', () => {
      const store = useGameStore()
      const { randomize, markCurrentAsComplete } = useRandomizer()

      store.gameChallengesEnabled = true

      // Disable all to force game challenge
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })

      const result = randomize()
      markCurrentAsComplete()

      expect(store.getGameChallengeCompletion(result.gameChallenge.id)).toBe(true)
    })
  })

  describe('helper functions', () => {
    it('should get character by id', () => {
      const { getCharacterById } = useRandomizer()

      const isaac = getCharacterById('c1')
      expect(isaac.name).toBe('Isaac')

      const taintedIsaac = getCharacterById('c18')
      expect(taintedIsaac.name).toBe('Tainted Isaac')
    })

    it('should get objective by id', () => {
      const { getObjectiveById } = useRandomizer()

      const blueBaby = getObjectiveById('g1')
      expect(blueBaby.name).toBe('???')

      const bossRush = getObjectiveById('t1')
      expect(bossRush.name).toBe('Boss Rush')
      expect(bossRush.isTimed).toBe(true)
    })

    it('should get challenge by id', () => {
      const { getChallengeById } = useRandomizer()

      const challenge = getChallengeById('ch1')
      expect(challenge.name).toBe('No using consumables')
    })
  })

  describe('stats tracking', () => {
    it('should increment character stat on randomize', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      // Disable all targets except c1 + g1
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })
      store.setTargeting('c1', 'g1', true)
      store.timedAsExtra = true

      randomize()

      expect(store.characterStats['c1']).toBe(1)
    })

    it('should increment objective stat on randomize', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      // Disable all targets except c1 + g1
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })
      store.setTargeting('c1', 'g1', true)
      store.timedAsExtra = true

      randomize()

      expect(store.objectiveStats['g1']).toBe(1)
    })

    it('should increment timed objective stats when rolled as extra', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      // Disable all targets except c1 + g1 + t1 + t2
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })
      store.setTargeting('c1', 'g1', true)
      store.setTargeting('c1', 't1', true)
      store.setTargeting('c1', 't2', true)

      store.timedAsExtra = true
      store.timedEnabled = true
      store.timedChance = 100 // Guarantee timed objectives

      // Run multiple times to ensure timed objectives are tracked
      for (let i = 0; i < 5; i++) {
        randomize()
      }

      // Main objective should always be incremented
      expect(store.objectiveStats['g1']).toBe(5)

      // Timed objectives should have some increments (with 100% chance)
      const timedTotal = (store.objectiveStats['t1'] || 0) + (store.objectiveStats['t2'] || 0)
      expect(timedTotal).toBeGreaterThan(0)
    })

    it('should increment stats even with skipSet=true', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      // Disable all targets except c1 + g1
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })
      store.setTargeting('c1', 'g1', true)
      store.timedAsExtra = true

      // Call with skipSet=true (like RandomizeButton does for animation)
      randomize(true)

      expect(store.characterStats['c1']).toBe(1)
      expect(store.objectiveStats['g1']).toBe(1)
    })

    it('should accumulate stats over multiple randomizations', () => {
      const store = useGameStore()
      const { randomize } = useRandomizer()

      // Disable all targets except c1 + g1
      ALL_CHARACTERS.forEach(char => {
        OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
        TIMED_OBJECTIVES.forEach(obj => {
          store.setTargeting(char.id, obj.id, false)
        })
      })
      store.setTargeting('c1', 'g1', true)
      store.timedAsExtra = true

      randomize()
      randomize()
      randomize()

      expect(store.characterStats['c1']).toBe(3)
      expect(store.objectiveStats['g1']).toBe(3)
    })
  })
})
