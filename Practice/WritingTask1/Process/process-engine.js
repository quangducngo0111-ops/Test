(()=>{
'use strict';

/* =========================================================
   IELTS WRITING TASK 1 · PROCESS ENGINE V21.0
   3-LAYER SMART GRADING (offline / rule + semantic-lite)
   ========================================================= */

console.log('✅ PROCESS ENGINE V21.0 · SMART 3-LAYER');
window.PROCESS_ENGINE_VERSION='V21.0';

/* =========================================================
   TASK CONFIG
   ========================================================= */

const URL_ID=(location.pathname.match(/\/Process\/(\d{1,2})\/?$/i)||[])[1];
const ID=String(window.PROCESS_TASK_ID||URL_ID||'01').padStart(2,'0');

const FALLBACK_TASKS={
  '01':{
    title:'Manufacturing Bricks',
    icon:'🧱',
    image:'bricks.png',
    prompt:'The diagram shows the process by which bricks are manufactured for the building industry.',
    type:'Linear',
    stages:7
  },

  '02':{
    title:'Manufacturing Instant Noodles',
    icon:'🍜',
    image:'instant-noodles.png',
    prompt:'The diagram shows how instant noodles are manufactured.',
    type:'Linear',
    stages:8
  },

  '03':{
    title:'Manufacturing Tomato Ketchup',
    icon:'🍅',
    image:'tomato-ketchup.png',
    prompt:'The diagram shows the process used to produce tomato ketchup.',
    type:'Linear',
    stages:15
  },

  '04':{
    title:'Frog Life Cycle',
    icon:'🐸',
    image:'frog-life-cycle.png',
    prompt:'The diagram shows the life cycle of a frog.',
    type:'Life Cycle',
    stages:11
  },

  '05':{
    title:'Bee Life Cycle',
    icon:'🐝',
    image:'bee-life-cycle.png',
    prompt:'The diagram shows the life cycle of a bee.',
    type:'Life Cycle',
    stages:9
  },

  '06':{
    title:'Recycling Plastic Bottles',
    icon:'♻️',
    image:'plastic-bottles.png',
    prompt:'The diagram shows how plastic bottles are recycled.',
    type:'Linear',
    stages:9
  }
};

const task={
  ...(FALLBACK_TASKS[ID]||FALLBACK_TASKS['01']),
  ...((window.PROCESS_TASKS||{})[ID]||{})
};

const STEP_NAMES=[
  'Phân tích sơ đồ',
  'Introduction',
  'Overview',
  'Body Paragraph 1',
  'Body Paragraph 2',
  'Bài hoàn chỉnh'
];

const STORAGE_KEY=`WT1_PROCESS_V21_${ID}`;

const LEGACY_KEYS=[
  `WT1_PROCESS_V20_1_${ID}`,
  `WT1_PROCESS_V20_${ID}`
];

const STUDENT_KEY='IELTS_PRACTICE_STUDENT';


/* =========================================================
   3-LAYER SEMANTIC STAGE MODELS

   exact    = Tầng 1: cụm từ trực tiếp
   roots    = Tầng 2: họ từ / morphology
   patterns = Tầng 3: paraphrase / semantic-lite
   ========================================================= */

const MODELS={

'01':[

  {
    label:'digging clay',

    exact:[
      'clay is dug',
      'clay is excavated',
      'clay is extracted',
      'dug from the ground',
      'excavated from the ground',
      'extracted from the ground',
      'digger',
      'excavator'
    ],

    roots:[
      'dug',
      'dig',
      'excavat',
      'extract'
    ],

    patterns:[
      /\bclay\b[^.!?]{0,45}\b(?:ground|earth)\b/i,
      /\b(?:digger|excavator)\b/i
    ],

    ref:
      'Clay is first extracted from the ground using a digger.'
  },

  {
    label:'screening / rollers',

    exact:[
      'metal grid',
      'metal screen',
      'passed through a metal grid',
      'screened',
      'roller',
      'rollers',
      'conveyed by rollers',
      'conveyed over a roller'
    ],

    roots:[
      'grid',
      'screen',
      'roller',
      'convey'
    ],

    patterns:[
      /\bclay\b[^.!?]{0,50}\b(?:grid|screen|roller)\b/i
    ],

    ref:
      'It is then passed through a metal grid and conveyed over a roller.'
  },

  {
    label:'mixing and shaping',

    exact:[
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

    roots:[
      'mould',
      'mold',
      'shape',
      'form',
      'mix',
      'combin',
      'wire'
    ],

    patterns:[
      /\b(?:sand|water)\b[^.!?]{0,70}\b(?:mould|mold|wire cutter|brick)\b/i,
      /\b(?:mixture|clay)\b[^.!?]{0,45}\b(?:shap|form|mould|mold)\w*\b/i
    ],

    ref:
      'Sand and water are added, and the resulting mixture is shaped into bricks using either a mould or a wire cutter.'
  },

  {
    label:'drying',

    exact:[
      'drying oven',
      'dried',
      'drying',
      '24-48 hours',
      '24 to 48 hours',
      '24–48 hours'
    ],

    roots:[
      'dry',
      'dri'
    ],

    patterns:[
      /\b(?:oven|24\s*(?:-|to)\s*48\s*hours?)\b/i
    ],

    ref:
      'The newly formed bricks are dried in an oven for 24–48 hours.'
  },

  {
    label:'heating / firing',

    exact:[
      'heated',
      'heating',
      'fired',
      'firing',
      'kiln',
      'kilns',
      'moderate temperature',
      'high temperature',
      'higher temperature',
      '200°c',
      '980°c',
      '870°c',
      '1300°c'
    ],

    roots:[
      'heat',
      'fir',
      'kiln'
    ],

    patterns:[
      /\b(?:200|980|870|1300)\b[^.!?]{0,25}\b(?:celsius|°c)\b/i,
      /\b(?:moderate|high|higher)\b[^.!?]{0,25}\btemperature\b/i
    ],

    ref:
      'They are then fired in two kilns, first at a moderate temperature of 200–980°C and then at a higher temperature of 870–1300°C.'
  },

  {
    label:'cooling',

    exact:[
      'cooling chamber',
      'cooled',
      'cooling',
      '48-72 hours',
      '48 to 72 hours',
      '48–72 hours',
      'two to three days',
      '2 to 3 days'
    ],

    roots:[
      'cool'
    ],

    patterns:[
      /\b(?:48\s*(?:-|to)\s*72\s*hours?|two\s+to\s+three\s+days|2\s+to\s+3\s+days)\b/i
    ],

    ref:
      'Afterwards, the bricks are cooled in a cooling chamber for 48–72 hours.'
  },

  {
    label:'packaging / delivery',

    exact:[
      'packaged',
      'packaging',
      'packed',
      'packing',
      'delivered',
      'delivery',
      'being delivered',
      'transported to customers',
      'transported to consumers'
    ],

    roots:[
      'pack',
      'deliver'
    ],

    patterns:[
      /\b(?:customer|consumer)s?\b/i,
      /\bfinal products?\b[^.!?]{0,40}\b(?:send|transport|deliver)\w*\b/i
    ],

    ref:
      'Finally, the bricks are packaged and delivered.'
  }

],


'02':[

  {
    label:'flour storage',

    exact:[
      'storage silos',
      'storage silo',
      'flour is stored',
      'flour storage'
    ],

    roots:[
      'silo',
      'stor'
    ],

    patterns:[
      /\bflour\b[^.!?]{0,45}\bstor\w*\b/i
    ],

    ref:
      'Flour is stored in storage silos before entering the production line.'
  },

  {
    label:'mixing',

    exact:[
      'mixer',
      'mixed with water and oil',
      'water and oil',
      'mixing'
    ],

    roots:[
      'mix'
    ],

    patterns:[
      /\bflour\b[^.!?]{0,55}\b(?:water|oil)\b/i
    ],

    ref:
      'It is then mixed with water and oil in a mixer.'
  },

  {
    label:'dough sheets',

    exact:[
      'dough sheets',
      'sheets of dough',
      'rolled into sheets',
      'rollers'
    ],

    roots:[
      'sheet',
      'roll'
    ],

    patterns:[
      /\bdough\b[^.!?]{0,45}\b(?:sheet|roll)\w*\b/i
    ],

    ref:
      'The dough passes through rollers and is formed into dough sheets.'
  },

  {
    label:'dough strips',

    exact:[
      'dough strips',
      'strips of dough',
      'cut into strips'
    ],

    roots:[
      'strip'
    ],

    patterns:[
      /\b(?:cut|slice)\w*\b[^.!?]{0,35}\bstrip\w*\b/i
    ],

    ref:
      'These sheets are cut into strips.'
  },

  {
    label:'noodle discs',

    exact:[
      'noodle discs',
      'noodle disks',
      'shaped into discs',
      'formed into discs'
    ],

    roots:[
      'disc',
      'disk'
    ],

    patterns:[
      /\b(?:shape|form)\w*\b[^.!?]{0,35}\b(?:disc|disk)\w*\b/i
    ],

    ref:
      'The strips are then shaped into noodle discs.'
  },

  {
    label:'cooking and drying',

    exact:[
      'cooking in oil',
      'cooked in oil',
      'dried',
      'drying'
    ],

    roots:[
      'cook',
      'dry',
      'dri'
    ],

    patterns:[
      /\boil\b[^.!?]{0,40}\b(?:cook|fry|dry)\w*\b/i
    ],

    ref:
      'The noodle discs are cooked in oil and dried.'
  },

  {
    label:'cups + vegetables/spices',

    exact:[
      'placed in cups',
      'put into cups',
      'vegetables and spices',
      'vegetables',
      'spices'
    ],

    roots:[
      'cup',
      'vegetable',
      'spice'
    ],

    patterns:[
      /\b(?:cup|container)s?\b[^.!?]{0,55}\b(?:vegetable|spice)\w*\b/i
    ],

    ref:
      'They are placed into cups together with vegetables and spices.'
  },

  {
    label:'sealing and labelling',

    exact:[
      'labelled',
      'labeled',
      'labelling',
      'labeling',
      'sealed',
      'sealing'
    ],

    roots:[
      'label',
      'seal'
    ],

    patterns:[
      /\b(?:seal|label)\w*\b/i
    ],

    ref:
      'Finally, the cups are sealed and labelled.'
  }

],


'03':[

  {
    label:'picking tomatoes',

    exact:[
      'pick tomatoes',
      'picked',
      'harvested',
      'collected',
      'put in baskets',
      'placed in baskets'
    ],

    roots:[
      'pick',
      'harvest',
      'collect',
      'basket'
    ],

    patterns:[
      /\btomato\w*\b[^.!?]{0,45}\b(?:pick|harvest|collect)\w*\b/i
    ],

    ref:
      'Ripe tomatoes are picked and placed in baskets.'
  },

  {
    label:'sorting',

    exact:[
      'sort',
      'sorted',
      'good tomatoes',
      'bad tomatoes',
      'classified'
    ],

    roots:[
      'sort',
      'classif'
    ],

    patterns:[
      /\btomato\w*\b[^.!?]{0,45}\b(?:good|bad|quality)\b/i
    ],

    ref:
      'The tomatoes are sorted so that unsuitable ones are removed.'
  },

  {
    label:'transport to factory',

    exact:[
      'sent to factory',
      'transported to factory',
      'taken to factory',
      'processing factory'
    ],

    roots:[
      'transport',
      'factory'
    ],

    patterns:[
      /\b(?:send|take|move|transport)\w*\b[^.!?]{0,45}\bfactor\w*\b/i
    ],

    ref:
      'The selected tomatoes are transported to the factory.'
  },

  {
    label:'remove stalk/seeds/skin',

    exact:[
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

    roots:[
      'stalk',
      'seed',
      'skin'
    ],

    patterns:[
      /\bremove\w*\b[^.!?]{0,60}\b(?:stalk|seed|skin)\w*\b/i
    ],

    ref:
      'At the factory, their stalks, seeds and skins are removed.'
  },

  {
    label:'container',

    exact:[
      'put into a container',
      'placed in a container',
      'put in a container'
    ],

    roots:[
      'container'
    ],

    patterns:[
      /\b(?:place|put)\w*\b[^.!?]{0,35}\bcontainer\b/i
    ],

    ref:
      'The prepared tomatoes are placed in a container.'
  },

  {
    label:'crushing',

    exact:[
      'crushed',
      'crush',
      'crushing',
      'pulp',
      'crushed into pulp'
    ],

    roots:[
      'crush',
      'pulp'
    ],

    patterns:[
      /\btomato\w*\b[^.!?]{0,40}\bpulp\b/i
    ],

    ref:
      'They are then crushed into a pulp.'
  },

  {
    label:'adding ingredients',

    exact:[
      'sugar',
      'vinegar',
      'salt',
      'ingredients are added',
      'additives',
      'combined with ingredients'
    ],

    roots:[
      'sugar',
      'vinegar',
      'salt',
      'ingredient',
      'additive'
    ],

    patterns:[
      /\b(?:add|mix|combin)\w*\b[^.!?]{0,60}\b(?:sugar|vinegar|salt)\b/i
    ],

    ref:
      'Sugar, vinegar and salt are added to the tomato mixture.'
  },

  {
    label:'boiling',

    exact:[
      'boiled',
      'boiling',
      'boil'
    ],

    roots:[
      'boil'
    ],

    patterns:[
      /\bboil\w*\b/i
    ],

    ref:
      'The mixture is boiled.'
  },

  {
    label:'standing two hours',

    exact:[
      'left for two hours',
      'left for 2 hours',
      'left to stand for two hours',
      'left to stand for 2 hours',
      'two hours',
      '2 hours'
    ],

    roots:[
      'stand'
    ],

    patterns:[
      /\b(?:two|2)\s+hours?\b/i
    ],

    ref:
      'It is then left to stand for two hours.'
  },

  {
    label:'bottling',

    exact:[
      'poured into bottles',
      'filled into bottles',
      'bottled',
      'bottles are filled'
    ],

    roots:[
      'bottl',
      'pour',
      'fill'
    ],

    patterns:[
      /\bketchup\b[^.!?]{0,45}\bbottl\w*\b/i
    ],

    ref:
      'The ketchup is poured into bottles.'
  },

  {
    label:'labelling',

    exact:[
      'labelled',
      'labeled',
      'labelling',
      'labeling'
    ],

    roots:[
      'label'
    ],

    patterns:[
      /\blabel\w*\b/i
    ],

    ref:
      'The bottles are labelled.'
  },

  {
    label:'quality control',

    exact:[
      'quality control',
      'quality checked',
      'checked',
      'inspected',
      'inspection'
    ],

    roots:[
      'inspect',
      'check'
    ],

    patterns:[
      /\bquality\b[^.!?]{0,30}\b(?:control|check|inspect)\w*\b/i
    ],

    ref:
      'They then undergo quality control.'
  },

  {
    label:'packing',

    exact:[
      'packed',
      'packaged',
      'boxes',
      'packed into boxes'
    ],

    roots:[
      'pack',
      'box'
    ],

    patterns:[
      /\b(?:pack|place)\w*\b[^.!?]{0,35}\bbox\w*\b/i
    ],

    ref:
      'The checked bottles are packed into boxes.'
  },

  {
    label:'transport to supermarket',

    exact:[
      'supermarket',
      'sent to supermarkets',
      'delivered to supermarkets',
      'transported to supermarkets'
    ],

    roots:[
      'supermarket'
    ],

    patterns:[
      /\b(?:send|deliver|transport)\w*\b[^.!?]{0,45}\bsupermarket\w*\b/i
    ],

    ref:
      'The packaged ketchup is transported to supermarkets.'
  },

  {
    label:'consumption',

    exact:[
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

    roots:[
      'consum',
      'serve',
      'eat',
      'hamburger',
      'fries'
    ],

    patterns:[
      /\b(?:food|hamburger|fries)\b/i
    ],

    ref:
      'Finally, the ketchup is ready to be served with food.'
  }

],


'04':[

  {
    label:'eggs',

    exact:[
      'frog eggs',
      'eggs are laid',
      'lays eggs'
    ],

    roots:[
      'egg',
      'lay'
    ],

    patterns:[
      /\badult frog\w*\b[^.!?]{0,40}\begg\w*\b/i
    ],

    ref:
      'The cycle begins when adult frogs lay eggs.'
  },

  {
    label:'embryos',

    exact:[
      'embryo',
      'embryos',
      'embryonic'
    ],

    roots:[
      'embry'
    ],

    patterns:[
      /\bembry\w*\b/i
    ],

    ref:
      'Embryos develop inside the eggs.'
  },

  {
    label:'tadpoles on plants',

    exact:[
      'tadpoles clinging to water plants',
      'tadpoles cling to water plants',
      'water plants'
    ],

    roots:[
      'tadpole',
      'plant',
      'cling'
    ],

    patterns:[
      /\btadpole\w*\b[^.!?]{0,45}\bplant\w*\b/i
    ],

    ref:
      'The resulting tadpoles cling to water plants.'
  },

  {
    label:'external gills',

    exact:[
      'external gills',
      'gills',
      'breathing'
    ],

    roots:[
      'gill',
      'breath'
    ],

    patterns:[
      /\bgill\w*\b/i
    ],

    ref:
      'They develop external gills for breathing.'
  },

  {
    label:'tail grows',

    exact:[
      'tail keeps growing',
      'tail grows',
      'growing tail'
    ],

    roots:[
      'tail',
      'grow'
    ],

    patterns:[
      /\btail\b[^.!?]{0,25}\b(?:grow|long)\w*\b/i
    ],

    ref:
      'As the tadpoles grow, their tails become longer.'
  },

  {
    label:'hind legs',

    exact:[
      'hindlegs appear',
      'hind legs appear',
      'hind legs',
      'back legs'
    ],

    roots:[
      'hind',
      'back leg'
    ],

    patterns:[
      /\b(?:hind|back)\b[^.!?]{0,20}\bleg\w*\b/i
    ],

    ref:
      'Hind legs then begin to appear.'
  },

  {
    label:'food in tail',

    exact:[
      'food stored in the tail',
      'stored in the tail'
    ],

    roots:[
      'stored',
      'food'
    ],

    patterns:[
      /\bfood\b[^.!?]{0,40}\btail\b/i
    ],

    ref:
      'At this stage, the tadpoles rely on food stored in their tails.'
  },

  {
    label:'front legs',

    exact:[
      'front legs appear',
      'front legs'
    ],

    roots:[
      'front leg'
    ],

    patterns:[
      /\bfront\b[^.!?]{0,20}\bleg\w*\b/i
    ],

    ref:
      'Front legs subsequently develop.'
  },

  {
    label:'tail shortens',

    exact:[
      'tail becomes shorter',
      'tail shortens',
      'shorter tail'
    ],

    roots:[
      'shorten'
    ],

    patterns:[
      /\btail\b[^.!?]{0,30}\b(?:short|shrink|reduce)\w*\b/i
    ],

    ref:
      'The tail then becomes shorter.'
  },

  {
    label:'young frog',

    exact:[
      'young frog',
      'froglet'
    ],

    roots:[
      'froglet'
    ],

    patterns:[
      /\byoung\b[^.!?]{0,15}\bfrog\w*\b/i
    ],

    ref:
      'A young frog is formed.'
  },

  {
    label:'adult frog',

    exact:[
      'adult frog',
      'mature frog'
    ],

    roots:[
      'adult',
      'mature'
    ],

    patterns:[
      /\b(?:adult|mature)\b[^.!?]{0,18}\bfrog\w*\b/i
    ],

    ref:
      'Finally, it develops into an adult frog, allowing the cycle to continue.'
  }

],


'05':[

  {
    label:'eggs laid',

    exact:[
      'female lays eggs',
      'females lay eggs',
      'eggs are laid',
      'one or two eggs',
      '1 or 2 eggs',
      'every three days'
    ],

    roots:[
      'egg',
      'lay'
    ],

    patterns:[
      /\b(?:female|bee)\w*\b[^.!?]{0,45}\begg\w*\b/i
    ],

    ref:
      'Female bees lay one or two eggs every three days.'
  },

  {
    label:'eggs hatch',

    exact:[
      'eggs hatch',
      'hatch after 9',
      '9-10 days',
      '9 to 10 days'
    ],

    roots:[
      'hatch'
    ],

    patterns:[
      /\b(?:9|nine)\s*(?:-|to)?\s*(?:10|ten)?\s*days?\b/i
    ],

    ref:
      'The eggs hatch after about 9–10 days.'
  },

  {
    label:'five-day development',

    exact:[
      '5 days',
      'five days'
    ],

    roots:[
      'five'
    ],

    patterns:[
      /\b(?:5|five)\s+days?\b/i
    ],

    ref:
      'The young bees then develop for a further five days.'
  },

  {
    label:'first moulting',

    exact:[
      'first moulting',
      'first molting',
      'first moult',
      'first molt'
    ],

    roots:[
      'moult',
      'molt'
    ],

    patterns:[
      /\bfirst\b[^.!?]{0,25}\b(?:moult|molt)\w*\b/i
    ],

    ref:
      'They undergo a first moulting stage.'
  },

  {
    label:'seven-day development',

    exact:[
      '7 days',
      'seven days'
    ],

    roots:[
      'seven'
    ],

    patterns:[
      /\b(?:7|seven)\s+days?\b/i
    ],

    ref:
      'After another seven days, further development takes place.'
  },

  {
    label:'second moulting',

    exact:[
      'second moulting',
      'second molting',
      'second moult',
      'second molt'
    ],

    roots:[
      'moult',
      'molt'
    ],

    patterns:[
      /\bsecond\b[^.!?]{0,25}\b(?:moult|molt)\w*\b/i
    ],

    ref:
      'A second moulting stage follows.'
  },

  {
    label:'nine-day development',

    exact:[
      '9 days',
      'nine days'
    ],

    roots:[
      'nine'
    ],

    patterns:[
      /\b(?:9|nine)\s+days?\b/i
    ],

    ref:
      'Nine days later, the bee continues to mature.'
  },

  {
    label:'young adult',

    exact:[
      'young adult emerges',
      'young adult',
      'emerges'
    ],

    roots:[
      'emerg',
      'young adult'
    ],

    patterns:[
      /\byoung\b[^.!?]{0,20}\badult\b/i
    ],

    ref:
      'A young adult then emerges.'
  },

  {
    label:'maturity',

    exact:[
      '4 days to maturity',
      'four days to maturity',
      'maturity',
      'mature bee'
    ],

    roots:[
      'matur'
    ],

    patterns:[
      /\b(?:4|four)\s+days?\b[^.!?]{0,35}\bmatur\w*\b/i
    ],

    ref:
      'Finally, the young adult takes about four days to reach maturity.'
  }

],


'06':[

  {
    label:'recycling bins',

    exact:[
      'recycling bin',
      'recycle bin',
      'placed in recycling bins',
      'put in recycling bins',
      'discarded'
    ],

    roots:[
      'bin',
      'discard'
    ],

    patterns:[
      /\bplastic bottle\w*\b[^.!?]{0,50}\bbin\w*\b/i
    ],

    ref:
      'Used plastic bottles are placed in recycling bins.'
  },

  {
    label:'collection truck',

    exact:[
      'collection truck',
      'collected',
      'collection',
      'transported'
    ],

    roots:[
      'collect',
      'truck',
      'transport'
    ],

    patterns:[
      /\btruck\b[^.!?]{0,45}\b(?:collect|transport)\w*\b/i
    ],

    ref:
      'They are collected and transported by truck.'
  },

  {
    label:'sorting',

    exact:[
      'recycling centre',
      'recycling center',
      'sorting',
      'sorted'
    ],

    roots:[
      'sort',
      'centre',
      'center'
    ],

    patterns:[
      /\brecycling\b[^.!?]{0,35}\b(?:centre|center)\b/i
    ],

    ref:
      'At a recycling centre, the bottles are sorted.'
  },

  {
    label:'compression',

    exact:[
      'compressed',
      'compressing',
      'compressed into blocks',
      'blocks'
    ],

    roots:[
      'compress'
    ],

    patterns:[
      /\b(?:block|bale)s?\b/i
    ],

    ref:
      'The selected bottles are compressed into blocks.'
  },

  {
    label:'crushing and washing',

    exact:[
      'crushed',
      'crushing',
      'washed',
      'washing',
      'crushing and washing'
    ],

    roots:[
      'crush',
      'wash'
    ],

    patterns:[
      /\b(?:crush|wash)\w*\b/i
    ],

    ref:
      'The plastic is then crushed and washed.'
  },

  {
    label:'pellets',

    exact:[
      'plastic pellets',
      'pellets',
      'producing plastic pellets',
      'made into pellets'
    ],

    roots:[
      'pellet'
    ],

    patterns:[
      /\bpellet\w*\b/i
    ],

    ref:
      'Next, it is processed into plastic pellets.'
  },

  {
    label:'heating pellets',

    exact:[
      'heated',
      'heating pellets',
      'pellets are heated'
    ],

    roots:[
      'heat'
    ],

    patterns:[
      /\bpellet\w*\b[^.!?]{0,45}\bheat\w*\b/i
    ],

    ref:
      'The pellets are heated to form raw material.'
  },

  {
    label:'raw material',

    exact:[
      'raw material',
      'formed into raw material',
      'plastic raw material'
    ],

    roots:[
      'raw material'
    ],

    patterns:[
      /\braw\b[^.!?]{0,20}\bmaterial\w*\b/i
    ],

    ref:
      'This raw material is prepared for manufacturing.'
  },

  {
    label:'new products',

    exact:[
      'end products',
      'new products',
      'producing end products',
      'recycled products'
    ],

    roots:[
      'product',
      'manufactur'
    ],

    patterns:[
      /\b(?:new|end|recycled)\b[^.!?]{0,25}\bproduct\w*\b/i
    ],

    ref:
      'Finally, it is used to produce new end products.'
  }

]

};


const BRICKS_BODY1_MODEL=
  'In the initial stages, clay is excavated and processed before being shaped into bricks. '+
  'The clay is first extracted from the ground using an excavator before being screened through a metal grid. '+
  'The filtered clay is then conveyed by a set of rotating rollers, after which it is combined with sand and water '+
  'and shaped into bricks using either a mould or a wire cutter, in preparation for the subsequent stages.';


/* =========================================================
   STATE
   ========================================================= */

let state={
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
    analysis:{
      type:'',
      stages:'',
      first:'',
      last:'',
      features:'',
      body1:'',
      body2:''
    },

    intro:'',
    overview:'',
    body1:'',
    body2:'',
    full:''
  },

  scores:{}
};


function loadState(){

  try{

    let raw=
      localStorage.getItem(
        STORAGE_KEY
      );

    let fromLegacy=false;

    if(!raw){

      for(
        const k
        of
        LEGACY_KEYS
      ){

        raw=
          localStorage.getItem(k);

        if(raw){

          fromLegacy=true;

          break;

        }

      }

    }

    const s=
      JSON.parse(
        raw
        ||
        'null'
      );

    if(!s){
      return;
    }

    state={
      ...state,
      ...s,

      scores:
        fromLegacy
        ?
        {}
        :
        (
          s.scores
          ||
          {}
        ),

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

    if(fromLegacy){

      saveState();

    }

  }catch(e){

    console.warn(
      'State load failed:',
      e
    );

  }

}


function saveState(){

  try{

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );

  }catch(e){

    console.warn(
      'State save failed:',
      e
    );

  }

}


function isDone(i){

  return state.completed.includes(i);

}


function attempts(i){

  return Number(
    state.attempts[i]
    ||
    0
  );

}


function markDone(i){

  if(
    !isDone(i)
  ){

    state.completed.push(i);

  }

  state.completed=[
    ...new Set(
      state.completed
    )
  ]
  .sort(
    (a,b)=>a-b
  );

  saveState();

}


function invalidateFrom(i){

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

  saveState();

}


function unlockedMax(){

  let u=0;

  for(
    let i=0;
    i<6;
    i++
  ){

    if(
      isDone(i)
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


/* =========================================================
   NORMALIZATION + SMART 3-TIER MATCHER
   ========================================================= */

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
      /[–—]/g,
      '-'
    )

    .replace(
      /[^a-z0-9°%'\s-]/g,
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


function wordCount(v){

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


function model(){

  return MODELS[ID]
    ||
    [];

}


function padded(text){

  return ` ${norm(text)} `;

}


function phrasePosition(
  text,
  phrase
){

  const q=
    norm(phrase);

  if(!q){
    return -1;
  }

  return padded(text)
    .indexOf(
      ` ${q} `
    );

}


function tokenPosition(
  text,
  root
){

  const n=
    norm(text);

  const safe=
    String(root)
    .replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

  const re=
    new RegExp(
      `\\b${safe}[a-z]*\\b`,
      'i'
    );

  const m=
    re.exec(n);

  return m
    ?
    m.index
    :
    -1;

}


function regexPosition(
  text,
  re
){

  const flags=
    re.flags.includes('g')
    ?
    re.flags.replace(
      'g',
      ''
    )
    :
    re.flags;

  const r=
    new RegExp(
      re.source,
      flags
    );

  const m=
    r.exec(
      String(text||'')
    );

  return m
    ?
    m.index
    :
    -1;

}


/* =========================================================
   SMART STAGE MATCHING — 3 TẦNG
   ========================================================= */

function stageEvidence(
  text,
  stage,
  index
){

  /* ---------- Tầng 1: exact phrase ---------- */

  const exactHits=[];

  for(
    const p
    of
    stage.exact
    ||
    []
  ){

    const pos=
      phrasePosition(
        text,
        p
      );

    if(
      pos>=0
    ){

      exactHits.push({
        value:p,
        pos
      });

    }

  }

  if(
    exactHits.length
  ){

    const best=
      exactHits
      .sort(
        (a,b)=>a.pos-b.pos
      )[0];

    return{
      matched:true,
      confidence:1,
      tier:1,
      reason:
        `Cụm trực tiếp: ${best.value}`,
      pos:
        best.pos,
      index,
      label:
        stage.label
    };

  }


  /* ---------- Tầng 2: word family ---------- */

  const rootHits=[];

  for(
    const r
    of
    stage.roots
    ||
    []
  ){

    const pos=
      tokenPosition(
        text,
        r
      );

    if(
      pos>=0
    ){

      rootHits.push({
        value:r,
        pos
      });

    }

  }

  if(
    rootHits.length
  ){

    const best=
      rootHits
      .sort(
        (a,b)=>a.pos-b.pos
      )[0];

    return{
      matched:true,
      confidence:.84,
      tier:2,
      reason:
        `Họ từ: ${best.value}`,
      pos:
        best.pos,
      index,
      label:
        stage.label
    };

  }


  /* ---------- Tầng 3: paraphrase / semantic-lite ---------- */

  const semanticHits=[];

  for(
    const re
    of
    stage.patterns
    ||
    []
  ){

    const pos=
      regexPosition(
        text,
        re
      );

    if(
      pos>=0
    ){

      semanticHits.push({
        value:
          re.source,
        pos
      });

    }

  }

  if(
    semanticHits.length
  ){

    const best=
      semanticHits
      .sort(
        (a,b)=>a.pos-b.pos
      )[0];

    return{
      matched:true,
      confidence:.68,
      tier:3,
      reason:
        'Paraphrase/ngữ nghĩa tương đương',
      pos:
        best.pos,
      index,
      label:
        stage.label
    };

  }


  return{
    matched:false,
    confidence:0,
    tier:0,
    reason:'',
    pos:-1,
    index,
    label:
      stage.label
  };

}


function smartStageEvidence(text){

  return model()
    .map(
      (
        s,
        i
      )=>
        stageEvidence(
          text,
          s,
          i+1
        )
    );

}


function smartStageHits(text){

  return smartStageEvidence(text)
    .map(
      x=>x.matched
    );

}


function stagePosition(
  text,
  stage,
  index
){

  const ev=
    stageEvidence(
      text,
      stage,
      index
      ||
      model()
      .indexOf(stage)+1
    );

  return ev.matched
    ?
    ev.pos
    :
    -1;

}


function stageHits(text){

  return smartStageHits(text);

}


function splitParagraphs(text){

  return String(text||'')

    .replace(
      /\r\n?/g,
      '\n'
    )

    .trim()

    .split(
      /\n+/
    )

    .map(
      x=>x.trim()
    )

    .filter(Boolean);

}


/* =========================================================
   NUMBER / RANGE
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

  mot:1,
  hai:2,
  ba:3,
  bon:4,
  nam:5,
  sau:6,
  bay:7,
  tam:8,
  chin:9,
  muoi:10
};


function numberValue(v){

  let s=
    norm(v)

    .replace(
      /\bmain stages?\b/g,
      ''
    )

    .replace(
      /\bstages?\b/g,
      ''
    )

    .replace(
      /\bgiai doan\b/g,
      ''
    )

    .trim();


  if(
    /^\d+$/.test(s)
  ){

    return Number(s);

  }


  if(
    NUMBER_WORDS[s]
    !=
    null
  ){

    return NUMBER_WORDS[s];

  }


  const m=
    s.match(
      /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\b/
    );


  if(m){

    return /^\d+$/.test(
      m[1]
    )
    ?
    Number(
      m[1]
    )
    :
    NUMBER_WORDS[
      m[1]
    ];

  }


  for(
    const [k,n]
    of
    Object.entries(
      NUMBER_WORDS
    )
  ){

    if(
      new RegExp(
        `\\b${k}\\b`
      )
      .test(s)
    ){

      return n;

    }

  }


  return null;

}


function parseRange(v){

  const s=
    norm(v)

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

    const a=
      Number(
        m[1]
      );

    const b=
      Number(
        m[2]
      );


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

    const n=
      Number(s);

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


/* =========================================================
   STUDENT PLAN
   ========================================================= */

function bodyPlan(step){

  if(
    step!==3
    &&
    step!==4
  ){

    return null;

  }


  const raw=
    step===3
    ?
    state.drafts.analysis.body1
    :
    state.drafts.analysis.body2;


  const r=
    parseRange(raw);

  const total=
    model().length;


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

    stages:
      Array.from(
        {
          length:
            r.end-r.start+1
        },
        (_,i)=>
          r.start+i
      ),

    label:
      `stage ${r.start}–${r.end}`
  };

}


function planCoverage(
  text,
  p
){

  if(!p){

    return{
      covered:0,
      total:0,
      ratio:0,
      missing:[],
      evidence:[]
    };

  }


  const evidence=
    smartStageEvidence(text)

    .filter(
      x=>
        p.stages.includes(
          x.index
        )
    );


  const matched=
    evidence.filter(
      x=>x.matched
    );


  return{
    covered:
      matched.length,

    total:
      p.stages.length,

    ratio:
      p.stages.length
      ?
      matched.length
      /
      p.stages.length
      :
      0,

    missing:
      evidence.filter(
        x=>!x.matched
      )
      .map(
        x=>x.index
      ),

    evidence
  };

}


function outsidePlanStages(
  text,
  p
){

  if(!p){

    return[];

  }


  return smartStageEvidence(text)

    .filter(
      x=>
        x.matched
        &&
        !p.stages.includes(
          x.index
        )
    )

    .map(
      x=>x.index
    );

}


/* =========================================================
   SEQUENCE
   ========================================================= */

function sentenceSplit(text){

  return String(text||'')

    .replace(
      /\s+/g,
      ' '
    )

    .trim()

    .split(
      /(?<=[.!?])\s+/
    )

    .map(
      x=>x.trim()
    )

    .filter(Boolean);

}


function stripTopicSentence(
  text,
  p
){

  const sentences=
    sentenceSplit(text);


  if(
    sentences.length<2
  ){

    return String(
      text
      ||
      ''
    );

  }


  const first=
    sentences[0];

  const rest=
    sentences
    .slice(1)
    .join(' ');


  const broad=
    /\b(?:initial stages?|remaining stages?|later stages?|these stages?|the process|the procedure)\b/i
    .test(first)

    ||

    /\b(?:consist(?:s)? of|deal(?:s)? with|involv(?:e|es)|include(?:s)?|followed by)\b/i
    .test(first);


  const restHits=
    p
    ?
    p.stages.filter(
      n=>
        stageEvidence(
          rest,
          model()[n-1],
          n
        )
        .matched
    )
    .length
    :
    smartStageEvidence(rest)
    .filter(
      x=>x.matched
    )
    .length;


  return broad
    &&
    restHits>=2
    ?
    rest
    :
    String(
      text
      ||
      ''
    );

}


function sequenceForPlan(
  text,
  p
){

  if(!p){

    return{
      ok:true,
      issues:[]
    };

  }


  const detail=
    stripTopicSentence(
      text,
      p
    );


  const found=
    p.stages

    .map(
      n=>
        stageEvidence(
          detail,
          model()[n-1],
          n
        )
    )

    .filter(
      x=>x.matched
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
      found[i].index
      <
      found[i-1].index
    ){

      issues.push(
        `Stage ${found[i].index} (${found[i].label}) đang được trình bày trước stage ${found[i-1].index} (${found[i-1].label}).`
      );

    }

  }


  return{
    ok:
      !issues.length,

    issues
  };

}


function fullEssaySequence(text){

  const paras=
    splitParagraphs(text);


  if(
    paras.length<4
  ){

    return{
      ok:true,
      issues:[]
    };

  }


  const r1=
    sequenceForPlan(
      paras[2]
      ||
      '',
      bodyPlan(3)
    );


  const r2=
    sequenceForPlan(
      paras
      .slice(3)
      .join(' '),

      bodyPlan(4)
    );


  return{
    ok:
      r1.ok
      &&
      r2.ok,

    issues:
      uniq([
        ...(r1.issues||[]),
        ...(r2.issues||[])
      ])
  };

}


/* =========================================================
   LANGUAGE LAYER
   ========================================================= */

const TYPO={

  manufactoring:'manufacturing',
  manufactureing:'manufacturing',

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


function spellingIssues(text){

  const out=[];


  for(
    const w
    of
    (
      String(text||'')
      .toLowerCase()
      .match(
        /[a-z]+/g
      )
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
    .test(text)
  ){

    out.push(
      'Dùng “ripe tomatoes”, không dùng “rip tomatoes”.'
    );

  }


  return uniq(out);

}


function grammarIssues(
  text,
  {
    note=false
  }={}
){

  const s=
    String(text||'')
    .trim();

  const out=[];


  if(!s){

    return[
      'Chưa có câu trả lời.'
    ];

  }


  if(!note){

    for(
      const p
      of
      splitParagraphs(s)
    ){

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


    if(
      !/[.!?]$/.test(s)
    ){

      out.push(
        'Nên kết thúc bằng dấu câu.'
      );

    }

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


  if(
    /\bbegins?\s+with\b[^.!?]{0,180}\bto\s+ends?\s+with\b/i
    .test(s)
  ){

    out.push(
      'Dùng “begins with ... and ends with ...”, không dùng “begins with ... to ends with ...”.'
    );

  }


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


  const coord=
    s.match(
      /\b(?:is|are|was|were)\s+([a-z]+ed)\s*,\s*([a-z]+ed)\s+before\b/i
    );


  if(coord){

    out.push(
      `Cấu trúc song song chưa tự nhiên: nên viết “${coord[1]} and ${coord[2]} before ...”.`
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
    ID==='01'
    &&
    /\b(?:heated|fired)\s+in\s+(?:a|one)\s+kiln\b[^.!?]{0,220}\band\s+(?:another|a second)\s+kiln\b/i
    .test(s)
    &&
    !/\band\s+in\s+(?:another|a second)\s+kiln\b/i
    .test(s)
  ){

    out.push(
      'Cấu trúc song song ở phần nung chưa tự nhiên: nên viết “heated in two kilns: first ... and then ...” hoặc “in one kiln ... and in another kiln ...”.'
    );

  }


  const ag=[

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
    ]

  ];


  ag.forEach(
    (
      [
        r,
        m
      ]
    )=>{

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
      Number(m[1])
      !==
      1
    ){

      out.push(
        `“${m[0]}” chưa đúng: dùng “degrees Celsius”.`
      );

    }

  }


  /*
    Bricks:
    Roller không được hiểu là crushing stage.
  */

  if(
    ID==='01'
    &&
    (
      /\brollers?\b[^.!?]{0,60}\b(?:crush(?:es|ed|ing)?|grind(?:s|ing)?|break(?:s|ing)?\s+down)\b/i
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


  return uniq(out);

}


function languageIssues(
  text,
  opts={}
){

  return uniq([
    ...grammarIssues(
      text,
      opts
    ),

    ...spellingIssues(
      text
    )
  ]);

}


/* =========================================================
   FACT + PRECISION LAYER
   ========================================================= */

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


function precisionIssues(text){

  const s=
    String(text||'');

  const out=[];


  if(
    ID==='01'
    &&
    /\b(?:metal\s+grid|grid)\b[^.!?]{0,80}\bto\s+(?:remove|filter\s+out|eliminate)\s+(?:larger\s+)?(?:particles?|impurities?|debris)\b/i
    .test(s)
  ){

    out.push(
      'Sơ đồ không ghi rõ metal grid dùng để loại bỏ particles/impurities. Để bám sát hình hơn, chỉ cần viết clay is passed/screened through a metal grid.'
    );

  }


  return out;

}


/* =========================================================
   STEP 1 ANALYSIS
   ========================================================= */

function expectedType(){

  const t=
    norm(
      task.type
    );


  return t.includes(
    'life'
  )
  ?
  'life cycle'
  :
  t.includes(
    'cyc'
  )
  ?
  'cyclical'
  :
  'linear';

}


/* =========================================================
   IMPORTANT FEATURES — 3 LAYER ASSESSMENT
   ========================================================= */

function featureAssessment(text){

  const ev=
    smartStageEvidence(text);

  const matched=
    ev.filter(
      x=>x.matched
    );

  const lang=
    languageIssues(text);

  const names=
    matched.map(
      x=>x.label
    );


  return{

    ok:
      matched.length>=3
      &&
      lang.length===0,

    count:
      matched.length,

    names,

    evidence:
      matched,

    language:
      lang,

    hint:
      matched.length>=3

      ?

      (
        lang[0]
        ||
        `Đạt · Nhận diện ${matched.length} công đoạn: ${names.join(', ')}.`
      )

      :

      `Chưa đủ · Hệ thống mới nhận diện ${matched.length} công đoạn${names.length?`: ${names.join(', ')}`:''}. Hãy nêu ít nhất 3 công đoạn/đặc điểm nổi bật.`

  };

}


function assessAnalysis(){

  const a=
    state.drafts.analysis;

  const stages=
    model();

  const total=
    Number(
      task.stages
      ||
      stages.length
    );


  const typeOK=
    norm(
      a.type
    )
    .includes(
      norm(
        expectedType()
      )
      .split(' ')[0]
    );


  const stagesOK=
    numberValue(
      a.stages
    )
    ===
    total;


  const firstOK=
    stageEvidence(
      a.first,
      stages[0],
      1
    )
    .matched;


  const lastOK=
    stageEvidence(
      a.last,
      stages[
        stages.length-1
      ],
      stages.length
    )
    .matched;


  const feat=
    featureAssessment(
      a.features
    );


  const r1=
    parseRange(
      a.body1
    );


  const r2=
    parseRange(
      a.body2
    );


  const body1OK=
    r1.valid
    &&
    r1.start>=1
    &&
    r1.end<=total;


  const body2OK=
    r2.valid
    &&
    r2.start>=1
    &&
    r2.end<=total
    &&
    body1OK
    &&
    r1.end<r2.start;


  return{

    type:{
      ok:typeOK,

      hint:
        typeOK
        ?
        'Đúng dạng process.'
        :
        'Hãy xác định đây là linear, cyclical hay life cycle.'
    },


    stages:{
      ok:stagesOK,

      hint:
        stagesOK
        ?
        'Đúng số main stages.'
        :
        'Chưa đúng. Hãy quan sát và đếm lại các main stages.'
    },


    first:{
      ok:
        firstOK
        &&
        languageIssues(
          a.first,
          {
            note:true
          }
        )
        .length===0,

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
        languageIssues(
          a.last,
          {
            note:true
          }
        )
        .length===0,

      hint:
        lastOK
        ?
        'Đúng công đoạn cuối. Ở Bước 1 không bắt buộc viết hoa/dấu chấm.'
        :
        'Chưa đúng công đoạn cuối.'
    },


    features:{
      ok:
        feat.ok,

      hint:
        feat.hint,

      meta:
        feat
    },


    body1:{
      ok:
        body1OK,

      hint:
        body1OK
        ?
        'Đạt. Đây là phạm vi stage hợp lệ cho Body 1.'
        :
        'Hãy nhập một phạm vi stage hợp lệ cho Body 1.'
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
   TEMPLATES
   ========================================================= */

const TEMPLATES={

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


function kind(){

  const t=
    norm(
      task.type
    );


  return t.includes(
    'life'
  )
  ?
  'life'
  :
  t.includes(
    'cyc'
  )
  ?
  'cyclical'
  :
  'linear';

}


function templateFor(step){

  const set=
    TEMPLATES[
      kind()
    ]
    ||
    TEMPLATES.linear;


  return({
    1:set.intro,
    2:set.overview,
    3:set.body1,
    4:set.body2
  })[step]
  ||
  '';

}


function dynamicReference(step){

  const p=
    bodyPlan(step);


  if(!p){

    return '';

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
        model()[n-1]
        ?.ref
    )

    .filter(Boolean)

    .join(' ');

}


/* =========================================================
   TOPIC
   ========================================================= */

function containsAny(
  text,
  arr=[]
){

  const n=
    padded(text);


  return arr.some(
    x=>{

      const q=
        norm(x);


      return q
        &&
        n.includes(
          ` ${q} `
        );

    }
  );

}


function topicCheck(text){

  const sets={

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

  };


  const r=
    sets[ID]
    ||
    {
      need:[],
      bad:[],
      label:''
    };


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
   3-LAYER SCORING

   Tầng 1: Nội dung / ngữ nghĩa
   Tầng 2: Logic / trình tự / cấu trúc
   Tầng 3: Ngôn ngữ IELTS
   ========================================================= */

function scoreLayer(
  label,
  score,
  max,
  note=''
){

  return{
    label,

    score:
      Math.max(
        0,
        Math.min(
          max,
          Math.round(score)
        )
      ),

    max,

    note
  };

}


/* =========================================================
   INTRODUCTION
   ========================================================= */

function gradeIntro(text){

  const wc=
    wordCount(text);

  const topic=
    topicCheck(text);

  const language=
    languageIssues(text);


  const framing=
    /\b(?:diagram|figure|illustration)\b/i
    .test(text);


  const verb=
    /\b(?:illustrates?|shows?|depicts?|presents?|demonstrates?)\b/i
    .test(text);


  const process=
    /\b(?:process|stages|production|manufactur|recycl|life cycle)\w*/i
    .test(text);


  const L1=
    (
      topic.ok
      &&
      !topic.wrong.length
      ?
      35
      :
      0
    )
    +
    (
      process
      ?
      15
      :
      0
    );


  const L2=
    (
      framing
      ?
      10
      :
      0
    )
    +
    (
      verb
      ?
      10
      :
      0
    );


  const L3=
    Math.max(
      0,
      30-language.length*8
    )

    +

    (
      wc>=8
      ?
      0
      :
      -Math.min(
        10,
        8-wc
      )
    );


  let score=
    Math.max(
      0,
      Math.min(
        100,
        L1+L2+L3
      )
    );


  if(
    !topic.ok
    ||
    topic.wrong.length
  ){

    score=
      Math.min(
        score,
        49
      );

  }


  const issues=[];


  if(
    !topic.ok
    ||
    topic.wrong.length
  ){

    issues.push(
      `Đối tượng chính phải là ${topic.label}.`
    );

  }


  if(!framing){

    issues.push(
      'Chưa thể hiện rõ đây là diagram/figure.'
    );

  }


  if(!verb){

    issues.push(
      'Nên dùng illustrates/shows/depicts.'
    );

  }


  if(!process){

    issues.push(
      'Chưa thể hiện rõ process/life cycle.'
    );

  }


  language.forEach(
    x=>
      issues.push(
        'Ngữ pháp/chính tả: '
        +
        x
      )
  );


  return{

    total:
      score,


    completed:
      score>=85
      &&
      !issues.length,


    issues,


    breakdown:[

      scoreLayer(
        'Tầng 1 · Nội dung/ngữ nghĩa',
        L1,
        50,
        topic.ok
        ?
        'Đúng chủ đề'
        :
        'Cần sửa chủ đề'
      ),


      scoreLayer(
        'Tầng 2 · Cấu trúc chức năng',
        L2,
        20,
        'Diagram + reporting verb'
      ),


      scoreLayer(
        'Tầng 3 · Ngôn ngữ IELTS',
        L3,
        30,
        `${wc} từ · ${language.length?language.length+' lỗi':'Ổn'}`
      )

    ]
  };

}


/* =========================================================
   OVERVIEW
   ========================================================= */

function gradeOverview(text){

  const wc=
    wordCount(text);

  const language=
    languageIssues(text);

  const facts=
    factualIssues(text);

  const topic=
    topicCheck(text);


  const marker=
    /\boverall\b|\bin general\b|\bgenerally\b/i
    .test(text);


  const ev=
    smartStageEvidence(text);


  const first=
    ev[0]
    ?.matched;


  const last=
    ev.at(-1)
    ?.matched;


  const hits=
    ev.filter(
      x=>x.matched
    )
    .length;


  const ratio=
    model().length
    ?
    hits
    /
    model().length
    :
    0;


  const L1=
    (
      topic.wrong.length
      ?
      0
      :
      10
    )

    +

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
    )

    +

    Math.round(
      Math.min(
        1,
        ratio/.55
      )
      *
      20
    );


  const L2=
    (
      marker
      ?
      15
      :
      0
    )

    +

    (
      facts.length
      ?
      0
      :
      5
    );


  const L3=
    Math.max(
      0,
      20-language.length*6
    )

    +

    (
      wc>=20
      ?
      0
      :
      -Math.min(
        5,
        Math.ceil(
          (20-wc)/4
        )
      )
    );


  let score=
    Math.max(
      0,
      Math.min(
        100,
        L1+L2+L3
      )
    );


  if(
    facts.length
  ){

    score=
      Math.min(
        score,
        79
      );

  }


  const issues=[];


  if(!marker){

    issues.push(
      'Chưa có dấu hiệu mở Overview rõ ràng.'
    );

  }


  if(!first){

    issues.push(
      'Chưa thể hiện rõ điểm bắt đầu.'
    );

  }


  if(!last){

    issues.push(
      'Chưa thể hiện rõ điểm kết thúc.'
    );

  }


  if(
    ratio<.35
  ){

    issues.push(
      'Overview chưa khái quát đủ đặc điểm chính.'
    );

  }


  language.forEach(
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


  return{

    total:
      score,


    completed:
      score>=85
      &&
      !issues.length,


    issues,


    breakdown:[

      scoreLayer(
        'Tầng 1 · Nội dung/ngữ nghĩa',
        L1,
        60,
        `Nhận diện ${hits}/${model().length} stage`
      ),


      scoreLayer(
        'Tầng 2 · Overview & tính chính xác',
        L2,
        20,
        marker
        ?
        'Có Overall'
        :
        'Thiếu Overall'
      ),


      scoreLayer(
        'Tầng 3 · Ngôn ngữ IELTS',
        L3,
        20,
        `${wc} từ · ${language.length?language.length+' lỗi':'Ổn'}`
      )

    ]
  };

}


/* =========================================================
   BODY 1 / BODY 2
   ========================================================= */

function gradeBody(
  step,
  text
){

  const p=
    bodyPlan(step);


  const wc=
    wordCount(text);


  const coverage=
    planCoverage(
      text,
      p
    );


  const sequence=
    sequenceForPlan(
      text,
      p
    );


  const outside=
    outsidePlanStages(
      text,
      p
    );


  const language=
    languageIssues(text);


  const facts=
    factualIssues(text);


  const precision=
    precisionIssues(text);


  /* ---------- Layer 1: Meaning ---------- */

  const L1=
    Math.round(
      (
        p
        ?
        coverage.ratio
        :
        0
      )
      *
      60
    );


  /* ---------- Layer 2: Logic ---------- */

  const L2=
    (
      sequence.ok
      ?
      12
      :
      4
    )

    +

    (
      p
      &&
      outside.length<=1
      ?
      8
      :
      Math.max(
        0,
        8-(outside.length-1)*3
      )
    )

    -

    (
      facts.length
      ?
      10
      :
      0
    );


  /* ---------- Layer 3: Language ---------- */

  const L3=
    Math.max(
      0,
      20-language.length*5
    )

    +

    (
      wc>=40
      ?
      0
      :
      -Math.min(
        8,
        Math.ceil(
          (40-wc)/5
        )
      )
    );


  let score=
    Math.max(
      0,
      Math.min(
        100,
        L1+L2+L3
        -
        Math.min(
          2,
          precision.length
        )
      )
    );


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
    language.length>=3
  ){

    score=
      Math.min(
        score,
        79
      );

  }


  const issues=[];


  if(!p){

    issues.push(
      'Hệ thống chưa đọc được phạm vi Body đã chọn ở Bước 1.'
    );

  }


  if(
    p
    &&
    coverage.missing.length
  ){

    issues.push(
      `Theo cách chia em đã chọn (${p.label}), còn thiếu hoặc chưa rõ stage: ${coverage.missing.join(', ')}.`
    );

  }


  if(
    outside.length>=2
  ){

    issues.push(
      `Đoạn này đang triển khai khá nhiều stage ngoài phạm vi ${p?.label}: ${outside.join(', ')}.`
    );

  }


  sequence.issues.forEach(
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


  facts.forEach(
    x=>
      issues.push(
        'Nội dung/số liệu: '
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


  return{

    total:
      score,


    completed:
      score>=85
      &&
      !!p
      &&
      coverage.ratio>=.75
      &&
      sequence.ok
      &&
      !facts.length
      &&
      !language.length,


    issues,


    breakdown:[

      scoreLayer(
        'Tầng 1 · Nội dung/ngữ nghĩa',
        L1,
        60,
        p
        ?
        `${coverage.covered}/${coverage.total} stage theo ${p.label}`
        :
        'Chưa đọc được plan'
      ),


      scoreLayer(
        'Tầng 2 · Trình tự & bám plan',
        L2,
        20,
        sequence.ok
        ?
        'Trình tự phù hợp'
        :
        'Cần sửa trình tự'
      ),


      scoreLayer(
        'Tầng 3 · Ngôn ngữ IELTS',
        L3,
        20,
        `${wc} từ · ${language.length?language.length+' lỗi':'Ổn'}`
      )

    ],


    reference:
      dynamicReference(step)
  };

}


/* =========================================================
   FULL ESSAY
   ========================================================= */

function gradeFull(text){

  const wc=
    wordCount(text);


  const paras=
    splitParagraphs(text);


  const topic=
    topicCheck(text);


  const language=
    languageIssues(text);


  const facts=
    factualIssues(text);


  const precision=
    precisionIssues(text);


  const seq=
    fullEssaySequence(text);


  const ev=
    smartStageEvidence(text);


  const hitCount=
    ev.filter(
      x=>x.matched
    )
    .length;


  const ratio=
    ev.length
    ?
    hitCount
    /
    ev.length
    :
    0;


  const overview=
    paras.find(
      p=>
        /\boverall\b|\bin general\b|\bgenerally\b/i
        .test(p)
    );


  const L1=
    Math.round(
      ratio*60
    )

    +

    (
      topic.ok
      &&
      !topic.wrong.length
      ?
      0
      :
      -25
    );


  const L2=
    (
      overview
      ?
      8
      :
      0
    )

    +

    (
      paras.length>=4
      ?
      6
      :
      Math.round(
        Math.min(
          1,
          paras.length/4
        )
        *
        6
      )
    )

    +

    (
      seq.ok
      ?
      6
      :
      0
    )

    -

    (
      facts.length
      ?
      10
      :
      0
    );


  const L3=
    Math.max(
      0,
      20-language.length*4
    )

    +

    (
      wc>=150
      ?
      0
      :
      -Math.min(
        8,
        Math.ceil(
          (150-wc)/20
        )
      )
    );


  let score=
    Math.max(
      0,
      Math.min(
        100,
        L1+L2+L3
        -
        Math.min(
          3,
          precision.length
        )
      )
    );


  if(
    !topic.ok
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
        79
      );

  }


  if(
    language.length>=4
  ){

    score=
      Math.min(
        score,
        79
      );

  }


  const issues=[];


  if(
    !topic.ok
    ||
    topic.wrong.length
  ){

    issues.push(
      `Đối tượng chính phải là ${topic.label}.`
    );

  }


  if(
    wc<150
  ){

    issues.push(
      `Bài hiện có ${wc} từ; IELTS Writing Task 1 nên có ít nhất 150 từ.`
    );

  }


  if(!overview){

    issues.push(
      'Chưa thấy Overview rõ ràng.'
    );

  }


  if(
    paras.length<4
  ){

    issues.push(
      `Hệ thống đang nhận ${paras.length} đoạn. Chỉ cần Enter 1 lần để sang đoạn mới.`
    );

  }


  if(
    ratio<.72
  ){

    issues.push(
      'Bài vẫn còn thiếu một số stage quan trọng.'
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


  language.forEach(
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


  precision.forEach(
    x=>
      issues.push(
        'Gợi ý bám sát sơ đồ: '
        +
        x
      )
  );


  return{

    total:
      score,


    completed:
      score>=85

      &&

      !issues.filter(
        x=>
          !x.startsWith(
            'Gợi ý bám sát'
          )
      )
      .length,


    issues,


    breakdown:[

      scoreLayer(
        'Tầng 1 · Nội dung/ngữ nghĩa',
        L1,
        60,
        `Nhận diện ${hitCount}/${ev.length} stage · ${Math.round(ratio*100)}%`
      ),


      scoreLayer(
        'Tầng 2 · Cấu trúc/trình tự',
        L2,
        20,
        `${paras.length} đoạn · ${overview?'Có Overview':'Thiếu Overview'}`
      ),


      scoreLayer(
        'Tầng 3 · Ngôn ngữ IELTS',
        L3,
        20,
        `${wc} từ · ${language.length?language.length+' lỗi':'Ổn'}`
      )

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
   UI CSS
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
  border:
    1px solid
    #ffffff40;
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
  border:
    1px solid
    #ffffff30;
  padding:7px 10px;
  border-radius:999px;
}

.page{
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
}

.hero p{
  margin:
    4px 0 0;
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
  border:
    1px solid
    #e4e7ef;
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
  border:
    1px solid
    #dddff0;
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
  border:
    1px solid
    #e3def9;
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
}

.guide{
  padding:12px 13px;
  border:
    1px solid
    #ded8f4;
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
  border:
    1px solid
    #d9d0ff;
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
}

.independent-card{
  margin-bottom:14px;
  padding:13px;
  border:
    1px solid
    #f0cf9c;
  background:#fff9ef;
  border-radius:13px;
  font-size:10.5px;
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
  border:
    1px solid
    #cfd4df;
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
  border:
    1px solid
    #bde5ce;
}

.inline-feedback.fail{
  color:#9d3142;
  background:var(--badbg);
  border:
    1px solid
    #efc8ce;
}

.inline-state{
  font-weight:950;
  margin-bottom:2px;
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
  font-size:12.5px;
  line-height:1.7;
}

.write.full{
  min-height:400px;
}

.writehead{
  margin:
    8px 0 7px;
  font-size:10.5px;
  font-weight:900;
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
      var(--p),
      var(--v)
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
  border:
    1px solid
    #eadfc3;
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
  border:
    1px solid
    #ded7fb;
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
  border:
    1px solid
    #bde5ce;
  background:var(--goodbg);
  border-radius:14px;
  margin-top:10px;
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
}

dialog::backdrop{
  background:#0c0820b3;
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
   RENDER HELPERS
   ========================================================= */

function currentDraftKey(step){

  return[
    'analysis',
    'intro',
    'overview',
    'body1',
    'body2',
    'full'
  ][step];

}


function saveCurrentDraft(){

  if(
    state.current===0
  ){

    state.drafts.analysis={

      type:
        document.getElementById(
          'aType'
        )
        ?.value
        ||
        '',


      stages:
        document.getElementById(
          'aStages'
        )
        ?.value
        ||
        '',


      first:
        document.getElementById(
          'aFirst'
        )
        ?.value
        ||
        '',


      last:
        document.getElementById(
          'aLast'
        )
        ?.value
        ||
        '',


      features:
        document.getElementById(
          'aFeatures'
        )
        ?.value
        ||
        '',


      body1:
        document.getElementById(
          'aBody1'
        )
        ?.value
        ||
        '',


      body2:
        document.getElementById(
          'aBody2'
        )
        ?.value
        ||
        ''

    };

  }else{

    const box=
      document.getElementById(
        'writeBox'
      );


    if(box){

      state.drafts[
        currentDraftKey(
          state.current
        )
      ]=
        box.value;

    }

  }


  saveState();

}


function templateCard(step){

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

<div class="template-card">

  <div class="template-head">

    <div>

      <span class="template-badge">
        TEMPLATE HỖ TRỢ
      </span>

      <b>
        ${STEP_NAMES[step]}
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
        templateFor(step)
      )}
    </div>

    <div class="template-note">
      Em có thể dùng khung này nhưng không cần chép nguyên văn.
    </div>

  </div>

</div>

  `;

}


function guide(step){

  return[

    '<b>Mục tiêu:</b> Nhận diện loại process, số giai đoạn, điểm đầu–cuối, đặc điểm nổi bật và tự chọn cách chia Body 1/Body 2 hợp lý.',

    '<b>Mục tiêu:</b> Dùng template để paraphrase đề bài trong 1 câu.',

    '<b>Mục tiêu:</b> Viết Overview gồm cấu trúc chung và đặc điểm nổi bật.',

    '<b>Mục tiêu:</b> Viết Body 1 đúng các stage em đã chọn ở Bước 1.',

    '<b>Mục tiêu:</b> Viết Body 2 đúng các stage em đã chọn ở Bước 1.',

    '<b>Mục tiêu:</b> Tự viết toàn bộ bài, không dùng template.'

  ][step];

}


/* =========================================================
   MOUNT
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
        Chấm 3 tầng: ngữ nghĩa · trình tự/cấu trúc · ngôn ngữ IELTS.
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


/* =========================================================
   NAV / PROGRESS
   ========================================================= */

function renderNav(){

  const u=
    unlockedMax();


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
      isDone(i)
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
        isDone(i)
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
    btn=>{

      btn.onclick=
        ()=>{

          const i=
            Number(
              btn.dataset.step
            );


          if(
            i<=unlockedMax()
          ){

            saveCurrentDraft();

            state.current=i;

            saveState();

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
   STEP 1 UI
   ========================================================= */

function inlineFeedback(
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


function renderAnalysis(){

  const d=
    state.drafts.analysis;


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
  Hệ thống chấm 3 tầng và hiển thị kết quả ngay dưới từng mục.
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
      isDone(0)
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


  const fields={

    aType:'type',
    aStages:'stages',
    aFirst:'first',
    aLast:'last',
    aFeatures:'features',
    aBody1:'body1',
    aBody2:'body2'

  };


  for(
    const [
      id,
      k
    ]
    of
    Object.entries(
      fields
    )
  ){

    document.getElementById(
      id
    )
    .value=
      d[k]
      ||
      '';

  }


  main
  .querySelectorAll(
    'input,textarea,select'
  )
  .forEach(
    el=>{

      el.addEventListener(
        'input',
        saveCurrentDraft
      );


      el.addEventListener(
        'change',
        saveCurrentDraft
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

    showAnalysisResult(
      state.scores[0]
    );

  }

}


function checkAnalysis(){

  saveCurrentDraft();


  state.attempts[0]=
    attempts(0)+1;


  const a=
    assessAnalysis();


  const list=[

    a.type,
    a.stages,
    a.first,
    a.last,
    a.features,
    a.body1,
    a.body2

  ];


  const passed=
    list.filter(
      x=>x.ok
    )
    .length;


  const result={

    assessments:a,

    passed,

    total:
      Math.round(
        passed/7*100
      ),

    completed:
      passed===7

  };


  state.scores[0]=
    result;


  if(
    result.completed
  ){

    markDone(0);

  }else{

    invalidateFrom(0);

  }


  saveState();


  showAnalysisResult(
    result
  );


  renderNav();

  renderProgress();


  const next=
    document.getElementById(
      'nextBtn'
    );


  if(next){

    next.disabled=
      !isDone(0);

  }

}


function showAnalysisResult(result){

  const a=
    result.assessments
    ||
    assessAnalysis();


  const map={

    aType:'type',

    aStages:'stages',

    aFirst:'first',

    aLast:'last',

    aFeatures:'features',

    aBody1:'body1',

    aBody2:'body2'

  };


  Object.entries(
    map
  )
  .forEach(
    (
      [
        id,
        k
      ]
    )=>
      inlineFeedback(
        id,
        a[k]
      )
  );


  const f=
    document.getElementById(
      'feedback'
    );


  if(!f){

    return;

  }


  f.className=
    'feedback show';


  f.innerHTML=`

<div class="scorebar">

  <div>

    <div class="score">
      ${result.total}/100
    </div>


    <div
      class="
        status
        ${
          result.completed
          ?
          'good'
          :
          'warn'
        }
      "
    >

      ${
        result.completed
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
      result.passed
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

function renderWriting(step){

  const main=
    document.getElementById(
      'main'
    );


  const full=
    step===5;


  const draft=
    state.drafts[
      currentDraftKey(step)
    ]
    ||
    '';


  main.innerHTML=`

<div class="ey">

  <span class="chip">
    BƯỚC ${step+1}
  </span>

  <span class="counter">
    ${STEP_NAMES[step]}
  </span>

</div>


<h2>
  ${STEP_NAMES[step]}
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
  ${guide(step)}
</div>


${
  full
  ?
  `

<div class="independent-card">

  <b>
    ✍️ Bước tự viết — không còn template
  </b>

  <p>
    Hãy tự viết Introduction, Overview, Body 1 và Body 2.
  </p>

</div>

  `
  :
  templateCard(step)
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
    esc(
      STEP_NAMES[step]
    )
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
      isDone(step)
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


          saveState();


          document.getElementById(
            'templateBody'
          )
          .hidden=
            !state.templateOpen[step];


          toggle.textContent=
            state.templateOpen[step]
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
        `${wordCount(box.value)} từ`;

    };


  update();


  box.addEventListener(
    'input',
    ()=>{

      state.drafts[
        currentDraftKey(step)
      ]=
        box.value;


      saveState();

      update();

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

    showWritingResult(
      step,
      state.scores[step]
    );

  }

}


function checkWriting(step){

  saveCurrentDraft();


  state.attempts[step]=
    attempts(step)+1;


  const result=
    grade(
      step,
      state.drafts[
        currentDraftKey(step)
      ]
      ||
      ''
    );


  state.scores[step]=
    result;


  if(
    result.completed
  ){

    markDone(step);

  }else{

    invalidateFrom(step);

  }


  saveState();


  showWritingResult(
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
      !isDone(step);

  }

}


function showWritingResult(
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


  const p=
    (
      step===3
      ||
      step===4
    )
    ?
    bodyPlan(step)
    :
    null;


  const reference=
    (
      step===3
      ||
      step===4
    )
    ?
    (
      r.reference
      ||
      dynamicReference(step)
    )
    :
    null;


  const showRef=
    step<5
    &&
    !r.completed
    &&
    attempts(step)>=2
    &&
    reference;


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


<div class="detail">

  <b>
    Chấm theo 3 tầng:
  </b>

  <ul>
    ${breakdown}
  </ul>

</div>


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
  ?
  `

<div class="reference">

  <b>

    ${
      p
      ?
      `Bài mẫu theo cách chia em đã chọn (${p.label}):`
      :
      'Bài tham khảo:'
    }

  </b>


  <div
    class="
      reference-answer
      notranslate
    "
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
    🎉 Hoàn thành ${esc(task.title)}
  </h3>

  <p>
    Em đã hoàn thành đủ 6 bước.
  </p>

</div>

    `;

  }

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function goStep(i){

  saveCurrentDraft();


  if(
    i<0
    ||
    i>unlockedMax()
  ){

    return;

  }


  state.current=i;


  saveState();


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

try{

  loadState();


  mount();


  state.current=
    Math.min(
      Number(
        state.current
      )
      ||
      0,
      unlockedMax()
    );


  render();

}
catch(err){

  console.error(
    'PROCESS ENGINE FATAL ERROR:',
    err
  );


  document.body.innerHTML=`

<div
  style="
    max-width:900px;
    margin:60px auto;
    padding:24px;
    font-family:Arial,sans-serif;
    border:1px solid #efc8ce;
    border-radius:16px;
    background:#fff6f7;
    color:#7d2634;
  "
>

  <h2 style="margin-top:0">
    Không thể tải bài Process
  </h2>


  <p>
    JavaScript gặp lỗi khi khởi tạo.
    Mở DevTools → Console để xem lỗi chi tiết.
  </p>


  <pre
    style="
      white-space:pre-wrap;
      background:#fff;
      padding:12px;
      border-radius:8px;
    "
  >${esc(
    String(
      err?.message
      ||
      err
    )
  )}</pre>

</div>

  `;

}

})();
