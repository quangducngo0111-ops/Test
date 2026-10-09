(()=>{
'use strict';

const TASKS=window.PROCESS_TASKS||{};
const ID=String(window.PROCESS_TASK_ID||'01').padStart(2,'0');
const task=TASKS[ID];

if(!task){
  document.body.innerHTML='<p style="padding:30px;font-family:sans-serif">Không tìm thấy dữ liệu bài Process.</p>';
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
  'WT1_PROCESS_GUIDED_V3_'
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

function norm(v){
  return String(v||'')
    .toLowerCase()
    .replace(/[’‘]/g,"'")
    .replace(/[^a-z0-9°%–—'\s-]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

function words(v){
  return String(v||'')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
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

function containsAny(
  text,
  variants=[]
){
  const t=norm(text);

  return variants.some(
    v=>t.includes(
      norm(v)
    )
  );
}

function groupHits(
  text,
  groups=[]
){
  return groups.map(
    g=>containsAny(
      text,
      g
    )
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
    ...new Set(
      state.completed
    )
  ].sort(
    (a,b)=>a-b
  );

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
    rgba(
      40,
      18,
      96,
      .14
    );
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
    rgba(
      255,
      255,
      255,
      .94
    );

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
    rgba(
      117,
      89,
      232,
      .07
    );
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
    rgba(
      117,
      89,
      232,
      .07
    );
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
            Học theo 6 bước · hoàn thành bước trước
            để mở bước tiếp theo · chữa ngay tại từng bước.
          </p>

        </div>


        <div class="progresswrap">

          <div class="prow">

            <span>
              Tiến độ
            </span>

            <span
              id="progressText"
            ></span>

          </div>

          <div class="progress">

            <i
              id="progressBar"
            ></i>

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
      localStorage.getItem(
        STUDENT_KEY
      )
      ||
      'null'
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

  const unlocked=
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

        i>unlocked
        ?
        'locked'
        :
        ''
      ]
      .filter(Boolean)
      .join(' ');


      return `

        <button

          class="
            stepbtn
            ${cls}
          "

          ${
            i>unlocked
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
                i>unlocked
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
    btn=>{

      btn.onclick=
      ()=>{

        const i=
        Number(
          btn.dataset.step
        );


        if(
          i
          <=
          unlockIndex()
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

  const count=
  state.completed.length;


  progressText.textContent=
  `${count}/6 bước hoàn thành`;


  progressBar.style.width=
  `${count/6*100}%`;

}

function guideFor(step){

  return [

    `
      <b>Mục tiêu:</b>
      Nhận diện loại process, số giai đoạn,
      điểm đầu–cuối và đặc điểm nổi bật.
      Với Body 1 và Body 2, em
      <b>tự chọn cách chia hợp lý</b>;
      không có một mốc chia duy nhất.
    `,

    `
      <b>Mục tiêu:</b>
      Paraphrase đề bài trong 1 câu.
      Introduction chỉ cần cho biết sơ đồ
      mô tả quá trình gì; chưa mô tả chi tiết các stage.
    `,

    `
      <b>Mục tiêu:</b>
      Viết Overview nêu cấu trúc chung của quá trình
      và điểm đầu–cuối/biến đổi nổi bật.
      Không sa vào chi tiết từng stage.
    `,

    `
      <b>Mục tiêu:</b>
      Viết Body 1 theo
      <b>cách chia em đã chọn ở Bước 1</b>.
      Hệ thống không bắt một nhóm stage cố định;
      cần mô tả đủ một cụm stage liên tiếp,
      đúng trình tự và rõ ràng.
    `,

    `
      <b>Mục tiêu:</b>
      Viết Body 2 tiếp nối Body 1 theo
      <b>cách chia em đã chọn</b>.
      Khi ghép hai body, bài cần bao quát phần lớn
      toàn bộ process và không lặp lại cùng một nhóm stage.
    `,

    `
      <b>Mục tiêu:</b>
      Viết lại toàn bài từ đầu,
      gồm Introduction → Overview → Body 1 → Body 2.
      Cố gắng viết từ trí nhớ trước khi mở phần xem lại.
    `

  ][step];

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
    document.getElementById(
      id
    )
    ?.value
    ||
    ''
  );

}

function saveCurrentDraft(){

  const step=
  state.current;


  if(step===0){

    state.drafts.analysis={

      type:
      fieldValue(
        'aType'
      ),

      stages:
      fieldValue(
        'aStages'
      ),

      first:
      fieldValue(
        'aFirst'
      ),

      last:
      fieldValue(
        'aLast'
      ),

      features:
      fieldValue(
        'aFeatures'
      ),

      body1:
      fieldValue(
        'aBody1'
      ),

      body2:
      fieldValue(
        'aBody2'
      )

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

function keywordScore(
  text,
  keywords=[]
){

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


  const t=
  norm(text);


  return (
    unique
    .filter(
      k=>
      t.includes(k)
    )
    .length
    /
    unique.length
  );

}

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


  const h=
  groupHits(
    text,
    groups
  );


  return {

    hits:h,

    count:
    h.filter(Boolean).length,

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
      x=>
      x.length>3
    )
  );


  const B=
  new Set(
    norm(b)
    .split(/\s+/)
    .filter(
      x=>
      x.length>3
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
    x=>{

      if(
        B.has(x)
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
      Riêng Body 1/Body 2, hãy tự chọn điểm chia hợp lý;
      hệ thống không dùng một đáp án chia body duy nhất.

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
        style="
          grid-column:1/-1
        "
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
          placeholder="Tự chọn một nhóm stage liên tiếp..."
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


  const a=
  state.drafts.analysis;


  const p1=
  bodyPlanInfo(
    a.body1
  );


  const p2=
  bodyPlanInfo(
    a.body2
  );


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
      keywordScore(
        a.first,
        task.analysis.first
      )
      >=
      .5
    ],

    [
      'Last / return stage',
      keywordScore(
        a.last,
        task.analysis.last
      )
      >=
      .35
    ],

    [
      'Important features',
      keywordScore(
        a.features,
        task.analysis.features
      )
      >=
      .3
    ],

    [
      'Body 1: có một nhóm stage hợp lý',

      words(
        a.body1
      )
      >=
      3

      &&

      p1.count
      >=
      1
    ],

    [
      'Body 2: tiếp nối và không lặp Body 1',

      words(
        a.body2
      )
      >=
      3

      &&

      p2.count
      >=
      1

      &&

      bodyPlansAreDistinct(
        a.body1,
        a.body2
      )
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


  if(
    result.completed
  ){
    completeStep(0);
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

  return `

    <b>
      Một cách chia tham khảo — không phải đáp án duy nhất:
    </b>

    <br>

    • Type:
    ${esc(task.type)}

    <br>

    • Main stages:
    ${task.stages}

    <br>

    • First stage:
    ${esc(
      (task.analysis.first||[])
      .join(' / ')
    )}

    <br>

    • Last/return stage:
    ${esc(
      (task.analysis.last||[])
      .join(' / ')
    )}

    <br>

    • Important features:
    ${esc(
      (task.analysis.features||[])
      .join(' · ')
    )}

    <br>

    • Một cách chia Body 1:
    ${esc(
      (task.analysis.body1||[])
      .join(' · ')
    )}

    <br>

    • Một cách chia Body 2:
    ${esc(
      (task.analysis.body2||[])
      .join(' · ')
    )}

    <br><br>

    <b>
      Lưu ý:
    </b>

    học sinh có thể chia ở mốc khác nếu
    hai body vẫn theo trình tự,
    không lặp và bao quát process.

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
    ([n,ok])=>`

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
        không theo mốc chia cố định

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
    /\b(is|are|was|were)\s+\1\b/i.test(n)
  ){
    issues.push(
      'Có trợ động từ bị lặp.'
    );
  }


  if(
    /\b(the|a|an)\s+\1\b/i.test(n)
  ){
    issues.push(
      'Có mạo từ bị lặp.'
    );
  }


  const passive=[

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
    'transported'

  ];


  for(
    const p
    of
    passive
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

function flexibleBodyGrade(
  step,
  text
){

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
        groups.length
        *
        .18
      )
    )
  );


  const wc=
  words(text);


  const grammar=
  grammarIssues(text);


  const seqOK=

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

    const a=
    norm(
      state.drafts.body1
    )
    .split(/\s+/)
    .filter(
      x=>x.length>3
    );


    const b=
    norm(text)
    .split(/\s+/)
    .filter(
      x=>x.length>3
    );


    const A=
    new Set(a);


    const B=
    new Set(b);


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


  let score=

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
    grammar.length
    *
    4
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
        combinedRatio
        /
        .48
        *
        10
      )
    )

    :

    10
  )

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
    !seqOK
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
      'Khi ghép Body 1 và Body 2, vẫn còn khá nhiều stage của toàn bộ process chưa được thể hiện. Hãy đối chiếu lại sơ đồ để tránh bỏ sót.'
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
    x=>
    issues.push(
      'Ngữ pháp/trình bày: '
      +
      x
    )
  );


  const completed=

  hitCount>=minHits

  &&

  wc
  >=
  Math.round(
    cfg.minWords
    *
    .8
  )

  &&

  seqOK

  &&

  coverageOK

  &&

  overlapPenalty===0

  &&

  grammar.length<=1;


  return {

    total:score,

    completed,

    wc,

    issues,

    flexibleBody:true,

    combinedRatio

  };

}

function sectionGrade(
  step,
  text
){

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
    cfg.concepts
    ||
    []
  );


  const ratio=

  h.length

  ?

  h
  .filter(Boolean)
  .length
  /
  h.length

  :

  1;


  const wc=
  words(text);


  const grammar=
  grammarIssues(text);


  const seqOK=

  !cfg.sequence?.length

  ||

  containsAny(
    text,
    cfg.sequence
  );


  let score=

  Math.round(
    ratio
    *
    70
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
    grammar.length
    *
    3
  );


  score=
  Math.min(
    100,
    score
  );


  const issues=[];


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
      (_,i)=>!h[i]
    )
    .map(
      g=>g[0]
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
    !seqOK
  ){

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


  return {

    total:score,

    completed:

      ratio>=.75

      &&

      wc
      >=
      Math.round(
        cfg.minWords
        *
        .8
      )

      &&

      seqOK

      &&

      grammar.length<=1,

    wc,

    issues

  };

}

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
        full

        ?

        `
          Viết lại toàn bộ bài từ trí nhớ.
          Chỉ mở các phần xem lại khi thật sự cần.
        `

        :

        `
          Viết phần này dựa trên sơ đồ và
          kết quả phân tích ở Bước 1.
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


    <div
      id="finalDone"
    ></div>

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
  groupHits(
    text,
    groups
  );


  const ratio=
  h.filter(Boolean).length
  /
  h.length;


  const grammar=
  grammarIssues(text);


  const hasOverview=
  /\boverall\b/i.test(text);


  let score=

  Math.round(
    ratio
    *
    55
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
    grammar.length
    *
    3
  );


  score=
  Math.min(
    100,
    score
  );


  const issues=[];


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
      'Chưa thấy Overview rõ ràng (có thể mở đầu bằng “Overall,”).'
    );

  }


  if(
    paras<4
  ){

    issues.push(
      `Bài nên tách 4 phần/đoạn rõ ràng; hệ thống đang nhận khoảng ${paras} đoạn.`
    );

  }


  if(
    ratio<.72
  ){

    const missing=
    groups
    .filter(
      (_,i)=>!h[i]
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


  return {

    total:score,

    completed:

      wc>=150

      &&

      hasOverview

      &&

      paras>=4

      &&

      ratio>=.72

      &&

      grammar.length<=1,

    wc,

    issues

  };

}

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

  !r.completed

  &&

  attempts(step)>=2;


  const reference=

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

  'Một cách triển khai tham khảo — không phải cách chia duy nhất:'

  :

  'Bài tham khảo:';


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
          'Phần này đạt yêu cầu.'
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


    ${detail}


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
          đến full essay. Có thể quay lại
          từng bước để ôn lại cách triển khai.
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


  state.current===0

  ?

  renderAnalysis()

  :

  renderWriting(
    state.current
  );

}

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
