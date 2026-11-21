/* Smartcom shared UI: friendly hub visuals + hover/focus/click quick jump.
   Uses script URL as base, so routes work at any GitHub Pages project path. */
(function(){
'use strict';
if(document.getElementById('sc-quick-shell'))return;
const current=document.currentScript;
if(!current)return;
const root=new URL('../../',current.src);
if(!document.querySelector('script[data-sc-area-loader]')){const t=document.createElement('script');t.dataset.scAreaLoader='1';t.src=new URL('assets/area-theme-loader.js?v=20261119-portal-category03',root).href;document.head.append(t);}
if(!document.querySelector('script[data-sc-outline-icons]')){const iconScript=document.createElement('script');iconScript.dataset.scOutlineIcons='1';iconScript.src=new URL('assets/smartcom-outline-icons.js?v=20261118-icons01',root).href;document.head.append(iconScript);} // .../Test/ from .../Test/Practice/shared/
// Electric Blue is the default theme for the Practice area.
// Resolve relative to this script so GitHub Pages subpaths also work.
const routeParts=decodeURIComponent(location.pathname).split('/').filter(Boolean);
const isFoundationRoute=routeParts.some(p=>/^(Foundations|Vocabulary-Notebook|GuidedListening|Grammar|Vocabulary|Intensive Listening|Topic-based-Listening|Pre-IELTS)$/i.test(p));
if(routeParts.includes('Practice')&&!isFoundationRoute){
 document.body.classList.add('sc-electric-blue');
 if(!document.querySelector('link[data-sc-electric-theme]')){
  const theme=document.createElement('link');
  theme.rel='stylesheet';
  theme.dataset.scElectricTheme='1';
  theme.href=new URL('../Listening/electric-blue-theme.css?v=20261118-01',current.src).href;
  document.head.append(theme);
 }
}

const asset=new URL('./smartcom-ui.css?v=20261121-level2-tiles08',current.src);
const link=document.createElement('link');link.rel='stylesheet';link.href=asset.href;document.head.append(link);
const url=path=>new URL(path,root).href;
if(!window.SmartcomHistory&&!document.querySelector('script[data-sc-attempt-history]')){
 const historyScript=document.createElement('script');
 historyScript.dataset.scAttemptHistory='1';
 historyScript.src=url('Practice/shared/attempt-history.js?v=20261120-unified06');
 document.head.append(historyScript);
}

const pathname=location.pathname;
const hubPaths=[
 '/Practice/','/Practice/Speaking/','/Practice/Speaking/Part1/','/Practice/Speaking/Part2/',
 '/Practice/Speaking/Part3/','/Practice/Listening/','/Practice/Listening/FullTest/',
 '/Practice/Listening/Part1/','/Practice/Listening/Part2/','/Practice/Listening/Part3/',
 '/Practice/Listening/Part4/','/Practice/Reading/ReadingPractice3Passages/',
 '/Practice/Grammar/','/Practice/Writing/','/Practice/WritingTask1/','/Practice/WritingTask2/','/Practice/Vocabulary/'
];
const nestedHub=(
 /\/Practice\/Reading\/(?:ReadingPassage[123]|TrueFalseNotGiven|NoteCompletion|TableCompletion|ShortAnswerQuestions|Matching%20Headings)\/?$/i.test(pathname)||
 /\/Practice\/WritingTask1\/(?:DynamicDatasets|StaticDatasets|Maps|Process)\/?$/i.test(pathname)||
 /\/Practice\/WritingTask2\/(?:OpinionEssay|DiscussionEssay|AdvantagesDisadvantages|ProblemSolution|TwoPartQuestions)\/?$/i.test(pathname)||
 /\/Practice\/Grammar\/Topic\d\d\/?$/i.test(pathname)
);
if(pathname===root.pathname||nestedHub||hubPaths.some(p=>pathname.endsWith(p)||pathname.endsWith(p.slice(0,-1))))document.body.classList.add('sc-hub-refresh');
// Universal exit for individual exercises: one reliable escape even on fullscreen tasks.
const relativePage=decodeURIComponent(location.pathname.slice(root.pathname.length));
const exercisePage=/^(?:Wri\d+|Rea\d+|Lis\d+|Spe\d+)\/(?:index\.html)?$/i.test(relativePage) ||
 /^(?:Practice|Foundations)\/.+\/index\.html$/i.test(relativePage);
function safeBackTarget(){
 if(/^Wri\d+\//i.test(relativePage))return url('?skill=writing');
 if(/^Rea\d+\//i.test(relativePage))return url('?skill=reading');
 if(/^Lis\d+\//i.test(relativePage))return url('?skill=listening');
 if(/^Spe\d+\//i.test(relativePage))return url('?skill=speaking');
 const segments=relativePage.replace(/\/index\.html$/i,'').replace(/\/$/,'').split('/');
 segments.pop();
 return url(segments.length?segments.join('/')+'/':'');
}
const backDestination=safeBackTarget();
if(exercisePage && !document.querySelector('.sc-universal-back')){
 const back=document.createElement('a');back.className='sc-universal-back';
 back.href=backDestination;back.textContent='Quay lại';back.title='Thoát bài và quay lại danh sách';
 back.setAttribute('aria-label','Quay lại danh sách bài học');
 document.body.append(back);
}
// One coherent coloured icon set; group hues match the four large portal folders.
const quickIconPaths={
 '🎧':'<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="2" y="13" width="4" height="8" rx="2"/><rect x="18" y="13" width="4" height="8" rx="2"/>',
 '📖':'<path d="M12 7v14M3 18V4c4-1 7 0 9 3 2-3 5-4 9-3v14c-4-1-7 0-9 3-2-3-5-4-9-3Z"/>',
 '✍️':'<path d="m4 20 4.7-1L20 7.5a2 2 0 0 0-3-3L5.7 16 4 20Zm10.5-12.5 3 3"/>',
 '🎙️':'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8"/>',
 '💬':'<path d="M20 11a8 8 0 0 1-8 8H5l-2 2v-7a8 8 0 1 1 17-3Z"/><path d="M8 11h8"/>',
 '🧩':'<path d="M8 3h3a2 2 0 0 0 4 0h3v5a2 2 0 1 1 0 4v8h-6a2 2 0 1 0-4 0H3v-7a2 2 0 1 0 0-4V3h5Z"/>',
 '🌍':'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-6 5-6 13 0 18m0-18c6 5 6 13 0 18"/>',
 '📰':'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h5v5H7zM15 8h3M15 12h3M7 16h11"/>',
 '📗':'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v18"/>',
 '🧠':'<path d="M12 5a4 4 0 0 0-7 2 4 4 0 0 0-1 7 4 4 0 0 0 5 6h3V5Zm0 0a4 4 0 0 1 7 2 4 4 0 0 1 1 7 4 4 0 0 1-5 6h-3V5Z"/>',
 '📒':'<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M9 3v18M4 7h3M4 12h3M4 17h3"/>',
 '⏰':'<circle cx="12" cy="13" r="8"/><path d="M12 8v5l3 2M5 2 2 5m17-3 3 3"/>',
 '↩️':'<path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/>',
 '🏠':'<path d="m3 11 9-8 9 8v10H3V11Z"/><path d="M9 21v-7h6v7"/>',
 '📊':'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 17v-5m5 5V8m5 9v-7"/>',
 '🎯':'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
};
const groups=[
 {heading:'Mock Tests',links:[
  ['🎧','Listening Test','?skill=listening'],['📖','Reading Test','?skill=reading'],
  ['✍️','Writing Test','?skill=writing'],['🎙️','Speaking Test','?skill=speaking']
 ]},
 {heading:'Skill Practice',links:[
  ['🎧','Listening Practice','Practice/Listening/'],
  ['📖','Reading Practice','Practice/Reading/'],
  ['✍️','Writing Practice','Practice/Writing/',[
   ['📖','Tổng quan Writing','Practice/Writing/'],
   ['✍️','Writing Task 1','Practice/WritingTask1/'],
   ['📝','Writing Task 2','Practice/WritingTask2/']
  ]],
  ['💬','Speaking Practice','Practice/Speaking/']
 ]},
 {heading:'Foundations',links:[
  ['🧩','Foundations','Foundations/'],
  ['🎙️','Pre-IELTS Listening','Practice/Listening/Intensive%20Listening/'],
  ['🌍','Topic-based Dictation','Foundations/Topic-based-Listening/'],
  ['📰','Reading Library','Foundations/Reading-Library/'],
  ['📗','Grammar','Practice/Grammar/'],['🧠','Vocabulary','Practice/Vocabulary/'],
  ['📒','Sổ tay từ vựng','Vocabulary-Notebook/'],['⏰','Nhắc từ vựng','Vocabulary-Notebook/#vocabReminder']
 ]},
 {heading:'Progress',links:[
  ['📊','Tiến độ học tập','Progress/'],['📋','Lịch sử làm bài','Progress/#historyBody']
 ]},
 {heading:'Trang chủ',home:true,links:[]}
]

/* One continuous capsule: the original round lightning button expands upward. */
const shell=document.createElement('nav');
shell.id='sc-quick-shell';
shell.className='sc-capsule';
shell.setAttribute('aria-label','Chuyển nhanh giữa các phần học');
const capsule=document.createElement('div');
capsule.className='sc-capsule-frame';
const tools=document.createElement('div');
tools.className='sc-capsule-list';
tools.id='sc-quick-panel';
tools.setAttribute('aria-label','Các lối tắt');
const categoryTitles={'Mock Tests':'TEST','Skill Practice':'PRACTICE','Foundations':'FOUNDATIONS','Progress':'PROGRESS','Trang chủ':'TRANG CHỦ'};
const categoryIcons={'Mock Tests':'🎯','Skill Practice':'📖','Foundations':'🧩','Progress':'📊','Trang chủ':'🏠'};
const categoryClasses={'Mock Tests':'sc-quick-test','Skill Practice':'sc-quick-practice','Foundations':'sc-quick-foundations','Progress':'sc-quick-nav','Trang chủ':'sc-quick-nav'};
function quickSvg(icon){
 const svg=quickIconPaths[icon]||quickIconPaths['🎯'];
 return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+svg+'</svg>';
}
const categoryGrid=document.createElement('div');
categoryGrid.className='sc-quick-categories';
const childSection=document.createElement('section');
childSection.className='sc-quick-children';
childSection.hidden=true;
childSection.id='sc-quick-children';
const childTitle=document.createElement('div');
childTitle.className='sc-quick-children-title';
const childGrid=document.createElement('div');
childGrid.className='sc-quick-children-grid';
const childHeader=document.createElement('div');
childHeader.className='sc-quick-children-header';
const backButton=document.createElement('button');
backButton.type='button';
backButton.className='sc-quick-back-button';
backButton.textContent='← Back';
backButton.setAttribute('aria-label','Quay về menu cấp trước');
childHeader.append(backButton,childTitle);
childSection.append(childHeader,childGrid);
// A stack preserves all parent levels: level 3 backs to level 2, level 2 to level 1.
const quickStack=[];
function renderQuickLevel(){
 const current=quickStack[quickStack.length-1];
 categoryGrid.hidden=!!current;
 childSection.hidden=!current;
 tools.classList.toggle('sc-show-children',!!current);
 categoryGrid.querySelectorAll('button').forEach(btn=>btn.setAttribute('aria-expanded',String(!!current&&btn.dataset.group===quickStack[0]?.heading)));
 if(current){
  childTitle.textContent=current.title;
  childGrid.replaceChildren();
  for(const item of current.items){
   const entry=document.createElement(item.children?'button':'a');
   if(item.children){entry.type='button';entry.setAttribute('aria-expanded','false');}
   else entry.href=url(item.path);
   entry.className='sc-capsule-link sc-quick-tile '+(categoryClasses[quickStack[0]?.heading]||'sc-quick-nav');
   entry.title=item.label;
   entry.setAttribute('aria-label',item.label);
   const symbol=document.createElement('span');
   symbol.className='sc-capsule-icon';
   symbol.setAttribute('aria-hidden','true');
   symbol.innerHTML=quickSvg(item.icon);
   const name=document.createElement('span');
   name.className='sc-capsule-tooltip';
   name.textContent=item.label;
   entry.append(symbol,name);
   if(item.children)entry.addEventListener('click',()=>{quickStack.push({title:item.label,items:item.children,heading:current.heading});renderQuickLevel()});
   childGrid.append(entry);
  }
 }
 tools.scrollTop=0;
 positionPanel();
}
function resetQuickLevel(){quickStack.length=0;renderQuickLevel()}
backButton.addEventListener('click',()=>{
 if(quickStack.length)quickStack.pop();
 renderQuickLevel();
 if(quickStack.length===0)categoryGrid.querySelector('button')?.focus();
});
function selectQuickGroup(group){
 const items=group.links.map(([icon,label,path,nested])=>({icon,label,path,children:nested?.map(([icon,label,path])=>({icon,label,path}))}));
 quickStack.length=0;
 quickStack.push({title:categoryTitles[group.heading],heading:group.heading,items});
 renderQuickLevel();
}
for(const group of groups){
 const button=document.createElement('button');
 button.type='button';
 button.className='sc-quick-category '+categoryClasses[group.heading];
 button.dataset.group=group.heading;
 button.setAttribute('aria-expanded','false');
 button.setAttribute('aria-controls','sc-quick-children');
 const symbol=document.createElement('span');
 symbol.className='sc-capsule-icon';
 symbol.setAttribute('aria-hidden','true');
 symbol.innerHTML=quickSvg(categoryIcons[group.heading]);
 const name=document.createElement('span');
 name.className='sc-quick-category-name';
 name.textContent=categoryTitles[group.heading];
 button.append(symbol,name);
 button.addEventListener('click',()=>{if(group.home)location.href=url('');else selectQuickGroup(group)});
 categoryGrid.append(button);
}
tools.append(categoryGrid,childSection);
const backdrop=document.createElement('div');
backdrop.className='sc-quick-backdrop';
backdrop.setAttribute('aria-hidden','true');
shell.append(backdrop);
const modalHeader=document.createElement('div');
modalHeader.className='sc-modal-heading';
modalHeader.innerHTML='';
const toggle=document.createElement('button');
toggle.type='button';
toggle.className='sc-capsule-trigger';
toggle.setAttribute('aria-label','Mở menu truy cập nhanh');
toggle.setAttribute('aria-controls','sc-quick-panel');
toggle.setAttribute('aria-expanded','false');
toggle.title='Truy cập nhanh';
toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 13h7l-1 9 10-12h-7l1-8z"/></svg>';
// Keep menu outside the glass backdrop-filter container: fixed coordinates stay viewport-based.
capsule.append(toggle);
shell.append(capsule,tools);
const floatingLabel=document.createElement('div');
floatingLabel.className='sc-floating-label';
floatingLabel.setAttribute('aria-hidden','true');
shell.append(floatingLabel);
function showLabel(link){
 const r=link.getBoundingClientRect();
 floatingLabel.textContent=link.getAttribute('aria-label')||'';
 floatingLabel.style.top=(r.top+r.height/2)+'px';
 floatingLabel.style.right=Math.max(78,window.innerWidth-r.left+13)+'px';
 floatingLabel.classList.add('visible');
}
function hideLabel(){floatingLabel.classList.remove('visible')}
tools.querySelectorAll('.sc-capsule-link').forEach(link=>{
 link.addEventListener('mouseenter',()=>showLabel(link));
 link.addEventListener('mouseleave',hideLabel);
 link.addEventListener('focus',()=>showLabel(link));
 link.addEventListener('blur',hideLabel);
});
tools.addEventListener('scroll',hideLabel,{passive:true});
function setOpen(value){
 if(value)positionPanel();
 shell.classList.toggle('sc-open',value);
 toggle.setAttribute('aria-expanded',String(value));
 toggle.setAttribute('aria-label',value?'Đóng menu truy cập nhanh':'Mở menu truy cập nhanh');
 if(!value){hideLabel();resetQuickLevel()}
}
/* AssistiveTouch drag: movable, edge-snapping, persists normalized vertical position.
   A short tap opens the menu; dragging never accidentally opens it. */
const touchPositionKey='SC_ASSISTIVE_TOUCH_V1';
let launcherPosition={side:'right',y:.78};
try{const stored=JSON.parse(localStorage.getItem(touchPositionKey)||'null');if(stored&&(stored.side==='left'||stored.side==='right')&&Number.isFinite(stored.y))launcherPosition={side:stored.side,y:Math.min(.94,Math.max(.06,stored.y))}}catch{}
const launcherSize=()=>toggle.getBoundingClientRect().width||60;
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function setLauncher(side,y){
 const size=launcherSize(),margin=12;
 const top=clamp(y*(window.innerHeight-size),margin,Math.max(margin,window.innerHeight-size-margin));
 shell.style.setProperty('left',side==='left'?margin+'px':'auto','important');
 shell.style.setProperty('right',side==='right'?margin+'px':'auto','important');
 shell.style.setProperty('top',top+'px','important');
 shell.style.setProperty('bottom','auto','important');
 shell.classList.toggle('sc-side-left',side==='left');
 shell.classList.toggle('sc-side-right',side!=='left');
 positionPanel();
}
function positionPanel(){
 const rect=toggle.getBoundingClientRect();
 const w=Math.min(350,window.innerWidth-28),h=Math.min(465,Math.round(window.innerHeight*.78));
 const x=Math.round((window.innerWidth-w)/2);
 const y=Math.round((window.innerHeight-h)/2);
 shell.style.setProperty('--sc-origin-x',Math.round(rect.left+rect.width/2-x)+'px');
 shell.style.setProperty('--sc-origin-y',Math.round(rect.top+rect.height/2-y)+'px');
 shell.style.setProperty('--sc-panel-x',x+'px');
 shell.style.setProperty('--sc-panel-y',y+'px');
 shell.style.setProperty('--sc-panel-width',w+'px');
 shell.style.setProperty('--sc-panel-max-height',h+'px');
}
let drag=null,suppressClick=false;
toggle.style.touchAction='none';
toggle.addEventListener('pointerdown',e=>{
 if(e.button!==0||shell.classList.contains('sc-open'))return;
 drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
 try{toggle.setPointerCapture(e.pointerId)}catch{}
});
toggle.addEventListener('pointermove',e=>{
 if(!drag||drag.id!==e.pointerId)return;
 if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7)drag.moved=true;
 if(!drag.moved)return;
 e.preventDefault();
 const size=launcherSize();
 const left=clamp(e.clientX-size/2,10,window.innerWidth-size-10);
 const top=clamp(e.clientY-size/2,10,window.innerHeight-size-10);
 shell.style.setProperty('left',left+'px','important');
 shell.style.setProperty('right','auto','important');
 shell.style.setProperty('top',top+'px','important');
 shell.style.setProperty('bottom','auto','important');
 shell.classList.add('sc-dragging');
});
function endDrag(e){
 if(!drag||drag.id!==e.pointerId)return;
 if(drag.moved){
  suppressClick=true;
  const side=e.clientX<window.innerWidth/2?'left':'right';
  launcherPosition={side,y:clamp((e.clientY-launcherSize()/2)/Math.max(1,window.innerHeight-launcherSize()),0,1)};
  setLauncher(side,launcherPosition.y);
  try{localStorage.setItem(touchPositionKey,JSON.stringify(launcherPosition))}catch{}
 }
 shell.classList.remove('sc-dragging');
 drag=null;
}
toggle.addEventListener('pointerup',endDrag);
toggle.addEventListener('pointercancel',endDrag);
toggle.addEventListener('click',e=>{
 if(suppressClick){suppressClick=false;e.preventDefault();e.stopImmediatePropagation();return}
 setOpen(!shell.classList.contains('sc-open'));
},true);
window.addEventListener('resize',()=>setLauncher(launcherPosition.side,launcherPosition.y),{passive:true});
requestAnimationFrame(()=>setLauncher(launcherPosition.side,launcherPosition.y));

backdrop.addEventListener('click',()=>setOpen(false));
document.addEventListener('pointerdown',e=>{if(!shell.contains(e.target))setOpen(false)});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&shell.classList.contains('sc-open')){setOpen(false);toggle.focus()}
});
document.body.append(shell);

/* Student context: preserve Portal navigation, never require name/class again
   for students who arrived from the homepage. Direct standalone links keep
   their own identity form. No identity data is put in new URLs. */
(function(){
  const PROFILE_KEY='IELTS_PRACTICE_STUDENT';
  const params=new URLSearchParams(location.search);
  let profile=null;
  try{
    const candidate=JSON.parse(localStorage.getItem(PROFILE_KEY)||'null');
    if(candidate && typeof candidate.name==='string' && candidate.name.trim() &&
       typeof candidate.className==='string' && candidate.className.trim())
      profile={name:candidate.name.trim(),className:candidate.className.trim()};
  }catch(e){}
  // currentScript is null in nested callbacks; reuse the captured script URL.
  const portalRoot=root;
  const fromPortal=!!profile && (params.get('fromPortal')==='1' || location.pathname===portalRoot.pathname || location.pathname===portalRoot.pathname+'index.html');
  if(!fromPortal)return;
  // Propagate the portal flow through all same-project internal links,
  // including the quick-navigation menu and dynamically inserted cards.
  document.addEventListener('click',function(event){
    const anchor=event.target.closest?.('a[href]');
    if(!anchor || event.defaultPrevented || event.button!==0 ||
       event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
       (anchor.target && anchor.target!=='_self') || anchor.hasAttribute('download'))return;
    const destination=new URL(anchor.href,location.href);
    if(destination.origin!==location.origin || !destination.pathname.startsWith(portalRoot.pathname))return;
    destination.searchParams.set('fromPortal','1');
    anchor.href=destination.href;
  },true);
  // Scripts on standalone pages have already initialized by the time
  // the shared UI script runs. Reuse the validated Portal profile.
  const name=document.getElementById('studentName');
  const cls=document.getElementById('studentClass');
  if(name && cls && name.tagName==='INPUT' && cls.tagName==='INPUT'){
    name.value=profile.name;
    cls.value=profile.className;
    [name,cls].forEach(input=>{
      const wrapper=input.closest('.field')||input.closest('label');
      if(wrapper && !wrapper.contains(document.querySelector('#startBtn')))wrapper.style.display='none';
    });
    const message=document.createElement('p');
    message.className='sc-student-identified';
    message.textContent='Học sinh: '+profile.name+' · Lớp '+profile.className;
    message.style.cssText='font-size:14px;font-weight:700;color:#3b0e90;margin:8px 0 14px';
    const start=document.getElementById('startBtn') || document.querySelector('button[onclick*="startExam"]');
    if(start && !document.querySelector('.sc-student-identified'))start.parentNode.insertBefore(message,start);
  }
})();
/* Hide non-functional arrow ornaments across all Smartcom navigation surfaces.
   Preserve meaningful controls: their text and click handlers remain intact.
   Runs again for dynamically generated exercise cards. */
(function removeDecorativeArrows(){
 const style=document.createElement('style');
 style.textContent='.card .arrow,.card .chevron,.card .arrow-icon,.portal-category .arrow-icon{display:none!important}';
 document.head.append(style);
 const glyphs=/[\s\u00a0]*[→←↗➜➔⟶➝➞➟⇢⇠][\s\u00a0]*/g;
 function scrub(scope){
  const nodes=[];
  if(scope.matches?.('a,button,[role="button"],.go,.portal-action'))nodes.push(scope);
  if(scope.querySelectorAll)nodes.push(...scope.querySelectorAll('a,button,[role="button"],.go,.portal-action'));
  for(const parent of nodes){
   if(parent.matches?.('.arrow,.chevron,.arrow-icon') && /^[\s→←↗➜➔⟶➝➞➟⇢⇠]*$/.test(parent.textContent||'')){parent.remove();continue}
   const walker=document.createTreeWalker(parent,NodeFilter.SHOW_TEXT);
   const texts=[];let n;
   while((n=walker.nextNode()))if(!n.parentElement?.closest('script,style,textarea,code,pre'))texts.push(n);
   for(const t of texts){
    const value=t.nodeValue;
    if(/[→←↗➜➔⟶➝➞➟⇢⇠]/.test(value)){
      const cleaned=value.replace(glyphs,' ').replace(/\s{2,}/g,' ');
      if(cleaned!==value)t.nodeValue=cleaned;
    }
   }
  }
 }
 scrub(document.body);
 const observer=new MutationObserver(records=>{
  const toScan=new Set();
  for(const record of records){
   if(record.type==='characterData'){const node=record.target.parentElement;if(node?.closest('a,button,[role="button"],.go,.portal-action'))toScan.add(node.closest('a,button,[role="button"],.go,.portal-action'))}
   else for(const node of record.addedNodes)if(node.nodeType===1)toScan.add(node);
  }
  for(const node of toScan)scrub(node);
 });
 observer.observe(document.body,{childList:true,subtree:true,characterData:true});
})();

// Shared writing assistant for every Writing Task 1 / Task 2 lesson.
if(/\/Practice\/WritingTask[12]\//.test(location.pathname)){
 if(!document.querySelector('script[data-sc-writing-assistant]')){
  const waCss=document.createElement('link');
  waCss.rel='stylesheet';
  waCss.href=url('Practice/shared/writing-assistant.css?v=20261118-01');
  document.head.append(waCss);
  const waScript=document.createElement('script');
  waScript.dataset.scWritingAssistant='1';
  waScript.src=url('Practice/shared/writing-assistant.js?v=20261120-single-check02');
  document.body.append(waScript);
 }
}

// Attach the shared proofreading control to all Writing Task 1/2 exercise pages.
if(/\/WritingTask[12]\//i.test(location.pathname)||/\/Vocabulary\/writing-task-2\//i.test(location.pathname)){
 if(!document.querySelector('script[data-sc-proofreader]')){
  const proof=document.createElement('script');proof.dataset.scProofreader='1';
  proof.src=url('Practice/shared/writing-proofreader.js?v=20261120-grammar-agreement04');
  document.body.append(proof);
 }
}
// Load vocabulary selection/dictionary on learning pages and the main portal.
if(!document.querySelector('script[data-sc-word-tools]')){
 const vocabScript=document.createElement('script');
 vocabScript.dataset.scWordTools='1';
 vocabScript.src=url('Practice/shared/word-tools.js?v=20261120-listening-lookup04');
 document.body.append(vocabScript);
}
if(!document.querySelector('script[data-sc-vocab-reminders]')){
 const reminderScript=document.createElement('script');reminderScript.dataset.scVocabReminders='1';
 reminderScript.src=url('Practice/shared/vocab-reminders.js?v=20261116-reminders01');
 document.body.append(reminderScript);
}
})();
