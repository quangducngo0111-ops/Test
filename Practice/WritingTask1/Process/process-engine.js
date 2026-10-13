(()=>{
'use strict';

console.log('✅ PROCESS ENGINE V19.0 · STUDENT PLAN DRIVEN');
window.PROCESS_ENGINE_VERSION='V19.0';

const TASKS=window.PROCESS_TASKS||{};
const ID=String(window.PROCESS_TASK_ID||'01').padStart(2,'0');
const task=TASKS[ID];

if(!task){
  document.body.innerHTML=
    '<p style="padding:30px;font-family:sans-serif">Không tìm thấy dữ liệu bài Process.</p>';
  return;
}

const STUDENT_KEY='IELTS_PRACTICE_STUDENT';
const STORE_VERSION='V19';
const ENGINE_VERSION='V19.0';

const STEP_NAMES=[
  'Phân tích sơ đồ',
  'Introduction',
  'Overview',
  'Body Paragraph 1',
  'Body Paragraph 2',
  'Bài hoàn chỉnh'
];


/* =========================================================
   STAGE DATA
========================================================= */

const STAGES={

'01':[

  {
    terms:[
      'clay is dug',
      'clay is excavated',
      'clay is extracted',
      'dug from the ground',
      'excavated from the ground',
      'extracted from the ground',
      'digger',
      'excavator'
    ],

    ref:
      'Clay is first extracted from the ground using a digger.'
  },

  {
    terms:[
      'metal grid',
      'metal screen',
      'screened',
      'passed through a metal grid',
      'roller',
      'rollers',
      'conveyed by rollers',
      'conveyed over a roller',
      'moves over a roller',
      'passed over a roller'
    ],

    ref:
      'It is then passed through a metal grid and conveyed over a roller.'
  },

  {
    terms:[
      'sand and water',
      'water and sand',
      'mixed with sand',
      'mixed with water',
      'combined with sand',
      'mould',
      'mold',
      'wire cutter',
      'shaped into bricks',
      'formed into bricks',
      'moulded into bricks',
      'molded into bricks'
    ],

    ref:
      'Sand and water are added, and the resulting mixture is shaped into bricks using either a mould or a wire cutter.'
  },

  {
    terms:[
      'drying oven',
      'dried',
      'drying',
      '24-48 hours',
      '24 to 48 hours'
    ],

    ref:
      'The newly formed bricks are dried in an oven for 24–48 hours.'
  },

  {
    terms:[
      'kiln',
      'kilns',
      'heated',
      'fired',
      'moderate temperature',
      'high temperature',
      'higher temperature',
      '200°c',
      '980°c',
      '870°c',
      '1300°c'
    ],

    ref:
      'They are then fired in two kilns, first at a moderate temperature of 200–980°C and then at a higher temperature of 870–1300°C.'
  },

  {
    terms:[
      'cooling chamber',
      'cooled',
      'cooling',
      '48-72 hours',
      '48 to 72 hours'
    ],

    ref:
      'Afterwards, the bricks are cooled in a cooling chamber for 48–72 hours.'
  },

  {
    terms:[
      'packaged',
      'packaging',
      'packed',
      'delivered',
      'delivery',
      'being delivered',
      'transported to customers',
      'transported to consumers'
    ],

    ref:
      'Finally, the bricks are packaged and delivered.'
  }

],


'02':[

  {
    terms:[
      'storage silos',
      'storage silo',
      'flour is stored',
      'flour storage'
    ],

    ref:
      'Flour is stored in storage silos before entering the production line.'
  },

  {
    terms:[
      'mixer',
      'mixed with water and oil',
      'water and oil',
      'mixing'
    ],

    ref:
      'It is then mixed with water and oil in a mixer.'
  },

  {
    terms:[
      'dough sheets',
      'sheets of dough',
      'rolled into sheets',
      'rollers'
    ],

    ref:
      'The dough passes through rollers and is formed into dough sheets.'
  },

  {
    terms:[
      'dough strips',
      'strips of dough',
      'cut into strips'
    ],

    ref:
      'These sheets are cut into strips.'
  },

  {
    terms:[
      'noodle discs',
      'noodle disks',
      'shaped into discs',
      'formed into discs'
    ],

    ref:
      'The strips are then shaped into noodle discs.'
  },

  {
    terms:[
      'cooking in oil',
      'cooked in oil',
      'dried',
      'drying'
    ],

    ref:
      'The noodle discs are cooked in oil and dried.'
  },

  {
    terms:[
      'cups',
      'placed in cups',
      'put into cups',
      'vegetables and spices',
      'vegetables',
      'spices'
    ],

    ref:
      'They are placed into cups together with vegetables and spices.'
  },

  {
    terms:[
      'labelled',
      'labeled',
      'labelling',
      'labeling',
      'sealed',
      'sealing'
    ],

    ref:
      'Finally, the cups are sealed and labelled.'
  }

],


'03':[

  {
    terms:[
      'pick tomatoes',
      'picked',
      'harvested',
      'collected',
      'put in baskets',
      'placed in baskets'
    ],

    ref:
      'Ripe tomatoes are picked and placed in baskets.'
  },

  {
    terms:[
      'sort',
      'sorted',
      'good tomatoes',
      'bad tomatoes',
      'classified'
    ],

    ref:
      'The tomatoes are sorted so that unsuitable ones are removed.'
  },

  {
    terms:[
      'sent to factory',
      'transported to factory',
      'taken to factory',
      'processing factory'
    ],

    ref:
      'The selected tomatoes are transported to the factory.'
  },

  {
    terms:[
      'remove stalk',
      'stalk is removed',
      'remove seeds',
      'seeds are removed',
      'remove skin',
      'skin is removed',
      'stalk',
      'seeds',
      'skin'
    ],

    ref:
      'At the factory, their stalks, seeds and skins are removed.'
  },

  {
    terms:[
      'put into a container',
      'placed in a container',
      'put in a container'
    ],

    ref:
      'The prepared tomatoes are placed in a container.'
  },

  {
    terms:[
      'crushed',
      'crush',
      'crushing',
      'pulp',
      'crushed into pulp'
    ],

    ref:
      'They are then crushed into a pulp.'
  },

  {
    terms:[
      'sugar',
      'vinegar',
      'salt',
      'ingredients are added',
      'additives',
      'combined with ingredients'
    ],

    ref:
      'Sugar, vinegar and salt are added to the tomato mixture.'
  },

  {
    terms:[
      'boiled',
      'boiling',
      'boil'
    ],

    ref:
      'The mixture is boiled.'
  },

  {
    terms:[
      'left for two hours',
      'left for 2 hours',
      'left to stand for two hours',
      'left to stand for 2 hours',
      'two hours',
      '2 hours'
    ],

    ref:
      'It is then left to stand for two hours.'
  },

  {
    terms:[
      'poured into bottles',
      'filled into bottles',
      'bottled',
      'bottles are filled'
    ],

    ref:
      'The ketchup is poured into bottles.'
  },

  {
    terms:[
      'labelled',
      'labeled',
      'labelling',
      'labeling'
    ],

    ref:
      'The bottles are labelled.'
  },

  {
    terms:[
      'quality control',
      'quality checked',
      'checked',
      'inspected',
      'inspection'
    ],

    ref:
      'They then undergo quality control.'
  },

  {
    terms:[
      'packed',
      'packaged',
      'boxes',
      'packed into boxes'
    ],

    ref:
      'The checked bottles are packed into boxes.'
  },

  {
    terms:[
      'supermarket',
      'sent to supermarkets',
      'delivered to supermarkets',
      'transported to supermarkets'
    ],

    ref:
      'The packaged ketchup is transported to supermarkets.'
  },

  {
    terms:[
      'consumed',
      'consumption',
      'hamburger',
      'hamburgers',
      'fries',
      'served',
      'served with food',
      'served with foods',
      'eaten'
    ],

    ref:
      'Finally, the ketchup is ready to be served with food.'
  }

],


'04':[

  {
    terms:[
      'eggs',
      'frog eggs',
      'eggs are laid',
      'lays eggs'
    ],

    ref:
      'The cycle begins when adult frogs lay eggs.'
  },

  {
    terms:[
      'embryo',
      'embryos',
      'embryonic'
    ],

    ref:
      'Embryos develop inside the eggs.'
  },

  {
    terms:[
      'tadpoles clinging to water plants',
      'tadpoles cling to water plants',
      'water plants'
    ],

    ref:
      'The resulting tadpoles cling to water plants.'
  },

  {
    terms:[
      'external gills',
      'gills',
      'breathing'
    ],

    ref:
      'They develop external gills for breathing.'
  },

  {
    terms:[
      'tail keeps growing',
      'tail grows',
      'growing tail'
    ],

    ref:
      'As the tadpoles grow, their tails become longer.'
  },

  {
    terms:[
      'hindlegs appear',
      'hind legs appear',
      'hind legs',
      'back legs'
    ],

    ref:
      'Hind legs then begin to appear.'
  },

  {
    terms:[
      'food stored in the tail',
      'stored in the tail'
    ],

    ref:
      'At this stage, the tadpoles rely on food stored in their tails.'
  },

  {
    terms:[
      'front legs appear',
      'front legs'
    ],

    ref:
      'Front legs subsequently develop.'
  },

  {
    terms:[
      'tail becomes shorter',
      'tail shortens',
      'shorter tail'
    ],

    ref:
      'The tail then becomes shorter.'
  },

  {
    terms:[
      'young frog',
      'froglet'
    ],

    ref:
      'A young frog is formed.'
  },

  {
    terms:[
      'adult frog',
      'mature frog'
    ],

    ref:
      'Finally, it develops into an adult frog, allowing the cycle to continue.'
  }

],


'05':[

  {
    terms:[
      'female lays eggs',
      'females lay eggs',
      'eggs are laid',
      'one or two eggs',
      '1 or 2 eggs',
      'every three days'
    ],

    ref:
      'Female bees lay one or two eggs every three days.'
  },

  {
    terms:[
      'eggs hatch',
      'hatch after 9',
      '9-10 days',
      '9 to 10 days'
    ],

    ref:
      'The eggs hatch after about 9–10 days.'
  },

  {
    terms:[
      '5 days',
      'five days'
    ],

    ref:
      'The young bees then develop for a further five days.'
  },

  {
    terms:[
      'first moulting',
      'first molting',
      'first moult',
      'first molt'
    ],

    ref:
      'They undergo a first moulting stage.'
  },

  {
    terms:[
      '7 days',
      'seven days'
    ],

    ref:
      'After another seven days, further development takes place.'
  },

  {
    terms:[
      'second moulting',
      'second molting',
      'second moult',
      'second molt'
    ],

    ref:
      'A second moulting stage follows.'
  },

  {
    terms:[
      '9 days',
      'nine days'
    ],

    ref:
      'Nine days later, the bee continues to mature.'
  },

  {
    terms:[
      'young adult emerges',
      'young adult',
      'emerges'
    ],

    ref:
      'A young adult then emerges.'
  },

  {
    terms:[
      '4 days to maturity',
      'four days to maturity',
      'maturity',
      'mature bee'
    ],

    ref:
      'Finally, the young adult takes about four days to reach maturity.'
  }

],


'06':[

  {
    terms:[
      'recycling bin',
      'recycle bin',
      'placed in recycling bins',
      'put in recycling bins',
      'discarded'
    ],

    ref:
      'Used plastic bottles are placed in recycling bins.'
  },

  {
    terms:[
      'collection truck',
      'collected',
      'collection',
      'transported'
    ],

    ref:
      'They are collected and transported by truck.'
  },

  {
    terms:[
      'recycling centre',
      'recycling center',
      'sorting',
      'sorted'
    ],

    ref:
      'At a recycling centre, the bottles are sorted.'
  },

  {
    terms:[
      'compressed',
      'compressing',
      'compressed into blocks',
      'blocks'
    ],

    ref:
      'The selected bottles are compressed into blocks.'
  },

  {
    terms:[
      'crushed',
      'crushing',
      'washed',
      'washing',
      'crushing and washing'
    ],

    ref:
      'The plastic is then crushed and washed.'
  },

  {
    terms:[
      'plastic pellets',
      'pellets',
      'producing plastic pellets',
      'made into pellets'
    ],

    ref:
      'Next, it is processed into plastic pellets.'
  },

  {
    terms:[
      'heated',
      'heating pellets',
      'pellets are heated'
    ],

    ref:
      'The pellets are heated to form raw material.'
  },

  {
    terms:[
      'raw material',
      'formed into raw material',
      'plastic raw material'
    ],

    ref:
      'This raw material is prepared for manufacturing.'
  },

  {
    terms:[
      'end products',
      'new products',
      'producing end products',
      'recycled products'
    ],

    ref:
      'Finally, it is used to produce new end products.'
  }

]

};


/* =========================================================
   BRICKS MODEL
========================================================= */

const BRICKS_BODY1_MODEL=
  'In the initial stages, clay is excavated and processed before being shaped into bricks. '
  +'The clay is first extracted from the ground using an excavator before being screened through a metal grid. '
  +'The filtered clay is then conveyed by a set of rotating rollers, after which it is combined with sand and water '
  +'and shaped into bricks using either a mould or a wire cutter, in preparation for the subsequent stages.';


/* =========================================================
   HELPERS
========================================================= */

const NUM={
  one:1,
  two:2,
  three:3,
  four:4,
  five:5,
  six:6,
  seven:7,
  eight:8,
  nine:9,
  ten:10,
  eleven:11,
  twelve:12,
  thirteen:13,
  fourteen:14,
  fifteen:15,
  sixteen:16,
  seventeen:17,
  eighteen:18,
  nineteen:19,
  twenty:20,

  mot:1,
  hai:2,
  ba:3,
  bon:4,
  nam:5,
  sau:6,
  bay:7,
  tam:8,
  chin:9,
  muoi:10,

  'một':1,
  'bốn':4,
  'năm':5,
  'sáu':6,
  'bảy':7,
  'tám':8,
  'chín':9,
  'mười':10
};


const TYPO={
  manufactoring:'manufacturing',
  prodution:'production',
  proccess:'process',
  temparature:'temperature',
  temprature:'temperature',
  delievered:'delivered',
  deliverd:'delivered',
  packeged:'packaged',
  recyled:'recycled',
  continer:'container',
  vegtables:'vegetables',
  tranported:'transported',
  excuvator:'excavator',
  celcius:'Celsius',
  drie:'dried',
  dryed:'dried',
  heted:'heated',
  colled:'cooled',
  mouldd:'moulded',
  mixxed:'mixed',
  crushd:'crushed',
  packd:'packed',
  storeed:'stored',
  rolld:'rolled',
  cookd:'cooked',
  sortted:'sorted',
  filld:'filled',
  recyling:'recycling'
};


function norm(v){

  return String(v||'')

    .toLowerCase()

    .normalize('NFD')

    .replace(
      /[\u0300-\u036f]/g,
      ''
    )

    .replace(
      /đ/g,
      'd'
    )

    .replace(
      /[’‘]/g,
      "'"
    )

    .replace(
      /[^a-z0-9°%–—'\s-]/g,
      ' '
    )

    .replace(
      /\s+/g,
      ' '
    )

    .trim();

}


function esc(v){

  return String(v??'')

    .replace(
      /[&<>"']/g,
      c=>({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#39;'
      }[c])
    );

}


function words(v){

  const s=
    String(v||'')
    .trim();

  return s
    ?
    s.split(/\s+/)
      .filter(Boolean)
      .length
    :
    0;

}


function uniq(a){

  return[
    ...new Set(
      (a||[])
      .filter(Boolean)
    )
  ];

}


function containsAny(
  text,
  arr=[]
){

  const n=
    norm(text);

  return arr.some(
    x=>
      n.includes(
        norm(x)
      )
  );

}


function paragraphs(text){

  return String(text||'')

    .replace(
      /\r\n?/g,
      '\n'
    )

    .trim()

    .split(/\n+/)

    .map(
      x=>x.trim()
    )

    .filter(Boolean);

}


function stageList(){

  return STAGES[ID]
    ||
    [];

}


function stagePos(
  text,
  stage
){

  let best=-1;

  for(
    const x
    of
    stage?.terms||[]
  ){

    const p=
      (
        ' '
        +
        norm(text)
        +
        ' '
      )
      .indexOf(
        ' '
        +
        norm(x)
        +
        ' '
      );


    if(
      p>=0
      &&
      (
        best<0
        ||
        p<best
      )
    ){

      best=p;

    }

  }


  return best;

}


function stageHits(text){

  return stageList()
    .map(
      s=>
        stagePos(
          text,
          s
        )>=0
    );

}


function numberValue(v){

  let s=
    norm(v)

    .replace(
      /\b(main )?stages?\b/g,
      ''
    )

    .replace(
      /\bgiai doan\b/g,
      ''
    )

    .replace(
      /\bco\b/g,
      ''
    )

    .trim();


  if(
    /^\d+$/.test(s)
  ){

    return +s;

  }


  if(
    NUM[s]!=null
  ){

    return NUM[s];

  }


  for(
    const [k,n]
    of
    Object.entries(NUM)
  ){

    if(
      (
        ' '
        +
        s
        +
        ' '
      )
      .includes(
        ' '
        +
        norm(k)
        +
        ' '
      )
    ){

      return n;

    }

  }


  const m=
    s.match(
      /\b\d+\b/
    );


  return m
    ?
    +m[0]
    :
    null;

}


function parseRange(v){

  const s=
    norm(v)

    .replace(
      /[–—]/g,
      '-'
    )

    .replace(
      /\bstages?\b/g,
      ''
    )

    .trim();


  let m=
    s.match(
      /\b(\d+)\s*-\s*(\d+)\b/
    )

    ||

    s.match(
      /\b(?:from\s+)?(\d+)\s+to\s+(\d+)\b/
    );


  if(m){

    const a=+m[1];
    const b=+m[2];

    return{
      valid:true,
      start:
        Math.min(
          a,
          b
        ),
      end:
        Math.max(
          a,
          b
        )
    };

  }


  if(
    /^\d+$/.test(s)
  ){

    const n=+s;

    return{
      valid:true,
      start:n,
      end:n
    };

  }


  return{
    valid:false,
    start:null,
    end:null
  };

}


function topicRule(){

  return({

    '01':{
      need:[
        'brick',
        'bricks'
      ],
      bad:[
        'noodle',
        'ketchup',
        'frog',
        'bee',
        'plastic bottle'
      ],
      label:'bricks'
    },

    '02':{
      need:[
        'noodle',
        'noodles',
        'instant noodles'
      ],
      bad:[
        'brick',
        'ketchup',
        'frog',
        'bee',
        'plastic bottle'
      ],
      label:'instant noodles'
    },

    '03':{
      need:[
        'ketchup',
        'tomato ketchup'
      ],
      bad:[
        'brick',
        'noodle',
        'frog',
        'bee',
        'plastic bottle'
      ],
      label:'tomato ketchup'
    },

    '04':{
      need:[
        'frog',
        'frogs'
      ],
      bad:[
        'brick',
        'noodle',
        'ketchup',
        'bee',
        'plastic bottle'
      ],
      label:'frog life cycle'
    },

    '05':{
      need:[
        'bee',
        'bees'
      ],
      bad:[
        'brick',
        'noodle',
        'ketchup',
        'frog',
        'plastic bottle'
      ],
      label:'bee life cycle'
    },

    '06':{
      need:[
        'plastic',
        'plastic bottle',
        'plastic bottles',
        'recycling'
      ],
      bad:[
        'brick',
        'noodle',
        'ketchup',
        'frog',
        'bee'
      ],
      label:'plastic bottles'
    }

  })[ID]

  ||

  {
    need:[],
    bad:[],
    label:''
  };

}


function topicCheck(text){

  const r=
    topicRule();


  return{

    ok:
      !r.need.length
      ||
      r.need.some(
        x=>
          containsAny(
            text,
            [x]
          )
      ),

    wrong:
      r.bad.filter(
        x=>
          containsAny(
            text,
            [x]
          )
      ),

    label:
      r.label

  };

}


/* =========================================================
   STORAGE
========================================================= */

function studentScope(){

  try{

    const s=
      JSON.parse(
        localStorage.getItem(
          STUDENT_KEY
        )
        ||
        'null'
      );


    if(
      s?.name
    ){

      return encodeURIComponent(
        (
          s.name
          +
          '|'
          +
          (s.className||'')
        )
        .toLowerCase()
      );

    }

  }catch(e){}


  return 'guest';

}


const STORAGE_KEY=
  `WT1_PROCESS_GUIDED_${STORE_VERSION}_${studentScope()}::${ID}`;


let state={

  engineVersion:
    ENGINE_VERSION,

  current:0,

  completed:[],

  attempts:{},

  templateOpen:{
    1:true,
    2:true,
    3:true,
    4:true
  },

  drafts:{
    analysis:{},
    intro:'',
    overview:'',
    body1:'',
    body2:'',
    full:''
  },

  scores:{}

};


function load(){

  try{

    const s=
      JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        )
        ||
        'null'
      );


    if(s){

      state={

        ...state,

        ...s,

        templateOpen:{
          ...state.templateOpen,
          ...(s.templateOpen||{})
        },

        drafts:{
          ...state.drafts,
          ...(s.drafts||{}),

          analysis:{
            ...state.drafts.analysis,
            ...(s.drafts?.analysis||{})
          }
        }

      };


      if(
        s.engineVersion
        !==
        ENGINE_VERSION
      ){

        state.scores={};
        state.engineVersion=
          ENGINE_VERSION;

      }

    }

  }catch(e){}

}


function save(){

  state.engineVersion=
    ENGINE_VERSION;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

}


function done(i){

  return state.completed.includes(i);

}


function attempts(i){

  return +(state.attempts[i]||0);

}


function complete(i){

  if(
    !done(i)
  ){

    state.completed.push(i);

  }


  state.completed=
    uniq(
      state.completed
    )
    .sort(
      (a,b)=>a-b
    );


  save();

}


function invalidate(i){

  state.completed=
    state.completed.filter(
      x=>x<i
    );


  for(
    let j=i+1;
    j<6;
    j++
  ){

    delete state.scores[j];

  }


  if(
    state.current>i
  ){

    state.current=i;

  }


  save();

}


function unlock(){

  let u=0;


  for(
    let i=0;
    i<6;
    i++
  ){

    if(
      done(i)
    ){

      u=i+1;

    }else{

      break;

    }

  }


  return Math.min(
    5,
    u
  );

}


function key(i){

  return[
    'analysis',
    'intro',
    'overview',
    'body1',
    'body2',
    'full'
  ][i];

}


function val(id){

  return document.getElementById(id)
    ?.value
    ||
    '';

}


function saveDraft(){

  if(
    state.current===0
  ){

    state.drafts.analysis={

      type:
        val('aType'),

      stages:
        val('aStages'),

      first:
        val('aFirst'),

      last:
        val('aLast'),

      features:
        val('aFeatures'),

      body1:
        val('aBody1'),

      body2:
        val('aBody2')

    };

  }else{

    const b=
      document.getElementById(
        'writeBox'
      );


    if(b){

      state.drafts[
        key(
          state.current
        )
      ]=
        b.value;

    }

  }


  save();

}


/* =========================================================
   LANGUAGE CHECK
========================================================= */

function seriousLanguage(
  text,
  {
    note=false
  }={}
){

  const s=
    String(text||'');

  const out=[];


  for(
    const w
    of
    (
      s
      .toLowerCase()
      .match(/[a-z]+/g)
      ||
      []
    )
  ){

    if(
      TYPO[w]
    ){

      out.push(
        `Có thể sai chính tả: “${w}” → “${TYPO[w]}”.`
      );

    }

  }


  if(
    /\brip\s+tomatoes?\b/i
    .test(s)
  ){

    out.push(
      'Dùng “ripe tomatoes”, không dùng “rip tomatoes”.'
    );

  }


  if(
    /\ba\s+(?:moderate|high(?:er)?)[-\s]+temperature\s+kilns\b/i
    .test(s)
  ){

    out.push(
      'Dùng “a moderate-temperature kiln” hoặc “moderate-temperature kilns”, không dùng “a ... kilns”.'
    );

  }


  if(
    /\bbricks\s+is\b/i
    .test(s)
  ){

    out.push(
      '“bricks” là số nhiều, dùng “are”.'
    );

  }


  if(
    /\btomatoes\s+is\b/i
    .test(s)
  ){

    out.push(
      '“tomatoes” là số nhiều, dùng “are”.'
    );

  }


  if(
    /\beggs\s+is\b/i
    .test(s)
  ){

    out.push(
      '“eggs” là số nhiều, dùng “are”.'
    );

  }


  if(
    /\bclay\s+are\b/i
    .test(s)
  ){

    out.push(
      '“clay” đi với “is”.'
    );

  }


  if(
    /\b(?:a|an)\s+(?:bricks|bottles|noodles|tomatoes|eggs|pellets|stages|products)\b/i
    .test(s)
  ){

    out.push(
      '“a/an” không đứng trực tiếp trước danh từ số nhiều.'
    );

  }


  if(
    /\bbegins?\s+with\b[^.!?]{0,180}\bto\s+ends?\s+with\b/i
    .test(s)
  ){

    out.push(
      'Dùng “begins with ... and ends with ...”, không dùng “begins with ... to ends with ...”.'
    );

  }


  if(
    /\bbetween\s+[^,.!?;]{0,40}\s+to\s+[^,.!?;]{0,40}/i
    .test(s)
  ){

    out.push(
      'Dùng “between X and Y”, không dùng “between X to Y”.'
    );

  }


  if(
    ID==='01'
    &&
    (
      /\brollers?\b[^.!?]{0,50}\b(?:crush(?:es|ed|ing)?|grind(?:s|ing)?|break(?:s|ing)?\s+down)\b/i
      .test(s)

      ||

      /\bclay\b[^.!?]{0,70}\b(?:crushed|ground\s+(?:down|up)|broken\s+down)\b/i
      .test(s)
    )
  ){

    out.push(
      'Không mô tả roller là công đoạn nghiền clay. Theo sơ đồ, clay được sàng qua metal grid rồi chuyển qua roller(s).'
    );

  }


  if(
    !note
  ){

    if(
      s.trim()
      &&
      !/^[A-Z0-9]/.test(
        s.trim()
      )
    ){

      out.push(
        'Cần viết hoa chữ cái đầu.'
      );

    }


    if(
      s.trim()
      &&
      !/[.!?]$/.test(
        s.trim()
      )
    ){

      out.push(
        'Nên kết thúc bằng dấu câu.'
      );

    }

  }


  return uniq(out);

}


function factualIssues(text){

  const s=
    String(text||'');

  const out=[];


  if(
    [
      '01',
      '02',
      '03',
      '06'
    ]
    .includes(ID)

    &&

    /\b(?:cyclical|cyclic)\b/i
    .test(s)
  ){

    out.push(
      'Đây là linear process, không phải cyclical process.'
    );

  }


  if(
    [
      '04',
      '05'
    ]
    .includes(ID)

    &&

    /\blinear(?:\s+process|\s+sequence)?\b/i
    .test(s)
  ){

    out.push(
      'Đây là life cycle/cyclical process, không phải linear process.'
    );

  }


  if(
    ID==='03'
    &&
    /\b(?:cool|cooled|cooling)\b[^.!?]{0,50}\b(?:two|2)\s+hours?\b/i
    .test(s)
  ){

    out.push(
      'Sơ đồ chỉ cho biết hỗn hợp được để trong 2 giờ; nên viết “left to stand for two hours”.'
    );

  }


  return uniq(out);

}


/* =========================================================
   TEMPLATES
========================================================= */

function processKind(){

  const t=
    norm(
      state.drafts.analysis.type
      ||
      task.type
      ||
      ''
    );


  return t.includes('life')
    ?
    'life'
    :
    t.includes('cyc')
    ?
    'cyclical'
    :
    'linear';

}


const TPL={

  linear:{

    intro:
      'The diagram illustrates the stages involved in the production of __________.',

    overview:
      'Overall, the procedure follows a linear, ______-stage sequence that begins with __________ being __________ and ends with __________ being __________. During these stages, __________ is/are __________ before __________ is/are __________.',

    body1:
      'In the initial stages, __________. __________ is/are __________, where __________. Once __________ has/have been __________, __________ before being __________.',

    body2:
      'The remaining stages deal with __________. __________ and subsequently __________. After this stage has been completed, __________ before __________, completing the process.'

  },


  life:{

    intro:
      'The diagram illustrates the different stages in the life cycle of __________.',

    overview:
      'Overall, the life cycle consists of ______ main stages, beginning with __________ and progressing through different stages of development before __________ reaches maturity and produces __________, beginning a new cycle.',

    body1:
      'In the initial stages of the cycle, __________ develops into __________. As it grows, __________ before becoming __________.',

    body2:
      'In the later stages of the cycle, __________ develops into __________ before reaching __________. At this point, __________ produces/gives rise to __________, which marks the beginning of a new cycle.'

  },


  cyclical:{

    intro:
      'The diagram illustrates the stages involved in __________.',

    overview:
      'Overall, the procedure follows a cyclical sequence that begins with __________ and progresses through __________ before returning to __________.',

    body1:
      'In the initial stages, __________. Following this, __________. Once __________, __________.',

    body2:
      'In the later stages, __________. Following this, __________ before returning to __________.'

  }

};


function template(i){

  const l=
    TPL[
      processKind()
    ]
    ||
    TPL.linear;


  return({

    1:l.intro,

    2:l.overview,

    3:l.body1,

    4:l.body2

  })[i]
  ||
  '';

}


function templateCard(i){

  if(
    i<1
    ||
    i>4
  ){

    return '';

  }


  const open=
    state.templateOpen[i]
    !==
    false;


  return`

<div class="template-card">

  <div class="template-head">

    <div>

      <span class="template-badge">
        TEMPLATE HỖ TRỢ
      </span>

      <b>
        ${
          [
            '',
            'Introduction',
            'Overview',
            'Body 1',
            'Body 2'
          ][i]
        }
      </b>

    </div>

    <button
      type="button"
      class="template-toggle"
      id="templateToggle"
    >
      ${
        open
        ?
        'Ẩn template'
        :
        'Xem template'
      }
    </button>

  </div>

  <div
    class="template-body"
    id="templateBody"
    ${
      open
      ?
      ''
      :
      'hidden'
    }
  >

    <div class="template-text">
      ${esc(
        template(i)
      )}
    </div>

    <div class="template-note">
      Em có thể dùng khung này nhưng không cần chép nguyên văn.
    </div>

  </div>

</div>

  `;

}


function independentCard(){

  return`

<div class="independent-card">

  <b>
    ✍️ Bước tự viết — không còn template
  </b>

  <p>
    Ở Bước 6, hãy nhìn sơ đồ và tự viết lại toàn bộ bài gồm
    Introduction, Overview, Body 1 và Body 2.
  </p>

</div>

  `;

}


/* =========================================================
   STUDENT PLAN
========================================================= */

function plan(step){

  if(
    step!==3
    &&
    step!==4
  ){

    return null;

  }


  const r=
    parseRange(
      step===3
      ?
      state.drafts.analysis.body1
      :
      state.drafts.analysis.body2
    );


  const total=
    stageList().length;


  if(
    !r.valid
    ||
    r.start<1
    ||
    r.end>total
  ){

    return null;

  }


  return{

    ...r,

    label:
      `stage ${r.start}–${r.end}`,

    stages:
      Array.from(
        {
          length:
            r.end-r.start+1
        },
        (_,i)=>
          r.start+i
      )

  };

}


function planCoverage(
  text,
  p
){

  if(!p){

    return{
      ratio:0,
      covered:0,
      total:0,
      missing:[]
    };

  }


  const rows=
    p.stages.map(
      n=>({
        n,
        ok:
          stagePos(
            text,
            stageList()[n-1]
          )>=0
      })
    );


  return{

    ratio:
      rows.filter(
        x=>x.ok
      ).length
      /
      rows.length,

    covered:
      rows.filter(
        x=>x.ok
      ).length,

    total:
      rows.length,

    missing:
      rows.filter(
        x=>!x.ok
      )
      .map(
        x=>x.n
      )

  };

}


function outsideStages(
  text,
  p
){

  if(!p){

    return[];

  }


  return stageList()

    .map(
      (
        s,
        i
      )=>({
        n:i+1,
        p:
          stagePos(
            text,
            s
          )
      })
    )

    .filter(
      x=>
        x.p>=0
        &&
        !p.stages.includes(
          x.n
        )
    )

    .map(
      x=>x.n
    );

}


function detailText(
  text,
  p
){

  const sentences=
    String(text||'')

    .replace(
      /\s+/g,
      ' '
    )

    .trim()

    .split(
      /(?<=[.!?])\s+/
    )

    .filter(Boolean);


  if(
    !p
    ||
    sentences.length<2
  ){

    return String(text||'');

  }


  const topic=
    /\b(?:initial stages?|remaining stages?|later stages?|these stages?|the process|the procedure)\b/i
    .test(
      sentences[0]
    )

    ||

    /\b(?:consist(?:s)? of|deal(?:s)? with|involv(?:e|es)|followed by|include(?:s)?)\b/i
    .test(
      sentences[0]
    );


  const first=
    p.stages.filter(
      n=>
        stagePos(
          sentences[0],
          stageList()[n-1]
        )>=0
    )
    .length;


  const rest=
    sentences
    .slice(1)
    .join(' ');


  const restN=
    p.stages.filter(
      n=>
        stagePos(
          rest,
          stageList()[n-1]
        )>=0
    )
    .length;


  return(
    (
      topic
      &&
      restN>=2
    )

    ||

    (
      first>=2
      &&
      restN>=2
    )
  )
  ?
  rest
  :
  String(text||'');

}


function sequencePlan(
  text,
  p
){

  if(!p){

    return{
      ok:true,
      issues:[]
    };

  }


  const s=
    detailText(
      text,
      p
    );


  const found=
    p.stages

    .map(
      n=>({
        n,
        pos:
          stagePos(
            s,
            stageList()[n-1]
          )
      })
    )

    .filter(
      x=>x.pos>=0
    )

    .sort(
      (a,b)=>
        a.pos-b.pos
    );


  const issues=[];


  for(
    let i=1;
    i<found.length;
    i++
  ){

    if(
      found[i].n
      <
      found[i-1].n
    ){

      issues.push(
        `Stage ${found[i].n} đang được trình bày trước stage ${found[i-1].n}.`
      );

    }

  }


  return{
    ok:
      !issues.length,
    issues
  };

}


function dynamicRef(step){

  const p=
    plan(step);


  if(!p){

    return null;

  }


  if(
    ID==='01'
    &&
    step===3
    &&
    p.start===1
    &&
    p.end===3
  ){

    return BRICKS_BODY1_MODEL;

  }


  return p.stages

    .map(
      n=>
        stageList()[n-1]
        ?.ref
    )

    .filter(Boolean)

    .join(' ');

}


/* =========================================================
   STEP 1
========================================================= */

function assessAnalysis(){

  const a=
    state.drafts.analysis;


  const total=
    stageList().length;


  const typeOK=
    containsAny(
      a.type,
      task.analysis?.type
      ||
      [
        task.type
      ]
    );


  const count=
    numberValue(
      a.stages
    );


  const stageOK=
    count
    ===
    Number(
      task.stages
      ||
      total
    );


  const firstOK=
    stagePos(
      a.first,
      stageList()[0]
    )>=0

    ||

    containsAny(
      a.first,
      task.analysis?.first
      ||
      []
    );


  const lastOK=
    stagePos(
      a.last,
      stageList()[total-1]
    )>=0

    ||

    containsAny(
      a.last,
      task.analysis?.last
      ||
      []
    );


  const featureHits=
    stageHits(
      a.features
    )
    .filter(Boolean)
    .length;


  const featLang=
    seriousLanguage(
      a.features
    );


  const featuresOK=
    featureHits
    >=
    Math.min(
      3,
      total
    )

    &&

    !featLang.length;


  const b1=
    parseRange(
      a.body1
    );


  const b2=
    parseRange(
      a.body2
    );


  const body1OK=
    b1.valid
    &&
    b1.start>=1
    &&
    b1.end<=total;


  const body2OK=
    b2.valid
    &&
    b2.start>=1
    &&
    b2.end<=total
    &&
    body1OK
    &&
    b1.end<b2.start;


  return{


    type:{

      ok:
        typeOK,

      hint:
        typeOK
        ?
        'Đúng dạng process.'
        :
        'Hãy quan sát xem quá trình đi theo một chiều hay tạo thành vòng lặp.'

    },


    stages:{

      ok:
        stageOK,

      hint:
        stageOK
        ?
        'Đúng số main stages.'
        :
        'Chưa đúng. Hãy quan sát và đếm lại các main stages.'

    },


    first:{

      ok:
        firstOK
        &&
        !seriousLanguage(
          a.first,
          {
            note:true
          }
        ).length,

      hint:
        firstOK
        ?
        'Đúng công đoạn bắt đầu. Ở Bước 1 không bắt buộc viết hoa/dấu chấm.'
        :
        'Chưa đúng công đoạn bắt đầu.'

    },


    last:{

      ok:
        lastOK
        &&
        !seriousLanguage(
          a.last,
          {
            note:true
          }
        ).length,

      hint:
        lastOK
        ?
        'Đúng công đoạn cuối. Ở Bước 1 không bắt buộc viết hoa/dấu chấm.'
        :
        'Chưa đúng công đoạn cuối.'

    },


    features:{

      ok:
        featuresOK,

      hint:
        featuresOK
        ?
        'Đạt. Em đã nêu được các công đoạn/đặc điểm nổi bật.'
        :
        featLang[0]
        ||
        'Nên nêu ít nhất khoảng 3 công đoạn/đặc điểm nổi bật.'

    },


    body1:{

      ok:
        body1OK,

      hint:
        body1OK
        ?
        'Đạt. Đây là phạm vi stage hợp lệ cho Body 1.'
        :
        'Chưa hợp lý. Hãy nhập phạm vi stage em muốn dùng cho Body 1.'

    },


    body2:{

      ok:
        body2OK,

      hint:
        body2OK
        ?
        'Đạt. Body 2 tiếp nối Body 1 và không chồng stage.'
        :
        'Body 2 cần tiếp nối Body 1 và không chồng stage.'

    }


  };

}


/* =========================================================
   GRADING
========================================================= */

function gradeIntro(text){

  const wc=
    words(text);


  const t=
    topicCheck(text);


  const lang=
    seriousLanguage(text);


  const framing=
    /\b(?:diagram|figure|illustration)\b/i
    .test(text);


  const verb=
    /\b(?:illustrates?|shows?|depicts?|presents?|demonstrates?)\b/i
    .test(text);


  const process=
    /\b(?:process|stages|production|manufactur|recycl|life cycle)\w*/i
    .test(text);


  const pTopic=
    t.ok
    &&
    !t.wrong.length
    ?
    40
    :
    0;


  const pFrame=
    framing
    ?
    10
    :
    0;


  const pVerb=
    verb
    ?
    10
    :
    0;


  const pProcess=
    process
    ?
    10
    :
    0;


  const pLength=
    wc>=8
    ?
    10
    :
    Math.round(
      wc/8*10
    );


  const pGrammar=
    Math.max(
      0,
      20-lang.length*7
    );


  let score=
    pTopic
    +
    pFrame
    +
    pVerb
    +
    pProcess
    +
    pLength
    +
    pGrammar;


  const issues=[];


  if(
    !t.ok
    ||
    t.wrong.length
  ){

    issues.push(
      `Đối tượng chính phải là ${t.label}.`
    );

  }


  if(
    !framing
  ){

    issues.push(
      'Chưa thể hiện rõ đây là diagram/figure.'
    );

  }


  if(
    !verb
  ){

    issues.push(
      'Nên dùng illustrates/shows/depicts.'
    );

  }


  if(
    !process
  ){

    issues.push(
      'Chưa thể hiện rõ process/life cycle.'
    );

  }


  lang.forEach(
    x=>
      issues.push(
        'Ngữ pháp/chính tả: '
        +
        x
      )
  );


  return{

    total:
      Math.min(
        100,
        score
      ),

    completed:
      t.ok
      &&
      !t.wrong.length
      &&
      framing
      &&
      verb
      &&
      process
      &&
      wc>=8
      &&
      !lang.length,

    issues,

    breakdown:[

      {
        label:'Đúng đối tượng',
        score:pTopic,
        max:40
      },

      {
        label:'Dạng + động từ mô tả',
        score:
          pFrame+pVerb,
        max:20
      },

      {
        label:'Thể hiện process',
        score:pProcess,
        max:10
      },

      {
        label:'Độ dài',
        score:pLength,
        max:10,
        note:
          `${wc} từ`
      },

      {
        label:'Ngữ pháp & chính tả',
        score:pGrammar,
        max:20
      }

    ]

  };

}


function gradeOverview(text){

  const wc=
    words(text);


  const t=
    topicCheck(text);


  const lang=
    seriousLanguage(text);


  const facts=
    factualIssues(text);


  const marker=
    /\boverall\b|\bin general\b|\bgenerally\b/i
    .test(text);


  const first=
    stagePos(
      text,
      stageList()[0]
    )>=0;


  const last=
    stagePos(
      text,
      stageList().at(-1)
    )>=0;


  const claim=
    text.match(
      /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|\d+)\s*(?:main\s+)?stages?\b/i
    );


  const countOK=
    !claim
    ||
    numberValue(
      claim[1]
    )
    ===
    Number(
      task.stages
      ||
      stageList().length
    );


  const hits=
    stageHits(text)
    .filter(Boolean)
    .length;


  const ratio=
    hits
    /
    stageList().length;


  const bad=
    /\bbegins?\s+with\b[^.!?]{0,180}\bto\s+ends?\s+with\b/i
    .test(text);


  const issues=[];


  if(
    !marker
  ){

    issues.push(
      'Chưa có dấu hiệu mở Overview rõ ràng.'
    );

  }


  if(
    !first
  ){

    issues.push(
      'Chưa thể hiện rõ điểm bắt đầu.'
    );

  }


  if(
    !last
  ){

    issues.push(
      'Chưa thể hiện rõ điểm kết thúc.'
    );

  }


  if(
    !countOK
  ){

    issues.push(
      'Số giai đoạn nêu trong Overview chưa đúng.'
    );

  }


  if(
    ratio<.35
  ){

    issues.push(
      'Overview chưa khái quát đủ đặc điểm chính.'
    );

  }


  lang.forEach(
    x=>
      issues.push(
        'Ngữ pháp/chính tả: '
        +
        x
      )
  );


  facts.forEach(
    x=>
      issues.push(
        'Nội dung: '
        +
        x
      )
  );


  const pTopic=
    t.wrong.length
    ?
    0
    :
    10;


  const pMarker=
    marker
    ?
    10
    :
    0;


  const pEndpoints=
    (
      first
      ?
      15
      :
      0
    )
    +
    (
      last
      ?
      15
      :
      0
    );


  const pCount=
    countOK
    ?
    10
    :
    0;


  const pSummary=
    Math.round(
      Math.min(
        1,
        ratio/.55
      )
      *
      15
    );


  const pLength=
    wc>=20
    ?
    5
    :
    Math.round(
      wc/20*5
    );


  const pGrammar=
    Math.max(
      0,
      20-lang.length*6
    );


  let score=
    pTopic
    +
    pMarker
    +
    pEndpoints
    +
    pCount
    +
    pSummary
    +
    pLength
    +
    pGrammar;


  if(
    bad
    ||
    facts.length
  ){

    score=
      Math.min(
        score,
        79
      );

  }


  return{

    total:
      Math.max(
        0,
        Math.min(
          100,
          score
        )
      ),

    completed:
      !t.wrong.length
      &&
      marker
      &&
      first
      &&
      last
      &&
      countOK
      &&
      ratio>=.35
      &&
      wc>=20
      &&
      !lang.length
      &&
      !facts.length
      &&
      !bad,

    issues,

    breakdown:[

      {
        label:'Chủ đề',
        score:pTopic,
        max:10
      },

      {
        label:'Dấu hiệu Overview',
        score:pMarker,
        max:10
      },

      {
        label:'Điểm đầu + cuối',
        score:pEndpoints,
        max:30
      },

      {
        label:'Số giai đoạn',
        score:pCount,
        max:10
      },

      {
        label:'Khái quát',
        score:pSummary,
        max:15,
        note:
          `${Math.round(ratio*100)}%`
      },

      {
        label:'Ngữ pháp',
        score:pGrammar,
        max:20
      }

    ]

  };

}


function gradeBody(
  step,
  text
){

  const p=
    plan(step);


  const wc=
    words(text);


  const cov=
    planCoverage(
      text,
      p
    );


  const seq=
    sequencePlan(
      text,
      p
    );


  const outside=
    outsideStages(
      text,
      p
    );


  const lang=
    seriousLanguage(text);


  const facts=
    factualIssues(text);


  const cfg=
    task[
      key(step)
    ]
    ||
    {};


  const min=
    Number(
      cfg.minWords
    )
    ||
    40;


  const connector=
    !cfg.sequence?.length
    ||
    containsAny(
      text,
      cfg.sequence
    );


  const issues=[];


  if(!p){

    issues.push(
      'Hệ thống chưa đọc được phạm vi Body đã chọn ở Bước 1.'
    );

  }


  if(
    p
    &&
    cov.missing.length
  ){

    issues.push(
      `Theo cách chia em đã chọn (${p.label}), còn thiếu hoặc chưa rõ stage: ${cov.missing.join(', ')}.`
    );

  }


  if(
    outside.length>=2
  ){

    issues.push(
      `Đoạn này đang triển khai khá nhiều stage ngoài phạm vi ${p?.label}: ${outside.join(', ')}.`
    );

  }


  seq.issues.forEach(
    x=>
      issues.push(
        'Thứ tự stage: '
        +
        x
      )
  );


  if(
    wc<min
  ){

    issues.push(
      `Đoạn có ${wc} từ; mục tiêu khoảng ${min}+ từ.`
    );

  }


  if(
    !connector
  ){

    issues.push(
      'Nên dùng từ/cụm nối để thể hiện trình tự rõ hơn.'
    );

  }


  lang.forEach(
    x=>
      issues.push(
        'Ngữ pháp/chính tả: '
        +
        x
      )
  );


  facts.forEach(
    x=>
      issues.push(
        'Nội dung/số liệu: '
        +
        x
      )
  );


  const content=
    Math.round(
      (
        p
        ?
        cov.ratio
        :
        0
      )
      *
      55
    );


  const length=
    wc>=min
    ?
    12
    :
    Math.round(
      Math.min(
        1,
        wc/min
      )
      *
      12
    );


  const sequence=
    connector
    &&
    seq.ok
    ?
    8
    :
    4;


  const grammar=
    Math.max(
      0,
      10-lang.length*4
    );


  const planPoints=
    !p
    ?
    0
    :
    outside.length<=1
    ?
    5
    :
    Math.max(
      0,
      5-(outside.length-1)*2
    );


  const templatePoints=10;


  let score=
    content
    +
    length
    +
    sequence
    +
    grammar
    +
    planPoints
    +
    templatePoints;


  if(
    facts.length
  ){

    score=
      Math.min(
        score,
        74
      );

  }


  if(
    lang.length>=2
  ){

    score=
      Math.min(
        score,
        79
      );

  }


  if(
    p
    &&
    cov.ratio<.6
  ){

    score=
      Math.min(
        score,
        79
      );

  }


  return{

    total:
      Math.max(
        0,
        Math.min(
          100,
          score
        )
      ),

    completed:
      !!p
      &&
      cov.ratio>=.75
      &&
      wc>=Math.round(
        min*.8
      )
      &&
      connector
      &&
      seq.ok
      &&
      outside.length<=1
      &&
      !lang.length
      &&
      !facts.length,

    issues,

    reference:
      dynamicRef(step),

    breakdown:[

      {
        label:
          p
          ?
          `Nội dung theo ${p.label}`
          :
          'Nội dung',

        score:content,

        max:55,

        note:
          p
          ?
          `${cov.covered}/${cov.total} stage`
          :
          ''
      },

      {
        label:'Độ dài',
        score:length,
        max:12,
        note:`${wc} từ`
      },

      {
        label:'Trình tự',
        score:sequence,
        max:8,
        note:
          seq.ok
          ?
          'Đúng'
          :
          'Cần sửa'
      },

      {
        label:'Ngữ pháp & chính tả',
        score:grammar,
        max:10,
        note:
          lang.length
          ?
          `${lang.length} lỗi`
          :
          'Ổn'
      },

      {
        label:'Bám cách chia Bước 1',
        score:planPoints,
        max:5,
        note:
          p
          ?
          `Phạm vi ${p.label}`
          :
          'Chưa đọc được plan'
      },

      {
        label:'Vận dụng template',
        score:templatePoints,
        max:10,
        note:
          'Không yêu cầu chép nguyên văn'
      }

    ]

  };

}


function gradeFull(text){

  const wc=
    words(text);


  const ps=
    paragraphs(text);


  const t=
    topicCheck(text);


  const lang=
    seriousLanguage(text);


  const facts=
    factualIssues(text);


  const hits=
    stageHits(text);


  const ratio=
    hits.filter(Boolean).length
    /
    hits.length;


  const overview=
    ps.find(
      x=>
        /\boverall\b|\bin general\b|\bgenerally\b/i
        .test(x)
    );


  const issues=[];


  if(
    !t.ok
    ||
    t.wrong.length
  ){

    issues.push(
      `Đối tượng chính phải là ${t.label}.`
    );

  }


  if(
    wc<150
  ){

    issues.push(
      `Bài hiện có ${wc} từ; nên có ít nhất 150 từ.`
    );

  }


  if(
    !overview
  ){

    issues.push(
      'Chưa thấy Overview rõ ràng.'
    );

  }


  if(
    ps.length<4
  ){

    issues.push(
      `Hệ thống nhận ${ps.length} đoạn. Chỉ cần Enter 1 lần để sang đoạn mới.`
    );

  }


  if(
    ratio<.72
  ){

    issues.push(
      'Bài vẫn còn thiếu một số stage quan trọng.'
    );

  }


  lang.forEach(
    x=>
      issues.push(
        'Ngữ pháp/chính tả: '
        +
        x
      )
  );


  facts.forEach(
    x=>
      issues.push(
        'Nội dung: '
        +
        x
      )
  );


  const pContent=
    Math.round(
      ratio*55
    );


  const pLength=
    wc>=150
    ?
    20
    :
    Math.round(
      wc/150*20
    );


  const pOverview=
    overview
    ?
    10
    :
    0;


  const pParagraph=
    ps.length>=4
    ?
    8
    :
    Math.round(
      ps.length/4*8
    );


  const pGrammar=
    Math.max(
      0,
      7-lang.length*3
    );


  let score=
    pContent
    +
    pLength
    +
    pOverview
    +
    pParagraph
    +
    pGrammar;


  if(
    !t.ok
    ||
    t.wrong.length
  ){

    score=
      Math.min(
        score,
        49
      );

  }


  if(
    facts.length
    ||
    lang.length>=2
  ){

    score=
      Math.min(
        score,
        79
      );

  }


  return{

    total:
      Math.max(
        0,
        Math.min(
          100,
          score
        )
      ),

    completed:
      t.ok
      &&
      !t.wrong.length
      &&
      wc>=150
      &&
      overview
      &&
      ps.length>=4
      &&
      ratio>=.72
      &&
      !lang.length
      &&
      !facts.length,

    issues,

    breakdown:[

      {
        label:'Nội dung & stages',
        score:pContent,
        max:55,
        note:
          `${Math.round(ratio*100)}%`
      },

      {
        label:'Độ dài',
        score:pLength,
        max:20,
        note:
          `${wc} từ`
      },

      {
        label:'Overview',
        score:pOverview,
        max:10
      },

      {
        label:'Cấu trúc đoạn',
        score:pParagraph,
        max:8,
        note:
          `${ps.length} đoạn`
      },

      {
        label:'Ngữ pháp & chính tả',
        score:pGrammar,
        max:7
      }

    ]

  };

}


function grade(
  step,
  text
){

  if(
    step===1
  ){

    return gradeIntro(text);

  }


  if(
    step===2
  ){

    return gradeOverview(text);

  }


  if(
    step===3
    ||
    step===4
  ){

    return gradeBody(
      step,
      text
    );

  }


  return gradeFull(text);

}


/* =========================================================
   STYLE
========================================================= */

const CSS=`

:root{
  --p:#281260;
  --v:#7358e7;
  --ink:#202636;
  --muted:#6f7890;
  --line:#e1e5ee;
  --bg:#f5f7fb;
  --good:#16845b;
  --goodbg:#f1fbf6;
  --bad:#b83345;
  --badbg:#fff6f7;
  --warnbg:#fff9ed;
}

*{
  box-sizing:border-box;
}

html,
body{
  margin:0;
  min-height:100%;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    "Segoe UI",
    Arial,
    sans-serif;
  color:var(--ink);
  background:var(--bg);
}

button,
input,
textarea,
select{
  font:inherit;
}

button{
  cursor:pointer;
}

.top{
  position:sticky;
  top:0;
  z-index:30;
  background:
    linear-gradient(
      100deg,
      #1c0e49,
      #281260,
      #38217f
    );
  color:#fff;
}

.topin,
.page{
  width:min(
    1440px,
    calc(100% - 18px)
  );
  margin:auto;
}

.topin{
  min-height:62px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
}

.left{
  display:flex;
  align-items:center;
  gap:10px;
}

.back{
  color:#fff;
  text-decoration:none;
  border:1px solid #ffffff40;
  padding:7px 10px;
  border-radius:9px;
  font-size:11px;
  font-weight:900;
}

.brand{
  font-weight:950;
}

.student{
  font-size:10px;
  background:#ffffff15;
  border:1px solid #ffffff30;
  padding:7px 10px;
  border-radius:999px;
}

.page{
  padding:16px 0 46px;
}

.hero{
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  gap:18px;
  margin-bottom:12px;
}

.hero h1{
  margin:0;
  color:#21164b;
  font-size:28px;
}

.hero p{
  margin:4px 0 0;
  color:var(--muted);
  font-size:11px;
}

.progresswrap{
  min-width:300px;
}

.prow{
  display:flex;
  justify-content:space-between;
  color:var(--muted);
  font-size:10px;
  font-weight:850;
  margin-bottom:5px;
}

.progress{
  height:7px;
  background:#e5e8ef;
  border-radius:999px;
  overflow:hidden;
}

.progress i{
  display:block;
  height:100%;
  background:
    linear-gradient(
      90deg,
      #5d43b0,
      #2f6fdf
    );
}

.layout{
  display:grid;
  grid-template-columns:420px 1fr;
  gap:12px;
  align-items:start;
}

.leftcol{
  display:grid;
  gap:12px;
  position:sticky;
  top:74px;
}

.diagram,
.steps,
.main{
  background:#fff;
  border:1px solid var(--line);
  border-radius:17px;
  box-shadow:
    0 8px 24px
    #23194b0a;
}

.diagram{
  padding:14px;
}

.diagramtop,
.ey,
.writehead,
.scorebar{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
}

.diagramtop{
  margin-bottom:10px;
}

.pill,
.chip{
  font-size:9px;
  font-weight:900;
  color:#6246bd;
  background:#f0ecff;
  padding:6px 8px;
  border-radius:999px;
}

.imgwrap{
  position:relative;
  border:1px solid #e4e7ef;
  border-radius:12px;
  overflow:hidden;
}

.imgwrap img{
  width:100%;
  display:block;
}

.zoom{
  position:absolute;
  right:8px;
  bottom:8px;
  border:1px solid #dddff0;
  background:#fffffff0;
  color:#4f3d8b;
  border-radius:9px;
  padding:7px 9px;
  font-size:9.5px;
  font-weight:900;
}

.prompt{
  margin-top:10px;
  padding:11px;
  border-radius:11px;
  background:#f7f5ff;
  border:1px solid #e3def9;
  font-size:10.5px;
  line-height:1.5;
}

.steps{
  padding:12px;
  display:grid;
  gap:7px;
}

.stepbtn{
  width:100%;
  border:1px solid var(--line);
  background:#fff;
  border-radius:11px;
  padding:9px;
  text-align:left;
  display:grid;
  grid-template-columns:34px 1fr;
  gap:9px;
  align-items:center;
}

.stepbtn .n{
  width:30px;
  height:30px;
  border-radius:8px;
  background:#eee9ff;
  color:#4b318e;
  display:grid;
  place-items:center;
  font-size:10px;
  font-weight:950;
}

.stepbtn strong{
  display:block;
  font-size:10.8px;
}

.stepbtn small{
  display:block;
  margin-top:2px;
  color:#8a91a0;
  font-size:9px;
}

.stepbtn.active{
  border-color:#8269e8;
  box-shadow:
    0 0 0 3px
    #7559e812;
}

.stepbtn.done{
  background:#f6fcf8;
  border-color:#b9e3cb;
}

.stepbtn.done .n{
  background:#dff3e8;
  color:#15764f;
}

.stepbtn.locked{
  opacity:.48;
}

.main{
  min-height:650px;
  padding:20px 22px;
}

.ey{
  margin-bottom:12px;
}

.counter,
.wc{
  font-size:10px;
  color:var(--muted);
  font-weight:850;
}

.main h2{
  margin:0 0 5px;
  color:#21164b;
  font-size:22px;
}

.sub{
  margin:0 0 14px;
  color:var(--muted);
  font-size:10.8px;
}

.guide{
  padding:12px 13px;
  border:1px solid #ded8f4;
  border-radius:12px;
  background:#fafaff;
  margin-bottom:12px;
  font-size:10.5px;
  line-height:1.55;
}

.guide b{
  color:#4b318e;
}

.template-card{
  border:1px solid #d9d0ff;
  border-radius:14px;
  background:#faf8ff;
  margin-bottom:14px;
  overflow:hidden;
}

.template-head{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:12px 13px;
}

.template-badge{
  font-size:8.5px;
  font-weight:950;
  color:#674dc1;
  background:#eee8ff;
  padding:5px 7px;
  border-radius:999px;
  margin-right:8px;
}

.template-toggle{
  border:1px solid #d6cef5;
  background:#fff;
  color:#523b9f;
  border-radius:8px;
  padding:6px 9px;
  font-size:9px;
  font-weight:900;
}

.template-body{
  padding:0 13px 13px;
}

.template-text{
  padding:12px;
  border:1px dashed #bdb0ef;
  background:#fff;
  border-radius:10px;
  color:#362768;
  font-size:11.5px;
  font-weight:750;
  line-height:1.65;
}

.template-note{
  margin-top:7px;
  color:#737b8e;
  font-size:9.5px;
}

.independent-card{
  margin-bottom:14px;
  padding:13px;
  border:1px solid #f0cf9c;
  background:#fff9ef;
  border-radius:13px;
  font-size:10.5px;
}

.independent-card p{
  margin:5px 0 0;
}

.formgrid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:11px;
}

.field{
  border:1px solid var(--line);
  border-radius:11px;
  padding:10px;
}

.field label{
  display:block;
  font-size:10px;
  font-weight:900;
  margin-bottom:6px;
}

.field input,
.field select,
.field textarea{
  width:100%;
  border:1px solid #cfd4df;
  border-radius:8px;
  padding:9px;
  outline:none;
  background:#fff;
  font-size:11px;
}

.field textarea{
  min-height:76px;
  resize:vertical;
}

.inline-feedback{
  display:none;
}

.inline-feedback.show{
  display:block;
  margin-top:8px;
  padding:8px 9px;
  border-radius:8px;
  font-size:9.7px;
}

.inline-feedback.pass{
  color:#126b49;
  background:var(--goodbg);
  border:1px solid #bde5ce;
}

.inline-feedback.fail{
  color:#9d3142;
  background:var(--badbg);
  border:1px solid #efc8ce;
}

.inline-state{
  font-weight:950;
  margin-bottom:2px;
}

.write{
  width:100%;
  min-height:205px;
  resize:vertical;
  border:1px solid #cbd2df;
  border-radius:12px;
  padding:13px;
  outline:none;
  font-size:12.5px;
  line-height:1.7;
}

.write.full{
  min-height:400px;
}

.writehead{
  margin:8px 0 7px;
  font-size:10.5px;
  font-weight:900;
}

.actions{
  display:grid;
  grid-template-columns:140px 1fr 140px;
  gap:8px;
  margin-top:11px;
}

.btn{
  border:1px solid #dcdfe7;
  background:#fff;
  color:#40345f;
  border-radius:10px;
  padding:10px 12px;
  font-size:10.5px;
  font-weight:950;
}

.btn.primary{
  border:0;
  background:
    linear-gradient(
      100deg,
      var(--p),
      var(--v)
    );
  color:#fff;
}

.btn:disabled{
  opacity:.4;
}

.feedback{
  margin-top:12px;
  display:none;
}

.feedback.show{
  display:block;
}

.scorebar{
  padding:12px 13px;
  border:1px solid var(--line);
  border-radius:12px;
}

.score{
  font-size:24px;
  font-weight:950;
  color:#21164b;
}

.status{
  font-size:10.5px;
  font-weight:900;
}

.good{
  color:var(--good);
}

.warn{
  color:#9b6b16;
}

.bad{
  color:var(--bad);
}

.detail,
.reference{
  margin-top:8px;
  padding:11px 12px;
  border-radius:11px;
  font-size:10.5px;
  line-height:1.55;
}

.detail{
  border:1px solid #eadfc3;
  background:var(--warnbg);
}

.detail.goodbox{
  border-color:#bde5ce;
  background:var(--goodbg);
}

.detail.badbox{
  border-color:#efc8ce;
  background:var(--badbg);
}

.reference{
  border:1px solid #ded7fb;
  background:#f6f4ff;
}

.reference b{
  color:#4b318e;
}

.reference-answer{
  margin-top:6px;
  color:#2d3150;
}

.finaldone{
  padding:20px;
  text-align:center;
  border:1px solid #bde5ce;
  background:var(--goodbg);
  border-radius:14px;
  margin-top:10px;
}

dialog{
  width:min(980px,96vw);
  max-height:92vh;
  border:0;
  border-radius:15px;
  padding:0;
}

dialog::backdrop{
  background:#0c0820b3;
}

.modalhead{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:10px 12px;
  border-bottom:1px solid var(--line);
}

.modalimg{
  max-width:100%;
  display:block;
  margin:auto;
}

@media(max-width:1050px){

  .layout{
    grid-template-columns:1fr;
  }

  .leftcol{
    position:static;
  }

  .steps{
    grid-template-columns:
      repeat(3,1fr);
  }

}

@media(max-width:650px){

  .student{
    display:none;
  }

  .hero{
    flex-direction:column;
    align-items:stretch;
  }

  .progresswrap{
    min-width:0;
  }

  .steps,
  .formgrid,
  .actions{
    grid-template-columns:1fr;
  }

  .main{
    padding:16px;
  }

}

`;


/* =========================================================
   UI
========================================================= */

function mount(){

  document.head.insertAdjacentHTML(
    'beforeend',
    `<style>${CSS}</style>`
  );


  document.body.innerHTML=`

<header class="top">

  <div class="topin">

    <div class="left">

      <a
        class="back"
        href="../"
      >
        ← Process
      </a>

      <div class="brand">
        ${task.icon||'✍️'}
        ${esc(task.title)}
      </div>

    </div>

    <div
      id="studentInfo"
      class="student"
    ></div>

  </div>

</header>


<main class="page">

  <section class="hero">

    <div>

      <h1>
        ${esc(task.title)}
      </h1>

      <p>
        Bước 2–5 được dùng template · Bước 6 tự viết hoàn chỉnh.
      </p>

    </div>

    <div class="progresswrap">

      <div class="prow">

        <span>
          Tiến độ
        </span>

        <span id="progressText"></span>

      </div>

      <div class="progress">
        <i id="progressBar"></i>
      </div>

    </div>

  </section>


  <div class="layout">

    <aside class="leftcol">

      <section class="diagram">

        <div class="diagramtop">

          <b>
            Sơ đồ Process
          </b>

          <span class="pill">
            Quan sát · phân tích
          </span>

        </div>

        <div class="imgwrap">

          <img
            src="../assets/${esc(task.image)}"
            alt="${esc(task.title)}"
          >

          <button
            id="zoomBtn"
            class="zoom"
            type="button"
          >
            Phóng to sơ đồ ⤢
          </button>

        </div>

        <div class="prompt">

          <b>
            Đề bài:
          </b>

          ${esc(task.prompt)}

        </div>

      </section>


      <section
        id="stepNav"
        class="steps"
      ></section>

    </aside>


    <section
      id="main"
      class="main"
    ></section>

  </div>

</main>


<dialog id="imgDialog">

  <div class="modalhead">

    <b>
      ${esc(task.title)}
    </b>

    <button id="closeDialog">
      Đóng ✕
    </button>

  </div>

  <img
    class="modalimg"
    src="../assets/${esc(task.image)}"
    alt="${esc(task.title)}"
  >

</dialog>

  `;


  try{

    const s=
      JSON.parse(
        localStorage.getItem(
          STUDENT_KEY
        )
        ||
        'null'
      );


    if(
      s?.name
    ){

      document.getElementById(
        'studentInfo'
      )
      .textContent=
        s.name
        +
        (
          s.className
          ?
          ' · '
          +
          s.className
          :
          ''
        );

    }

  }catch(e){}


  document.getElementById(
    'zoomBtn'
  )
  .onclick=
    ()=>
      document.getElementById(
        'imgDialog'
      )
      .showModal();


  document.getElementById(
    'closeDialog'
  )
  .onclick=
    ()=>
      document.getElementById(
        'imgDialog'
      )
      .close();

}


function renderNav(){

  const u=
    unlock();


  const nav=
    document.getElementById(
      'stepNav'
    );


  nav.innerHTML=
    STEP_NAMES

    .map(
      (
        name,
        i
      )=>`

<button
  class="
    stepbtn
    ${
      i===state.current
      ?
      'active'
      :
      ''
    }
    ${
      done(i)
      ?
      'done'
      :
      ''
    }
    ${
      i>u
      ?
      'locked'
      :
      ''
    }
  "
  ${
    i>u
    ?
    'disabled'
    :
    ''
  }
  data-step="${i}"
>

  <span class="n">
    ${i+1}
  </span>

  <span>

    <strong>
      ${name}
    </strong>

    <small>
      ${
        done(i)
        ?
        '✓ Hoàn thành'
        :
        i>u
        ?
        'Chưa mở'
        :
        'Đang học'
      }
    </small>

  </span>

</button>

      `
    )

    .join('');


  nav
  .querySelectorAll(
    '[data-step]'
  )
  .forEach(
    b=>{

      b.onclick=
        ()=>{

          const i=
            +b.dataset.step;


          if(
            i<=unlock()
          ){

            saveDraft();

            state.current=i;

            save();

            render();

          }

        };

    }
  );

}


function renderProgress(){

  const c=
    state.completed.length;


  document.getElementById(
    'progressText'
  )
  .textContent=
    `${c}/6 bước hoàn thành`;


  document.getElementById(
    'progressBar'
  )
  .style.width=
    `${c/6*100}%`;

}


function guide(i){

  return[

    '<b>Mục tiêu:</b> Nhận diện loại process, số giai đoạn, điểm đầu–cuối, đặc điểm nổi bật và tự chọn cách chia Body 1/Body 2 hợp lý.',

    '<b>Mục tiêu:</b> Dùng template để paraphrase đề bài trong 1 câu.',

    '<b>Mục tiêu:</b> Viết Overview gồm cấu trúc chung và đặc điểm nổi bật.',

    '<b>Mục tiêu:</b> Viết Body 1 đúng các stage em đã chọn ở Bước 1.',

    '<b>Mục tiêu:</b> Viết Body 2 đúng các stage em đã chọn ở Bước 1.',

    '<b>Mục tiêu:</b> Tự viết toàn bộ bài, không dùng template.'

  ][i];

}


function setInline(
  id,
  a
){

  const el=
    document.getElementById(id);


  const holder=
    el
    ?.parentElement
    ?.querySelector(
      '.inline-feedback'
    );


  if(!holder){

    return;

  }


  holder.className=
    'inline-feedback show '
    +
    (
      a.ok
      ?
      'pass'
      :
      'fail'
    );


  holder.innerHTML=`

<div class="inline-state">
  ${
    a.ok
    ?
    '✓ Đạt'
    :
    '✕ Chưa đạt'
  }
</div>

<div>
  ${esc(a.hint)}
</div>

  `;

}


/* =========================================================
   STEP 1 UI
========================================================= */

function renderAnalysis(){

  const d=
    state.drafts.analysis
    ||
    {};


  const main=
    document.getElementById(
      'main'
    );


  main.innerHTML=`

<div class="ey">

  <span class="chip">
    BƯỚC 1
  </span>

  <span class="counter">
    Phân tích trước khi viết
  </span>

</div>


<h2>
  Phân tích sơ đồ
</h2>


<p class="sub">
  Kết quả Đạt / Chưa đạt và gợi ý sẽ hiện ngay dưới từng mục.
</p>


<div class="guide">
  ${guide(0)}
</div>


<div class="formgrid">


  <div class="field">

    <label>
      Process thuộc dạng nào?
    </label>

    <select id="aType">

      <option value="">
        — Chọn —
      </option>

      <option>
        Linear
      </option>

      <option>
        Cyclical
      </option>

      <option>
        Life Cycle
      </option>

    </select>

    <div class="inline-feedback"></div>

  </div>


  <div class="field">

    <label>
      Có bao nhiêu main stages?
    </label>

    <input
      id="aStages"
      placeholder="Nhập số giai đoạn em xác định"
    >

    <div class="inline-feedback"></div>

  </div>


  <div class="field">

    <label>
      First stage là gì?
    </label>

    <textarea
      id="aFirst"
      placeholder="Nhập công đoạn bắt đầu"
    ></textarea>

    <div class="inline-feedback"></div>

  </div>


  <div class="field">

    <label>
      Last / return stage là gì?
    </label>

    <textarea
      id="aLast"
      placeholder="Nhập công đoạn cuối / quay lại"
    ></textarea>

    <div class="inline-feedback"></div>

  </div>


  <div
    class="field"
    style="grid-column:1/-1"
  >

    <label>
      Important features là gì?
    </label>

    <textarea
      id="aFeatures"
      placeholder="Nêu các đặc điểm/công đoạn nổi bật..."
    ></textarea>

    <div class="inline-feedback"></div>

  </div>


  <div class="field">

    <label>
      Em chọn Body 1 gồm những stage nào?
    </label>

    <textarea
      id="aBody1"
      placeholder="Nhập nhóm stage em chọn cho Body 1"
    ></textarea>

    <div class="inline-feedback"></div>

  </div>


  <div class="field">

    <label>
      Em chọn Body 2 gồm những stage nào?
    </label>

    <textarea
      id="aBody2"
      placeholder="Nhập nhóm stage em chọn cho Body 2"
    ></textarea>

    <div class="inline-feedback"></div>

  </div>


</div>


<div class="actions">

  <button
    class="btn"
    disabled
  >
    ← Bước trước
  </button>

  <button
    id="checkBtn"
    class="btn primary"
  >
    Kiểm tra Bước 1 ✓
  </button>

  <button
    id="nextBtn"
    class="btn"
    ${
      done(0)
      ?
      ''
      :
      'disabled'
    }
  >
    Bước tiếp →
  </button>

</div>


<div
  id="feedback"
  class="feedback"
></div>

  `;


  for(
    const [id,k]
    of
    Object.entries({

      aType:'type',

      aStages:'stages',

      aFirst:'first',

      aLast:'last',

      aFeatures:'features',

      aBody1:'body1',

      aBody2:'body2'

    })
  ){

    document.getElementById(id).value=
      d[k]
      ||
      '';

  }


  main
  .querySelectorAll(
    'input,textarea,select'
  )
  .forEach(
    el=>
      el.addEventListener(
        'input',
        saveDraft
      )
  );


  document.getElementById(
    'checkBtn'
  )
  .onclick=
    checkAnalysis;


  document.getElementById(
    'nextBtn'
  )
  .onclick=
    ()=>go(1);


  if(
    state.scores[0]
  ){

    showAnalysis(
      state.scores[0]
    );

  }

}


function checkAnalysis(){

  saveDraft();


  state.attempts[0]=
    attempts(0)+1;


  const a=
    assessAnalysis();


  const arr=[
    a.type,
    a.stages,
    a.first,
    a.last,
    a.features,
    a.body1,
    a.body2
  ];


  const n=
    arr.filter(
      x=>x.ok
    )
    .length;


  const result={

    assessments:a,

    total:
      Math.round(
        n/7*100
      ),

    completed:
      n===7,

    passed:n

  };


  state.scores[0]=
    result;


  if(
    result.completed
  ){

    complete(0);

  }else{

    invalidate(0);

  }


  save();


  showAnalysis(
    result
  );


  renderNav();

  renderProgress();


  document.getElementById(
    'nextBtn'
  )
  .disabled=
    !done(0);

}


function showAnalysis(r){

  const a=
    r.assessments
    ||
    assessAnalysis();


  for(
    const [id,k]
    of
    Object.entries({

      aType:'type',

      aStages:'stages',

      aFirst:'first',

      aLast:'last',

      aFeatures:'features',

      aBody1:'body1',

      aBody2:'body2'

    })
  ){

    setInline(
      id,
      a[k]
    );

  }


  const f=
    document.getElementById(
      'feedback'
    );


  f.className=
    'feedback show';


  f.innerHTML=`

<div class="scorebar">

  <div>

    <div class="score">
      ${r.total}/100
    </div>

    <div
      class="
        status
        ${
          r.completed
          ?
          'good'
          :
          'warn'
        }
      "
    >
      ${
        r.completed
        ?
        '✓ Hoàn thành Bước 1'
        :
        'Xem các mục Chưa đạt phía trên'
      }
    </div>

  </div>

  <div class="counter">

    Đạt
    ${
      r.passed
      ??
      Object.values(a)
      .filter(
        x=>x.ok
      )
      .length
    }/7 mục

  </div>

</div>

  `;

}


/* =========================================================
   WRITING UI
========================================================= */

function renderWriting(i){

  const full=
    i===5;


  const main=
    document.getElementById(
      'main'
    );


  const draft=
    state.drafts[
      key(i)
    ]
    ||
    '';


  main.innerHTML=`

<div class="ey">

  <span class="chip">
    BƯỚC ${i+1}
  </span>

  <span class="counter">
    ${STEP_NAMES[i]}
  </span>

</div>


<h2>
  ${STEP_NAMES[i]}
</h2>


<p class="sub">

  ${
    full
    ?
    'Viết lại toàn bộ bài từ đầu. Chỉ dùng sơ đồ bên trái.'
    :
    'Viết phần này dựa trên sơ đồ, kết quả phân tích và template hỗ trợ.'
  }

</p>


<div class="guide">
  ${guide(i)}
</div>


${
  full
  ?
  independentCard()
  :
  templateCard(i)
}


<div class="writehead">

  <span>
    Bài viết của em
  </span>

  <span
    id="wordCount"
    class="wc"
  >
    0 từ
  </span>

</div>


<textarea
  id="writeBox"
  class="
    write
    ${
      full
      ?
      'full'
      :
      ''
    }
  "
  placeholder="${
    full
    ?
    'Tự viết bài hoàn chỉnh tại đây...'
    :
    'Viết '
    +
    STEP_NAMES[i]
    +
    ' tại đây...'
  }"
>${esc(draft)}</textarea>


<div class="actions">

  <button
    id="prevBtn"
    class="btn"
  >
    ← Bước trước
  </button>

  <button
    id="checkBtn"
    class="btn primary"
  >
    Kiểm tra & chữa Bước ${i+1} ✓
  </button>

  <button
    id="nextBtn"
    class="btn"
    ${
      done(i)
      &&
      i<5
      ?
      ''
      :
      'disabled'
    }
  >
    ${
      i===5
      ?
      'Hoàn tất'
      :
      'Bước tiếp →'
    }
  </button>

</div>


<div
  id="feedback"
  class="feedback"
></div>


<div id="finalDone"></div>

  `;


  if(
    i>=1
    &&
    i<=4
  ){

    const toggle=
      document.getElementById(
        'templateToggle'
      );


    if(toggle){

      toggle.onclick=
        ()=>{

          state.templateOpen[i]=
            !state.templateOpen[i];


          save();


          document.getElementById(
            'templateBody'
          )
          .hidden=
            !state.templateOpen[i];


          toggle.textContent=
            state.templateOpen[i]
            ?
            'Ẩn template'
            :
            'Xem template';

        };

    }

  }


  const box=
    document.getElementById(
      'writeBox'
    );


  const wc=
    document.getElementById(
      'wordCount'
    );


  const update=
    ()=>{

      wc.textContent=
        `${words(box.value)} từ`;

    };


  update();


  box.oninput=
    ()=>{

      state.drafts[
        key(i)
      ]=
        box.value;


      save();

      update();

    };


  document.getElementById(
    'prevBtn'
  )
  .onclick=
    ()=>go(
      i-1
    );


  document.getElementById(
    'checkBtn'
  )
  .onclick=
    ()=>checkWriting(i);


  document.getElementById(
    'nextBtn'
  )
  .onclick=
    ()=>{

      if(
        i<5
      ){

        go(
          i+1
        );

      }

    };


  if(
    state.scores[i]
  ){

    showWriting(
      i,
      state.scores[i]
    );

  }

}


function checkWriting(i){

  saveDraft();


  state.attempts[i]=
    attempts(i)+1;


  const result=
    grade(
      i,
      state.drafts[
        key(i)
      ]
      ||
      ''
    );


  state.scores[i]=
    result;


  if(
    result.completed
  ){

    complete(i);

  }else{

    invalidate(i);

  }


  save();


  showWriting(
    i,
    result
  );


  renderNav();

  renderProgress();


  const next=
    document.getElementById(
      'nextBtn'
    );


  if(
    next
    &&
    i<5
  ){

    next.disabled=
      !done(i);

  }

}


function showWriting(
  i,
  r
){

  const f=
    document.getElementById(
      'feedback'
    );


  f.className=
    'feedback show';


  const studentPlan=
    (
      i===3
      ||
      i===4
    )
    ?
    plan(i)
    :
    null;


  const reference=
    (
      i===3
      ||
      i===4
    )
    ?
    (
      r.reference
      ||
      dynamicRef(i)
    )
    :
    (
      task[
        key(i)
      ]
      ?.reference
      ||
      null
    );


  const showRef=
    i<5
    &&
    !r.completed
    &&
    attempts(i)>=2;


  const breakdown=
    (
      r.breakdown
      ||
      []
    )
    .map(
      x=>`

<li>

  <b>
    ${esc(x.label)}:
    ${x.score}/${x.max}
  </b>

  ${
    x.note
    ?
    ' — '
    +
    esc(x.note)
    :
    ''
  }

</li>

      `
    )
    .join('');


  const issues=
    (
      r.issues
      ||
      []
    )
    .map(
      x=>`
<li>
  ${esc(x)}
</li>
      `
    )
    .join('');


  f.innerHTML=`

<div class="scorebar">

  <div>

    <div class="score">
      ${r.total}/100
    </div>

    <div
      class="
        status
        ${
          r.completed
          ?
          'good'
          :
          r.total>=70
          ?
          'warn'
          :
          'bad'
        }
      "
    >

      ${
        r.completed
        ?
        '✓ Hoàn thành bước này'
        :
        r.total>=70
        ?
        'Gần đạt — sửa thêm'
        :
        'Cần chỉnh lại'
      }

    </div>

  </div>

  <div class="counter">
    Lần kiểm tra:
    ${attempts(i)}
  </div>

</div>


${
  breakdown
  ?
  `

<div class="detail">

  <b>
    Vì sao được ${r.total}/100?
  </b>

  <ul>
    ${breakdown}
  </ul>

</div>

  `
  :
  ''
}


<div
  class="
    detail
    ${
      r.completed
      ?
      'goodbox'
      :
      r.total<60
      ?
      'badbox'
      :
      ''
    }
  "
>

  <b>
    ${
      r.completed
      ?
      'Phần này đạt yêu cầu.'
      :
      'Cần sửa:'
    }
  </b>

  ${
    issues
    ?
    `
<ul>
  ${issues}
</ul>
    `
    :
    ' Nội dung, cấu trúc và trình tự chính phù hợp.'
  }

</div>


${
  showRef
  &&
  reference
  ?
  `

<div class="reference">

  <b>

    ${
      studentPlan
      ?
      `Bài mẫu theo cách chia em đã chọn (${studentPlan.label}):`
      :
      'Bài tham khảo:'
    }

  </b>

  <div
    class="reference-answer notranslate"
    translate="no"
    lang="en"
  >
    ${esc(reference)}
  </div>

</div>

  `
  :
  ''
}

  `;


  if(
    i===5
    &&
    r.completed
  ){

    document.getElementById(
      'finalDone'
    )
    .innerHTML=`

<div class="finaldone">

  <h3>
    🎉 Hoàn thành
    ${esc(task.title)}
  </h3>

  <p>
    Em đã tự viết và hoàn thành đủ 6 bước.
  </p>

</div>

    `;

  }

}


/* =========================================================
   NAVIGATION
========================================================= */

function go(i){

  saveDraft();


  if(
    i<0
    ||
    i>unlock()
  ){

    return;

  }


  state.current=i;

  save();

  render();


  window.scrollTo({
    top:0,
    behavior:'smooth'
  });

}


function render(){

  renderNav();

  renderProgress();


  if(
    state.current===0
  ){

    renderAnalysis();

  }else{

    renderWriting(
      state.current
    );

  }

}


/* =========================================================
   START
========================================================= */
/* =========================================================
V18.6 HOTFIX · FULL ESSAY ACCURACY
Paste block này ngay trước phần START hoặc ngay trước dòng load();
========================================================= */

/* 1) Không nhầm gerund/danh từ như "processing, packaging and delivery"
      thành động từ bị động cần đổi sang V3. */
parallelGrammarIssues=function(text){
const s=String(text||'');
const out=[];
const sentences=s
.replace(/\s+/g,' ')
.trim()
.split(/(?<=[.!?])\s+/)
.map(x=>x.trim())
.filter(Boolean);

sentences.forEach(sentence=>{
const passiveMatch=
sentence.match(
new RegExp(
`\\b(?:is|are|was|were|be|been)\\s+(?:${PASSIVE_V3_WORDS.join('|')})\\b`,
'i'
)
);

if(!passiveMatch){
return;
}

const start=
passiveMatch.index+passiveMatch[0].length;
const localTail=
sentence.slice(start,start+120);

Object.entries(ING_TO_V3).forEach(([ing,v3])=>{
const coordinated=
new RegExp(
`(?:,\\s*|\\band\\s+|\\bor\\s+)${ing}\\b`,
'i'
);

if(!coordinated.test(localTail)){
return;
}

/* Danh sách danh từ/gerund hợp lệ:
   thermal processing, packaging and delivery
   stages include drying, heating and cooling
*/
const nominalContext=
new RegExp(
`\\b(?:deal(?:s)?\\s+with|consist(?:s)?\\s+of|include(?:s)?|involve(?:s)?|comprise(?:s)?|followed\\s+by)\\b[^.!?]{0,140}\\b${ing}\\b`,
'i'
);

const nominalList=
new RegExp(
`\\b(?:thermal\\s+)?(?:processing|production|treatment|stages?|steps?)\\b[^.!?]{0,120}\\b${ing}\\b`,
'i'
);

if(
nominalContext.test(sentence)
||
nominalList.test(sentence)
){
return;
}

out.push(
`Cấu trúc song song chưa đúng: trong chuỗi bị động, “${ing}” nên đổi thành “${v3}”.`
);
});
});

return unique(out);
};


/* 2) Chấm grammar chính xác hơn:
      - bắt "is excavated, processed before"
      - bắt "heated in a kiln ... and another kiln ..."
      - KHÔNG bắt packaging trong cụm danh từ. */
genericGrammarIssues=function(text){
const s=
String(text||'')
.trim();

const n=
norm(s);

const out=[];

if(!s){
return[
'Chưa có câu trả lời.'
];
}

splitParagraphs(
s,
0
)
.forEach(
p=>{
if(
p
&&
!/^[A-Z0-9]/.test(p)
){
out.push(
'Một đoạn chưa viết hoa chữ cái đầu.'
);
}
}
);

if(
!/[.!?]$/.test(s)
){
out.push(
'Nên kết thúc bằng dấu câu.'
);
}

if(
/[^\n]\s{2,}[^\n]/.test(s)
){
out.push(
'Có khoảng trắng thừa.'
);
}

if(
/\b(is|are|was|were)\s+\1\b/i.test(n)
){
out.push(
'Có trợ động từ bị lặp.'
);
}

if(
/\b(the|a|an)\s+\1\b/i.test(n)
){
out.push(
'Có mạo từ bị lặp.'
);
}

if(
/\b(?:allows|enables)\s+(?:they|he|she|we|i)\s+to\b/i.test(s)
){
out.push(
'Sau allows/enables phải dùng tân ngữ: them/him/her/us/me + to V.'
);
}

if(
/\bbetween\s+[^,.!?;]{0,40}\s+to\s+[^,.!?;]{0,40}/i.test(s)
){
out.push(
'Dùng “between X and Y”, không dùng “between X to Y”.'
);
}

/* from X to Y: chỉ bắt khi thực sự là 2 mốc. */
const badFromAndPatterns=[
/\bfrom\s+(\d+(?:\.\d+)?)\s+and\s+(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|days?|stages?|steps?)\b/i,
/\bfrom\s+(\d+(?:\.\d+)?)\s*(?:°\s*c|degrees?\s+celsius)\s+and\s+(\d+(?:\.\d+)?)\s*(?:°\s*c|degrees?\s+celsius)\b/i,
/\bfrom\s+(\d+(?:\.\d+)?)\s+and\s+(\d+(?:\.\d+)?)\s*(?:°\s*c|degrees?\s+celsius)\b/i,
/\bfrom\s+stage\s+(\d+)\s+and\s+(?:stage\s+)?(\d+)\b/i,
/\bfrom\s+step\s+(\d+)\s+and\s+(?:step\s+)?(\d+)\b/i
];

if(
badFromAndPatterns.some(r=>r.test(s))
){
out.push(
'Khi mô tả một khoảng, dùng “from X to Y”, không dùng “from X and Y”.'
);
}

/* begins with ... and ends with ... */
if(
/\bbegins?\s+with\b[^.!?]{0,180}\bto\s+ends?\s+with\b/i.test(s)
){
out.push(
'Cấu trúc chưa đúng: dùng “begins with ... and ends with ...”, không dùng “begins with ... to ends with ...”.'
);
}

if(
/\bends?\s+with\s+(?:the\s+)?[^,.!?]{0,50}\s+(?:is|are|was|were)\s+\w+/i.test(s)
){
out.push(
'Sau “ends with” nên dùng noun/V-ing, ví dụ “ends with the bricks being delivered”.'
);
}

if(
/\bbegins?\s+with\s+(?:the\s+)?[^,.!?]{0,50}\s+(?:is|are|was|were)\s+\w+/i.test(s)
){
out.push(
'Sau “begins with” nên dùng noun/V-ing, ví dụ “begins with clay being dug from the ground”.'
);
}

/* is excavated, processed before... */
const parallelV3=
unique([
...PASSIVE_V3_WORDS,
'excavated',
'extracted',
'screened',
'filtered',
'conveyed',
'processed'
]);

const twoPassiveBefore=
s.match(
new RegExp(
`\\b(?:is|are|was|were|been)\\s+(${parallelV3.join('|')})\\s*,\\s*(${parallelV3.join('|')})\\s+before\\b`,
'i'
)
);

if(twoPassiveBefore){
out.push(
`Cấu trúc song song chưa tự nhiên: nên viết “${twoPassiveBefore[1]} and ${twoPassiveBefore[2]} before ...”.`
);
}

/* heated in a kiln ... and another kiln ... */
if(
ID==='01'
&&
/\b(?:heated|fired)\s+in\s+(?:a|one)\s+kiln\b[^.!?]{0,180}\band\s+(?:another|a second)\s+kiln\b/i.test(s)
&&
!/\band\s+in\s+(?:another|a second)\s+kiln\b/i.test(s)
){
out.push(
'Cấu trúc song song ở phần nung chưa tự nhiên: nên viết “heated in two kilns: first ... and then ...” hoặc “in one kiln ... and in another kiln ...”.'
);
}

const agreement=[
[
/\bbricks\s+is\b/i,
'“bricks” là số nhiều, dùng “are”.'
],
[
/\bottles\s+is\b/i,
'“bottles” là số nhiều, dùng “are”.'
],
[
/\bnoodles\s+is\b/i,
'“noodles” là số nhiều, dùng “are”.'
],
[
/\btomatoes\s+is\b/i,
'“tomatoes” là số nhiều, dùng “are”.'
],
[
/\beggs\s+is\b/i,
'“eggs” là số nhiều, dùng “are”.'
],
[
/\bpellets\s+is\b/i,
'“pellets” là số nhiều, dùng “are”.'
],
[
/\bclay\s+are\b/i,
'“clay” nên đi với “is”.'
],
[
/\bflour\s+are\b/i,
'“flour” nên đi với “is”.'
],
[
/\bmixture\s+are\b/i,
'“mixture” là số ít, dùng “is”.'
],
[
/\bwater\s+are\b/i,
'“water” nên đi với “is”.'
]
];

agreement.forEach(
([r,m])=>{
if(r.test(s)){
out.push(m);
}
}
);

if(
/\b(?:a|an)\s+(?:bricks|bottles|noodles|tomatoes|eggs|pellets|stages|products)\b/i.test(s)
){
out.push(
'“a/an” không đứng trực tiếp trước danh từ số nhiều.'
);
}

if(
/\bone\s+of\s+the\s+(?:stage|step|process)\b/i.test(s)
){
out.push(
'Sau “one of the” phải dùng danh từ số nhiều.'
);
}

let m;

const deg=
/\b(\d+(?:\.\d+)?)\s+degree\s+celsius\b/gi;

while(
(
m=
deg.exec(s)
)
){
if(
Number(m[1])!==1
){
out.push(
`“${m[0]}” chưa đúng: dùng “degrees Celsius”.`
);
}
}

const hr=
/\b(\d+)\s+hour\b/gi;

while(
(
m=
hr.exec(s)
)
){
if(
Number(m[1])!==1
){
out.push(
`“${m[0]}” nên dùng “hours”.`
);
}
}

const day=
/\b(\d+)\s+day\b/gi;

while(
(
m=
day.exec(s)
)
){
if(
Number(m[1])!==1
){
out.push(
`“${m[0]}” nên dùng “days”.`
);
}
}

return unique(out);
};


/* 3) Chấm sequence của bài hoàn chỉnh theo TỪNG BODY,
      dựa trên cách chia của học sinh ở Bước 1.
      Topic sentence không còn làm đảo thứ tự giả. */
function detailParagraphForSequence(text){
const sentences=
String(text||'')
.replace(/\s+/g,' ')
.trim()
.split(/(?<=[.!?])\s+/)
.map(x=>x.trim())
.filter(Boolean);

if(sentences.length<2){
return String(text||'');
}

const first=
sentences[0];

const rest=
sentences.slice(1).join(' ');

const firstIsTopic=
/\b(?:initial stages?|remaining stages?|later stages?|these stages?|the process|the procedure)\b/i.test(first)
||
/\b(?:consist(?:s)?\s+of|deal(?:s)?\s+with|involv(?:e|es)|include(?:s)?|followed\s+by)\b/i.test(first);

/* Nếu phần chi tiết phía sau nhận diện được ít nhất 2 stage,
   bỏ câu mở đoạn khái quát khỏi sequence audit. */
const restStageCount=
stageGroupHits(
rest,
processStageGroups()
)
.filter(Boolean)
.length;

if(
firstIsTopic
&&
restStageCount>=2
){
return rest;
}

return String(text||'');
}


function fullEssaySequenceAudit(text,paras){
const allParas=
Array.isArray(paras)
?
paras
:
splitParagraphs(
text,
20
);

if(
allParas.length>=4
){
const body1=
allParas[2]
||
'';

const body2=
allParas
.slice(3)
.join(' ');

const p1=
studentPlanForStep(3);

const p2=
studentPlanForStep(4);

const results=[];

if(p1){
results.push(
sequenceAuditForPlan(
body1,
p1
)
);
}else{
results.push(
sequenceAudit(
detailParagraphForSequence(
body1
)
)
);
}

if(p2){
results.push(
sequenceAuditForPlan(
body2,
p2
)
);
}else{
results.push(
sequenceAudit(
detailParagraphForSequence(
body2
)
)
);
}

const violations=
unique(
results.flatMap(
r=>
r?.violations
||
[]
)
);

return{
ok:
violations.length===0,
violations,
parts:
results
};
}

/* Fallback khi chưa đủ 4 đoạn. */
return sequenceAudit(
detailParagraphForSequence(
String(text||'')
)
);
}


/* 4) Góp ý về độ sát sơ đồ, chỉ trừ NHẸ,
      không coi là lỗi ngữ pháp nghiêm trọng. */
function diagramPrecisionIssues(text){
const s=
String(text||'');

const out=[];

if(
ID==='01'
&&
/\b(?:metal\s+grid|grid)\b[^.!?]{0,80}\bto\s+(?:remove|filter\s+out|eliminate)\s+(?:larger\s+)?(?:particles?|impurities?|debris)\b/i.test(s)
){
out.push(
'Sơ đồ không ghi rõ metal grid dùng để “remove larger particles/impurities”. Để bám sát hình hơn, chỉ cần viết clay is passed/screened through a metal grid.'
);
}

return unique(out);
}


/* 5) Full essay grading mới:
      - không báo sai metal grid / drying oven nếu trình tự thật sự đúng
      - không đổi packaging -> packaged trong cụm danh từ
      - bắt đúng 2 lỗi thật của bài mẫu bạn vừa gửi
      - precision chỉ trừ nhẹ
*/
fullGrade=function(text){
const wc=
words(text);

const paras=
splitParagraphs(
text,
20
);

const pc=
paras.length;

const groups=
processStageGroups();

const hits=
stageGroupHits(
text,
groups
);

const hitCount=
hits.filter(Boolean).length;

const ratio=
hits.length
?
hitCount/hits.length
:
0;

const language=
languageIssues(text);

const serious=
seriousLanguageIssues(
language
);

const topic=
topicCheck(text);

const facts=
factualIssues(text);

const precision=
diagramPrecisionIssues(text);

const hasOverview=
/\boverall\b|\bin general\b|\bgenerally\b|\bit is clear that\b|\bit can be seen that\b/i
.test(text);

const claim=
detectStageCountClaim(text);

const expected=
Number(
task.stages
);

const countOK=
!claim.mentioned
||
claim.count===expected;

const overview=
extractOverviewParagraph(text);

const overviewStyle=
overview
?
styleIssues(
overview,
2
)
:
[];

const seq=
fullEssaySequenceAudit(
text,
paras
);

const badOverviewConnector=
overview
?
hasBadBeginEndConnector(
overview
)
:
false;

const issues=[];

if(
!topic.requiredOK
){
issues.push(
`Bài chưa thể hiện đúng đối tượng chính: “${topic.expected}”.`
);
}

if(
topic.wrong.length
){
issues.push(
`Có nội dung thuộc process khác: “${topic.wrong.join(', ')}”.`
);
}

if(
claim.mentioned
&&
!countOK
){
issues.push(
`Sai số giai đoạn: em viết ${claim.count}, nhưng sơ đồ có ${expected}.`
);
}

if(
wc<150
){
issues.push(
`Bài hiện có ${wc} từ; IELTS Writing Task 1 nên có ít nhất 150 từ.`
);
}

if(
!hasOverview
){
issues.push(
'Chưa thấy Overview rõ ràng.'
);
}

if(
pc<4
){
issues.push(
`Hệ thống đang nhận ${pc} đoạn. Bài nên có 4 đoạn. Chỉ cần Enter 1 lần để sang đoạn mới.`
);
}

if(
ratio<.72
){
const missing=
groups
.filter(
(_,i)=>
!hits[i]
)
.map(
g=>
g[0]
)
.slice(
0,
10
);

issues.push(
'Một số stage chưa được thể hiện rõ: '
+
missing.join(', ')
+
'.'
);
}

facts.forEach(
x=>
issues.push(
'Nội dung/số liệu: '
+
x
)
);

seq.violations.forEach(
x=>
issues.push(
'Thứ tự stage: '
+
x
)
);

language.forEach(
x=>
issues.push(
'Ngữ pháp/chính tả: '
+
x
)
);

overviewStyle.forEach(
x=>
issues.push(
'Overview: '
+
x
)
);

precision.forEach(
x=>
issues.push(
'Gợi ý bám sát sơ đồ: '
+
x
)
);

const p1=
Math.round(
ratio*55
);

const p2=
wc>=150
?
20
:
Math.round(
Math.min(
20,
wc/150*20
)
);

const p3=
hasOverview
?
10
:
0;

const p4=
pc>=4
?
8
:
Math.round(
pc/4*8
);

const p5=
Math.max(
0,
7-serious.length*3
);

const fp=
Math.min(
20,
facts.length*6
);

const sp=
Math.min(
12,
seq.violations.length*6
);

const op=
Math.min(
6,
overviewStyle.length*3
);

/* Góp ý suy diễn sơ đồ chỉ trừ tối đa 3 điểm. */
const pp=
Math.min(
3,
precision.length
);

let score=
p1+
p2+
p3+
p4+
p5-
fp-
sp-
op-
pp;

score=
Math.max(
0,
Math.min(
100,
score
)
);

if(
!topic.requiredOK
||
topic.wrong.length
){
score=
Math.min(
score,
49
);
}

if(
claim.mentioned
&&
!countOK
){
score=
Math.min(
score,
69
);
}

if(
facts.length
){
score=
Math.min(
score,
79
);
}

/*
2 lỗi ngữ pháp không còn bị ép xuống 79.
Chỉ cap 79 khi có từ 4 lỗi quan trọng trở lên.
*/
if(
serious.length>=4
){
score=
Math.min(
score,
79
);
}

if(
badOverviewConnector
){
score=
Math.min(
score,
79
);
}

return{
total:
score,

completed:
topic.requiredOK
&&
!topic.wrong.length
&&
countOK
&&
wc>=150
&&
hasOverview
&&
pc>=4
&&
ratio>=.72
&&
serious.length===0
&&
facts.length===0
&&
seq.ok
&&
!badOverviewConnector,

wc,

paragraphCount:
pc,

issues,

breakdown:[
{
label:
'Nội dung & stages',
score:
p1,
max:
55,
note:
`Nhận diện ${hitCount}/${groups.length} stage · Bao quát ${Math.round(ratio*100)}%`
},
{
label:
'Độ dài',
score:
p2,
max:
20,
note:
`${wc} từ`
},
{
label:
'Overview',
score:
p3,
max:
10,
note:
hasOverview
?
'Có'
:
'Thiếu'
},
{
label:
'Cấu trúc đoạn',
score:
p4,
max:
8,
note:
`${pc} đoạn`
},
{
label:
'Ngữ pháp & chính tả',
score:
p5,
max:
7,
note:
serious.length
?
`${serious.length} lỗi quan trọng`
:
'Ổn'
}
]
};
};
load();

mount();


state.current=
  Math.min(
    +state.current
    ||
    0,
    unlock()
  );


render();

})();
