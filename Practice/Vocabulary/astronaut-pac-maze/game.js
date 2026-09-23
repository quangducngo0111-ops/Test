/* =========================================================
   ASTRONAUT PAC-MAZE 3D
   THREE.JS / WEBGL

   - Map dựng bằng Matrix Grid.
   - 1 = Wall
   - 0 = Corridor
   - 2 = Answer Station
   - Astronaut có body + animation tay/chân.
   - Alien dùng BFS tìm đường.
   - WASD / Arrow Keys.
========================================================= */

(() => {

  "use strict";


  /* =========================================================
     CONFIG
  ========================================================= */

  const CELL =
    2.25;



  /* =========================================================
     MAZE MATRIX
  ========================================================= */

  const GRID = [

    [
      1,1,1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,1,1,1
    ],

    [
      1,2,0,0,0,0,0,0,0,1,
      0,0,0,0,0,0,0,0,0,2,1
    ],

    [
      1,0,1,1,1,0,1,1,0,1,
      0,1,1,0,1,1,1,0,1,0,1
    ],

    [
      1,0,1,0,0,0,1,0,0,0,
      0,0,1,0,0,0,1,0,1,0,1
    ],

    [
      1,0,1,0,1,1,1,0,1,1,
      1,0,1,1,1,0,1,0,1,0,1
    ],

    [
      1,0,0,0,1,0,0,0,0,0,
      1,0,0,0,1,0,0,0,0,0,1
    ],

    [
      1,1,1,0,1,0,1,1,1,0,
      1,0,1,1,1,0,1,0,1,1,1
    ],

    [
      1,0,0,0,1,0,0,0,1,0,
      0,0,1,0,0,0,1,0,0,0,1
    ],

    [
      1,0,1,1,1,0,1,0,1,1,
      0,1,1,0,1,0,1,1,1,0,1
    ],

    [
      1,0,0,0,0,0,1,0,0,0,
      0,0,1,0,0,0,0,0,0,0,1
    ],

    [
      1,0,1,1,1,0,1,1,1,0,
      1,0,1,1,1,0,1,1,1,0,1
    ],

    [
      1,0,1,0,0,0,0,0,1,0,
      1,0,0,0,1,0,0,0,1,0,1
    ],

    [
      1,0,1,0,1,1,1,0,1,0,
      1,1,1,0,1,1,1,0,1,0,1
    ],

    [
      1,2,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,2,1
    ],

    [
      1,1,1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,1,1,1
    ]

  ];


  const ROWS =
    GRID.length;


  const COLS =
    GRID[0].length;



  /* =========================================================
     START / STATIONS
  ========================================================= */

  const START = {

    row:7,

    col:10

  };


  const STATIONS = [

    {
      row:1,
      col:1
    },

    {
      row:1,
      col:19
    },

    {
      row:13,
      col:1
    },

    {
      row:13,
      col:19
    }

  ];



  /* =========================================================
     ALIEN SPAWNS
  ========================================================= */

  const ALIEN_SPAWNS = [

    {
      row:1,
      col:10
    },

    {
      row:13,
      col:10
    },

    {
      row:7,
      col:1
    },

    {
      row:7,
      col:19
    }

  ];



  /* =========================================================
     DEMO VOCAB
  ========================================================= */

  const VOCAB = [

    {
      word:
        "public transport",

      correct:
        "hệ thống giao thông công cộng",

      wrong:[
        "khu dân cư",
        "tắc nghẽn giao thông",
        "cơ sở y tế"
      ]
    },


    {
      word:
        "income inequality",

      correct:
        "bất bình đẳng thu nhập",

      wrong:[
        "thuế thu nhập",
        "thu nhập khả dụng",
        "tăng lương"
      ]
    },


    {
      word:
        "renewable energy",

      correct:
        "năng lượng tái tạo",

      wrong:[
        "nhiên liệu hóa thạch",
        "hiệu suất năng lượng",
        "khí thải"
      ]
    },


    {
      word:
        "higher education",

      correct:
        "giáo dục đại học",

      wrong:[
        "giáo dục mầm non",
        "đào tạo nghề",
        "giáo dục bắt buộc"
      ]
    },


    {
      word:
        "labour market",

      correct:
        "thị trường lao động",

      wrong:[
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

  let astronautParts =
    null;


  let stationMeshes =
    [];


  let aliens =
    [];



  /* =========================================================
     GAME STATE
  ========================================================= */

  let score =
    0;


  let lives =
    5;


  let gameEnded =
    false;


  let answerLock =
    false;


  let currentItem =
    null;


  let stationAnswers =
    [];


  let lastStationKey =
    "";


  let walkTime =
    0;


  let moveDirection = {

    x:0,

    z:0

  };


  const pressed = {

    up:false,

    down:false,

    left:false,

    right:false

  };



  /* =========================================================
     DOM
  ========================================================= */

  const questionEl =
    document.getElementById(
      "question"
    );


  const scoreEl =
    document.getElementById(
      "score"
    );


  const livesEl =
    document.getElementById(
      "lives"
    );


  const alienCountEl =
    document.getElementById(
      "alienCount"
    );


  const messageEl =
    document.getElementById(
      "message"
    );


  const bootErrorEl =
    document.getElementById(
      "bootError"
    );


  const gameOverEl =
    document.getElementById(
      "gameOver"
    );


  const gameOverTextEl =
    document.getElementById(
      "gameOverText"
    );



  /* =========================================================
     BOOT
  ========================================================= */

  if(
    !window.THREE
  ){

    showBootError(

      "Không tải được Three.js.\n" +

      "Kiểm tra Internet hoặc CDN."

    );


    return;

  }


  try{

    init();

    animate();

  }

  catch(error){

    showBootError(

      error?.stack

      ||

      error?.message

      ||

      String(error)

    );

  }



  /* =========================================================
     INIT
  ========================================================= */

  function init(){

    scene =
    new THREE.Scene();


    scene.background =
    new THREE.Color(
      0x040914
    );


    scene.fog =
    new THREE.Fog(

      0x040914,

      42,

      82

    );


    camera =
    new THREE.PerspectiveCamera(

      52,

      window.innerWidth
      /
      window.innerHeight,

      .1,

      160

    );


    renderer =
    new THREE.WebGLRenderer({

      antialias:true,

      powerPreference:
        "high-performance"

    });


    renderer.setPixelRatio(

      Math.min(

        window.devicePixelRatio
        ||
        1,

        1.7

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


    document
    .getElementById(
      "game"
    )
    .prepend(
      renderer.domElement
    );


    clock =
    new THREE.Clock();


    createLights();


    createMaze();


    astronaut =
    createAstronaut();


    resetPlayer();


    scene.add(
      astronaut
    );


    spawnAliens(
      3
    );


    newQuestion();


    setupInput();


    positionCamera();


    updateHUD();


    window.addEventListener(

      "resize",

      onResize

    );

  }



  /* =========================================================
     LIGHT
  ========================================================= */

  function createLights(){

    const ambient =
    new THREE.AmbientLight(

      0x9ebcff,

      1.45

    );


    scene.add(
      ambient
    );


    const directional =
    new THREE.DirectionalLight(

      0xffffff,

      2.2

    );


    directional.position.set(

      15,

      30,

      18

    );


    directional.castShadow =
    true;


    directional.shadow
    .mapSize
    .set(

      1024,

      1024

    );


    directional.shadow.camera.left =
    -30;


    directional.shadow.camera.right =
    30;


    directional.shadow.camera.top =
    28;


    directional.shadow.camera.bottom =
    -28;


    scene.add(
      directional
    );


    const blue =
    new THREE.PointLight(

      0x356cff,

      14,

      28,

      2

    );


    blue.position.set(

      0,

      7,

      0

    );


    scene.add(
      blue
    );

  }



  /* =========================================================
     MAZE
  ========================================================= */

  function createMaze(){

    const floor =
    new THREE.Mesh(

      new THREE.PlaneGeometry(

        COLS
        *
        CELL,

        ROWS
        *
        CELL

      ),

      new THREE.MeshStandardMaterial({

        color:
          0x071322,

        roughness:
          .95

      })

    );


    floor.rotation.x =
    -Math.PI / 2;


    floor.position.y =
    -.05;


    floor.receiveShadow =
    true;


    scene.add(
      floor
    );


    const wallGeometry =
    new THREE.BoxGeometry(

      CELL * .96,

      1.5,

      CELL * .96

    );


    const wallMaterial =
    new THREE.MeshStandardMaterial({

      color:
        0x173c91,

      roughness:
        .48,

      metalness:
        .18,

      emissive:
        0x071638,

      emissiveIntensity:
        .42

    });


    for(

      let row = 0;

      row < ROWS;

      row++

    ){

      for(

        let col = 0;

        col < COLS;

        col++

      ){

        if(
          GRID[row][col]
          !==
          1
        ){

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

          wallMaterial

        );


        wall.position.set(

          position.x,

          .75,

          position.z

        );


        wall.castShadow =
        true;


        wall.receiveShadow =
        true;


        scene.add(
          wall
        );

      }

    }


    createPathDots();

  }



  /* =========================================================
     PATH DOTS
  ========================================================= */

  function createPathDots(){

    const geometry =
    new THREE.SphereGeometry(

      .055,

      7,

      7

    );


    const material =
    new THREE.MeshBasicMaterial({

      color:
        0xdff7ff

    });


    for(

      let row = 1;

      row < ROWS - 1;

      row++

    ){

      for(

        let col = 1;

        col < COLS - 1;

        col++

      ){

        if(

          GRID[row][col]
          !==
          0

        ){

          continue;

        }


        if(

          (
            row
            +
            col
          )
          %
          2
          !==
          0

        ){

          continue;

        }


        const position =
        gridToWorld(

          row,

          col

        );


        const dot =
        new THREE.Mesh(

          geometry,

          material

        );


        dot.position.set(

          position.x,

          .06,

          position.z

        );


        scene.add(
          dot
        );

      }

    }

  }



  /* =========================================================
     ASTRONAUT
  ========================================================= */

  function createAstronaut(){

    const group =
    new THREE.Group();


    const white =
    new THREE.MeshStandardMaterial({

      color:
        0xf3f7ff,

      roughness:
        .62

    });


    const blue =
    new THREE.MeshStandardMaterial({

      color:
        0x55b9ff,

      roughness:
        .2,

      metalness:
        .16

    });


    const dark =
    new THREE.MeshStandardMaterial({

      color:
        0x263e70,

      roughness:
        .5

    });



    /* Helmet */

    const helmet =
    new THREE.Mesh(

      new THREE.SphereGeometry(

        .38,

        18,

        14

      ),

      white

    );


    helmet.position.y =
    1.45;


    helmet.castShadow =
    true;


    group.add(
      helmet
    );



    /* Visor */

    const visor =
    new THREE.Mesh(

      new THREE.SphereGeometry(

        .29,

        18,

        12

      ),

      blue

    );


    visor.scale.set(

      1,

      .72,

      .45

    );


    visor.position.set(

      0,

      1.47,

      -.23

    );


    group.add(
      visor
    );



    /* Body */

    const torso =
    new THREE.Mesh(

      new THREE.BoxGeometry(

        .62,

        .78,

        .4

      ),

      white

    );


    torso.position.y =
    .86;


    torso.castShadow =
    true;


    group.add(
      torso
    );



    /* Backpack */

    const backpack =
    new THREE.Mesh(

      new THREE.BoxGeometry(

        .52,

        .56,

        .24

      ),

      dark

    );


    backpack.position.set(

      0,

      .93,

      .29

    );


    group.add(
      backpack
    );



    /* Cylinder limbs */

    const limbGeometry =
    new THREE.CylinderGeometry(

      .11,

      .11,

      .58,

      10

    );


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

      -.43,

      .94,

      0

    );


    rightArm.position.set(

      .43,

      .94,

      0

    );


    leftArm.rotation.z =
    -.16;


    rightArm.rotation.z =
    .16;


    group.add(

      leftArm,

      rightArm

    );



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

      -.18,

      .28,

      0

    );


    rightLeg.position.set(

      .18,

      .28,

      0

    );


    group.add(

      leftLeg,

      rightLeg

    );


    astronautParts = {

      leftArm,

      rightArm,

      leftLeg,

      rightLeg

    };


    group.scale.setScalar(
      .82
    );


    return group;

  }



  /* =========================================================
     ALIEN
  ========================================================= */

  function createAlien(
    color
  ){

    const group =
    new THREE.Group();


    const material =
    new THREE.MeshStandardMaterial({

      color,

      roughness:.46,

      emissive:

        new THREE.Color(
          color
        )
        .multiplyScalar(
          .12
        )

    });


    const white =
    new THREE.MeshBasicMaterial({

      color:
        0xffffff

    });


    const black =
    new THREE.MeshBasicMaterial({

      color:
        0x111111

    });



    /* Head */

    const head =
    new THREE.Mesh(

      new THREE.SphereGeometry(

        .42,

        16,

        12

      ),

      material

    );


    head.position.y =
    .82;


    head.scale.y =
    .82;


    head.castShadow =
    true;


    group.add(
      head
    );



    /* Body */

    const body =
    new THREE.Mesh(

      new THREE.BoxGeometry(

        .68,

        .55,

        .5

      ),

      material

    );


    body.position.y =
    .38;


    body.castShadow =
    true;


    group.add(
      body
    );



    /* Eyes */

    [
      -.16,
      .16
    ]
    .forEach(
      x => {

        const eye =
        new THREE.Mesh(

          new THREE.SphereGeometry(

            .09,

            9,

            7

          ),

          white

        );


        eye.position.set(

          x,

          .88,

          -.35

        );


        const pupil =
        new THREE.Mesh(

          new THREE.SphereGeometry(

            .035,

            7,

            6

          ),

          black

        );


        pupil.position.set(

          0,

          0,

          -.08

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

    [
      -.2,
      .2
    ]
    .forEach(
      x => {

        const leg =
        new THREE.Mesh(

          new THREE.CylinderGeometry(

            .075,

            .075,

            .34,

            8

          ),

          material

        );


        leg.position.set(

          x,

          .02,

          0

        );


        group.add(
          leg
        );

      }
    );


    group.scale.setScalar(
      .85
    );


    return group;

  }



  /* =========================================================
     SPAWN ALIENS
  ========================================================= */

  function spawnAliens(
    count
  ){

    aliens
    .forEach(
      alien => {

        scene.remove(
          alien.group
        );

      }
    );


    aliens =
    [];


    const colors = [

      0xff6488,

      0x5fe2b8,

      0xffcc56,

      0xad8bff

    ];


    for(

      let i = 0;

      i < count;

      i++

    ){

      const spawn =
      ALIEN_SPAWNS[

        i
        %
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

          i
          %
          colors.length

        ]

      );


      group.position.set(

        position.x,

        .04,

        position.z

      );


      scene.add(
        group
      );


      aliens.push({

        group,

        path:[],

        repath:0,

        speed:
          1.95
          +
          i
          *
          .12

      });

    }


    alienCountEl.textContent =
    String(
      aliens.length
    );

  }



  /* =========================================================
     STATION TEXT
  ========================================================= */

  function createStationTexture(
    text
  ){

    const canvas =
    document.createElement(
      "canvas"
    );


    canvas.width =
    640;


    canvas.height =
    320;


    const ctx =
    canvas.getContext(
      "2d"
    );


    ctx.fillStyle =
    "#09182e";


    ctx.fillRect(

      0,

      0,

      canvas.width,

      canvas.height

    );


    ctx.strokeStyle =
    "#6bdcff";


    ctx.lineWidth =
    14;


    ctx.strokeRect(

      8,

      8,

      canvas.width - 16,

      canvas.height - 16

    );


    ctx.fillStyle =
    "#ffffff";


    ctx.font =
    "700 46px Arial";


    ctx.textAlign =
    "center";


    ctx.textBaseline =
    "middle";


    drawWrappedText(

      ctx,

      text,

      canvas.width / 2,

      canvas.height / 2,

      550,

      54

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
  ){

    const words =
    String(text)
    .split(
      " "
    );


    const lines =
    [];


    let line =
    "";


    words
    .forEach(
      word => {

        const test =
        line
        ?
        line
        +
        " "
        +
        word
        :
        word;


        if(

          ctx.measureText(
            test
          )
          .width
          >
          maxWidth

          &&

          line

        ){

          lines.push(
            line
          );


          line =
          word;

        }

        else{

          line =
          test;

        }

      }
    );


    if(line){

      lines.push(
        line
      );

    }


    const finalLines =
    lines.slice(
      0,
      4
    );


    const startY =

      centerY

      -

      (
        finalLines.length
        -
        1
      )

      *

      lineHeight
      /
      2;


    finalLines
    .forEach(
      (
        currentLine,
        index
      ) => {

        ctx.fillText(

          currentLine,

          centerX,

          startY

          +

          index
          *
          lineHeight

        );

      }
    );

  }



  /* =========================================================
     BUILD STATIONS
  ========================================================= */

  function buildStations(){

    disposeStations();


    STATIONS
    .forEach(
      (
        station,
        index
      ) => {

        const answer =
        stationAnswers[
          index
        ];


        const position =
        gridToWorld(

          station.row,

          station.col

        );



        /* Platform */

        const base =
        new THREE.Mesh(

          new THREE.CylinderGeometry(

            .92,

            .92,

            .18,

            20

          ),

          new THREE.MeshStandardMaterial({

            color:
              0x1d4386,

            emissive:
              0x071735,

            emissiveIntensity:
              .55

          })

        );


        base.position.set(

          position.x,

          .1,

          position.z

        );


        base.receiveShadow =
        true;


        scene.add(
          base
        );



        /* Text */

        const sign =
        new THREE.Mesh(

          new THREE.PlaneGeometry(

            2.4,

            1.2

          ),

          new THREE.MeshBasicMaterial({

            map:
              createStationTexture(
                answer
              ),

            side:
              THREE.DoubleSide

          })

        );


        sign.position.set(

          position.x,

          1.25,

          position.z

        );


        sign.rotation.x =
        -.16;


        scene.add(
          sign
        );


        stationMeshes.push(

          base,

          sign

        );

      }
    );

  }



  /* =========================================================
     NEW QUESTION
  ========================================================= */

  function newQuestion(){

    currentItem =

      VOCAB[

        Math.floor(

          Math.random()

          *

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
     GAME LOOP
  ========================================================= */

  function animate(){

    requestAnimationFrame(
      animate
    );


    if(
      !clock
    ){

      return;

    }


    const dt =
    Math.min(

      clock.getDelta(),

      .034

    );


    if(
      !gameEnded
    ){

      updatePlayer(
        dt
      );


      updateAliens(
        dt
      );


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
  ){

    let dx =
      0;


    let dz =
      0;


    if(
      pressed.left
    ){

      dx--;

    }


    if(
      pressed.right
    ){

      dx++;

    }


    if(
      pressed.up
    ){

      dz--;

    }


    if(
      pressed.down
    ){

      dz++;

    }


    const length =
    Math.hypot(

      dx,

      dz

    );


    if(
      length === 0
    ){

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


    moveDirection.x =
    dx;


    moveDirection.z =
    dz;


    const speed =
    4.4;


    const deltaX =
    dx
    *
    speed
    *
    dt;


    const deltaZ =
    dz
    *
    speed
    *
    dt;



    /*
      Tách collision X / Z:
      Nếu bị chặn ở một trục,
      vẫn có thể trượt theo trục còn lại.
    */

    const nextX =
    astronaut.position.x
    +
    deltaX;


    if(

      canStandAt(

        nextX,

        astronaut.position.z

      )

    ){

      astronaut.position.x =
      nextX;

    }



    const nextZ =
    astronaut.position.z
    +
    deltaZ;


    if(

      canStandAt(

        astronaut.position.x,

        nextZ

      )

    ){

      astronaut.position.z =
      nextZ;

    }



    /* Rotate */

    const angle =
    Math.atan2(

      dx,

      dz

    );


    astronaut.rotation.y =
    lerpAngle(

      astronaut.rotation.y,

      angle,

      .20

    );


    animateAstronaut(

      true,

      dt

    );

  }



  /* =========================================================
     PLAYER COLLISION
  ========================================================= */

  function canStandAt(
    x,
    z
  ){

    /*
      Hitbox nhỏ hơn model.
      Giúp đi qua hành lang và góc cua dễ hơn.
    */

    const half =
    .24;


    const points = [

      [
        x - half,
        z - half
      ],

      [
        x + half,
        z - half
      ],

      [
        x - half,
        z + half
      ],

      [
        x + half,
        z + half
      ]

    ];


    return points
    .every(
      point => {

        const cell =
        worldToGrid(

          point[0],

          point[1]

        );


        return isWalkable(

          cell.row,

          cell.col

        );

      }
    );

  }



  /* =========================================================
     WALK ANIMATION
  ========================================================= */

  function animateAstronaut(
    walking,
    dt
  ){

    if(
      !astronautParts
    ){

      return;

    }


    if(
      walking
    ){

      walkTime +=

        dt

        *
        9;


      const swing =

        Math.sin(
          walkTime
        )

        *
        .58;


      astronautParts
      .leftLeg
      .rotation
      .x =
      swing;


      astronautParts
      .rightLeg
      .rotation
      .x =
      -swing;


      astronautParts
      .leftArm
      .rotation
      .x =
      -swing
      *
      .72;


      astronautParts
      .rightArm
      .rotation
      .x =
      swing
      *
      .72;

    }

    else{

      [

        astronautParts.leftLeg,

        astronautParts.rightLeg,

        astronautParts.leftArm,

        astronautParts.rightArm

      ]
      .forEach(
        limb => {

          limb.rotation.x *=
          .80;

        }
      );

    }

  }



  /* =========================================================
     ALIEN MOVEMENT
  ========================================================= */

  function updateAliens(
    dt
  ){

    const playerCell =
    worldToGrid(

      astronaut.position.x,

      astronaut.position.z

    );


    aliens
    .forEach(
      (
        alien,
        index
      ) => {

        alien.repath -=
        dt;


        const alienCell =
        worldToGrid(

          alien
          .group
          .position
          .x,

          alien
          .group
          .position
          .z

        );


        if(

          alien.repath
          <=
          0

          ||

          alien.path.length
          ===
          0

        ){

          alien.path =

            findPath(

              alienCell,

              playerCell

            )

            .slice(
              1
            );


          alien.repath =

            .30

            +

            Math.random()

            *
            .16;

        }


        const next =
        alien.path[0];


        if(
          !next
        ){

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
        alien
        .group
        .position
        .x;


        const dz =
        target.z
        -
        alien
        .group
        .position
        .z;


        const distance =
        Math.hypot(

          dx,

          dz

        );


        if(
          distance
          <
          .07
        ){

          alien
          .group
          .position
          .x =
          target.x;


          alien
          .group
          .position
          .z =
          target.z;


          alien.path.shift();


          return;

        }


        const step =

          Math.min(

            distance,

            alien.speed
            *
            dt

          );


        alien
        .group
        .position
        .x +=

          dx
          /
          distance
          *
          step;


        alien
        .group
        .position
        .z +=

          dz
          /
          distance
          *
          step;


        const angle =
        Math.atan2(

          dx,

          dz

        );


        alien
        .group
        .rotation
        .y =
        lerpAngle(

          alien
          .group
          .rotation
          .y,

          angle,

          .18

        );


        /*
          Nhún nhẹ khi chạy.
        */

        alien
        .group
        .position
        .y =

          .04

          +

          Math.sin(

            performance.now()
            *
            .006

            +

            index

          )

          *
          .045;

      }
    );

  }



  /* =========================================================
     BFS PATHFINDING
  ========================================================= */

  function findPath(
    start,
    goal
  ){

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

      [
        -1,
        0
      ],

      [
        1,
        0
      ],

      [
        0,
        -1
      ],

      [
        0,
        1
      ]

    ];


    while(
      queue.length
    ){

      const current =
      queue.shift();


      if(

        keyOf(

          current.row,

          current.col

        )

        ===

        goalKey

      ){

        break;

      }


      for(
        const direction
        of
        directions
      ){

        const row =

          current.row

          +

          direction[0];


        const col =

          current.col

          +

          direction[1];


        const key =
        keyOf(

          row,

          col

        );


        if(

          !isWalkable(

            row,

            col

          )

          ||

          parent.has(
            key
          )

        ){

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


    if(
      !parent.has(
        goalKey
      )
    ){

      return [

        start

      ];

    }


    const path =
    [];


    let cursor =
    goal;


    while(
      cursor
    ){

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
     ANSWER STATION
  ========================================================= */

  function checkStations(){

    if(
      answerLock
    ){

      return;

    }


    const cell =
    worldToGrid(

      astronaut.position.x,

      astronaut.position.z

    );


    const key =
    keyOf(

      cell.row,

      cell.col

    );


    /*
      Không trigger liên tục
      khi vẫn đứng trong cùng 1 station.
    */

    if(
      key
      ===
      lastStationKey
    ){

      return;

    }


    lastStationKey =
    key;


    const stationIndex =
    STATIONS.findIndex(

      station =>

      station.row
      ===
      cell.row

      &&

      station.col
      ===
      cell.col

    );


    if(
      stationIndex
      <
      0
    ){

      return;

    }


    answerLock =
    true;


    const selected =
    stationAnswers[
      stationIndex
    ];


    if(

      selected

      ===

      currentItem.correct

    ){

      handleCorrectStation();

    }

    else{

      handleWrongStation();

    }

  }



  function handleCorrectStation(){

    score +=
    100;


    flashMessage(

      "✓ Đúng! Sang câu tiếp theo.",

      "good"

    );


    updateHUD();


    window.setTimeout(

      () => {

        newQuestion();

      },

      500

    );

  }



  function handleWrongStation(){

    flashMessage(

      "✕ Sai! Quay lại và tìm trạm khác.",

      "bad"

    );


    pushPlayerBack();


    window.setTimeout(

      () => {

        answerLock =
        false;

      },

      420

    );

  }



  /* =========================================================
     PUSH BACK
  ========================================================= */

  function pushPlayerBack(){

    const amount =
    1;


    const nextX =

      astronaut.position.x

      -

      moveDirection.x
      *
      amount;


    const nextZ =

      astronaut.position.z

      -

      moveDirection.z
      *
      amount;


    if(

      canStandAt(

        nextX,

        nextZ

      )

    ){

      astronaut.position.x =
      nextX;


      astronaut.position.z =
      nextZ;

    }

    else{

      resetPlayer();

    }

  }



  /* =========================================================
     ALIEN COLLISION
  ========================================================= */

  function checkAlienCollision(){

    if(
      answerLock
    ){

      return;

    }


    for(
      const alien
      of
      aliens
    ){

      const dx =

        astronaut.position.x

        -

        alien
        .group
        .position
        .x;


      const dz =

        astronaut.position.z

        -

        alien
        .group
        .position
        .z;


      const distance =

        Math.hypot(

          dx,

          dz

        );


      if(
        distance
        >
        .72
      ){

        continue;

      }


      answerLock =
      true;


      lives--;


      flashMessage(

        "👽 Alien bắt được bạn! Mất 1 mạng.",

        "bad"

      );


      resetPlayer();


      resetAliens();


      updateHUD();


      if(
        lives
        <=
        0
      ){

        endGame();

        return;

      }


      window.setTimeout(

        () => {

          answerLock =
          false;

        },

        650

      );


      break;

    }

  }



  /* =========================================================
     RESET PLAYER
  ========================================================= */

  function resetPlayer(){

    if(
      !astronaut
    ){

      return;

    }


    const position =
    gridToWorld(

      START.row,

      START.col

    );


    astronaut.position.set(

      position.x,

      .05,

      position.z

    );


    lastStationKey =
    "";

  }



  /* =========================================================
     RESET ALIENS
  ========================================================= */

  function resetAliens(){

    aliens
    .forEach(
      (
        alien,
        index
      ) => {

        const spawn =
        ALIEN_SPAWNS[

          index
          %
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

          .04,

          position.z

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

  function setupInput(){

    window.addEventListener(

      "keydown",

      event => {

        const key =
        event.key.toLowerCase();


        if(

          key
          ===
          "arrowup"

          ||

          key
          ===
          "w"

        ){

          pressed.up =
          true;

        }


        if(

          key
          ===
          "arrowdown"

          ||

          key
          ===
          "s"

        ){

          pressed.down =
          true;

        }


        if(

          key
          ===
          "arrowleft"

          ||

          key
          ===
          "a"

        ){

          pressed.left =
          true;

        }


        if(

          key
          ===
          "arrowright"

          ||

          key
          ===
          "d"

        ){

          pressed.right =
          true;

        }


        if(

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

        ){

          event.preventDefault();

        }

      }

    );


    window.addEventListener(

      "keyup",

      event => {

        const key =
        event.key.toLowerCase();


        if(

          key
          ===
          "arrowup"

          ||

          key
          ===
          "w"

        ){

          pressed.up =
          false;

        }


        if(

          key
          ===
          "arrowdown"

          ||

          key
          ===
          "s"

        ){

          pressed.down =
          false;

        }


        if(

          key
          ===
          "arrowleft"

          ||

          key
          ===
          "a"

        ){

          pressed.left =
          false;

        }


        if(

          key
          ===
          "arrowright"

          ||

          key
          ===
          "d"

        ){

          pressed.right =
          false;

        }

      }

    );



    /* Mobile */

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


            try{

              button
              .setPointerCapture(
                event.pointerId
              );

            }

            catch(error){}


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


          try{

            if(

              button
              .hasPointerCapture(
                event.pointerId
              )

            ){

              button
              .releasePointerCapture(
                event.pointerId
              );

            }

          }

          catch(error){}

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

        if(
          document.hidden
        ){

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



  /* =========================================================
     CLEAR INPUT
  ========================================================= */

  function clearPressed(){

    Object
    .keys(
      pressed
    )
    .forEach(
      key => {

        pressed[
          key
        ] =
        false;

      }
    );

  }



  /* =========================================================
     GRID HELPERS
  ========================================================= */

  function isWalkable(
    row,
    col
  ){

    return (

      row >= 0

      &&

      row < ROWS

      &&

      col >= 0

      &&

      col < COLS

      &&

      GRID[row][col]
      !==
      1

    );

  }



  function gridToWorld(
    row,
    col
  ){

    return {

      x:

        (
          col
          -
          (
            COLS
            -
            1
          )
          /
          2
        )

        *

        CELL,


      z:

        (
          row
          -
          (
            ROWS
            -
            1
          )
          /
          2
        )

        *

        CELL

    };

  }



  function worldToGrid(
    x,
    z
  ){

    return {

      col:

        Math.round(

          x
          /
          CELL

          +

          (
            COLS
            -
            1
          )
          /
          2

        ),


      row:

        Math.round(

          z
          /
          CELL

          +

          (
            ROWS
            -
            1
          )
          /
          2

        )

    };

  }



  function keyOf(
    row,
    col
  ){

    return (
      row
      +
      ","
      +
      col
    );

  }



  /* =========================================================
     CAMERA
  ========================================================= */

  function positionCamera(){

    const width =
    COLS
    *
    CELL;


    const height =
    ROWS
    *
    CELL;


    camera.position.set(

      width
      *
      .44,

      Math.max(
        width,
        height
      )
      *
      .76,

      height
      *
      .56

    );


    camera.lookAt(

      0,

      0,

      0

    );

  }



  function updateCamera(
    dt
  ){

    const width =
    COLS
    *
    CELL;


    const height =
    ROWS
    *
    CELL;


    const baseX =
    width
    *
    .44;


    const baseY =
    Math.max(
      width,
      height
    )
    *
    .76;


    const baseZ =
    height
    *
    .56;


    camera.position.x =
    THREE.MathUtils.lerp(

      camera.position.x,

      baseX

      +

      astronaut.position.x
      *
      .07,

      1
      -
      Math.pow(
        .02,
        dt
      )

    );


    camera.position.z =
    THREE.MathUtils.lerp(

      camera.position.z,

      baseZ

      +

      astronaut.position.z
      *
      .05,

      1
      -
      Math.pow(
        .02,
        dt
      )

    );


    camera.position.y =
    baseY;


    camera.lookAt(

      astronaut.position.x
      *
      .09,

      0,

      astronaut.position.z
      *
      .07

    );

  }



  /* =========================================================
     HUD
  ========================================================= */

  function updateHUD(){

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
  ){

    messageEl.textContent =
    text;


    messageEl.className =
    "show "
    +
    type;


    window.clearTimeout(
      flashMessage.timer
    );


    flashMessage.timer =
    window.setTimeout(

      () => {

        messageEl.className =
        "";

      },

      1000

    );

  }



  /* =========================================================
     DISPOSE STATIONS
  ========================================================= */

  function disposeStations(){

    stationMeshes
    .forEach(
      mesh => {

        if(
          mesh.geometry
        ){

          mesh.geometry.dispose();

        }


        if(
          mesh.material
        ){

          const materials =

            Array.isArray(
              mesh.material
            )

            ?

            mesh.material

            :

            [
              mesh.material
            ];


          materials
          .forEach(
            material => {

              material
                .map
                ?.dispose?.();


              material
                .dispose?.();

            }
          );

        }


        scene.remove(
          mesh
        );

      }
    );


    stationMeshes =
    [];

  }



  /* =========================================================
     GAME OVER
  ========================================================= */

  function endGame(){

    gameEnded =
    true;


    clearPressed();


    gameOverTextEl.textContent =

      "Điểm của bạn: "

      +

      score

      +

      ".";


    gameOverEl
    .classList
    .remove(
      "hidden"
    );

  }



  /* =========================================================
     RESTART
  ========================================================= */

  function restart(){

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
      3
    );


    newQuestion();


    updateHUD();


    gameOverEl
    .classList
    .add(
      "hidden"
    );

  }



  /* =========================================================
     LERP ANGLE
  ========================================================= */

  function lerpAngle(
    current,
    target,
    amount
  ){

    let delta =

      target

      -

      current;


    while(
      delta
      >
      Math.PI
    ){

      delta -=
      Math.PI * 2;

    }


    while(
      delta
      <
      -Math.PI
    ){

      delta +=
      Math.PI * 2;

    }


    return (

      current

      +

      delta
      *
      amount

    );

  }



  /* =========================================================
     RESIZE
  ========================================================= */

  function onResize(){

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

        window.devicePixelRatio
        ||
        1,

        1.7

      )

    );

  }



  /* =========================================================
     ERROR
  ========================================================= */

  function showBootError(
    message
  ){

    console.error(
      message
    );


    if(
      !bootErrorEl
    ){

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



  /* =========================================================
     SHUFFLE
  ========================================================= */

  function shuffle(
    source
  ){

    const array =
    [
      ...source
    ];


    for(

      let i =
        array.length
        -
        1;

      i > 0;

      i--

    ){

      const j =

        Math.floor(

          Math.random()

          *

          (
            i
            +
            1
          )

        );


      [
        array[i],
        array[j]
      ]

      =

      [
        array[j],
        array[i]
      ];

    }


    return array;

  }

})();
