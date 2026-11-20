/* Smartcom Writing Proofreader, shared by Writing Task 1/2 exercises.
   Adds a separate optional language review without changing lesson grading. */
(()=>{
'use strict';
if(window.SmartcomWritingProofreader)return;
window.SmartcomWritingProofreader=true;
const css=document.createElement('style');
css.textContent='.sc-proof-controls{margin:10px 0 16px;display:flex;flex-wrap:wrap;gap:8px}.sc-proof-btn{background:#fff;border:1px solid #3b0e90;border-radius:9px;color:#3b0e90;font-weight:750;font-size:13px;padding:9px 12px;cursor:pointer}.sc-proof-btn:disabled{opacity:.6;cursor:wait}.sc-proof-result{background:#f8fbff;border:1px solid #cfe0f4;padding:12px;border-radius:12px;max-width:100%;font:13px/1.5 system-ui,Arial,sans-serif;color:#23364f;white-space:normal}.sc-proof-result[hidden]{display:none!important}.sc-proof-result h4{margin:0 0 8px;font-size:15px;color:#1d4d81}.sc-proof-item{padding:10px;margin:9px 0;border:1px solid #dfe8f1;border-radius:9px;background:#fff}.sc-proof-item p{margin:6px 0}.sc-proof-item del{color:#a43c47;background:#fff1f1;padding:2px 4px}.sc-proof-item strong{color:#236346}.sc-proof-apply{display:block;margin-top:7px;border:1px solid #267951;background:#eefaf3;border-radius:7px;padding:6px 9px;cursor:pointer;color:#235840}.sc-proof-small{font-size:11px;color:#64748b;margin-top:6px}';
document.head.append(css);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function inspect(text){
const findings=[],push=(m,fix,message,kind='Ngữ pháp')=>{if(m&&fix!==m[0])findings.push({start:m.index,end:m.index+m[0].length,original:m[0],fix,message,kind,origin:'local'})};
const rules=[

 [/\b(the\s+(?:proportion|percentage|share|figure|rate|number|amount)\s+of\b[^.!?;,]{0,95}?)\s+(were|are|have)\b/gi,
  m=>m[1]+' '+({were:'was',are:'is',have:'has'})[m[2].toLowerCase()],
  'The proportion/percentage/share/figure/rate/number/amount là chủ ngữ số ít, kể cả khi danh từ sau “of” ở số nhiều.'],
 [/\b(the\s+(?:figures|percentages|proportions|shares|rates|numbers)\b[^.!?;,]{0,70}?)\s+(was|is)\b/gi,
  m=>m[1]+' '+(m[2].toLowerCase()==='was'?'were':'are'),
  'Chủ ngữ chính ở số nhiều nên dùng were/are.'],
 [/\b(\d+(?:\.\d+)?\s*%[,]?\s+which)\s+were\b/gi,
  m=>m[1]+' was',
  'Nếu which đề cập đến một tỷ lệ đơn lẻ vừa nêu, động từ phải là was. Nếu tham chiếu nhiều đối tượng, cần làm rõ chủ ngữ.'],
 [/(\b(?:two|three|four|five|six)\s+(?:pie|bar|line)\s+)chart\b/gi,m=>m[1]+'charts','Danh từ đứng sau số đếm cần ở dạng số nhiều.'],
 [/\b(pie|bar|line)\s+charts\s+illustrates\b/gi,m=>m[1]+' charts illustrate','Chủ ngữ số nhiều charts đi với illustrate.'],
 [/\b(chart)\s+illustrate\b/gi,m=>'chart illustrates','Chủ ngữ số ít chart đi với illustrates.'],
 [/\bof\s+inhabitant\b/gi,m=>'of inhabitants','Inhabitant là danh từ đếm được; cần dạng số nhiều hoặc diễn đạt bằng residents.'],
 [/\bmeans\s+of\s+transportation\s+of\s+inhabitant\b/gi,m=>'modes of transport used by residents','Cách diễn đạt tự nhiên hơn và đúng số nhiều.'],
 [/\bcity\s+[a-z]\b/gi,m=>m[0].replace(/[a-z]$/i,c=>c.toUpperCase()),'Ký hiệu thành phố cần viết hoa (City A, City B, City C).','Viết hoa'],
 [/\b(informations|equipments|advices)\b/gi,m=>({informations:'information',equipments:'equipment',advices:'advice'})[m[0].toLowerCase()],'Danh từ này thường không đếm được.'],
 [/\b(he|she|it)\s+(go|have|do)\b/gi,m=>m[1]+' '+({go:'goes',have:'has',do:'does'})[m[2].toLowerCase()],'Hòa hợp chủ ngữ và động từ ở thì hiện tại đơn.']
 ];
for(const [regex,fix,message,kind] of rules){for(const m of text.matchAll(regex))push(m,fix(m),message,kind||'Ngữ pháp')}
return findings;
}
function remoteIssues(json,text){
return (json.matches||[]).filter(m=>Number.isInteger(m.offset)&&Number.isInteger(m.length)&&m.offset>=0&&m.offset+m.length<=text.length).map(m=>({
 start:m.offset,end:m.offset+m.length,original:text.slice(m.offset,m.offset+m.length),
 fix:m.replacements?.[0]?.value||'',message:m.message||'Cần kiểm tra lại.',kind:m.rule?.category?.name||'Ngữ pháp',
 origin:'remote'}));
}
function merge(local,remote){
const out=[];for(const issue of [...remote,...local]){if(out.some(x=>x.start<issue.end&&issue.start<x.end))continue;out.push(issue)}
return out.sort((a,b)=>a.start-b.start);
}
function draw(host,textarea,issues,status){
host.hidden=false;
let html='<h4>'+issues.length+' điểm cần xem lại</h4>';
if(!issues.length)html+='<p>Chưa phát hiện lỗi theo các quy tắc khả dụng; điều này không đảm bảo bài viết hoàn toàn chính xác.</p>';
else html+=issues.map((issue,i)=>'<div class="sc-proof-item"><small>'+esc(issue.kind)+'</small><p>'+(issue.original?'<del>'+esc(issue.original)+'</del> ':'')+esc(issue.message)+'</p>'+(issue.fix?'<p>Gợi ý: <strong>'+esc(issue.fix)+'</strong></p><button type="button" class="sc-proof-apply" data-sc-apply="'+i+'">Áp dụng sửa này</button>':'')+'</div>').join('');
html+='<p class="sc-proof-small">'+esc(status)+' · Đây không phải đánh giá band IELTS.</p>';host.innerHTML=html;
host.querySelectorAll('[data-sc-apply]').forEach(button=>button.onclick=()=>{
const issue=issues[Number(button.dataset.scApply)],value=textarea.value;
if(value.slice(issue.start,issue.end)!==issue.original){host.textContent='Bài đã thay đổi. Vui lòng kiểm tra lại.';return}
textarea.value=value.slice(0,issue.start)+issue.fix+value.slice(issue.end);
textarea.dispatchEvent(new Event('input',{bubbles:true}));
host.textContent='Đã áp dụng thay đổi. Bấm kiểm tra lại để cập nhật nhận xét.';
});
}
async function check(textarea,button,host){
const initial=textarea.value;
if(!initial.trim()){draw(host,textarea,[], 'Hãy viết nội dung trước khi kiểm tra');return}
const originalLabel=button.textContent;const local=inspect(initial);draw(host,textarea,local,'Đang kiểm tra mở rộng…');button.disabled=true;button.textContent='Đang kiểm tra…';
let issues=local,status='Kiểm tra nội bộ (ngoại tuyến)';
try{
const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
try{const params=new URLSearchParams({text:initial,language:'en-GB'});
const response=await fetch('https://api.languagetool.org/v2/check',{method:'POST',body:params,signal:controller.signal});
if(!response.ok)throw Error('HTTP '+response.status);
issues=merge(local,remoteIssues(await response.json(),initial));status='Đã kiểm tra mở rộng với LanguageTool';}
finally{clearTimeout(timer)}
}catch(e){status='Không kết nối được dịch vụ mở rộng; sử dụng kiểm tra nội bộ';}
button.disabled=false;button.textContent=originalLabel;
if(textarea.value!==initial){host.textContent='Nội dung đã thay đổi trong lúc kiểm tra. Hãy kiểm tra lại.';return}
draw(host,textarea,issues,status);
}
function attach(){
document.querySelectorAll('textarea').forEach(area=>{
if(area.dataset.scProofAttached)return;
if(area.readOnly||area.disabled||area.closest('[hidden]'))return;
if(area.id==='analysisNotes'||area.id==='studentName'||area.closest('.pie-note'))return;
if(area.id==='writing'&&document.body.dataset.pieSlug)return; // Pie has enhanced native review.
area.dataset.scProofAttached='1';
const result=document.createElement('div');result.className='sc-proof-result';result.hidden=true;
const nearbyReview=area.id==='writing'?document.getElementById('review'):null;
const exerciseCheck=document.getElementById('checkWrite')||document.getElementById('checkBtn');
if(exerciseCheck && !nearbyReview){
 // Dynamic and Process have their own grading; append advice to that workflow, no second check button.
 area.insertAdjacentElement('afterend',result);
 exerciseCheck.addEventListener('click',()=>{
  if(!area.isConnected||!area.offsetParent||!area.value.trim())return;
  check(area,exerciseCheck,result);
 });
 return;
}
if(nearbyReview){
 // Reuse the existing button instead of creating another one.
 // Capture before the legacy inline handler, preserving the writing draft and controls.
 nearbyReview.addEventListener('click',event=>{
  event.preventDefault();event.stopImmediatePropagation();
  check(area,nearbyReview,result);
 },true);
 area.insertAdjacentElement('afterend',result);
 return;
}
const wrap=document.createElement('div');wrap.className='sc-proof-controls';
const button=document.createElement('button');button.type='button';button.className='sc-proof-btn';button.textContent='Kiểm tra chính tả & ngữ pháp';
wrap.append(button);area.insertAdjacentElement('afterend',wrap);wrap.insertAdjacentElement('afterend',result);
button.onclick=()=>check(area,button,result);
});
}
let queued=false;const observer=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;attach()})});
observer.observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();
})();
