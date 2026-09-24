/* =========================================================
   ASTRONAUT ESCAPE 3D
   Stylized Low-Poly Space Station
   Three.js / WebGL
========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIG
  ========================================================= */

  const CELL = 2.45;

  /*
    1 = WALL
    0 = CORRIDOR
    2 = TELEPORT ANSWER STATION
  */

  const GRID = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2,1],
    [1,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,1,1,1,0,0,1,0,0,0,0,0,1],
    [1,2,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  const ROWS = GRID.length;
  const COLS = GRID[0].length;

  const START = {
    row: 8,
    col: 11
  };

  const STATIONS = [
    { row: 1, col: 1 },
    { row: 1, col: 21 },
    { row: 15, col: 1 },
    { row: 15, col: 21 }
  ];

  const ALIEN_SPAWNS = [
    { row: 1, col: 11 },
    { row: 15, col: 11 },
    { row: 8, col: 2 },
    { row: 8, col: 20 }
  ];

  /* =========================================================
     VOCAB DEMO
  ========================================================= */

  const VOCAB = [
    {
      word: "public transport",
      correct: "hệ thống giao thông công cộng",
      wrong: [
        "khu dân cư",
        "tắc nghẽn giao thông",
        "cơ sở y tế"
      ]
    },

    {
      word: "income inequality",
      correct: "bất bình đẳng thu nhập",
      wrong: [
        "thuế thu nhập",
        "thu nhập khả dụng",
        "tăng lương"
      ]
    },

    {
      word: "renewable energy",
      correct: "năng lượng tái tạo",
      wrong: [
        "nhiên liệu hóa thạch",
        "hiệu suất năng lượng",
        "khí thải"
      ]
    },

    {
      word: "higher education",
      correct: "giáo dục đại học",
      wrong: [
        "giáo dục mầm non",
        "đào tạo nghề",
        "giáo dục bắt buộc"
      ]
    },

    {
      word: "labour market",
      correct: "thị trường lao động",
      wrong: [
        "năng suất lao động",
        "lương tối thiểu",
        "việc làm tạm thời"
      ]
    }
  ];

  /* =========================================================
     THREE STATE
  ========================================================= */

  let scene;
  let camera;
  let renderer;
  let clock;

  let astronaut;
  let astroParts;

  let aliens = [];
  let stationsMeshes = [];
  let teleportBeams = [];

  /* =========================================================
     GAME STATE
  ========================================================= */

  let score = 0;
  let lives = 5;

  let gameEnded = false;
  let answerLock = false;

  let currentItem = null;
  let stationAnswers = [];

  let walkTime = 0;

  let lastStationKey = "";

  let lastMove = {
    x: 0,
    z: 1
  };

  const pressed = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  /* =========================================================
     DOM
  ========================================================= */

  const questionEl =
    document.getElementById("question");

  const scoreEl =
    document.getElementById("score");

  const livesEl =
    document.getElementById("lives");

  const alienCountEl =
    document.getElementById("alienCount");

  const messageEl =
    document.getElementById("message");

  const bootErrorEl =
    document.getElementById("bootError");

  const gameOverEl =
    document.getElementById("gameOver");

  const gameOverTextEl =
    document.getElementById("gameOverText");

  /* =========================================================
     BOOT
  ========================================================= */

  if (!window.THREE) {
    showBootError(
      "Không tải được Three.js từ CDN."
    );

    return;
  }

  try {
    init();
    animate();
  }

  catch (error) {
    showBootError(
      error?.stack ||
      error?.message ||
      String(error)
    );
  }

  /* =========================================================
     INIT
  ========================================================= */

  function init() {

    scene =
      new THREE.Scene();

    scene.background =
      new THREE.Color(
        0x030713
      );

    scene.fog =
      new THREE.Fog(
        0x030713,
        36,
        84
      );

    camera =
      new THREE.PerspectiveCamera(
        52,
        window.innerWidth /
        window.innerHeight,
        0.1,
        140
      );

    renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        1.65
      )
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.shadowMap.enabled =
      true;

    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    document
      .getElementById("game")
      .prepend(
        renderer.domElement
      );

    clock =
      new THREE.Clock();

    createLighting();
    createStationFloor();
    createMazeWalls();
    createNeonGrid();

    astronaut =
      createAstronaut();

    scene.add(
      astronaut
    );

    resetPlayer();

    spawnAliens(4);

    newQuestion();

    setupInput();

    setInitialCamera();

    updateHud();

    window.addEventListener(
      "resize",
      onResize
    );
  }

  /* =========================================================
     LIGHTING
  ========================================================= */

  function createLighting() {

    scene.add(
      new THREE.AmbientLight(
        0x7a96d8,
        1.55
      )
    );

    const key =
      new THREE.DirectionalLight(
        0xd9ecff,
        2
      );

    key.position.set(
      14,
      24,
      12
    );

    key.castShadow =
      true;

    key.shadow.mapSize.set(
      1024,
      1024
    );

    key.shadow.camera.left =
      -32;

    key.shadow.camera.right =
      32;

    key.shadow.camera.top =
      28;

    key.shadow.camera.bottom =
      -28;

    scene.add(
      key
    );

    const cyan =
      new THREE.PointLight(
        0x1d9bff,
        9,
        28,
        2
      );

    cyan.position.set(
      0,
      5,
      0
    );

    scene.add(
      cyan
    );
  }

  /* =========================================================
     FLOOR
  ========================================================= */

  function createStationFloor() {

    const floor =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          COLS * CELL,
          ROWS * CELL
        ),

        new THREE.MeshStandardMaterial({
          color: 0x0a1220,
          roughness: 0.85,
          metalness: 0.2
        })
      );

    floor.rotation.x =
      -Math.PI / 2;

    floor.position.y =
      -0.04;

    floor.receiveShadow =
      true;

    scene.add(
      floor
    );
  }

  /* =========================================================
     NEON FLOOR GRID
  ========================================================= */

  function createNeonGrid() {

    const material =
      new THREE.LineBasicMaterial({
        color: 0x143d78,
        transparent: true,
        opacity: 0.48
      });

    const points = [];

    const halfW =
      COLS * CELL / 2;

    const halfH =
      ROWS * CELL / 2;

    for (
      let col = 0;
      col <= COLS;
      col++
    ) {

      const x =
        -halfW +
        col * CELL;

      points.push(
        new THREE.Vector3(
          x,
          0.015,
          -halfH
        )
      );

      points.push(
        new THREE.Vector3(
          x,
          0.015,
          halfH
        )
      );
    }

    for (
      let row = 0;
      row <= ROWS;
      row++
    ) {

      const z =
        -halfH +
        row * CELL;

      points.push(
        new THREE.Vector3(
          -halfW,
          0.015,
          z
        )
      );

      points.push(
        new THREE.Vector3(
          halfW,
          0.015,
          z
        )
      );
    }

    const geometry =
      new THREE.BufferGeometry()
        .setFromPoints(
          points
        );

    scene.add(
      new THREE.LineSegments(
        geometry,
        material
      )
    );
  }

  /* =========================================================
     WALLS
  ========================================================= */

  function createMazeWalls() {

    const bodyMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x18264a,
        roughness: 0.45,
        metalness: 0.38,
        emissive: 0x07132c,
        emissiveIntensity: 0.35
      });

    const ledMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x42d6ff,
        emissive: 0x1ea7ff,
        emissiveIntensity: 2.2,
        roughness: 0.25,
        metalness: 0.15
      });

    const wallGeometry =
      new THREE.BoxGeometry(
        CELL * 0.94,
        1.65,
        CELL * 0.94
      );

    const ledXGeometry =
      new THREE.BoxGeometry(
        CELL * 0.78,
        0.06,
        0.06
      );

    const ledZGeometry =
      new THREE.BoxGeometry(
        0.06,
        0.06,
        CELL * 0.78
      );

    for (
      let row = 0;
      row < ROWS;
      row++
    ) {

      for (
        let col = 0;
        col < COLS;
        col++
      ) {

        if (
          GRID[row][col] !== 1
        ) {
          continue;
        }

        const position =
          gridToWorld(
            row,
            col
          );

        const wall =
          new THREE.Mesh(
            wallGeometry,
            bodyMaterial
          );

        wall.position.set(
          position.x,
          0.82,
          position.z
        );

        wall.castShadow =
          true;

        wall.receiveShadow =
          true;

        scene.add(
          wall
        );

        const led1 =
          new THREE.Mesh(
            ledXGeometry,
            ledMaterial
          );

        led1.position.set(
          position.x,
          1.68,
          position.z -
          CELL * 0.34
        );

        scene.add(
          led1
        );

        const led2 =
          new THREE.Mesh(
            ledZGeometry,
            ledMaterial
          );

        led2.position.set(
          position.x +
          CELL * 0.34,
          1.68,
          position.z
        );

        scene.add(
          led2
        );
      }
    }
  }

  /* =========================================================
     ASTRONAUT MODEL
  ========================================================= */

  function createAstronaut() {

    const group =
      new THREE.Group();

    const white =
      new THREE.MeshStandardMaterial({
        color: 0xf5f8ff,
        roughness: 0.52
      });

    const blue =
      new THREE.MeshStandardMaterial({
        color: 0x4fa8ff,
        roughness: 0.32,
        metalness: 0.15
      });

    const dark =
      new THREE.MeshStandardMaterial({
        color: 0x20365f,
        roughness: 0.5,
        metalness: 0.1
      });

    const visorMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x6bd6ff,
        roughness: 0.08,
        metalness: 0.35,
        emissive: 0x154d7d,
        emissiveIntensity: 0.35
      });

    /* Helmet */

    const helmet =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.42,
          18,
          14
        ),
        white
      );

    helmet.position.y =
      1.55;

    helmet.castShadow =
      true;

    group.add(
      helmet
    );

    /* Visor */

    const visor =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.32,
          18,
          12
        ),
        visorMaterial
      );

    visor.scale.set(
      1,
      0.72,
      0.44
    );

    visor.position.set(
      0,
      1.57,
      -0.28
    );

    group.add(
      visor
    );

    /* Body */

    const torso =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.72,
          0.82,
          0.42
        ),
        white
      );

    torso.position.y =
      0.92;

    torso.castShadow =
      true;

    group.add(
      torso
    );

    /* Chest panel */

    const chest =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.42,
          0.26,
          0.06
        ),
        blue
      );

    chest.position.set(
      0,
      1,
      -0.24
    );

    group.add(
      chest
    );

    /* Oxygen tank */

    const tank =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.54,
          0.7,
          0.27
        ),
        dark
      );

    tank.position.set(
      0,
      0.98,
      0.33
    );

    tank.castShadow =
      true;

    group.add(
      tank
    );

    const limbGeometry =
      new THREE.CylinderGeometry(
        0.115,
        0.115,
        0.62,
        10
      );

    /* Arms */

    const leftArm =
      new THREE.Mesh(
        limbGeometry,
        white
      );

    const rightArm =
      new THREE.Mesh(
        limbGeometry,
        white
      );

    leftArm.position.set(
      -0.48,
      0.98,
      0
    );

    rightArm.position.set(
      0.48,
      0.98,
      0
    );

    leftArm.rotation.z =
      -0.16;

    rightArm.rotation.z =
      0.16;

    group.add(
      leftArm,
      rightArm
    );

    /* Legs */

    const leftLeg =
      new THREE.Mesh(
        limbGeometry,
        white
      );

    const rightLeg =
      new THREE.Mesh(
        limbGeometry,
        white
      );

    leftLeg.position.set(
      -0.2,
      0.29,
      0
    );

    rightLeg.position.set(
      0.2,
      0.29,
      0
    );

    group.add(
      leftLeg,
      rightLeg
    );

    /* Boots */

    const bootGeometry =
      new THREE.BoxGeometry(
        0.24,
        0.16,
        0.4
      );

    const leftBoot =
      new THREE.Mesh(
        bootGeometry,
        dark
      );

    const rightBoot =
      new THREE.Mesh(
        bootGeometry,
        dark
      );

    leftBoot.position.set(
      -0.2,
      -0.05,
      -0.06
    );

    rightBoot.position.set(
      0.2,
      -0.05,
      -0.06
    );

    group.add(
      leftBoot,
      rightBoot
    );

    astroParts = {
      leftArm,
      rightArm,
      leftLeg,
      rightLeg
    };

    group.scale.setScalar(
      0.84
    );

    return group;
  }

  /* =========================================================
     ALIEN MODEL
  ========================================================= */

  function createAlien(
    color
  ) {

    const group =
      new THREE.Group();

    const bodyMaterial =
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.32,
        metalness: 0.12,

        emissive:
          new THREE.Color(
            color
          )
          .multiplyScalar(
            0.35
          ),

        emissiveIntensity:
          1.2
      });

    const eyeWhite =
      new THREE.MeshBasicMaterial({
        color: 0xffffff
      });

    const pupilMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x12030d
      });

    /* Head */

    const head =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.46,
          14,
          10
        ),
        bodyMaterial
      );

    head.position.y =
      0.95;

    head.scale.set(
      1,
      0.82,
      0.9
    );

    group.add(
      head
    );

    /* Body */

    const body =
      new THREE.Mesh(
        new THREE.DodecahedronGeometry(
          0.45,
          0
        ),
        bodyMaterial
      );

    body.position.y =
      0.47;

    body.scale.y =
      0.8;

    group.add(
      body
    );

    /* Eyes */

    [-0.17, 0.17]
      .forEach(
        x => {

          const eye =
            new THREE.Mesh(
              new THREE.SphereGeometry(
                0.1,
                8,
                6
              ),
              eyeWhite
            );

          eye.position.set(
            x,
            1,
            -0.38
          );

          const pupil =
            new THREE.Mesh(
              new THREE.SphereGeometry(
                0.04,
                6,
                5
              ),
              pupilMaterial
            );

          pupil.position.set(
            0,
            0,
            -0.085
          );

          eye.add(
            pupil
          );

          group.add(
            eye
          );
        }
      );

    /* Legs */

    const legGeometry =
      new THREE.CylinderGeometry(
        0.07,
        0.09,
        0.42,
        7
      );

    const legs = [];

    [-0.25, 0, 0.25]
      .forEach(
        x => {

          const leg =
            new THREE.Mesh(
              legGeometry,
              bodyMaterial
            );

          leg.position.set(
            x,
            0.08,
            0
          );

          leg.rotation.z =
            (x || 0.01) *
            0.5;

          group.add(
            leg
          );

          legs.push(
            leg
          );
        }
      );

    /* Horns */

    const hornGeometry =
      new THREE.ConeGeometry(
        0.08,
        0.38,
        7
      );

    [-0.2, 0.2]
      .forEach(
        x => {

          const horn =
            new THREE.Mesh(
              hornGeometry,
              bodyMaterial
            );

          horn.position.set(
            x,
            1.42,
            0
          );

          horn.rotation.z =
            x < 0
            ? 0.18
            : -0.18;

          group.add(
            horn
          );
        }
      );

    group.userData.legs =
      legs;

    return group;
  }

  /* =========================================================
     SPAWN ALIENS
  ========================================================= */

  function spawnAliens(
    count
  ) {

    aliens.forEach(
      alien =>
        disposeObject(
          alien.group
        )
    );

    aliens = [];

    const colors = [
      0xff335f,
      0xa743ff,
      0xff5a9f,
      0x7e3cff
    ];

    for (
      let index = 0;
      index < count;
      index++
    ) {

      const spawn =
        ALIEN_SPAWNS[
          index %
          ALIEN_SPAWNS.length
        ];

      const position =
        gridToWorld(
          spawn.row,
          spawn.col
        );

      const group =
        createAlien(
          colors[
            index %
            colors.length
          ]
        );

      group.position.set(
        position.x,
        0.04,
        position.z
      );

      scene.add(
        group
      );

      aliens.push({
        group,

        path: [],

        repath: 0,

        speed:
          2 +
          index *
          0.13,

        phase:
          Math.random() *
          Math.PI *
          2
      });
    }

    alienCountEl.textContent =
      String(
        aliens.length
      );
  }

  /* =========================================================
     HOLOGRAM TEXTURE
  ========================================================= */

  function createHologramTexture(
    text
  ) {

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      768;

    canvas.height =
      300;

    const ctx =
      canvas.getContext(
        "2d"
      );

    ctx.fillStyle =
      "rgba(6,18,42,.92)";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.strokeStyle =
      "#70ecff";

    ctx.lineWidth =
      15;

    ctx.shadowColor =
      "#48d9ff";

    ctx.shadowBlur =
      26;

    ctx.strokeRect(
      10,
      10,
      748,
      280
    );

    ctx.shadowBlur =
      0;

    ctx.fillStyle =
      "#ffffff";

    ctx.font =
      "800 50px Arial";

    ctx.textAlign =
      "center";

    ctx.textBaseline =
      "middle";

    drawWrappedText(
      ctx,
      text,
      384,
      150,
      650,
      58
    );

    const texture =
      new THREE.CanvasTexture(
        canvas
      );

    texture.colorSpace =
      THREE.SRGBColorSpace;

    return texture;
  }

  function drawWrappedText(
    ctx,
    text,
    centerX,
    centerY,
    maxWidth,
    lineHeight
  ) {

    const words =
      String(text)
        .split(" ");

    const lines = [];

    let line = "";

    words.forEach(
      word => {

        const test =
          line
          ? line + " " + word
          : word;

        if (
          ctx.measureText(test).width
          >
          maxWidth
          &&
          line
        ) {

          lines.push(
            line
          );

          line =
            word;
        }

        else {

          line =
            test;
        }
      }
    );

    if (line) {

      lines.push(
        line
      );
    }

    const visible =
      lines.slice(
        0,
        4
      );

    const y0 =
      centerY -
      (
        visible.length -
        1
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
          centerX,
          y0 +
          index *
          lineHeight
        );
      }
    );
  }

  /* =========================================================
     TELEPORT STATIONS
  ========================================================= */

  function buildStations() {

    disposeStations();

    const ringGeometry =
      new THREE.TorusGeometry(
        0.92,
        0.12,
        10,
        28
      );

    const diskGeometry =
      new THREE.CylinderGeometry(
        0.92,
        0.92,
        0.12,
        28
      );

    STATIONS.forEach(
      (
        station,
        index
      ) => {

        const position =
          gridToWorld(
            station.row,
            station.col
          );

        const diskMaterial =
          new THREE.MeshStandardMaterial({
            color: 0x153a6d,

            emissive:
              0x0f5ea9,

            emissiveIntensity:
              1,

            roughness:
              0.32,

            metalness:
              0.32
          });

        const ringMaterial =
          new THREE.MeshStandardMaterial({
            color: 0x6deaff,

            emissive:
              0x30ccff,

            emissiveIntensity:
              2.4,

            roughness:
              0.2,

            metalness:
              0.1
          });

        /* Pad */

        const disk =
          new THREE.Mesh(
            diskGeometry,
            diskMaterial
          );

        disk.position.set(
          position.x,
          0.06,
          position.z
        );

        /* Neon ring */

        const ring =
          new THREE.Mesh(
            ringGeometry,
            ringMaterial
          );

        ring.rotation.x =
          Math.PI / 2;

        ring.position.set(
          position.x,
          0.14,
          position.z
        );

        /* Hologram answer */

        const sign =
          new THREE.Mesh(
            new THREE.PlaneGeometry(
              2.8,
              1.08
            ),

            new THREE.MeshBasicMaterial({
              map:
                createHologramTexture(
                  stationAnswers[
                    index
                  ]
                ),

              transparent:
                true,

              side:
                THREE.DoubleSide
            })
          );

        sign.position.set(
          position.x,
          2.15,
          position.z
        );

        sign.rotation.x =
          -0.08;

        scene.add(
          disk,
          ring,
          sign
        );

        stationsMeshes.push({
          disk,
          ring,
          sign,
          index
        });

        /* Teleport beam */

        const beam =
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              0.84,
              0.84,
              4.8,
              24,
              1,
              true
            ),

            new THREE.MeshBasicMaterial({
              color:
                0x6deaff,

              transparent:
                true,

              opacity:
                0,

              side:
                THREE.DoubleSide,

              depthWrite:
                false
            })
          );

        beam.position.set(
          position.x,
          2.4,
          position.z
        );

        scene.add(
          beam
        );

        teleportBeams.push(
          beam
        );
      }
    );
  }

  /* =========================================================
     QUESTION
  ========================================================= */

  function newQuestion() {

    currentItem =
      VOCAB[
        Math.floor(
          Math.random() *
          VOCAB.length
        )
      ];

    stationAnswers =
      shuffle([
        currentItem.correct,
        ...currentItem.wrong
      ])
      .slice(
        0,
        4
      );

    questionEl.textContent =
      currentItem.word;

    answerLock =
      false;

    lastStationKey =
      "";

    buildStations();

    resetAliens();
  }

  /* =========================================================
     LOOP
  ========================================================= */

  function animate() {

    requestAnimationFrame(
      animate
    );

    if (
      !clock ||
      !renderer
    ) {
      return;
    }

    const dt =
      Math.min(
        clock.getDelta(),
        0.034
      );

    if (
      !gameEnded
    ) {

      updatePlayer(
        dt
      );

      updateAliens(
        dt
      );

      animateStations();

      checkStations();

      checkAlienCollision();

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
     PLAYER MOVEMENT
  ========================================================= */

  function updatePlayer(
    dt
  ) {

    let dx =
      (
        pressed.right
        ? 1
        : 0
      )
      -
      (
        pressed.left
        ? 1
        : 0
      );

    let dz =
      (
        pressed.down
        ? 1
        : 0
      )
      -
      (
        pressed.up
        ? 1
        : 0
      );

    const length =
      Math.hypot(
        dx,
        dz
      );

    if (
      !length
    ) {

      animateAstronaut(
        false,
        dt
      );

      return;
    }

    dx /=
      length;

    dz /=
      length;

    lastMove = {
      x: dx,
      z: dz
    };

    const speed =
      4.65;

    const moveX =
      dx *
      speed *
      dt;

    const moveZ =
      dz *
      speed *
      dt;

    /*
      Collision tách X và Z.
      Đây là phần giúp nhân vật trượt dọc tường
      thay vì bị đứng cứng khi chạm góc.
    */

    const nextX =
      astronaut.position.x +
      moveX;

    if (
      canStandAt(
        nextX,
        astronaut.position.z
      )
    ) {

      astronaut.position.x =
        nextX;
    }

    const nextZ =
      astronaut.position.z +
      moveZ;

    if (
      canStandAt(
        astronaut.position.x,
        nextZ
      )
    ) {

      astronaut.position.z =
        nextZ;
    }

    const angle =
      Math.atan2(
        dx,
        dz
      );

    astronaut.rotation.y =
      lerpAngle(
        astronaut.rotation.y,
        angle,
        0.22
      );

    animateAstronaut(
      true,
      dt
    );
  }

  /* =========================================================
     COLLISION
  ========================================================= */

  function canStandAt(
    x,
    z
  ) {

    const radius =
      0.29;

    const samples = [

      [
        x - radius,
        z
      ],

      [
        x + radius,
        z
      ],

      [
        x,
        z - radius
      ],

      [
        x,
        z + radius
      ],

      [
        x -
        radius *
        0.72,

        z -
        radius *
        0.72
      ],

      [
        x +
        radius *
        0.72,

        z -
        radius *
        0.72
      ],

      [
        x -
        radius *
        0.72,

        z +
        radius *
        0.72
      ],

      [
        x +
        radius *
        0.72,

        z +
        radius *
        0.72
      ]
    ];

    return samples.every(
      (
        [
          sampleX,
          sampleZ
        ]
      ) => {

        const cell =
          worldToGrid(
            sampleX,
            sampleZ
          );

        return isWalkable(
          cell.row,
          cell.col
        );
      }
    );
  }

  /* =========================================================
     ASTRONAUT ANIMATION
  ========================================================= */

  function animateAstronaut(
    walking,
    dt
  ) {

    if (
      !astroParts
    ) {
      return;
    }

    if (
      walking
    ) {

      walkTime +=
        dt *
        9.5;

      const swing =
        Math.sin(
          walkTime
        )
        *
        0.58;

      astroParts
        .leftLeg
        .rotation
        .x =
        swing;

      astroParts
        .rightLeg
        .rotation
        .x =
        -swing;

      astroParts
        .leftArm
        .rotation
        .x =
        -swing *
        0.72;

      astroParts
        .rightArm
        .rotation
        .x =
        swing *
        0.72;

      astronaut.position.y =
        0.05
        +
        Math.abs(
          Math.sin(
            walkTime * 2
          )
        )
        *
        0.035;
    }

    else {

      [
        astroParts.leftLeg,
        astroParts.rightLeg,
        astroParts.leftArm,
        astroParts.rightArm
      ]
      .forEach(
        limb => {

          limb.rotation.x *=
            0.78;
        }
      );

      astronaut.position.y =
        THREE.MathUtils.lerp(
          astronaut.position.y,
          0.05,
          0.2
        );
    }
  }

  /* =========================================================
     ALIEN AI
  ========================================================= */

  function updateAliens(
    dt
  ) {

    const playerCell =
      worldToGrid(
        astronaut.position.x,
        astronaut.position.z
      );

    aliens.forEach(
      (
        alien,
        index
      ) => {

        alien.repath -=
          dt;

        const alienCell =
          worldToGrid(
            alien.group.position.x,
            alien.group.position.z
          );

        if (
          alien.repath <= 0
          ||
          alien.path.length === 0
        ) {

          alien.path =
            findPath(
              alienCell,
              playerCell
            )
            .slice(
              1
            );

          alien.repath =
            0.28
            +
            Math.random()
            *
            0.16;
        }

        const next =
          alien.path[0];

        if (
          !next
        ) {
          return;
        }

        const target =
          gridToWorld(
            next.row,
            next.col
          );

        const dx =
          target.x
          -
          alien.group.position.x;

        const dz =
          target.z
          -
          alien.group.position.z;

        const distance =
          Math.hypot(
            dx,
            dz
          );

        if (
          distance <
          0.06
        ) {

          alien.group.position.x =
            target.x;

          alien.group.position.z =
            target.z;

          alien.path.shift();
        }

        else {

          const step =
            Math.min(
              distance,
              alien.speed *
              dt
            );

          alien.group.position.x +=
            dx /
            distance *
            step;

          alien.group.position.z +=
            dz /
            distance *
            step;

          alien.group.rotation.y =
            lerpAngle(
              alien.group.rotation.y,
              Math.atan2(
                dx,
                dz
              ),
              0.2
            );
        }

        /*
          Alien nhún nhẹ + chân chuyển động.
        */

        const time =
          performance.now()
          *
          0.008
          +
          alien.phase;

        alien.group.position.y =
          0.04
          +
          Math.sin(
            time
          )
          *
          0.06;

        alien.group
          .userData
          .legs
          ?.forEach(
            (
              leg,
              legIndex
            ) => {

              leg.rotation.x =
                Math.sin(
                  time *
                  1.7
                  +
                  legIndex *
                  Math.PI
                )
                *
                0.45;
            }
          );
      }
    );
  }

  /* =========================================================
     STATION ANIMATION
  ========================================================= */

  function animateStations() {

    stationsMeshes.forEach(
      (
        station,
        index
      ) => {

        station.ring.rotation.z +=
          0.012
          +
          index *
          0.0007;

        station
          .disk
          .material
          .emissiveIntensity =

          1
          +
          Math.sin(
            performance.now()
            *
            0.004
            +
            index
          )
          *
          0.25;
      }
    );
  }

  /* =========================================================
     STATION COLLISION
  ========================================================= */

  function checkStations() {

    if (
      answerLock
    ) {
      return;
    }

    const cell =
      worldToGrid(
        astronaut.position.x,
        astronaut.position.z
      );

    const key =
      `${cell.row},${cell.col}`;

    if (
      key ===
      lastStationKey
    ) {
      return;
    }

    lastStationKey =
      key;

    const stationIndex =
      STATIONS.findIndex(
        station =>
          station.row ===
          cell.row
          &&
          station.col ===
          cell.col
      );

    if (
      stationIndex < 0
    ) {
      return;
    }

    answerLock =
      true;

    const selectedAnswer =
      stationAnswers[
        stationIndex
      ];

    if (
      selectedAnswer ===
      currentItem.correct
    ) {

      handleCorrectStation(
        stationIndex
      );
    }

    else {

      handleWrongStation(
        stationIndex
      );
    }
  }

  /* =========================================================
     CORRECT
  ========================================================= */

  function handleCorrectStation(
    index
  ) {

    score +=
      120;

    flashMessage(
      "✓ Đúng! TELEPORT — tiêu diệt toàn bộ Alien!",
      "good"
    );

    updateHud();

    triggerTeleport(
      index,
      true
    );

    vanishAliens();

    setTimeout(
      () => {

        newQuestion();
      },
      900
    );
  }

  /* =========================================================
     WRONG
  ========================================================= */

  function handleWrongStation(
    index
  ) {

    flashMessage(
      "✕ Sai! Teleport Pad từ chối.",
      "bad"
    );

    triggerTeleport(
      index,
      false
    );

    pushPlayerBack();

    setTimeout(
      () => {

        answerLock =
          false;
      },
      560
    );
  }

  /* =========================================================
     TELEPORT EFFECT
  ========================================================= */

  function triggerTeleport(
    index,
    good
  ) {

    const station =
      stationsMeshes[
        index
      ];

    const beam =
      teleportBeams[
        index
      ];

    if (
      !station ||
      !beam
    ) {
      return;
    }

    const color =
      good
      ? 0x71ecff
      : 0xff334f;

    station
      .ring
      .material
      .color
      .setHex(
        color
      );

    station
      .ring
      .material
      .emissive
      .setHex(
        color
      );

    station
      .disk
      .material
      .emissive
      .setHex(
        color
      );

    beam
      .material
      .color
      .setHex(
        color
      );

    beam.material.opacity =
      0.44;

    const startTime =
      performance.now();

    const animateBeam =
      now => {

        const progress =
          Math.min(
            1,
            (
              now -
              startTime
            )
            /
            650
          );

        beam.material.opacity =
          (
            1 -
            progress
          )
          *
          0.44;

        beam.scale.set(
          1 +
          progress *
          0.65,

          1,

          1 +
          progress *
          0.65
        );

        if (
          progress < 1
        ) {

          requestAnimationFrame(
            animateBeam
          );
        }

        else {

          beam.material.opacity =
            0;

          beam.scale.set(
            1,
            1,
            1
          );
        }
      };

    requestAnimationFrame(
      animateBeam
    );
  }

  /* =========================================================
     REMOVE ALIENS EFFECT
  ========================================================= */

  function vanishAliens() {

    aliens.forEach(
      (
        alien,
        index
      ) => {

        const startTime =
          performance.now();

        const animateAlien =
          now => {

            const progress =
              Math.min(
                1,
                (
                  now -
                  startTime
                )
                /
                520
              );

            const scale =
              1 -
              progress;

            alien.group.scale.setScalar(
              Math.max(
                0.02,
                scale
              )
            );

            alien.group.rotation.y +=
              0.18;

            alien.group.position.y =
              0.04
              +
              progress *
              2.8;

            if (
              progress < 1
            ) {

              requestAnimationFrame(
                animateAlien
              );
            }
          };

        setTimeout(
          () => {

            requestAnimationFrame(
              animateAlien
            );
          },
          index *
          45
        );
      }
    );
  }

  /* =========================================================
     PUSH PLAYER BACK
  ========================================================= */

  function pushPlayerBack() {

    const amount =
      1.25;

    const nextX =
      astronaut.position.x
      -
      lastMove.x *
      amount;

    const nextZ =
      astronaut.position.z
      -
      lastMove.z *
      amount;

    if (
      canStandAt(
        nextX,
        nextZ
      )
    ) {

      astronaut.position.x =
        nextX;

      astronaut.position.z =
        nextZ;
    }

    else {

      resetPlayer();
    }
  }

  /* =========================================================
     ALIEN COLLISION
  ========================================================= */

  function checkAlienCollision() {

    if (
      answerLock
    ) {
      return;
    }

    for (
      const alien
      of
      aliens
    ) {

      const dx =
        astronaut.position.x
        -
        alien.group.position.x;

      const dz =
        astronaut.position.z
        -
        alien.group.position.z;

      const distance =
        Math.hypot(
          dx,
          dz
        );

      if (
        distance <
        0.72
      ) {

        answerLock =
          true;

        lives--;

        flashMessage(
          "👽 Alien bắt được bạn! Mất 1 mạng.",
          "bad"
        );

        resetPlayer();

        resetAliens();

        updateHud();

        if (
          lives <= 0
        ) {

          endGame();

          return;
        }

        setTimeout(
          () => {

            answerLock =
              false;
          },
          700
        );

        break;
      }
    }
  }

  /* =========================================================
     RESET PLAYER
  ========================================================= */

  function resetPlayer() {

    const position =
      gridToWorld(
        START.row,
        START.col
      );

    astronaut.position.set(
      position.x,
      0.05,
      position.z
    );

    lastStationKey =
      "";
  }

  /* =========================================================
     RESET ALIENS
  ========================================================= */

  function resetAliens() {

    aliens.forEach(
      (
        alien,
        index
      ) => {

        const spawn =
          ALIEN_SPAWNS[
            index %
            ALIEN_SPAWNS.length
          ];

        const position =
          gridToWorld(
            spawn.row,
            spawn.col
          );

        alien
          .group
          .position
          .set(
            position.x,
            0.04,
            position.z
          );

        alien.group.scale.setScalar(
          1
        );

        alien.path =
          [];

        alien.repath =
          0;
      }
    );
  }

  /* =========================================================
     INPUT
  ========================================================= */

  function setupInput() {

    window.addEventListener(
      "keydown",
      event => {

        const key =
          event.key.toLowerCase();

        if (
          [
            "arrowup",
            "arrowdown",
            "arrowleft",
            "arrowright",
            "w",
            "a",
            "s",
            "d"
          ]
          .includes(
            key
          )
        ) {

          event.preventDefault();
        }

        if (
          key === "arrowup" ||
          key === "w"
        ) {

          pressed.up =
            true;
        }

        if (
          key === "arrowdown" ||
          key === "s"
        ) {

          pressed.down =
            true;
        }

        if (
          key === "arrowleft" ||
          key === "a"
        ) {

          pressed.left =
            true;
        }

        if (
          key === "arrowright" ||
          key === "d"
        ) {

          pressed.right =
            true;
        }
      }
    );

    window.addEventListener(
      "keyup",
      event => {

        const key =
          event.key.toLowerCase();

        if (
          key === "arrowup" ||
          key === "w"
        ) {

          pressed.up =
            false;
        }

        if (
          key === "arrowdown" ||
          key === "s"
        ) {

          pressed.down =
            false;
        }

        if (
          key === "arrowleft" ||
          key === "a"
        ) {

          pressed.left =
            false;
        }

        if (
          key === "arrowright" ||
          key === "d"
        ) {

          pressed.right =
            false;
        }
      }
    );

    /*
      Mobile control.

      setPointerCapture giúp giữ nút không bị mất điều khiển
      khi ngón tay hơi trượt khỏi button.
    */

    document
      .querySelectorAll(
        "[data-dir]"
      )
      .forEach(
        button => {

          const direction =
            button.dataset.dir;

          button.addEventListener(
            "pointerdown",
            event => {

              event.preventDefault();

              try {

                button.setPointerCapture(
                  event.pointerId
                );
              }

              catch (error) {}

              pressed[
                direction
              ] =
                true;
            }
          );

          const release =
            event => {

              event.preventDefault();

              pressed[
                direction
              ] =
                false;

              try {

                if (
                  button.hasPointerCapture(
                    event.pointerId
                  )
                ) {

                  button.releasePointerCapture(
                    event.pointerId
                  );
                }
              }

              catch (error) {}
            };

          button.addEventListener(
            "pointerup",
            release
          );

          button.addEventListener(
            "pointercancel",
            release
          );

          button.addEventListener(
            "lostpointercapture",
            () => {

              pressed[
                direction
              ] =
                false;
            }
          );
        }
      );

    window.addEventListener(
      "blur",
      clearPressed
    );

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.hidden
        ) {

          clearPressed();
        }
      }
    );

    document
      .getElementById(
        "restartBtn"
      )
      .addEventListener(
        "click",
        restart
      );
  }

  function clearPressed() {

    Object
      .keys(
        pressed
      )
      .forEach(
        key => {

          pressed[key] =
            false;
        }
      );
  }

  /* =========================================================
     BFS PATHFINDING
  ========================================================= */

  function findPath(
    start,
    goal
  ) {

    const queue = [
      start
    ];

    const parent =
      new Map();

    const startKey =
      keyOf(
        start.row,
        start.col
      );

    const goalKey =
      keyOf(
        goal.row,
        goal.col
      );

    parent.set(
      startKey,
      null
    );

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];

    while (
      queue.length
    ) {

      const current =
        queue.shift();

      if (
        keyOf(
          current.row,
          current.col
        )
        ===
        goalKey
      ) {

        break;
      }

      for (
        const [
          deltaRow,
          deltaCol
        ]
        of
        directions
      ) {

        const row =
          current.row
          +
          deltaRow;

        const col =
          current.col
          +
          deltaCol;

        const key =
          keyOf(
            row,
            col
          );

        if (
          !isWalkable(
            row,
            col
          )
          ||
          parent.has(
            key
          )
        ) {

          continue;
        }

        parent.set(
          key,
          current
        );

        queue.push({
          row,
          col
        });
      }
    }

    if (
      !parent.has(
        goalKey
      )
    ) {

      return [
        start
      ];
    }

    const path = [];

    let cursor =
      goal;

    while (
      cursor
    ) {

      path.push(
        cursor
      );

      cursor =
        parent.get(
          keyOf(
            cursor.row,
            cursor.col
          )
        );
    }

    return path.reverse();
  }

  /* =========================================================
     GRID HELPERS
  ========================================================= */

  function isWalkable(
    row,
    col
  ) {

    return (
      row >= 0
      &&
      row < ROWS
      &&
      col >= 0
      &&
      col < COLS
      &&
      GRID[row][col] !== 1
    );
  }

  function gridToWorld(
    row,
    col
  ) {

    const halfWidth =
      COLS *
      CELL /
      2;

    const halfHeight =
      ROWS *
      CELL /
      2;

    return {

      x:
        -halfWidth
        +
        CELL /
        2
        +
        col *
        CELL,

      z:
        -halfHeight
        +
        CELL /
        2
        +
        row *
        CELL
    };
  }

  function worldToGrid(
    x,
    z
  ) {

    const halfWidth =
      COLS *
      CELL /
      2;

    const halfHeight =
      ROWS *
      CELL /
      2;

    return {

      col:
        Math.floor(
          (
            x +
            halfWidth
          )
          /
          CELL
        ),

      row:
        Math.floor(
          (
            z +
            halfHeight
          )
          /
          CELL
        )
    };
  }

  function keyOf(
    row,
    col
  ) {

    return (
      row +
      "," +
      col
    );
  }

  /* =========================================================
     CAMERA
  ========================================================= */

  function setInitialCamera() {

    camera.position.set(
      14,
      22,
      16
    );

    camera.lookAt(
      astronaut.position.x,
      0,
      astronaut.position.z
    );
  }

  function updateCamera(
    dt
  ) {

    /*
      Camera isometric bám nhân vật.
      Không zoom quá gần để vẫn nhìn được đường chạy và Alien.
    */

    const desiredX =
      astronaut.position.x +
      13.5;

    const desiredY =
      21.5;

    const desiredZ =
      astronaut.position.z +
      15.5;

    camera.position.x =
      THREE.MathUtils.lerp(
        camera.position.x,
        desiredX,
        1 -
        Math.pow(
          0.018,
          dt
        )
      );

    camera.position.y =
      THREE.MathUtils.lerp(
        camera.position.y,
        desiredY,
        1 -
        Math.pow(
          0.018,
          dt
        )
      );

    camera.position.z =
      THREE.MathUtils.lerp(
        camera.position.z,
        desiredZ,
        1 -
        Math.pow(
          0.018,
          dt
        )
      );

    camera.lookAt(
      astronaut.position.x,
      0,
      astronaut.position.z
    );
  }

  /* =========================================================
     HUD
  ========================================================= */

  function updateHud() {

    scoreEl.textContent =
      String(
        score
      );

    livesEl.textContent =
      String(
        lives
      );

    alienCountEl.textContent =
      String(
        aliens.length
      );
  }

  /* =========================================================
     MESSAGE
  ========================================================= */

  function flashMessage(
    text,
    type
  ) {

    messageEl.textContent =
      text;

    messageEl.className =
      "show " +
      type;

    clearTimeout(
      flashMessage.timer
    );

    flashMessage.timer =
      setTimeout(
        () => {

          messageEl.className =
            "";
        },
        1050
      );
  }

  /* =========================================================
     DISPOSE
  ========================================================= */

  function disposeStations() {

    stationsMeshes
      .forEach(
        station => {

          [
            station.disk,
            station.ring,
            station.sign
          ]
          .forEach(
            disposeObject
          );
        }
      );

    stationsMeshes =
      [];

    teleportBeams
      .forEach(
        disposeObject
      );

    teleportBeams =
      [];
  }

  function disposeObject(
    object
  ) {

    if (
      !object
    ) {
      return;
    }

    object.traverse?.(
      child => {

        child.geometry
          ?.dispose?.();

        if (
          child.material
        ) {

          const materials =
            Array.isArray(
              child.material
            )
            ?
            child.material
            :
            [
              child.material
            ];

          materials.forEach(
            material => {

              material.map
                ?.dispose?.();

              material
                .dispose?.();
            }
          );
        }
      }
    );

    scene.remove(
      object
    );
  }

  /* =========================================================
     GAME OVER
  ========================================================= */

  function endGame() {

    gameEnded =
      true;

    clearPressed();

    gameOverTextEl.textContent =
      `Điểm của bạn: ${score}.`;

    gameOverEl
      .classList
      .remove(
        "hidden"
      );
  }

  /* =========================================================
     RESTART
  ========================================================= */

  function restart() {

    score =
      0;

    lives =
      5;

    gameEnded =
      false;

    answerLock =
      false;

    lastStationKey =
      "";

    clearPressed();

    resetPlayer();

    spawnAliens(
      4
    );

    newQuestion();

    updateHud();

    gameOverEl
      .classList
      .add(
        "hidden"
      );
  }

  /* =========================================================
     ANGLE LERP
  ========================================================= */

  function lerpAngle(
    current,
    target,
    amount
  ) {

    let delta =
      target -
      current;

    while (
      delta >
      Math.PI
    ) {

      delta -=
        Math.PI *
        2;
    }

    while (
      delta <
      -Math.PI
    ) {

      delta +=
        Math.PI *
        2;
    }

    return (
      current
      +
      delta *
      amount
    );
  }

  /* =========================================================
     RESIZE
  ========================================================= */

  function onResize() {

    camera.aspect =
      window.innerWidth
      /
      window.innerHeight;

    camera
      .updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        1.65
      )
    );
  }

  /* =========================================================
     SHUFFLE
  ========================================================= */

  function shuffle(
    source
  ) {

    const array = [
      ...source
    ];

    for (
      let index =
        array.length - 1;

      index > 0;

      index--
    ) {

      const randomIndex =
        Math.floor(
          Math.random()
          *
          (
            index +
            1
          )
        );

      [
        array[index],
        array[randomIndex]
      ]
      =
      [
        array[randomIndex],
        array[index]
      ];
    }

    return array;
  }

  /* =========================================================
     BOOT ERROR
  ========================================================= */

  function showBootError(
    message
  ) {

    console.error(
      message
    );

    if (
      !bootErrorEl
    ) {
      return;
    }

    bootErrorEl.textContent =
      String(
        message
      );

    bootErrorEl
      .classList
      .remove(
        "hidden"
      );
  }

})();
