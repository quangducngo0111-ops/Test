window.VocabRacer = window.VocabRacer || {};

VocabRacer.CONFIG = {
  laneCount: 3,
  laneWidth: 3.15,
  roadWidth: 10.8,
  finishDistance: 1950,
  questionsPerRace: 12,

  gate: {
    answerTime: 4.4,
    spawnDistance: 122,
    nextDelay: 1.15
  },

  player: {
    baseSpeed: 26,
    laneChangeSharpness: 8.5,
    nitroBonus: 18,
    nitroDuration: 2.4,
    wrongPenalty: 10,
    wrongDuration: 2.0
  },

  camera: {
    normalFov: 63,
    nitroFov: 76,
    height: 5.6,
    distance: 11.8,
    lookAhead: 12
  },

  ai: {
    count: 4,
    names: ["NOVA", "BOLT", "RAVEN", "ECHO"]
  },

  difficulty: {
    easy: { aiSpeed: 24.2, aiVariation: 1.0, gateTime: 5.2 },
    normal: { aiSpeed: 25.7, aiVariation: 1.25, gateTime: 4.4 },
    hard: { aiSpeed: 27.1, aiVariation: 1.45, gateTime: 3.7 }
  }
};
