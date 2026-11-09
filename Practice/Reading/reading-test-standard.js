/* IELTS Reading Test: consistent exam-only annotation controls.
   Dictionary is unavailable during timed tests; annotations use the Practice workflow. */
(function(){
'use strict';
document.documentElement.dataset.readingUxApplied='test';
const style=document.createElement('style');
style.textContent=`

:root{--navy:#281260;--navy2:#1c0e49;--blue:#6545b7;--paper:#f5f7fb;--line:#e3e7ef;--text:#202636;--muted:#6f7890;--accent:#6545b7;--test-navy:#281260}
html,body{font-family:Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif!important;background:#f5f7fb}
.start,.start-screen{background:linear-gradient(125deg,#1c0e49,#281260,#4b2cb0)!important}
.start-card{border:1px solid #e6e0f4;border-radius:20px!important;box-shadow:0 22px 65px #1c0e4950!important}
.start-card h1{letter-spacing:-.035em}
.start-card input:focus-visible,.exam input:focus-visible,.exam select:focus-visible{outline:3px solid #bca7f3;outline-offset:1px}
.start .btn,.start-screen .btn{background:#3b0e90;border-radius:10px!important}
.exam{grid-template-rows:auto auto auto minmax(0,1fr) auto!important;background:#f5f7fb}
.exam .top,.exam .topbar{background:linear-gradient(100deg,#1c0e49,#281260,#3b0e90)!important;min-height:62px;padding:11px 18px;align-items:center;box-shadow:0 7px 18px rgba(40,18,96,.12)}
.exam .timer{font-size:19px;font-weight:900;border-radius:9px;background:rgba(255,255,255,.14);padding:9px 13px}
.exam .tabs{background:#fff!important;padding:10px 18px;gap:9px;overflow-x:auto}
.exam .tab{border-radius:10px!important;color:#392260;border-color:#e6def8;padding:9px 16px;white-space:nowrap}
.exam .tab.active{background:#3b0e90!important;color:#fff!important;border-color:#3b0e90!important}
.exam .workspace{min-height:0;grid-template-columns:minmax(0,1.03fr) minmax(0,.97fr);border-top:1px solid #e7e0f5}
.exam #passage,.exam .passage-pane{background:white!important;border-right:1px solid #e3e7ef}
.exam #questions,.exam .questions-pane{background:#fafbfe!important}
.exam #passage,.exam #questions,.exam .pane{scroll-behavior:smooth}
.exam .passage h2,.exam .passage-title,.exam .group h3,.exam .question-title{color:#281260!important}
.exam .card,.exam .completion,.exam .match-row,.exam .diagram-answers,.exam .bank,.exam .group .card{border-radius:12px!important;border-color:#e4e7ef;background:#fff}
.exam .card{box-shadow:0 4px 13px rgba(35,25,75,.04)}
.exam .qnum{background:#3b0e90!important}
.exam .option{border-radius:9px!important}
.exam .option:hover{background:#f6f2ff}
.exam .annotation-bar,.exam .annot-bar{background:#f4efff!important;border-bottom:1px solid #ded1f4!important}
.exam .annotation-btn,.exam .annot-btn{background:#fff!important;border-color:#d7c9ec!important;border-radius:9px!important;color:#3b2578!important;font-weight:800!important;padding:8px 11px!important}
.exam .annotation-btn:hover,.exam .annot-btn:hover,.exam .reading-bold-btn:hover{background:#e7dcff!important}
.exam .reading-bold-btn{background:#efe8ff!important;border-color:#bba6e3!important;color:#32136f!important}
.exam mark.user-highlight{background:#ffe789!important;color:inherit}
.exam .bottom{background:#fff!important;box-shadow:0 -4px 18px rgba(30,20,60,.05);z-index:3}
.exam .nq,.exam .nav button{border-radius:8px!important}
.exam .submit{background:#3b0e90!important;border-radius:10px!important;padding:11px 22px!important}
.overlay .result{border-radius:18px!important}
.overlay .score{color:#281260!important}
.exam .inline-review{background:#faf8ff!important;border:1px solid #ded3f3!important;border-left:4px solid #6e4db7!important;border-radius:12px!important;padding:14px;margin:11px 0}
.exam .inline-review .evidence,.exam .inline-review-evidence{background:#fff4cc;border-radius:9px;padding:9px;margin:8px 0}
.reading-test-guide{padding:12px 18px!important;background:#f4efff!important;border-bottom:1px solid #d7c6fc!important;color:#332256!important;font:600 12px/1.6 system-ui!important}
.reading-test-guide strong{color:#32106f!important}
.reading-test-selection{position:fixed;z-index:3000;background:#281260;color:#fff;border-radius:12px;box-shadow:0 12px 34px rgba(36,10,84,.3);padding:6px;display:flex;gap:6px}
.reading-test-selection[hidden]{display:none!important}
.reading-test-selection button{border:0;background:#fff;color:#32116e;font:bold 12px system-ui;padding:9px 12px;cursor:pointer;border-radius:8px}
.reading-test-selection button:hover{background:#e6dbff}
@media(max-width:780px){.exam .workspace{grid-template-columns:1fr;grid-template-rows:minmax(220px,44vh) minmax(220px,44vh);overflow:auto}.exam #passage,.exam .passage-pane{border-right:0;border-bottom:1px solid #e3e7ef}.reading-test-guide{font-size:11px!important;padding:10px!important}.exam .top,.exam .topbar{min-height:56px}}

.reading-test-guide{padding:10px 15px;background:#e9f0f9;border-bottom:1px solid #cbd9e8;color:#234158;font:600 12px/1.6 system-ui}
.reading-test-guide strong{color:#12334e}
.exam .note-anchor{background:#fff0b7!important;border-bottom:2px dotted #7b48cb!important;cursor:help}
.exam .notes-panel{background:#faf8ff;border:1px solid #ded3f3;border-radius:12px;padding:11px;margin:10px 0}
.exam .annotation-bar .annotation-tip,.exam .annot-tip{color:#56677a}
.exam .reading-bold-btn{background:#f5f9ff;border:1px solid #afc2d7;border-radius:6px;color:#19364f;padding:6px 9px;font-size:12px;font-weight:700;cursor:pointer}
.exam strong.user-bold{font-weight:850!important;text-decoration:none}
.exam #questionsCopy .inline-review{border-left:4px solid #5179a5;background:#f4f8ff;border-radius:9px;padding:11px;margin-top:12px}
.exam .evidence-pulse{background:#ffe66a!important;outline:3px solid #eebc30!important;box-shadow:0 0 0 5px #ffe36b66}
.exam .inline-review-btn,.exam .evidence-btn,.exam .inline-review-quote,.exam .inline-review .evidence{cursor:pointer}
.exam .timer{font-variant-numeric:tabular-nums}
`;
document.head.appendChild(style);
const exam=document.getElementById('exam');
if(exam){
 const guide=document.createElement('div');
 guide.className='reading-test-guide';
 guide.innerHTML='<strong>🧪 Reading Test · Hướng dẫn:</strong> Thời gian <b>đếm ngược 60 phút</b> · Bôi đen văn bản để <b>Highlight</b>, <b>Take note</b> hoặc <b>Bôi đậm</b> · Không có tra từ điển · Sau khi nộp bài, xem đáp án/giải thích dưới mỗi câu và nhấn trích dẫn để tô vàng vị trí trong Passage.';
 const tabs=exam.querySelector('.tabs');
 if(tabs)tabs.insertAdjacentElement('afterend',guide);
 else exam.prepend(guide);
}

// The quote itself is clickable, not just the separate evidence button.
document.addEventListener('click',event=>{
  const quote=event.target.closest('.inline-review-quote,.inline-review .evidence');
  if(!quote)return;
  if(typeof window.focusEvidence!=='function')return;
  const review=quote.closest('[data-inline-review],[data-review]');
  let n=review?Number(review.dataset.inlineReview||review.dataset.review):NaN;
  if(!Number.isInteger(n)){
    // Multi-answer group explanations store the target in a sibling button.
    const button=quote.closest('.inline-review')?.querySelector('[onclick*="focusEvidence"]');
    const match=button?.getAttribute('onclick')?.match(/focusEvidence\((\d+)\)/);
    n=match?Number(match[1]):NaN;
  }
  if(Number.isInteger(n)){
    try{window.focusEvidence(n);}catch(e){console.warn('Could not locate evidence',e);}
  }
});

// Offer the same contextual selection workflow as Practice, with test-only tools.
const selectionMenu=document.createElement('div');
selectionMenu.className='reading-test-selection';
selectionMenu.hidden=true;
selectionMenu.setAttribute('role','toolbar');
selectionMenu.setAttribute('aria-label','Công cụ chọn văn bản Reading Test');
selectionMenu.innerHTML='<button type="button" data-action="highlight">🖍 Highlight</button><button type="button" data-action="note">📝 Take note</button><button type="button" data-action="bold">𝐁 Bôi đậm</button>';
document.body.appendChild(selectionMenu);
let selectionZone=null;
function closeSelectionMenu(){selectionMenu.hidden=true;selectionZone=null}
selectionMenu.addEventListener('pointerdown',event=>event.preventDefault());
selectionMenu.addEventListener('click',event=>{
 const button=event.target.closest('button');
 if(!button||!selectionZone)return;
 const zone=selectionZone;
 closeSelectionMenu();
 if(button.dataset.action==='highlight'&&typeof window.addHighlight==='function')window.addHighlight(zone);
 if(button.dataset.action==='note'&&typeof window.addNote==='function')window.addNote(zone);
 if(button.dataset.action==='bold')window.boldReadingSelection(zone);
});
document.addEventListener('mouseup',event=>{
 if(event.target.closest('.reading-test-selection'))return;
 setTimeout(()=>{
  const selection=window.getSelection();
  if(typeof submitted!=='undefined'&&submitted){closeSelectionMenu();return}
  if(!selection||!selection.rangeCount||selection.isCollapsed||!selection.toString().trim()){closeSelectionMenu();return}
  const range=selection.getRangeAt(0);
  const root=range.commonAncestorContainer.nodeType===1?range.commonAncestorContainer:range.commonAncestorContainer.parentElement;
  const zone=root?.closest?.('#passageCopy,#questionsCopy')?.id==='passageCopy'?'passage':
    root?.closest?.('#questionsCopy')?'questions':null;
  if(!zone){closeSelectionMenu();return}
  const rect=range.getBoundingClientRect();
  selectionZone=zone;
  selectionMenu.hidden=false;
  selectionMenu.style.left=Math.max(12,Math.min(innerWidth-330,rect.left))+'px';
  selectionMenu.style.top=Math.max(12,rect.top>58?rect.top-52:rect.bottom+8)+'px';
 },35);
});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeSelectionMenu()});
document.addEventListener('pointerdown',event=>{
 if(!event.target.closest('.reading-test-selection')&&!event.target.closest('#passageCopy,#questionsCopy'))closeSelectionMenu();
});

// Re-insert Take note in both passage and question toolbars generated on navigation.
function installNoteButtons(){
  document.querySelectorAll('#exam .annotation-bar,#exam .annot-bar').forEach(bar=>{
    if(bar.querySelector('.reading-note-btn'))return;
    const highlight=bar.querySelector('button[onclick*="addHighlight"]');
    if(!highlight)return;
    const params=(highlight.getAttribute('onclick')||'').match(/addHighlight\('(passage|questions)'\)/);
    if(!params)return;
    const zone=params[1];
    const note=document.createElement('button');
    note.type='button';
    note.className=(highlight.classList.contains('annotation-btn')?'annotation-btn':'annot-btn')+' reading-note-btn';
    note.textContent='📝 Take note';
    note.addEventListener('click',()=>window.addNote(zone));
    highlight.insertAdjacentElement('afterend',note);
    // A notes drawer remains available, but normal reading only needs a hover.
    const drawer=document.createElement('button');
    drawer.type='button';
    drawer.className=(highlight.classList.contains('annotation-btn')?'annotation-btn':'annot-btn')+' reading-notes-list';
    drawer.textContent='Ghi chú';
    drawer.addEventListener('click',()=>window.toggleNotes(zone));
    note.insertAdjacentElement('afterend',drawer);
  });
}
const noteObserver=new MutationObserver(()=>installNoteButtons());
if(exam)noteObserver.observe(exam,{childList:true,subtree:true});
installNoteButtons();
const noteTooltip=document.createElement('div');
noteTooltip.className='reading-test-note-tooltip';
noteTooltip.hidden=true;
noteTooltip.style.cssText='position:fixed;z-index:4000;max-width:min(330px,calc(100vw - 24px));border-radius:13px;padding:12px 15px;background:#281260;color:white;box-shadow:0 12px 34px #160a3955;white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.6 system-ui;pointer-events:none';
noteTooltip.setAttribute('role','tooltip');
document.body.appendChild(noteTooltip);
let hoveredNote=null;
function noteValue(el){
  const inline=el.dataset.note;
  if(inline)return inline;
  const id=el.dataset.noteId;
  const zone=el.closest('#passageCopy')?'passage':'questions';
  if(id&&typeof window.loadNotes==='function'){
    try{return window.loadNotes(zone).find(n=>n.id===id)?.text||'';}catch(e){}
  }
  return '';
}
function updateTooltipPosition(el){
 const r=el.getBoundingClientRect(),w=noteTooltip.offsetWidth,h=noteTooltip.offsetHeight;
 noteTooltip.style.left=Math.max(12,Math.min(innerWidth-w-12,r.left))+'px';
 noteTooltip.style.top=Math.max(12,r.top>h+18?r.top-h-10:Math.min(innerHeight-h-12,r.bottom+10))+'px';
}
document.addEventListener('pointerover',event=>{
 const el=event.target.closest?.('#exam .note-anchor');
 if(!el||el===hoveredNote)return;
 const value=noteValue(el);if(!value)return;
 hoveredNote=el;noteTooltip.textContent='📝 Ghi chú\n'+value;noteTooltip.hidden=false;updateTooltipPosition(el);
});
document.addEventListener('pointerout',event=>{
 if(hoveredNote&&event.target.closest?.('.note-anchor')===hoveredNote&&!hoveredNote.contains(event.relatedTarget)){
   hoveredNote=null;noteTooltip.hidden=true;
 }
});
document.addEventListener('touchstart',event=>{
 const el=event.target.closest?.('#exam .note-anchor');
 if(!el){hoveredNote=null;noteTooltip.hidden=true;return}
 const value=noteValue(el);if(!value)return;
 hoveredNote=el;noteTooltip.textContent='📝 Ghi chú\n'+value;noteTooltip.hidden=false;updateTooltipPosition(el);
},{passive:true});

window.boldReadingSelection=function(zone){
 if(typeof submitted!=='undefined'&&submitted)return;
 let range=null;
 try {
   if(typeof getUsableSelection==='function')range=getUsableSelection(zone);
   else if(typeof getSel==='function')range=getSel(zone);
   else{
     const selection=window.getSelection();
     if(selection&&!selection.isCollapsed&&selection.rangeCount)range=selection.getRangeAt(0).cloneRange();
   }
   const root=typeof zoneRoot==='function'?zoneRoot(zone):document.getElementById(zone==='passage'?'passageCopy':'questionsCopy');
   if(!range||!root||!root.contains(range.commonAncestorContainer)||!range.toString().trim())return;
   const strong=document.createElement('strong');
   strong.className='user-bold';
   strong.appendChild(range.extractContents());
   range.insertNode(strong);
   if(typeof saveZoneMarkup==='function')saveZoneMarkup(zone);
   else if(typeof saveMarkup==='function')saveMarkup(zone);
   const selection=window.getSelection();
   if(selection)selection.removeAllRanges();
 } catch(e){alert('Không thể bôi đậm đoạn này. Hãy chọn một đoạn ngắn hơn.');}
};
})();
