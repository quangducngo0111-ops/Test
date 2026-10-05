/* Process step visual helper
   Used by:
   - Practice/Vocabulary/index.html (Phase 2 test)
   - Practice/Vocabulary/process/sentence-practice/index.html (Phase 3)
*/
(function(){
  'use strict';

  const SETS={
    'process-01-bricks':{
      file:'bricks.png',size:[967,561],title:'Manufacturing Bricks',
      crops:{
        '01':{box:[70,40,305,215],label:'Clay is dug from the ground'},
        '02':{box:[315,65,560,220],label:'Clay passes through a metal grid and roller'},
        '03':{box:[495,5,640,145],label:'Sand and water are added'},
        '04':{box:[560,60,850,205],label:'Bricks are shaped using a mould or wire cutter'},
        '05':{box:[630,205,835,375],label:'Bricks are dried in a drying oven'},
        '06':{box:[355,240,535,395],label:'Bricks are heated at a moderate temperature'},
        '07':{box:[215,240,405,395],label:'Bricks are heated at a high temperature'},
        '08':{box:[80,235,230,390],label:'Bricks are cooled in a cooling chamber'},
        '09':{box:[180,395,405,540],label:'Bricks are packaged'},
        '10':{box:[480,400,815,505],label:'Bricks are delivered'},
        '02_03':{box:[300,55,650,225],label:'Clay is crushed, then mixed with sand and water'},
        '06_07':{box:[205,230,545,400],label:'Bricks are heated in two kilns'},
        '09_10':{box:[175,390,825,545],label:'Finished bricks are packaged and delivered'}
      },
      words:{
        'clay':'01','raw material':'01','dig / excavate clay':'01',
        'remove impurities':'02','pass through a metal grid':'02','crush':'02',
        'sand':'03','water':'03','mix':'03',
        'mould':'04','wire cutter':'04','cut':'04','shape into bricks':'04',
        'dry in a drying oven':'05','fire in a kiln':'06_07','moderate temperature':'06','high temperature':'07',
        'cooling chamber':'08','packaging':'09','delivery':'10'
      },
      phase3:{1:'01',2:'02',3:'02_03',4:'04',5:'05',6:'06_07',7:'08',8:'09_10'}
    },

    'process-02-instant-noodles':{
      file:'instant-noodles.png',size:[921,589],title:'Manufacturing Instant Noodles',
      crops:{
        '01':{box:[135,100,505,215],label:'Flour is stored in storage silos'},
        '02':{box:[70,235,335,410],label:'Flour is mixed with water and oil'},
        '03':{box:[285,235,430,405],label:'Dough sheets are formed'},
        '04':{box:[420,235,580,405],label:'Dough is cut into strips'},
        '05':{box:[560,235,750,405],label:'Noodles are shaped into discs'},
        '06':{box:[730,235,905,410],label:'Noodle discs are cooked in oil and dried'},
        '07':{box:[725,300,905,470],label:'Noodles are put into cups'},
        '08':{box:[565,380,790,455],label:'Vegetables and spices are added'},
        '09':{box:[565,425,905,555],label:'Cups are labelled and sealed'},
        '03_04':{box:[280,225,585,410],label:'Dough is rolled into sheets and cut into strips'},
        '07_08_09':{box:[555,365,910,560],label:'Noodles are packed into cups, seasoned, labelled and sealed'}
      },
      words:{
        'flour':'01','storage silo':'01',
        'water and oil':'02','dough':'02','mix':'02','combine':'02','knead the dough':'02',
        'dough sheets':'03','pass through rollers':'03','roll into sheets':'03',
        'dough strips':'04','cut into strips':'04',
        'noodle discs':'05','shape into discs':'05',
        'cook in oil':'06','dry':'06',
        'package into cups':'07','add vegetables and spices':'08',
        'label and seal':'09','final product':'09','ready for consumption':'09'
      },
      phase3:{1:'02',2:'02',3:'03_04',4:'05',5:'06',6:'08',7:'07',8:'09',9:'07_08_09'}
    },

    'process-03-tomato-ketchup':{
      file:'tomato-ketchup.png',size:[896,586],title:'Manufacturing Tomato Ketchup',
      crops:{
        '01':{box:[20,15,190,205],label:'Tomatoes are picked and put in baskets'},
        '02':{box:[185,15,350,205],label:'Good and bad tomatoes are sorted'},
        '03':{box:[350,15,545,205],label:'Tomatoes are sent to the factory'},
        '04':{box:[535,15,735,205],label:'Stalks, seeds and skin are removed'},
        '05':{box:[730,15,885,205],label:'Tomatoes are put into a container'},
        '06':{box:[20,205,190,395],label:'Tomatoes are crushed'},
        '07':{box:[190,205,365,395],label:'Sugar, vinegar and salt are added'},
        '08':{box:[365,205,545,395],label:'The tomato mixture is boiled'},
        '09':{box:[540,205,710,395],label:'The mixture is left for two hours'},
        '10':{box:[720,205,885,395],label:'Ketchup is poured into bottles'},
        '11':{box:[20,395,170,575],label:'Bottles are labelled'},
        '12':{box:[180,395,365,575],label:'The bottles undergo quality control'},
        '13':{box:[360,395,540,575],label:'Bottles are packed into boxes'},
        '14':{box:[535,395,735,575],label:'Ketchup is delivered to supermarkets'},
        '15':{box:[730,395,885,575],label:'The final product is consumed'},
        '01_02':{box:[15,10,355,210],label:'Tomatoes are picked and sorted'},
        '08_09':{box:[355,200,715,400],label:'The mixture is boiled and left for two hours'},
        '10_11':{box:[705,200,890,575],label:'Ketchup is bottled and labelled'},
        '12_13_14':{box:[175,390,740,580],label:'Quality control, packaging and delivery'}
      },
      words:{
        'tomato':'01','ripe tomatoes':'01','pick tomatoes':'01','sort tomatoes':'02','send to factory':'03',
        'seeds':'04','skin':'04','stalk':'04','remove seeds and skin':'04',
        'crush tomatoes':'06','tomato mixture':'06','add sugar, vinegar and salt':'07','boil':'08',
        'leave for two hours':'09','cool down':'09','bottle':'10','label bottles':'11',
        'quality control':'12','package':'13','deliver to supermarkets':'14'
      },
      phase3:{1:'01_02',2:'03',3:'04',4:'06',5:'07',6:'08_09',7:'09',8:'10_11',9:'12_13_14'}
    },

    'process-04-frog-life-cycle':{
      file:'frog-life-cycle.png',size:[769,502],title:'Frog Life Cycle',
      crops:{
        '01':{box:[345,35,455,140],label:'Eggs / frogspawn'},
        '02':{box:[470,20,610,120],label:'Embryo stage'},
        '03':{box:[475,75,730,205],label:'Tadpoles cling to water plants'},
        '04':{box:[445,190,685,295],label:'Tadpoles develop external gills'},
        '05':{box:[510,275,750,360],label:'The tail continues to grow'},
        '06':{box:[505,300,765,465],label:'Hind legs appear'},
        '07':{box:[305,325,535,445],label:'The tadpole relies on food stored in the tail'},
        '08':{box:[25,355,255,470],label:'Front legs appear'},
        '09':{box:[20,255,255,355],label:'The tail becomes shorter'},
        '10':{box:[15,190,260,280],label:'Young frog'},
        '11':{box:[15,15,305,170],label:'Adult frog'},
        '02_03':{box:[335,15,735,210],label:'Embryo develops and hatches into a tadpole'},
        '06_08':{box:[10,290,765,480],label:'Hind legs and front legs develop'},
        'meta':{box:[15,250,765,490],label:'The tadpole undergoes metamorphosis'},
        '05_07':{box:[300,270,760,450],label:'The tail grows and stores nutrients'},
        '09_10':{box:[10,180,270,360],label:'The tail shortens as the tadpole becomes a young frog'},
        '10_11':{box:[10,10,310,285],label:'A young frog develops into an adult frog'}
      },
      words:{
        'frogspawn':'01','embryo':'02',
        'tadpole':'03','hatch from eggs':'03','cling to water plants':'03','aquatic plants':'03',
        'external gills':'04','breathe through external gills':'04','tail continues to grow':'05',
        'nutrients stored in the tail':'07','rely on nutrients for nourishment':'07','hind legs appear':'06','front legs appear':'08',
        'limb development':'meta','undergo metamorphosis':'meta','undergo morphological changes':'meta',
        'gradually lose its tail':'09','tail becomes shorter':'09','young frog':'10','transition into a young frog':'10',
        'adult frog':'11','develop into an adult frog':'11','reach maturity':'11'
      },
      phase3:{1:'01',2:'02_03',3:'03',4:'04',5:'05_07',6:'06_08',7:'meta',8:'09_10',9:'10_11',10:'11'}
    },

    'process-05-bee-life-cycle':{
      file:'bee-life-cycle.png',size:[845,559],title:'Bee Life Cycle',
      crops:{
        '01':{box:[300,5,625,110],label:'Female bees lay eggs every three days'},
        '02':{box:[495,170,835,275],label:'Eggs hatch after 9–10 days'},
        '03':{box:[360,340,650,535],label:'First moulting'},
        '04':{box:[100,350,345,535],label:'Second moulting'},
        '05':{box:[10,165,315,325],label:'A young adult emerges'},
        '06':{box:[125,95,320,235],label:'The young adult takes four days to reach maturity'},
        '03_04':{box:[95,330,655,540],label:'The bee undergoes moulting stages'},
        'full':{box:[0,0,845,559],label:'The full bee life cycle takes 34–36 days'}
      },
      words:{
        'female bee':'01','lay 1 or 2 eggs':'01','lay eggs every three days':'01',
        'eggs hatch':'02','hatch after 9–10 days':'02','first moulting':'03','moult':'03',
        'second moulting':'04','young adult':'05','young adult emerges':'05','4 days to maturity':'06','reach maturity':'06',
        'life cycle':'full','life cycle takes 34–36 days':'full'
      },
      phase3:{1:'01',2:'02',3:'03',4:'04',5:'03_04',6:'05',7:'06',8:'full'}
    },

    'process-06-plastic-bottles':{
      file:'plastic-bottles.png',size:[783,554],title:'Recycling Plastic Bottles',
      crops:{
        '01':{box:[15,65,210,185],label:'Used plastic bottles are put into a recycling bin'},
        '02':{box:[225,70,470,185],label:'Bottles are transported by truck'},
        '03':{box:[530,55,775,235],label:'Bottles are sorted at a recycling centre'},
        '04':{box:[520,250,780,350],label:'Bottles are compressed into blocks'},
        '05':{box:[515,350,775,540],label:'Plastic is crushed and washed'},
        '06':{box:[350,365,505,470],label:'Plastic pellets are produced'},
        '07':{box:[240,315,445,525],label:'Pellets are heated to form raw material'},
        '08':{box:[10,370,220,545],label:'Raw material is produced'},
        '09':{box:[0,205,195,350],label:'End products are manufactured'},
        '01_02':{box:[10,55,475,200],label:'Plastic bottles are collected and transported'},
        '07_08_09':{box:[0,205,500,550],label:'Pellets become raw material and new products'}
      },
      words:{
        'plastic bottles':'01','collect':'01','transport':'02','recycling centre':'03','sort':'03',
        'compress into blocks':'04','crush':'05','wash':'05','plastic pellets':'06','raw material':'08',
        'heat pellets':'07','form raw material':'07','produce end products':'09','manufacture new products':'09'
      },
      phase3:{1:'01_02',2:'03',3:'04',4:'05',5:'06',6:'07',7:'07_08_09',8:'07_08_09'}
    }
  };

  function currentBase(){
    return /\/process\/sentence-practice\//i.test(location.pathname)
      ? '../'
      : './process/';
  }

  function sourceUrl(set){
    return new URL(currentBase()+set.file,location.href).href;
  }

  function norm(s){return String(s||'').toLowerCase().trim();}

  function cropForWord(setKey,word){
    const set=SETS[setKey];
    if(!set)return null;
    const key=set.words[norm(word)];
    if(!key||!set.crops[key])return null;
    return {set,key,crop:set.crops[key]};
  }

  function cropForPhase3(setKey,id){
    const set=SETS[setKey];
    if(!set)return null;
    const key=set.phase3[Number(id)];
    if(!key||!set.crops[key])return null;
    return {set,key,crop:set.crops[key]};
  }

  function ensureCss(){
    if(document.getElementById('processStepMediaCss'))return;
    const style=document.createElement('style');
    style.id='processStepMediaCss';
    style.textContent=`
      .process-step-media{margin:10px 0 14px;padding:10px;background:#fff;border:1px solid #e2e5ee;border-radius:14px}
      .process-step-media-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:8px;font-size:10px;color:#6b7388;font-weight:850}
      .process-step-media-head b{color:#4f36a2}
      .process-step-crop{position:relative;overflow:hidden;width:min(100%,560px);margin:auto;background:#fff;border-radius:10px;border:1px solid #eceef4}
      .process-step-crop img{position:absolute;max-width:none!important;height:auto!important;display:block}
      .process-step-caption{margin-top:8px;text-align:center;color:#59627a;font-size:10.5px;line-height:1.45}
      .process-step-caption a{color:#5d43b0;text-decoration:none;font-weight:850}
      .process-step-error{padding:18px;text-align:center;color:#a23e50;font-size:11px}
      @media(max-width:650px){.process-step-crop{width:100%}.process-step-media{padding:8px}}
    `;
    document.head.appendChild(style);
  }

  function renderCrop(container,info){
    if(!container||!info)return;
    ensureCss();
    const {set,crop}=info;
    const [x1,y1,x2,y2]=crop.box;
    const cropW=x2-x1,cropH=y2-y1;
    const [W,H]=set.size;
    const src=sourceUrl(set);
    const imgWidthPct=(W/cropW)*100;
    const leftPct=-(x1/cropW)*100;
    const topPct=-(y1/cropH)*100;
    container.innerHTML=`
      <div class="process-step-media-head"><b>STEP CONTEXT</b><span>${set.title}</span></div>
      <div class="process-step-crop" style="aspect-ratio:${cropW}/${cropH}">
        <img src="${src}" alt="${crop.label}" style="width:${imgWidthPct}%;left:${leftPct}%;top:${topPct}%">
      </div>
      <div class="process-step-caption">${crop.label} · <a href="${src}" target="_blank" rel="noopener">Xem sơ đồ đầy đủ ↗</a></div>
    `;
    const img=container.querySelector('img');
    if(img)img.onerror=()=>{container.innerHTML='<div class="process-step-error">Không tải được ảnh minh họa. Kiểm tra thư mục <b>Practice/Vocabulary/process/images/</b>.</div>';};
  }

  function ensurePhase2Box(){
    const context=document.getElementById('vocabTestContext');
    if(!context)return null;
    let box=document.getElementById('processStepMediaPhase2');
    if(!box){
      box=document.createElement('figure');
      box.id='processStepMediaPhase2';
      box.className='process-step-media hidden';
      context.insertAdjacentElement('beforebegin',box);
    }
    return box;
  }

  function renderPhase2(){
    try{
      const setKey=String(typeof selectedSet!=='undefined'?selectedSet:'');
      const skill=String(typeof selectedSkill!=='undefined'?selectedSkill:'');
      const box=ensurePhase2Box();
      if(!box)return;
      if(skill!=='writing-task-1'||!setKey.startsWith('process-')){
        box.classList.add('hidden');box.innerHTML='';return;
      }
      const q=(typeof vocabTestQuestions!=='undefined'&&typeof vocabTestIndex!=='undefined')?vocabTestQuestions[vocabTestIndex]:null;
      const word=q?.word?.word||q?.word?.collocation||'';
      const info=cropForWord(setKey,word);
      if(!info){box.classList.add('hidden');box.innerHTML='';return;}
      box.classList.remove('hidden');
      renderCrop(box,info);
    }catch(e){console.warn('[Process Step Media] Phase 2:',e);}
  }

  function patchPhase2(){
    try{
      if(typeof renderVocabularyTestQuestion!=='function')return;
      if(renderVocabularyTestQuestion.__processStepPatched)return;
      const original=renderVocabularyTestQuestion;
      const wrapped=function(){
        const result=original.apply(this,arguments);
        renderPhase2();
        return result;
      };
      wrapped.__processStepPatched=true;
      renderVocabularyTestQuestion=wrapped;
      renderPhase2();
    }catch(e){console.warn('[Process Step Media] patch Phase 2:',e);}
  }

  function ensurePhase3Box(){
    const prompt=document.querySelector('.prompt');
    if(!prompt)return null;
    let box=document.getElementById('processStepMediaPhase3');
    if(!box){
      box=document.createElement('figure');
      box.id='processStepMediaPhase3';
      box.className='process-step-media';
      const label=prompt.querySelector('.label');
      if(label)label.insertAdjacentElement('afterend',box);else prompt.prepend(box);
    }
    return box;
  }

  function renderPhase3(){
    try{
      if(typeof setKey==='undefined'||typeof pack==='undefined'||typeof index==='undefined')return;
      const box=ensurePhase3Box();
      if(!box||!pack?.questions?.length)return;
      const q=pack.questions[index];
      const info=cropForPhase3(String(setKey),q?.id);
      if(!info){box.classList.add('hidden');box.innerHTML='';return;}
      box.classList.remove('hidden');
      renderCrop(box,info);
    }catch(e){console.warn('[Process Step Media] Phase 3:',e);}
  }

  function patchPhase3(){
    try{
      if(typeof render!=='function'||typeof pack==='undefined')return;
      if(render.__processStepPatched)return;
      const original=render;
      const wrapped=function(){
        const result=original.apply(this,arguments);
        renderPhase3();
        return result;
      };
      wrapped.__processStepPatched=true;
      render=wrapped;
      renderPhase3();
    }catch(e){console.warn('[Process Step Media] patch Phase 3:',e);}
  }

  window.PROCESS_STEP_MEDIA={SETS,cropForWord,cropForPhase3,renderPhase2,renderPhase3};
  ensureCss();
  patchPhase2();
  patchPhase3();
})();
