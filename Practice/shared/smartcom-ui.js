/* Smartcom shared UI: friendly hub visuals + hover/focus/click quick jump.
   Uses script URL as base, so routes work at any GitHub Pages project path. */
(function(){
'use strict';
if(document.getElementById('sc-quick-shell'))return;
const current=document.currentScript;
if(!current)return;
const root=new URL('../../',current.src); // .../Test/ from .../Test/Practice/shared/
const asset=new URL('./smartcom-ui.css?v=20261114-04',current.src);
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
  ['🎙️','Speaking Mock','Practice/Speaking/mock-test/'],['✍️','Writing','Practice/WritingTask2/']
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
const shell=document.createElement('nav');shell.id='sc-quick-shell';shell.setAttribute('aria-label','Truy cập nhanh các phần học Smartcom');
shell.innerHTML='<div class="sc-quick-panel" id="sc-quick-panel"><div class="sc-panel-top"><div><b>⚡ Truy cập nhanh</b><span>Chuyển phần học mà không cần quay về trang chủ</span></div><button class="sc-quick-close" type="button" aria-label="Đóng menu">✕</button></div></div><button type="button" class="sc-quick-trigger" aria-expanded="false" aria-controls="sc-quick-panel" title="Nhấn để mở truy cập nhanh" aria-label="Mở truy cập nhanh"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 13h7l-1 9 10-12h-7l1-8z"/></svg></button>';
const panel=shell.querySelector('.sc-quick-panel'),trigger=shell.querySelector('.sc-quick-trigger');
for(const group of groups){
 const h=document.createElement('div');h.className='sc-section-label';h.textContent=group.heading;panel.append(h);
 const wrap=document.createElement('div');wrap.className='sc-link-list';panel.append(wrap);
 for(const [icon,label,path] of group.links){
  const a=document.createElement('a');a.className='sc-link'+(label==='Reading Test'?' sc-feature':'');
  a.href=url(path);a.innerHTML='<span class="sc-icon" aria-hidden="true"></span><span></span>';
  a.querySelector('.sc-icon').textContent=icon;a.lastElementChild.textContent=label;wrap.append(a);
 }
}
const note=document.createElement('p');note.className='sc-panel-note';note.textContent='Đang làm bài thi? Hãy lưu hoặc nộp bài trước khi rời trang.';panel.append(note);
function open(value){shell.classList.toggle('sc-open',value);trigger.setAttribute('aria-expanded',String(value))}
trigger.addEventListener('click',()=>open(!shell.classList.contains('sc-open')));
shell.querySelector('.sc-quick-close').addEventListener('click',()=>{open(false);trigger.focus()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')open(false)});
document.addEventListener('pointerdown',e=>{if(!shell.contains(e.target))open(false)});
document.body.append(shell);
})();
