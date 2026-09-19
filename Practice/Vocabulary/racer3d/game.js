/* =========================================================
   VOCABULARY RACER 3D
   LIGHTWEIGHT RACING VERSION
   VERSION 7
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
   2. GAME SETTINGS
========================================================= */

/*
  5 LANES

  Opponent | Answer | Answer | Answer | Opponent
*/

const PLAYER_LANES = [

  -3.6,
  0,
  3.6

];


const OPPONENT_LANES = [

  -7.2,
  7.2

];


const BASE_SPEED =
5;


const MAX_SPEED =
7.4;


/*
  Khoảng 9-10 giây đọc câu đầu.
*/

const FIRST_GATE_DISTANCE =
49;


const NEXT_GATE_DISTANCE =
54;


const BOOST_MULTIPLIER =
1.43;


const BOOST_DURATION =
1.65;


const WRONG_SPEED_MULTIPLIER =
0.76;


const WRONG_SLOW_DURATION =
1.25;


const TOTAL_QUESTIONS =
12;


const COLLISION_DISTANCE =
1.7;


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


const speedEl =
document.getElementById(
  "speed"
);


const positionEl =
document.getElementById(
  "position"
);


const comboEl =
document.getElementById(
  "combo"
);


const progressEl =
document.getElementById(
  "progress"
);


const feedbackEl =
document.getElementById(
  "feedback"
);


const speedEffect =
document.getElementById(
  "speed-effect"
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


const resultIcon =
document.getElementById(
  "result-icon"
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
   4. THREE.JS
========================================================= */

const scene =
new THREE.Scene();


scene.background =
new THREE.Color(
  0x92d7ff
);


scene.fog =
new THREE.Fog(

  0x92d7ff,

  70,

  190

);


/* =========================================================
   CAMERA
========================================================= */

const camera =
new THREE.PerspectiveCamera(

  60,

  window.innerWidth /
  window.innerHeight,

  0.1,

  400

);


scene.add(
  camera
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
new THREE.WebGLRenderer({

  antialias:true,

  powerPreference:
  "high-performance"

});


/*
  Bản trước dùng tới DPR 2.

  Đây là một trong các nguyên nhân
  khiến laptop yếu bị giật.

  Bản này giới hạn 1.25.
*/

renderer.setPixelRatio(

  Math.min(

    window.devicePixelRatio,

    1.25

  )

);


renderer.setSize(

  window.innerWidth,

  window.innerHeight

);


/*
  Tắt shadows hoàn toàn.

  Giảm tải GPU rất nhiều.
*/

renderer.shadowMap.enabled =
false;


renderer.outputColorSpace =
THREE.SRGBColorSpace;


container.appendChild(
  renderer.domElement
);


/* =========================================================
   5. LIGHT
========================================================= */

const skyLight =
new THREE.HemisphereLight(

  0xffffff,

  0x52734c,

  2.1

);


scene.add(
  skyLight
);


const sun =
new THREE.DirectionalLight(

  0xffffff,

  1.6

);


sun.position.set(

  -15,

  20,

  10

);


scene.add(
  sun
);


/* =========================================================
   6. ROAD TEXTURE
========================================================= */

function createRoadTexture(){

  const canvas =
  document.createElement(
    "canvas"
  );


  canvas.width =
  900;


  canvas.height =
  1800;


  const ctx =
  canvas.getContext(
    "2d"
  );


  /*
    Asphalt.
  */

  ctx.fillStyle =
  "#343942";


  ctx.fillRect(

    0,

    0,

    canvas.width,

    canvas.height

  );


  /*
    Subtle asphalt bands.
  */

  for(
    let i = 0;
    i < 100;
    i++
  ){

    const alpha =
    Math.random() *
    0.025;


    ctx.fillStyle =
    `rgba(255,255,255,${alpha})`;


    ctx.fillRect(

      0,

      Math.random() *
      canvas.height,

      canvas.width,

      Math.random() *
      3 +
      1

    );

  }


  /*
    Road edges.
  */

  ctx.fillStyle =
  "#ffffff";


  ctx.fillRect(

    12,

    0,

    12,

    canvas.height

  );


  ctx.fillRect(

    canvas.width - 24,

    0,

    12,

    canvas.height

  );


  /*
    5 lanes = 4 dashed lines.
  */

  const divisions = [

    .2,
    .4,
    .6,
    .8

  ];


  ctx.strokeStyle =
  "rgba(255,255,255,.72)";


  ctx.lineWidth =
  7;


  ctx.setLineDash(
    [
      75,
      65
    ]
  );


  divisions.forEach(
    ratio => {

      ctx.beginPath();


      ctx.moveTo(

        canvas.width *
        ratio,

        0

      );


      ctx.lineTo(

        canvas.width *
        ratio,

        canvas.height

      );


      ctx.stroke();

    }
  );


  const texture =
  new THREE.CanvasTexture(
    canvas
  );


  texture.colorSpace =
  THREE.SRGBColorSpace;


  texture.wrapS =
  THREE.RepeatWrapping;


  texture.wrapT =
  THREE.RepeatWrapping;


  texture.repeat.set(

    1,

    14

  );


  return texture;

}


/* =========================================================
   7. WORLD
========================================================= */

let road;

let grass;


const roadsideObjects =
[];


function createWorld(){

  /*
    Grass.
  */

  grass =
  new THREE.Mesh(

    new THREE.PlaneGeometry(

      100,

      3200

    ),

    new THREE.MeshLambertMaterial({

      color:0x4f984f

    })

  );


  grass.rotation.x =
  -Math.PI / 2;


  grass.position.set(

    0,

    -0.05,

    -1500

  );


  scene.add(
    grass
  );


  /*
    Road.
  */

  road =
  new THREE.Mesh(

    new THREE.PlaneGeometry(

      18,

      3200

    ),

    new THREE.MeshLambertMaterial({

      map:
      createRoadTexture()

    })

  );


  road.rotation.x =
  -Math.PI / 2;


  road.position.set(

    0,

    0,

    -1500

  );


  scene.add(
    road
  );


  createScenery();

}


/* =========================================================
   8. LIGHTWEIGHT TREE
========================================================= */

function createTree(){

  const group =
  new THREE.Group();


  const trunk =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      .22,

      1.45,

      .22

    ),

    new THREE.MeshLambertMaterial({

      color:0x76513a

    })

  );


  trunk.position.y =
  .72;


  group.add(
    trunk
  );


  const crown =
  new THREE.Mesh(

    new THREE.ConeGeometry(

      .85,

      2.4,

      6

    ),

    new THREE.MeshLambertMaterial({

      color:0x246f3c

    })

  );


  crown.position.y =
  2.35;


  group.add(
    crown
  );


  return group;

}


/* =========================================================
   ROADSIDE POST
========================================================= */

function createPost(){

  const group =
  new THREE.Group();


  const pole =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      .11,

      .75,

      .11

    ),

    new THREE.MeshLambertMaterial({

      color:0xf2f2f2

    })

  );


  pole.position.y =
  .375;


  group.add(
    pole
  );


  const reflector =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      .16,

      .18,

      .08

    ),

    new THREE.MeshBasicMaterial({

      color:0xffc94e

    })

  );


  reflector.position.y =
  .67;


  group.add(
    reflector
  );


  return group;

}


/* =========================================================
   9. SCENERY
========================================================= */

function createScenery(){

  /*
    Chỉ 24 vị trí.

    Rất nhẹ.
  */

  for(
    let i = 0;
    i < 24;
    i++
  ){

    const z =
    -15 -
    i * 14;


    const left =
    i % 3 === 0
    ?
    createTree()
    :
    createPost();


    left.position.set(

      i % 3 === 0
      ?
      -11
      :
      -9.7,

      0,

      z

    );


    scene.add(
      left
    );


    roadsideObjects.push(
      left
    );


    const right =
    i % 3 === 0
    ?
    createTree()
    :
    createPost();


    right.position.set(

      i % 3 === 0
      ?
      11
      :
      9.7,

      0,

      z - 7

    );


    scene.add(
      right
    );


    roadsideObjects.push(
      right
    );

  }


  /*
    Mountains.

    Low-poly, không shadow.
  */

  for(
    let i = 0;
    i < 6;
    i++
  ){

    const mountain =
    new THREE.Mesh(

      new THREE.ConeGeometry(

        12 +
        Math.random() * 7,

        20 +
        Math.random() * 9,

        5

      ),

      new THREE.MeshLambertMaterial({

        color:
        i % 2 === 0
        ?
        0x7796a5
        :
        0x6d8795

      })

    );


    mountain.position.set(

      i % 2 === 0
      ?
      -35 -
      i * 4
      :
      35 +
      i * 4,

      7,

      -120 -
      i * 28

    );


    scene.add(
      mountain
    );


    roadsideObjects.push(
      mountain
    );

  }

}


/* =========================================================
   10. PLAYER PROXY
========================================================= */

const player =
new THREE.Group();


player.position.set(

  0,

  0,

  5

);


scene.add(
  player
);


/* =========================================================
   11. COCKPIT
========================================================= */

let steeringWheel;

let dashboardSpeedNeedle;


function createCockpit(){

  const cockpit =
  new THREE.Group();


  /*
    Hood.
  */

  const hood =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      4.4,

      .15,

      2.7

    ),

    new THREE.MeshLambertMaterial({

      color:0xe03b42

    })

  );


  hood.position.set(

    0,

    -.92,

    -3.55

  );


  cockpit.add(
    hood
  );


  /*
    Dashboard.
  */

  const dashboard =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      6.2,

      .48,

      1.05

    ),

    new THREE.MeshLambertMaterial({

      color:0x111720

    })

  );


  dashboard.position.set(

    0,

    -1.21,

    -2

  );


  cockpit.add(
    dashboard
  );


  /*
    Instrument panel.
  */

  const instrumentPanel =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      1.65,

      .48,

      .08

    ),

    new THREE.MeshBasicMaterial({

      color:0x253246

    })

  );


  instrumentPanel.position.set(

    .25,

    -.98,

    -1.45

  );


  cockpit.add(
    instrumentPanel
  );


  /*
    Speed needle.
  */

  dashboardSpeedNeedle =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      .04,

      .33,

      .035

    ),

    new THREE.MeshBasicMaterial({

      color:0xff5454

    })

  );


  dashboardSpeedNeedle.position.set(

    .25,

    -.98,

    -1.39

  );


  cockpit.add(
    dashboardSpeedNeedle
  );


  /*
    Steering wheel.
  */

  steeringWheel =
  new THREE.Mesh(

    new THREE.TorusGeometry(

      .38,

      .065,

      10,

      28

    ),

    new THREE.MeshLambertMaterial({

      color:0x101319

    })

  );


  steeringWheel.position.set(

    -.78,

    -.64,

    -1.55

  );


  steeringWheel.rotation.x =
  Math.PI / 2;


  cockpit.add(
    steeringWheel
  );


  /*
    Windshield pillars.
  */

  const pillarMaterial =
  new THREE.MeshLambertMaterial({

    color:0x171a20

  });


  const leftPillar =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      .13,

      3,

      .17

    ),

    pillarMaterial

  );


  leftPillar.position.set(

    -2.75,

    .15,

    -2.4

  );


  leftPillar.rotation.z =
  -.18;


  cockpit.add(
    leftPillar
  );


  const rightPillar =
  leftPillar.clone();


  rightPillar.position.x =
  2.75;


  rightPillar.rotation.z =
  .18;


  cockpit.add(
    rightPillar
  );


  camera.add(
    cockpit
  );

}


/* =========================================================
   12. OPPONENT CAR
========================================================= */

function createOpponentCar(
  color
){

  const car =
  new THREE.Group();


  /*
    Lower body.
  */

  const body =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      1.75,

      .48,

      3

    ),

    new THREE.MeshLambertMaterial({

      color

    })

  );


  body.position.y =
  .55;


  car.add(
    body
  );


  /*
    Bonnet.
  */

  const bonnet =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      1.55,

      .22,

      .9

    ),

    new THREE.MeshLambertMaterial({

      color

    })

  );


  bonnet.position.set(

    0,

    .82,

    -1

  );


  car.add(
    bonnet
  );


  /*
    Cabin.
  */

  const cabin =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      1.35,

      .58,

      1.25

    ),

    new THREE.MeshLambertMaterial({

      color:0x22334b

    })

  );


  cabin.position.set(

    0,

    1.05,

    .15

  );


  car.add(
    cabin
  );


  /*
    Rear lights.
  */

  const lightMaterial =
  new THREE.MeshBasicMaterial({

    color:0xff3030

  });


  [
    -.55,
    .55
  ]
  .forEach(
    x => {

      const light =
      new THREE.Mesh(

        new THREE.BoxGeometry(

          .3,

          .14,

          .05

        ),

        lightMaterial

      );


      light.position.set(

        x,

        .62,

        1.52

      );


      car.add(
        light
      );

    }
  );


  /*
    Wheels.

    Dùng box thay cylinder để nhẹ hơn.
  */

  const wheelMaterial =
  new THREE.MeshLambertMaterial({

    color:0x101215

  });


  [
    [-.96,.35,-.9],
    [.96,.35,-.9],
    [-.96,.35,.9],
    [.96,.35,.9]
  ]
  .forEach(
    p => {

      const wheel =
      new THREE.Mesh(

        new THREE.BoxGeometry(

          .24,

          .48,

          .52

        ),

        wheelMaterial

      );


      wheel.position.set(

        p[0],
        p[1],
        p[2]

      );


      car.add(
        wheel
      );

    }
  );


  scene.add(
    car
  );


  return car;

}


/* =========================================================
   13. OPPONENT STATE
========================================================= */

const opponentLeft = {

  mesh:
  createOpponentCar(
    0x367cff
  ),

  lane:
  OPPONENT_LANES[0],

  relativeZ:
  -2.5,

  targetRelativeZ:
  -2.5,

  boost:
  0

};


const opponentRight = {

  mesh:
  createOpponentCar(
    0xf0444b
  ),

  lane:
  OPPONENT_LANES[1],

  relativeZ:
  2,

  targetRelativeZ:
  2,

  boost:
  0

};


const opponents = [

  opponentLeft,

  opponentRight

];


/* =========================================================
   14. TEXT WRAPPING
========================================================= */

function wrapText(
  ctx,
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
      `${line} ${word}`
      :
      word;


      if(

        ctx.measureText(
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
    4
  );

}


/* =========================================================
   15. ANSWER TEXTURE
========================================================= */

function createAnswerTexture(
  text,
  lane
){

  /*
    Bản cũ dùng texture 2048.

    Bản này chỉ 1024:
    nhẹ hơn nhiều nhưng vẫn đủ rõ.
  */

  const canvas =
  document.createElement(
    "canvas"
  );


  canvas.width =
  1024;


  canvas.height =
  430;


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
    Header.
  */

  const colors = [

    "#3d79dc",

    "#7354df",

    "#329878"

  ];


  ctx.fillStyle =
  colors[
    lane
  ];


  ctx.fillRect(

    0,

    0,

    canvas.width,

    54

  );


  /*
    Lane label.
  */

  ctx.fillStyle =
  "#ffffff";


  ctx.font =
  "900 27px Arial";


  ctx.textAlign =
  "center";


  ctx.textBaseline =
  "middle";


  ctx.fillText(

    lane === 0
    ?
    "LEFT"
    :
    lane === 1
    ?
    "CENTER"
    :
    "RIGHT",

    canvas.width / 2,

    27

  );


  /*
    Border.
  */

  ctx.strokeStyle =
  "#192843";


  ctx.lineWidth =
  12;


  ctx.strokeRect(

    6,

    6,

    canvas.width - 12,

    canvas.height - 12

  );


  /*
    Adaptive font.
  */

  let size =
  66;


  if(
    text.length >
    38
  ){

    size =
    56;

  }


  if(
    text.length >
    60
  ){

    size =
    47;

  }


  if(
    text.length >
    82
  ){

    size =
    40;

  }


  ctx.font =
  `900 ${size}px Arial`;


  ctx.fillStyle =
  "#111c31";


  const lines =
  wrapText(

    ctx,

    text,

    890

  );


  const lineHeight =
  size * 1.13;


  const totalHeight =
  lines.length *
  lineHeight;


  const startY =

  255

  -

  totalHeight / 2

  +

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


  texture.anisotropy =
  Math.min(

    renderer.capabilities
    .getMaxAnisotropy(),

    4

  );


  return texture;

}


/* =========================================================
   16. ANSWER GATE
========================================================= */

function createAnswerGate(
  text,
  lane
){

  const group =
  new THREE.Group();


  const frameMaterial =
  new THREE.MeshLambertMaterial({

    color:0x263d62

  });


  /*
    Two supports.
  */

  [
    -1.45,
    1.45
  ]
  .forEach(
    x => {

      const pole =
      new THREE.Mesh(

        new THREE.BoxGeometry(

          .14,

          3.3,

          .18

        ),

        frameMaterial

      );


      pole.position.set(

        x,

        1.65,

        0

      );


      group.add(
        pole
      );

    }
  );


  /*
    Sign.
  */

  const texture =
  createAnswerTexture(

    text,

    lane

  );


  const board =
  new THREE.Mesh(

    new THREE.PlaneGeometry(

      3,

      1.55

    ),

    new THREE.MeshBasicMaterial({

      map:texture,

      side:
      THREE.DoubleSide

    })

  );


  board.position.set(

    0,

    2.15,

    .1

  );


  group.add(
    board
  );


  /*
    Yellow road marker.
  */

  const marker =
  new THREE.Mesh(

    new THREE.BoxGeometry(

      2.6,

      .15,

      .6

    ),

    new THREE.MeshBasicMaterial({

      color:0xffcf42

    })

  );


  marker.position.set(

    0,

    .08,

    0

  );


  group.add(
    marker
  );


  group.position.x =
  PLAYER_LANES[
    lane
  ];


  return group;

}


/* =========================================================
   17. GAME STATE
========================================================= */

let selectedLane =
1;


let score =
0;


let combo =
0;


let bestCombo =
0;


let questionCount =
0;


let correctCount =
0;


let elapsed =
0;


let currentSpeed =
BASE_SPEED;


let boostTimer =
0;


let slowTimer =
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


let vocabularyDeck =
[];


let feedbackTimer =
null;


/* =========================================================
   18. UTILITIES
========================================================= */

function shuffle(
  input
){

  const array =
  [...input];


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


/* =========================================================
   19. VOCAB DECK
========================================================= */

function resetDeck(){

  vocabularyDeck =
  shuffle(
    VOCABULARY
  );

}


function nextVocabularyWord(){

  if(
    vocabularyDeck.length ===
    0
  ){

    resetDeck();

  }


  return vocabularyDeck.shift();

}


/* =========================================================
   20. ANSWERS
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
   21. REMOVE GATE
========================================================= */

function removeGate(){

  if(
    !gateGroup
  ){

    return;

  }


  gateGroup.traverse(
    object => {

      if(
        object.geometry
      ){

        object.geometry.dispose();

      }


      if(
        object.material
      ){

        const list =
        Array.isArray(
          object.material
        )
        ?
        object.material
        :
        [object.material];


        list.forEach(
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
   22. CREATE QUESTION
========================================================= */

function createQuestion(
  first = false
){

  removeGate();


  roundResolved =
  false;


  currentWord =
  nextVocabularyWord();


  targetWordEl.textContent =
  currentWord.word;


  currentAnswers =
  buildAnswers(
    currentWord
  );


  gateGroup =
  new THREE.Group();


  currentAnswers.forEach(
    (
      answer,
      lane
    ) => {

      const gate =
      createAnswerGate(

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


  /*
    Gate đứng yên trong world space.

    Xe chạy tới gate.
  */

  gateGroup.position.z =

  player.position.z

  -

  (
    first
    ?
    FIRST_GATE_DISTANCE
    :
    NEXT_GATE_DISTANCE
  );


  scene.add(
    gateGroup
  );

}


/* =========================================================
   23. CONTROLS
========================================================= */

function moveLeft(){

  if(
    !gameRunning
  ){

    return;

  }


  selectedLane =
  Math.max(

    0,

    selectedLane - 1

  );

}


function moveRight(){

  if(
    !gameRunning
  ){

    return;

  }


  selectedLane =
  Math.min(

    2,

    selectedLane + 1

  );

}


document.addEventListener(
  "keydown",
  event => {

    if(
      event.key ===
      "ArrowLeft"
      ||
      event.key ===
      "a"
      ||
      event.key ===
      "A"
    ){

      event.preventDefault();

      moveLeft();

    }


    if(
      event.key ===
      "ArrowRight"
      ||
      event.key ===
      "d"
      ||
      event.key ===
      "D"
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
   24. FEEDBACK
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

    1450

  );

}


/* =========================================================
   25. GET CURRENT LANE
========================================================= */

function currentLane(){

  let result =
  0;


  let nearest =
  Infinity;


  PLAYER_LANES.forEach(
    (
      x,
      index
    ) => {

      const distance =
      Math.abs(

        player.position.x -
        x

      );


      if(
        distance <
        nearest
      ){

        nearest =
        distance;


        result =
        index;

      }

    }
  );


  return result;

}


/* =========================================================
   26. RANK
========================================================= */

function getRacePosition(){

  /*
    Negative relativeZ = opponent ahead.

    Positive = opponent behind.
  */

  const opponentsAhead =
  opponents.filter(
    opponent =>
    opponent.relativeZ <
    -1
  )
  .length;


  return 1 +
  opponentsAhead;

}


/* =========================================================
   27. CORRECT ANSWER
========================================================= */

function correctAnswer(){

  correctCount++;


  combo++;


  bestCombo =
  Math.max(

    bestCombo,

    combo

  );


  const bonus =
  Math.min(

    combo * 10,

    80

  );


  score +=
  100 +
  bonus;


  /*
    Player boost.
  */

  boostTimer =
  BOOST_DURATION;


  slowTimer =
  0;


  /*
    Player tăng tốc =>
    hai đối thủ tụt lại.
  */

  opponents.forEach(
    opponent => {

      opponent.targetRelativeZ =
      Math.min(

        6,

        opponent.targetRelativeZ +
        5.5

      );

    }
  );


  showFeedback(

    `⚡ CHÍNH XÁC! +${100 + bonus} · TĂNG TỐC!`,

    "good"

  );


  updateHUD();

}


/* =========================================================
   28. WRONG ANSWER
========================================================= */

function wrongAnswer(){

  combo =
  0;


  boostTimer =
  0;


  slowTimer =
  WRONG_SLOW_DURATION;


  shakeTimer =
  .55;


  /*
    Ưu tiên đối thủ đang ở phía sau
    để tạo cảm giác nó lao lên vượt.
  */

  const behind =
  opponents.filter(
    opponent =>
    opponent.relativeZ >
    -5
  );


  const candidates =
  behind.length
  ?
  behind
  :
  opponents;


  const opponent =
  candidates[
    Math.floor(
      Math.random() *
      candidates.length
    )
  ];


  /*
    Cho xe đối thủ vượt mạnh.
  */

  opponent.targetRelativeZ =
  Math.max(

    -18,

    opponent.targetRelativeZ -
    11

  );


  opponent.boost =
  1.4;


  showFeedback(

    `🏎️ Sai! ${currentWord.meaning} · Đối thủ vượt lên!`,

    "bad"

  );


  updateHUD();

}


/* =========================================================
   29. RESOLVE GATE
========================================================= */

function resolveGate(){

  if(
    roundResolved
    ||
    !gameRunning
  ){

    return;

  }


  roundResolved =
  true;


  const lane =
  currentLane();


  const answer =
  currentAnswers[
    lane
  ];


  questionCount++;


  if(
    answer.word ===
    currentWord.word
  ){

    correctAnswer();

  }

  else{

    wrongAnswer();

  }


  updateHUD();

}


/* =========================================================
   30. HUD
========================================================= */

function updateHUD(){

  scoreEl.textContent =
  score;


  speedEl.textContent =
  `${Math.round(
    currentSpeed *
    11
  )} km/h`;


  positionEl.textContent =
  `${getRacePosition()}/3`;


  comboEl.textContent =
  `x${combo}`;


  progressEl.textContent =
  `${questionCount}/${TOTAL_QUESTIONS}`;

}


/* =========================================================
   31. RESET OPPONENTS
========================================================= */

function resetOpponents(){

  opponentLeft.relativeZ =
  -2.5;


  opponentLeft.targetRelativeZ =
  -2.5;


  opponentLeft.boost =
  0;


  opponentRight.relativeZ =
  2;


  opponentRight.targetRelativeZ =
  2;


  opponentRight.boost =
  0;

}


/* =========================================================
   32. RESET GAME
========================================================= */

function resetGame(){

  selectedLane =
  1;


  score =
  0;


  combo =
  0;


  bestCombo =
  0;


  questionCount =
  0;


  correctCount =
  0;


  elapsed =
  0;


  currentSpeed =
  BASE_SPEED;


  boostTimer =
  0;


  slowTimer =
  0;


  shakeTimer =
  0;


  resetDeck();


  resetOpponents();


  player.position.set(

    0,

    0,

    5

  );


  camera.position.set(

    0,

    1.65,

    5.05

  );


  createQuestion(
    true
  );


  updateHUD();

}


/* =========================================================
   33. START GAME
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
   34. END GAME
========================================================= */

function endGame(){

  gameRunning =
  false;


  speedEffect
  .classList
  .remove(
    "active"
  );


  const position =
  getRacePosition();


  if(
    position ===
    1
  ){

    resultIcon.textContent =
    "🏆";


    gameOverTitle.textContent =
    "Bạn về nhất!";

  }

  else if(
    position ===
    2
  ){

    resultIcon.textContent =
    "🥈";


    gameOverTitle.textContent =
    "Bạn về nhì!";

  }

  else{

    resultIcon.textContent =
    "🏁";


    gameOverTitle.textContent =
    "Hoàn thành cuộc đua!";

  }


  const accuracy =
  questionCount
  ?
  Math.round(
    correctCount /
    questionCount *
    100
  )
  :
  0;


  finalSummary.textContent =

  `Điểm ${score} · Đúng ${correctCount}/${questionCount} · Chính xác ${accuracy}% · Combo cao nhất x${bestCombo}.`;


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
   35. PLAYER MOVEMENT
========================================================= */

function updatePlayer(
  delta
){

  /*
    Smooth lane change.
  */

  const wantedX =
  PLAYER_LANES[
    selectedLane
  ];


  player.position.x =
  THREE.MathUtils.lerp(

    player.position.x,

    wantedX,

    Math.min(
      1,

      delta * 6.5
    )

  );


  /*
    TRUE FORWARD MOVEMENT.
  */

  player.position.z -=

  currentSpeed *
  delta;

}


/* =========================================================
   36. OPPONENT MOVEMENT
========================================================= */

function updateOpponents(
  delta
){

  opponents.forEach(
    (
      opponent,
      index
    ) => {

      /*
        Overtake animation.
      */

      opponent.relativeZ =
      THREE.MathUtils.lerp(

        opponent.relativeZ,

        opponent.targetRelativeZ,

        Math.min(
          1,

          delta *
          (
            opponent.boost > 0
            ?
            3.8
            :
            1.8
          )
        )

      );


      if(
        opponent.boost >
        0
      ){

        opponent.boost -=
        delta;

      }


      opponent.mesh.position.x =
      opponent.lane;


      opponent.mesh.position.z =

      player.position.z

      +

      opponent.relativeZ;


      /*
        Small suspension movement.
      */

      opponent.mesh.position.y =

      .02

      +

      Math.sin(

        performance.now() *
        .004

        +

        index

      )

      *
      .018;

    }
  );

}


/* =========================================================
   37. CAMERA
========================================================= */

function updateCamera(
  delta
){

  const wantedX =
  player.position.x;


  camera.position.x =
  THREE.MathUtils.lerp(

    camera.position.x,

    wantedX,

    Math.min(
      1,

      delta * 8
    )

  );


  camera.position.z =
  player.position.z +
  .05;


  /*
    Gentle road vibration.
  */

  const vibration =
  Math.sin(

    performance.now() *
    .009

  )
  *
  .009;


  let crashY =
  0;


  let crashRoll =
  0;


  if(
    shakeTimer >
    0
  ){

    shakeTimer -=
    delta;


    crashY =
    Math.sin(

      performance.now() *
      .08

    )
    *
    .045;


    crashRoll =
    Math.sin(

      performance.now() *
      .055

    )
    *
    .035;

  }


  camera.position.y =

  1.65

  +

  vibration

  +

  crashY;


  /*
    Camera lean when changing lane.
  */

  const laneDifference =

  PLAYER_LANES[
    selectedLane
  ]

  -

  player.position.x;


  const wantedRoll =

  -laneDifference *
  .013

  +

  crashRoll;


  camera.rotation.z =
  THREE.MathUtils.lerp(

    camera.rotation.z,

    wantedRoll,

    Math.min(
      1,

      delta * 6
    )

  );


  camera.lookAt(

    camera.position.x,

    1.35,

    player.position.z -
    38

  );


  /*
    Steering wheel turns.
  */

  if(
    steeringWheel
  ){

    steeringWheel.rotation.z =
    THREE.MathUtils.lerp(

      steeringWheel.rotation.z,

      laneDifference *
      -.12,

      Math.min(
        1,

        delta * 7
      )

    );

  }


  /*
    Dashboard speed needle.
  */

  if(
    dashboardSpeedNeedle
  ){

    dashboardSpeedNeedle.rotation.z =
    THREE.MathUtils.lerp(

      dashboardSpeedNeedle.rotation.z,

      -1.1

      +

      (
        currentSpeed /
        (
          MAX_SPEED *
          BOOST_MULTIPLIER
        )
      )

      *
      2.2,

      Math.min(
        1,

        delta * 4
      )

    );

  }


  /*
    FOV effect.
  */

  const desiredFov =

  boostTimer > 0
  ?
  67
  :
  60;


  const oldFov =
  camera.fov;


  camera.fov =
  THREE.MathUtils.lerp(

    camera.fov,

    desiredFov,

    Math.min(
      1,

      delta * 4
    )

  );


  /*
    Chỉ update projection nếu FOV thực sự thay đổi.
  */

  if(
    Math.abs(
      oldFov -
      camera.fov
    )
    >
    .01
  ){

    camera.updateProjectionMatrix();

  }

}


/* =========================================================
   38. SPEED
========================================================= */

function updateSpeed(
  delta
){

  elapsed +=
  delta;


  /*
    Game tăng tốc rất từ từ.
  */

  const normalSpeed =
  Math.min(

    MAX_SPEED,

    BASE_SPEED

    +

    elapsed *
    .018

  );


  if(
    boostTimer >
    0
  ){

    boostTimer -=
    delta;


    currentSpeed =
    THREE.MathUtils.lerp(

      currentSpeed,

      normalSpeed *
      BOOST_MULTIPLIER,

      Math.min(
        1,

        delta * 4
      )

    );


    speedEffect
    .classList
    .add(
      "active"
    );

  }

  else if(
    slowTimer >
    0
  ){

    slowTimer -=
    delta;


    currentSpeed =
    THREE.MathUtils.lerp(

      currentSpeed,

      normalSpeed *
      WRONG_SPEED_MULTIPLIER,

      Math.min(
        1,

        delta * 4
      )

    );


    speedEffect
    .classList
    .remove(
      "active"
    );

  }

  else{

    currentSpeed =
    THREE.MathUtils.lerp(

      currentSpeed,

      normalSpeed,

      Math.min(
        1,

        delta * 2
      )

    );


    speedEffect
    .classList
    .remove(
      "active"
    );

  }

}


/* =========================================================
   39. SCENERY RECYCLING
========================================================= */

function updateScenery(){

  roadsideObjects.forEach(
    object => {

      /*
        Object đã đi qua xe.
      */

      if(
        object.position.z >
        player.position.z +
        30
      ){

        object.position.z -=
        360;

      }

    }
  );

}


/* =========================================================
   40. GATE
========================================================= */

function updateGate(){

  if(
    !gateGroup
  ){

    return;

  }


  /*
    Cổng không di chuyển.

    Distance giảm vì PLAYER chạy tới.
  */

  const distance =

  player.position.z

  -

  gateGroup.position.z;


  if(

    !roundResolved

    &&

    distance <=
    COLLISION_DISTANCE

  ){

    resolveGate();

  }


  /*
    Xe đã qua biển.
  */

  if(

    roundResolved

    &&

    player.position.z <
    gateGroup.position.z -
    7

  ){

    /*
      Đủ 12 câu thì kết thúc.
    */

    if(
      questionCount >=
      TOTAL_QUESTIONS
    ){

      endGame();

      return;

    }


    createQuestion(
      false
    );

  }

}


/* =========================================================
   41. UPDATE HUD POSITION
========================================================= */

let hudTimer =
0;


function updateRealtimeHUD(
  delta
){

  /*
    Không cần sửa DOM 60 lần/giây.

    Chỉ 10 lần/giây để nhẹ hơn.
  */

  hudTimer +=
  delta;


  if(
    hudTimer <
    .1
  ){

    return;

  }


  hudTimer =
  0;


  updateHUD();

}


/* =========================================================
   42. GAME LOOP
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

    .04

  );


  if(
    gameRunning
  ){

    updateSpeed(
      delta
    );


    updatePlayer(
      delta
    );


    updateOpponents(
      delta
    );


    updateCamera(
      delta
    );


    updateScenery();


    updateGate();


    updateRealtimeHUD(
      delta
    );

  }


  renderer.render(

    scene,

    camera

  );

}


/* =========================================================
   43. RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =

    window.innerWidth

    /

    window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(

      window.innerWidth,

      window.innerHeight

    );


    renderer.setPixelRatio(

      Math.min(

        window.devicePixelRatio,

        1.25

      )

    );

  }
);


/* =========================================================
   44. INIT
========================================================= */

createWorld();


createCockpit();


resetOpponents();


updateHUD();


animate();
