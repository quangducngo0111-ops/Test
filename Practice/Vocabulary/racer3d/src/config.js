window.VocabRacer = window.VocabRacer || {};

VocabRacer.CONFIG = {

  lanes: 3,

  laneWidth: 3.35,

  roadWidth: 11.6,


  /* =========================
     VOCAB GATES
  ========================= */

  questionsPerRace: 16,

  firstGateDistance: 165,

  gateSpacing: 165,

  gateResolveDistance: 3.2,


  /* =========================
     PLAYER
  ========================= */

  player: {

    baseSpeed: 29.0,

    laneSharpness: 7.6,

    nitroBonus: 13.5,

    nitroDuration: 2.7,

    wrongPenalty: 8.0,

    wrongDuration: 2.3

  },


  /* =========================
     CAMERA
  ========================= */

  camera: {

    normalFov: 62,

    nitroFov: 72,

    height: 5.2,

    chaseDistance: 12.2,

    lookAhead: 20

  },


  /* =========================
     AI RACERS
  ========================= */

  ai: {

    count: 7,

    names: [
      "NOVA",
      "BOLT",
      "RAVEN",
      "ECHO",
      "VIPER",
      "COMET",
      "PULSE"
    ]

  },


  /* =========================
     DIFFICULTY
  ========================= */

  difficulty: {

    easy: {

      aiSpeed: 26.3,

      aiVariation: 0.9

    },

    normal: {

      aiSpeed: 28.0,

      aiVariation: 1.15

    },

    hard: {

      aiSpeed: 29.2,

      aiVariation: 1.35

    }

  },


  /* =========================
     PERFORMANCE
  ========================= */

  performance: {

    /*
      Giới hạn độ phân giải render
      để game nhẹ hơn.
    */

    maxPixelRatio: 1.35,


    /*
      Fog bắt đầu.
    */

    fogNear: 75,


    /*
      Fog kết thúc.
    */

    fogFar: 290

  }

};
