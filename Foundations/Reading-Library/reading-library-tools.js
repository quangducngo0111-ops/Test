/* Reading Library shared study tools.
 * Reading Practice-style selection/6-colour annotation; word lookup, IPA and
 * vocabulary notebook are provided by the existing shared word-tools.js.
 * Reading time is counted only while an article is active and tab visible.
 */
(()=>{
 'use strict';
 if(window.SmartcomReadingLibraryTools)return;
 const root=document.getElementById('articleText'),timer=document.getElementById('timer');
 if(!root||!timer)return;
 const profile=()=>{try{const p=JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null');return p?.name&&p?.className?(p.name+'|'+p.className).toLowerCase():'guest'}catch{return'guest'}};
 const stamp=(id,type)=>'SC_READING_LIBRARY_'+type+'_V1_'+profile()+'_'+id;
 const colors=[['Vàng','#fff29a'],['Xanh lá','#bbefcb'],['Xanh dương','#b9dbff'],['Hồng','#ffc5dc'],['Tím','#d9c8ff'],['Cam','#ffd4a0']];
 let articleId='',elapsed=0,lastStart=0,interval=0,savedRange=null,selectionOrigin=null;
 const format=s=>{const secs=Math.floor(s%60),mins=Math.floor(s/60)%60,hrs=Math.floor(s/3600);return (hrs?String(hrs).padStart(2,'0')+':':'')+String(mins).padStart(2,'0')+':'+String(secs).padStart(2,'0')};
 function elapsedNow(){return elapsed+(lastStart?(performance.now()-lastStart)/1000:0)}
 function drawTime(){timer.textContent=format(elapsedNow())}
 function saveTime(){if(!articleId)return;try{localStorage.setItem(stamp(articleId,'TIME'),String(Math.floor(elapsedNow())))}catch{}}
 function stopClock(){if(lastStart){elapsed=elapsedNow();lastStart=0}if(interval){clearInterval(interval);interval=0}drawTime();saveTime()}
 function resumeClock(){if(!articleId||document.hidden||lastStart)return;lastStart=performance.now();interval=setInterval(()=>{drawTime();saveTime()},1000);drawTime()}
 function setReading(id){
  if(articleId===id){timer.hidden=false;resumeClock();return}
  stopClock();articleId=id;elapsed=0;
  if(id){try{elapsed=Math.max(0,Number(localStorage.getItem(stamp(id,'TIME'))||0)||0)}catch{}}
  timer.hidden=!id;drawTime();resumeClock();
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopClock();else resumeClock()});
 window.addEventListener('pagehide',stopClock);
 const menu=document.createElement('div');menu.id='sc-library-mark-menu';menu.hidden=true;
 menu.setAttribute('role','toolbar');menu.setAttribute('aria-label','Highlight và Take note');
 const high=document.createElement('button');high.type='button';high.textContent='🖍 Highlight';
 const note=document.createElement('button');note.type='button';note.textContent='📝 Take note';
 const strip=document.createElement('div');strip.className='sc-library-colors';
 const swatches=[];
 let selectedColor=colors[0][1];
 function selectedChip(button,color){selectedColor=color;swatches.forEach(b=>b.setAttribute('aria-pressed',String(b===button)))}
 colors.forEach(([label,color])=>{
  const b=document.createElement('button');b.type='button';b.title='Màu '+label;b.setAttribute('aria-label','Highlight '+label);
  b.style.background=color;b.dataset.color=color;b.setAttribute('aria-pressed',String(color===selectedColor));
  strip.append(b);swatches.push(b);
  b.addEventListener('click',()=>{selectedChip(b,color);apply('highlight')});
 });
 menu.append(high,note,strip);document.body.append(menu);
 const hide=()=>{menu.hidden=true;savedRange=null};
 menu.addEventListener('mousedown',e=>e.preventDefault());
 function inRoot(node){const el=node?.nodeType===1?node:node?.parentElement;return el?.closest('#articleText p')||null}
 function selectionRange(){
  const sel=window.getSelection();
  if(!sel?.rangeCount||sel.isCollapsed||!sel.toString().trim())return null;
  const range=sel.getRangeAt(0),a=inRoot(range.startContainer),b=inRoot(range.endContainer);
  return a&&a===b?range.cloneRange():null;
 }
 function show(range){
  if(!range)return hide();
  const rect=range.getBoundingClientRect();if(!rect.width&&!rect.height)return hide();
  savedRange=range;
  menu.hidden=false;
  const width=menu.offsetWidth||350;
  menu.style.left=Math.max(8,Math.min(innerWidth-width-8,rect.left+rect.width/2-width/2))+'px';
  menu.style.top=Math.max(8,rect.top-menu.offsetHeight-9)+'px';
 }
 function persist(){
  if(!articleId)return;
  // Save the rendered article annotations in the same browser only.
  try{localStorage.setItem(stamp(articleId,'MARKS'),root.innerHTML)}catch{}
 }
 function apply(kind){
  if(!savedRange||!articleId)return hide();
  const range=savedRange.cloneRange();
  const body=kind==='note'?prompt('Nhập ghi chú cho phần văn bản đã chọn:'):null;
  if(kind==='note'&&(!body||!body.trim()))return hide();
  try{
   const span=document.createElement(kind==='note'?'span':'mark');
   span.className=kind==='note'?'note-anchor':'user-highlight';
   if(kind==='highlight'){span.dataset.scHighlightColor=selectedColor;span.style.backgroundColor=selectedColor}
   if(kind==='note'){span.dataset.note=body.trim();span.title=body.trim()}
   span.append(range.extractContents());range.insertNode(span);
   window.getSelection()?.removeAllRanges();persist();
  }catch(err){console.warn('[Library annotations] Selection could not be marked',err)}
  hide();
 }
 high.addEventListener('click',()=>apply('highlight'));
 note.addEventListener('click',()=>apply('note'));
 root.addEventListener('mousedown',e=>{
  if(e.button===0&&!e.target.closest('button,input,textarea,a'))selectionOrigin={x:e.clientX,y:e.clientY};
  else selectionOrigin=null;
 });
 root.addEventListener('mouseup',e=>{
  const started=selectionOrigin;
  selectionOrigin=null;
  if(!started||Math.hypot(e.clientX-started.x,e.clientY-started.y)<6){hide();return}
  setTimeout(()=>show(selectionRange()),0);
 });
 root.addEventListener('touchend',()=>setTimeout(()=>show(selectionRange()),160));
 document.addEventListener('mousedown',e=>{
  if(!menu.contains(e.target)&&!root.contains(e.target))hide();
 });
 // A click is reserved for dictionary. To remove a mark, use the context menu.
 root.addEventListener('contextmenu',e=>{
  const mark=e.target.closest('mark.user-highlight,span.note-anchor');
  if(!mark||!root.contains(mark))return;
  e.preventDefault();
  if(!confirm('Xóa '+(mark.matches('mark')?'highlight':'ghi chú')+' này?'))return;
  mark.replaceWith(...mark.childNodes);persist();hide();
 });
 function mount(id){
  setReading(id);
  hide();root.removeAttribute('data-sc-lexemes');
  // Existing annotations are scoped by both student and article ID.
  let previous=null;try{previous=localStorage.getItem(stamp(id,'MARKS'))}catch{}
  if(previous&&previous.includes('<p')) {
   // Refuse stored executable elements and event-handler attributes.
   const tpl=document.createElement('template');tpl.innerHTML=previous;
   const forbidden=tpl.content.querySelector('script,iframe,form,object,embed,input,textarea,select,button,[onload],[onclick],[onerror],[onmouseover]');
   if(!forbidden&&tpl.content.querySelectorAll('p').length===root.querySelectorAll('p').length)root.replaceChildren(...tpl.content.childNodes);
  }
  window.scMarkReadingTerms?.(root);
 }
 window.SmartcomReadingLibraryTools={mount,pause:()=>{setReading('');hide()},getElapsed:elapsedNow};
 timer.hidden=true;drawTime();
})();