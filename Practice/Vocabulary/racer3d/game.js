/* =========================================================
   STREET WORD RACER 3D
   THREE.JS / WEBGL

   GAMEPLAY:
   - Camera thứ 3 phía sau xe.
   - 3 làn:
       trái  = -3
       giữa  = 0
       phải  = 3
   - Mỗi vòng xuất hiện 3 cổng đáp án.
   - 1 đúng + 2 sai.
   - Đúng  → tăng tốc + điểm + combo.
   - Sai   → mất mạng + giảm tốc.
   - Có 2 xe đối thủ.
========================================================= */

(() => {

  "use strict";


  /* =========================================================
     VOCAB DATA DEMO
  ========================================================= */

  const VOCAB = [

    {
      word:
        "public transport",

      correct:
        "hệ thống giao thông công cộng",

      wrong:[
        "khu dân cư",
        "ô nhiễm không khí"
      ]
    },


    {
      word:
        "economic growth",

      correct:
        "tăng trưởng kinh tế",

      wrong:[
        "thất nghiệp",
        "chi tiêu hộ gia đình"
      ]
    },


    {
      word:
        "renewable energy",

      correct:
        "năng lượng tái tạo",

      wrong:[
        "nhiên liệu hóa thạch",
        "khí thải carbon"
      ]
    },


    {
      word:
        "job security",

      correct:
        "sự ổn định việc làm",

      wrong:[
        "lương tối thiểu",
        "thị trường lao động"
      ]
    },


    {
      word:
        "higher education",

      correct:
        "giáo dục đại học",

      wrong:[
        "giáo dục bắt buộc",
        "học nghề"
      ]
    },


    {
      word:
        "income inequality",

      correct:
        "bất bình đẳng thu nhập",

      wrong:[
        "phúc lợi xã hội",
        "tăng lương"
      ]
    },


    {
      word:
        "urbanisation",

      correct:
        "đô thị hóa",

      wrong:[
        "di cư quốc tế",
        "quy hoạch nông thôn"
      ]
    },


    {
      word:
        "consumer demand",

      correct:
        "nhu cầu tiêu dùng",

      wrong:[
        "chi phí sản xuất",
        "thị phần"
      ]
    }

  ];



  /* =========================================================
     CONSTANTS
  ========================================================= */

  const LANE_X = [
    -3,
    0,
    3
  ];


  const PLAYER_Z =
    4;


  const GATE_START_Z =
    -52;


  const COLLISION_Z =
    2.5;



  /* =========================================================
     THREE VARIABLES
  ========================================================= */

  let scene;

  let camera;

  let renderer;

  let clock;


  let playerCar;

  let rivalLeft;

  let rivalRight;



  /* =========================================================
     GAME STATE
  ========================================================= */

  let targetLane =
    1;


  let score =
    0;


  let lives =
    5;


  let combo =
    0;


  let gameEnded =
    false;


  let baseSpeed =
    15;


  let boost =
    0;


  let wrongSlow =
    0;


  let round =
    null;


  let roundTimer =
    null;


  let roadLines =
    [];


  let particles =
    [];


  let rivalState = [

    {
      mesh:null,

      lane:0,

      z:0,

      targetZ:0,

      overtaking:false
    },


    {
      mesh:null,

      lane:2,

      z:-2,

      targetZ:-2,

      overtaking:false
    }

  ];



  /* =========================================================
     HTML ELEMENTS
  ========================================================= */

  const targetWordEl =
    document.getElementById(
      "targetWord"
    );


  const scoreEl =
    document.getElementById(
      "score"
    );


  const livesEl =
    document.getElementById(
      "lives"
    );


  const comboEl =
    document.getElementById(
      "combo"
    );


  const speedEl =
    document.getElementById(
      "speed"
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
     START
  ========================================================= */

  if(
    !window.THREE
  ){

    showBootError(
      "Không tải được Three.js.\n" +
      "Kiểm tra kết nối Internet hoặc CDN."
    );

    return;

  }


  try{

    init();

    animate();

  }

  catch(error){

    console.error(
      error
    );


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
      0x7cb5df
    );


    scene.fog =
    new THREE.Fog(
      0x7cb5df,
      35,
      120
    );


    camera =
    new THREE.PerspectiveCamera(

      58,

      window.innerWidth
      /
      window.innerHeight,

      .1,

      180

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


    createWorld();


    createCars();


    setupControls();


    startRound();


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

      0xffffff,

      1.25

    );


    scene.add(
      ambient
    );


    const sun =
    new THREE.DirectionalLight(

      0xffffff,

      2.1

    );


    sun.position.set(

      10,

      15,

      8

    );


    sun.castShadow =
    true;


    sun.shadow.mapSize.set(

      1024,

      1024

    );


    sun.shadow.camera.left =
    -18;


    sun.shadow.camera.right =
    18;


    sun.shadow.camera.top =
    24;


    sun.shadow.camera.bottom =
    -14;


    scene.add(
      sun
    );

  }



  /* =========================================================
     WORLD
  ========================================================= */

  function createWorld(){

    /* Ground */

    const ground =
    new THREE.Mesh(

      new THREE.PlaneGeometry(

        80,

        220

      ),

      new THREE.MeshStandardMaterial({

        color:
          0x31583c,

        roughness:
          .95

      })

    );


    ground.rotation.x =
    -Math.PI / 2;


    ground.position.z =
    -55;


    ground.receiveShadow =
    true;


    scene.add(
      ground
    );



    /* Road */

    const road =
    new THREE.Mesh(

      new THREE.PlaneGeometry(

        12,

        220

      ),

      new THREE.MeshStandardMaterial({

        color:
          0x353c47,

        roughness:
          .9

      })

    );


    road.rotation.x =
    -Math.PI / 2;


    road.position.set(

      0,

      .02,

      -55

    );


    road.receiveShadow =
    true;


    scene.add(
      road
    );



    /* Road edge */

    [
      -6.25,
      6.25
    ]
    .forEach(
      x => {

        const edge =
        new THREE.Mesh(

          new THREE.BoxGeometry(

            .45,

            .25,

            220

          ),

          new THREE.MeshStandardMaterial({

            color:
              0xe8e8e8

          })

        );


        edge.position.set(

          x,

          .12,

          -55

        );


        edge.receiveShadow =
        true;


        scene.add(
          edge
        );

      }
    );



    /* Lane stripes */

    for(

      let z = -105;

      z < 10;

      z += 7

    ){

      [
        -1.5,
        1.5
      ]
      .forEach(
        x => {

          const stripe =
          new THREE.Mesh(

            new THREE.BoxGeometry(

              .12,

              .035,

              3

            ),

            new THREE.MeshStandardMaterial({

              color:
                0xffffff

            })

          );


          stripe.position.set(

            x,

            .055,

            z

          );


          stripe.receiveShadow =
          true;


          roadLines.push(
            stripe
          );


          scene.add(
            stripe
          );

        }
      );

    }


    createBuildings();

  }



  /* =========================================================
     CITY
  ========================================================= */

  function createBuildings(){

    const materials = [

      0x496580,
      0x405873,
      0x526c87,
      0x3c536e

    ]
    .map(
      color =>
      new THREE.MeshStandardMaterial({

        color,

        roughness:.85

      })
    );


    for(

      let i = 0;

      i < 42;

      i++

    ){

      const side =
      i % 2 === 0
      ?
      -1
      :
      1;


      const width =
      2.5
      +
      Math.random() * 3.5;


      const height =
      3
      +
      Math.random() * 9;


      const depth =
      3
      +
      Math.random() * 5;


      const building =
      new THREE.Mesh(

        new THREE.BoxGeometry(

          width,

          height,

          depth

        ),

        materials[
          i
          %
          materials.length
        ]

      );


      building.position.set(

        side
        *
        (
          9
          +
          Math.random()
          *
          9
        ),

        height / 2,

        -4
        -
        Math.random()
        *
        108

      );


      building.castShadow =
      true;


      building.receiveShadow =
      true;


      scene.add(
        building
      );

    }

  }



  /* =========================================================
     CAR
  ========================================================= */

  function createCar(
    color
  ){

    const group =
    new THREE.Group();


    const bodyMaterial =
    new THREE.MeshStandardMaterial({

      color,

      roughness:.35,

      metalness:.28

    });


    const darkMaterial =
    new THREE.MeshStandardMaterial({

      color:
        0x11151c,

      roughness:.85

    });


    const glassMaterial =
    new THREE.MeshStandardMaterial({

      color:
        0x65c4ee,

      roughness:.18,

      metalness:.15

    });



    /* Main body */

    const body =
    new THREE.Mesh(

      new THREE.BoxGeometry(

        1.75,

        .55,

        3.1

      ),

      bodyMaterial

    );


    body.position.y =
    .45;


    body.castShadow =
    true;


    group.add(
      body
    );



    /* Cabin */

    const cabin =
    new THREE.Mesh(

      new THREE.BoxGeometry(

        1.35,

        .6,

        1.5

      ),

      glassMaterial

    );


    cabin.position.set(

      0,

      .93,

      -.1

    );


    cabin.castShadow =
    true;


    group.add(
      cabin
    );



    /* Spoiler */

    const spoiler =
    new THREE.Mesh(

      new THREE.BoxGeometry(

        1.5,

        .12,

        .24

      ),

      darkMaterial

    );


    spoiler.position.set(

      0,

      .8,

      1.52

    );


    group.add(
      spoiler
    );



    /* Wheels */

    const wheelGeometry =
    new THREE.CylinderGeometry(

      .34,

      .34,

      .28,

      18

    );


    const wheelPositions = [

      [
        -.92,
        .25,
        -.95
      ],

      [
        .92,
        .25,
        -.95
      ],

      [
        -.92,
        .25,
        .95
      ],

      [
        .92,
        .25,
        .95
      ]

    ];


    wheelPositions
    .forEach(
      position => {

        const wheel =
        new THREE.Mesh(

          wheelGeometry,

          darkMaterial

        );


        wheel.rotation.z =
        Math.PI / 2;


        wheel.position.set(

          ...position

        );


        wheel.castShadow =
        true;


        group.add(
          wheel
        );

      }
    );


    return group;

  }



  /* =========================================================
     CARS
  ========================================================= */

  function createCars(){

    playerCar =
    createCar(
      0xff3b30
    );


    playerCar.position.set(

      0,

      .48,

      PLAYER_Z

    );


    playerCar.rotation.y =
    Math.PI;


    scene.add(
      playerCar
    );



    rivalLeft =
    createCar(
      0x30d47c
    );


    rivalLeft.scale.setScalar(
      .88
    );


    scene.add(
      rivalLeft
    );



    rivalRight =
    createCar(
      0x4187ff
    );


    rivalRight.scale.setScalar(
      .88
    );


    scene.add(
      rivalRight
    );


    rivalState[0].mesh =
    rivalLeft;


    rivalState[1].mesh =
    rivalRight;


    /* Camera behind player */

    camera.position.set(

      0,

      5.1,

      11.5

    );


    camera.lookAt(

      0,

      1,

      -14

    );

  }



  /* =========================================================
     TEXT TEXTURE
  ========================================================= */

  function createTextTexture(
    text
  ){

    const canvas =
    document.createElement(
      "canvas"
    );


    canvas.width =
    768;


    canvas.height =
    256;


    const ctx =
    canvas.getContext(
      "2d"
    );


    ctx.fillStyle =
    "#102849";


    ctx.fillRect(

      0,

      0,

      canvas.width,

      canvas.height

    );


    ctx.strokeStyle =
    "#67dbff";


    ctx.lineWidth =
    13;


    ctx.strokeRect(

      7,

      7,

      canvas.width - 14,

      canvas.height - 14

    );


    ctx.fillStyle =
    "#ffffff";


    ctx.font =
    "700 53px Arial";


    ctx.textAlign =
    "center";


    ctx.textBaseline =
    "middle";


    drawWrappedText(

      ctx,

      String(text),

      canvas.width / 2,

      canvas.height / 2,

      650,

      62

    );


    const texture =
    new THREE.CanvasTexture(
      canvas
    );


    texture.colorSpace =
    THREE.SRGBColorSpace;


    texture.needsUpdate =
    true;


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
    text.split(
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


    const visibleLines =
    lines.slice(
      0,
      3
    );


    const startY =

      centerY

      -

      (
        visibleLines.length
        -
        1
      )

      *

      lineHeight
      /
      2;


    visibleLines
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
     GATE
  ========================================================= */

  function createGate(
    answer,
    lane,
    correct
  ){

    const group =
    new THREE.Group();


    const frameMaterial =
    new THREE.MeshStandardMaterial({

      color:
        0x245789,

      roughness:.42,

      metalness:.28

    });



    const postGeometry =
    new THREE.BoxGeometry(

      .18,

      2.8,

      .18

    );


    [
      -1.35,
      1.35
    ]
    .forEach(
      x => {

        const post =
        new THREE.Mesh(

          postGeometry,

          frameMaterial

        );


        post.position.set(

          x,

          1.4,

          0

        );


        post.castShadow =
        true;


        group.add(
          post
        );

      }
    );



    const top =
    new THREE.Mesh(

      new THREE.BoxGeometry(

        2.9,

        .18,

        .18

      ),

      frameMaterial

    );


    top.position.set(

      0,

      2.75,

      0

    );


    top.castShadow =
    true;


    group.add(
      top
    );



    const sign =
    new THREE.Mesh(

      new THREE.PlaneGeometry(

        2.55,

        1.05

      ),

      new THREE.MeshBasicMaterial({

        map:
          createTextTexture(
            answer
          ),

        side:
          THREE.DoubleSide

      })

    );


    sign.position.set(

      0,

      1.9,

      .08

    );


    group.add(
      sign
    );


    group.position.set(

      LANE_X[
        lane
      ],

      0,

      GATE_START_Z

    );


    group.userData = {

      answer,

      lane,

      correct

    };


    scene.add(
      group
    );


    return group;

  }



  /* =========================================================
     ROUND
  ========================================================= */

  function startRound(){

    if(
      gameEnded
    ){

      return;

    }


    disposeRound();


    const item =

      VOCAB[
        Math.floor(
          Math.random()
          *
          VOCAB.length
        )
      ];


    const answers =
    shuffle([

      item.correct,

      ...item.wrong

    ]);


    const gates =
    answers
    .slice(
      0,
      3
    )
    .map(
      (
        answer,
        lane
      ) =>

      createGate(

        answer,

        lane,

        answer
        ===
        item.correct

      )

    );


    round = {

      item,

      gates,

      checked:false

    };


    targetWordEl.textContent =
    item.word;

  }



  /* =========================================================
     MAIN LOOP
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


      updateRoad(
        dt
      );


      updateRivals(
        dt
      );


      updateRound(
        dt
      );


      updateParticles(
        dt
      );

    }


    renderer.render(

      scene,

      camera

    );

  }



  /* =========================================================
     PLAYER
  ========================================================= */

  function updatePlayer(
    dt
  ){

    const targetX =
    LANE_X[
      targetLane
    ];


    const previousX =
    playerCar.position.x;


    playerCar.position.x =
    THREE.MathUtils.lerp(

      playerCar.position.x,

      targetX,

      1
      -
      Math.pow(
        .0025,
        dt
      )

    );


    const movement =
    playerCar.position.x
    -
    previousX;


    playerCar.rotation.z =
    THREE.MathUtils.lerp(

      playerCar.rotation.z,

      -movement
      *
      2.8,

      .16

    );


    /* Camera follow */

    camera.position.x =
    THREE.MathUtils.lerp(

      camera.position.x,

      playerCar.position.x
      *
      .35,

      .08

    );


    camera.lookAt(

      playerCar.position.x
      *
      .12,

      1,

      -15

    );


    /* Boost giảm dần */

    boost =
    Math.max(

      0,

      boost
      -
      dt
      *
      7

    );


    /* Penalty giảm dần */

    wrongSlow =
    Math.max(

      0,

      wrongSlow
      -
      dt
      *
      4

    );


    updateHUD();

  }



  /* =========================================================
     WORLD SPEED
  ========================================================= */

  function getWorldSpeed(){

    return (

      baseSpeed

      +

      boost

      -

      wrongSlow

    );

  }



  /* =========================================================
     ROAD
  ========================================================= */

  function updateRoad(
    dt
  ){

    const speed =
    getWorldSpeed();


    roadLines
    .forEach(
      stripe => {

        stripe.position.z +=

          speed
          *
          dt;


        if(
          stripe.position.z
          >
          8
        ){

          stripe.position.z -=
          119;

        }

      }
    );

  }



  /* =========================================================
     RIVALS
  ========================================================= */

  function updateRivals(
    dt
  ){

    rivalState
    .forEach(
      (
        rival,
        index
      ) => {

        rival.z =
        THREE.MathUtils.lerp(

          rival.z,

          rival.targetZ,

          Math.min(
            1,
            dt
            *
            2.5
          )

        );


        const baseLane =
        index === 0
        ?
        0
        :
        2;


        rival.mesh.position.set(

          LANE_X[
            baseLane
          ],

          .44,

          rival.z

        );


        rival.mesh.rotation.y =
        Math.PI;

      }
    );

  }



  function rivalsFallBehind(){

    rivalState
    .forEach(
      rival => {

        rival.targetZ =
        Math.max(

          -9,

          rival.targetZ
          -
          (
            1.8
            +
            Math.random()
            *
            1.5
          )

        );

      }
    );

  }



  function rivalsOvertake(){

    const both =
    Math.random()
    <
    .42;


    const selected =
    both
    ?
    rivalState
    :
    [
      rivalState[
        Math.random()
        <
        .5
        ?
        0
        :
        1
      ]
    ];


    selected
    .forEach(
      rival => {

        rival.targetZ =
        Math.min(

          8,

          rival.targetZ
          +
          5
          +
          Math.random()
          *
          3

        );

      }
    );


    flashMessage(

      both
      ?
      "💥 Sai! Cả 2 đối thủ vượt lên!"
      :
      "💥 Sai! Đối thủ vượt lên!",

      "bad"

    );

  }



  /* =========================================================
     GATE MOVEMENT
  ========================================================= */

  function updateRound(
    dt
  ){

    if(
      !round
    ){

      return;

    }


    const speed =
    getWorldSpeed();


    round.gates
    .forEach(
      gate => {

        gate.position.z +=

          speed
          *
          dt;

      }
    );


    const gateZ =
    round
    .gates[0]
    .position.z;


    /* Collision / choice */

    if(

      !round.checked

      &&

      gateZ
      >=
      COLLISION_Z

    ){

      round.checked =
      true;


      const selected =
      round.gates.find(

        gate =>
        gate.userData.lane
        ===
        targetLane

      );


      if(

        selected

        &&

        selected
        .userData
        .correct

      ){

        correctAnswer();

      }

      else{

        wrongAnswer();

      }

    }



    /* Cổng đi qua camera */

    if(

      gateZ
      >
      13

      &&

      !roundTimer

    ){

      roundTimer =
      window.setTimeout(

        () => {

          roundTimer =
          null;

          startRound();

        },

        260

      );

    }

  }



  /* =========================================================
     CORRECT
  ========================================================= */

  function correctAnswer(){

    score +=

      100

      +

      combo
      *
      15;


    combo++;


    boost =
    Math.min(

      23,

      boost
      +
      11

    );


    wrongSlow =
    0;


    rivalsFallBehind();


    createBoostParticles();


    flashMessage(

      "✓ Đúng! Xe tăng tốc!",

      "good"

    );


    updateHUD();

  }



  /* =========================================================
     WRONG
  ========================================================= */

  function wrongAnswer(){

    lives--;


    combo =
    0;


    boost =
    0;


    wrongSlow =
    Math.min(

      8,

      wrongSlow
      +
      5

    );


    shakePlayer();


    rivalsOvertake();


    updateHUD();


    if(
      lives
      <=
      0
    ){

      endGame();

    }

  }



  /* =========================================================
     BOOST PARTICLES
  ========================================================= */

  function createBoostParticles(){

    for(

      let i = 0;

      i < 20;

      i++

    ){

      const material =
      new THREE.MeshBasicMaterial({

        color:
          i % 2
          ?
          0x77e6ff
          :
          0xffd45f,

        transparent:true,

        opacity:.9

      });


      const particle =
      new THREE.Mesh(

        new THREE.SphereGeometry(

          .045
          +
          Math.random()
          *
          .04,

          6,

          6

        ),

        material

      );


      particle.position.set(

        playerCar.position.x

        +

        (
          Math.random()
          -
          .5
        )
        *
        1.5,

        .2
        +
        Math.random()
        *
        .45,

        PLAYER_Z
        +
        1.5
        +
        Math.random()
        *
        1.2

      );


      particle.userData.life =
      .45
      +
      Math.random()
      *
      .35;


      particle.userData.velocity =
      8
      +
      Math.random()
      *
      8;


      particles.push(
        particle
      );


      scene.add(
        particle
      );

    }

  }



  function updateParticles(
    dt
  ){

    particles =
    particles.filter(
      particle => {

        particle.userData.life -=
        dt;


        particle.position.z +=

          particle
          .userData
          .velocity

          *
          dt;


        particle.material.opacity =
        Math.max(

          0,

          particle
          .userData
          .life
          *
          1.6

        );


        if(

          particle
          .userData
          .life
          <=
          0

        ){

          scene.remove(
            particle
          );


          particle.geometry.dispose();


          particle.material.dispose();


          return false;

        }


        return true;

      }
    );

  }



  /* =========================================================
     SHAKE
  ========================================================= */

  function shakePlayer(){

    const start =
    performance.now();


    const originalY =
    .48;


    function frame(
      now
    ){

      const elapsed =
      now
      -
      start;


      if(

        elapsed
        >
        420

        ||

        gameEnded

      ){

        playerCar.position.y =
        originalY;


        playerCar.rotation.y =
        Math.PI;


        return;

      }


      playerCar.position.y =

        originalY

        +

        (
          Math.random()
          -
          .5
        )
        *
        .12;


      playerCar.rotation.y =

        Math.PI

        +

        (
          Math.random()
          -
          .5
        )
        *
        .06;


      requestAnimationFrame(
        frame
      );

    }


    requestAnimationFrame(
      frame
    );

  }



  /* =========================================================
     INPUT
  ========================================================= */

  function setupControls(){

    window.addEventListener(

      "keydown",

      event => {

        if(
          gameEnded
        ){

          return;

        }


        if(
          event.key
          ===
          "ArrowLeft"
        ){

          event.preventDefault();

          changeLane(
            -1
          );

        }


        if(
          event.key
          ===
          "ArrowRight"
        ){

          event.preventDefault();

          changeLane(
            1
          );

        }

      }

    );


    document
    .getElementById(
      "leftBtn"
    )
    .addEventListener(

      "click",

      () =>
      changeLane(
        -1
      )

    );


    document
    .getElementById(
      "rightBtn"
    )
    .addEventListener(

      "click",

      () =>
      changeLane(
        1
      )

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



  function changeLane(
    direction
  ){

    targetLane =
    THREE.MathUtils.clamp(

      targetLane
      +
      direction,

      0,

      2

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


    comboEl.textContent =
    "x"
    +
    combo;


    const visualSpeed =

      100

      +

      boost
      *
      5

      -

      wrongSlow
      *
      5;


    speedEl.textContent =
    String(

      Math.max(

        50,

        Math.round(
          visualSpeed
        )

      )

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

      950

    );

  }



  /* =========================================================
     CLEAN ROUND
  ========================================================= */

  function disposeRound(){

    if(
      !round
    ){

      return;

    }


    round.gates
    .forEach(
      gate => {

        gate.traverse(
          object => {

            if(
              object.geometry
            ){

              object
              .geometry
              .dispose?.();

            }


            if(
              object.material
            ){

              const materials =

                Array.isArray(
                  object.material
                )

                ?

                object.material

                :

                [
                  object.material
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

          }
        );


        scene.remove(
          gate
        );

      }
    );


    round =
    null;

  }



  /* =========================================================
     GAME OVER
  ========================================================= */

  function endGame(){

    gameEnded =
    true;


    disposeRound();


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

    if(
      roundTimer
    ){

      window.clearTimeout(
        roundTimer
      );


      roundTimer =
      null;

    }


    disposeRound();


    score =
    0;


    lives =
    5;


    combo =
    0;


    baseSpeed =
    15;


    boost =
    0;


    wrongSlow =
    0;


    gameEnded =
    false;


    targetLane =
    1;


    playerCar.position.set(

      0,

      .48,

      PLAYER_Z

    );


    rivalState[0].z =
    0;


    rivalState[0].targetZ =
    0;


    rivalState[1].z =
    -2;


    rivalState[1].targetZ =
    -2;


    gameOverEl
    .classList
    .add(
      "hidden"
    );


    updateHUD();


    startRound();

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
     BOOT ERROR
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
