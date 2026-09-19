/* =========================================================
   VOCABULARY RACER 3D
   Three.js
========================================================= */


/* =========================================================
   1. DỮ LIỆU TỪ VỰNG
   Tạm thời dùng dữ liệu mẫu để test game trước.
========================================================= */

const VOCABULARY = [

  {
    word: "critically endangered",
    meaning: "cực kỳ nguy cấp, có nguy cơ tuyệt chủng rất cao"
  },

  {
    word: "nocturnal",
    meaning: "hoạt động về đêm"
  },

  {
    word: "solitary",
    meaning: "sống đơn độc"
  },

  {
    word: "home range",
    meaning: "phạm vi sinh sống của một cá thể động vật"
  },

  {
    word: "forage",
    meaning: "tìm kiếm thức ăn"
  },

  {
    word: "forest clearance",
    meaning: "việc phát quang, phá rừng"
  },

  {
    word: "predator-free",
    meaning: "không có động vật săn mồi"
  },

  {
    word: "genetic diversity",
    meaning: "đa dạng di truyền"
  },

  {
    word: "renewable energy",
    meaning: "năng lượng tái tạo"
  },

  {
    word: "artificial lighting",
    meaning: "hệ thống chiếu sáng nhân tạo"
  },

  {
    word: "year-round production",
    meaning: "sản xuất quanh năm"
  },

  {
    word: "cutting-edge technology",
    meaning: "công nghệ tiên tiến nhất"
  }

];


/* =========================================================
   2. CẤU HÌNH GAME
========================================================= */

// 3 làn xe.
const LANE_X = [
  -3,
  0,
  3
];


// Xe đứng gần camera.
const CAR_Z = 4;


// Cổng xuất hiện ở phía xa.
const GATE_START_Z = -50;


// Vị trí tính va chạm.
const GATE_COLLISION_Z = 3;


// Sau vị trí này thì xóa cổng.
const GATE_REMOVE_Z = 15;


// Tốc độ ban đầu.
const BASE_SPEED = 13;


// Tốc độ tối đa.
const MAX_SPEED = 26;


// Hệ số Nitro.
const BOOST_MULTIPLIER = 1.7;


// Thời gian Nitro.
const BOOST_DURATION = 1.2;


// Số mạng.
const STARTING_LIVES = 3;


/* =========================================================
   3. DOM
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
   4. SCENE
========================================================= */

const scene =
new THREE.Scene();


scene.background =
new THREE.Color(
  0x87ceeb
);


// Sương mờ phía xa.
scene.fog =
new THREE.Fog(
  0x87ceeb,
  40,
  120
);


/* =========================================================
   5. CAMERA
========================================================= */

const camera =
new THREE.PerspectiveCamera(

  58,

  window.innerWidth /
  window.innerHeight,

  0.1,

  250

);


// Camera góc nhìn thứ 3 sau xe.
camera.position.set(
  0,
  7,
  14
);


camera.lookAt(
  0,
  1,
  -10
);


/* =========================================================
   6. RENDERER
========================================================= */

const renderer =
new THREE.WebGLRenderer({

  antialias: true,

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
   7. ÁNH SÁNG
========================================================= */

const ambientLight =
new THREE.AmbientLight(
  0xffffff,
  1.4
);


scene.add(
  ambientLight
);


const sunLight =
new THREE.DirectionalLight(
  0xffffff,
  2.2
);


sunLight.position.set(
  -8,
  16,
  10
);


sunLight.castShadow =
true;


sunLight.shadow.mapSize.set(
  2048,
  2048
);


sunLight.shadow.camera.left =
-20;


sunLight.shadow.camera.right =
20;


sunLight.shadow.camera.top =
22;


sunLight.shadow.camera.bottom =
-15;


scene.add(
  sunLight
);


/* =========================================================
   8. TẠO ĐƯỜNG ĐUA
========================================================= */

function createRoad(){

  /*
    Nền cỏ.
  */

  const ground =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      80,
      200
    ),

    new THREE.MeshStandardMaterial({

      color: 0x4b9952,

      roughness: 1

    })

  );


  ground.rotation.x =
  -Math.PI / 2;


  ground.position.set(
    0,
    -0.05,
    -45
  );


  ground.receiveShadow =
  true;


  scene.add(
    ground
  );


  /*
    Đường chính.
  */

  const road =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      11,
      190
    ),

    new THREE.MeshStandardMaterial({

      color: 0x363b45,

      roughness: 0.9

    })

  );


  road.rotation.x =
  -Math.PI / 2;


  road.position.set(
    0,
    0,
    -40
  );


  road.receiveShadow =
  true;


  scene.add(
    road
  );


  /*
    Vạch chia làn.
  */

  const lineMaterial =
  new THREE.MeshStandardMaterial({

    color: 0xffffff

  });


  for(
    let z = -125;
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
            0.1,
            0.04,
            2.6
          ),

          lineMaterial

        );


        dash.position.set(
          x,
          0.04,
          z
        );


        scene.add(
          dash
        );

      }
    );

  }


  /*
    Mép đường.
  */

  [
    -5.3,
    5.3
  ]
  .forEach(
    x => {

      const edge =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.16,
          0.05,
          190
        ),

        new THREE.MeshStandardMaterial({

          color: 0xffffff

        })

      );


      edge.position.set(
        x,
        0.04,
        -40
      );


      scene.add(
        edge
      );

    }
  );


  /*
    Cây hai bên đường.
  */

  for(
    let z = -110;
    z < 15;
    z += 12
  ){

    createTree(

      -9 -
      Math.random() * 4,

      z +
      Math.random() * 4

    );


    createTree(

      9 +
      Math.random() * 4,

      z +
      Math.random() * 4

    );

  }

}


/* =========================================================
   9. CÂY 3D
========================================================= */

function createTree(
  x,
  z
){

  const tree =
  new THREE.Group();


  const trunk =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      0.18,
      0.25,
      1.6,
      8
    ),

    new THREE.MeshStandardMaterial({

      color: 0x765039

    })

  );


  trunk.position.y =
  0.8;


  trunk.castShadow =
  true;


  tree.add(
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

      color: 0x267740,

      roughness: 1

    })

  );


  crown.position.y =
  2.5;


  crown.castShadow =
  true;


  tree.add(
    crown
  );


  tree.position.set(
    x,
    0,
    z
  );


  scene.add(
    tree
  );

}


/* =========================================================
   10. TẠO XE ĐUA
========================================================= */

function createCar(){

  const car =
  new THREE.Group();


  /*
    Thân xe.
  */

  const body =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      1.7,
      0.45,
      3
    ),

    new THREE.MeshStandardMaterial({

      color: 0xe83e42,

      roughness: 0.4,

      metalness: 0.2

    })

  );


  body.position.y =
  0.55;


  body.castShadow =
  true;


  car.add(
    body
  );


  /*
    Cabin.
  */

  const cabin =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      1.25,
      0.55,
      1.4
    ),

    new THREE.MeshStandardMaterial({

      color: 0xc92f34,

      roughness: 0.35,

      metalness: 0.18

    })

  );


  cabin.position.set(
    0,
    1,
    -0.2
  );


  cabin.castShadow =
  true;


  car.add(
    cabin
  );


  /*
    Kính xe.
  */

  const glass =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      1,
      0.3,
      0.75
    ),

    new THREE.MeshStandardMaterial({

      color: 0x72bde8,

      roughness: 0.1,

      metalness: 0.1

    })

  );


  glass.position.set(
    0,
    1.08,
    -0.55
  );


  car.add(
    glass
  );


  /*
    Bánh xe.
  */

  const wheelGeometry =
  new THREE.CylinderGeometry(
    0.37,
    0.37,
    0.34,
    20
  );


  const wheelMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x15171b,

    roughness: 0.75

  });


  const wheelPositions = [

    [
      -0.96,
      0.4,
      0.95
    ],

    [
      0.96,
      0.4,
      0.95
    ],

    [
      -0.96,
      0.4,
      -0.95
    ],

    [
      0.96,
      0.4,
      -0.95
    ]

  ];


  wheelPositions
  .forEach(
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


      wheel.castShadow =
      true;


      car.add(
        wheel
      );

    }
  );


  /*
    Đèn hậu.
  */

  [
    -0.55,
    0.55
  ]
  .forEach(
    x => {

      const rearLight =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.28,
          0.18,
          0.08
        ),

        new THREE.MeshStandardMaterial({

          color: 0xff2020,

          emissive: 0xff0000,

          emissiveIntensity: 1

        })

      );


      rearLight.position.set(
        x,
        0.65,
        1.52
      );


      car.add(
        rearLight
      );

    }
  );


  car.position.set(
    0,
    0,
    CAR_Z
  );


  scene.add(
    car
  );


  return car;

}


/* =========================================================
   11. TEXT CANVAS
========================================================= */

function wrapText(
  context,
  text,
  maxWidth
){

  const words =
  String(
    text
  )
  .split(" ");


  const lines =
  [];


  let currentLine =
  "";


  words.forEach(
    word => {

      const testLine =
      currentLine
      ?
      currentLine +
      " " +
      word
      :
      word;


      const width =
      context
      .measureText(
        testLine
      )
      .width;


      if(
        width >
        maxWidth
        &&
        currentLine
      ){

        lines.push(
          currentLine
        );


        currentLine =
        word;

      }

      else{

        currentLine =
        testLine;

      }

    }
  );


  if(
    currentLine
  ){

    lines.push(
      currentLine
    );

  }


  return lines.slice(
    0,
    4
  );

}


/* =========================================================
   12. TẠO TEXTURE CHỮ
========================================================= */

function createTextTexture(
  text
){

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


  /*
    Background.
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
    Thanh xanh.
  */

  ctx.fillStyle =
  "#3478e5";


  ctx.fillRect(
    0,
    0,
    canvas.width,
    48
  );


  /*
    Chữ.
  */

  ctx.fillStyle =
  "#15213b";


  ctx.textAlign =
  "center";


  ctx.textBaseline =
  "middle";


  ctx.font =
  "bold 58px Arial";


  const lines =
  wrapText(
    ctx,
    text,
    880
  );


  const lineHeight =
  70;


  const totalHeight =
  lines.length *
  lineHeight;


  const startY =
  220 -
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
        index *
        lineHeight

      );

    }
  );


  const texture =
  new THREE.CanvasTexture(
    canvas
  );


  texture.colorSpace =
  THREE.SRGBColorSpace;


  return texture;

}


/* =========================================================
   13. CỔNG TỪ VỰNG
========================================================= */

function createVocabularyGate(
  text,
  laneIndex
){

  const gate =
  new THREE.Group();


  const frameMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x234b90,

    roughness: 0.45,

    metalness: 0.25

  });


  /*
    Trụ trái + phải.
  */

  [
    -1.15,
    1.15
  ]
  .forEach(
    x => {

      const post =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.18,
          3,
          0.3
        ),

        frameMaterial

      );


      post.position.set(
        x,
        1.5,
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
    Thanh ngang.
  */

  const topBeam =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      2.5,
      0.2,
      0.3
    ),

    frameMaterial

  );


  topBeam.position.set(
    0,
    2.9,
    0
  );


  gate.add(
    topBeam
  );


  /*
    Biển đáp án.
  */

  const texture =
  createTextTexture(
    text
  );


  const sign =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      2.25,
      1.2
    ),

    new THREE.MeshBasicMaterial({

      map: texture,

      side:
      THREE.DoubleSide

    })

  );


  sign.position.set(
    0,
    1.9,
    0.18
  );


  gate.add(
    sign
  );


  /*
    Thanh chắn dưới.
  */

  const bumper =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      2.3,
      0.3,
      0.45
    ),

    new THREE.MeshStandardMaterial({

      color: 0xffc52f

    })

  );


  bumper.position.set(
    0,
    0.18,
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
   14. VARIABLES GAME
========================================================= */

const car =
createCar();


let targetLaneIndex =
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


let currentGateGroup =
null;


let roundResolved =
false;


let feedbackTimer =
null;


/* =========================================================
   15. RANDOM / SHUFFLE
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


    const temp =
    array[i];


    array[i] =
    array[j];


    array[j] =
    temp;

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
   16. TẠO 3 ĐÁP ÁN
========================================================= */

function createAnswers(
  target
){

  const wrong =
  shuffle(

    VOCABULARY
    .filter(
      item =>
      item !==
      target
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
   17. XÓA CỔNG CŨ
========================================================= */

function removeCurrentGate(){

  if(
    !currentGateGroup
  ){

    return;

  }


  currentGateGroup
  .traverse(
    object => {

      if(
        object.geometry
      ){

        object.geometry
        .dispose();

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

            if(
              material.map
            ){

              material.map
                .dispose();

            }


            material.dispose();

          }
        );

      }

    }
  );


  scene.remove(
    currentGateGroup
  );


  currentGateGroup =
  null;

}


/* =========================================================
   18. TẠO CÂU HỎI MỚI
========================================================= */

function createRound(){

  removeCurrentGate();


  roundResolved =
  false;


  currentWord =
  randomItem(
    VOCABULARY
  );


  targetWordEl
  .textContent =
  currentWord.word;


  currentAnswers =
  createAnswers(
    currentWord
  );


  currentGateGroup =
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


      currentGateGroup.add(
        gate
      );

    }
  );


  currentGateGroup
  .position.z =
  GATE_START_Z;


  scene.add(
    currentGateGroup
  );

}


/* =========================================================
   19. ĐỔI LÀN
========================================================= */

function moveLeft(){

  if(
    !gameRunning
  ){

    return;

  }


  targetLaneIndex =
  Math.max(

    0,

    targetLaneIndex - 1

  );

}


function moveRight(){

  if(
    !gameRunning
  ){

    return;

  }


  targetLaneIndex =
  Math.min(

    2,

    targetLaneIndex + 1

  );

}


/* =========================================================
   20. KEYBOARD
========================================================= */

document
.addEventListener(
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


/* =========================================================
   21. MOBILE BUTTON
========================================================= */

leftBtn
.addEventListener(
  "pointerdown",
  moveLeft
);


rightBtn
.addEventListener(
  "pointerdown",
  moveRight
);


/* =========================================================
   22. FEEDBACK
========================================================= */

function showFeedback(
  text,
  type
){

  feedbackEl
  .textContent =
  text;


  feedbackEl
  .className =
  `feedback ${type} show`;


  clearTimeout(
    feedbackTimer
  );


  feedbackTimer =
  setTimeout(
    () => {

      feedbackEl
      .className =
      "feedback";

    },
    1100
  );

}


/* =========================================================
   23. TÌM LÀN XE HIỆN TẠI
========================================================= */

function getCurrentCarLane(){

  let selectedLane =
  0;


  let closest =
  Infinity;


  LANE_X
  .forEach(
    (
      laneX,
      index
    ) => {

      const distance =
      Math.abs(

        car.position.x -
        laneX

      );


      if(
        distance <
        closest
      ){

        closest =
        distance;


        selectedLane =
        index;

      }

    }
  );


  return selectedLane;

}


/* =========================================================
   24. COLLISION
========================================================= */

function checkGateAnswer(){

  if(
    roundResolved
    ||
    !currentGateGroup
  ){

    return;

  }


  roundResolved =
  true;


  const selectedLane =
  getCurrentCarLane();


  const selectedAnswer =
  currentAnswers[
    selectedLane
  ];


  const correct =
  selectedAnswer ===
  currentWord;


  if(
    correct
  ){

    handleCorrect(
      selectedLane
    );

  }

  else{

    handleWrong(
      selectedLane
    );

  }

}


/* =========================================================
   25. TRẢ LỜI ĐÚNG
========================================================= */

function handleCorrect(
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


  /*
    Kích hoạt Nitro.
  */

  boostTimer =
  BOOST_DURATION;


  /*
    Cổng đúng phóng to nhẹ.
  */

  const gate =
  currentGateGroup
  .children[
    lane
  ];


  if(
    gate
  ){

    gate.scale.set(
      1.15,
      1.15,
      1.15
    );

  }


  showFeedback(

    `✅ CHÍNH XÁC! +${100 + bonus} · NITRO!`,

    "good"

  );


  updateHUD();

}


/* =========================================================
   26. TRẢ LỜI SAI
========================================================= */

function handleWrong(){

  combo =
  0;


  lives--;


  /*
    Xe rung lắc.
  */

  shakeTimer =
  0.7;


  showFeedback(

    `💥 SAI! Đáp án đúng: ${currentWord.meaning}`,

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
   27. HUD
========================================================= */

function updateHUD(){

  scoreEl
  .textContent =
  score;


  livesEl
  .textContent =
  lives > 0
  ?
  "❤️".repeat(
    lives
  )
  :
  "—";


  comboEl
  .textContent =
  `x${combo}`;


  speedEl
  .textContent =
  `${Math.round(currentSpeed * 8)} km/h`;

}


/* =========================================================
   28. RESET GAME
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


  targetLaneIndex =
  1;


  car.position.set(
    0,
    0,
    CAR_Z
  );


  car.rotation.set(
    0,
    0,
    0
  );


  createRound();


  updateHUD();

}


/* =========================================================
   29. START GAME
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
   30. GAME OVER
========================================================= */

function endGame(){

  gameRunning =
  false;


  gameOverTitle
  .textContent =
  "🏁 GAME OVER";


  finalSummary
  .textContent =
  `Điểm của bạn: ${score}. Combo tốt nhất hãy cố gắng nâng cao ở lượt tiếp theo.`;


  gameOverScreen
  .classList
  .remove(
    "hidden"
  );

}


/* =========================================================
   31. BUTTON START
========================================================= */

startBtn
.addEventListener(
  "click",
  startGame
);


restartBtn
.addEventListener(
  "click",
  startGame
);


/* =========================================================
   32. UPDATE XE
========================================================= */

function updateCar(
  delta
){

  const targetX =
  LANE_X[
    targetLaneIndex
  ];


  /*
    Lerp:
    chuyển làn mượt.
  */

  car.position.x =
  THREE.MathUtils.lerp(

    car.position.x,

    targetX,

    Math.min(
      1,
      delta * 8
    )

  );


  /*
    Xe nghiêng nhẹ khi đổi làn.
  */

  const difference =
  targetX -
  car.position.x;


  car.rotation.z =
  THREE.MathUtils.lerp(

    car.rotation.z,

    -difference *
    0.09,

    Math.min(
      1,
      delta * 8
    )

  );


  /*
    Rung khi sai.
  */

  if(
    shakeTimer >
    0
  ){

    shakeTimer -=
    delta;


    car.rotation.y =
    Math.sin(
      performance.now() *
      0.045
    )
    *
    0.15;


    car.position.y =
    Math.abs(
      Math.sin(
        performance.now() *
        0.05
      )
    )
    *
    0.12;

  }

  else{

    car.rotation.y =
    THREE.MathUtils.lerp(

      car.rotation.y,

      0,

      Math.min(
        1,
        delta * 10
      )

    );


    car.position.y =
    THREE.MathUtils.lerp(

      car.position.y,

      0,

      Math.min(
        1,
        delta * 10
      )

    );

  }

}


/* =========================================================
   33. UPDATE CỔNG
========================================================= */

function updateGate(
  delta
){

  if(
    !currentGateGroup
  ){

    return;

  }


  /*
    Cổng di chuyển từ xa về xe.
  */

  currentGateGroup
  .position.z +=

  currentSpeed *
  delta;


  /*
    Collision.
  */

  if(

    !roundResolved

    &&

    currentGateGroup
    .position.z >=
    GATE_COLLISION_Z

  ){

    checkGateAnswer();

  }


  /*
    Qua khỏi xe -> câu mới.
  */

  if(

    currentGateGroup

    &&

    currentGateGroup
    .position.z >
    GATE_REMOVE_Z

    &&

    gameRunning

  ){

    createRound();

  }

}


/* =========================================================
   34. TỐC ĐỘ
========================================================= */

function updateSpeed(
  delta
){

  elapsed +=
  delta;


  /*
    Game càng lâu càng nhanh.
  */

  const normalSpeed =
  Math.min(

    MAX_SPEED,

    BASE_SPEED +
    elapsed *
    0.15

  );


  /*
    Nitro.
  */

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
   35. CAMERA EFFECT
========================================================= */

function updateCamera(
  delta
){

  /*
    Khi Nitro:
    camera lùi nhẹ tạo cảm giác tăng tốc.
  */

  const targetCameraZ =
  boostTimer > 0
  ?
  15
  :
  14;


  camera.position.z =
  THREE.MathUtils.lerp(

    camera.position.z,

    targetCameraZ,

    Math.min(
      1,
      delta * 4
    )

  );


  camera.position.x =
  THREE.MathUtils.lerp(

    camera.position.x,

    car.position.x *
    0.16,

    Math.min(
      1,
      delta * 3
    )

  );


  camera.lookAt(
    car.position.x * 0.12,
    1,
    -10
  );

}


/* =========================================================
   36. GAME LOOP
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

    0.05

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


    updateGate(
      delta
    );


    updateCamera(
      delta
    );

  }


  renderer.render(
    scene,
    camera
  );

}


/* =========================================================
   37. RESIZE
========================================================= */

window
.addEventListener(
  "resize",
  () => {

    camera.aspect =
    window.innerWidth /
    window.innerHeight;


    camera
    .updateProjectionMatrix();


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
   38. KHỞI TẠO
========================================================= */

createRoad();


updateHUD();


animate();
