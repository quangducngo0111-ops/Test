/* Smartcom shared UI: friendly hub visuals + hover/focus/click quick jump.
   Uses script URL as base, so routes work at any GitHub Pages project path. */
(function(){
'use strict';
if(document.getElementById('sc-quick-shell'))return;
const current=document.currentScript;
if(!current)return;
const root=new URL('../../',current.src);
if(!document.querySelector('script[data-sc-area-loader]')){const t=document.createElement('script');t.dataset.scAreaLoader='1';t.src=new URL('assets/area-theme-loader.js?v=20261118-premium02',root).href;document.head.append(t);}
if(!document.querySelector('script[data-sc-outline-icons]')){const iconScript=document.createElement('script');iconScript.dataset.scOutlineIcons='1';iconScript.src=new URL('assets/smartcom-outline-icons.js?v=20261118-icons01',root).href;document.head.append(iconScript);} // .../Test/ from .../Test/Practice/shared/
// Electric Blue is the default theme for the Practice area.
// Resolve relative to this script so GitHub Pages subpaths also work.
if(location.pathname.includes('/Practice/')){
 document.body.classList.add('sc-electric-blue');
 if(!document.querySelector('link[data-sc-electric-theme]')){
  const theme=document.createElement('link');
  theme.rel='stylesheet';
  theme.dataset.scElectricTheme='1';
  theme.href=new URL('../Listening/electric-blue-theme.css?v=20261118-01',current.src).href;
  document.head.append(theme);
 }
}

const asset=new URL('./smartcom-ui.css?v=20261118-premium02',current.src);
const link=document.createElement('link');link.rel='stylesheet';link.href=asset.href;document.head.append(link);
const url=path=>new URL(path,root).href;
if(!window.SmartcomHistory&&!document.querySelector('script[data-sc-attempt-history]')){
 const historyScript=document.createElement('script');
 historyScript.dataset.scAttemptHistory='1';
 historyScript.src=url('Practice/shared/attempt-history.js?v=20261118-01');
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
const groups=[
 {heading:'Mock Tests',links:[
  ['🎧','Listening Test','?skill=listening'],['📖','Reading Test','?skill=reading'],
  ['✍️','Writing Test','?skill=writing'],['🎙️','Speaking Test','?skill=speaking']
 ]},
 {heading:'Skill Practice',links:[
  ['🎧','Listening Practice','Practice/Listening/'],
  ['📖','Reading Practice','Practice/Reading/'],
  ['✍️','Writing Practice','Practice/Writing/'],
  ['💬','Speaking Practice','Practice/Speaking/']
 ]},
 {heading:'Foundations',links:[
  ['🧩','Foundations','Foundations/'],
  ['🎙️','Pre-IELTS Listening','Practice/Listening/Intensive%20Listening/'],
  ['🌍','Topic-based Listening','Foundations/Topic-based-Listening/'],
  ['📰','Reading Library','Foundations/Reading-Library/'],
  ['📗','Grammar','Practice/Grammar/'],['🧠','Vocabulary','Practice/Vocabulary/'],
  ['📒','Sổ tay từ vựng','Vocabulary-Notebook/'],['⏰','Nhắc từ vựng','Vocabulary-Notebook/#vocabReminder']
 ]},
 {heading:'Điều hướng',links:[['🏠','Trang chủ',''],['🎯','Skill Practice','Practice/']]}
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
for(const group of groups){
 const heading=document.createElement('div');
 heading.className='sc-capsule-divider';
 heading.textContent=group.heading==='Mock Tests'?'TEST':group.heading==='Skill Practice'?'PRACTICE':group.heading==='Foundations'?'FOUNDATIONS':'NAV';
 heading.setAttribute('aria-hidden','true');
 tools.append(heading);
 for(const [icon,label,path] of group.links){
  const link=document.createElement('a');
  link.href=url(path);
  link.className='sc-capsule-link';
  link.title=label;
  link.setAttribute('aria-label',label);
  const emoji=document.createElement('span');
  emoji.className='sc-capsule-icon';
  emoji.setAttribute('aria-hidden','true');
  emoji.textContent=icon;
  const tooltip=document.createElement('span');
  tooltip.className='sc-capsule-tooltip';
  tooltip.textContent=label;
  tooltip.setAttribute('aria-hidden','true');
  link.append(emoji,tooltip);
  tools.append(link);
 }
}
const toggle=document.createElement('button');
toggle.type='button';
toggle.className='sc-capsule-trigger';
toggle.setAttribute('aria-label','Mở menu truy cập nhanh');
toggle.setAttribute('aria-controls','sc-quick-panel');
toggle.setAttribute('aria-expanded','false');
toggle.title='Truy cập nhanh';
toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 13h7l-1 9 10-12h-7l1-8z"/></svg>';
capsule.append(tools,toggle);
shell.append(capsule);
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
 if(!value){tools.scrollTop=0;hideLabel()}
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
 const w=Math.min(340,window.innerWidth-28),h=Math.min(530,Math.round(window.innerHeight*.74));
 const x=shell.classList.contains('sc-side-left')?clamp(rect.right+12,10,window.innerWidth-w-10):clamp(rect.left-w-12,10,window.innerWidth-w-10);
 const y=clamp(rect.top+rect.height/2-h/2,10,Math.max(10,window.innerHeight-h-10));
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
  const root=new URL('../../',document.currentScript.src);
  const fromPortal=!!profile && (params.get('fromPortal')==='1' || location.pathname===root.pathname || location.pathname===root.pathname+'index.html');
  if(!fromPortal)return;
  // Propagate the portal flow through all same-project internal links,
  // including the quick-navigation menu and dynamically inserted cards.
  document.addEventListener('click',function(event){
    const anchor=event.target.closest?.('a[href]');
    if(!anchor || event.defaultPrevented || event.button!==0 ||
       event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
       (anchor.target && anchor.target!=='_self') || anchor.hasAttribute('download'))return;
    const destination=new URL(anchor.href,location.href);
    if(destination.origin!==location.origin || !destination.pathname.startsWith(root.pathname))return;
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
  waScript.src=url('Practice/shared/writing-assistant.js?v=20261118-01');
  document.body.append(waScript);
 }
}

// Load vocabulary selection/dictionary on learning pages and the main portal.
if(!document.querySelector('script[data-sc-word-tools]')){
 const vocabScript=document.createElement('script');
 vocabScript.dataset.scWordTools='1';
 vocabScript.src=url('Practice/shared/word-tools.js?v=20261118-premium02');
 document.body.append(vocabScript);
}
if(!document.querySelector('script[data-sc-vocab-reminders]')){
 const reminderScript=document.createElement('script');reminderScript.dataset.scVocabReminders='1';
 reminderScript.src=url('Practice/shared/vocab-reminders.js?v=20261116-reminders01');
 document.body.append(reminderScript);
}
})();
