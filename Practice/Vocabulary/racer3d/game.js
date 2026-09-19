/* =========================================================
   VOCABULARY RACER 3D
   COCKPIT VIEW
========================================================= */


/* =========================================================
   1. VOCABULARY
========================================================= */

const VOCABULARY = [

  {
    word:"critically endangered",
    meaning:"cực kỳ nguy cấp, có nguy cơ tuyệt chủng rất cao"
  },

  {
    word:"nocturnal",
    meaning:"hoạt động về đêm"
  },

  {
    word:"solitary",
    meaning:"sống đơn độc"
  },

  {
    word:"home range",
    meaning:"phạm vi sinh sống của một cá thể động vật"
  },

  {
    word:"forage",
    meaning:"tìm kiếm thức ăn"
  },

  {
    word:"forest clearance",
    meaning:"việc phát quang, phá rừng"
  },

  {
    word:"predator-free",
    meaning:"không có động vật săn mồi"
  },

  {
    word:"genetic diversity",
    meaning:"đa dạng di truyền"
  },

  {
    word:"renewable energy",
    meaning:"năng lượng tái tạo"
  },

  {
    word:"artificial lighting",
    meaning:"hệ thống chiếu sáng nhân tạo"
  },

  {
    word:"year-round production",
    meaning:"sản xuất quanh năm"
  },

  {
    word:"cutting-edge technology",
    meaning:"công nghệ tiên tiến nhất"
  }

];


/* =========================================================
   2. SETTINGS
========================================================= */

const LANE_X = [
  -3,
  0,
  3
];


const CAR_Z = 4;


/*
  Đưa biển gần hơn so với bản cũ
  để chữ đọc được sớm hơn.
*/

const GATE_START_Z = -38;


const GATE_COLLISION_Z = 3.1;


const GATE_REMOVE_Z = 14;


const BASE_SPEED = 11;


const MAX_SPEED = 24;


const BOOST_MULTIPLIER = 1.7;


const BOOST_DURATION = 1.25;


const STARTING_LIVES = 3;


/* =========================================================
   3. HTML ELEMENTS
========================================================= */

const container =
document.getElementById(
  "game-container"
);


const targetWordEl =
document.getElementById(
  "target-word"
);


const scoreEl =
document.getElementById(
  "score"
);


const livesEl =
document.getElementById(
  "lives"
);


const speedEl =
document.getElementById(
  "speed"
);


const comboEl =
document.getElementById(
  "combo"
);


const feedbackEl =
document.getElementById(
  "feedback"
);


const startScreen =
document.getElementById(
  "start-screen"
);


const gameOverScreen =
document.getElementById(
  "game-over-screen"
);


const gameOverTitle =
document.getElementById(
  "game-over-title"
);


const finalSummary =
document.getElementById(
  "final-summary"
);


const startBtn =
document.getElementById(
  "start-btn"
);


const restartBtn =
document.getElementById(
  "restart-btn"
);


const leftBtn =
document.getElementById(
  "left-btn"
);


const rightBtn =
document.getElementById(
  "right-btn"
);


/* =========================================================
   4. THREE SCENE
========================================================= */

const scene =
new THREE.Scene();


scene.background =
new THREE.Color(
  0x8ed4ff
);


scene.fog =
new THREE.Fog(
  0x8ed4ff,
  48,
  125
);


/* =========================================================
   5. CAMERA
========================================================= */

const camera =
new THREE.PerspectiveCamera(

  62,

  window.innerWidth /
  window.innerHeight,

  .1,

  250

);


/*
  Góc nhìn bên trong xe.
*/

camera.position.set(

  0,

  1.65,

  4.2

);


camera.lookAt(

  0,

  1.35,

  -30

);


scene.add(
  camera
);


/* =========================================================
   6. RENDERER
========================================================= */

const renderer =
new THREE.WebGLRenderer({

  antialias:true,

  powerPreference:
  "high-performance"

});


renderer.setPixelRatio(

  Math.min(
    window.devicePixelRatio,
    2
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


container.appendChild(
  renderer.domElement
);


/* =========================================================
   7. LIGHT
========================================================= */

const ambientLight =
new THREE.AmbientLight(

  0xffffff,

  1.55

);


scene.add(
  ambientLight
);


const sun =
new THREE.DirectionalLight(

  0xffffff,

  2.25

);


sun.position.set(

  -8,

  18,

  10

);


sun.castShadow =
true;


sun.shadow.mapSize.set(

  2048,

  2048

);


sun.shadow.camera.left =
-22;


sun.shadow.camera.right =
22;


sun.shadow.camera.top =
25;


sun.shadow.camera.bottom =
-15;


scene.add(
  sun
);


/* =========================================================
   8. ROAD
========================================================= */

function createRoad(){

  /*
    Ground
  */

  const ground =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      90,
      210
    ),

    new THREE.MeshStandardMaterial({

      color:0x4b9854,

      roughness:1

    })

  );


  ground.rotation.x =
  -Math.PI / 2;


  ground.position.set(

    0,

    -.06,

    -50

  );


  ground.receiveShadow =
  true;


  scene.add(
    ground
  );


  /*
    Road
  */

  const road =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      11.5,
      200
    ),

    new THREE.MeshStandardMaterial({

      color:0x343943,

      roughness:.92

    })

  );


  road.rotation.x =
  -Math.PI / 2;


  road.position.set(

    0,

    0,

    -45

  );


  road.receiveShadow =
  true;


  scene.add(
    road
  );


  /*
    Lane lines
  */

  const lineMaterial =
  new THREE.MeshStandardMaterial({

    color:0xffffff

  });


  for(
    let z = -135;
    z < 30;
    z += 6
  ){

    [
      -1.5,
      1.5
    ]
    .forEach(
      x => {

        const dash =
        new THREE.Mesh(

          new THREE.BoxGeometry(

            .1,

            .035,

            2.7

          ),

          lineMaterial

        );


        dash.position.set(

          x,

          .035,

          z

        );


        scene.add(
          dash
        );

      }
    );

  }


  /*
    Road edges
  */

  [
    -5.55,
    5.55
  ]
  .forEach(
    x => {

      const edge =
      new THREE.Mesh(

        new THREE.BoxGeometry(

          .14,

          .04,

          200

        ),

        new THREE.MeshStandardMaterial({

          color:0xffffff

        })

      );


      edge.position.set(

        x,

        .04,

        -45

      );


      scene.add(
        edge
      );

    }
  );


  /*
    Trees
  */

  for(
    let z = -125;
    z < 15;
    z += 11
  ){

    createTree(

      -9 -
      Math.random() * 4,

      z +
      Math.random() * 3

    );


    createTree(

      9 +
      Math.random() * 4,

      z +
      Math.random() * 3

    );

  }

}


/* =========================================================
   9. TREE
========================================================= */

function createTree(
  x,
  z
){

  const group =
  new THREE.Group();


  const trunk =
  new THREE.Mesh(

    new THREE.CylinderGeometry(

      .18,

      .25,

      1.7,

      8

    ),

    new THREE.MeshStandardMaterial({

      color:0x785039

    })

  );


  trunk.position.y =
  .85;


  trunk.castShadow =
  true;


  group.add(
    trunk
  );


  const crown =
  new THREE.Mesh(

    new THREE.ConeGeometry(

      1,

      2.6,

      10

    ),

    new THREE.MeshStandardMaterial({

      color:0x237440,

      roughness:1

    })

  );


  crown.position.y =
  2.5;


  crown.castShadow =
  true;


  group.add(
    crown
  );


  group.position.set(

    x,

    0,

    z

  );


  scene.add(
    group
  );

}


/* =========================================================
   10. INVISIBLE CAR PROXY
========================================================= */

function createCar(){

  const car =
  new THREE.Group();


  /*
    Vẫn tạo xe 3D đúng yêu cầu,
    nhưng sẽ ẩn vì camera đang nằm
    bên trong xe.
  */

  const body =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      1.8,

      .45,

      3

    ),

    new THREE.MeshStandardMaterial({

      color:0xe83e42

    })

  );


  body.position.y =
  .55;


  body.castShadow =
  true;


  car.add(
    body
  );


  const wheelGeometry =
  new THREE.CylinderGeometry(

    .36,

    .36,

    .34,

    18

  );


  const wheelMaterial =
  new THREE.MeshStandardMaterial({

    color:0x15171b

  });


  const positions = [

    [-1,.4,.95],

    [1,.4,.95],

    [-1,.4,-.95],

    [1,.4,-.95]

  ];


  positions.forEach(
    position => {

      const wheel =
      new THREE.Mesh(

        wheelGeometry,

        wheelMaterial

      );


      wheel.rotation.z =
      Math.PI / 2;


      wheel.position.set(

        position[0],

        position[1],

        position[2]

      );


      car.add(
        wheel
      );

    }
  );


  car.position.set(

    0,

    0,

    CAR_Z

  );


  /*
    Cockpit view:
    không render xe bên ngoài.
  */

  car.visible =
  false;


  scene.add(
    car
  );


  return car;

}


/* =========================================================
   11. COCKPIT
========================================================= */

function createCockpit(){

  const cockpit =
  new THREE.Group();


  /*
    Dashboard
  */

  const dashboard =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      6,

      .55,

      1.1

    ),

    new THREE.MeshStandardMaterial({

      color:0x11151d,

      roughness:.75

    })

  );


  dashboard.position.set(

    0,

    -1.25,

    -2

  );


  cockpit.add(
    dashboard
  );


  /*
    Hood
  */

  const hood =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      4,

      .18,

      2.7

    ),

    new THREE.MeshStandardMaterial({

      color:0xdc363d,

      roughness:.35,

      metalness:.22

    })

  );


  hood.position.set(

    0,

    -.93,

    -3.35

  );


  cockpit.add(
    hood
  );


  /*
    Steering wheel
  */

  const wheel =
  new THREE.Mesh(

    new THREE.TorusGeometry(

      .39,

      .065,

      12,

      34

    ),

    new THREE.MeshStandardMaterial({

      color:0x101217,

      roughness:.7

    })

  );


  wheel.position.set(

    -.72,

    -.67,

    -1.58

  );


  wheel.rotation.x =
  Math.PI / 2;


  cockpit.add(
    wheel
  );


  /*
    Steering wheel center
  */

  const center =
  new THREE.Mesh(

    new THREE.CylinderGeometry(

      .11,

      .11,

      .12,

      20

    ),

    new THREE.MeshStandardMaterial({

      color:0x242936

    })

  );


  center.rotation.x =
  Math.PI / 2;


  center.position.set(

    -.72,

    -.67,

    -1.58

  );


  cockpit.add(
    center
  );


  /*
    Left windshield pillar
  */

  const pillarMaterial =
  new THREE.MeshStandardMaterial({

    color:0x151820

  });


  const leftPillar =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      .14,

      3.1,

      .18

    ),

    pillarMaterial

  );


  leftPillar.position.set(

    -2.5,

    .15,

    -2.5

  );


  leftPillar.rotation.z =
  -.2;


  cockpit.add(
    leftPillar
  );


  const rightPillar =
  leftPillar.clone();


  rightPillar.position.x =
  2.5;


  rightPillar.rotation.z =
  .2;


  cockpit.add(
    rightPillar
  );


  /*
    Attach cockpit to camera.
  */

  camera.add(
    cockpit
  );

}


/* =========================================================
   12. TEXT HELPERS
========================================================= */

function wrapCanvasText(
  context,
  text,
  maxWidth
){

  const words =
  String(text)
  .split(" ");


  const lines =
  [];


  let line =
  "";


  words.forEach(
    word => {

      const candidate =
      line
      ?
      line + " " + word
      :
      word;


      if(

        context.measureText(
          candidate
        ).width >
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
        candidate;

      }

    }
  );


  if(
    line
  ){

    lines.push(
      line
    );

  }


  return lines.slice(
    0,
    3
  );

}


/* =========================================================
   13. BIG TEXT TEXTURE
========================================================= */

function createTextTexture(
  text
){

  /*
    Texture lớn hơn bản cũ
    để chữ rõ khi còn ở xa.
  */

  const canvas =
  document.createElement(
    "canvas"
  );


  canvas.width =
  1536;


  canvas.height =
  512;


  const ctx =
  canvas.getContext(
    "2d"
  );


  /*
    White background
  */

  ctx.fillStyle =
  "#ffffff";


  ctx.fillRect(

    0,

    0,

    canvas.width,

    canvas.height

  );


  /*
    Header
  */

  ctx.fillStyle =
  "#367beb";


  ctx.fillRect(

    0,

    0,

    canvas.width,

    60

  );


  /*
    Border
  */

  ctx.strokeStyle =
  "#142b5d";


  ctx.lineWidth =
  18;


  ctx.strokeRect(

    9,

    9,

    canvas.width - 18,

    canvas.height - 18

  );


  /*
    Adaptive font size
  */

  let fontSize =
  94;


  if(
    String(text).length >
    45
  ){

    fontSize =
    72;

  }


  if(
    String(text).length >
    75
  ){

    fontSize =
    62;

  }


  ctx.fillStyle =
  "#101a30";


  ctx.textAlign =
  "center";


  ctx.textBaseline =
  "middle";


  ctx.font =
  `900 ${fontSize}px Arial`;


  const lines =
  wrapCanvasText(

    ctx,

    text,

    1330

  );


  const lineHeight =
  fontSize * 1.14;


  const totalHeight =
  lines.length *
  lineHeight;


  const startY =
  290 -
  totalHeight / 2 +
  lineHeight / 2;


  lines.forEach(
    (
      line,
      index
    ) => {

      ctx.fillText(

        line,

        canvas.width / 2,

        startY +
        index * lineHeight

      );

    }
  );


  const texture =
  new THREE.CanvasTexture(
    canvas
  );


  texture.colorSpace =
  THREE.SRGBColorSpace;


  texture.anisotropy =
  Math.min(

    renderer.capabilities
    .getMaxAnisotropy(),

    8

  );


  return texture;

}


/* =========================================================
   14. VOCABULARY GATE
========================================================= */

function createVocabularyGate(
  text,
  laneIndex
){

  const gate =
  new THREE.Group();


  const frameMaterial =
  new THREE.MeshStandardMaterial({

    color:0x244a8e,

    roughness:.42,

    metalness:.28

  });


  /*
    Posts
  */

  [
    -1.35,
    1.35
  ]
  .forEach(
    x => {

      const post =
      new THREE.Mesh(

        new THREE.BoxGeometry(

          .2,

          3.25,

          .32

        ),

        frameMaterial

      );


      post.position.set(

        x,

        1.63,

        0

      );


      post.castShadow =
      true;


      gate.add(
        post
      );

    }
  );


  /*
    Top
  */

  const top =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      2.9,

      .22,

      .32

    ),

    frameMaterial

  );


  top.position.set(

    0,

    3.15,

    0

  );


  top.castShadow =
  true;


  gate.add(
    top
  );


  /*
    Answer sign
  */

  const texture =
  createTextTexture(
    text
  );


  const sign =
  new THREE.Mesh(

    new THREE.PlaneGeometry(

      2.72,

      1.48

    ),

    new THREE.MeshBasicMaterial({

      map:texture,

      side:
      THREE.DoubleSide

    })

  );


  sign.position.set(

    0,

    2.05,

    .19

  );


  gate.add(
    sign
  );


  /*
    Bottom bumper
  */

  const bumper =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      2.7,

      .28,

      .5

    ),

    new THREE.MeshStandardMaterial({

      color:0xffca38

    })

  );


  bumper.position.set(

    0,

    .16,

    0

  );


  bumper.castShadow =
  true;


  gate.add(
    bumper
  );


  gate.position.x =
  LANE_X[
    laneIndex
  ];


  return gate;

}


/* =========================================================
   15. GAME STATE
========================================================= */

const car =
createCar();


let targetLane =
1;


let score =
0;


let lives =
STARTING_LIVES;


let combo =
0;


let elapsed =
0;


let currentSpeed =
BASE_SPEED;


let boostTimer =
0;


let shakeTimer =
0;


let gameRunning =
false;


let currentWord =
null;


let currentAnswers =
[];


let gateGroup =
null;


let roundResolved =
false;


let feedbackTimer =
null;


/* =========================================================
   16. UTILS
========================================================= */

function shuffle(
  original
){

  const array =
  [...original];


  for(
    let i =
    array.length - 1;
    i > 0;
    i--
  ){

    const j =
    Math.floor(

      Math.random() *
      (
        i + 1
      )

    );


    [
      array[i],
      array[j]
    ] =
    [
      array[j],
      array[i]
    ];

  }


  return array;

}


function randomItem(
  array
){

  return array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];

}


/* =========================================================
   17. ANSWERS
========================================================= */

function buildAnswers(
  target
){

  const wrong =
  shuffle(

    VOCABULARY
    .filter(
      item =>
      item.word !==
      target.word
    )

  )
  .slice(
    0,
    2
  );


  return shuffle(
    [
      target,
      ...wrong
    ]
  );

}


/* =========================================================
   18. DELETE OLD GATES
========================================================= */

function removeGateGroup(){

  if(
    !gateGroup
  ){

    return;

  }


  gateGroup
  .traverse(
    object => {

      if(
        object.geometry
      ){

        object.geometry.dispose();

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
        [object.material];


        materials.forEach(
          material => {

            if(
              material.map
            ){

              material.map.dispose();

            }


            material.dispose();

          }
        );

      }

    }
  );


  scene.remove(
    gateGroup
  );


  gateGroup =
  null;

}


/* =========================================================
   19. CREATE ROUND
========================================================= */

function createRound(){

  removeGateGroup();


  roundResolved =
  false;


  currentWord =
  randomItem(
    VOCABULARY
  );


  targetWordEl.textContent =
  currentWord.word;


  currentAnswers =
  buildAnswers(
    currentWord
  );


  gateGroup =
  new THREE.Group();


  currentAnswers
  .forEach(
    (
      answer,
      lane
    ) => {

      const gate =
      createVocabularyGate(

        answer.meaning,

        lane

      );


      gate.userData.answer =
      answer;


      gate.userData.lane =
      lane;


      gateGroup.add(
        gate
      );

    }
  );


  gateGroup.position.z =
  GATE_START_Z;


  scene.add(
    gateGroup
  );

}


/* =========================================================
   20. CONTROLS
========================================================= */

function moveLeft(){

  if(
    !gameRunning
  ){

    return;

  }


  targetLane =
  Math.max(

    0,

    targetLane - 1

  );

}


function moveRight(){

  if(
    !gameRunning
  ){

    return;

  }


  targetLane =
  Math.min(

    2,

    targetLane + 1

  );

}


document.addEventListener(
  "keydown",
  event => {

    if(
      event.key ===
      "ArrowLeft"
    ){

      event.preventDefault();

      moveLeft();

    }


    if(
      event.key ===
      "ArrowRight"
    ){

      event.preventDefault();

      moveRight();

    }

  }
);


leftBtn.addEventListener(
  "pointerdown",
  moveLeft
);


rightBtn.addEventListener(
  "pointerdown",
  moveRight
);


/* =========================================================
   21. FEEDBACK
========================================================= */

function showFeedback(
  text,
  type
){

  feedbackEl.textContent =
  text;


  feedbackEl.className =
  `feedback ${type} show`;


  clearTimeout(
    feedbackTimer
  );


  feedbackTimer =
  setTimeout(
    () => {

      feedbackEl.className =
      "feedback";

    },
    1200
  );

}


/* =========================================================
   22. CURRENT LANE
========================================================= */

function getCurrentLane(){

  let result =
  0;


  let minDistance =
  Infinity;


  LANE_X.forEach(
    (
      x,
      index
    ) => {

      const distance =
      Math.abs(
        car.position.x -
        x
      );


      if(
        distance <
        minDistance
      ){

        minDistance =
        distance;


        result =
        index;

      }

    }
  );


  return result;

}


/* =========================================================
   23. COLLISION
========================================================= */

function resolveGate(){

  if(
    roundResolved
    ||
    !gateGroup
  ){

    return;

  }


  roundResolved =
  true;


  const lane =
  getCurrentLane();


  const answer =
  currentAnswers[
    lane
  ];


  if(
    answer.word ===
    currentWord.word
  ){

    correctAnswer(
      lane
    );

  }

  else{

    wrongAnswer(
      lane
    );

  }

}


/* =========================================================
   24. CORRECT
========================================================= */

function correctAnswer(
  lane
){

  combo++;


  const bonus =
  Math.min(
    combo * 10,
    100
  );


  score +=
  100 +
  bonus;


  boostTimer =
  BOOST_DURATION;


  const gate =
  gateGroup.children[
    lane
  ];


  if(
    gate
  ){

    gate.scale.set(

      1.1,

      1.1,

      1.1

    );

  }


  showFeedback(

    `✅ Chính xác! +${100 + bonus} · NITRO!`,

    "good"

  );


  updateHUD();

}


/* =========================================================
   25. WRONG
========================================================= */

function wrongAnswer(){

  combo =
  0;


  lives--;


  shakeTimer =
  .7;


  showFeedback(

    `💥 Sai! Đáp án đúng: ${currentWord.meaning}`,

    "bad"

  );


  updateHUD();


  if(
    lives <=
    0
  ){

    endGame();

  }

}


/* =========================================================
   26. HUD
========================================================= */

function updateHUD(){

  scoreEl.textContent =
  score;


  livesEl.textContent =
  lives > 0
  ?
  "❤️".repeat(
    lives
  )
  :
  "—";


  comboEl.textContent =
  `x${combo}`;


  speedEl.textContent =
  `${Math.round(currentSpeed * 9)} km/h`;

}


/* =========================================================
   27. RESET
========================================================= */

function resetGame(){

  score =
  0;


  lives =
  STARTING_LIVES;


  combo =
  0;


  elapsed =
  0;


  currentSpeed =
  BASE_SPEED;


  boostTimer =
  0;


  shakeTimer =
  0;


  targetLane =
  1;


  car.position.set(

    0,

    0,

    CAR_Z

  );


  camera.position.set(

    0,

    1.65,

    4.2

  );


  createRound();


  updateHUD();

}


/* =========================================================
   28. START
========================================================= */

function startGame(){

  resetGame();


  gameRunning =
  true;


  startScreen
  .classList
  .add(
    "hidden"
  );


  gameOverScreen
  .classList
  .add(
    "hidden"
  );

}


/* =========================================================
   29. END
========================================================= */

function endGame(){

  gameRunning =
  false;


  gameOverTitle.textContent =
  "🏁 GAME OVER";


  finalSummary.textContent =
  `Điểm của bạn: ${score}. Hãy chơi lại để tăng tốc độ phản xạ từ vựng.`;


  gameOverScreen
  .classList
  .remove(
    "hidden"
  );

}


startBtn.addEventListener(
  "click",
  startGame
);


restartBtn.addEventListener(
  "click",
  startGame
);


/* =========================================================
   30. CAR MOVEMENT
========================================================= */

function updateCar(
  delta
){

  const targetX =
  LANE_X[
    targetLane
  ];


  car.position.x =
  THREE.MathUtils.lerp(

    car.position.x,

    targetX,

    Math.min(
      1,
      delta * 8
    )

  );

}


/* =========================================================
   31. CAMERA / COCKPIT
========================================================= */

function updateCamera(
  delta
){

  /*
    Camera đi theo làn xe.
  */

  camera.position.x =
  THREE.MathUtils.lerp(

    camera.position.x,

    car.position.x,

    Math.min(
      1,
      delta * 9
    )

  );


  /*
    Nitro FOV
  */

  const targetFov =
  boostTimer > 0
  ?
  70
  :
  62;


  camera.fov =
  THREE.MathUtils.lerp(

    camera.fov,

    targetFov,

    Math.min(
      1,
      delta * 5
    )

  );


  camera.updateProjectionMatrix();


  /*
    Shake if wrong
  */

  let shakeX =
  0;


  let shakeY =
  0;


  if(
    shakeTimer >
    0
  ){

    shakeTimer -=
    delta;


    shakeX =
    Math.sin(
      performance.now() *
      .05
    )
    *
    .08;


    shakeY =
    Math.sin(
      performance.now() *
      .07
    )
    *
    .05;

  }


  camera.rotation.z =
  shakeX;


  camera.position.y =
  1.65 +
  shakeY;


  /*
    View straight ahead.
  */

  camera.lookAt(

    camera.position.x,

    1.3,

    -30

  );

}


/* =========================================================
   32. GATES
========================================================= */

function updateGate(
  delta
){

  if(
    !gateGroup
  ){

    return;

  }


  gateGroup.position.z +=

  currentSpeed *
  delta;


  if(

    !roundResolved

    &&

    gateGroup.position.z >=
    GATE_COLLISION_Z

  ){

    resolveGate();

  }


  if(

    gateGroup

    &&

    gateGroup.position.z >
    GATE_REMOVE_Z

    &&

    gameRunning

  ){

    createRound();

  }

}


/* =========================================================
   33. SPEED
========================================================= */

function updateSpeed(
  delta
){

  elapsed +=
  delta;


  const normalSpeed =
  Math.min(

    MAX_SPEED,

    BASE_SPEED +
    elapsed * .12

  );


  if(
    boostTimer >
    0
  ){

    boostTimer -=
    delta;


    currentSpeed =
    normalSpeed *
    BOOST_MULTIPLIER;

  }

  else{

    currentSpeed =
    THREE.MathUtils.lerp(

      currentSpeed,

      normalSpeed,

      Math.min(
        1,
        delta * 3
      )

    );

  }


  updateHUD();

}


/* =========================================================
   34. LOOP
========================================================= */

const clock =
new THREE.Clock();


function animate(){

  requestAnimationFrame(
    animate
  );


  const delta =
  Math.min(

    clock.getDelta(),

    .05

  );


  if(
    gameRunning
  ){

    updateSpeed(
      delta
    );


    updateCar(
      delta
    );


    updateCamera(
      delta
    );


    updateGate(
      delta
    );

  }


  renderer.render(

    scene,

    camera

  );

}


/* =========================================================
   35. RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

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
        window.devicePixelRatio,
        2
      )

    );

  }
);


/* =========================================================
   36. INIT
========================================================= */

createRoad();


createCockpit();


updateHUD();


animate();
