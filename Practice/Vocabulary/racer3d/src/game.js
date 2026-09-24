window.VocabRacer = window.VocabRacer || {};

(() => {
  "use strict";

  const CONFIG = VocabRacer.CONFIG;

  const $ = (id) => document.getElementById(id);

  let scene;
  let camera;
  let renderer;
  let clock;

  let track;
  let player;
  let vocab;
  let hud;

  let aiCars = [];

  let running = false;
  let finished = false;

  let raceTime = 0;
  let score = 0;
  let combo = 0;

  let currentDifficulty = "normal";

  let currentGate = null;
  let lastGateDistance = 0;
  let lastJunctionWarning = -1;

  let touchStartX = null;

  const sound = createSoundFx();


  /* =========================================================
     ERROR
  ========================================================= */

  function fail(error) {

    console.error(error);

    const box = $("bootError");

    if (!box) {
      return;
    }

    box.textContent =
      error?.stack ||
      error?.message ||
      String(error);

    box.classList.remove("hidden");
  }


  /* =========================================================
     BOOT
  ========================================================= */

  async function boot() {

    if (!window.THREE) {
      throw new Error(
        "Không tải được Three.js. Hãy kiểm tra kết nối Internet hoặc CDN."
      );
    }

    if (!VocabRacer.CONFIG) {
      throw new Error(
        "Không tải được config.js."
      );
    }

    if (!VocabRacer.Track) {
      throw new Error(
        "Không tải được track.js."
      );
    }

    if (!VocabRacer.PlayerCar) {
      throw new Error(
        "Không tải được player-car.js."
      );
    }

    if (!VocabRacer.AICar) {
      throw new Error(
        "Không tải được ai-car.js."
      );
    }

    if (!VocabRacer.VocabEngine) {
      throw new Error(
        "Không tải được vocab-engine.js."
      );
    }

    if (!VocabRacer.HUD) {
      throw new Error(
        "Không tải được hud.js."
      );
    }

    init3D();

    vocab = new VocabRacer.VocabEngine();

    const payload = await vocab.load();

    hud = new VocabRacer.HUD();

    const title =
      payload.title ||
      `${payload.skill || "Vocabulary"} · Bộ ${payload.set || ""}`;

    hud.setSource(title);

    const sourceDescription =
      $("sourceDescription");

    if (sourceDescription) {

      if (payload.source === "fallback") {

        sourceDescription.textContent =
          "Đang dùng bộ từ demo vì Racer được mở trực tiếp.";

      } else {

        sourceDescription.textContent =
          `Nguồn từ vựng: ${title} · ${
            payload.words?.length || 0
          } từ.`;

      }
    }

    bindControls();

    animate();
  }


  /* =========================================================
     THREE.JS INIT
  ========================================================= */

  function init3D() {

    const renderHost =
      $("renderHost");

    if (!renderHost) {
      throw new Error(
        "Không tìm thấy #renderHost trong index.html."
      );
    }

    scene =
      new THREE.Scene();

    scene.background =
      new THREE.Color(
        0x9bc5e0
      );

    scene.fog =
      new THREE.Fog(
        0x9bc5e0,
        CONFIG.performance.fogNear,
        CONFIG.performance.fogFar
      );

    camera =
      new THREE.PerspectiveCamera(
        CONFIG.camera.normalFov,
        window.innerWidth / window.innerHeight,
        0.1,
        650
      );

    renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        CONFIG.performance.maxPixelRatio
      )
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    /*
      Không dùng realtime shadow.
      Đây là một trong các thay đổi giúp game nhẹ hơn.
    */
    renderer.shadowMap.enabled =
      false;

    renderHost.replaceChildren(
      renderer.domElement
    );

    clock =
      new THREE.Clock();


    /* Ambient light */

    scene.add(
      new THREE.AmbientLight(
        0xffffff,
        1.45
      )
    );


    /* Sun */

    const sun =
      new THREE.DirectionalLight(
        0xffd3a1,
        1.75
      );

    sun.position.set(
      -80,
      150,
      -40
    );

    scene.add(sun);


    /* Hemisphere */

    scene.add(
      new THREE.HemisphereLight(
        0xc9ebff,
        0x415036,
        0.9
      )
    );


    /* Big Map */

    track =
      new VocabRacer.Track(
        scene,
        CONFIG
      );


    /* Player */

    player =
      new VocabRacer.PlayerCar(
        scene,
        CONFIG,
        track
      );


    createSky();

    resetCamera();

    window.addEventListener(
      "resize",
      onResize
    );
  }


  /* =========================================================
     SKY
  ========================================================= */

  function createSky() {

    const sunDisc =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          11,
          16,
          10
        ),
        new THREE.MeshBasicMaterial({
          color: 0xffe2a6
        })
      );

    sunDisc.position.set(
      -120,
      95,
      380
    );

    scene.add(
      sunDisc
    );
  }


  /* =========================================================
     AI CARS
  ========================================================= */

  function createAiCars() {

    for (const ai of aiCars) {

      if (ai?.group) {
        scene.remove(
          ai.group
        );
      }
    }

    aiCars = [];

    const diff =
      CONFIG.difficulty[
        currentDifficulty
      ];

    const colors = [
      0x3bd082,
      0x3e7cff,
      0xffb43c,
      0xa968ff,
      0x24c2cf,
      0xf66b58,
      0xe4df4b
    ];

    const offsets = [
      26,
      10,
      -16,
      -34,
      46,
      -54,
      65
    ];

    for (
      let i = 0;
      i < CONFIG.ai.count;
      i++
    ) {

      const ai =
        new VocabRacer.AICar(
          scene,
          CONFIG,
          track,
          {
            name:
              CONFIG.ai.names[i] ||
              `AI-${i + 1}`,

            color:
              colors[
                i % colors.length
              ],

            lane:
              i % 3,

            distance:
              Math.max(
                0,
                player.distance +
                offsets[
                  i % offsets.length
                ]
              ),

            speedBase:
              diff.aiSpeed +
              (i - 3) * 0.10,

            variation:
              diff.aiVariation,

            seed:
              i * 0.81
          }
        );

      aiCars.push(ai);
    }
  }


  /* =========================================================
     START RACE
  ========================================================= */

  function startRace() {

    if (running) {
      return;
    }

    sound.resume();

    currentDifficulty =
      $("difficultySelect")?.value ||
      "normal";

    vocab.prepareRound(
      CONFIG.questionsPerRace
    );

    if (
      !Array.isArray(vocab.queue) ||
      vocab.queue.length < 1
    ) {

      hud.flash(
        "Bộ từ này không còn câu để luyện.",
        "bad",
        1800
      );

      return;
    }

    resetRaceState();

    createAiCars();

    $("startScreen")
      ?.classList
      .add(
        "hidden"
      );

    $("finishScreen")
      ?.classList
      .add(
        "hidden"
      );

    running =
      true;

    spawnGate(
      CONFIG.firstGateDistance
    );

    hud.flash(
      "3 · 2 · 1 · GO!",
      "good",
      900
    );
  }


  /* =========================================================
     RESET
  ========================================================= */

  function resetRaceState() {

    finished =
      false;

    running =
      false;

    raceTime =
      0;

    score =
      0;

    combo =
      0;

    currentGate =
      null;

    lastGateDistance =
      0;

    lastJunctionWarning =
      -1;


    player.distance =
      0;

    player.targetLane =
      1;

    player.lateral =
      0;

    player.speed =
      0;

    player.nitroTimer =
      0;

    player.slowTimer =
      0;

    /*
      Cho PlayerCar cập nhật vị trí ban đầu.
    */
    player.update(
      0.001
    );

    hud?.hideQuestion?.();

    $("speedFx")
      ?.classList
      .remove(
        "active"
      );

    $("damageFx")
      ?.classList
      .remove(
        "active"
      );

    resetCamera();
  }


  /* =========================================================
     CAMERA RESET
  ========================================================= */

  function resetCamera() {

    if (
      !track ||
      !player ||
      !camera
    ) {
      return;
    }

    const frame =
      track.getFrame(
        player.distance
      );

    const playerPos =
      frame.point.clone();

    camera.position.copy(
      playerPos
        .clone()
        .add(
          frame.tangent
            .clone()
            .multiplyScalar(
              -CONFIG.camera.chaseDistance
            )
        )
        .add(
          new THREE.Vector3(
            0,
            CONFIG.camera.height,
            0
          )
        )
    );

    camera.fov =
      CONFIG.camera.normalFov;

    camera.updateProjectionMatrix();

    camera.lookAt(
      playerPos
        .clone()
        .add(
          frame.tangent
            .clone()
            .multiplyScalar(
              CONFIG.camera.lookAhead
            )
        )
        .add(
          new THREE.Vector3(
            0,
            1,
            0
          )
        )
    );
  }


  /* =========================================================
     MAIN LOOP
  ========================================================= */

  function animate() {

    requestAnimationFrame(
      animate
    );

    if (
      !renderer ||
      !clock
    ) {
      return;
    }

    const dt =
      Math.min(
        clock.getDelta(),
        0.033
      );

    if (
      running &&
      !finished
    ) {

      updateGame(
        dt
      );

    } else {

      updateCamera(
        dt
      );

    }

    renderer.render(
      scene,
      camera
    );
  }


  /* =========================================================
     UPDATE GAME
  ========================================================= */

  function updateGame(dt) {

    raceTime +=
      dt;

    const oldPlayerDistance =
      player.distance;

    const speed =
      player.update(
        dt
      );


    /* AI */

    for (const ai of aiCars) {

      const wasAhead =
        ai.distance >
        oldPlayerDistance;

      ai.update(
        dt,
        player.distance
      );

      const nowBehind =
        ai.distance <
        player.distance;

      if (
        player.isNitroActive() &&
        wasAhead &&
        nowBehind
      ) {

        hud.showOvertake(
          ai.name
        );

        sound.overtake();
      }
    }


    updateGate();

    updateCamera(
      dt
    );

    updateJunctionNotice();


    const rank =
      getPlayerRank();


    hud.updateRace({
      speed,

      rank,

      totalCars:
        aiCars.length + 1,

      progress:
        player.distance /
        track.finishDistance,

      nitroRatio:
        player.nitroRatio()
    });


    /*
      Highlight làn mà học sinh đã chọn.
      Không cần chờ xe Lerp hoàn toàn.
    */

    hud.setActiveLane(
      player.targetLane
    );


    $("speedFx")
      ?.classList
      .toggle(
        "active",
        player.isNitroActive()
      );


    if (
      player.distance >=
      track.finishDistance
    ) {

      finishRace();
    }
  }


  /* =========================================================
     CAMERA
  ========================================================= */

  function updateCamera(dt) {

    if (
      !camera ||
      !track ||
      !player
    ) {
      return;
    }

    const playerFrame =
      track.getFrame(
        player.distance
      );

    const carPos =
      player.group.position.clone();

    const nitro =
      player.isNitroActive();

    const desired =
      carPos
        .clone()
        .add(
          playerFrame.tangent
            .clone()
            .multiplyScalar(
              -CONFIG.camera.chaseDistance +
              (
                nitro
                  ? 1.2
                  : 0
              )
            )
        )
        .add(
          new THREE.Vector3(
            0,
            CONFIG.camera.height +
            (
              nitro
                ? 0.25
                : 0
            ),
            0
          )
        );

    camera.position.lerp(
      desired,
      1 -
      Math.exp(
        -5 * dt
      )
    );

    const targetFov =
      nitro
        ? CONFIG.camera.nitroFov
        : CONFIG.camera.normalFov;

    camera.fov =
      THREE.MathUtils.lerp(
        camera.fov,
        targetFov,
        1 -
        Math.exp(
          -5 * dt
        )
      );

    camera.updateProjectionMatrix();

    const look =
      track
        .getFrame(
          Math.min(
            track.finishDistance,
            player.distance +
            CONFIG.camera.lookAhead
          )
        )
        .point
        .clone()
        .add(
          new THREE.Vector3(
            0,
            1,
            0
          )
        );

    camera.lookAt(
      look
    );
  }


  /* =========================================================
     SPAWN VOCAB GATE
  ========================================================= */

  function spawnGate(
    desiredDistance
  ) {

    const question =
      vocab.nextQuestion();

    if (!question) {

      currentGate =
        null;

      hud.hideQuestion();

      return;
    }

    let distance =
      Math.max(
        desiredDistance,
        player.distance + 125
      );

    distance =
      Math.min(
        distance,
        track.finishDistance - 90
      );

    if (
      distance <=
      player.distance + 45
    ) {

      currentGate =
        null;

      hud.hideQuestion();

      return;
    }

    currentGate = {
      question,
      distance,

      group:
        createGateGroup(
          question,
          distance
        ),

      resolved:
        false
    };

    lastGateDistance =
      distance;

    hud.showQuestion(
      question
    );
  }


  /* =========================================================
     CREATE GATE GROUP
  ========================================================= */

  function createGateGroup(
    question,
    distance
  ) {

    const group =
      new THREE.Group();

    for (
      let lane = 0;
      lane < 3;
      lane++
    ) {

      const portal =
        createPortal(
          question.options[
            lane
          ]
        );

      const frame =
        track.lanePosition(
          distance,
          lane
        );

      portal.position.copy(
        frame.position
      );

      portal.rotation.y =
        frame.heading;

      group.add(
        portal
      );
    }

    scene.add(
      group
    );

    return group;
  }


  /* =========================================================
     CREATE PORTAL
  ========================================================= */

  function createPortal(answer) {

    const group =
      new THREE.Group();

    const frameMat =
      new THREE.MeshStandardMaterial({
        color:
          0x172235,

        roughness:
          0.4,

        metalness:
          0.28
      });

    const glowMat =
      new THREE.MeshStandardMaterial({
        color:
          0x56e2ff,

        emissive:
          0x1688b8,

        emissiveIntensity:
          1.55,

        roughness:
          0.25
      });

    const postGeo =
      new THREE.BoxGeometry(
        0.15,
        3.8,
        0.16
      );

    const left =
      new THREE.Mesh(
        postGeo,
        frameMat
      );

    const right =
      new THREE.Mesh(
        postGeo,
        frameMat
      );

    left.position.set(
      -1.25,
      1.9,
      0
    );

    right.position.set(
      1.25,
      1.9,
      0
    );

    const top =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          2.65,
          0.15,
          0.18
        ),
        glowMat
      );

    top.position.set(
      0,
      3.75,
      0
    );

    const sign =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          2.5,
          1
        ),
        new THREE.MeshBasicMaterial({
          map:
            createTextTexture(
              answer
            ),

          side:
            THREE.DoubleSide,

          transparent:
            true
        })
      );

    sign.position.set(
      0,
      2.45,
      -0.12
    );

    /*
      Biển quay về phía xe.
    */
    sign.rotation.y =
      Math.PI;

    group.add(
      left,
      right,
      top,
      sign
    );

    return group;
  }


  /* =========================================================
     TEXT TEXTURE
  ========================================================= */

  function createTextTexture(text) {

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      1024;

    canvas.height =
      420;

    const ctx =
      canvas.getContext(
        "2d"
      );

    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        1024,
        420
      );

    gradient.addColorStop(
      0,
      "#07152a"
    );

    gradient.addColorStop(
      1,
      "#12385a"
    );

    ctx.fillStyle =
      gradient;

    ctx.fillRect(
      0,
      0,
      1024,
      420
    );

    ctx.strokeStyle =
      "#5de4ff";

    ctx.lineWidth =
      14;

    ctx.strokeRect(
      10,
      10,
      1004,
      400
    );

    ctx.fillStyle =
      "#ffffff";

    ctx.textAlign =
      "center";

    ctx.textBaseline =
      "middle";

    ctx.font =
      "800 66px Arial, sans-serif";

    wrapCanvasText(
      ctx,
      text,
      512,
      210,
      880,
      76
    );

    const texture =
      new THREE.CanvasTexture(
        canvas
      );

    texture.colorSpace =
      THREE.SRGBColorSpace;

    texture.minFilter =
      THREE.LinearFilter;

    texture.magFilter =
      THREE.LinearFilter;

    return texture;
  }


  function wrapCanvasText(
    ctx,
    text,
    cx,
    cy,
    maxWidth,
    lineHeight
  ) {

    const words =
      String(
        text
      )
        .split(
          /\s+/
        );

    const lines =
      [];

    let line =
      "";

    for (const word of words) {

      const test =
        line
          ? `${line} ${word}`
          : word;

      if (
        ctx.measureText(
          test
        ).width >
        maxWidth &&
        line
      ) {

        lines.push(
          line
        );

        line =
          word;

      } else {

        line =
          test;

      }
    }

    if (line) {
      lines.push(
        line
      );
    }

    const visible =
      lines.slice(
        0,
        3
      );

    const y0 =
      cy -
      (
        visible.length - 1
      ) *
      lineHeight /
      2;

    visible.forEach(
      (
        value,
        index
      ) => {

        ctx.fillText(
          value,
          cx,
          y0 +
          index *
          lineHeight
        );

      }
    );
  }


  /* =========================================================
     UPDATE GATE
  ========================================================= */

  function updateGate() {

    if (!currentGate) {
      return;
    }

    const remaining =
      currentGate.distance -
      player.distance;


    if (!currentGate.resolved) {

      hud.setGateDistance(
        remaining
      );

      /*
        KHÔNG CÒN TIMER.

        Game chỉ chấm khi xe thực sự
        đi qua vị trí của cổng.
      */

      if (
        remaining <=
        CONFIG.gateResolveDistance
      ) {

        resolveGate();
      }
    }


    /*
      Sau khi đi qua cổng một đoạn,
      xóa cổng và sinh câu tiếp theo.
    */

    if (
      remaining < -26
    ) {

      disposeObject(
        currentGate.group
      );

      currentGate =
        null;

      spawnGate(
        lastGateDistance +
        CONFIG.gateSpacing
      );
    }
  }


  /* =========================================================
     RESOLVE ANSWER
  ========================================================= */

  function resolveGate() {

    if (
      !currentGate ||
      currentGate.resolved
    ) {
      return;
    }

    currentGate.resolved =
      true;

    const question =
      currentGate.question;


    /*
      FIX QUAN TRỌNG:

      Trước đây nếu dùng currentLane()
      khi xe vẫn đang Lerp giữa 2 lane,
      học sinh đã bấm đúng nhưng game
      có thể vẫn tính lane cũ.

      Bây giờ chấm trực tiếp theo
      targetLane mà học sinh đã chọn.
    */

    const selectedLane =
      player.targetLane;

    const good =
      selectedLane ===
      question.correctLane;


    vocab.record(
      question,
      selectedLane,
      good
    );


    if (good) {

      combo++;

      score +=
        120 +
        Math.min(
          140,
          combo * 16
        );

      player.triggerNitro();

      hud.flash(
        "✓ CHÍNH XÁC · NITRO!",
        "good",
        1150
      );

      sound.correct();

      sound.nitro();

    } else {

      combo =
        0;

      score =
        Math.max(
          0,
          score - 15
        );

      player.applyWrongPenalty();

      hud.flash(
        `✕ Đáp án đúng: ${question.correctAnswer}`,
        "bad",
        1500
      );

      sound.wrong();

      triggerDamageFx();
    }
  }


  /* =========================================================
     JUNCTION NOTICE
  ========================================================= */

  function updateJunctionNotice() {

    if (
      !track.nearestJunctionDistance
    ) {
      return;
    }

    const delta =
      track.nearestJunctionDistance(
        player.distance
      );

    if (
      !Number.isFinite(
        delta
      )
    ) {
      return;
    }

    const junctionId =
      Math.round(
        (
          player.distance +
          delta
        ) /
        10
      );

    if (
      delta < 85 &&
      delta > 5 &&
      junctionId !==
      lastJunctionWarning
    ) {

      lastJunctionWarning =
        junctionId;

      hud.showJunction();
    }
  }


  /* =========================================================
     DAMAGE FX
  ========================================================= */

  function triggerDamageFx() {

    const fx =
      $("damageFx");

    if (!fx) {
      return;
    }

    fx.classList.add(
      "active"
    );

    setTimeout(
      () => {

        fx.classList.remove(
          "active"
        );

      },
      420
    );
  }


  /* =========================================================
     RANK
  ========================================================= */

  function getPlayerRank() {

    return (
      1 +
      aiCars.filter(
        (ai) =>
          ai.distance >
          player.distance
      ).length
    );
  }


  /* =========================================================
     FINISH RACE
  ========================================================= */

  function finishRace() {

    if (finished) {
      return;
    }

    finished =
      true;

    running =
      false;

    hud.hideQuestion();

    $("speedFx")
      ?.classList
      .remove(
        "active"
      );

    if (
      currentGate?.group
    ) {

      disposeObject(
        currentGate.group
      );

      currentGate =
        null;
    }

    const rank =
      getPlayerRank();

    const learning =
      vocab.summary();

    const rankBonus =
      Math.max(
        0,
        (
          aiCars.length +
          1 -
          rank
        ) *
        70
      );

    const accuracyBonus =
      learning.correct *
      35;

    score +=
      rankBonus +
      accuracyBonus;

    hud.showFinish({
      rank,

      totalCars:
        aiCars.length + 1,

      time:
        raceTime,

      score,

      learning
    });

    sound.finish();
  }


  /* =========================================================
     DISPOSE 3D OBJECT
  ========================================================= */

  function disposeObject(object) {

    if (!object) {
      return;
    }

    object.traverse(
      (child) => {

        child.geometry
          ?.dispose
          ?.();

        if (child.material) {

          const materials =
            Array.isArray(
              child.material
            )
              ? child.material
              : [
                  child.material
                ];

          for (
            const material
            of materials
          ) {

            material.map
              ?.dispose
              ?.();

            material.dispose
              ?.();
          }
        }
      }
    );

    scene.remove(
      object
    );
  }


  /* =========================================================
     SAFE CONTROLS
  ========================================================= */

  function bindControls() {

    /*
      QUAN TRỌNG:

      Mọi element đều được check trước khi
      gọi addEventListener.

      Vì vậy thiếu một button sẽ KHÔNG
      làm chết toàn bộ game.
    */

    const on = (
      id,
      eventName,
      handler,
      options
    ) => {

      const element =
        $(id);

      if (!element) {

        console.warn(
          `[Vocab Racer] Không tìm thấy #${id}. Bỏ qua listener ${eventName}.`
        );

        return false;
      }

      element.addEventListener(
        eventName,
        handler,
        options
      );

      return true;
    };


    /* START */

    on(
      "startBtn",
      "click",
      startRace
    );


    /* RESTART */

    on(
      "restartBtn",
      "click",
      () => {

        $("finishScreen")
          ?.classList
          .add(
            "hidden"
          );

        startRace();
      }
    );


    /* BACK INSIDE START SCREEN */

    on(
      "backBtn",
      "click",
      backToGameList
    );


    /* BACK INSIDE RESULT */

    on(
      "finishBackBtn",
      "click",
      backToGameList
    );


    /* TOP: CHỌN GAME */

    on(
      "backToGameListBtn",
      "click",
      backToGameList
    );


    /* TOP: LUYỆN TẬP */

    on(
      "backToPracticeBtn",
      "click",
      backToPractice
    );


    /* LEFT */

    on(
      "leftBtn",
      "click",
      () => {

        moveLane(
          -1
        );

      }
    );


    /* RIGHT */

    on(
      "rightBtn",
      "click",
      () => {

        moveLane(
          1
        );

      }
    );


    /* KEYBOARD */

    window.addEventListener(
      "keydown",
      (event) => {

        if (!running) {
          return;
        }

        const key =
          String(
            event.key || ""
          )
            .toLowerCase();

        if (
          key === "arrowleft" ||
          key === "a"
        ) {

          event.preventDefault();

          moveLane(
            -1
          );
        }

        if (
          key === "arrowright" ||
          key === "d"
        ) {

          event.preventDefault();

          moveLane(
            1
          );
        }
      }
    );


    /* SWIPE */

    const canvas =
      renderer?.domElement;

    if (canvas) {

      canvas.addEventListener(
        "pointerdown",
        (event) => {

          touchStartX =
            event.clientX;

        },
        {
          passive: true
        }
      );


      canvas.addEventListener(
        "pointerup",
        (event) => {

          if (
            touchStartX === null ||
            !running
          ) {

            touchStartX =
              null;

            return;
          }

          const dx =
            event.clientX -
            touchStartX;

          if (
            Math.abs(
              dx
            ) > 34
          ) {

            moveLane(
              dx < 0
                ? -1
                : 1
            );
          }

          touchStartX =
            null;
        },
        {
          passive: true
        }
      );
    }
  }


  /* =========================================================
     MOVE LANE
  ========================================================= */

  function moveLane(direction) {

    if (
      !running ||
      finished
    ) {
      return;
    }

    player.changeLane(
      direction
    );

    hud.setActiveLane(
      player.targetLane
    );

    sound.lane();
  }


  /* =========================================================
     NAVIGATION
  ========================================================= */

  function backToGameList() {

    /*
      Vocabulary/index.html lưu URL trước
      khi mở Racer.

      Nhờ vậy nút này quay về đúng bộ
      Reading 01 / Topic / Writing...
      học sinh vừa chọn.
    */

    try {

      const url =
        localStorage.getItem(
          "VOCAB_RACER_RETURN_URL"
        );

      if (url) {

        window.location.href =
          url;

        return;
      }

    } catch (error) {

      console.warn(
        error
      );
    }

    /*
      Fallback:
      racer3d/ -> Vocabulary/
    */

    window.location.href =
      "../";
  }


  function backToPractice() {

    /*
      racer3d đang ở:

      Practice/
        Vocabulary/
          racer3d/

      ../../ => Practice/
    */

    window.location.href =
      "../../";
  }


  /* =========================================================
     RESIZE
  ========================================================= */

  function onResize() {

    if (
      !camera ||
      !renderer
    ) {
      return;
    }

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        CONFIG.performance.maxPixelRatio
      )
    );
  }


  /* =========================================================
     SOUND
  ========================================================= */

  function createSoundFx() {

    let ctx =
      null;

    const ensure =
      () => {

        if (!ctx) {

          const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

          if (!AudioContextClass) {
            return null;
          }

          ctx =
            new AudioContextClass();
        }

        return ctx;
      };


    const tone = (
      frequency,
      duration,
      type = "sine",
      gain = 0.03,
      slide = 0
    ) => {

      try {

        const c =
          ensure();

        if (!c) {
          return;
        }

        const osc =
          c.createOscillator();

        const amp =
          c.createGain();

        osc.type =
          type;

        osc.frequency
          .setValueAtTime(
            frequency,
            c.currentTime
          );

        if (slide) {

          osc.frequency
            .exponentialRampToValueAtTime(
              Math.max(
                20,
                frequency +
                slide
              ),
              c.currentTime +
              duration
            );
        }

        amp.gain
          .setValueAtTime(
            gain,
            c.currentTime
          );

        amp.gain
          .exponentialRampToValueAtTime(
            0.0001,
            c.currentTime +
            duration
          );

        osc.connect(
          amp
        );

        amp.connect(
          c.destination
        );

        osc.start();

        osc.stop(
          c.currentTime +
          duration
        );

      } catch (error) {

        console.warn(
          "Sound error:",
          error
        );
      }
    };


    return {

      resume() {

        try {

          const c =
            ensure();

          if (
            c &&
            c.state ===
            "suspended"
          ) {

            c.resume();
          }

        } catch (error) {}
      },


      lane() {

        tone(
          300,
          0.07,
          "triangle",
          0.018,
          70
        );
      },


      correct() {

        tone(
          620,
          0.10,
          "sine",
          0.035,
          160
        );

        setTimeout(
          () => {

            tone(
              830,
              0.12,
              "sine",
              0.03,
              120
            );

          },
          70
        );
      },


      wrong() {

        tone(
          165,
          0.19,
          "sawtooth",
          0.03,
          -55
        );
      },


      nitro() {

        tone(
          260,
          0.30,
          "sawtooth",
          0.018,
          820
        );
      },


      overtake() {

        tone(
          540,
          0.08,
          "triangle",
          0.022,
          210
        );
      },


      finish() {

        tone(
          520,
          0.14,
          "sine",
          0.03,
          150
        );

        setTimeout(
          () => {

            tone(
              720,
              0.18,
              "sine",
              0.035,
              220
            );

          },
          120
        );
      }
    };
  }


  /* =========================================================
     SAFE BOOT
  ========================================================= */

  /*
    Không chạy boot khi DOM còn chưa dựng xong.

    Đây là lớp bảo vệ thứ hai cho lỗi:
    null.addEventListener(...)
  */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      () => {

        boot()
          .catch(
            fail
          );

      },
      {
        once: true
      }
    );

  } else {

    boot()
      .catch(
        fail
      );
  }

})();
