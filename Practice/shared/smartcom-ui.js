/* Smartcom shared UI: friendly hub visuals + hover/focus/click quick jump.
   Uses script URL as base, so routes work at any GitHub Pages project path. */
(function(){
'use strict';
if(document.getElementById('sc-quick-shell'))return;
const current=document.currentScript;
if(!current)return;
const root=new URL('../../',current.src); // .../Test/ from .../Test/Practice/shared/
const asset=new URL('./smartcom-ui.css?v=20261114-07',current.src);
const link=document.createElement('link');link.rel='stylesheet';link.href=asset.href;document.head.append(link);
const url=path=>new URL(path,root).href;
const pathname=location.pathname;
const hubPaths=[
 '/Practice/','/Practice/Speaking/','/Practice/Speaking/Part1/','/Practice/Speaking/Part2/',
 '/Practice/Speaking/Part3/','/Practice/Listening/','/Practice/Listening/FullTest/',
 '/Practice/Listening/Part1/','/Practice/Listening/Part2/','/Practice/Listening/Part3/',
 '/Practice/Listening/Part4/','/Practice/Reading/ReadingPractice3Passages/',
 '/Practice/Grammar/','/Practice/WritingTask1/','/Practice/WritingTask2/','/Practice/Vocabulary/'
];
const nestedHub=(
 /\/Practice\/Reading\/(?:ReadingPassage[123]|TrueFalseNotGiven|NoteCompletion|TableCompletion|ShortAnswerQuestions|Matching%20Headings)\/?$/i.test(pathname)||
 /\/Practice\/WritingTask1\/(?:DynamicDatasets|StaticDatasets|Maps|Process)\/?$/i.test(pathname)||
 /\/Practice\/WritingTask2\/(?:OpinionEssay|DiscussionEssay|AdvantagesDisadvantages|ProblemSolution|TwoPartQuestions)\/?$/i.test(pathname)||
 /\/Practice\/Grammar\/Topic\d\d\/?$/i.test(pathname)
);
if(pathname===root.pathname||nestedHub||hubPaths.some(p=>pathname.endsWith(p)||pathname.endsWith(p.slice(0,-1))))document.body.classList.add('sc-hub-refresh');
const groups=[
 {heading:'Thi thử IELTS',links:[
  ['📖','Reading Test','Read01/'],['🎧','Listening Test','Lis01/C21T4/'],
  ['🎙️','Speaking Tests','?skill=speaking'],['✍️','Writing','Practice/WritingTask2/']
 ]},
 {heading:'Kho luyện tập',links:[
  ['💬','Speaking','Practice/Speaking/'],
  ['🧠','Vocabulary','Practice/Vocabulary/'],['📗','Grammar','Practice/Grammar/'],
  ['📚','Reading Practice','Practice/Reading/ReadingPractice3Passages/'],
  ['🎧','Listening Practice','Practice/Listening/'],
  ['📈','Writing Task 1','Practice/WritingTask1/'],['📝','Writing Task 2','Practice/WritingTask2/']
 ]},
 {heading:'Điều hướng',links:[['🏠','Trang chủ',''],['🧭','Kho luyện tập','Practice/']]}
];

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
 heading.textContent=group.heading==='Thi thử IELTS'?'TEST':group.heading==='Kho luyện tập'?'HỌC':'KHÁC';
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
 shell.classList.toggle('sc-open',value);
 toggle.setAttribute('aria-expanded',String(value));
 toggle.setAttribute('aria-label',value?'Đóng menu truy cập nhanh':'Mở menu truy cập nhanh');
 if(!value){tools.scrollTop=0;hideLabel()}
}
toggle.addEventListener('click',()=>setOpen(!shell.classList.contains('sc-open')));
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
})();
