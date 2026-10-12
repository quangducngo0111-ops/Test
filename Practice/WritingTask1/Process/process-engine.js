(()=>{
'use strict';

/* =========================================================
   IELTS WRITING TASK 1 · PROCESS ENGINE V17
   ---------------------------------------------------------
   - 6-step guided practice
   - Step 1: analysis notes are graded flexibly
   - Step 2-5: templates available
   - Step 6: independent full essay
   - Grammar / spelling / factual / sequence checks
   - Flexible Body 1 / Body 2 grouping
========================================================= */

const TASKS=window.PROCESS_TASKS||{};
const ID=String(window.PROCESS_TASK_ID||'01').padStart(2,'0');
const task=TASKS[ID];

if(!task){
  document.body.innerHTML=
    '<p style="padding:30px;font-family:sans-serif">Không tìm thấy dữ liệu bài Process.</p>';
  return;
}

const STUDENT_KEY='IELTS_PRACTICE_STUDENT';

/*
  GIỮ V16 để không làm mất draft/progress cũ.
  ENGINE_VERSION dùng để nhận biết logic chấm mới.
*/
const STORAGE_VERSION='V16';
const ENGINE_VERSION='V17';

const STEP_NAMES=[
  'Phân tích sơ đồ',
  'Introduction',
  'Overview',
  'Body Paragraph 1',
  'Body Paragraph 2',
  'Bài hoàn chỉnh'
];


/* =========================================================
   STORAGE
========================================================= */

function studentScope(){

  try{

    const s=
      JSON.parse(
        localStorage.getItem(STUDENT_KEY)||'null'
      );

    if(s?.name){

      return encodeURIComponent(
        (
          s.name+
          '|'+
          (s.className||'')
        ).toLowerCase()
      );

    }

  }catch(e){}

  return 'guest';

}


const STORAGE_KEY=
  `WT1_PROCESS_GUIDED_${STORAGE_VERSION}_${studentScope()}::${ID}`;


let state={

  engineVersion:ENGINE_VERSION,

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
        localStorage.getItem(STORAGE_KEY)||'null'
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


      /*
        Nếu engine vừa được cập nhật:
        giữ bài làm + progress,
        nhưng bỏ feedback cũ để không hiện kết quả từ rule cũ.
      */
      if(
        s.engineVersion!==ENGINE_VERSION
      ){

        state.scores={};

        state.engineVersion=ENGINE_VERSION;

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


/* =========================================================
   HELPERS
========================================================= */

function norm(v){

  return String(v||'')

    .toLowerCase()

    .replace(/[’‘]/g,"'")

    .replace(
      /[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ°%–—'\s-]/g,
      ' '
    )

    .replace(
      /\s+/g,
      ' '
    )

    .trim();

}


function words(v){

  const t=
    String(v||'')
    .trim();

  return t
    ?
    t.split(/\s+/)
      .filter(Boolean)
      .length
    :
    0;

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


function unique(a){

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
    x=>{

      const q=
        norm(x);

      return q
        &&
        n.includes(q);

    }
  );

}


function groupHits(
  text,
  groups=[]
){

  return groups.map(
    g=>
      containsAny(
        text,
        g
      )
  );

}


function splitParagraphs(
  text,
  min=0
){

  /*
    Một lần Enter cũng được tính là đoạn mới.
  */

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

    .filter(
      x=>x.length>min
    );

}


function hasPhrase(
  text,
  p
){

  return(
    ' '+norm(text)+' '
  )
  .includes(
    ' '+norm(p)+' '
  );

}


/* =========================================================
   PROGRESS
========================================================= */

function attempts(step){

  return Number(
    state.attempts[step]
    ||
    0
  );

}


function done(step){

  return state.completed.includes(step);

}


function completeStep(step){

  if(!done(step)){

    state.completed.push(step);

  }

  state.completed=[
    ...new Set(state.completed)
  ]
  .sort(
    (a,b)=>a-b
  );

  save();

}


function invalidateFrom(step){

  state.completed=
    state.completed.filter(
      i=>i<step
    );

  for(
    let i=step+1;
    i<6;
    i++
  ){

    delete state.scores[i];

  }

  if(state.current>step){

    state.current=step;

  }

  save();

}


function unlockIndex(){

  let u=0;

  for(
    let i=0;
    i<6;
    i++
  ){

    if(done(i)){

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


function draftKey(step){

  return[
    'analysis',
    'intro',
    'overview',
    'body1',
    'body2',
    'full'
  ][step];

}


function fieldValue(id){

  return document
    .getElementById(id)
    ?.value
    ||
    '';

}


function saveCurrentDraft(){

  const step=
    state.current;

  if(step===0){

    state.drafts.analysis={

      type:
        fieldValue('aType'),

      stages:
        fieldValue('aStages'),

      first:
        fieldValue('aFirst'),

      last:
        fieldValue('aLast'),

      features:
        fieldValue('aFeatures'),

      body1:
        fieldValue('aBody1'),

      body2:
        fieldValue('aBody2')

    };

  }else{

    const box=
      document.getElementById(
        'writeBox'
      );

    if(box){

      state.drafts[
        draftKey(step)
      ]=
        box.value;

    }

  }

  save();

}


/* =========================================================
   NUMBER HELPERS
========================================================= */

const NUMBER_WORDS={

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

  'một':1,
  'mot':1,

  'hai':2,

  'ba':3,

  'bốn':4,
  'bon':4,
  'tư':4,
  'tu':4,

  'năm':5,
  'nam':5,

  'sáu':6,
  'sau':6,

  'bảy':7,
  'bay':7,

  'tám':8,
  'tam':8,

  'chín':9,
  'chin':9,

  'mười':10,
  'muoi':10,

  'mười một':11,
  'muoi mot':11,

  'mười hai':12,
  'muoi hai':12,

  'mười ba':13,
  'muoi ba':13,

  'mười bốn':14,
  'muoi bon':14,

  'mười lăm':15,
  'muoi lam':15

};


function numberValue(x){

  const v=
    String(x||'')

    .toLowerCase()

    .trim();


  if(
    /^\d+$/.test(v)
  ){

    return Number(v);

  }


  if(
    Object.prototype.hasOwnProperty.call(
      NUMBER_WORDS,
      v
    )
  ){

    return NUMBER_WORDS[v];

  }


  /*
    Cho phép:
    "7 stages"
    "seven stages"
    "bảy giai đoạn"
  */

  const cleaned=
    v

    .replace(
      /\bmain\s+stages?\b/g,
      ''
    )

    .replace(
      /\bstages?\b/g,
      ''
    )

    .replace(
      /\bgiai\s+đoạn\b/g,
      ''
    )

    .replace(
      /\bgiai\s+doan\b/g,
      ''
    )

    .trim();


  if(
    /^\d+$/.test(cleaned)
  ){

    return Number(cleaned);

  }


  return NUMBER_WORDS[cleaned]
    ??
    null;

}


function detectStageCountClaim(text){

  const raw=
    String(text||'')
    .toLowerCase();


  const p=
    [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
      'twenty',
      '\\d+'
    ]
    .join('|');


  const patterns=[

    new RegExp(
      `\\b(${p})\\s*[-–— ]\\s*(?:main\\s+)?stages?\\b`,
      'i'
    ),

    new RegExp(
      `\\b(?:consists|comprises|contains|has|involves)\\s+(?:of\\s+)?(${p})\\s+(?:main\\s+)?stages?\\b`,
      'i'
    )

  ];


  for(
    const r
    of
    patterns
  ){

    const m=
      raw.match(r);

    if(m){

      return{

        mentioned:true,

        count:
          numberValue(
            m[1]
          ),

        token:
          m[1],

        match:
          m[0]

      };

    }

  }


  return{

    mentioned:false,

    count:null,

    token:'',

    match:''

  };

}


function analysisStageCount(){

  const raw=
    String(
      state.drafts
        ?.analysis
        ?.stages
      ||
      ''
    )

    .trim()

    .toLowerCase();


  if(!raw){

    return null;

  }


  const direct=
    numberValue(raw);


  if(
    direct!=null
  ){

    return direct;

  }


  const m=
    raw.match(
      /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\b/i
    );


  return m
    ?
    numberValue(
      m[1]
    )
    :
    null;

}


/* =========================================================
   PROCESS TYPE + TEMPLATES
========================================================= */

function processKind(){

  const t=
    norm(
      state.drafts
        ?.analysis
        ?.type
      ||
      task.type
      ||
      ''
    );


  if(
    t.includes('life')
  ){

    return 'life';

  }


  if(
    t.includes('cyc')
  ){

    return 'cyclical';

  }


  return 'linear';

}


const TEMPLATE_LIBRARY={


  linear:{

    intro:
      'The diagram illustrates the stages involved in the production of __________.',

    overview:
      'Overall, the procedure follows a linear, ______-stage sequence that begins with __________ being __________ and ends with __________ being __________. During these stages, __________ is/are __________ before __________ is/are __________.',

    body1:
      'In the initial stages, __________. __________ is/are __________, where __________. Once __________ has/have been __________, __________, which __________ before being __________.',

    body2:
      'The remaining stages deal with __________. __________ and subsequently __________. After this stage has been completed, __________ before __________, completing the process.'

  },


  cyclical:{

    intro:
      'The diagram illustrates the stages involved in __________.',

    overview:
      'Overall, the procedure follows a cyclical, ______-stage sequence that begins with __________ and progresses through __________ before the resulting __________ returns to __________, allowing the cycle to begin again. During these stages, __________ undergoes/undergo several processes including __________ before returning to __________.',

    body1:
      'In the initial stages, __________. Following this, __________. Once __________, __________ before __________.',

    body2:
      'In the later stages, __________. Following this, __________ before the resulting __________ returns to __________, allowing the cycle to begin again.'

  },


  life:{

    intro:
      'The diagram illustrates the different stages in the life cycle of __________.',

    overview:
      'Overall, the life cycle consists of ______ main stages, beginning with __________ and progressing through different stages of development before __________ reaches maturity and produces __________, beginning a new cycle. During this cycle, __________ develops from __________ into __________ and eventually __________ before producing __________.',

    body1:
      'In the initial stages of the cycle, __________ develops into __________. As it grows, __________ before becoming __________.',

    body2:
      'In the later stages of the cycle, __________ develops into __________ before reaching __________. At this point, __________ produces/gives rise to __________, which marks the beginning of a new cycle.'

  }

};


function templateForStep(step){

  if(
    step<1
    ||
    step>4
  ){

    return '';

  }


  const lib=
    TEMPLATE_LIBRARY[
      processKind()
    ]
    ||
    TEMPLATE_LIBRARY.linear;


  return({

    1:lib.intro,

    2:lib.overview,

    3:lib.body1,

    4:lib.body2

  })[step]
  ||
  '';

}


function templateTitle(step){

  return({

    1:'Template Introduction',

    2:'Template Overview',

    3:'Template Body 1',

    4:'Template Body 2'

  })[step]
  ||
  'Template';

}


function renderTemplateCard(step){

  if(
    step<1
    ||
    step>4
  ){

    return '';

  }


  const open=
    state.templateOpen[step]
    !==
    false;


  return`

<div
  class="
    template-card
    ${open?'open':''}
  "
>

  <div class="template-head">

    <div>

      <span class="template-badge">
        TEMPLATE HỖ TRỢ
      </span>

      <b>
        ${templateTitle(step)}
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
        templateForStep(step)
      )}
    </div>

    <div class="template-note">

      Em được dùng template ở bước này.
      Có thể thay đổi từ vựng/cách diễn đạt;
      hệ thống không yêu cầu chép nguyên văn.

    </div>

  </div>

</div>

  `;

}


function renderIndependentCard(){

  return`

<div class="independent-card">

  <div class="independent-icon">
    ✍️
  </div>

  <div>

    <b>
      Bước tự viết — không còn template
    </b>

    <p>
      Ở Bước 6, template và các đoạn em đã viết
      ở Bước 2–5 được ẩn.
      Hãy nhìn sơ đồ và tự viết một bài hoàn chỉnh
      gồm Introduction, Overview, Body 1 và Body 2.
    </p>

  </div>

</div>

  `;

}


/* =========================================================
   TOPIC RULES
========================================================= */

const TOPIC_RULES={


  '01':{

    required:[
      'brick',
      'bricks'
    ],

    forbidden:[
      'noodle',
      'noodles',
      'ketchup',
      'frog',
      'frogs',
      'bee',
      'bees',
      'plastic bottle',
      'plastic bottles'
    ],

    label:'bricks'

  },


  '02':{

    required:[
      'noodle',
      'noodles',
      'instant noodle',
      'instant noodles'
    ],

    forbidden:[
      'brick',
      'bricks',
      'ketchup',
      'frog',
      'frogs',
      'bee',
      'bees',
      'plastic bottle',
      'plastic bottles'
    ],

    label:'instant noodles'

  },


  '03':{

    required:[
      'ketchup',
      'tomato ketchup'
    ],

    forbidden:[
      'brick',
      'bricks',
      'noodle',
      'noodles',
      'frog',
      'frogs',
      'bee',
      'bees',
      'plastic bottle',
      'plastic bottles'
    ],

    label:'tomato ketchup'

  },


  '04':{

    required:[
      'frog',
      'frogs'
    ],

    forbidden:[
      'brick',
      'bricks',
      'noodle',
      'noodles',
      'ketchup',
      'bee',
      'bees',
      'plastic bottle',
      'plastic bottles'
    ],

    label:'frog life cycle'

  },


  '05':{

    required:[
      'bee',
      'bees'
    ],

    forbidden:[
      'brick',
      'bricks',
      'noodle',
      'noodles',
      'ketchup',
      'frog',
      'frogs',
      'plastic bottle',
      'plastic bottles'
    ],

    label:'bee life cycle'

  },


  '06':{

    required:[
      'plastic bottle',
      'plastic bottles',
      'plastic',
      'recycling'
    ],

    forbidden:[
      'brick',
      'bricks',
      'noodle',
      'noodles',
      'ketchup',
      'frog',
      'frogs',
      'bee',
      'bees'
    ],

    label:'plastic bottles'

  }

};


function topicCheck(text){

  const r=
    TOPIC_RULES[ID];


  if(!r){

    return{

      requiredOK:true,

      wrong:[],

      expected:''

    };

  }


  return{

    requiredOK:
      r.required.some(
        x=>
          hasPhrase(
            text,
            x
          )
      ),

    wrong:[
      ...new Set(
        r.forbidden.filter(
          x=>
            hasPhrase(
              text,
              x
            )
        )
      )
    ],

    expected:
      r.label

  };

}


/* =========================================================
   STAGE GROUPS
========================================================= */

function globalBodyGroups(){

  const all=[

    ...(task.body1?.concepts||[]),

    ...(task.body2?.concepts||[])

  ];


  const seen=
    new Set();


  return all.filter(
    g=>{

      const k=
        (g||[])

        .map(norm)

        .sort()

        .join('|');


      if(
        !k
        ||
        seen.has(k)
      ){

        return false;

      }


      seen.add(k);

      return true;

    }
  );

}


const PROCESS_STAGE_GROUPS={


'01':[

  [
    'clay is dug',
    'clay is excavated',
    'clay is extracted',
    'clay being dug',
    'clay being excavated',
    'dug from the ground',
    'excavated from the ground',
    'digger',
    'excavator'
  ],

  [
    'metal grid',
    'grid',
    'roller',
    'rollers',
    'screened',
    'passed through a metal grid'
  ],

  [
    'sand and water',
    'water and sand',
    'mixed with sand',
    'mixed with water'
  ],

  [
    'mould',
    'mold',
    'moulded',
    'molded',
    'wire cutter',
    'wire cutting',
    'shaped into bricks',
    'cut into bricks'
  ],

  [
    'drying oven',
    'dried',
    'drying',
    '24-48 hours',
    '24 to 48 hours'
  ],

  [
    'kiln',
    'heated',
    'fired',
    'moderate temperature',
    'high temperature',
    '200°c',
    '980°c',
    '870°c',
    '1300°c'
  ],

  [
    'cooling chamber',
    'cooled',
    'cooling',
    '48-72 hours',
    '48 to 72 hours'
  ],

  [
    'packaged',
    'packaging',
    'packed'
  ],

  [
    'delivered',
    'delivery',
    'being delivered',
    'bricks are delivered',
    'products are delivered',
    'transported to customers',
    'transported to consumers'
  ]

],


'02':[

  [
    'storage silos',
    'storage silo',
    'flour is stored',
    'flour storage',
    'flour is kept'
  ],

  [
    'mixer',
    'mixed with water and oil',
    'water and oil',
    'mixing'
  ],

  [
    'dough sheets',
    'sheets of dough',
    'rolled into sheets',
    'rollers'
  ],

  [
    'dough strips',
    'strips of dough',
    'cut into strips'
  ],

  [
    'noodle discs',
    'noodle disks',
    'shaped into discs',
    'formed into discs'
  ],

  [
    'cooking in oil',
    'cooked in oil',
    'dried',
    'drying'
  ],

  [
    'cups',
    'placed in cups',
    'put into cups',
    'vegetables and spices',
    'vegetables',
    'spices'
  ],

  [
    'labelled',
    'labeled',
    'labelling',
    'labeling',
    'sealed',
    'sealing'
  ]

],


'03':[

  [
    'pick tomatoes',
    'picked',
    'harvested',
    'collected',
    'tomatoes are collected',
    'ripe tomatoes are collected',
    'put in baskets',
    'placed in baskets',
    'baskets'
  ],

  [
    'sort',
    'sorted',
    'good tomatoes',
    'bad tomatoes',
    'classified'
  ],

  [
    'sent to factory',
    'transported to factory',
    'taken to factory',
    'processing factory'
  ],

  [
    'remove stalk',
    'stalk is removed',
    'stalks are removed',
    'remove seeds',
    'seeds are removed',
    'remove skin',
    'skin is removed',
    'skins are removed',
    'stalk',
    'stalks',
    'seeds',
    'skin',
    'skins'
  ],

  [
    'put into a container',
    'placed in a container',
    'put in a container'
  ],

  [
    'crushed',
    'crush',
    'crushing',
    'pulp',
    'crushed into pulp'
  ],

  [
    'sugar',
    'vinegar',
    'salt',
    'ingredients are added',
    'additives',
    'combined with ingredients'
  ],

  [
    'boiled',
    'boiling',
    'boil'
  ],

  [
    'left for two hours',
    'left for 2 hours',
    'left to stand for two hours',
    'left to stand for 2 hours',
    'two hours',
    '2 hours'
  ],

  [
    'poured into bottles',
    'filled into bottles',
    'bottled',
    'bottles are filled'
  ],

  [
    'labelled',
    'labeled',
    'labelling',
    'labeling'
  ],

  [
    'quality control',
    'quality checked',
    'checked',
    'inspected',
    'inspection'
  ],

  [
    'packed',
    'packaged',
    'boxes',
    'packed into boxes'
  ],

  [
    'supermarket',
    'sent to supermarkets',
    'delivered to supermarkets',
    'transported to supermarkets'
  ],

  [
    'consumed',
    'consumption',
    'hamburger',
    'hamburgers',
    'fries',
    'ready for consumption',
    'served',
    'served with food',
    'served with foods',
    'eaten'
  ]

],


'04':[

  [
    'eggs',
    'frog eggs',
    'eggs are laid',
    'lays eggs'
  ],

  [
    'embryo',
    'embryos',
    'embryonic'
  ],

  [
    'tadpoles clinging to water plants',
    'tadpoles cling to water plants',
    'water plants'
  ],

  [
    'external gills',
    'gills',
    'breathing'
  ],

  [
    'tail keeps growing',
    'tail grows',
    'growing tail'
  ],

  [
    'hindlegs appear',
    'hind legs appear',
    'hind legs',
    'back legs'
  ],

  [
    'food stored in the tail',
    'stored in the tail'
  ],

  [
    'front legs appear',
    'front legs'
  ],

  [
    'tail becomes shorter',
    'tail shortens',
    'shorter tail'
  ],

  [
    'young frog',
    'froglet'
  ],

  [
    'adult frog',
    'mature frog'
  ]

],


'05':[

  [
    'female lays eggs',
    'females lay eggs',
    'eggs are laid',
    'one or two eggs',
    '1 or 2 eggs',
    'every three days'
  ],

  [
    'eggs hatch',
    'hatch after 9',
    '9-10 days',
    '9 to 10 days'
  ],

  [
    '5 days',
    'five days'
  ],

  [
    'first moulting',
    'first molting',
    'first moult',
    'first molt'
  ],

  [
    '7 days',
    'seven days'
  ],

  [
    'second moulting',
    'second molting',
    'second moult',
    'second molt'
  ],

  [
    '9 days',
    'nine days'
  ],

  [
    'young adult emerges',
    'young adult',
    'emerges'
  ],

  [
    '4 days to maturity',
    'four days to maturity',
    'maturity',
    'mature bee'
  ]

],


'06':[

  [
    'recycling bin',
    'recycle bin',
    'placed in recycling bins',
    'put in recycling bins',
    'discarded'
  ],

  [
    'collection truck',
    'collected',
    'collection',
    'transported'
  ],

  [
    'recycling centre',
    'recycling center',
    'sorting',
    'sorted'
  ],

  [
    'compressed',
    'compressing',
    'compressed into blocks',
    'blocks'
  ],

  [
    'crushed',
    'crushing',
    'washed',
    'washing',
    'crushing and washing'
  ],

  [
    'plastic pellets',
    'pellets',
    'producing plastic pellets',
    'made into pellets'
  ],

  [
    'heated',
    'heating pellets',
    'pellets are heated'
  ],

  [
    'raw material',
    'formed into raw material',
    'plastic raw material'
  ],

  [
    'end products',
    'new products',
    'producing end products',
    'recycled products'
  ]

]

};


function processStageGroups(){

  const g=
    PROCESS_STAGE_GROUPS[ID];

  return Array.isArray(g)
    &&
    g.length
    ?
    g
    :
    globalBodyGroups();

}


function stagePhrasePosition(
  text,
  phrase
){

  const n=
    norm(phrase);

  if(!n){

    return -1;

  }

  return(
    ' '+norm(text)+' '
  )
  .indexOf(
    ' '+n+' '
  );

}


function stageGroupPosition(
  text,
  group
){

  let best=-1;

  (group||[])
  .forEach(
    p=>{

      const x=
        stagePhrasePosition(
          text,
          p
        );

      if(
        x>=0
        &&
        (
          best<0
          ||
          x<best
        )
      ){

        best=x;

      }

    }
  );

  return best;

}


function stageGroupHits(
  text,
  groups=processStageGroups()
){

  return groups.map(
    g=>
      stageGroupPosition(
        text,
        g
      )>=0
  );

}


/* =========================================================
   BODY PLAN
========================================================= */

function bodyPlanInfo(text){

  const groups=
    processStageGroups();

  const hits=
    stageGroupHits(
      text,
      groups
    );

  return{

    hits,

    count:
      hits.filter(Boolean).length,

    groups

  };

}


function bodyPlansAreDistinct(
  a,
  b
){

  const A=
    new Set(
      norm(a)
      .split(/\s+/)
      .filter(
        x=>x.length>3
      )
    );

  const B=
    new Set(
      norm(b)
      .split(/\s+/)
      .filter(
        x=>x.length>3
      )
    );


  if(
    !A.size
    ||
    !B.size
  ){

    return false;

  }


  let o=0;


  A.forEach(
    w=>{

      if(
        B.has(w)
      ){

        o++;

      }

    }
  );


  return(
    o
    /
    Math.max(
      1,
      Math.min(
        A.size,
        B.size
      )
    )
  )
  <
  .78;

}


function parseStageRange(text){

  const raw=
    String(text||'')

    .toLowerCase()

    .replace(
      /[–—]/g,
      '-'
    )

    .replace(
      /\bstages?\b/g,
      ' '
    )

    .replace(
      /\bgiai\s+đoạn\b/g,
      ' '
    )

    .trim();


  let m=
    raw.match(
      /\b(\d+)\s*-\s*(\d+)\b/
    );


  if(m){

    const a=
      Number(m[1]);

    const b=
      Number(m[2]);

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


  m=
    raw.match(
      /\b(?:from\s+)?(\d+)\s+to\s+(\d+)\b/
    );


  if(m){

    const a=
      Number(m[1]);

    const b=
      Number(m[2]);

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
    /^\d+$/.test(raw)
  ){

    const v=
      Number(raw);

    return{

      valid:true,

      start:v,

      end:v

    };

  }


  return{

    valid:false,

    start:null,

    end:null

  };

}


function validBodyPlan(text){

  const total=
    Number(task.stages);

  const r=
    parseStageRange(text);


  if(r.valid){

    return(
      r.start>=1
      &&
      r.end<=total
      &&
      r.start<=r.end
    );

  }


  const i=
    bodyPlanInfo(text);


  return(
    words(text)>=2
    &&
    i.count>=1
  );

}


function bodyPlansCompatible(
  a,
  b
){

  const total=
    Number(task.stages);

  const A=
    parseStageRange(a);

  const B=
    parseStageRange(b);


  if(
    A.valid
    &&
    B.valid
  ){

    return(
      A.start>=1
      &&
      B.start>=1
      &&
      A.end<=total
      &&
      B.end<=total
      &&
      A.start<B.start
      &&
      A.end<B.start
    );

  }


  return bodyPlansAreDistinct(
    a,
    b
  );

}


/* =========================================================
   LANGUAGE ENGINE
========================================================= */

const COMMON_TYPOS={

  manufactoring:'manufacturing',

  manufactureing:'manufacturing',

  prodution:'production',

  proccess:'process',

  temparature:'temperature',

  temprature:'temperature',

  delievered:'delivered',

  deliverd:'delivered',

  packeged:'packaged',

  pakaged:'packaged',

  recyled:'recycled',

  recycleing:'recycling',

  continer:'container',

  containner:'container',

  vegtables:'vegetables',

  seperated:'separated',

  seperate:'separate',

  compresssed:'compressed',

  crushedd:'crushed',

  washd:'washed',

  coold:'cooled',

  heatd:'heated',

  boilied:'boiled',

  labeld:'labelled',

  tranported:'transported',

  distrubuted:'distributed',

  excuvator:'excavator',

  cilinder:'cylinder',

  celcius:'Celsius',

  drie:'dried',

  drieed:'dried',

  dryed:'dried',

  heted:'heated',

  heatted:'heated',

  colled:'cooled',

  coooled:'cooled',

  mouldd:'moulded',

  moldedd:'molded',

  mixxed:'mixed',

  crushd:'crushed',

  packd:'packed',

  packageed:'packaged',

  storeed:'stored',

  rolld:'rolled',

  cookd:'cooked',

  sealedd:'sealed',

  sortted:'sorted',

  poureded:'poured',

  filld:'filled',

  hatchd:'hatched',

  emergd:'emerged',

  moultng:'moulting',

  moultingg:'moulting',

  pelletes:'pellets',

  recyling:'recycling'

};


function spellingIssues(text){

  const tokens=
    String(text||'')

    .toLowerCase()

    .match(/[a-z]+/g)
    ||
    [];


  const out=[];


  tokens.forEach(
    w=>{

      if(
        COMMON_TYPOS[w]
      ){

        out.push(
          `Có thể sai chính tả: “${w}” → “${COMMON_TYPOS[w]}”.`
        );

      }

    }
  );


  if(
    /\brip\s+tomatoes?\b/i
    .test(text)
  ){

    out.push(
      'Dùng từ chưa đúng: “rip tomatoes” → “ripe tomatoes”.'
    );

  }


  return unique(out);

}


const PASSIVE_BASE_TO_V3={

  pick:'picked',

  harvest:'harvested',

  collect:'collected',

  sort:'sorted',

  classify:'classified',

  transport:'transported',

  send:'sent',

  remove:'removed',

  crush:'crushed',

  combine:'combined',

  mix:'mixed',

  add:'added',

  boil:'boiled',

  heat:'heated',

  cool:'cooled',

  mould:'moulded',

  mold:'molded',

  shape:'shaped',

  dry:'dried',

  label:'labelled',

  check:'checked',

  inspect:'inspected',

  package:'packaged',

  pack:'packed',

  deliver:'delivered',

  distribute:'distributed',

  wash:'washed',

  compress:'compressed',

  recycle:'recycled',

  place:'placed',

  seal:'sealed',

  pour:'poured',

  fill:'filled',

  store:'stored',

  roll:'rolled',

  cook:'cooked',

  form:'formed',

  produce:'produced',

  make:'made'

};


const ING_TO_V3={

  picking:'picked',

  harvesting:'harvested',

  collecting:'collected',

  sorting:'sorted',

  classifying:'classified',

  transporting:'transported',

  removing:'removed',

  crushing:'crushed',

  combining:'combined',

  mixing:'mixed',

  adding:'added',

  boiling:'boiled',

  heating:'heated',

  cooling:'cooled',

  moulding:'moulded',

  molding:'molded',

  shaping:'shaped',

  drying:'dried',

  labelling:'labelled',

  labeling:'labeled',

  checking:'checked',

  inspecting:'inspected',

  packaging:'packaged',

  packing:'packed',

  delivering:'delivered',

  distributing:'distributed',

  washing:'washed',

  compressing:'compressed',

  recycling:'recycled',

  placing:'placed',

  sealing:'sealed',

  pouring:'poured',

  filling:'filled',

  storing:'stored',

  rolling:'rolled',

  cooking:'cooked',

  forming:'formed',

  producing:'produced'

};


const PASSIVE_V3_WORDS=
  unique([

    ...Object.values(
      PASSIVE_BASE_TO_V3
    ),

    ...Object.values(
      ING_TO_V3
    ),

    'cut',

    'left',

    'put'

  ]);


function parallelGrammarIssues(text){

  const s=
    String(text||'');

  const out=[];


  const passiveContext=
    new RegExp(
      `\\b(?:is|are|was|were|be|been)\\s+(?:${PASSIVE_V3_WORDS.join('|')})\\b`,
      'i'
    );


  if(
    !passiveContext.test(s)
  ){

    return[];

  }


  Object.entries(
    ING_TO_V3
  )
  .forEach(
    ([ing,v3])=>{

      const r=
        new RegExp(
          `(?:,\\s*|\\band\\s+|\\bor\\s+)${ing}\\b`,
          'i'
        );


      if(
        r.test(s)
      ){

        out.push(
          `Cấu trúc song song chưa đúng: trong chuỗi bị động, “${ing}” nên đổi thành “${v3}”.`
        );

      }

    }
  );


  return unique(out);

}


function passiveVerbFormIssues(text){

  const s=
    String(text||'');

  const out=[];


  const passiveContext=
    /\b(?:clay|bricks?|flour|dough|noodles?|tomatoes?|mixture|ketchup|bottles?|plastic|pellets?|materials?|products?|eggs?)\s+(?:is|are|was|were)\b/i;


  if(
    !passiveContext.test(s)
  ){

    return[];

  }


  Object.entries(
    PASSIVE_BASE_TO_V3
  )
  .forEach(
    ([base,v3])=>{

      if(
        base===v3
      ){

        return;

      }


      const afterBe=
        new RegExp(
          `\\b(?:is|are|was|were|be|been)\\s+${base}\\b`,
          'i'
        );


      const coordinated=
        new RegExp(
          `(?:,\\s*|\\band\\s+|\\bor\\s+)${base}\\b`,
          'i'
        );


      if(
        afterBe.test(s)
      ){

        out.push(
          `Câu bị động chưa đúng: “${base}” sau be phải đổi thành “${v3}”.`
        );

      }else if(
        coordinated.test(s)
      ){

        out.push(
          `Sai dạng động từ trong chuỗi bị động: “${base}” nên dùng “${v3}”.`
        );

      }

    }
  );


  return unique(out);

}


function activeAgreementIssues(text){

  const s=
    String(text||'');

  const out=[];


  const rules={


    '04':[

      [
        /\beggs\s+hatches\b/i,
        '“eggs” là số nhiều: dùng “eggs hatch”.'
      ],

      [
        /\btadpoles\s+clings\b/i,
        '“tadpoles” là số nhiều: dùng “tadpoles cling”.'
      ],

      [
        /\b(?:hind|front)\s+legs\s+appears\b/i,
        '“legs” là số nhiều: dùng “appear”.'
      ],

      [
        /\btail\s+grow\b/i,
        '“tail” là số ít: dùng “tail grows”.'
      ],

      [
        /\btail\s+shorten\b/i,
        '“tail” là số ít: dùng “tail shortens”.'
      ],

      [
        /\byoung\s+frog\s+develop\b/i,
        '“young frog” là số ít: dùng “develops”.'
      ]

    ],


    '05':[

      [
        /\bfemales\s+lays\b/i,
        '“females” là số nhiều: dùng “females lay”.'
      ],

      [
        /\beggs\s+hatches\b/i,
        '“eggs” là số nhiều: dùng “eggs hatch”.'
      ],

      [
        /\byoung\s+adult\s+emerge\b/i,
        '“young adult” là số ít: dùng “emerges”.'
      ],

      [
        /\bbee\s+reach\b/i,
        '“bee” là số ít: dùng “reaches”.'
      ],

      [
        /\bbee\s+become\b/i,
        '“bee” là số ít: dùng “becomes”.'
      ]

    ]

  };


  (
    rules[ID]
    ||
    []
  )
  .forEach(
    ([r,m])=>{

      if(
        r.test(s)
      ){

        out.push(m);

      }

    }
  );


  return unique(out);

}


function genericGrammarIssues(text){

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
    /\b(is|are|was|were)\s+\1\b/i
    .test(n)
  ){

    out.push(
      'Có trợ động từ bị lặp.'
    );

  }


  if(
    /\b(the|a|an)\s+\1\b/i
    .test(n)
  ){

    out.push(
      'Có mạo từ bị lặp.'
    );

  }


  if(
    /\b(?:allows|enables)\s+(?:they|he|she|we|i)\s+to\b/i
    .test(s)
  ){

    out.push(
      'Sau allows/enables phải dùng tân ngữ: them/him/her/us/me + to V.'
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


  /*
    Chỉ bắt lỗi from X and Y
    nếu X/Y thực sự là 2 mốc.
    Không bắt:
    "... from the ground and ends with ..."
  */

  const badFromAndPatterns=[

    /\bfrom\s+(\d+(?:\.\d+)?)\s+and\s+(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|days?|stages?|steps?)\b/i,

    /\bfrom\s+(\d+(?:\.\d+)?)\s*(?:°\s*c|degrees?\s+celsius)\s+and\s+(\d+(?:\.\d+)?)\s*(?:°\s*c|degrees?\s+celsius)\b/i,

    /\bfrom\s+(\d+(?:\.\d+)?)\s+and\s+(\d+(?:\.\d+)?)\s*(?:°\s*c|degrees?\s+celsius)\b/i,

    /\bfrom\s+stage\s+(\d+)\s+and\s+(?:stage\s+)?(\d+)\b/i,

    /\bfrom\s+step\s+(\d+)\s+and\s+(?:step\s+)?(\d+)\b/i

  ];


  if(
    badFromAndPatterns.some(
      r=>r.test(s)
    )
  ){

    out.push(
      'Khi mô tả một khoảng, dùng “from X to Y”, không dùng “from X and Y”.'
    );

  }


  /*
    TEMPLATE:
    begins with ... AND ends with ...

    Đây là cấu trúc chuẩn.

    Sai:
    begins with ... to ends with ...
  */

  if(
    /\bbegins?\s+with\b[^.!?]{0,180}\bto\s+ends?\s+with\b/i
    .test(s)
  ){

    out.push(
      'Cấu trúc chưa đúng: dùng “begins with ... and ends with ...”, không dùng “begins with ... to ends with ...”.'
    );

  }


  /*
    Tránh bắt nhầm:
    begins with clay being dug ...
    ends with bricks being delivered

    Chỉ cảnh báo khi sau with thực sự là mệnh đề:
    ends with bricks are delivered
  */

  if(
    /\bends?\s+with\s+(?:the\s+)?[^,.!?]{0,50}\s+(?:is|are|was|were)\s+\w+/i
    .test(s)
  ){

    out.push(
      'Sau “ends with” nên dùng noun/V-ing, ví dụ “ends with the bricks being delivered”.'
    );

  }


  if(
    /\bbegins?\s+with\s+(?:the\s+)?[^,.!?]{0,50}\s+(?:is|are|was|were)\s+\w+/i
    .test(s)
  ){

    out.push(
      'Sau “begins with” nên dùng noun/V-ing, ví dụ “begins with clay being dug from the ground”.'
    );

  }


  const agreement=[

    [
      /\bbricks\s+is\b/i,
      '“bricks” là số nhiều, dùng “are”.'
    ],

    [
      /\bbottles\s+is\b/i,
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

      if(
        r.test(s)
      ){

        out.push(m);

      }

    }
  );


  if(
    /\b(?:a|an)\s+(?:bricks|bottles|noodles|tomatoes|eggs|pellets|stages|products)\b/i
    .test(s)
  ){

    out.push(
      '“a/an” không đứng trực tiếp trước danh từ số nhiều.'
    );

  }


  if(
    /\bone\s+of\s+the\s+(?:stage|step|process)\b/i
    .test(s)
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

}


function hasBadBeginEndConnector(text){

  return(
    /\bbegins?\s+with\b[^.!?]{0,180}\bto\s+ends?\s+with\b/i
  )
  .test(
    String(text||'')
  );

}


function grammarIssues(text){

  return unique([

    ...genericGrammarIssues(text),

    ...parallelGrammarIssues(text),

    ...passiveVerbFormIssues(text),

    ...activeAgreementIssues(text)

  ]);

}


function languageIssues(text){

  return unique([

    ...grammarIssues(text),

    ...spellingIssues(text)

  ]);

}


function seriousLanguageIssues(items){

  return(
    items
    ||
    []
  )
  .filter(
    x=>

      !/khoảng trắng thừa/i.test(x)

      &&

      !/nên kết thúc bằng dấu câu/i.test(x)
  );

}


/*
  STEP 1:
  Đây chỉ là ghi chú phân tích sơ đồ.

  Không yêu cầu:
  - viết hoa đầu câu
  - dấu chấm cuối câu
  - hình thức hoàn chỉnh như bài Writing

  Nhưng vẫn bắt lỗi ngữ pháp thực sự.
*/

function analysisNoteLanguageIssues(text){

  const all=
    languageIssues(text);


  return all.filter(
    issue=>{

      if(
        /chưa viết hoa chữ cái đầu/i
        .test(issue)
      ){

        return false;

      }


      if(
        /nên kết thúc bằng dấu câu/i
        .test(issue)
      ){

        return false;

      }


      if(
        /khoảng trắng thừa/i
        .test(issue)
      ){

        return false;

      }


      return true;

    }
  );

}


/* =========================================================
   IMPORTANT FEATURES
========================================================= */

function importantFeatureScore(text){

  const groups=
    processStageGroups();

  const hits=
    stageGroupHits(
      text,
      groups
    )
    .filter(Boolean)
    .length;


  const ratio=
    groups.length
    ?
    hits/groups.length
    :
    0;


  const actions=[

    'picked',

    'harvested',

    'collected',

    'stored',

    'mixed',

    'rolled',

    'cut',

    'shaped',

    'cooked',

    'dried',

    'sorted',

    'transported',

    'sent',

    'removed',

    'crushed',

    'combined',

    'added',

    'boiled',

    'left',

    'poured',

    'labelled',

    'labeled',

    'checked',

    'packed',

    'delivered',

    'washed',

    'compressed',

    'recycled',

    'heated',

    'formed',

    'produced',

    'hatched',

    'emerged',

    'developed',

    'moulded',

    'molded',

    'cooled',

    'screened'

  ];


  const n=
    ' '+norm(text)+' ';


  const a=
    actions.filter(
      x=>
        n.includes(
          ' '+norm(x)+' '
        )
    )
    .length;


  return(
    ratio>=.20
    ||
    a>=3
  );

}


/* =========================================================
   STEP 1 ASSESSMENTS
========================================================= */

function analysisTypeAssessment(text){

  const ok=
    containsAny(
      text,
      task.analysis.type
    );


  return{

    ok,

    hint:
      ok
      ?
      'Em đã xác định đúng dạng của process.'
      :
      'Hãy xem quá trình đi theo một chiều hay tạo thành vòng lặp.'

  };

}


function analysisStagesAssessment(text){

  const raw=
    String(text||'')

    .trim()

    .toLowerCase();


  const expected=
    Number(task.stages);


  let value=
    numberValue(raw);


  /*
    Nếu học sinh nhập:
    "there are seven stages"
    hoặc
    "có bảy giai đoạn"
  */

  if(
    value==null
  ){

    const english=
      raw.match(
        /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|\d+)\b/i
      );


    if(english){

      value=
        numberValue(
          english[1]
        );

    }

  }


  if(
    value==null
  ){

    const viCandidates=[
      'mười lăm',
      'mười bốn',
      'mười ba',
      'mười hai',
      'mười một',
      'bảy',
      'tám',
      'chín',
      'mười',
      'một',
      'hai',
      'ba',
      'bốn',
      'năm',
      'sáu',
      'bay',
      'tam',
      'chin',
      'muoi',
      'mot',
      'bon',
      'nam',
      'sau'
    ];


    const found=
      viCandidates.find(
        x=>
          raw.includes(x)
      );


    if(found){

      value=
        numberValue(found);

    }

  }


  const ok=
    value===expected

    ||

    containsAny(
      text,
      task.analysis.stages||[]
    );


  return{

    ok,

    hint:
      ok
      ?
      `Đúng. Sơ đồ có ${expected} main stages.`
      :
      `Chưa đúng. Bài này có ${expected} main stages. Em có thể nhập “${expected}”, số bằng tiếng Anh hoặc tiếng Việt.`

  };

}


function analysisBoundaryAssessment(
  kind,
  text
){

  const groups=
    processStageGroups();


  const target=
    kind==='first'
    ?
    groups[0]
    :
    groups[
      groups.length-1
    ];


  const source=
    task.analysis?.[kind]
    ||
    [];


  const trimmed=
    String(text||'')
    .trim();


  if(!trimmed){

    return{

      ok:false,

      hint:
        kind==='first'
        ?
        'Hãy ghi công đoạn đầu tiên của process.'
        :
        'Hãy ghi công đoạn cuối cùng của process.'

    };

  }


  const meaningOK=
    stageGroupPosition(
      text,
      target
    )>=0

    ||

    containsAny(
      text,
      source
    );


  /*
    Step 1 dùng rule ghi chú:
    không bắt viết hoa và dấu chấm.
  */

  const lang=
    analysisNoteLanguageIssues(text);


  if(
    !meaningOK
  ){

    return{

      ok:false,

      hint:
        kind==='first'
        ?
        'Chưa đúng công đoạn đầu. Hãy quan sát bước xảy ra đầu tiên trên sơ đồ.'
        :
        'Chưa đúng công đoạn cuối. Hãy quan sát kết quả cuối cùng của process.'

    };

  }


  if(
    lang.length
  ){

    return{

      ok:false,

      hint:
        `Đúng ý nhưng còn lỗi cần sửa: ${lang[0]}`

    };

  }


  /*
    Ketchup:
    collected được chấp nhận nhưng picked/harvested sát hình hơn.
  */

  if(
    ID==='03'
    &&
    kind==='first'
    &&
    /\bcollect(?:ed|ing)?\b/i
    .test(text)
  ){

    return{

      ok:true,

      hint:
        'Đạt. “Collected” được chấp nhận; “picked” hoặc “harvested” chỉ là cách diễn đạt sát hình hơn.'

    };

  }


  return{

    ok:true,

    hint:
      kind==='first'
      ?
      'Đạt. Em đã xác định đúng công đoạn bắt đầu.'
      :
      'Đạt. Em đã xác định đúng công đoạn cuối.'

  };

}


function analysisFeaturesAssessment(text){

  const contentOK=
    importantFeatureScore(text);


  /*
    Important features được viết như câu/ý tổng quan,
    vì vậy vẫn kiểm tra grammar + spelling đầy đủ.
  */

  const all=
    languageIssues(text);


  const serious=
    seriousLanguageIssues(all);


  if(
    !contentOK
  ){

    return{

      ok:false,

      hint:
        'Ý còn thiếu. Nên nêu ít nhất khoảng 3 hành động/công đoạn nổi bật của toàn bộ process.'

    };

  }


  if(
    serious.length
  ){

    return{

      ok:false,

      hint:
        `Đúng ý nhưng chưa đạt về ngữ pháp/chính tả: ${serious.slice(0,2).join(' ')}`

    };

  }


  if(
    all.length
  ){

    return{

      ok:true,

      hint:
        `Đạt về nội dung. Gợi ý nhỏ: ${all[0]}`

    };

  }


  return{

    ok:true,

    hint:
      'Đạt. Em đã nêu được các công đoạn/đặc điểm nổi bật và câu không có lỗi ngữ pháp nghiêm trọng.'

  };

}


function analysisBodyAssessment(
  b1,
  b2
){

  const a=
    validBodyPlan(b1);


  const b=
    validBodyPlan(b2);


  const t=
    a
    &&
    b
    &&
    bodyPlansCompatible(
      b1,
      b2
    );


  return{


    body1:{

      ok:a,

      hint:
        a
        ?
        'Đạt. Đây là một phạm vi stage hợp lệ cho Body 1.'
        :
        `Chưa hợp lý. Có thể nhập “1-3” hoặc mô tả rõ một nhóm stage từ 1 đến ${task.stages}.`

    },


    body2:{

      ok:t,

      hint:
        t
        ?
        'Đạt. Body 2 tiếp nối Body 1 và không chồng stage.'
        :
        b
        ?
        'Body 2 hợp lệ nhưng chưa nối tiếp Body 1 hợp lý.'
        :
        `Body 2 phải nằm trong các stage 1-${task.stages}.`

    }


  };

}


function getAnalysisAssessments(a){

  const b=
    analysisBodyAssessment(
      a.body1,
      a.body2
    );


  return{

    type:
      analysisTypeAssessment(
        a.type
      ),

    stages:
      analysisStagesAssessment(
        a.stages
      ),

    first:
      analysisBoundaryAssessment(
        'first',
        a.first
      ),

    last:
      analysisBoundaryAssessment(
        'last',
        a.last
      ),

    features:
      analysisFeaturesAssessment(
        a.features
      ),

    body1:
      b.body1,

    body2:
      b.body2

  };

}


/* =========================================================
   INLINE FEEDBACK
========================================================= */

function clearInlineFeedback(id){

  const el=
    document.getElementById(
      id
    );


  if(!el){

    return;

  }


  const holder=
    el.parentElement
      ?.querySelector(
        '.inline-feedback'
      );


  if(holder){

    holder.className=
      'inline-feedback';

    holder.innerHTML='';

  }

}


function setInlineFeedback(
  id,
  assessment
){

  const box=
    document.getElementById(id);


  if(!box){

    return;

  }


  const holder=
    box.parentElement
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
      assessment.ok
      ?
      'pass'
      :
      'fail'
    );


  holder.innerHTML=`

<div class="inline-state">

  ${
    assessment.ok
    ?
    '✓ Đạt'
    :
    '✕ Chưa đạt'
  }

</div>

<div class="inline-tip">

  ${esc(
    assessment.hint
    ||
    ''
  )}

</div>

  `;

}


function showAnalysisInline(a){

  setInlineFeedback(
    'aType',
    a.type
  );

  setInlineFeedback(
    'aStages',
    a.stages
  );

  setInlineFeedback(
    'aFirst',
    a.first
  );

  setInlineFeedback(
    'aLast',
    a.last
  );

  setInlineFeedback(
    'aFeatures',
    a.features
  );

  setInlineFeedback(
    'aBody1',
    a.body1
  );

  setInlineFeedback(
    'aBody2',
    a.body2
  );

}


/* =========================================================
   FACT CHECKS
========================================================= */

const FACT_RULES={


  '01':{

    allowedTemperatures:[
      200,
      980,
      870,
      1300
    ],

    allowedHours:[
      24,
      48,
      72
    ],

    linear:true

  },


  '02':{

    linear:true

  },


  '03':{

    allowedHours:[
      2
    ],

    linear:true

  },


  '04':{

    lifeCycle:true

  },


  '05':{

    allowedDays:[
      3,
      4,
      5,
      7,
      9,
      10,
      34,
      36
    ],

    lifeCycle:true

  },


  '06':{

    linear:true

  }


};


function factualIssues(text){

  const out=[];


  const s=
    String(text||'');


  const n=
    norm(s);


  const r=
    FACT_RULES[ID]
    ||
    {};


  if(
    r.linear
    &&
    /\b(?:cyclical|cyclic)\b/i
    .test(s)
  ){

    out.push(
      'Đây là linear process; không nên gọi toàn bộ quá trình là cyclical/cyclic.'
    );

  }


  if(
    r.lifeCycle
    &&
    /\blinear(?:\s+process|\s+sequence)?\b/i
    .test(s)
  ){

    out.push(
      'Đây là life cycle/cyclical process, không nên mô tả toàn bộ quá trình là linear.'
    );

  }


  const c=
    detectStageCountClaim(s);


  const expected=
    Number(task.stages);


  if(
    c.mentioned
    &&
    Number.isFinite(expected)
    &&
    c.count!==expected
  ){

    out.push(
      `Sai số giai đoạn: em viết ${c.count}, nhưng sơ đồ có ${expected} main stages.`
    );

  }


  if(
    ID==='01'
  ){

    let m;


    const tr=
      /\b(\d{2,4})\s*(?:°\s*c|degrees?\s+celsius)\b/gi;


    while(
      (
        m=
        tr.exec(s)
      )
    ){

      const v=
        Number(m[1]);


      if(
        !r.allowedTemperatures.includes(v)
      ){

        out.push(
          `Nhiệt độ ${v}°C không xuất hiện trong sơ đồ Manufacturing Bricks.`
        );

      }

    }


    const hr=
      /\b(\d+)\s*(?:hours?|hrs?)\b/gi;


    while(
      (
        m=
        hr.exec(s)
      )
    ){

      const v=
        Number(m[1]);


      if(
        !r.allowedHours.includes(v)
      ){

        out.push(
          `Mốc ${v} giờ không khớp sơ đồ Manufacturing Bricks.`
        );

      }

    }


    const mp=
      n.indexOf(
        'moderate'
      );


    const hp=
      n.indexOf(
        'high'
      );


    if(
      mp>=0
      &&
      hp>=0
      &&
      hp<mp
    ){

      out.push(
        'Thứ tự nhiệt độ bị đảo: nung ở nhiệt độ vừa trước, sau đó mới ở nhiệt độ cao.'
      );

    }

  }


  if(
    ID==='03'
  ){

    let m;


    const hr=
      /\b(\d+)\s*(?:hours?|hrs?)\b/gi;


    while(
      (
        m=
        hr.exec(s)
      )
    ){

      const v=
        Number(m[1]);


      if(
        v!==2
      ){

        out.push(
          `Mốc ${v} giờ không khớp sơ đồ ketchup; sơ đồ chỉ thể hiện hỗn hợp được để trong 2 giờ.`
        );

      }

    }


    if(

      /\b(?:cool|cools|cooled|cooling)\b[^.!?]{0,50}\b(?:two|2)\s+hours?\b/i
      .test(s)

      ||

      /\b(?:two|2)\s+hours?\b[^.!?]{0,50}\b(?:cool|cools|cooled|cooling)\b/i
      .test(s)

    ){

      out.push(
        'Sơ đồ chỉ cho biết hỗn hợp được để trong 2 giờ; không nói “cooled for two hours”. Nên viết “left to stand for two hours”.'
      );

    }

  }


  if(
    ID==='05'
  ){

    let m;


    const dr=
      /\b(\d+)\s*(?:days?|day)\b/gi;


    while(
      (
        m=
        dr.exec(s)
      )
    ){

      const v=
        Number(m[1]);


      if(
        !r.allowedDays.includes(v)
      ){

        out.push(
          `Mốc ${v} ngày không xuất hiện trong sơ đồ vòng đời ong.`
        );

      }

    }

  }


  return unique(out);

}


/* =========================================================
   STYLE + SEQUENCE
========================================================= */

function styleIssues(
  text,
  step
){

  const out=[];


  const s=
    String(text||'');


  const wc=
    words(s);


  if(
    step===2
  ){

    /*
      Overview ĐƯỢC PHÉP tóm tắt nhiều công đoạn chính.
      Chỉ cảnh báo khi đưa quá nhiều chi tiết số liệu.
    */

    const numbers=
      (
        s.match(
          /\b\d+(?:\s*[-–—]\s*\d+)?\s*(?:°c|degrees?\s+celsius|hours?|hrs?|days?)\b/gi
        )
        ||
        []
      )
      .length;


    if(
      numbers>=2
    ){

      out.push(
        'Overview đang đưa nhiều số liệu chi tiết; các số liệu nhiệt độ/thời gian nên để ở Body paragraphs.'
      );

    }


    if(
      wc>65
    ){

      out.push(
        `Overview khá dài (${wc} từ). Có thể rút gọn để giữ tính khái quát.`
      );

    }

  }


  if(
    /\bscreened\s+via\s+(?:a|the)\s+metal\s+grid\b/i
    .test(s)
  ){

    out.push(
      '“screened via a metal grid” hiểu được, nhưng “passed through a metal grid” tự nhiên hơn.'
    );

  }


  if(
    /\bthen\s+subsequently\b/i
    .test(s)
  ){

    out.push(
      '“then subsequently” bị lặp nghĩa.'
    );

  }


  if(
    /\bafter\s+that\s*,?\s+then\b/i
    .test(s)
  ){

    out.push(
      '“after that, then” bị thừa từ nối.'
    );

  }


  return unique(out);

}


function sequenceAudit(text){

  const groups=
    processStageGroups();


  const found=[];


  groups.forEach(
    (
      g,
      i
    )=>{

      const p=
        stageGroupPosition(
          text,
          g
        );


      if(
        p>=0
      ){

        found.push({

          index:i,

          position:p,

          label:
            g?.[0]
            ||
            `stage ${i+1}`

        });

      }

    }
  );


  if(
    found.length<3
  ){

    return{

      ok:true,

      violations:[],

      found

    };

  }


  const sorted=
    [...found]
    .sort(
      (a,b)=>
        a.position-b.position
    );


  const viol=[];


  for(
    let i=1;
    i<sorted.length;
    i++
  ){

    if(
      sorted[i].index
      <
      sorted[i-1].index
    ){

      viol.push(
        `Công đoạn “${sorted[i].label}” đang được trình bày chưa đúng thứ tự so với sơ đồ.`
      );

    }

  }


  return{

    ok:
      viol.length===0,

    violations:
      unique(viol),

    found

  };

}


function extractOverviewParagraph(text){

  return splitParagraphs(
    text,
    0
  )
  .find(
    p=>
      /\boverall\b|\bin general\b|\bgenerally\b|\bit is clear that\b|\bit can be seen that\b/i
      .test(p)
  )
  ||
  '';

}


function sectionConfig(step){

  return task[
    draftKey(step)
  ];

}


/* =========================================================
   TEMPLATE FUNCTIONAL CHECK
========================================================= */

function templateFunctionScore(
  step,
  text
){

  if(
    step===1
  ){

    const ok1=
      /\b(?:diagram|figure|illustration)\b/i
      .test(text);


    const ok2=
      /\b(?:illustrates?|shows?|depicts?|presents?|demonstrates?)\b/i
      .test(text);


    return{

      score:
        (ok1?5:0)
        +
        (ok2?5:0),

      max:10,

      note:
        ok1
        &&
        ok2
        ?
        'Đúng chức năng template'
        :
        'Có thể paraphrase nhưng cần giữ chức năng mở bài'

    };

  }


  if(
    step===2
  ){

    const kind=
      processKind();


    const overall=
      /\boverall\b|\bin general\b|\bgenerally\b/i
      .test(text);


    let structural=false;


    if(
      kind==='linear'
    ){

      const begin=
        /\bbegin(?:s|ning)?\s+with\b/i
        .test(text);


      const end=
        /\bend(?:s|ing)?\s+with\b/i
        .test(text);


      const badConnector=
        hasBadBeginEndConnector(text);


      structural=
        begin
        &&
        end
        &&
        !badConnector;

    }else if(
      kind==='life'
    ){

      structural=
        /\b(?:life cycle|cycle)\b/i
        .test(text)

        &&

        /\b(?:matur|adult|egg|offspring|new cycle)\w*\b/i
        .test(text);

    }else{

      structural=
        /\b(?:cycle|cyclical|returns?|again)\b/i
        .test(text);

    }


    return{

      score:
        (overall?5:0)
        +
        (structural?5:0),

      max:10,

      note:
        overall
        &&
        structural
        ?
        'Đã vận dụng đúng chức năng Overview template'
        :
        'Không cần chép nguyên văn; cần giữ đúng cấu trúc và chức năng Overview'

    };

  }


  if(
    step===3
  ){

    const marker=
      /\b(?:in the initial stages|initially|at the beginning|to begin with|first(?:ly)?)\b/i
      .test(text);


    const link=
      /\b(?:once|where|which|before being|following this|as it grows|after)\b/i
      .test(text);


    return{

      score:
        (marker?5:0)
        +
        (link?5:0),

      max:10,

      note:
        marker
        &&
        link
        ?
        'Đã vận dụng khung Body 1'
        :
        'Có thể đổi cách diễn đạt nhưng nên có mở nhóm stage + liên kết trình tự'

    };

  }


  if(
    step===4
  ){

    const marker=
      /\b(?:the remaining stages|in the later stages|subsequently|thereafter|after this|following this|finally|at this point)\b/i
      .test(text);


    const ending=
      /\b(?:complet(?:e|es|ed|ing)|final|delivered|new cycle|begin again|returns?)\b/i
      .test(text);


    return{

      score:
        (marker?5:0)
        +
        (ending?5:0),

      max:10,

      note:
        marker
        &&
        ending
        ?
        'Đã vận dụng khung Body 2'
        :
        'Có thể paraphrase; nên có chuyển sang các stage cuối và kết thúc process'

    };

  }


  return{

    score:0,

    max:0,

    note:''

  };

}


/* =========================================================
   GRADING
========================================================= */

function gradeIntroduction(text){

  const wc=
    words(text);


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


  const framing=
    containsAny(
      text,
      [
        'diagram',
        'figure',
        'illustration'
      ]
    );


  const verb=
    containsAny(
      text,
      [
        'illustrates',
        'shows',
        'depicts',
        'presents',
        'demonstrates'
      ]
    );


  const process=
    containsAny(
      text,
      [
        'process',
        'stages',
        'production',
        'manufacturing',
        'manufacture',
        'manufactured',
        'produced',
        'made',
        'recycled',
        'life cycle'
      ]
    );


  const tpl=
    templateFunctionScore(
      1,
      text
    );


  const issues=[];


  if(
    !topic.requiredOK
  ){

    issues.push(
      `Sai hoặc thiếu đối tượng chính. Bài này mô tả “${topic.expected}”.`
    );

  }


  if(
    topic.wrong.length
  ){

    issues.push(
      `Có nội dung không thuộc sơ đồ: “${topic.wrong.join(', ')}”.`
    );

  }


  if(
    !framing
  ){

    issues.push(
      'Introduction chưa thể hiện rõ đây là diagram/figure.'
    );

  }


  if(
    !verb
  ){

    issues.push(
      'Nên dùng illustrates, shows hoặc depicts.'
    );

  }


  if(
    !process
  ){

    issues.push(
      'Chưa diễn đạt rõ đây là process/life cycle.'
    );

  }


  if(
    wc<8
  ){

    issues.push(
      `Câu còn quá ngắn (${wc} từ).`
    );

  }


  facts.forEach(
    x=>
      issues.push(
        'Nội dung/số liệu: '+x
      )
  );


  language.forEach(
    x=>
      issues.push(
        'Ngữ pháp/chính tả: '+x
      )
  );


  const p1=
    topic.requiredOK
    &&
    !topic.wrong.length
    ?
    40
    :
    0;


  const p2=
    framing
    ?
    10
    :
    0;


  const p3=
    verb
    ?
    10
    :
    0;


  const p4=
    process
    ?
    10
    :
    0;


  const p5=
    wc>=8
    ?
    10
    :
    Math.round(
      wc/8*10
    );


  const p6=
    Math.max(
      0,
      10-serious.length*5
    );


  const p7=
    tpl.score;


  let score=
    p1+
    p2+
    p3+
    p4+
    p5+
    p6+
    p7;


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
    facts.length
  ){

    score=
      Math.min(
        score,
        69
      );

  }


  return{

    total:
      Math.min(
        100,
        score
      ),

    completed:
      topic.requiredOK
      &&
      !topic.wrong.length
      &&
      framing
      &&
      verb
      &&
      process
      &&
      wc>=8
      &&
      serious.length===0
      &&
      facts.length===0,

    wc,

    issues,

    breakdown:[

      {
        label:'Đúng đối tượng chính',
        score:p1,
        max:40,

        note:
          topic.requiredOK
          ?
          `Đúng: ${topic.expected}`
          :
          `Phải là ${topic.expected}`
      },

      {
        label:'Dạng sơ đồ',
        score:p2,
        max:10,
        note:framing?'Đạt':'Chưa rõ'
      },

      {
        label:'Động từ mô tả',
        score:p3,
        max:10,
        note:verb?'Phù hợp':'Thiếu'
      },

      {
        label:'Thể hiện process',
        score:p4,
        max:10,
        note:process?'Đạt':'Chưa rõ'
      },

      {
        label:'Độ dài',
        score:p5,
        max:10,
        note:`${wc} từ`
      },

      {
        label:'Ngữ pháp & chính tả',
        score:p6,
        max:10,

        note:
          serious.length
          ?
          `${serious.length} lỗi quan trọng`
          :
          'Ổn'
      },

      {
        label:'Vận dụng template',
        score:p7,
        max:10,
        note:tpl.note
      }

    ]

  };

}


function gradeOverview(text){

  const config=
    task.overview
    ||
    {};


  const wc=
    words(text);


  const language=
    languageIssues(text);


  const serious=
    seriousLanguageIssues(
      language
    );


  const topic=
    topicCheck(text);


  const groups=
    processStageGroups();


  const first=
    containsAny(
      text,
      task.analysis.first||[]
    )

    ||

    stageGroupPosition(
      text,
      groups[0]
    )>=0;


  const last=
    containsAny(
      text,
      task.analysis.last||[]
    )

    ||

    stageGroupPosition(
      text,
      groups[
        groups.length-1
      ]
    )>=0;


  const marker=
    containsAny(
      text,
      [
        'overall',
        'in general',
        'generally',
        'it is clear that',
        'it can be seen that'
      ]
    );


  const hits=
    groupHits(
      text,
      config.concepts||[]
    );


  const ratio=
    hits.length
    ?
    hits.filter(Boolean).length
    /
    hits.length
    :
    1;


  const expected=
    Number(task.stages);


  const claim=
    detectStageCountClaim(text);


  const step1=
    analysisStageCount();


  const countOK=
    !claim.mentioned
    ||
    claim.count===expected;


  const consistent=
    !claim.mentioned
    ||
    step1==null
    ||
    claim.count===step1;


  const facts=
    factualIssues(text);


  const sty=
    styleIssues(
      text,
      2
    );


  const tpl=
    templateFunctionScore(
      2,
      text
    );


  const badBeginEnd=
    hasBadBeginEndConnector(
      text
    );


  const issues=[];


  if(
    topic.wrong.length
  ){

    issues.push(
      `Có nội dung thuộc bài khác: “${topic.wrong.join(', ')}”.`
    );

  }


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
      'Overview chưa thể hiện rõ điểm bắt đầu.'
    );

  }


  if(
    !last
  ){

    issues.push(
      'Overview chưa thể hiện rõ điểm kết thúc.'
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
    claim.mentioned
    &&
    !consistent
    &&
    step1!=null
  ){

    issues.push(
      `Không nhất quán với Bước 1: ${step1} vs ${claim.count}.`
    );

  }


  if(
    ratio<.45
  ){

    issues.push(
      'Overview chưa khái quát đủ đặc điểm chính.'
    );

  }


  if(
    wc<20
  ){

    issues.push(
      `Overview còn khá ngắn (${wc} từ).`
    );

  }


  facts.forEach(
    x=>
      issues.push(
        'Nội dung/số liệu: '+x
      )
  );


  language.forEach(
    x=>
      issues.push(
        'Ngữ pháp/chính tả: '+x
      )
  );


  sty.forEach(
    x=>
      issues.push(
        'Cách viết IELTS Task 1: '+x
      )
  );


  const p1=
    topic.wrong.length
    ?
    0
    :
    10;


  const p2=
    marker
    ?
    10
    :
    0;


  const p3=
    first
    ?
    12
    :
    0;


  const p4=
    last
    ?
    12
    :
    0;


  const p5=
    countOK
    &&
    consistent
    ?
    10
    :
    0;


  const p6=
    Math.round(
      Math.min(
        1,
        ratio/.65
      )
      *
      16
    );


  const p7=
    wc>=20
    ?
    5
    :
    Math.round(
      Math.min(
        1,
        wc/20
      )
      *
      5
    );


  const p8=
    Math.max(
      0,
      15-serious.length*5
    );


  const p9=
    tpl.score;


  const sp=
    Math.min(
      8,
      sty.length*3
    );


  const fp=
    Math.min(
      20,
      facts.length*8
    );


  let score=
    p1+
    p2+
    p3+
    p4+
    p5+
    p6+
    p7+
    p8+
    p9-
    sp-
    fp;


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
        74
      );

  }


  if(
    badBeginEnd
  ){

    score=
      Math.min(
        score,
        79
      );

  }


  score=
    Math.max(
      0,
      Math.min(
        100,
        score
      )
    );


  return{

    total:score,

    completed:
      !topic.wrong.length
      &&
      marker
      &&
      first
      &&
      last
      &&
      countOK
      &&
      consistent
      &&
      ratio>=.45
      &&
      wc>=20
      &&
      serious.length===0
      &&
      facts.length===0
      &&
      !badBeginEnd,

    wc,

    issues,

    breakdown:[

      {
        label:'Đúng chủ đề/process',
        score:p1,
        max:10,

        note:
          topic.wrong.length
          ?
          'Có nội dung bài khác'
          :
          'Đúng'
      },

      {
        label:'Dấu hiệu Overview',
        score:p2,
        max:10,
        note:marker?'Đạt':'Thiếu'
      },

      {
        label:'Điểm bắt đầu',
        score:p3,
        max:12,
        note:first?'Đạt':'Chưa rõ'
      },

      {
        label:'Điểm kết thúc',
        score:p4,
        max:12,
        note:last?'Đạt':'Chưa rõ'
      },

      {
        label:'Số giai đoạn',
        score:p5,
        max:10,

        note:
          claim.mentioned
          ?
          (
            countOK
            ?
            `Đúng: ${claim.count}`
            :
            'Sai'
          )
          :
          'Không bắt buộc nêu'
      },

      {
        label:'Khái quát đặc điểm chính',
        score:p6,
        max:16,
        note:`${Math.round(ratio*100)}%`
      },

      {
        label:'Độ dài',
        score:p7,
        max:5,
        note:`${wc} từ`
      },

      {
        label:'Ngữ pháp & chính tả',
        score:p8,
        max:15,

        note:
          serious.length
          ?
          `${serious.length} lỗi quan trọng`
          :
          'Ổn'
      },

      {
        label:'Vận dụng template',
        score:p9,
        max:10,
        note:tpl.note
      }

    ]

  };

}


function flexibleBodyGrade(
  step,
  text
){

  const config=
    sectionConfig(step)
    ||
    {};


  const groups=
    processStageGroups();


  const hits=
    stageGroupHits(
      text,
      groups
    );


  const hitCount=
    hits.filter(Boolean).length;


  const minHits=
    Math.max(
      2,
      Math.min(
        4,
        Math.ceil(
          groups.length*.18
        )
      )
    );


  const wc=
    words(text);


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


  const sty=
    styleIssues(
      text,
      step
    );


  const seq=
    sequenceAudit(text);


  const connector=
    !config.sequence?.length

    ||

    containsAny(
      text,
      config.sequence
    );


  const tpl=
    templateFunctionScore(
      step,
      text
    );


  let overlap=0;


  if(
    step===4
    &&
    state.drafts.body1
  ){

    const a=
      stageGroupHits(
        state.drafts.body1,
        groups
      );


    const b=
      stageGroupHits(
        text,
        groups
      );


    let c=0;


    for(
      let i=0;
      i<groups.length;
      i++
    ){

      if(
        a[i]
        &&
        b[i]
      ){

        c++;

      }

    }


    if(
      c>=2
    ){

      overlap=
        Math.min(
          12,
          c*4
        );

    }

  }


  const combined=
    step===4
    ?
    String(
      state.drafts.body1||''
    )
    +
    ' '
    +
    String(text||'')
    :
    String(text||'');


  const combinedHits=
    stageGroupHits(
      combined,
      groups
    );


  const combinedRatio=
    combinedHits.length
    ?
    combinedHits.filter(Boolean).length
    /
    combinedHits.length
    :
    0;


  const coverage=
    step===4
    ?
    combinedRatio>=.48
    :
    true;


  const minWords=
    Number(config.minWords)
    ||
    40;


  const p1=
    Math.round(
      Math.min(
        1,
        hitCount/minHits
      )
      *
      50
    );


  const p2=
    wc>=minWords
    ?
    12
    :
    Math.round(
      12
      *
      Math.min(
        1,
        wc/minWords
      )
    );


  const p3=
    connector
    &&
    seq.ok
    ?
    8
    :
    (
      connector
      ||
      seq.ok
      ?
      4
      :
      0
    );


  const p4=
    Math.max(
      0,
      10-serious.length*4
    );


  const p5=
    step===4
    ?
    (
      coverage
      ?
      10
      :
      Math.round(
        combinedRatio/.48*10
      )
    )
    :
    10;


  const p6=
    tpl.score;


  const fp=
    Math.min(
      20,
      facts.length*8
    );


  let score=
    p1+
    p2+
    p3+
    p4+
    p5+
    p6-
    overlap-
    fp;


  score=
    Math.max(
      0,
      Math.min(
        100,
        score
      )
    );


  if(
    topic.wrong.length
  ){

    score=
      Math.min(
        score,
        45
      );

  }


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
    serious.length>=2
  ){

    score=
      Math.min(
        score,
        79
      );

  }


  const issues=[];


  if(
    topic.wrong.length
  ){

    issues.push(
      `Có nội dung thuộc process khác: “${topic.wrong.join(', ')}”.`
    );

  }


  if(
    hitCount<minHits
  ){

    issues.push(
      `Hệ thống nhận ${hitCount} stage, cần khoảng ${minHits} stage trở lên.`
    );

  }


  if(
    wc<minWords
  ){

    issues.push(
      `Đoạn có ${wc} từ; mục tiêu khoảng ${minWords}+ từ.`
    );

  }


  if(
    !connector
  ){

    issues.push(
      'Nên dùng từ/cụm nối để thể hiện trình tự rõ hơn.'
    );

  }


  seq.violations.forEach(
    x=>
      issues.push(
        'Thứ tự stage: '+x
      )
  );


  if(
    step===4
    &&
    !coverage
  ){

    issues.push(
      'Ghép Body 1 và Body 2 vẫn còn nhiều stage chưa được thể hiện.'
    );

  }


  if(
    overlap
  ){

    issues.push(
      'Body 2 đang lặp khá nhiều công đoạn của Body 1.'
    );

  }


  facts.forEach(
    x=>
      issues.push(
        'Nội dung/số liệu: '+x
      )
  );


  language.forEach(
    x=>
      issues.push(
        'Ngữ pháp/chính tả: '+x
      )
  );


  sty.forEach(
    x=>
      issues.push(
        'Diễn đạt: '+x
      )
  );


  return{

    total:score,

    completed:
      !topic.wrong.length
      &&
      hitCount>=minHits
      &&
      wc>=Math.round(
        minWords*.8
      )
      &&
      connector
      &&
      seq.ok
      &&
      coverage
      &&
      overlap===0
      &&
      serious.length===0
      &&
      facts.length===0,

    wc,

    issues,

    breakdown:[

      {
        label:'Nội dung/stages',
        score:p1,
        max:50,
        note:`Nhận diện ${hitCount} stage`
      },

      {
        label:'Độ dài',
        score:p2,
        max:12,
        note:`${wc} từ`
      },

      {
        label:'Trình tự',
        score:p3,
        max:8,

        note:
          seq.ok
          ?
          'Hợp lý'
          :
          `${seq.violations.length} vấn đề`
      },

      {
        label:'Ngữ pháp & chính tả',
        score:p4,
        max:10,

        note:
          serious.length
          ?
          `${serious.length} lỗi quan trọng`
          :
          'Ổn'
      },

      {
        label:
          step===4
          ?
          'Độ bao phủ 2 Body'
          :
          'Độ bao phủ Body 1',

        score:p5,
        max:10,

        note:
          step===4
          ?
          `${Math.round(combinedRatio*100)}% process`
          :
          'Chấm linh hoạt'
      },

      {
        label:'Vận dụng template',
        score:p6,
        max:10,
        note:tpl.note
      }

    ],

    combinedRatio

  };

}


function sectionGrade(
  step,
  text
){

  if(
    step===1
  ){

    return gradeIntroduction(text);

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

    return flexibleBodyGrade(
      step,
      text
    );

  }


  return{

    total:0,

    completed:false,

    issues:[
      'Không xác định được phần cần chấm.'
    ],

    breakdown:[]

  };

}


/* =========================================================
   FULL ESSAY
========================================================= */

function fullGrade(text){

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


  const hasOverview=
    /\boverall\b|\bin general\b|\bgenerally\b|\bit is clear that\b|\bit can be seen that\b/i
    .test(text);


  const claim=
    detectStageCountClaim(text);


  const expected=
    Number(task.stages);


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


  const bodyText=
    pc>=4
    ?
    paras.slice(2).join(' ')
    :
    String(text||'');


  const seq=
    sequenceAudit(
      bodyText
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
        (_,i)=>!hits[i]
      )

      .map(
        g=>g[0]
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
        'Nội dung/số liệu: '+x
      )
  );


  seq.violations.forEach(
    x=>
      issues.push(
        'Thứ tự stage: '+x
      )
  );


  language.forEach(
    x=>
      issues.push(
        'Ngữ pháp/chính tả: '+x
      )
  );


  overviewStyle.forEach(
    x=>
      issues.push(
        'Overview: '+x
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


  let score=
    p1+
    p2+
    p3+
    p4+
    p5-
    fp-
    sp-
    op;


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


  if(
    serious.length>=2
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

    total:score,

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

    paragraphCount:pc,

    issues,

    breakdown:[

      {
        label:'Nội dung & stages',
        score:p1,
        max:55,

        note:
          `Nhận diện ${hitCount}/${groups.length} stage · Bao quát ${Math.round(ratio*100)}%`
      },

      {
        label:'Độ dài',
        score:p2,
        max:20,
        note:`${wc} từ`
      },

      {
        label:'Overview',
        score:p3,
        max:10,
        note:hasOverview?'Có':'Thiếu'
      },

      {
        label:'Cấu trúc đoạn',
        score:p4,
        max:8,
        note:`${pc} đoạn`
      },

      {
        label:'Ngữ pháp & chính tả',
        score:p5,
        max:7,

        note:
          serious.length
          ?
          `${serious.length} lỗi quan trọng`
          :
          'Ổn'
      }

    ]

  };

}


/* =========================================================
   CSS
========================================================= */

const style=`

:root{

  --purple:#281260;

  --purple2:#5d43b0;

  --violet:#7358e7;

  --blue:#2f6fdf;

  --ink:#202636;

  --muted:#6f7890;

  --line:#e1e5ee;

  --bg:#f5f7fb;

  --good:#16845b;

  --goodbg:#f1fbf6;

  --goodline:#bde5ce;

  --warn:#9b6b16;

  --warnbg:#fff9ed;

  --bad:#b83345;

  --badbg:#fff6f7;

  --badline:#efc8ce;

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

  box-shadow:
    0 8px 22px
    rgba(40,18,96,.14);

}


.topin{

  width:min(
    1440px,
    calc(100% - 18px)
  );

  min-height:62px;

  margin:auto;

  display:flex;

  align-items:center;

  justify-content:space-between;

  gap:10px;

}


.left{

  display:flex;

  align-items:center;

  gap:10px;

  min-width:0;

}


.back{

  color:#fff;

  text-decoration:none;

  border:
    1px solid
    rgba(255,255,255,.25);

  padding:7px 10px;

  border-radius:9px;

  font-size:11px;

  font-weight:900;

}


.brand{

  font-weight:950;

  white-space:nowrap;

  overflow:hidden;

  text-overflow:ellipsis;

}


.student{

  font-size:10.5px;

  font-weight:800;

  background:
    rgba(255,255,255,.1);

  border:
    1px solid
    rgba(255,255,255,.18);

  padding:7px 10px;

  border-radius:999px;

}


.page{

  width:min(
    1440px,
    calc(100% - 18px)
  );

  margin:auto;

  padding:
    16px 0 46px;

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

  letter-spacing:-.03em;

}


.hero p{

  margin:
    4px 0 0;

  color:var(--muted);

  font-size:11px;

  line-height:1.5;

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

  width:0;

  background:
    linear-gradient(
      90deg,
      var(--purple2),
      var(--blue)
    );

  transition:.2s;

}


.layout{

  display:grid;

  grid-template-columns:
    420px 1fr;

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

  border:
    1px solid
    var(--line);

  border-radius:17px;

  box-shadow:
    0 8px 24px
    rgba(35,25,75,.04);

}


.diagram{
  padding:14px;
}


.diagramtop{

  display:flex;

  justify-content:space-between;

  align-items:center;

  gap:10px;

  margin-bottom:10px;

}


.diagramtop b{

  color:#21164b;

  font-size:13px;

}


.pill{

  font-size:9px;

  font-weight:900;

  color:#6246bd;

  background:#f0ecff;

  padding:6px 8px;

  border-radius:999px;

}


.imgwrap{

  position:relative;

  border:
    1px solid
    #e4e7ef;

  border-radius:12px;

  overflow:hidden;

  background:#fff;

}


.imgwrap img{

  width:100%;

  display:block;

}


.zoom{

  position:absolute;

  right:8px;

  bottom:8px;

  border:
    1px solid
    #dddff0;

  background:
    rgba(255,255,255,.94);

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

  border:
    1px solid
    #e3def9;

  color:#41355f;

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

  border:
    1px solid
    var(--line);

  background:#fff;

  border-radius:11px;

  padding:9px;

  text-align:left;

  display:grid;

  grid-template-columns:
    34px 1fr;

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

  color:#292f40;

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
    rgba(117,89,232,.07);

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

  cursor:not-allowed;

}


.main{

  min-height:650px;

  padding:20px 22px;

}


.ey{

  display:flex;

  justify-content:space-between;

  align-items:center;

  gap:10px;

  margin-bottom:12px;

}


.chip{

  padding:7px 10px;

  border-radius:999px;

  background:#f0ecff;

  color:#5c43b2;

  font-size:9.5px;

  font-weight:950;

}


.counter{

  font-size:10px;

  color:var(--muted);

  font-weight:850;

}


.main h2{

  margin:
    0 0 5px;

  color:#21164b;

  font-size:22px;

}


.sub{

  margin:
    0 0 14px;

  color:var(--muted);

  font-size:10.8px;

  line-height:1.55;

}


.guide{

  padding:12px 13px;

  border:
    1px solid
    #ded8f4;

  border-radius:12px;

  background:
    linear-gradient(
      135deg,
      #fbfaff,
      #f7f9ff
    );

  margin-bottom:12px;

  color:#545d6f;

  font-size:10.5px;

  line-height:1.55;

}


.guide b{
  color:#4b318e;
}


/* TEMPLATE */

.template-card{

  border:
    1px solid
    #d9d0ff;

  border-radius:14px;

  background:
    linear-gradient(
      135deg,
      #faf8ff,
      #f5f7ff
    );

  margin:
    0 0 14px;

  overflow:hidden;

}


.template-head{

  display:flex;

  justify-content:space-between;

  gap:12px;

  align-items:center;

  padding:12px 13px;

}


.template-head>div{

  display:flex;

  align-items:center;

  gap:8px;

  flex-wrap:wrap;

}


.template-head b{

  color:#2c205e;

  font-size:11px;

}


.template-badge{

  font-size:8.5px;

  font-weight:950;

  letter-spacing:.05em;

  color:#674dc1;

  background:#eee8ff;

  padding:5px 7px;

  border-radius:999px;

}


.template-toggle{

  border:
    1px solid
    #d6cef5;

  background:#fff;

  color:#523b9f;

  border-radius:8px;

  padding:6px 9px;

  font-size:9px;

  font-weight:900;

}


.template-body{

  padding:
    0 13px 13px;

}


.template-text{

  padding:12px;

  border:
    1px dashed
    #bdb0ef;

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

  line-height:1.5;

}


/* STEP 6 */

.independent-card{

  display:flex;

  gap:12px;

  align-items:flex-start;

  margin-bottom:14px;

  padding:13px;

  border:
    1px solid
    #f0cf9c;

  background:#fff9ef;

  border-radius:13px;

}


.independent-icon{

  width:34px;

  height:34px;

  display:grid;

  place-items:center;

  border-radius:10px;

  background:#fff1ce;

  font-size:18px;

  flex:
    0 0 auto;

}


.independent-card b{

  color:#6e4a09;

  font-size:11px;

}


.independent-card p{

  margin:
    4px 0 0;

  color:#776c5a;

  font-size:10px;

  line-height:1.55;

}


.formgrid{

  display:grid;

  grid-template-columns:
    1fr 1fr;

  gap:11px;

}


.field{

  border:
    1px solid
    var(--line);

  border-radius:11px;

  padding:10px;

  background:#fff;

}


.field label{

  display:block;

  color:#303747;

  font-size:10px;

  font-weight:900;

  margin-bottom:6px;

}


.field input,
.field select,
.field textarea{

  width:100%;

  border:
    1px solid
    #cfd4df;

  border-radius:8px;

  padding:9px;

  outline:none;

  background:#fff;

  color:#202636;

  font-size:11px;

}


.field textarea{

  min-height:76px;

  resize:vertical;

}


.field input:focus,
.field textarea:focus,
.field select:focus,
.write:focus{

  border-color:#765ee0;

  box-shadow:
    0 0 0 3px
    rgba(117,89,232,.07);

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

  line-height:1.45;

}


.inline-feedback.pass{

  color:#126b49;

  background:var(--goodbg);

  border:
    1px solid
    var(--goodline);

}


.inline-feedback.fail{

  color:#9d3142;

  background:var(--badbg);

  border:
    1px solid
    var(--badline);

}


.inline-state{

  font-weight:950;

  margin-bottom:2px;

}


.inline-tip{
  opacity:.95;
}


.write{

  width:100%;

  min-height:205px;

  resize:vertical;

  border:
    1px solid
    #cbd2df;

  border-radius:12px;

  padding:13px;

  outline:none;

  color:#202636;

  font-size:12.5px;

  line-height:1.7;

}


.write.full{
  min-height:400px;
}


.writehead{

  display:flex;

  justify-content:space-between;

  align-items:center;

  gap:10px;

  margin:
    8px 0 7px;

  font-size:10.5px;

  font-weight:900;

}


.wc{

  color:#8a91a0;

  font-size:9.5px;

}


.actions{

  display:grid;

  grid-template-columns:
    140px 1fr 140px;

  gap:8px;

  margin-top:11px;

}


.btn{

  border:
    1px solid
    #dcdfe7;

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
      var(--purple),
      #7358e7
    );

  color:#fff;

}


.btn:disabled{

  opacity:.4;

  cursor:not-allowed;

}


.feedback{

  margin-top:12px;

  display:none;

}


.feedback.show{
  display:block;
}


.scorebar{

  display:flex;

  justify-content:space-between;

  align-items:center;

  gap:12px;

  padding:12px 13px;

  border:
    1px solid
    var(--line);

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
  color:var(--warn);
}


.bad{
  color:var(--bad);
}


.detail{

  margin-top:8px;

  padding:11px 12px;

  border:
    1px solid
    #eadfc3;

  background:var(--warnbg);

  border-radius:11px;

  font-size:10.5px;

  line-height:1.55;

}


.detail.goodbox{

  border-color:#bde5ce;

  background:var(--goodbg);

}


.detail.badbox{

  border-color:#efc8ce;

  background:var(--badbg);

}


.detail ul{

  margin:
    6px 0 0;

  padding-left:18px;

}


.reference{

  margin-top:8px;

  padding:11px 12px;

  border:
    1px solid
    #ded7fb;

  background:#f6f4ff;

  border-radius:11px;

  font-size:10.5px;

  line-height:1.6;

}


.reference b{
  color:#4b318e;
}


.finaldone{

  padding:20px;

  text-align:center;

  border:
    1px solid
    #bde5ce;

  background:#f1fbf6;

  border-radius:14px;

  margin-top:10px;

}


.finaldone h3{

  margin:0;

  color:#126d4a;

}


.finaldone p{

  font-size:10.5px;

  color:#65706f;

}


dialog{

  width:min(
    980px,
    96vw
  );

  max-height:92vh;

  border:0;

  border-radius:15px;

  padding:0;

  box-shadow:
    0 25px 80px
    rgba(0,0,0,.28);

}


dialog::backdrop{

  background:
    rgba(12,8,32,.7);

}


.modalhead{

  display:flex;

  justify-content:space-between;

  align-items:center;

  padding:10px 12px;

  border-bottom:
    1px solid
    var(--line);

}


.modalhead button{

  border:
    1px solid
    var(--line);

  background:#fff;

  border-radius:8px;

  padding:6px 9px;

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
      repeat(
        3,
        1fr
      );
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
   MOUNT
========================================================= */

function mount(){

  document.head.insertAdjacentHTML(
    'beforeend',
    `<style>${style}</style>`
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
            ${esc(task.type)}
            ·
            ${task.stages}
            main stages
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
        localStorage.getItem(STUDENT_KEY)
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
          ' · '+s.className
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


  document.getElementById(
    'imgDialog'
  )
  .addEventListener(
    'click',
    e=>{

      if(
        e.target
        ===
        document.getElementById(
          'imgDialog'
        )
      ){

        document.getElementById(
          'imgDialog'
        )
        .close();

      }

    }
  );

}


/* =========================================================
   NAV
========================================================= */

function renderNav(){

  const u=
    unlockIndex();


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
      )=>{

        const cls=[

          i===state.current
          ?
          'active'
          :
          '',

          done(i)
          ?
          'done'
          :
          '',

          i>u
          ?
          'locked'
          :
          ''

        ]

        .filter(Boolean)

        .join(' ');


        return`

<button
  class="
    stepbtn
    ${cls}
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

        `;

      }
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
            Number(
              b.dataset.step
            );


          if(
            i<=unlockIndex()
          ){

            saveCurrentDraft();

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


/* =========================================================
   GUIDES
========================================================= */

function guideFor(step){

  return[

    '<b>Mục tiêu:</b> Nhận diện loại process, số giai đoạn, điểm đầu–cuối, đặc điểm nổi bật và tự chọn cách chia Body 1/Body 2 hợp lý.',

    '<b>Mục tiêu:</b> Dùng template để học cách paraphrase đề bài trong 1 câu. Có thể thay đổi từ vựng, không cần chép nguyên văn.',

    '<b>Mục tiêu:</b> Dùng template để viết Overview đủ cấu trúc chung + đặc điểm nổi bật.',

    '<b>Mục tiêu:</b> Dùng template như khung triển khai Body 1, nhưng nội dung phải bám đúng stage em đã chọn.',

    '<b>Mục tiêu:</b> Dùng template như khung triển khai Body 2, tiếp nối Body 1 và tránh lặp stage.',

    '<b>Mục tiêu:</b> Tự viết toàn bộ bài. Không xem template và không xem lại các đoạn đã viết ở Bước 2–5.'

  ][step];

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
  ${guideFor(0)}
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

  <div
    class="inline-feedback"
  ></div>

</div>


<div class="field">

  <label>
    Có bao nhiêu main stages?
  </label>

  <input
    id="aStages"
    placeholder="Ví dụ: 7 / seven / bảy"
  >

  <div
    class="inline-feedback"
  ></div>

</div>


<div class="field">

  <label>
    First stage là gì?
  </label>

  <textarea
    id="aFirst"
    placeholder="Có thể ghi ngắn gọn: clay is dug"
  ></textarea>

  <div
    class="inline-feedback"
  ></div>

</div>


<div class="field">

  <label>
    Last / return stage là gì?
  </label>

  <textarea
    id="aLast"
    placeholder="Có thể ghi ngắn gọn công đoạn cuối"
  ></textarea>

  <div
    class="inline-feedback"
  ></div>

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

  <div
    class="inline-feedback"
  ></div>

</div>


<div class="field">

  <label>
    Em chọn Body 1 gồm những stage nào?
  </label>

  <textarea
    id="aBody1"
    placeholder="Ví dụ: 1-3"
  ></textarea>

  <div
    class="inline-feedback"
  ></div>

</div>


<div class="field">

  <label>
    Em chọn Body 2 gồm những stage nào?
  </label>

  <textarea
    id="aBody2"
    placeholder="Ví dụ: 4-7"
  ></textarea>

  <div
    class="inline-feedback"
  ></div>

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


  const map={

    aType:'type',

    aStages:'stages',

    aFirst:'first',

    aLast:'last',

    aFeatures:'features',

    aBody1:'body1',

    aBody2:'body2'

  };


  Object.keys(map)
  .forEach(
    id=>{

      document.getElementById(id).value=
        d[
          map[id]
        ]
        ||
        '';

    }
  );


  main
  .querySelectorAll(
    'input,textarea,select'
  )
  .forEach(
    el=>{

      const fn=
        ()=>{

          saveCurrentDraft();

          clearInlineFeedback(
            el.id
          );

        };


      el.addEventListener(
        'input',
        fn
      );


      el.addEventListener(
        'change',
        fn
      );

    }
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
    ()=>goStep(1);


  if(
    state.scores[0]
  ){

    const a=
      state.scores[0].assessments

      ||

      getAnalysisAssessments(
        state.drafts.analysis
      );


    showAnalysisInline(a);

    showAnalysisFeedback(
      state.scores[0]
    );

  }

}


function checkAnalysis(){

  saveCurrentDraft();


  state.attempts[0]=
    attempts(0)+1;


  const a=
    getAnalysisAssessments(
      state.drafts.analysis
    );


  const checks=[

    [
      'Process type',
      a.type.ok
    ],

    [
      'Main stages',
      a.stages.ok
    ],

    [
      'First stage',
      a.first.ok
    ],

    [
      'Last / return stage',
      a.last.ok
    ],

    [
      'Important features',
      a.features.ok
    ],

    [
      'Body 1',
      a.body1.ok
    ],

    [
      'Body 2',
      a.body2.ok
    ]

  ];


  const correct=
    checks
    .filter(
      x=>x[1]
    )
    .length;


  const result={

    checks,

    assessments:a,

    passedCount:correct,

    total:
      Math.round(
        correct
        /
        checks.length
        *
        100
      ),

    completed:
      correct===checks.length

  };


  state.scores[0]=
    result;


  if(
    result.completed
  ){

    completeStep(0);

  }else{

    invalidateFrom(0);

  }


  save();


  showAnalysisInline(a);

  showAnalysisFeedback(result);

  renderNav();

  renderProgress();


  const next=
    document.getElementById(
      'nextBtn'
    );


  if(next){

    next.disabled=
      !done(0);

  }

}


function showAnalysisFeedback(r){

  const f=
    document.getElementById(
      'feedback'
    );


  if(!f){

    return;

  }


  const p=
    Number(
      r.passedCount
      ??
      r.checks
        ?.filter(
          x=>x[1]
        )
        .length
      ??
      0
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
    Đạt ${p}/7 mục
    ·
    Body 1/2 chấm linh hoạt
  </div>

</div>

  `;

}


/* =========================================================
   WRITING UI
========================================================= */

function renderWriting(step){

  const title=
    STEP_NAMES[step];


  const draft=
    state.drafts[
      draftKey(step)
    ]
    ||
    '';


  const full=
    step===5;


  const main=
    document.getElementById(
      'main'
    );


  const support=
    full
    ?
    renderIndependentCard()
    :
    renderTemplateCard(step);


  main.innerHTML=`

<div class="ey">

  <span class="chip">
    BƯỚC ${step+1}
  </span>

  <span class="counter">
    ${esc(title)}
  </span>

</div>


<h2>
  ${esc(title)}
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
  ${guideFor(step)}
</div>


${support}


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
    esc(title)
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
    Kiểm tra & chữa Bước ${step+1} ✓
  </button>

  <button
    id="nextBtn"
    class="btn"
    ${
      done(step)
      &&
      step<5
      ?
      ''
      :
      'disabled'
    }
  >
    ${
      step===5
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
    step>=1
    &&
    step<=4
  ){

    const toggle=
      document.getElementById(
        'templateToggle'
      );


    if(toggle){

      toggle.onclick=
        ()=>{

          state.templateOpen[step]=
            !state.templateOpen[step];


          save();


          const body=
            document.getElementById(
              'templateBody'
            );


          if(body){

            body.hidden=
              !state.templateOpen[step];

          }


          toggle.textContent=
            state.templateOpen[step]
            ?
            'Ẩn template'
            :
            'Xem template';

        };

    }

  }


  updateWordCount();


  document.getElementById(
    'writeBox'
  )
  .addEventListener(
    'input',
    ()=>{

      state.drafts[
        draftKey(step)
      ]=
        document.getElementById(
          'writeBox'
        ).value;


      save();


      updateWordCount();

    }
  );


  document.getElementById(
    'prevBtn'
  )
  .onclick=
    ()=>goStep(
      step-1
    );


  document.getElementById(
    'checkBtn'
  )
  .onclick=
    ()=>checkWriting(step);


  document.getElementById(
    'nextBtn'
  )
  .onclick=
    ()=>{

      if(
        step<5
      ){

        goStep(
          step+1
        );

      }

    };


  if(
    state.scores[step]
  ){

    showWritingFeedback(
      step,
      state.scores[step]
    );

  }

}


function updateWordCount(){

  const c=
    document.getElementById(
      'wordCount'
    );


  const b=
    document.getElementById(
      'writeBox'
    );


  if(
    c
    &&
    b
  ){

    c.textContent=
      `${words(b.value)} từ`;

  }

}


function checkWriting(step){

  saveCurrentDraft();


  state.attempts[step]=
    attempts(step)+1;


  const text=
    state.drafts[
      draftKey(step)
    ]
    ||
    '';


  const result=
    step===5
    ?
    fullGrade(text)
    :
    sectionGrade(
      step,
      text
    );


  state.scores[step]=
    result;


  if(
    result.completed
  ){

    completeStep(step);

  }else{

    invalidateFrom(step);

  }


  save();


  showWritingFeedback(
    step,
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
    step<5
  ){

    next.disabled=
      !done(step);

  }

}


function showWritingFeedback(
  step,
  r
){

  const f=
    document.getElementById(
      'feedback'
    );


  if(!f){

    return;

  }


  f.className=
    'feedback show';


  const showRef=
    step<5
    &&
    !r.completed
    &&
    attempts(step)>=2;


  const ref=
    step<5
    ?
    sectionConfig(step)
      ?.reference
    :
    null;


  const label=
    (
      step===3
      ||
      step===4
    )
    ?
    'Một cách triển khai tham khảo — không phải cách chia duy nhất:'
    :
    'Bài tham khảo:';


  const breakdown=
    r.breakdown?.length
    ?
    `

<div class="detail">

  <b>
    Vì sao được ${r.total}/100?
  </b>

  <ul>

    ${
      r.breakdown
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
    ' — '+esc(x.note)
    :
    ''
  }

</li>

        `
      )
      .join('')
    }

  </ul>

</div>

    `
    :
    '';


  const detail=
    r.issues?.length
    ?
    `

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
      'Phần này đạt yêu cầu nhưng vẫn có điểm có thể cải thiện:'
      :
      'Cần sửa:'
    }
  </b>

  <ul>

    ${
      r.issues
      .map(
        x=>`

<li>
  ${esc(x)}
</li>

        `
      )
      .join('')
    }

  </ul>

</div>

    `
    :
    `

<div class="detail goodbox">

  <b>
    Đạt yêu cầu.
  </b>

  Nội dung, cấu trúc, ngữ pháp và trình tự chính phù hợp.

</div>

    `;


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
    ${attempts(step)}
  </div>

</div>


${breakdown}


${detail}


${
  showRef
  &&
  ref

  ?

  `

<div class="reference">

  <b>
    ${label}
  </b>

  <br>

  ${
    esc(ref)
    .replace(
      /\n/g,
      '<br>'
    )
  }

</div>

  `

  :

  ''
}

  `;


  if(
    step===5
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

  <a
    class="btn primary"
    href="../"
    style="
      display:inline-block;
      text-decoration:none
    "
  >
    Về danh sách Process
  </a>

</div>

    `;

  }

}


/* =========================================================
   GO / RENDER
========================================================= */

function goStep(i){

  saveCurrentDraft();


  if(
    i<0
    ||
    i>unlockIndex()
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

load();

mount();


state.current=
  Math.min(
    Number(
      state.current
    )
    ||
    0,
    unlockIndex()
  );


render();

})();
