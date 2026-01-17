import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { ALL_CHARACTERS, OBJECTIVES, TIMED_OBJECTIVES } from '@/constants/gameData'

describe('gameStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have all characters selected by default', () => {
      const store = useGameStore()
      expect(store.selectedCharacters.size).toBe(ALL_CHARACTERS.length)
    })

    it('should have all objectives selected by default', () => {
      const store = useGameStore()
      expect(store.selectedObjectives.size).toBe(OBJECTIVES.length)
    })

    it('should have default chroma settings', () => {
      const store = useGameStore()
      expect(store.chromaStyle).toBe('full')
      expect(store.chromaAlignment).toBe('left')
      expect(store.chromaBgColor).toBe('00FF00')
    })

    it('should have 1 player by default', () => {
      const store = useGameStore()
      expect(store.numberPlayers).toBe(1)
    })

    it('should have textual end disabled by default', () => {
      const store = useGameStore()
      expect(store.textualEndEnabled).toBe(false)
      expect(store.textualEndTextColor).toBe('FFFFFF')
    })
  })

  describe('character actions', () => {
    it('should toggle character selection', () => {
      const store = useGameStore()
      const charId = 'c1'

      expect(store.selectedCharacters.has(charId)).toBe(true)
      store.toggleCharacter(charId)
      expect(store.selectedCharacters.has(charId)).toBe(false)
      store.toggleCharacter(charId)
      expect(store.selectedCharacters.has(charId)).toBe(true)
    })

    it('should select only normal characters', () => {
      const store = useGameStore()
      store.selectNormalCharacters()

      expect(store.selectedCharacters.size).toBe(17)
      expect(store.selectedCharacters.has('c1')).toBe(true) // Isaac
      expect(store.selectedCharacters.has('c18')).toBe(false) // Tainted Isaac
    })

    it('should select only tainted characters', () => {
      const store = useGameStore()
      store.selectTaintedCharacters()

      expect(store.selectedCharacters.size).toBe(17)
      expect(store.selectedCharacters.has('c1')).toBe(false) // Isaac
      expect(store.selectedCharacters.has('c18')).toBe(true) // Tainted Isaac
    })

    it('should deselect all characters', () => {
      const store = useGameStore()
      store.deselectAllCharacters()

      expect(store.selectedCharacters.size).toBe(0)
    })
  })

  describe('objective actions', () => {
    it('should toggle objective selection', () => {
      const store = useGameStore()
      const objId = 'g1'

      expect(store.selectedObjectives.has(objId)).toBe(true)
      store.toggleObjective(objId)
      expect(store.selectedObjectives.has(objId)).toBe(false)
      store.toggleObjective(objId)
      expect(store.selectedObjectives.has(objId)).toBe(true)
    })

    it('should toggle timed objective selection', () => {
      const store = useGameStore()
      const timedId = 't1'

      expect(store.selectedTimedObjectives.has(timedId)).toBe(true)
      store.toggleTimedObjective(timedId)
      expect(store.selectedTimedObjectives.has(timedId)).toBe(false)
    })
  })

  describe('weights', () => {
    it('should set character weight within bounds', () => {
      const store = useGameStore()

      store.setCharacterWeight('c1', 0.5)
      expect(store.characterWeights['c1']).toBe(0.5)

      store.setCharacterWeight('c1', 0.05) // below min
      expect(store.characterWeights['c1']).toBe(0.1)

      store.setCharacterWeight('c1', 1.5) // above max
      expect(store.characterWeights['c1']).toBe(1.0)
    })

    it('should reset all weights to 1.0', () => {
      const store = useGameStore()
      store.setCharacterWeight('c1', 0.5)
      store.setCharacterWeight('c2', 0.3)

      store.resetAllWeights()

      expect(store.characterWeights['c1']).toBe(1.0)
      expect(store.characterWeights['c2']).toBe(1.0)
    })
  })

  describe('completion tracking', () => {
    it('should set and get completion status', () => {
      const store = useGameStore()

      expect(store.getCompletion('c1', 'g1')).toBe(false)
      store.setCompletion('c1', 'g1', true)
      expect(store.getCompletion('c1', 'g1')).toBe(true)
    })

    it('should track targeting status', () => {
      const store = useGameStore()

      // Default is targeting enabled
      expect(store.isTargeting('c1', 'g1')).toBe(true)

      store.setTargeting('c1', 'g1', false)
      expect(store.isTargeting('c1', 'g1')).toBe(false)
    })

    it('should set all targets for a character', () => {
      const store = useGameStore()

      store.setAllTargetsForCharacter('c1', false)

      OBJECTIVES.forEach(obj => {
        expect(store.isTargeting('c1', obj.id)).toBe(false)
      })
      TIMED_OBJECTIVES.forEach(obj => {
        expect(store.isTargeting('c1', obj.id)).toBe(false)
      })
    })
  })

  describe('presets', () => {
    it('should apply rebirth preset', () => {
      const store = useGameStore()
      store.applyPreset({
        characters: ['c1', 'c2', 'c3'],
        objectives: ['g1', 'g2'],
        timedObjectives: []
      })

      expect(store.selectedCharacters.size).toBe(3)
      expect(store.selectedObjectives.size).toBe(2)
      expect(store.selectedTimedObjectives.size).toBe(0)
    })
  })

  describe('export/import state', () => {
    it('should export and import state correctly', () => {
      const store = useGameStore()

      store.chromaStyle = 'simpleA'
      store.numberPlayers = 2
      store.toggleCharacter('c1')

      const exported = store.exportState()

      // Create new store
      setActivePinia(createPinia())
      const newStore = useGameStore()

      newStore.importState(exported)

      expect(newStore.chromaStyle).toBe('simpleA')
      expect(newStore.numberPlayers).toBe(2)
      expect(newStore.selectedCharacters.has('c1')).toBe(false)
    })

    it('should export and import stats correctly', () => {
      const store = useGameStore()

      store.incrementCharacterStat('c1')
      store.incrementCharacterStat('c1')
      store.incrementObjectiveStat('g1')

      const exported = store.exportState()

      // Create new store
      setActivePinia(createPinia())
      const newStore = useGameStore()

      newStore.importState(exported)

      expect(newStore.characterStats['c1']).toBe(2)
      expect(newStore.objectiveStats['g1']).toBe(1)
    })

    it('should export and import textual end settings correctly', () => {
      const store = useGameStore()

      store.textualEndEnabled = true
      store.textualEndTextColor = 'FF0000'

      const exported = store.exportState()

      // Create new store
      setActivePinia(createPinia())
      const newStore = useGameStore()

      newStore.importState(exported)

      expect(newStore.textualEndEnabled).toBe(true)
      expect(newStore.textualEndTextColor).toBe('FF0000')
    })
  })

  describe('stats tracking', () => {
    it('should have empty stats by default', () => {
      const store = useGameStore()
      expect(Object.keys(store.characterStats)).toHaveLength(0)
      expect(Object.keys(store.objectiveStats)).toHaveLength(0)
    })

    it('should increment character stat', () => {
      const store = useGameStore()

      store.incrementCharacterStat('c1')
      expect(store.characterStats['c1']).toBe(1)

      store.incrementCharacterStat('c1')
      expect(store.characterStats['c1']).toBe(2)

      store.incrementCharacterStat('c2')
      expect(store.characterStats['c2']).toBe(1)
    })

    it('should decrement character stat', () => {
      const store = useGameStore()

      store.incrementCharacterStat('c1')
      store.incrementCharacterStat('c1')
      expect(store.characterStats['c1']).toBe(2)

      store.decrementCharacterStat('c1')
      expect(store.characterStats['c1']).toBe(1)

      store.decrementCharacterStat('c1')
      expect(store.characterStats['c1']).toBe(0)
    })

    it('should not decrement below zero', () => {
      const store = useGameStore()

      store.decrementCharacterStat('c1')
      expect(store.characterStats['c1']).toBeUndefined()

      store.incrementCharacterStat('c1')
      store.decrementCharacterStat('c1')
      store.decrementCharacterStat('c1')
      expect(store.characterStats['c1']).toBe(0)
    })

    it('should increment objective stat', () => {
      const store = useGameStore()

      store.incrementObjectiveStat('g1')
      expect(store.objectiveStats['g1']).toBe(1)

      store.incrementObjectiveStat('g1')
      expect(store.objectiveStats['g1']).toBe(2)

      store.incrementObjectiveStat('t1')
      expect(store.objectiveStats['t1']).toBe(1)
    })

    it('should decrement objective stat', () => {
      const store = useGameStore()

      store.incrementObjectiveStat('g1')
      store.incrementObjectiveStat('g1')
      store.decrementObjectiveStat('g1')

      expect(store.objectiveStats['g1']).toBe(1)
    })

    it('should reset all stats', () => {
      const store = useGameStore()

      store.incrementCharacterStat('c1')
      store.incrementCharacterStat('c2')
      store.incrementObjectiveStat('g1')
      store.incrementObjectiveStat('t1')

      store.resetStats()

      expect(Object.keys(store.characterStats)).toHaveLength(0)
      expect(Object.keys(store.objectiveStats)).toHaveLength(0)
    })
  })
})
