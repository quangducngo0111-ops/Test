(()=>{
'use strict';

/* =========================================================
   BASIC DATA
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

const STEP_NAMES=[
  'Phân tích sơ đồ',
  'Introduction',
  'Overview',
  'Body Paragraph 1',
  'Body Paragraph 2',
  'Bài hoàn chỉnh'
];

function studentScope(){
  try{
    const s=JSON.parse(
      localStorage.getItem(STUDENT_KEY)||'null'
    );

    if(s?.name){
      return encodeURIComponent(
        (
          s.name
          +'|'
          +(s.className||'')
        ).toLowerCase()
      );
    }
  }catch(e){}

  return 'guest';
}

const STORAGE_KEY=
  'WT1_PROCESS_GUIDED_V6_'
  +studentScope()
  +'::'
  +ID;

let state={
  current:0,
  completed:[],
  attempts:{},
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


/* =========================================================
   STORAGE
========================================================= */

function load(){
  try{
    const saved=JSON.parse(
      localStorage.getItem(STORAGE_KEY)||'null'
    );

    if(saved){
      state={
        ...state,
        ...saved,
        drafts:{
          ...state.drafts,
          ...(saved.drafts||{}),
          analysis:{
            ...state.drafts.analysis,
            ...(saved.drafts?.analysis||{})
          }
        }
      };
    }
  }catch(e){}
}

function save(){
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
}


/* =========================================================
   HELPERS
========================================================= */

function norm(value){
  return String(value||'')
    .toLowerCase()
    .replace(/[’‘]/g,"'")
    .replace(/[^a-z0-9°%–—'\s-]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

function words(value){
  return String(value||'')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function esc(value){
  return String(value??'')
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

function containsAny(text,variants=[]){
  const t=norm(text);

  return variants.some(
    value=>
    t.includes(
      norm(value)
    )
  );
}

function groupHits(text,groups=[]){
  return groups.map(
    group=>
    containsAny(
      text,
      group
    )
  );
}

function keywordScore(text,keywords=[]){
  const unique=[
    ...new Set(
      keywords
      .map(norm)
      .filter(Boolean)
    )
  ];

  if(!unique.length){
    return 1;
  }

  const t=norm(text);

  return (
    unique
    .filter(
      keyword=>
      t.includes(keyword)
    )
    .length
    /
    unique.length
  );
}

function attempts(step){
  return Number(
    state.attempts[step]||0
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
  ].sort(
    (a,b)=>a-b
  );

  save();
}

function invalidateFrom(step){
  state.completed=
    state.completed.filter(
      x=>x<step
    );

  for(
    let i=step+1;
    i<6;
    i++
  ){
    delete state.scores[i];
  }

  if(
    state.current>step
  ){
    state.current=step;
  }

  save();
}

function unlockIndex(){
  let unlocked=0;

  for(
    let i=0;
    i<6;
    i++
  ){
    if(done(i)){
      unlocked=i+1;
    }else{
      break;
    }
  }

  return Math.min(
    5,
    unlocked
  );
}

function draftKey(step){
  return [
    'analysis',
    'intro',
    'overview',
    'body1',
    'body2',
    'full'
  ][step];
}

function fieldValue(id){
  return (
    document.getElementById(id)
    ?.value
    ||
    ''
  );
}

function saveCurrentDraft(){
  const step=state.current;

  if(step===0){
    state.drafts.analysis={
      type:fieldValue('aType'),
      stages:fieldValue('aStages'),
      first:fieldValue('aFirst'),
      last:fieldValue('aLast'),
      features:fieldValue('aFeatures'),
      body1:fieldValue('aBody1'),
      body2:fieldValue('aBody2')
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
   NUMBER / STAGE CHECK
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
  twenty:20
};

function numberValue(token){
  const t=
    String(token||'')
    .toLowerCase();

  if(
    /^\d+$/.test(t)
  ){
    return Number(t);
  }

  return NUMBER_WORDS[t] ?? null;
}

function detectStageCountClaim(text){
  const raw=
    String(text||'')
    .toLowerCase();

  const word=
    'one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\\d+';

  const patterns=[
    new RegExp(
      `\\b(${word})\\s*[-–— ]\\s*(?:main\\s+)?stages?\\b`,
      'i'
    ),

    new RegExp(
      `\\b(?:consists|comprises|contains|has|involves)\\s+(?:of\\s+)?(${word})\\s+(?:main\\s+)?stages?\\b`,
      'i'
    )
  ];

  for(
    const re
    of
    patterns
  ){
    const match=
      raw.match(re);

    if(match){
      return {
        mentioned:true,
        count:numberValue(match[1]),
        token:match[1],
        match:match[0]
      };
    }
  }

  return {
    mentioned:false,
    count:null,
    token:'',
    match:''
  };
}

function analysisStageCount(){
  const raw=
    String(
      state.drafts?.analysis?.stages
      ||
      ''
    )
    .trim()
    .toLowerCase();

  if(!raw){
    return null;
  }

  if(
    /^\d+$/.test(raw)
  ){
    return Number(raw);
  }

  const match=
    raw.match(
      /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\b/i
    );

  return match
    ?
    numberValue(match[1])
    :
    null;
}


/* =========================================================
   TOPIC CHECK
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

function hasPhrase(text,phrase){
  const t=
    ' '
    +
    norm(text)
    +
    ' ';

  const p=
    ' '
    +
    norm(phrase)
    +
    ' ';

  return t.includes(p);
}

function topicCheck(text){
  const rule=
    TOPIC_RULES[ID];

  if(!rule){
    return {
      requiredOK:true,
      wrong:[],
      expected:''
    };
  }

  return {
    requiredOK:
      rule.required.some(
        x=>
        hasPhrase(
          text,
          x
        )
      ),

    wrong:[
      ...new Set(
        rule.forbidden.filter(
          x=>
          hasPhrase(
            text,
            x
          )
        )
      )
    ],

    expected:
      rule.label
  };
}


/* =========================================================
   GRAMMAR CHECK
========================================================= */

function grammarIssues(text){
  const sentence=
    String(
      text
      ||
      ''
    )
    .trim();

  const normalized=
    norm(sentence);

  const issues=[];

  if(!sentence){
    return [
      'Chưa có câu trả lời.'
    ];
  }

  if(
    !/^[A-Z]/.test(sentence)
  ){
    issues.push(
      'Viết hoa chữ cái đầu câu/đoạn.'
    );
  }

  if(
    !/[.!?]$/.test(sentence)
  ){
    issues.push(
      'Nên kết thúc bằng dấu câu.'
    );
  }

  if(
    /\s{2,}/.test(sentence)
  ){
    issues.push(
      'Có khoảng trắng thừa.'
    );
  }

  if(
    /\b(is|are|was|were)\s+\1\b/i
    .test(normalized)
  ){
    issues.push(
      'Có trợ động từ bị lặp.'
    );
  }

  if(
    /\b(the|a|an)\s+\1\b/i
    .test(normalized)
  ){
    issues.push(
      'Có mạo từ bị lặp.'
    );
  }

  /*
    ends with ... are delivered
  */

  if(
    /\bends?\s+with\s+[^.!?]{0,100}\b(?:is|are|was|were)\b/i
    .test(sentence)
  ){
    issues.push(
      'Cấu trúc “ends with ...” chưa đúng: dùng “ends with + noun/V-ing” (ví dụ: ends with the bricks being delivered) hoặc “ends when + clause”.'
    );
  }

  /*
    begins with ... is/are ...
  */

  if(
    /\bbegins?\s+with\s+[^.!?]{0,100}\b(?:is|are|was|were)\b/i
    .test(sentence)
  ){
    issues.push(
      'Cấu trúc “begins with ...” chưa đúng: dùng “begins with + noun/V-ing” hoặc “begins when + clause”.'
    );
  }

  /*
    this allows they...
  */

  if(
    /\b(?:allows|enables)\s+(?:they|he|she|we|i)\s+to\b/i
    .test(sentence)
  ){
    issues.push(
      'Sau allows/enables phải dùng tân ngữ: them/him/her/us/me + to V, không dùng chủ ngữ they/he/she/we/I.'
    );
  }

  /*
    subject + V3 without be
  */

  const passiveTargets=[
    'crushed',
    'mixed',
    'shaped',
    'dried',
    'heated',
    'cooled',
    'packaged',
    'delivered',
    'sorted',
    'compressed',
    'washed',
    'labelled',
    'labeled',
    'sealed',
    'boiled',
    'transported',
    'removed',
    'placed',
    'collected'
  ];

  for(
    const target
    of
    passiveTargets
  ){
    const regex=
      new RegExp(
        `\\b(?:clay|bricks|bottles|tomatoes|noodles|mixture|plastic|eggs|tadpoles)\\s+${target}\\b`,
        'i'
      );

    if(
      regex.test(normalized)
    ){
      issues.push(
        `Kiểm tra câu bị động với “${target}”: thường cần be + V3.`
      );
    }
  }

  return [
    ...new Set(issues)
  ];
}


/* =========================================================
   BODY HELPERS
========================================================= */

function globalBodyGroups(){
  const all=[
    ...(task.body1?.concepts||[]),
    ...(task.body2?.concepts||[])
  ];

  const seen=
    new Set();

  return all.filter(
    group=>{
      const key=
        (group||[])
        .map(norm)
        .sort()
        .join('|');

      if(
        !key
        ||
        seen.has(key)
      ){
        return false;
      }

      seen.add(key);

      return true;
    }
  );
}

function bodyPlanInfo(text){
  const groups=
    globalBodyGroups();

  const result=
    groupHits(
      text,
      groups
    );

  return {
    hits:result,
    count:
      result.filter(Boolean).length,
    groups
  };
}

function bodyPlansAreDistinct(a,b){
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

  let overlap=0;

  A.forEach(
    word=>{
      if(
        B.has(word)
      ){
        overlap++;
      }
    }
  );

  return (
    overlap
    /
    Math.max(
      1,
      Math.min(
        A.size,
        B.size
      )
    )
    <
    .78
  );
}


/* =========================================================
   STYLE
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
  --warn:#9b6b16;
  --warnbg:#fff9ed;
  --bad:#b83345;
  --badbg:#fff6f7;
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
    0
    8px
    22px
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
    1px
    solid
    rgba(255,255,255,.25);

  padding:
    7px
    10px;

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
    1px
    solid
    rgba(255,255,255,.18);

  padding:
    7px
    10px;

  border-radius:999px;
}

.page{
  width:min(
    1440px,
    calc(100% - 18px)
  );

  margin:auto;

  padding:
    16px
    0
    46px;
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
    4px
    0
    0;

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
    420px
    1fr;

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
    1px
    solid
    var(--line);

  border-radius:17px;

  box-shadow:
    0
    8px
    24px
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

  padding:
    6px
    8px;

  border-radius:999px;
}

.imgwrap{
  position:relative;

  border:
    1px
    solid
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
    1px
    solid
    #dddff0;

  background:
    rgba(255,255,255,.94);

  color:#4f3d8b;

  border-radius:9px;

  padding:
    7px
    9px;

  font-size:9.5px;
  font-weight:900;
}

.prompt{
  margin-top:10px;

  padding:11px;

  border-radius:11px;

  background:#f7f5ff;

  border:
    1px
    solid
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
    1px
    solid
    var(--line);

  background:#fff;

  border-radius:11px;

  padding:9px;

  text-align:left;

  display:grid;

  grid-template-columns:
    34px
    1fr;

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
    0
    0
    0
    3px
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

  padding:
    20px
    22px;
}

.ey{
  display:flex;
  justify-content:space-between;
  align-items:center;

  gap:10px;

  margin-bottom:12px;
}

.chip{
  padding:
    7px
    10px;

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
    0
    0
    5px;

  color:#21164b;

  font-size:22px;
}

.sub{
  margin:
    0
    0
    14px;

  color:var(--muted);

  font-size:10.8px;
  line-height:1.55;
}

.guide{
  padding:
    12px
    13px;

  border:
    1px
    solid
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

.formgrid{
  display:grid;

  grid-template-columns:
    1fr
    1fr;

  gap:9px;
}

.field{
  border:
    1px
    solid
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
    1px
    solid
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
    0
    0
    0
    3px
    rgba(117,89,232,.07);
}

.write{
  width:100%;

  min-height:205px;

  resize:vertical;

  border:
    1px
    solid
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
    8px
    0
    7px;

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
    140px
    1fr
    140px;

  gap:8px;

  margin-top:11px;
}

.btn{
  border:
    1px
    solid
    #dcdfe7;

  background:#fff;

  color:#40345f;

  border-radius:10px;

  padding:
    10px
    12px;

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

  padding:
    12px
    13px;

  border:
    1px
    solid
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

  padding:
    11px
    12px;

  border:
    1px
    solid
    #eadfc3;

  background:
    var(--warnbg);

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
    6px
    0
    0;

  padding-left:18px;
}

.reference{
  margin-top:8px;

  padding:
    11px
    12px;

  border:
    1px
    solid
    #ded7fb;

  background:#f6f4ff;

  border-radius:11px;

  font-size:10.5px;
  line-height:1.6;
}

.reference b{
  color:#4b318e;
}

.analysis-result{
  display:grid;
  gap:6px;

  margin-top:8px;
}

.rowcheck{
  display:grid;

  grid-template-columns:
    150px
    1fr;

  gap:8px;

  padding:
    7px
    8px;

  border-radius:8px;

  background:#f8f9fc;

  font-size:10px;
}

.rowcheck.ok{
  background:#f1fbf6;

  color:#126d4a;
}

.rowcheck.no{
  background:#fff6f7;

  color:#9b3241;
}

.reviewparts{
  display:grid;

  grid-template-columns:
    1fr
    1fr;

  gap:8px;

  margin-bottom:10px;
}

.reviewparts details{
  border:
    1px
    solid
    var(--line);

  border-radius:9px;

  padding:8px;

  background:#fafbfe;
}

.reviewparts summary{
  cursor:pointer;

  font-size:10px;
  font-weight:900;

  color:#4b318e;
}

.reviewparts p{
  font-size:10px;
  line-height:1.5;

  color:#656d7d;

  margin:
    7px
    0
    0;

  white-space:pre-wrap;
}

.finaldone{
  padding:20px;

  text-align:center;

  border:
    1px
    solid
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
    0
    25px
    80px
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

  padding:
    10px
    12px;

  border-bottom:
    1px
    solid
    var(--line);
}

.modalhead button{
  border:
    1px
    solid
    var(--line);

  background:#fff;

  border-radius:8px;

  padding:
    6px
    9px;
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

  .steps{
    grid-template-columns:1fr;
  }

  .formgrid{
    grid-template-columns:1fr;
  }

  .actions{
    grid-template-columns:1fr;
  }

  .main{
    padding:16px;
  }

  .reviewparts{
    grid-template-columns:1fr;
  }

}

`;


/* =========================================================
   MOUNT UI
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
        ${task.icon}
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
        Học theo 6 bước · phải hoàn thành bước trước
        để mở bước tiếp theo · chữa ngay tại từng bước.
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
    const s=JSON.parse(
      localStorage.getItem(STUDENT_KEY)||'null'
    );

    if(s?.name){
      studentInfo.textContent=
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

  zoomBtn.onclick=
    ()=>
    imgDialog.showModal();

  closeDialog.onclick=
    ()=>
    imgDialog.close();

  imgDialog.addEventListener(
    'click',
    e=>{
      if(
        e.target===imgDialog
      ){
        imgDialog.close();
      }
    }
  );
}


/* =========================================================
   NAVIGATION UI
========================================================= */

function renderNav(){
  const unlocked=
    unlockIndex();

  stepNav.innerHTML=
    STEP_NAMES
    .map(
      (name,index)=>{
        const cls=[
          index===state.current
          ?
          'active'
          :
          '',

          done(index)
          ?
          'done'
          :
          '',

          index>unlocked
          ?
          'locked'
          :
          ''
        ]
        .filter(Boolean)
        .join(' ');

        return `

<button
  class="stepbtn ${cls}"
  ${
    index>unlocked
    ?
    'disabled'
    :
    ''
  }
  data-step="${index}"
>

  <span class="n">
    ${index+1}
  </span>

  <span>

    <strong>
      ${name}
    </strong>

    <small>

      ${
        done(index)
        ?
        '✓ Hoàn thành'
        :
        index>unlocked
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

  stepNav
  .querySelectorAll(
    '[data-step]'
  )
  .forEach(
    button=>{
      button.onclick=
        ()=>{
          const index=
            Number(
              button.dataset.step
            );

          if(
            index<=unlockIndex()
          ){
            saveCurrentDraft();

            state.current=
              index;

            save();

            render();
          }
        };
    }
  );
}

function renderProgress(){
  const count=
    state.completed.length;

  progressText.textContent=
    `${count}/6 bước hoàn thành`;

  progressBar.style.width=
    `${count/6*100}%`;
}


/* =========================================================
   GUIDES
========================================================= */

function guideFor(step){
  return [

    `
      <b>Mục tiêu:</b>
      Nhận diện loại process, số giai đoạn,
      điểm đầu–cuối, đặc điểm nổi bật và
      tự chọn cách chia Body 1/Body 2 hợp lý.
      Không có một mốc chia body duy nhất.
    `,

    `
      <b>Mục tiêu:</b>
      Paraphrase đề bài trong 1 câu.
      Introduction cần đúng đối tượng chính
      và đúng loại process đang được mô tả.
    `,

    `
      <b>Mục tiêu:</b>
      Viết Overview khái quát quá trình:
      cấu trúc chung, điểm bắt đầu,
      điểm kết thúc và đặc điểm nổi bật.
      Nếu nêu số stage thì số đó bắt buộc phải chính xác.
    `,

    `
      <b>Mục tiêu:</b>
      Viết Body 1 theo cách chia em đã chọn.
      Không có một mốc chia cố định;
      cần đúng thứ tự và đủ một nhóm stage hợp lý.
    `,

    `
      <b>Mục tiêu:</b>
      Viết Body 2 tiếp nối Body 1.
      Hai body không nên lặp nhau và khi ghép lại
      phải bao quát phần lớn toàn bộ process.
    `,

    `
      <b>Mục tiêu:</b>
      Viết lại toàn bài từ đầu:
      Introduction → Overview → Body 1 → Body 2.
      Kiểm tra lại nội dung, trình tự,
      ngữ pháp và chính tả trước khi nộp.
    `

  ][step];
}


/* =========================================================
   STEP 1 ANALYSIS
========================================================= */

function renderAnalysis(){
  const draft=
    state.drafts.analysis
    ||
    {};

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

  Quan sát toàn bộ sơ đồ rồi hoàn thành 7 mục.
  Riêng Body 1/Body 2,
  em tự chọn cách chia hợp lý.

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

  </div>


  <div class="field">

    <label>
      Có bao nhiêu main stages?
    </label>

    <input
      id="aStages"
      placeholder="Ví dụ: 7"
    >

  </div>


  <div class="field">

    <label>
      First stage là gì?
    </label>

    <textarea
      id="aFirst"
    ></textarea>

  </div>


  <div class="field">

    <label>
      Last / return stage là gì?
    </label>

    <textarea
      id="aLast"
    ></textarea>

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
    ></textarea>

  </div>


  <div class="field">

    <label>
      Em chọn Body 1 gồm những stage nào?
    </label>

    <textarea
      id="aBody1"
      placeholder="Ví dụ: từ stage đầu đến..."
    ></textarea>

  </div>


  <div class="field">

    <label>
      Em chọn Body 2 gồm những stage nào?
    </label>

    <textarea
      id="aBody2"
      placeholder="Tiếp nối Body 1 đến cuối process..."
    ></textarea>

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

  aType.value=
    draft.type
    ||
    '';

  aStages.value=
    draft.stages
    ||
    '';

  aFirst.value=
    draft.first
    ||
    '';

  aLast.value=
    draft.last
    ||
    '';

  aFeatures.value=
    draft.features
    ||
    '';

  aBody1.value=
    draft.body1
    ||
    '';

  aBody2.value=
    draft.body2
    ||
    '';

  main
  .querySelectorAll(
    'input,textarea,select'
  )
  .forEach(
    element=>{
      element.addEventListener(
        'input',
        saveCurrentDraft
      );
    }
  );

  checkBtn.onclick=
    checkAnalysis;

  nextBtn.onclick=
    ()=>
    goStep(1);

  if(
    state.scores[0]
  ){
    showAnalysisFeedback(
      state.scores[0]
    );
  }
}

function checkAnalysis(){
  saveCurrentDraft();

  state.attempts[0]=
    attempts(0)
    +
    1;

  const answer=
    state.drafts.analysis;

  const body1Info=
    bodyPlanInfo(
      answer.body1
    );

  const body2Info=
    bodyPlanInfo(
      answer.body2
    );

  const checks=[

    [
      'Process type',

      containsAny(
        answer.type,
        task.analysis.type
      )
    ],

    [
      'Main stages',

      containsAny(
        answer.stages,
        task.analysis.stages
      )
    ],

    [
      'First stage',

      keywordScore(
        answer.first,
        task.analysis.first
      )
      >=
      .5
    ],

    [
      'Last / return stage',

      keywordScore(
        answer.last,
        task.analysis.last
      )
      >=
      .35
    ],

    [
      'Important features',

      keywordScore(
        answer.features,
        task.analysis.features
      )
      >=
      .3
    ],

    [
      'Body 1: có một nhóm stage hợp lý',

      words(
        answer.body1
      )
      >=
      3

      &&

      body1Info.count
      >=
      1
    ],

    [
      'Body 2: tiếp nối và không trùng Body 1',

      words(
        answer.body2
      )
      >=
      3

      &&

      body2Info.count
      >=
      1

      &&

      bodyPlansAreDistinct(
        answer.body1,
        answer.body2
      )
    ]

  ];

  const correct=
    checks
    .filter(
      item=>item[1]
    )
    .length;

  const result={
    checks,

    total:
      Math.round(
        correct
        /
        checks.length
        *
        100
      ),

    completed:
      correct
      ===
      checks.length
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

  showAnalysisFeedback(
    result
  );

  renderNav();
  renderProgress();

  nextBtn.disabled=
    !done(0);
}

function analysisReference(){
  const a=
    task.analysis;

  return `

<b>
  Gợi ý phân tích:
</b>

<br>

• Type:
${esc(task.type)}

<br>

• Main stages:
${task.stages}

<br>

• First stage:
${esc(a.first.join(' / '))}

<br>

• Last/return stage:
${esc(a.last.join(' / '))}

<br>

• Important features:
${esc(a.features.join(' · '))}

<br><br>

<b>
  Cách chia Body:
</b>

không có một đáp án duy nhất.

<br>

Một cách tham khảo:

<br>

• Body 1:
${esc(a.body1.join(' · '))}

<br>

• Body 2:
${esc(a.body2.join(' · '))}

  `;
}

function showAnalysisFeedback(result){
  const feedback=
    document.getElementById(
      'feedback'
    );

  if(!feedback){
    return;
  }

  const rows=
    result.checks
    .map(
      ([name,ok])=>`

<div
  class="
    rowcheck
    ${
      ok
      ?
      'ok'
      :
      'no'
    }
  "
>

  <b>
    ${name}
  </b>

  <span>

    ${
      ok
      ?
      '✓ Hợp lý / đủ ý'
      :
      'Cần sửa hoặc bổ sung'
    }

  </span>

</div>

      `
    )
    .join('');

  const reference=

    !result.completed
    &&
    attempts(0)>=2

    ?

    `
<div class="reference">
  ${analysisReference()}
</div>
    `

    :

    '';

  feedback.className=
    'feedback show';

  feedback.innerHTML=`

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
        'Cần sửa các mục còn thiếu'
      }

    </div>

  </div>


  <div class="counter">
    Phải đúng đủ các mục chính
  </div>

</div>


<div class="analysis-result">
  ${rows}
</div>


${reference}

  `;
}


/* =========================================================
   INTRODUCTION
========================================================= */

function gradeIntroduction(text){
  const wc=
    words(text);

  const grammar=
    grammarIssues(text);

  const topic=
    topicCheck(text);

  const framingOK=
    containsAny(
      text,
      [
        'diagram',
        'figure',
        'illustration'
      ]
    );

  const describeOK=
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

  const processOK=
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
      `Sai nội dung: em đang nhắc tới “${topic.wrong.join(', ')}”, không thuộc sơ đồ này.`
    );
  }

  if(
    !framingOK
  ){
    issues.push(
      'Introduction chưa thể hiện rõ đây là diagram/figure.'
    );
  }

  if(
    !describeOK
  ){
    issues.push(
      'Nên dùng động từ mô tả như illustrates, shows hoặc depicts.'
    );
  }

  if(
    !processOK
  ){
    issues.push(
      'Chưa diễn đạt rõ đây là một process/life cycle.'
    );
  }

  if(
    wc<8
  ){
    issues.push(
      `Câu còn quá ngắn (${wc} từ).`
    );
  }

  grammar.forEach(
    issue=>
    issues.push(
      'Ngữ pháp/trình bày: '
      +
      issue
    )
  );

  const topicPts=
    topic.requiredOK
    &&
    topic.wrong.length===0
    ?
    45
    :
    0;

  const framingPts=
    framingOK
    ?
    10
    :
    0;

  const describePts=
    describeOK
    ?
    15
    :
    0;

  const processPts=
    processOK
    ?
    10
    :
    0;

  const lengthPts=
    wc>=8
    ?
    10
    :
    Math.round(
      wc/8*10
    );

  const grammarPts=
    Math.max(
      0,
      10
      -
      grammar.length*5
    );

  let score=
    topicPts
    +
    framingPts
    +
    describePts
    +
    processPts
    +
    lengthPts
    +
    grammarPts;

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

  const breakdown=[

    {
      label:'Đúng đối tượng chính',
      score:topicPts,
      max:45,
      note:
        topic.requiredOK
        &&
        topic.wrong.length===0
        ?
        `Đúng: ${topic.expected}`
        :
        `Phải là ${topic.expected}`
    },

    {
      label:'Paraphrase dạng sơ đồ',
      score:framingPts,
      max:10,
      note:
        framingOK
        ?
        'Có diagram/figure'
        :
        'Chưa rõ'
    },

    {
      label:'Động từ mô tả',
      score:describePts,
      max:15,
      note:
        describeOK
        ?
        'Phù hợp'
        :
        'Thiếu'
    },

    {
      label:'Thể hiện process',
      score:processPts,
      max:10,
      note:
        processOK
        ?
        'Đạt'
        :
        'Chưa rõ'
    },

    {
      label:'Độ dài',
      score:lengthPts,
      max:10,
      note:`${wc} từ`
    },

    {
      label:'Ngữ pháp & trình bày',
      score:grammarPts,
      max:10,
      note:
        grammar.length
        ?
        `${grammar.length} lỗi được phát hiện`
        :
        'Ổn'
    }

  ];

  return {
    total:
      Math.min(
        100,
        score
      ),

    completed:

      topic.requiredOK

      &&

      topic.wrong.length===0

      &&

      framingOK

      &&

      describeOK

      &&

      processOK

      &&

      wc>=8

      &&

      grammar.length===0,

    wc,
    grammar,
    issues,
    breakdown
  };
}


/* =========================================================
   OVERVIEW
========================================================= */

function gradeOverview(text){
  const cfg=
    task.overview;

  const wc=
    words(text);

  const grammar=
    grammarIssues(text);

  const topic=
    topicCheck(text);

  const firstOK=
    containsAny(
      text,
      task.analysis.first||[]
    );

  const lastOK=
    containsAny(
      text,
      task.analysis.last||[]
    );

  const overviewMarker=
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

  const h=
    groupHits(
      text,
      cfg.concepts||[]
    );

  const ratio=
    h.length
    ?
    h.filter(Boolean).length
    /
    h.length
    :
    1;

  const expectedStages=
    Number(task.stages);

  const stageClaim=
    detectStageCountClaim(text);

  const analysisCount=
    analysisStageCount();

  /*
    Không bắt buộc Overview phải ghi số stage.
    Nhưng nếu đã ghi thì phải đúng.
  */

  const stageCountOK=

    !stageClaim.mentioned

    ||

    stageClaim.count
    ===
    expectedStages;

  const consistentWithAnalysis=

    !stageClaim.mentioned

    ||

    analysisCount==null

    ||

    stageClaim.count
    ===
    analysisCount;

  const issues=[];

  if(
    topic.wrong.length
  ){
    issues.push(
      `Có nội dung thuộc bài khác: “${topic.wrong.join(', ')}”.`
    );
  }

  if(
    !overviewMarker
  ){
    issues.push(
      'Chưa có dấu hiệu mở Overview rõ ràng, ví dụ Overall / In general.'
    );
  }

  if(
    !firstOK
  ){
    issues.push(
      'Overview chưa thể hiện rõ điểm bắt đầu của process.'
    );
  }

  if(
    !lastOK
  ){
    issues.push(
      'Overview chưa thể hiện rõ điểm kết thúc / return stage.'
    );
  }

  if(
    stageClaim.mentioned
    &&
    !stageCountOK
  ){
    let message=
      `Sai số giai đoạn: em viết “${stageClaim.match}”, nhưng sơ đồ này có ${expectedStages} main stages.`;

    if(
      analysisCount!=null
    ){
      message+=
        ` Ở Bước 1 em đã nhập ${analysisCount} stages.`;
    }

    issues.push(
      message
    );
  }

  if(
    stageClaim.mentioned
    &&
    !consistentWithAnalysis
    &&
    analysisCount!=null
  ){
    issues.push(
      `Thông tin chưa nhất quán giữa các bước: Bước 1 = ${analysisCount} stages, Overview = ${stageClaim.count} stages.`
    );
  }

  if(
    ratio<.45
  ){
    issues.push(
      'Overview chưa khái quát đủ đặc điểm chính của process.'
    );
  }

  if(
    wc<25
  ){
    issues.push(
      `Overview còn ngắn (${wc} từ).`
    );
  }

  grammar.forEach(
    issue=>
    issues.push(
      'Ngữ pháp/trình bày: '
      +
      issue
    )
  );

  const topicPts=
    topic.wrong.length
    ?
    0
    :
    10;

  const markerPts=
    overviewMarker
    ?
    10
    :
    0;

  const firstPts=
    firstOK
    ?
    15
    :
    0;

  const lastPts=
    lastOK
    ?
    15
    :
    0;

  const stagePts=
    stageCountOK
    &&
    consistentWithAnalysis
    ?
    15
    :
    0;

  const featurePts=
    Math.round(
      Math.min(
        1,
        ratio/.65
      )
      *
      20
    );

  const lengthPts=
    wc>=25
    ?
    5
    :
    Math.round(
      Math.min(
        1,
        wc/25
      )
      *
      5
    );

  const languagePts=
    Math.max(
      0,
      10
      -
      grammar.length*5
    );

  let score=
    topicPts
    +
    markerPts
    +
    firstPts
    +
    lastPts
    +
    stagePts
    +
    featurePts
    +
    lengthPts
    +
    languagePts;

  /*
    Sai số stage = lỗi nội dung quan trọng.
  */

  if(
    stageClaim.mentioned
    &&
    (
      !stageCountOK
      ||
      !consistentWithAnalysis
    )
  ){
    score=
      Math.min(
        score,
        69
      );
  }

  if(
    topic.wrong.length
  ){
    score=
      Math.min(
        score,
        45
      );
  }

  const breakdown=[

    {
      label:'Đúng chủ đề/process',
      score:topicPts,
      max:10,
      note:
        topic.wrong.length
        ?
        `Có nội dung thuộc bài khác: ${topic.wrong.join(', ')}`
        :
        'Đúng bài đang làm'
    },

    {
      label:'Dấu hiệu Overview',
      score:markerPts,
      max:10,
      note:
        overviewMarker
        ?
        'Có Overall/In general...'
        :
        'Chưa có'
    },

    {
      label:'Điểm bắt đầu',
      score:firstPts,
      max:15,
      note:
        firstOK
        ?
        'Đã nêu đúng/đủ rõ'
        :
        'Chưa rõ'
    },

    {
      label:'Điểm kết thúc',
      score:lastPts,
      max:15,
      note:
        lastOK
        ?
        'Đã nêu đúng/đủ rõ'
        :
        'Chưa rõ'
    },

    {
      label:'Số giai đoạn',
      score:stagePts,
      max:15,

      note:

        stageClaim.mentioned

        ?

        (
          stageCountOK
          &&
          consistentWithAnalysis

          ?

          `Đúng: ${stageClaim.count} stages`

          :

          `Sai/không nhất quán: em viết ${stageClaim.count}, sơ đồ có ${expectedStages}${
            analysisCount!=null
            ?
            `, Bước 1 em nhập ${analysisCount}`
            :
            ''
          }`
        )

        :

        'Không bắt buộc phải nêu số stage; nếu nêu thì phải đúng'
    },

    {
      label:'Khái quát đặc điểm chính',
      score:featurePts,
      max:20,
      note:
        `Mức bao quát ${Math.round(ratio*100)}%`
    },

    {
      label:'Độ dài',
      score:lengthPts,
      max:5,
      note:
        `${wc} từ`
    },

    {
      label:'Ngữ pháp & trình bày',
      score:languagePts,
      max:10,
      note:
        grammar.length
        ?
        `${grammar.length} lỗi được phát hiện`
        :
        'Không phát hiện lỗi chính'
    }

  ];

  return {
    total:
      Math.min(
        100,
        score
      ),

    completed:

      topic.wrong.length===0

      &&

      overviewMarker

      &&

      firstOK

      &&

      lastOK

      &&

      stageCountOK

      &&

      consistentWithAnalysis

      &&

      ratio>=.45

      &&

      wc>=25

      &&

      grammar.length===0,

    wc,
    issues,
    breakdown,
    stageClaim,
    expectedStages
  };
}


/* =========================================================
   FLEXIBLE BODY GRADING
========================================================= */

function sectionConfig(step){
  return task[
    draftKey(step)
  ];
}

function flexibleBodyGrade(step,text){
  const cfg=
    sectionConfig(step);

  const groups=
    globalBodyGroups();

  const h=
    groupHits(
      text,
      groups
    );

  const hitCount=
    h.filter(Boolean).length;

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

  const grammar=
    grammarIssues(text);

  const topic=
    topicCheck(text);

  const sequenceOK=

    !cfg.sequence?.length

    ||

    containsAny(
      text,
      cfg.sequence
    );

  let overlapPenalty=0;

  if(
    step===4
    &&
    state.drafts.body1
  ){
    const A=
      new Set(
        norm(
          state.drafts.body1
        )
        .split(/\s+/)
        .filter(
          x=>x.length>3
        )
      );

    const B=
      new Set(
        norm(text)
        .split(/\s+/)
        .filter(
          x=>x.length>3
        )
      );

    let overlap=0;

    A.forEach(
      x=>{
        if(
          B.has(x)
        ){
          overlap++;
        }
      }
    );

    const ratio=
      overlap
      /
      Math.max(
        1,
        Math.min(
          A.size,
          B.size
        )
      );

    if(
      ratio>.72
    ){
      overlapPenalty=12;
    }
  }

  const combined=

    step===4

    ?

    String(
      state.drafts.body1
      ||
      ''
    )
    +
    ' '
    +
    String(
      text
      ||
      ''
    )

    :

    String(
      text
      ||
      ''
    );

  const combinedHits=
    groupHits(
      combined,
      groups
    );

  const combinedRatio=

    combinedHits.length

    ?

    combinedHits
    .filter(Boolean)
    .length
    /
    combinedHits.length

    :

    0;

  const coverageOK=

    step===4

    ?

    combinedRatio>=.48

    :

    true;

  const contentPts=
    Math.round(
      Math.min(
        1,
        hitCount/minHits
      )
      *
      55
    );

  const lengthPts=
    wc>=cfg.minWords
    ?
    15
    :
    Math.round(
      15
      *
      Math.min(
        1,
        wc/cfg.minWords
      )
    );

  const sequencePts=
    sequenceOK
    ?
    10
    :
    0;

  const grammarPts=
    Math.max(
      0,
      10
      -
      grammar.length*4
    );

  const coveragePts=

    step===4

    ?

    (
      coverageOK
      ?
      10
      :
      Math.round(
        combinedRatio/.48*10
      )
    )

    :

    10;

  let score=
    contentPts
    +
    lengthPts
    +
    sequencePts
    +
    grammarPts
    +
    coveragePts
    -
    overlapPenalty;

  score=
    Math.max(
      0,
      Math.min(
        100,
        score
      )
    );

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
      `Đoạn chưa mô tả đủ stage cụ thể: hệ thống nhận ${hitCount}, nên có ít nhất khoảng ${minHits} ý/stage rõ ràng.`
    );
  }

  if(
    wc<cfg.minWords
  ){
    issues.push(
      `Đoạn còn ngắn: ${wc} từ; mục tiêu khoảng ${cfg.minWords}+ từ.`
    );
  }

  if(
    !sequenceOK
  ){
    issues.push(
      'Nên có từ/cụm nối để thể hiện đúng trình tự các stage.'
    );
  }

  if(
    step===4
    &&
    !coverageOK
  ){
    issues.push(
      'Khi ghép Body 1 và Body 2, vẫn còn khá nhiều stage chưa được thể hiện.'
    );
  }

  if(
    overlapPenalty
  ){
    issues.push(
      'Body 2 đang lặp khá nhiều nội dung của Body 1. Hãy tiếp tục từ điểm Body 1 đã dừng.'
    );
  }

  grammar.forEach(
    issue=>
    issues.push(
      'Ngữ pháp/trình bày: '
      +
      issue
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

  const breakdown=[

    {
      label:'Các stage/nội dung chính',
      score:contentPts,
      max:55,
      note:
        `Nhận diện ${hitCount} nhóm nội dung`
    },

    {
      label:'Độ dài',
      score:lengthPts,
      max:15,
      note:
        `${wc} từ`
    },

    {
      label:'Trình tự & từ nối',
      score:sequencePts,
      max:10,
      note:
        sequenceOK
        ?
        'Đạt'
        :
        'Chưa rõ'
    },

    {
      label:'Ngữ pháp & trình bày',
      score:grammarPts,
      max:10,
      note:
        grammar.length
        ?
        `${grammar.length} lỗi được phát hiện`
        :
        'Ổn'
    },

    {
      label:
        step===4
        ?
        'Độ bao phủ khi ghép 2 body'
        :
        'Tính độc lập của Body 1',

      score:coveragePts,
      max:10,

      note:
        step===4
        ?
        `${Math.round(combinedRatio*100)}% process`
        :
        'Được chấm linh hoạt'
    }

  ];

  return {
    total:score,

    completed:

      topic.wrong.length===0

      &&

      hitCount>=minHits

      &&

      wc>=Math.round(
        cfg.minWords*.8
      )

      &&

      sequenceOK

      &&

      coverageOK

      &&

      overlapPenalty===0

      &&

      grammar.length<=1,

    wc,
    issues,
    breakdown,
    flexibleBody:true,
    combinedRatio
  };
}


/* =========================================================
   GENERIC SECTION GRADING
========================================================= */

function sectionGrade(step,text){
  if(step===1){
    return gradeIntroduction(
      text
    );
  }

  if(step===2){
    return gradeOverview(
      text
    );
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

  const cfg=
    sectionConfig(step);

  const h=
    groupHits(
      text,
      cfg.concepts||[]
    );

  const ratio=

    h.length

    ?

    h.filter(Boolean).length
    /
    h.length

    :

    1;

  const wc=
    words(text);

  const grammar=
    grammarIssues(text);

  const topic=
    topicCheck(text);

  const sequenceOK=

    !cfg.sequence?.length

    ||

    containsAny(
      text,
      cfg.sequence
    );

  const issues=[];

  if(
    topic.wrong.length
  ){
    issues.push(
      `Có nội dung thuộc process khác: “${topic.wrong.join(', ')}”.`
    );
  }

  if(
    ratio<.75
  ){
    const missing=
      (
        cfg.concepts
        ||
        []
      )
      .filter(
        (_,index)=>
        !h[index]
      )
      .map(
        group=>group[0]
      );

    issues.push(
      'Ý/stage còn thiếu hoặc chưa rõ: '
      +
      missing.join(', ')
      +
      '.'
    );
  }

  if(
    wc<cfg.minWords
  ){
    issues.push(
      `Đoạn còn ngắn: ${wc} từ; mục tiêu khoảng ${cfg.minWords}+ từ.`
    );
  }

  if(
    !sequenceOK
  ){
    issues.push(
      'Nên có từ/cụm nối để thể hiện đúng trình tự các stage.'
    );
  }

  grammar.forEach(
    issue=>
    issues.push(
      'Ngữ pháp/trình bày: '
      +
      issue
    )
  );

  const contentPts=
    Math.round(
      ratio*70
    );

  const lengthPts=
    wc>=cfg.minWords
    ?
    15
    :
    Math.round(
      15
      *
      Math.min(
        1,
        wc/cfg.minWords
      )
    );

  const sequencePts=
    sequenceOK
    ?
    8
    :
    0;

  const grammarPts=
    Math.max(
      0,
      7
      -
      grammar.length*3
    );

  let score=
    contentPts
    +
    lengthPts
    +
    sequencePts
    +
    grammarPts;

  score=
    Math.min(
      100,
      score
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

  return {
    total:score,

    completed:

      topic.wrong.length===0

      &&

      ratio>=.75

      &&

      wc>=Math.round(
        cfg.minWords*.8
      )

      &&

      sequenceOK

      &&

      grammar.length<=1,

    wc,
    issues
  };
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

  const review=

    full

    ?

    `

<div class="reviewparts">

  <details>

    <summary>
      Xem lại Introduction đã đạt
    </summary>

    <p>
      ${esc(state.drafts.intro||'')}
    </p>

  </details>


  <details>

    <summary>
      Xem lại Overview đã đạt
    </summary>

    <p>
      ${esc(state.drafts.overview||'')}
    </p>

  </details>


  <details>

    <summary>
      Xem lại Body 1 đã đạt
    </summary>

    <p>
      ${esc(state.drafts.body1||'')}
    </p>

  </details>


  <details>

    <summary>
      Xem lại Body 2 đã đạt
    </summary>

    <p>
      ${esc(state.drafts.body2||'')}
    </p>

  </details>

</div>

    `

    :

    '';

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

    `
      Viết lại toàn bộ bài từ trí nhớ.
      Chỉ mở các phần xem lại khi thật sự cần.
    `

    :

    `
      Viết phần này dựa trên sơ đồ
      và kết quả phân tích ở Bước 1.
    `
  }

</p>


<div class="guide">
  ${guideFor(step)}
</div>


${review}


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
    'Viết bài hoàn chỉnh tại đây...'
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

  updateWordCount();

  writeBox.addEventListener(
    'input',
    ()=>{
      state.drafts[
        draftKey(step)
      ]=
        writeBox.value;

      save();

      updateWordCount();
    }
  );

  prevBtn.onclick=
    ()=>
    goStep(
      step-1
    );

  checkBtn.onclick=
    ()=>
    checkWriting(step);

  nextBtn.onclick=
    ()=>{
      if(step<5){
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
  const counter=
    document.getElementById(
      'wordCount'
    );

  const box=
    document.getElementById(
      'writeBox'
    );

  if(
    counter
    &&
    box
  ){
    counter.textContent=
      `${words(box.value)} từ`;
  }
}


/* =========================================================
   FULL ESSAY
========================================================= */

function fullGrade(text){
  const wc=
    words(text);

  const paragraphs=
    String(
      text
      ||
      ''
    )
    .trim()
    .split(
      /\n\s*\n/
    )
    .filter(
      paragraph=>
      paragraph.trim().length>20
    )
    .length;

  const groups=[
    ...task.intro.concepts,
    ...task.overview.concepts,
    ...task.body1.concepts,
    ...task.body2.concepts
  ];

  const h=
    groupHits(
      text,
      groups
    );

  const ratio=

    h.length

    ?

    h.filter(Boolean).length
    /
    h.length

    :

    0;

  const grammar=
    grammarIssues(text);

  const topic=
    topicCheck(text);

  const hasOverview=
    /\boverall\b/i
    .test(text);

  const stageClaim=
    detectStageCountClaim(text);

  const expectedStages=
    Number(task.stages);

  const stageCountOK=

    !stageClaim.mentioned

    ||

    stageClaim.count===expectedStages;

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
    stageClaim.mentioned
    &&
    !stageCountOK
  ){
    issues.push(
      `Sai số giai đoạn: em viết ${stageClaim.count}, nhưng sơ đồ có ${expectedStages} main stages.`
    );
  }

  if(
    wc<150
  ){
    issues.push(
      `Bài hiện có ${wc} từ; Writing Task 1 nên đạt tối thiểu 150 từ.`
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
    paragraphs<4
  ){
    issues.push(
      `Bài nên có 4 đoạn rõ ràng; hệ thống đang nhận ${paragraphs} đoạn.`
    );
  }

  if(
    ratio<.72
  ){
    const missing=
      groups
      .filter(
        (_,index)=>
        !h[index]
      )
      .map(
        group=>group[0]
      )
      .slice(
        0,
        12
      );

    issues.push(
      'Một số nội dung/stage chưa rõ: '
      +
      missing.join(', ')
      +
      '.'
    );
  }

  grammar.forEach(
    issue=>
    issues.push(
      'Ngữ pháp/trình bày: '
      +
      issue
    )
  );

  const contentPts=
    Math.round(
      ratio*55
    );

  const wordPts=
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

  const overviewPts=
    hasOverview
    ?
    10
    :
    0;

  const paragraphPts=
    paragraphs>=4
    ?
    8
    :
    0;

  const grammarPts=
    Math.max(
      0,
      7
      -
      grammar.length*3
    );

  let score=
    contentPts
    +
    wordPts
    +
    overviewPts
    +
    paragraphPts
    +
    grammarPts;

  score=
    Math.min(
      100,
      score
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
    stageClaim.mentioned
    &&
    !stageCountOK
  ){
    score=
      Math.min(
        score,
        69
      );
  }

  const breakdown=[

    {
      label:'Nội dung & stages',
      score:contentPts,
      max:55,
      note:
        `Bao quát ${Math.round(ratio*100)}%`
    },

    {
      label:'Độ dài',
      score:wordPts,
      max:20,
      note:
        `${wc} từ`
    },

    {
      label:'Overview',
      score:overviewPts,
      max:10,
      note:
        hasOverview
        ?
        'Có'
        :
        'Thiếu'
    },

    {
      label:'Cấu trúc 4 đoạn',
      score:paragraphPts,
      max:8,
      note:
        `${paragraphs} đoạn`
    },

    {
      label:'Ngữ pháp & trình bày',
      score:grammarPts,
      max:7,
      note:
        grammar.length
        ?
        `${grammar.length} lỗi`
        :
        'Ổn'
    }

  ];

  return {
    total:score,

    completed:

      topic.requiredOK

      &&

      topic.wrong.length===0

      &&

      stageCountOK

      &&

      wc>=150

      &&

      hasOverview

      &&

      paragraphs>=4

      &&

      ratio>=.72

      &&

      grammar.length<=1,

    wc,
    issues,
    breakdown
  };
}


/* =========================================================
   CHECK WRITING
========================================================= */

function checkWriting(step){
  saveCurrentDraft();

  state.attempts[step]=
    attempts(step)
    +
    1;

  const text=
    state.drafts[
      draftKey(step)
    ]
    ||
    '';

  const result=

    step===5

    ?

    fullGrade(
      text
    )

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


/* =========================================================
   FEEDBACK
========================================================= */

function showWritingFeedback(step,result){
  const feedback=
    document.getElementById(
      'feedback'
    );

  if(!feedback){
    return;
  }

  feedback.className=
    'feedback show';

  const showReference=

    !result.completed

    &&

    attempts(step)>=2;

  const reference=

    step===5

    ?

    task.fullReference

    :

    sectionConfig(step).reference;

  const referenceLabel=

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

    result.breakdown?.length

    ?

    `

<div class="detail">

  <b>
    Vì sao được ${result.total}/100?
  </b>

  <ul>

    ${
      result.breakdown
      .map(
        item=>`

<li>

  <b>
    ${esc(item.label)}:
    ${item.score}/${item.max}
  </b>

  ${
    item.note
    ?
    ` — ${esc(item.note)}`
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

    result.issues?.length

    ?

    `

<div
  class="
    detail
    ${
      result.completed
      ?
      'goodbox'
      :
      result.total<60
      ?
      'badbox'
      :
      ''
    }
  "
>

  <b>

    ${
      result.completed
      ?
      'Phần này đạt yêu cầu.'
      :
      'Cần sửa:'
    }

  </b>

  <ul>

    ${
      result.issues
      .map(
        issue=>`
          <li>
            ${esc(issue)}
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

  Nội dung, cấu trúc và trình tự chính phù hợp.

</div>

    `;

  feedback.innerHTML=`

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
          result.total>=70
          ?
          'warn'
          :
          'bad'
        }
      "
    >

      ${
        result.completed
        ?
        '✓ Hoàn thành bước này'
        :
        result.total>=70
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
  showReference

  ?

  `

<div class="reference">

  <b>
    ${referenceLabel}
  </b>

  <br>

  ${
    esc(reference)
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
    result.completed
  ){
    finalDone.innerHTML=`

<div class="finaldone">

  <h3>
    🎉 Hoàn thành
    ${esc(task.title)}
  </h3>

  <p>
    Em đã đi đủ 6 bước từ phân tích
    đến bài Process hoàn chỉnh.
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
   NAVIGATION
========================================================= */

function goStep(index){
  saveCurrentDraft();

  if(
    index<0
    ||
    index>unlockIndex()
  ){
    return;
  }

  state.current=
    index;

  save();

  render();

  window.scrollTo({
    top:0,
    behavior:'smooth'
  });
}


/* =========================================================
   RENDER
========================================================= */

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
