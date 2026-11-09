/* IELTS Reading Test: consistent exam-only annotation controls.
   Dictionary and notes are intentionally unavailable during timed tests. */
(function(){
'use strict';
document.documentElement.dataset.readingUxApplied='test';
const style=document.createElement('style');
style.textContent=`
:root{--test-navy:#17344f}
.reading-test-guide{padding:10px 15px;background:#e9f0f9;border-bottom:1px solid #cbd9e8;color:#234158;font:600 12px/1.6 system-ui}
.reading-test-guide strong{color:#12334e}
.exam .notes-panel,.exam .note-anchor{background:transparent!important;border-bottom:0!important;pointer-events:none}
.exam .notes-panel{display:none!important}
.exam .annotation-bar [onclick*="addNote("],.exam .annotation-bar [onclick*="toggleNotes("],.exam .annot-bar [onclick*="addNote("],.exam .annot-bar [onclick*="toggleNotes("]{display:none!important}
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
 guide.innerHTML='<strong>🧪 Reading Test · Hướng dẫn:</strong> Thời gian <b>đếm ngược 60 phút</b> · Bôi đen văn bản để <b>Highlight</b> hoặc <b>Bôi đậm</b> · Không có tra từ điển và Take note · Sau khi nộp bài, xem đáp án/giải thích dưới mỗi câu và nhấn trích dẫn để tô vàng vị trí trong Passage.';
 const tabs=exam.querySelector('.tabs');
 if(tabs)tabs.insertAdjacentElement('afterend',guide);
 else exam.prepend(guide);
}

// The quote itself is clickable, not just the separate evidence button.
document.addEventListener('click',event=>{
  const quote=event.target.closest('.inline-review-quote,.inline-review .evidence');
  if(!quote)return;
  const review=quote.closest('[data-inline-review],[data-review]');
  if(!review||typeof window.focusEvidence!=='function')return;
  const n=Number(review.dataset.inlineReview||review.dataset.review);
  if(Number.isInteger(n)){
    try{window.focusEvidence(n);}catch(e){console.warn('Could not locate evidence',e);}
  }
});

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
