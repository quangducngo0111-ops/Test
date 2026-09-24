window.VocabRacer = window.VocabRacer || {};

VocabRacer.CONFIG = {

  /* =========================================================
     ROAD
  ========================================================= */

  lanes: 3,

  laneWidth: 3.35,

  roadWidth: 11.6,


  /* =========================================================
     VOCAB GATES
  ========================================================= */

  questionsPerRace: 16,

  /*
    Cổng đầu tiên cách điểm xuất phát đủ xa
    để học sinh có thời gian nhìn câu hỏi.
  */
  firstGateDistance: 165,

  /*
    Khoảng cách giữa các cổng từ vựng.
  */
  gateSpacing: 165,

  /*
    Khi xe còn cách cổng khoảng này,
    game sẽ chấm lane đã chọn.
  */
  gateResolveDistance: 3.2,


  /* =========================================================
     PLAYER
  ========================================================= */

  player: {

    /*
      Tốc độ chạy bình thường.
    */
    baseSpeed: 29.0,

    /*
      Độ mượt khi chuyển làn.
      Số càng cao thì xe chuyển càng nhanh.
    */
    laneSharpness: 7.6,

    /*
      Tăng tốc khi trả lời đúng.
    */
    nitroBonus: 13.5,

    /*
      Nitro kéo dài bao nhiêu giây.
    */
    nitroDuration: 2.7,

    /*
      Trừ tốc độ khi trả lời sai.
    */
    wrongPenalty: 8.0,

    /*
      Thời gian bị giảm tốc.
    */
    wrongDuration: 2.3

  },


  /* =========================================================
     CAMERA
  ========================================================= */

  camera: {

    /*
      FOV bình thường.
    */
    normalFov: 62,

    /*
      FOV khi Nitro.
      Tăng FOV tạo cảm giác tốc độ cao.
    */
    nitroFov: 72,

    /*
      Camera cao hơn xe bao nhiêu.
    */
    height: 5.2,

    /*
      Camera đứng sau xe.
    */
    chaseDistance: 12.2,

    /*
      Camera nhìn về phía trước bao xa.
    */
    lookAhead: 20

  },


  /* =========================================================
     AI RACERS
  ========================================================= */

  ai: {

    /*
      7 xe AI + 1 xe người chơi = 8 xe.
    */
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


  /* =========================================================
     DIFFICULTY
  ========================================================= */

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


  /* =========================================================
     PERFORMANCE
     PHẦN NÀY CHÍNH LÀ PHẦN ĐANG THIẾU
  ========================================================= */

  performance: {

    /*
      Giới hạn độ phân giải renderer.

      Nếu để devicePixelRatio 2-3 trên tablet
      thì Three.js render rất nặng.
    */
    maxPixelRatio: 1.35,

    /*
      Fog bắt đầu ở khoảng cách 75.
    */
    fogNear: 75,

    /*
      Sau khoảng 290 sẽ chìm vào sương.
      Giúp giảm cảm giác pop-in và tăng FPS.
    */
    fogFar: 290

  }

};
