// Character data
export const CHARACTERS = {
  normal: [
    { id: 'c1', name: 'Isaac' },
    { id: 'c2', name: 'Magdalene' },
    { id: 'c3', name: 'Cain' },
    { id: 'c4', name: 'Judas' },
    { id: 'c5', name: '???' },
    { id: 'c6', name: 'Eve' },
    { id: 'c7', name: 'Samson' },
    { id: 'c8', name: 'Azazel' },
    { id: 'c9', name: 'Lazarus' },
    { id: 'c10', name: 'Eden' },
    { id: 'c11', name: 'The Lost' },
    { id: 'c12', name: 'Lilith' },
    { id: 'c13', name: 'Keeper' },
    { id: 'c14', name: 'Apollyon' },
    { id: 'c15', name: 'The Forgotten' },
    { id: 'c16', name: 'Bethany' },
    { id: 'c17', name: 'Jacob & Esau' }
  ],
  tainted: [
    { id: 'c18', name: 'Tainted Isaac' },
    { id: 'c19', name: 'Tainted Magdalene' },
    { id: 'c20', name: 'Tainted Cain' },
    { id: 'c21', name: 'Tainted Judas' },
    { id: 'c22', name: 'Tainted ???' },
    { id: 'c23', name: 'Tainted Eve' },
    { id: 'c24', name: 'Tainted Samson' },
    { id: 'c25', name: 'Tainted Azazel' },
    { id: 'c26', name: 'Tainted Lazarus' },
    { id: 'c27', name: 'Tainted Eden' },
    { id: 'c28', name: 'Tainted Lost' },
    { id: 'c29', name: 'Tainted Lilith' },
    { id: 'c30', name: 'Tainted Keeper' },
    { id: 'c31', name: 'Tainted Apollyon' },
    { id: 'c32', name: 'Tainted Forgotten' },
    { id: 'c33', name: 'Tainted Bethany' },
    { id: 'c34', name: 'Tainted Jacob' }
  ]
}

// All characters flat array
export const ALL_CHARACTERS = [...CHARACTERS.normal, ...CHARACTERS.tainted]

// Objectives/Goals
export const OBJECTIVES = [
  { id: 'g1', name: '???', icon: 'g1_icon.png', image: 'g1.png' },
  { id: 'g2', name: 'The Lamb', icon: 'g2_icon.png', image: 'g2.png' },
  { id: 'g3', name: 'Mega Satan', icon: 'g3_icon.png', image: 'g3.png' },
  { id: 'g4', name: 'Ultra Greed', icon: 'g4_icon.png', image: 'g4.png' },
  { id: 'g5', name: 'Delirium', icon: 'g5_icon.png', image: 'g5.png' },
  { id: 'g6', name: 'Mother', icon: 'g6_icon.png', image: 'g6.png' },
  { id: 'g7', name: 'The Beast', icon: 'g7_icon.png', image: 'g7.png' }
]

// Timed objectives
export const TIMED_OBJECTIVES = [
  { id: 't1', name: 'Boss Rush', icon: 'g8_icon.png', image: 'g8.png' },
  { id: 't2', name: 'Hush', icon: 'g9_icon.png', image: 'g9.png' }
]

// Official game challenges (45 total)
export const GAME_CHALLENGES = {
  rebirth: [
    { id: 'gc1', num: 1, name: 'Pitch Black' },
    { id: 'gc2', num: 2, name: 'High Brow' },
    { id: 'gc3', num: 3, name: 'Head Trauma' },
    { id: 'gc4', num: 4, name: 'Darkness Falls' },
    { id: 'gc5', num: 5, name: 'The Tank' },
    { id: 'gc6', num: 6, name: 'Solar System' },
    { id: 'gc7', num: 7, name: 'Suicide King' },
    { id: 'gc8', num: 8, name: 'Cat Got Your Tongue' },
    { id: 'gc9', num: 9, name: 'Demo Man' },
    { id: 'gc10', num: 10, name: 'Cursed!' },
    { id: 'gc11', num: 11, name: 'Glass Cannon' },
    { id: 'gc12', num: 12, name: 'When Life Gives You Lemons' },
    { id: 'gc13', num: 13, name: 'Beans!' },
    { id: 'gc14', num: 14, name: "It's in the Cards" },
    { id: 'gc15', num: 15, name: 'Slow Roll' },
    { id: 'gc16', num: 16, name: 'Computer Savvy' },
    { id: 'gc17', num: 17, name: 'Waka Waka' },
    { id: 'gc18', num: 18, name: 'The Host' },
    { id: 'gc19', num: 19, name: 'The Family Man' },
    { id: 'gc20', num: 20, name: 'Purist' }
  ],
  afterbirth: [
    { id: 'gc21', num: 21, name: 'XXXXXXXXL' },
    { id: 'gc22', num: 22, name: 'SPEED!' },
    { id: 'gc23', num: 23, name: 'Blue Bomber' },
    { id: 'gc24', num: 24, name: 'PAY TO PLAY' },
    { id: 'gc25', num: 25, name: 'Have a Heart' },
    { id: 'gc26', num: 26, name: 'I RULE!' },
    { id: 'gc27', num: 27, name: 'BRAINS!' },
    { id: 'gc28', num: 28, name: 'PRIDE DAY!' },
    { id: 'gc29', num: 29, name: "Onan's Streak" },
    { id: 'gc30', num: 30, name: 'The Guardian' }
  ],
  afterbirthPlus: [
    { id: 'gc31', num: 31, name: 'Backasswards' },
    { id: 'gc32', num: 32, name: 'Aprils Fool' },
    { id: 'gc33', num: 33, name: 'Pokey Mans' },
    { id: 'gc34', num: 34, name: 'Ultra Hard' },
    { id: 'gc35', num: 35, name: 'Pong' }
  ],
  repentance: [
    { id: 'gc36', num: 36, name: 'Scat Man' },
    { id: 'gc37', num: 37, name: 'Bloody Mary' },
    { id: 'gc38', num: 38, name: 'Baptism by Fire' },
    { id: 'gc39', num: 39, name: "Isaac's Awakening" },
    { id: 'gc40', num: 40, name: 'Seeing Double' },
    { id: 'gc41', num: 41, name: 'Pica Run' },
    { id: 'gc42', num: 42, name: 'Hot Potato' },
    { id: 'gc43', num: 43, name: 'Cantripped!' },
    { id: 'gc44', num: 44, name: 'Red Redemption' },
    { id: 'gc45', num: 45, name: 'DELETE THIS' }
  ]
}

// All game challenges flat array
export const ALL_GAME_CHALLENGES = [
  ...GAME_CHALLENGES.rebirth,
  ...GAME_CHALLENGES.afterbirth,
  ...GAME_CHALLENGES.afterbirthPlus,
  ...GAME_CHALLENGES.repentance
]

// Extra challenges
export const CHALLENGES = [
  { id: 'ch1', name: 'No using consumables', icon: 'ch1.png' },
  { id: 'ch2', name: 'No opening chests (except end-of-run chests)', icon: 'ch2.png' },
  { id: 'ch3', name: 'No trinkets', icon: 'ch3.png' },
  { id: 'ch4', name: 'No using machines/beggars', icon: 'ch4.png' },
  { id: 'ch5', name: 'No self damage (curse rooms, sacrifice rooms, etc.)', icon: 'ch5.png' },
  { id: 'ch6', name: 'No shops', icon: 'ch6.png' },
  { id: 'ch7', name: 'No secret rooms (of any kind)', icon: 'ch7.png' },
  { id: 'ch8', name: 'No devil rooms', icon: 'ch8.png' },
  { id: 'ch9', name: 'No angel rooms', icon: 'ch9.png' },
  { id: 'ch10', name: "Travel down Repentance's alternate path", icon: 'ch10.png' },
  { id: 'ch11', name: 'Skip all Treasure Rooms until a Planetarium appears', icon: 'ch11.png' },
  { id: 'ch12', name: 'Always take unknown (?) items', icon: 'ch12.png' }
]

// Presets for different game versions
export const PRESETS = {
  rebirth: {
    characters: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11'],
    objectives: ['g1', 'g2'],
    timedObjectives: []
  },
  afterbirth: {
    characters: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13'],
    objectives: ['g1', 'g2', 'g3', 'g4'],
    timedObjectives: ['t1', 't2']
  },
  antibirth: {
    characters: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c16', 'c17'],
    objectives: ['g1', 'g2', 'g3'],
    timedObjectives: ['t1']
  },
  afterbirthPlus: {
    characters: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15'],
    objectives: ['g1', 'g2', 'g3', 'g4', 'g5'],
    timedObjectives: ['t1', 't2']
  },
  repentance: {
    characters: ALL_CHARACTERS.map(c => c.id),
    objectives: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7'],
    timedObjectives: ['t1', 't2']
  }
}

// Challenges that are incompatible with certain objectives
export const CHALLENGE_INCOMPATIBILITIES = {
  // Alternate path challenge can't be combined with Ultra Greed or Mega Satan
  ch10: ['g3', 'g4'],
  // Planetarium challenge can't be combined with Ultra Greed
  ch11: ['g4']
}

// Default custom character slots
export const CUSTOM_CHARACTER_COUNT = 20
