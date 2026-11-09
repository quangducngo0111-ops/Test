/* Shared IELTS Reading Practice UX v1 — no paid API.
   Keeps the exam engine, answer keys and score submissions untouched. */
(function(){
'use strict';
if(document.documentElement.dataset.readingUxApplied)return;
document.documentElement.dataset.readingUxApplied='practice';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const style=document.createElement('style');
style.textContent=`
:root{--reading-purple:#3b0e90}
.reading-ux-guide{margin:12px auto;padding:13px 17px;max-width:1400px;border-radius:14px;background:#f4efff;border:1px solid #d7c6fc;color:#332256;font:600 13px/1.6 system-ui}
.reading-ux-guide strong{color:#32106f}
.reading-dict{position:fixed;z-index:100000;width:min(330px,calc(100vw - 24px));padding:16px;border-radius:16px;background:white;border:1px solid #ddd3fa;box-shadow:0 15px 50px #160a3960;color:#25314b;font:14px/1.5 system-ui}
.reading-dict[hidden]{display:none}
.reading-dict-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.reading-dict-word{font-weight:800;font-size:18px;color:#30106f;overflow-wrap:anywhere}
.reading-dict-close{border:none;background:#f3effc;border-radius:8px;font-size:17px;cursor:pointer;min-width:32px;min-height:32px}
.reading-dict-meaning{margin-top:8px;font-weight:650}
.reading-dict-note{font-size:12px;color:#777b85;margin-top:8px}
.reading-dict a{color:#4722a8}
.reading-ux-guide [role=button]{cursor:pointer}
#questionsRoot .inline-review{margin:11px 0 16px;padding:13px;border-radius:12px;border:1px solid #d7c9f4;border-left:4px solid #7140cf;background:#faf8ff;box-shadow:none}
#questionsRoot .passage-evidence,#questionsRoot .inline-review [onclick*="focusEvidence"]{cursor:pointer}
#passageRoot .evidence-source.evidence-focus{background:#ffe572!important;outline:3px solid #f3b943;outline-offset:2px;box-shadow:0 0 0 5px #f9d95555!important}
#questionsRoot .qcard,#questionsRoot .question-section{scroll-margin-top:90px}
@media(max-width:760px){.reading-ux-guide{margin:8px 10px;font-size:12px;padding:11px}.reading-dict{font-size:13px}}
`;
document.head.appendChild(style);
const panel=document.createElement('div');
panel.className='reading-dict';
panel.hidden=true;
panel.setAttribute('role','dialog');
panel.setAttribute('aria-label','Tra nghĩa từ tiếng Anh');
panel.innerHTML='<div class="reading-dict-top"><span class="reading-dict-word"></span><button class="reading-dict-close" type="button" aria-label="Đóng">×</button></div><div class="reading-dict-meaning"></div><div class="reading-dict-note"></div>';
document.body.appendChild(panel);
panel.querySelector('button').addEventListener('click',()=>{panel.hidden=true});
document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!e.target.closest('#passageRoot'))panel.hidden=true;},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')panel.hidden=true});
const guide=document.createElement('div');
guide.className='reading-ux-guide';
guide.innerHTML='<strong>📖 Reading Practice · Hướng dẫn:</strong> Đồng hồ <b>đếm xuôi</b> · Bôi đen để <b>highlight</b> hoặc <b>Take note</b> · <b>Nhấp đúp một từ trong bài đọc</b> để xem nghĩa tiếng Việt · Sau khi nộp, xem đáp án và giải thích <b>ngay dưới từng câu</b>; nhấp trích dẫn để tô vàng câu trong bài đọc bên trái.';
const anchor=document.querySelector('.page,.workspace,main');
if(anchor)anchor.insertBefore(guide,anchor.firstChild);
else document.body.prepend(guide);

let sequence=0;
const getWordFromSelection=()=>{
 const selection=window.getSelection();
 if(!selection||selection.isCollapsed)return '';
 return selection.toString().trim().replace(/^[^a-zA-Z]+|[^a-zA-Z'-]+$/g,'');
};
document.addEventListener('dblclick',event=>{
 if(!event.target.closest('#passageRoot'))return;
 if(event.target.closest('input,textarea,button,a,[contenteditable]'))return;
 const word=getWordFromSelection();
 if(!/^[a-zA-Z][a-zA-Z'-]{0,39}$/.test(word))return;
 const rect=window.getSelection()?.getRangeAt(0)?.getBoundingClientRect();
 if(!rect)return;
 document.querySelectorAll('#selectionMenu.show').forEach(x=>x.classList.remove('show'));
 const width=330;
 panel.style.left=Math.max(12,Math.min(window.innerWidth-width-12,rect.left))+'px';
 panel.style.top=Math.max(12,Math.min(window.innerHeight-200,rect.bottom+12))+'px';
 panel.hidden=false;
 panel.querySelector('.reading-dict-word').textContent=word;
 panel.querySelector('.reading-dict-meaning').textContent='Đang tra nghĩa tiếng Việt...';
 panel.querySelector('.reading-dict-note').textContent='Dịch tự động, nên đối chiếu với ngữ cảnh bài đọc.';
 const current=++sequence;
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),8000);
 const url='https://api.mymemory.translated.net/get?q='+encodeURIComponent(word)+'&langpair=en%7Cvi';
 fetch(url,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Failed');return r.json();}).then(data=>{
  if(current!==sequence||panel.hidden)return;
  const translation=String(data?.responseData?.translatedText||'').trim();
  if(!translation||/MYMEMORY WARNING|INVALID LANGUAGE/i.test(translation))throw Error('Empty');
  panel.querySelector('.reading-dict-meaning').textContent='🇻🇳 '+translation;
 }).catch(()=>{
  if(current!==sequence||panel.hidden)return;
  panel.querySelector('.reading-dict-meaning').textContent='Chưa tải được nghĩa lúc này.';
  const note=panel.querySelector('.reading-dict-note');
  note.textContent='';
  const link=document.createElement('a');
  link.textContent='Mở bản dịch tiếng Việt';
  link.target='_blank';
  link.rel='noopener noreferrer';
  link.href='https://translate.google.com/?sl=en&tl=vi&text='+encodeURIComponent(word)+'&op=translate';
  note.appendChild(link);
 }).finally(()=>clearTimeout(timeout));
},true);

function answerNumbers(){
 const ids=[...document.querySelectorAll('#questionsRoot [id]')].map(el=>{
  const match=el.id.match(/^(?:a|q|tf)(\d+)$/);
  return match?Number(match[1]):null;
 }).filter(Number.isInteger);
 return [...new Set(ids)].sort((a,b)=>a-b);
}
function placeReview(n,element){
 if(!element)return;
 const q=$('q'+n)||$('a'+n)||$('tf'+n);
 if(!q)return;
 let container=q.closest('.qcard,.question-card,.note-line,.table-row,.flow-step,.question-row,.heading-row,.sentence-row,li,tr');
 if(!container){container=q.closest('.question-section')||q.closest('.note-section');}
 if(!container||container.contains(element))return;
 if(container.tagName==='TR'){
  const tr=document.createElement('tr');
  tr.className='reading-ux-review-row';
  const td=document.createElement('td');
  td.colSpan=Math.max(1,container.querySelectorAll('td,th').length);
  td.appendChild(element);
  tr.appendChild(td);
  container.insertAdjacentElement('afterend',tr);
 }else{
  container.insertAdjacentElement('beforeend',element);
 }
}
function finalizeReviews(){
 try{
  if(typeof submitted!=='undefined'&&!submitted)return;
  const nums=answerNumbers();
  if(!nums.length)return;
  const list=$('reviewList');
  if(typeof renderReview==='function'&&list){
   list.replaceChildren();
   for(const n of nums){renderReview(n,typeof getAnswer==='function'?getAnswer(n):'');}
   const reviews=[...list.querySelectorAll('.inline-review')];
   reviews.forEach(node=>{
     const h=node.querySelector('.review-title')?.textContent||'';
     const number=Number((h.match(/\d+/)||[])[0]);
     if(Number.isInteger(number))placeReview(number,node);
   });
  }else if(typeof reviewHTML==='function'){
   for(const n of nums){
    const user=typeof getAnswer==='function'?getAnswer(n):'';
    const answer=typeof KEY!=='undefined'?KEY[n]:'';
    if($('review'+n))reviewHTML(n,user,answer);
   }
  }
  // Preserve evidence links but show each explanation directly below its question.
  const message=document.querySelector('#resultOverlay p');
  if(message&&/câu sai|giải thích/i.test(message.textContent||'')){
   message.textContent='Đóng bảng điểm để xem đáp án và giải thích ngay dưới từng câu. Nhấp vào trích dẫn để đối chiếu trong bài đọc.';
  }
 }catch(error){console.warn('[Reading UX] Could not distribute reviews:',error)}
}
if(typeof window.submitPractice==='function'){
 const original=window.submitPractice;
 window.submitPractice=function(){
  const output=original.apply(this,arguments);
  setTimeout(finalizeReviews,0);
  return output;
 };
}
})();
