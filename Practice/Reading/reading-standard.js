/* Shared results ledger for standalone practice exercises. */
(()=>{const source=document.currentScript;if(!source||window.SmartcomHistory||document.querySelector('script[data-sc-result-ledger]'))return;
 const tag=document.createElement('script');tag.dataset.scResultLedger='1';
 tag.src=new URL('../shared/attempt-history.js?v=20261126-urlparams-receiver03',source.src).href;
 document.head.appendChild(tag);
})();

/* Load the common draggable AssistiveTouch in every standalone lesson using this toolkit. */
(()=>{if(window.__scQuickLoaderQueued||document.querySelector('script[data-sc-quick-bootstrap]'))return;const current=document.currentScript;if(!current)return;const script=document.createElement('script');script.dataset.scQuickBootstrap='1';script.src=new URL('../../assets/quick-access-loader.js?v=20261126-results-receiver04',current.src).href;(document.body||document.head).append(script);})();
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
.reading-note-tooltip{position:fixed;z-index:100100;max-width:min(330px,calc(100vw - 24px));min-width:150px;padding:12px 15px;border-radius:13px;background:#281260;color:#fff;box-shadow:0 12px 32px rgba(27,14,67,.3);font:13px/1.55 system-ui;pointer-events:none;overflow-wrap:anywhere;white-space:pre-wrap}
.reading-note-tooltip[hidden]{display:none}
.reading-note-tooltip-label{font-size:11px;font-weight:800;color:#ddcbff;display:block;margin-bottom:5px}
#passageRoot .note-anchor,#questionsRoot .note-anchor{background:#fff0b7;border-bottom:2px dotted #7b48cb;border-radius:3px;cursor:help}
.reading-dict{position:fixed;z-index:100000;width:min(330px,calc(100vw - 24px));padding:16px;border-radius:16px;background:white;border:1px solid #ddd3fa;box-shadow:0 15px 50px #160a3960;color:#25314b;font:14px/1.5 system-ui}
.reading-dict[hidden]{display:none}
.reading-dict-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.reading-dict-word{font-weight:800;font-size:18px;color:#30106f;overflow-wrap:anywhere}
.reading-dict-close{border:none;background:#f3effc;border-radius:8px;font-size:17px;cursor:pointer;min-width:32px;min-height:32px}
.reading-dict-meaning{margin-top:8px;font-weight:650}
.reading-dict-note{font-size:12px;color:#777b85;margin-top:8px}
.reading-dict a{color:#4722a8}
.reading-dict-save{margin-top:10px;padding:9px 12px;border-radius:9px;background:#6737c8;color:white;border:0;font-weight:750;cursor:pointer}
.reading-help-question{position:fixed;pointer-events:none;z-index:9999;display:flex;width:17px;height:17px;align-items:center;justify-content:center;border-radius:50%;background:#ece5ff;color:#5421a7;border:1px solid #c7b5ee;font:800 12px system-ui;box-shadow:0 2px 8px #24134a25}
.reading-help-question[hidden]{display:none}
.reading-highlight-colors{display:flex;align-items:center;gap:5px;padding:2px 5px}
.reading-highlight-colors button{height:23px;width:23px;min-width:23px;padding:0;border-radius:8px;border:2px solid rgba(255,255,255,.6);box-shadow:inset 0 0 0 1px #43296c25;cursor:pointer}
.reading-highlight-colors button[aria-pressed="true"]{outline:2px solid #fff;outline-offset:1px;transform:scale(1.06)}
#passageRoot mark.user-highlight,#questionsRoot mark.user-highlight{background:var(--sc-highlight-color,#fff29a)!important}

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
panel.innerHTML='<div class="reading-dict-top"><span class="reading-dict-word"></span><button class="reading-dict-close" type="button" aria-label="Đóng">×</button></div><div class="reading-dict-meaning"></div><div class="reading-dict-note"></div><button class="reading-dict-save" type="button">＋ Lưu vào sổ tay</button>';
document.body.appendChild(panel);
panel.querySelector('button').addEventListener('click',()=>{panel.hidden=true});
document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!e.target.closest('#passageRoot'))panel.hidden=true;},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')panel.hidden=true});
const guide=document.createElement('div');
guide.className='reading-ux-guide';
guide.innerHTML='<strong>📖 Reading Practice · Hướng dẫn:</strong> Đồng hồ <b>đếm xuôi</b> · Bôi đen để <b>highlight 6 màu</b> hoặc <b>Take note</b> (rê chuột lên đoạn đã ghi chú để xem) · <b>Rê chuột thấy dấu ? · nhấp đúp từ/cụm từ</b> để tra nghĩa và lưu vào sổ tay · Sau khi nộp, xem đáp án và giải thích <b>ngay dưới từng câu</b>; nhấp trích dẫn để tô vàng câu trong bài đọc bên trái.';
const anchor=document.querySelector('.page,.workspace,main');
if(anchor)anchor.insertBefore(guide,anchor.firstChild);
else document.body.prepend(guide);

// Show saved notes on hover, even when a previous attempt restored its markup.
const noteTip=document.createElement('div');
noteTip.className='reading-note-tooltip';
noteTip.hidden=true;
noteTip.setAttribute('role','tooltip');
noteTip.innerHTML='<span class="reading-note-tooltip-label">📝 Ghi chú</span><span class="reading-note-tooltip-body"></span>';
document.body.appendChild(noteTip);
let activeNote=null;
const fetchNoteText=element=>{
  const direct=element.dataset.note||element.getAttribute('title')||'';
  if(direct&&direct!=='Bấm để xem ghi chú')return direct;
  const id=element.dataset.noteId;
  if(!id)return '';
  const zone=element.closest('#passageRoot')?'passage':'questions';
  if(typeof window.loadNotes==='function'){
    try{
      const found=window.loadNotes(zone).find(x=>x.id===id);
      if(found?.text)return found.text;
    }catch(e){}
  }
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i)||'';
      if(!key.endsWith('_notes_'+zone))continue;
      const notes=JSON.parse(localStorage.getItem(key)||'[]');
      const match=notes.find(x=>x.id===id);
      if(match?.text)return match.text;
    }
  }catch(e){}
  return '';
};
function positionNote(el){
  const bounds=el.getBoundingClientRect();
  const tipBounds=noteTip.getBoundingClientRect();
  const width=tipBounds.width||250;
  const height=tipBounds.height||95;
  noteTip.style.left=Math.max(12,Math.min(innerWidth-width-12,bounds.left+bounds.width/2-width/2))+'px';
  noteTip.style.top=Math.max(12,bounds.top>height+18?bounds.top-height-10:Math.min(innerHeight-height-12,bounds.bottom+10))+'px';
}
function showNote(el){
  const value=fetchNoteText(el);
  if(!value)return;
  activeNote=el;
  noteTip.querySelector('.reading-note-tooltip-body').textContent=value;
  noteTip.hidden=false;
  positionNote(el);
}
function hideNote(){
  activeNote=null;
  noteTip.hidden=true;
}
document.addEventListener('pointerover',e=>{
  if(e.pointerType==='touch')return;
  const note=e.target.closest?.('#passageRoot .note-anchor,#questionsRoot .note-anchor');
  if(!note||note===activeNote)return;
  showNote(note);
});
document.addEventListener('pointerout',e=>{
  if(activeNote&&e.target.closest?.('.note-anchor')===activeNote&&!activeNote.contains(e.relatedTarget))hideNote();
});
window.addEventListener('scroll',()=>{if(activeNote)positionNote(activeNote);},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideNote();});
document.addEventListener('focusin',e=>{
  const note=e.target.closest?.('#passageRoot .note-anchor,#questionsRoot .note-anchor');
  if(note)showNote(note);
});
document.addEventListener('focusout',e=>{if(activeNote===e.target)hideNote();});
document.addEventListener('touchstart',e=>{
  const note=e.target.closest?.('#passageRoot .note-anchor,#questionsRoot .note-anchor');
  if(note)showNote(note);else hideNote();
},{passive:true});

function showSavedNotice(message){
 let el=document.getElementById('sc-practice-saved-toast');
 if(!el){el=document.createElement('div');el.id='sc-practice-saved-toast';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.style.cssText='position:fixed;right:18px;bottom:20px;z-index:2147483600;max-width:min(350px,calc(100vw - 36px));background:#30146d;color:white;border-radius:14px;padding:13px 17px;box-shadow:0 12px 30px #26114c40;font:700 14px/1.5 system-ui;pointer-events:none';document.body.append(el)}
 el.textContent=message;el.hidden=false;clearTimeout(showSavedNotice.timer);showSavedNotice.timer=setTimeout(()=>el.hidden=true,3400);
}

let sequence=0;
let lastDictionary={word:'',meaning:''};
const knownMeanings={
 'such as':'chẳng hạn như; ví dụ như','take place':'diễn ra; xảy ra','takes place':'diễn ra','took place':'đã diễn ra','taking place':'đang diễn ra',
 'take part in':'tham gia vào','look after':'chăm sóc','look up':'tra cứu','as well as':'cũng như','according to':'theo; dựa theo',
 'in order to':'để; nhằm','due to':'do; bởi vì','as a result':'kết quả là','for example':'ví dụ như',
 'come up with':'nghĩ ra; đề xuất','pay attention to':'chú ý đến','carry out':'tiến hành','find out':'tìm ra','run out of':'cạn kiệt'
};
const expressions=Object.keys(knownMeanings).sort((a,b)=>b.length-a.length);
const selectedTerm=()=>{
 const selection=window.getSelection();
 if(!selection||selection.isCollapsed||!selection.rangeCount)return '';
 let selected=selection.toString().trim().replace(/^[^a-zA-Z]+|[^a-zA-Z'-]+$/g,'').toLowerCase();
 if(!/^[a-z][a-z' -]{0,100}$/.test(selected))return '';
 if(!selected.includes(' ')){
  const range=selection.getRangeAt(0);
  if(range.startContainer===range.endContainer&&range.startContainer.nodeType===Node.TEXT_NODE){
   const source=range.startContainer.textContent.toLowerCase();
   for(const phrase of expressions){
    let i=source.indexOf(phrase);
    while(i>=0){
     const right=i+phrase.length;
     if(i<=range.startOffset&&right>=range.endOffset&&(i===0||!/[\w]/.test(source[i-1]))&&(right===source.length||!/[\w]/.test(source[right])))return phrase;
     i=source.indexOf(phrase,i+1);
    }
   }
  }
 }
 return selected;
};
function openWord(term,rect){
 const word=String(term||'').trim().toLowerCase();if(!word||word.length>100)return;
 document.querySelectorAll('#selectionMenu.show').forEach(x=>x.classList.remove('show'));
 panel.style.left=Math.max(12,Math.min(innerWidth-345,rect.left))+'px';
 panel.style.top=Math.max(12,Math.min(innerHeight-220,rect.bottom+12))+'px';
 panel.hidden=false;
 lastDictionary={word,meaning:knownMeanings[word]||''};
 panel.querySelector('.reading-dict-word').textContent=word;
 panel.querySelector('.reading-dict-meaning').textContent=knownMeanings[word]?'🇻🇳 '+knownMeanings[word]:'Đang tra nghĩa tiếng Việt...';
 panel.querySelector('.reading-dict-note').textContent='Nghĩa tham khảo; hãy đối chiếu với ngữ cảnh bài đọc.';
 const current=++sequence;
 if(knownMeanings[word])return;
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8000);
 fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(word)+'&langpair=en%7Cvi',{signal:controller.signal})
 .then(r=>{if(!r.ok)throw Error('Failed');return r.json()})
 .then(data=>{
  if(current!==sequence||panel.hidden)return;
  const translated=String(data?.responseData?.translatedText||'').trim();
  if(!translated||/MYMEMORY WARNING|INVALID LANGUAGE/i.test(translated))throw Error('Empty');
  lastDictionary.meaning=translated;
  panel.querySelector('.reading-dict-meaning').textContent='🇻🇳 '+translated;
 }).catch(()=>{
  if(current!==sequence||panel.hidden)return;
  panel.querySelector('.reading-dict-meaning').textContent='Chưa tải được nghĩa lúc này.';
  const note=panel.querySelector('.reading-dict-note');note.replaceChildren();
  const link=document.createElement('a');link.textContent='Mở bản dịch tiếng Việt';
  link.target='_blank';link.rel='noopener noreferrer';
  link.href='https://translate.google.com/?sl=en&tl=vi&text='+encodeURIComponent(word)+'&op=translate';note.append(link);
 }).finally(()=>clearTimeout(timeout));
}
panel.querySelector('.reading-dict-save').addEventListener('click',()=>{
 if(!lastDictionary.word)return;
 let profile=null;
 try{profile=JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null')}catch(e){}
 const scope=profile?.name&&profile?.className?(profile.name+'|'+profile.className).toLowerCase():'guest';
 const key='SC_VOCAB_NOTEBOOK_V1_'+scope;
 try{
  const items=JSON.parse(localStorage.getItem(key)||'[]');
  if(!Array.isArray(items))throw Error('Invalid notebook');
  const previous=items.findIndex(x=>x.word===lastDictionary.word);
  const entry={word:lastDictionary.word,meaning:lastDictionary.meaning||'',phonetic:'',partOfSpeech:lastDictionary.word.includes(' ')?'phrase':'',example:'',savedAt:new Date().toISOString()};
  if(previous<0)items.unshift(entry);else items[previous]={...items[previous],...entry,meaning:entry.meaning||items[previous].meaning};
  localStorage.setItem(key,JSON.stringify(items));
  const notice=previous<0?'✓ Đã thêm “'+lastDictionary.word+'” vào sổ tay.':'✓ Từ “'+lastDictionary.word+'” đã có trong sổ tay; đã cập nhật.';panel.querySelector('.reading-dict-note').textContent=notice;showSavedNotice(notice);
 }catch(e){panel.querySelector('.reading-dict-note').textContent='Không lưu được trên trình duyệt này.'}
});
document.addEventListener('dblclick',event=>{
 if(!event.target.closest?.('#passageRoot,#questionsRoot'))return;
 if(event.target.closest('input,textarea,button,a,[contenteditable],.note-anchor,mark.user-highlight'))return;
 const word=selectedTerm();if(!word)return;
 const rect=window.getSelection()?.rangeCount?window.getSelection().getRangeAt(0).getBoundingClientRect():null;
 if(!rect)return;
 event.stopImmediatePropagation();openWord(word,rect);
},true);
const hoverHint=document.createElement('div');hoverHint.className='reading-help-question';hoverHint.textContent='?';hoverHint.hidden=true;document.body.append(hoverHint);
document.addEventListener('pointermove',e=>{
 if(e.pointerType==='touch'||e.buttons||!e.target.closest?.('#passageRoot,#questionsRoot')||e.target.closest?.('input,textarea,button,select,a,mark.user-highlight,.note-anchor')){hoverHint.hidden=true;return}
 const selection=window.getSelection();if(selection&&!selection.isCollapsed){hoverHint.hidden=true;return}
 const range=document.caretRangeFromPoint?.(e.clientX,e.clientY);
 if(!range||range.startContainer.nodeType!==Node.TEXT_NODE||!e.target.contains(range.startContainer)){hoverHint.hidden=true;return}
 const text=range.startContainer.textContent||'',pos=range.startOffset;
 if(!/[A-Za-z]/.test(text[pos]||text[pos-1]||'')){hoverHint.hidden=true;return}
 hoverHint.hidden=false;hoverHint.style.left=Math.min(innerWidth-25,e.clientX+12)+'px';hoverHint.style.top=Math.max(8,e.clientY-24)+'px';
},{passive:true});
document.addEventListener('pointerleave',()=>{hoverHint.hidden=true});


/* Six independently persisted highlight colours; keep original highlight and notes handlers. */
const highlightPalette=[
 ['Vàng','#fff29a'],['Xanh lá','#baf2ce'],['Xanh dương','#bbdcff'],
 ['Hồng','#ffc9db'],['Tím','#dfccff'],['Cam','#ffd5a4']
];
let selectedHighlightColor='#fff29a';
const highlightMenu=document.getElementById('selectionMenu');
const highlightButton=document.getElementById('menuHighlight');
if(highlightMenu&&highlightButton){
 const palette=document.createElement('div');palette.className='reading-highlight-colors';
 palette.setAttribute('role','group');palette.setAttribute('aria-label','Chọn màu highlight');
 for(const [label,color] of highlightPalette){
  const b=document.createElement('button');b.type='button';b.style.background=color;
  b.title='Highlight màu '+label;b.setAttribute('aria-label','Màu '+label);
  b.setAttribute('aria-pressed',String(color===selectedHighlightColor));
  b.addEventListener('click',e=>{
   e.preventDefault();e.stopPropagation();selectedHighlightColor=color;
   for(const chip of palette.querySelectorAll('button'))chip.setAttribute('aria-pressed',String(chip===b));
  });palette.append(b);
 }
 highlightButton.insertAdjacentElement('afterend',palette);
 const isDeletion=()=>highlightButton.classList.contains('danger');
 const updatePalette=()=>{palette.hidden=isDeletion()||highlightButton.style.display==='none'};
 const watcher=new MutationObserver(updatePalette);
 watcher.observe(highlightButton,{attributes:true,attributeFilter:['class','style']});
 updatePalette();
 let knownHighlights=new Set([...document.querySelectorAll('#passageRoot mark.user-highlight,#questionsRoot mark.user-highlight')]);
 const applyNewColors=()=>{
  const current=new Set(document.querySelectorAll('#passageRoot mark.user-highlight,#questionsRoot mark.user-highlight'));
  let changedPassage=false,changedQuestions=false;
  for(const el of current){
   if(knownHighlights.has(el)||el.dataset.scHighlightColor)continue;
   el.dataset.scHighlightColor=selectedHighlightColor;
   el.style.setProperty('--sc-highlight-color',selectedHighlightColor);
   if(el.closest('#passageRoot'))changedPassage=true;
   if(el.closest('#questionsRoot'))changedQuestions=true;
  }
  knownHighlights=current;
  if(changedPassage&&typeof window.saveMarkup==='function')try{window.saveMarkup('passage')}catch(e){}
  if(changedQuestions&&typeof window.saveMarkup==='function')try{window.saveMarkup('questions')}catch(e){}
 };
 const roots=['passageRoot','questionsRoot'].map(id=>document.getElementById(id)).filter(Boolean);
 for(const root of roots)new MutationObserver(applyNewColors).observe(root,{childList:true,subtree:true});
 highlightButton.addEventListener('click',()=>queueMicrotask(applyNewColors));
}

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
