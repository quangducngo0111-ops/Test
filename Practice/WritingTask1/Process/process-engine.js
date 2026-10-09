(()=>{
'use strict';

const TASKS=window.PROCESS_TASKS||{};
const ID=String(window.PROCESS_TASK_ID||'01').padStart(2,'0');
const task=TASKS[ID];

if(!task){
  document.body.innerHTML=
    '<p style="padding:30px;font-family:sans-serif">Không tìm thấy dữ liệu bài Process.</p>';
  return;
}

const STUDENT_KEY='IELTS_PRACTICE_STUDENT';

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
  'WT1_PROCESS_GUIDED_V4_'
  +studentScope()
  +'::'
  +ID;

const STEP_NAMES=[
  'Phân tích sơ đồ',
  'Introduction',
  'Overview',
  'Body Paragraph 1',
  'Body Paragraph 2',
  'Bài hoàn chỉnh'
];

const STEP_SHORT=[
  'Phân tích',
  'Intro',
  'Overview',
  'Body 1',
  'Body 2',
  'Full essay'
];

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

function load(){
  try{
    const s=JSON.parse(
      localStorage.getItem(STORAGE_KEY)||'null'
    );

    if(s){
      state={
        ...state,
        ...s,
        drafts:{
          ...state.drafts,
          ...(s.drafts||{}),
          analysis:{
            ...state.drafts.analysis,
            ...(s.drafts?.analysis||{})
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

function norm(s){
  return String(s||'')
    .toLowerCase()
    .replace(/[’‘]/g,"'")
    .replace(/[^a-z0-9°%–—'\s-]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

function words(s){
  return String(s||'')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function esc(s){
  return String(s??'')
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

function containsAny(text,vars){
  const t=norm(text);

  return vars.some(
    v=>t.includes(norm(v))
  );
}

function hits(text,groups){
  return groups.map(
    g=>containsAny(text,g)
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

function unlockIndex(){
  let u=0;

  for(let i=0;i<6;i++){

    if(done(i)){
      u=i+1;
    }else{
      break;
    }

  }

  return Math.min(5,u);
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


const style=`

:root{
  --purple:#281260;
  --violet:#7358e7;
  --ink:#202636;
  --muted:#6f7890;
  --line:#e1e5ee;
  --bg:#f5f7fb;
  --good:#16845b;
  --warn:#9b6b16;
  --bad:#b83345;
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
    rgba(
      40,
      18,
      96,
      .14
    );
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

  min-width:0;
}

.back{
  color:#fff;

  text-decoration:none;

  border:
    1px
    solid
    rgba(
      255,
      255,
      255,
      .25
    );

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
    rgba(
      255,
      255,
      255,
      .1
    );

  border:
    1px
    solid
    rgba(
      255,
      255,
      255,
      .18
    );

  padding:
    7px
    10px;

  border-radius:999px;
}

.page{
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
}

.hero p{
  margin:
    4px
    0
    0;

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
  width:0;

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
    rgba(
      35,
      25,
      75,
      .04
    );
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

.pill,
.chip{
  background:#f0ecff;
  color:#5c43b2;

  border-radius:999px;

  font-size:9.5px;
  font-weight:950;

  padding:
    6px
    9px;
}

.imgwrap{
  position:relative;

  border:
    1px
    solid
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
    1px
    solid
    #dddff0;

  background:#fff;
  color:#4f3d8b;

  border-radius:9px;

  padding:
    7px
    9px;

  font-size:9.5px;
  font-weight:900;
}

.prompt,
.guide{
  margin-top:10px;

  padding:11px;

  border:
    1px
    solid
    #e3def9;

  border-radius:11px;

  background:#f7f5ff;
  color:#4a4161;

  font-size:10.5px;
  line-height:1.55;
}

.guide{
  margin:
    0
    0
    12px;
}

.guide b{
  color:#4b318e;
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

.ey,
.writehead,
.scorebar{
  display:flex;
  justify-content:space-between;
  align-items:center;

  gap:10px;
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
}

.field label{
  display:block;

  font-size:10px;
  font-weight:900;

  margin-bottom:6px;
}

.field input,
.field select,
.field textarea,
.write{
  width:100%;

  border:
    1px
    solid
    #cfd4df;

  border-radius:9px;

  padding:10px;

  outline:none;

  background:#fff;
  color:#202636;
}

.field textarea{
  min-height:76px;
  resize:vertical;
}

.write{
  min-height:205px;

  resize:vertical;

  font-size:12.5px;
  line-height:1.7;
}

.write.full{
  min-height:400px;
}

.field input:focus,
.field select:focus,
.field textarea:focus,
.write:focus{
  border-color:#765ee0;

  box-shadow:
    0
    0
    0
    3px
    rgba(
      117,
      89,
      232,
      .07
    );
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
      var(--violet)
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

.detail,
.reference{
  margin-top:8px;

  padding:
    11px
    12px;

  border-radius:11px;

  font-size:10.5px;
  line-height:1.55;
}

.detail{
  border:
    1px
    solid
    #eadfc3;

  background:#fff9ed;
}

.detail.goodbox{
  border-color:#bde5ce;
  background:#f1fbf6;
}

.detail.badbox{
  border-color:#efc8ce;
  background:#fff6f7;
}

.detail ul{
  margin:
    6px
    0
    0;

  padding-left:18px;
}

.reference{
  border:
    1px
    solid
    #ded7fb;

  background:#f6f4ff;
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
    rgba(
      0,
      0,
      0,
      .28
    );
}

dialog::backdrop{
  background:
    rgba(
      12,
      8,
      32,
      .7
    );
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
  .actions,
  .reviewparts{
    grid-template-columns:1fr;
  }

  .main{
    padding:16px;
  }

}

`;

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
            id="diagramImg"
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
        e.target
        ===
        imgDialog
      ){

        imgDialog.close();

      }

    }
  );

}

function renderNav(){

  const u=
    unlockIndex();


  stepNav.innerHTML=
    STEP_NAMES
    .map(
      (name,i)=>{

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


        return `

<button
  class="stepbtn ${cls}"
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


  stepNav
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


  progressText.textContent=
    `${c}/6 bước hoàn thành`;


  progressBar.style.width=
    `${c/6*100}%`;

}

function guideFor(step){

  return [

    `
      <b>Mục tiêu:</b>
      Nhận diện loại process, số giai đoạn,
      điểm đầu–cuối, đặc điểm nổi bật và
      <b>tự chọn cách chia Body 1/Body 2 hợp lý</b>.
      Không có một cách chia duy nhất; chỉ cần
      hai body nối tiếp nhau, không lặp ý và
      cùng nhau bao quát quá trình.
    `,

    `
      <b>Mục tiêu:</b>
      Paraphrase đề bài trong 1 câu.
      Introduction chỉ cần cho biết sơ đồ
      mô tả quá trình gì; chưa đưa chi tiết
      các stage.
    `,

    `
      <b>Mục tiêu:</b>
      Viết Overview gồm 2 ý:
      cấu trúc chung của quá trình và
      những thay đổi/đặc điểm nổi bật.
      Không sa vào mô tả chi tiết từng bước.
    `,

    `
      <b>Mục tiêu:</b>
      Viết Body 1 theo
      <b>cách chia em đã chọn ở Bước 1</b>.
      Không có một mốc chia cố định;
      ưu tiên trình tự rõ ràng,
      đủ chi tiết và không nhảy stage.
    `,

    `
      <b>Mục tiêu:</b>
      Viết Body 2 tiếp nối Body 1 theo
      <b>cách chia em đã chọn</b>,
      đi đến kết quả cuối cùng hoặc
      điểm quay lại của vòng đời.
      Không lặp lại các stage đã mô tả ở Body 1.
    `,

    `
      <b>Mục tiêu:</b>
      Viết lại toàn bài từ đầu,
      gồm 4 phần theo thứ tự
      Introduction → Overview → Body 1 → Body 2.
      Cố gắng viết từ trí nhớ trước khi
      mở phần xem lại.
    `

  ][step];

}

function fieldVal(id){

  return (
    document.getElementById(id)
    ?.value
    ||
    ''
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

function saveCurrentDraft(){

  const step=
    state.current;


  if(step===0){

    state.drafts.analysis={

      type:
        fieldVal('aType'),

      stages:
        fieldVal('aStages'),

      first:
        fieldVal('aFirst'),

      last:
        fieldVal('aLast'),

      features:
        fieldVal('aFeatures'),

      body1:
        fieldVal('aBody1'),

      body2:
        fieldVal('aBody2')

    };

  }else{

    const el=
      document.getElementById(
        'writeBox'
      );


    if(el){

      state.drafts[
        draftKey(step)
      ]=
        el.value;

    }

  }


  save();

}

function renderAnalysis(){

  const d=
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
  Riêng cách chia Body 1 và Body 2
  <b>không có một đáp án duy nhất</b>;
  em tự chọn mốc chia hợp lý.

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

    <textarea id="aFirst"></textarea>

  </div>


  <div class="field">

    <label>
      Last / return stage là gì?
    </label>

    <textarea id="aLast"></textarea>

  </div>


  <div
    class="field"
    style="grid-column:1/-1"
  >

    <label>
      Important features là gì?
    </label>

    <textarea id="aFeatures"></textarea>

  </div>


  <div class="field">

    <label>
      Em dự kiến Body 1 sẽ mô tả phần nào?
    </label>

    <textarea
      id="aBody1"
      placeholder="Ví dụ: stages 1–4, hoặc từ ... đến ..."
    ></textarea>

  </div>


  <div class="field">

    <label>
      Em dự kiến Body 2 sẽ mô tả phần nào?
    </label>

    <textarea
      id="aBody2"
      placeholder="Ví dụ: các stages còn lại, từ ... đến ..."
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
    d.type
    ||
    '';


  aStages.value=
    d.stages
    ||
    '';


  aFirst.value=
    d.first
    ||
    '';


  aLast.value=
    d.last
    ||
    '';


  aFeatures.value=
    d.features
    ||
    '';


  aBody1.value=
    d.body1
    ||
    '';


  aBody2.value=
    d.body2
    ||
    '';


  main
  .querySelectorAll(
    'input,textarea,select'
  )
  .forEach(
    el=>
    el.addEventListener(
      'input',
      saveCurrentDraft
    )
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
      state.scores[0],
      false
    );

  }

}

function planIsFilled(text){

  const t=
    String(text||'')
    .trim();


  return (
    words(t)>=2
    ||
    /\bstage(?:s)?\s*\d+/i.test(t)
    ||
    /\b\d+\s*[-–—]\s*\d+\b/.test(t)
  );

}

function checkAnalysis(){

  saveCurrentDraft();


  state.attempts[0]=
    attempts(0)
    +
    1;


  const a=
    state.drafts.analysis;


  const body1OK=
    planIsFilled(
      a.body1
    );


  const body2OK=
    planIsFilled(
      a.body2
    )
    &&
    norm(a.body2)
    !==
    norm(a.body1);


  const checks=[

    [
      'Process type',

      containsAny(
        a.type,
        task.analysis.type
      )
    ],

    [
      'Main stages',

      containsAny(
        a.stages,
        task.analysis.stages
      )
    ],

    [
      'First stage',

      task.analysis.first
      .filter(
        x=>
        containsAny(
          a.first,
          [x]
        )
      )
      .length
      >=
      2
    ],

    [
      'Last / return stage',

      task.analysis.last
      .filter(
        x=>
        containsAny(
          a.last,
          [x]
        )
      )
      .length
      >=
      2
    ],

    [
      'Important features',

      hits(
        a.features,
        chunkGroups(
          task.analysis.features,
          3
        )
      )
      .filter(Boolean)
      .length
      >=
      2
    ],

    [
      'Kế hoạch Body 1',
      body1OK
    ],

    [
      'Kế hoạch Body 2',
      body2OK
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


  if(result.completed){

    completeStep(0);

  }else{

    state.completed=
      state.completed.filter(
        x=>x<0
      );

  }


  save();


  showAnalysisFeedback(
    result,
    true
  );


  renderNav();
  renderProgress();


  nextBtn.disabled=
    !done(0);

}

function chunkGroups(
  items,
  size
){

  const groups=[];


  for(
    let i=0;
    i<items.length;
    i+=size
  ){

    groups.push(
      items.slice(
        i,
        i+size
      )
    );

  }


  return groups;

}

function analysisReference(){

  const a=
    task.analysis;


  return `

<b>
  Gợi ý phần phân tích:
</b>

<br>

• Type:
${task.type}

<br>

• Main stages:
${task.stages}

<br>

• First stage:
${esc(
  a.first
  .slice(0,3)
  .join(' / ')
)}

<br>

• Last/return stage:
${esc(
  a.last
  .slice(0,4)
  .join(' / ')
)}

<br>

• Important features:
${esc(
  a.features
  .join(' · ')
)}

<br><br>

<b>
  Cách chia Body 1/Body 2:
</b>

không có đáp án duy nhất.
Chỉ cần chọn một mốc chia hợp lý,
hai đoạn đi theo đúng thứ tự,
không lặp stage và khi ghép lại
bao quát toàn bộ quá trình.

<br><br>

<b>
  Một cách chia tham khảo:
</b>

<br>

• Body 1:
${esc(
  a.body1
  .join(' · ')
)}

<br>

• Body 2:
${esc(
  a.body2
  .join(' · ')
)}

  `;

}

function showAnalysisFeedback(r){

  const f=
    document.getElementById(
      'feedback'
    );


  if(!f){
    return;
  }


  f.className=
    'feedback show';


  const rows=
    r.checks
    .map(
      ([n,ok])=>
      `
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
            ${n}
          </b>

          <span>

            ${
              ok
              ?
              '✓ Hợp lý / đủ ý'
              :
              'Cần bổ sung hoặc làm rõ'
            }

          </span>

        </div>
      `
    )
    .join('');


  const ref=

    !r.completed
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
        'Cần sửa các mục còn thiếu'
      }

    </div>

  </div>


  <div class="counter">

    Body 1/2 được chấm theo tính hợp lý,
    không theo một mốc chia cố định

  </div>

</div>


<div class="analysis-result">
  ${rows}
</div>


${ref}

  `;

}


function sectionConfig(step){

  return task[
    draftKey(step)
  ];

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

function hasPhrase(
  text,
  phrase
){

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


  if(!topic.requiredOK){

    issues.push(
      `Sai hoặc thiếu đối tượng chính. Bài này mô tả “${topic.expected}”.`
    );

  }


  if(topic.wrong.length){

    issues.push(
      `Sai nội dung: em đang nhắc tới “${topic.wrong.join(', ')}”, không thuộc sơ đồ này.`
    );

  }


  if(!framingOK){

    issues.push(
      'Introduction nên cho biết đây là diagram/figure.'
    );

  }


  if(!describeOK){

    issues.push(
      'Cần dùng một động từ mô tả phù hợp như illustrates, shows hoặc depicts.'
    );

  }


  if(!processOK){

    issues.push(
      'Chưa diễn đạt rõ sơ đồ mô tả một process/life cycle.'
    );

  }


  if(wc<8){

    issues.push(
      `Câu còn quá ngắn (${wc} từ).`
    );

  }


  grammar.forEach(
    x=>
    issues.push(
      'Ngữ pháp/trình bày: '
      +
      x
    )
  );


  let score=

    (
      topic.requiredOK
      ?
      40
      :
      0
    )

    +

    (
      framingOK
      ?
      12
      :
      0
    )

    +

    (
      describeOK
      ?
      15
      :
      0
    )

    +

    (
      processOK
      ?
      15
      :
      0
    )

    +

    (
      wc>=8
      ?
      8
      :
      Math.round(
        wc/8*8
      )
    )

    +

    Math.max(
      0,
      10
      -
      grammar.length*4
    );


  if(topic.wrong.length){

    score=
      Math.min(
        score,
        40
      );

  }


  if(!topic.requiredOK){

    score=
      Math.min(
        score,
        50
      );

  }


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

      grammar.length<=1,

    wc,
    grammar,
    issues

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
    hits(
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


  const issues=[];


  if(topic.wrong.length){

    issues.push(
      `Có nội dung thuộc bài khác: “${topic.wrong.join(', ')}”.`
    );

  }


  if(!overviewMarker){

    issues.push(
      'Chưa có dấu hiệu mở Overview rõ ràng, ví dụ Overall / In general.'
    );

  }


  if(!firstOK){

    issues.push(
      'Overview chưa thể hiện rõ điểm bắt đầu của process.'
    );

  }


  if(!lastOK){

    issues.push(
      'Overview chưa thể hiện rõ điểm kết thúc / return stage.'
    );

  }


  if(ratio<.45){

    issues.push(
      'Overview chưa khái quát đủ đặc điểm nổi bật của process.'
    );

  }


  if(wc<25){

    issues.push(
      `Overview còn ngắn (${wc} từ).`
    );

  }


  grammar.forEach(
    x=>
    issues.push(
      'Ngữ pháp/trình bày: '
      +
      x
    )
  );


  let score=

    (
      overviewMarker
      ?
      15
      :
      0
    )

    +

    (
      firstOK
      ?
      20
      :
      0
    )

    +

    (
      lastOK
      ?
      20
      :
      0
    )

    +

    Math.round(
      Math.min(
        1,
        ratio/.65
      )
      *
      25
    )

    +

    (
      wc>=25
      ?
      10
      :
      Math.round(
        wc/25*10
      )
    )

    +

    Math.max(
      0,
      10
      -
      grammar.length*4
    );


  if(topic.wrong.length){

    score=
      Math.min(
        score,
        45
      );

  }


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

      ratio>=.45

      &&

      wc>=25

      &&

      grammar.length<=1,

    wc,
    issues

  };

}


/* =========================================================
   GRAMMAR CHECK
========================================================= */

function grammarIssues(text){

  const s=
    String(
      text
      ||
      ''
    )
    .trim();


  const n=
    norm(s);


  const issues=[];


  if(!s){

    return [
      'Chưa có câu trả lời.'
    ];

  }


  if(
    !/^[A-Z]/.test(s)
  ){

    issues.push(
      'Viết hoa chữ cái đầu câu/đoạn.'
    );

  }


  if(
    !/[.!?]$/.test(s)
  ){

    issues.push(
      'Nên kết thúc bằng dấu câu.'
    );

  }


  if(
    /\s{2,}/.test(s)
  ){

    issues.push(
      'Có khoảng trắng thừa.'
    );

  }


  if(
    /\b(is|are|was|were)\s+\1\b/i
    .test(n)
  ){

    issues.push(
      'Có trợ động từ bị lặp.'
    );

  }


  if(
    /\b(the|a|an)\s+\1\b/i
    .test(n)
  ){

    issues.push(
      'Có mạo từ bị lặp.'
    );

  }


  const parts=[

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
    'sealed',
    'boiled',
    'transported'

  ];


  for(
    const p
    of
    parts
  ){

    const re=
      new RegExp(

        `\\b(?:clay|bricks|bottles|tomatoes|noodles|mixture|plastic)\\s+${p}\\b`,

        'i'

      );


    if(
      re.test(n)
    ){

      issues.push(
        `Kiểm tra câu bị động với “${p}”: thường cần be + V3.`
      );

    }

  }


  return [
    ...new Set(
      issues
    )
  ];

}


/* =========================================================
   FLEXIBLE BODY GRADING
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

      const key=
        (g||[])
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

function flexibleBodyGrade(
  step,
  text
){

  const cfg=
    sectionConfig(step);


  const groups=
    globalBodyGroups();


  const h=
    hits(
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


  const seqOK=

    !cfg.sequence?.length

    ||

    containsAny(
      text,
      cfg.sequence
    );


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
    hits(
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


  let pts=

    Math.round(
      Math.min(
        1,
        hitCount/minHits
      )
      *
      55
    )

    +

    (
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
      )
    )

    +

    (
      seqOK
      ?
      10
      :
      0
    )

    +

    Math.max(
      0,
      10
      -
      grammar.length*4
    )

    +

    (
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

      10
    );


  pts=
    Math.min(
      100,
      pts
    );


  const issues=[];


  if(topic.wrong.length){

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


  if(!seqOK){

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
      'Khi ghép Body 1 và Body 2, vẫn còn khá nhiều stage/đặc điểm của toàn bộ process chưa được thể hiện. Hãy đối chiếu lại sơ đồ để tránh bỏ sót.'
    );

  }


  grammar.forEach(
    x=>
    issues.push(
      'Ngữ pháp/trình bày: '
      +
      x
    )
  );


  if(topic.wrong.length){

    pts=
      Math.min(
        pts,
        45
      );

  }


  const completed=

    topic.wrong.length===0

    &&

    hitCount>=minHits

    &&

    wc>=Math.round(
      cfg.minWords*.8
    )

    &&

    seqOK

    &&

    coverageOK

    &&

    grammar.length<=1;


  return {

    total:pts,

    completed,

    ratio:
      hitCount
      /
      Math.max(
        1,
        groups.length
      ),

    wc,

    seqOK,

    grammar,

    issues,

    flexibleBody:true,

    combinedRatio

  };

}


/* =========================================================
   SECTION GRADING
========================================================= */

function sectionGrade(
  step,
  text
){

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
    hits(
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


  let seqOK=true;


  if(cfg.sequence?.length){

    seqOK=
      containsAny(
        text,
        cfg.sequence
      );

  }


  let pts=

    Math.round(
      ratio*70
    )

    +

    (
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
      )
    )

    +

    (
      seqOK
      ?
      8
      :
      0
    )

    +

    Math.max(
      0,
      7
      -
      grammar.length*3
    );


  pts=
    Math.min(
      100,
      pts
    );


  const issues=[];


  if(topic.wrong.length){

    issues.push(
      `Có nội dung thuộc process khác: “${topic.wrong.join(', ')}”.`
    );

  }


  if(ratio<.75){

    const miss=

      (
        cfg.concepts
        ||
        []
      )

      .filter(
        (_,i)=>
        !h[i]
      )

      .map(
        g=>g[0]
      );


    issues.push(
      'Ý/stage còn thiếu: '
      +
      miss.join(', ')
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


  if(!seqOK){

    issues.push(
      'Nên có từ/cụm nối để thể hiện đúng trình tự các stage.'
    );

  }


  grammar.forEach(
    x=>
    issues.push(
      'Ngữ pháp/trình bày: '
      +
      x
    )
  );


  if(topic.wrong.length){

    pts=
      Math.min(
        pts,
        45
      );

  }


  return {

    total:pts,

    completed:

      topic.wrong.length===0

      &&

      ratio>=.75

      &&

      wc>=Math.round(
        cfg.minWords*.8
      )

      &&

      seqOK

      &&

      grammar.length<=1,

    wc,

    issues

  };

}


/* =========================================================
   WRITING SCREEN
========================================================= */

function renderWriting(step){

  const title=
    STEP_NAMES[step];


  const d=
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
    step===5

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
>${esc(d)}</textarea>


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


  updateWC();


  writeBox.addEventListener(
    'input',
    ()=>{

      state.drafts[
        draftKey(step)
      ]=
        writeBox.value;


      save();

      updateWC();

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
      state.scores[step],
      false
    );

  }

}

function updateWC(){

  const e=
    document.getElementById(
      'wordCount'
    );


  const w=
    document.getElementById(
      'writeBox'
    );


  if(
    e
    &&
    w
  ){

    e.textContent=
      `${words(w.value)} từ`;

  }

}


/* =========================================================
   FULL ESSAY
========================================================= */

function fullGrade(text){

  const wc=
    words(text);


  const paras=
    String(
      text
      ||
      ''
    )
    .trim()
    .split(
      /\n\s*\n|\n(?=[A-Z])/
    )
    .filter(
      x=>
      x.trim().length>20
    )
    .length;


  const groups=[

    ...task.intro.concepts,

    ...task.overview.concepts,

    ...task.body1.concepts,

    ...task.body2.concepts

  ];


  const h=
    hits(
      text,
      groups
    );


  const ratio=
    h.filter(Boolean).length
    /
    h.length;


  const grammar=
    grammarIssues(text);


  const topic=
    topicCheck(text);


  const hasOverview=
    /\boverall\b/i
    .test(text);


  let pts=

    Math.round(
      ratio*55
    )

    +

    (
      wc>=150

      ?

      20

      :

      Math.round(
        Math.min(
          20,
          wc/150*20
        )
      )
    )

    +

    (
      hasOverview
      ?
      10
      :
      0
    )

    +

    (
      paras>=4
      ?
      8
      :
      0
    )

    +

    Math.max(
      0,
      7
      -
      grammar.length*3
    );


  pts=
    Math.min(
      100,
      pts
    );


  const issues=[];


  if(!topic.requiredOK){

    issues.push(
      `Bài chưa thể hiện rõ đúng đối tượng chính: “${topic.expected}”.`
    );

  }


  if(topic.wrong.length){

    issues.push(
      `Có nội dung thuộc process khác: “${topic.wrong.join(', ')}”.`
    );

  }


  if(wc<150){

    issues.push(
      `Bài hiện có ${wc} từ; Writing Task 1 nên đạt tối thiểu 150 từ.`
    );

  }


  if(!hasOverview){

    issues.push(
      'Chưa thấy Overview rõ ràng (có thể mở đầu bằng “Overall,”).'
    );

  }


  if(paras<4){

    issues.push(
      `Bài nên tách 4 phần/đoạn rõ ràng; hệ thống đang nhận khoảng ${paras} đoạn.`
    );

  }


  if(ratio<.72){

    const missing=

      groups

      .filter(
        (_,i)=>
        !h[i]
      )

      .map(
        g=>g[0]
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
    x=>
    issues.push(
      'Ngữ pháp/trình bày: '
      +
      x
    )
  );


  if(
    topic.wrong.length
    ||
    !topic.requiredOK
  ){

    pts=
      Math.min(
        pts,
        50
      );

  }


  const completed=

    topic.requiredOK

    &&

    topic.wrong.length===0

    &&

    wc>=150

    &&

    hasOverview

    &&

    paras>=4

    &&

    ratio>=.72

    &&

    grammar.length<=1;


  return {

    total:pts,

    completed,

    ratio,

    wc,

    paras,

    grammar,

    issues

  };

}


/* =========================================================
   CHECK + FEEDBACK
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


  const r=

    step===5

    ?

    fullGrade(text)

    :

    sectionGrade(
      step,
      text
    );


  state.scores[step]=
    r;


  if(r.completed){

    completeStep(step);

  }else{

    /*
      Nếu bước đã từng đạt nhưng học sinh
      sửa thành câu sai thì thu hồi trạng thái đạt,
      đồng thời khóa các bước phía sau.
    */

    state.completed=
      state.completed.filter(
        x=>x<step
      );

  }


  save();


  showWritingFeedback(
    step,
    r,
    true
  );


  renderNav();
  renderProgress();


  const nb=
    document.getElementById(
      'nextBtn'
    );


  if(
    nb
    &&
    step<5
  ){

    nb.disabled=
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

    !r.completed

    &&

    attempts(step)>=2;


  const ref=

    step===5

    ?

    task.fullReference

    :

    sectionConfig(step).reference;


  const refLabel=

    (
      step===3
      ||
      step===4
    )

    ?

    'Một cách triển khai tham khảo (không phải cách chia duy nhất):'

    :

    'Bài tham khảo:';


  const issues=

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
      'Phần này đạt yêu cầu.'
      :
      'Cần sửa:'
    }

  </b>

  ${
    r.issues.length

    ?

    `
      <ul>

        ${
          r.issues
          .map(
            x=>
            `
              <li>
                ${esc(x)}
              </li>
            `
          )
          .join('')
        }

      </ul>
    `

    :

    ''
  }

</div>

    `

    :

    `

<div class="detail goodbox">

  <b>
    Đạt yêu cầu.
  </b>

  Nội dung và trình tự chính đã phù hợp.

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


${issues}


${
  showRef

  ?

  `

<div class="reference">

  <b>
    ${refLabel}
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

    finalDone.innerHTML=`

<div class="finaldone">

  <h3>
    🎉 Hoàn thành
    ${esc(task.title)}
  </h3>

  <p>
    Em đã đi đủ 6 bước từ phân tích
    đến full essay.
    Có thể quay lại từng bước
    để ôn lại cách triển khai.
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
