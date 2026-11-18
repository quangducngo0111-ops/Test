/* Smartcom Writing Assistant: live word count and on-demand proofreading.
   External proofreading requests are made only after a learner clicks Check. */
(()=>{'use strict';
if(window.__scWritingAssistantReady)return;window.__scWritingAssistantReady=true;
const wordCount=s=>(String(s||'').match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)||[]).length;
const safe=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const known={respectivly:'respectively',respecitvly:'respectively',respectiveley:'respectively',significanly:'significantly',signifcantly:'significantly',aproximately:'approximately',approximatly:'approximately',comparision:'comparison',comparisions:'comparisons',percantage:'percentage',percenatge:'percentage',proprotion:'proportion',propotion:'proportion',consuption:'consumption',consumpsion:'consumption',decreasd:'decreased',increasd:'increased',fluctutation:'fluctuation',fluctuacted:'fluctuated',enviroment:'environment',goverment:'government',developement:'development',seperately:'separately',occured:'occurred',occurence:'occurrence',becuase:'because',thier:'their',teh:'the',wich:'which',recieve:'receive',diferent:'different',diffrent:'different',sustanable:'sustainable',sustainble:'sustainable',majoritiy:'majority',reserch:'research',becameing:'becoming'};
const localRules=[
{pattern:/\b(?:a)\s+(?=[aeiou][a-z]+)/gi, replacement:'an ',message:'Kiểm tra mạo từ “a/an” trước nguyên âm (có ngoại lệ theo cách phát âm).',type:'grammar'},
{pattern:/\b(?:an)\s+(?=[bcdfghjklmnpqrstvwxyz][a-z]+)/gi,replacement:'a ',message:'Kiểm tra mạo từ “a/an” trước phụ âm (có ngoại lệ theo cách phát âm).',type:'grammar'},
{pattern:/\b(?:informations|advices|equipments|researches)\b/gi,replacement:'',message:'Danh từ không đếm được: cần xem lại dạng số nhiều hoặc ngữ cảnh.',type:'grammar'},
{pattern:/\b(?:more better|more worse|most highest|most lowest)\b/gi,replacement:'',message:'Không dùng hai dạng so sánh cùng lúc.',type:'grammar'},
{pattern:/\b(?:didn't|did not)\s+\w+ed\b/gi,replacement:'',message:'Sau “did not”, động từ thường dùng dạng nguyên mẫu.',type:'grammar'},
{pattern:/\b(?:was|were)\s+(?:rose|fell|increased|decreased)\b/gi,replacement:'',message:'Kiểm tra động từ xu hướng: không kết hợp “was/were” với dạng quá khứ đơn.',type:'grammar'},
{pattern:/\b(?:the number of)\s+\w+(?:\s+\w+){0,3}\s+(?:were|are)\b/gi,replacement:'',message:'“The number of” thường đi với động từ số ít.',type:'grammar'},
{pattern:/\s+,/g,replacement:',',message:'Không đặt khoảng trắng trước dấu phẩy.',type:'punctuation'},
{pattern:/\s+\./g,replacement:'.',message:'Không đặt khoảng trắng trước dấu chấm.',type:'punctuation'},
{pattern:/ {2,}/g,replacement:' ',message:'Thừa khoảng trắng.',type:'punctuation'}
];
function localCheck(text){
let issues=[],m;
for(const match of text.matchAll(/\b[A-Za-z]+(?:['’-][A-Za-z]+)*\b/g)){const key=match[0].toLowerCase(),correct=known[key];if(correct){const fixed=match[0][0]===match[0][0].toUpperCase()?correct[0].toUpperCase()+correct.slice(1):correct;issues.push({offset:match.index,length:match[0].length,message:'Có thể sai chính tả.',suggestions:[fixed],type:'spelling',source:'local'})}}
for(const rule of localRules){for(const match of text.matchAll(rule.pattern)){issues.push({offset:match.index,length:match[0].length,message:rule.message,suggestions:rule.replacement?[rule.replacement.trimEnd()]:[],type:rule.type,source:'local'})}}
return issues;
}
function renderIssues(target,issues,mode){
const holder=target._scWritingFeedback;if(!holder)return;
holder.hidden=false;
if(!issues.length){holder.innerHTML='<p class="sc-wa-status">✓ '+(mode==='full'?'Chưa phát hiện lỗi trong lần kiểm tra này. Đây không phải đánh giá IELTS toàn diện.':'Chưa phát hiện lỗi trong bộ quy tắc tại chỗ; chưa kiểm tra ngữ pháp toàn diện.')+'</p>';return}
holder.innerHTML='<div class="sc-wa-result-heading"><strong>Phát hiện '+issues.length+' điểm cần xem lại</strong><small>'+(mode==='full'?'Gợi ý từ LanguageTool và quy tắc tại chỗ':'Chỉ kiểm tra tại chỗ; kết quả chưa đầy đủ')+'</small></div>'+issues.slice(0,40).map((x,i)=>{const before=target.value.slice(Math.max(0,x.offset-38),x.offset),original=target.value.slice(x.offset,x.offset+x.length),after=target.value.slice(x.offset+x.length,x.offset+x.length+38);return '<div class="sc-wa-issue"><span class="sc-wa-type '+safe(x.type)+'">'+(x.type==='spelling'?'Chính tả':x.type==='grammar'?'Ngữ pháp':'Dấu câu / Cách viết')+'</span><div class="sc-wa-context">'+safe(before)+'<mark>'+safe(original)+'</mark>'+safe(after)+'</div><p>'+safe(x.message)+'</p>'+(x.suggestions.length?'<div class="sc-wa-suggestions">Gợi ý: '+x.suggestions.slice(0,4).map((v,j)=>'<button type="button" class="sc-wa-suggestion" data-issue="'+i+'" data-rep="'+j+'">'+safe(v)+'</button>').join('')+'</div>':'')+'</div>'}).join('');
holder._scIssues=issues.slice(0,40);holder.querySelectorAll('[data-issue]').forEach(b=>b.onclick=()=>{const item=holder._scIssues[Number(b.dataset.issue)],replacement=item.suggestions[Number(b.dataset.rep)];if(replacement===undefined)return;if(target.value.slice(item.offset,item.offset+item.length)!==item.fragment){holder.innerHTML='<p>Văn bản đã thay đổi, hãy kiểm tra lại để có vị trí lỗi mới.</p>';return}target.focus();target.setRangeText(replacement,item.offset,item.offset+item.length,'end');target.dispatchEvent(new Event('input',{bubbles:true}));holder.innerHTML='<p>Đã áp dụng gợi ý. Nhấn kiểm tra lại để cập nhật danh sách lỗi.</p>'});
}
async function proofread(target,button){
const text=target.value.trim(),holder=target._scWritingFeedback;if(!text){holder.hidden=false;holder.textContent='Hãy nhập đoạn văn trước khi kiểm tra.';return}
const local=localCheck(target.value);for(const issue of local)issue.fragment=target.value.slice(issue.offset,issue.offset+issue.length);
button.disabled=true;button.textContent='Đang kiểm tra…';holder.hidden=false;holder.textContent='Đang kiểm tra chính tả và ngữ pháp tiếng Anh…';
try{
const body=new URLSearchParams({text:target.value,language:'en-GB',enabledOnly:'false'});
const control=new AbortController();const cutoff=setTimeout(()=>control.abort(),14000);
let response;
try{response=await fetch('https://api.languagetool.org/v2/check',{method:'POST',body,signal:control.signal})}finally{clearTimeout(cutoff)}
if(!response.ok)throw Error('Dịch vụ trả về HTTP '+response.status);
const data=await response.json();if(!Array.isArray(data.matches))throw Error('Định dạng phản hồi không hợp lệ');
const issues=data.matches.map(x=>({offset:x.offset,length:x.length,message:x.message||x.shortMessage||'Kiểm tra cách viết',suggestions:(x.replacements||[]).slice(0,4).map(r=>r.value),type:x.rule?.issueType==='misspelling'?'spelling':x.rule?.category?.id==='TYPOS'?'spelling':x.rule?.category?.id==='PUNCTUATION'?'punctuation':'grammar',source:'LanguageTool'}));
for(const x of local){if(!issues.some(y=>Math.abs(y.offset-x.offset)<2&&y.length===x.length))issues.push(x)}
issues.sort((a,b)=>a.offset-b.offset);for(const x of issues)x.fragment=target.value.slice(x.offset,x.offset+x.length);
renderIssues(target,issues,'full');
}catch(e){renderIssues(target,local,'local');const p=document.createElement('p');p.className='sc-wa-warning';p.textContent='Không kết nối được dịch vụ kiểm tra ngữ pháp ('+e.message+'). Chỉ hiển thị lỗi phát hiện tại chỗ và gạch chân chính tả của trình duyệt.';holder.prepend(p)}
finally{button.disabled=false;button.textContent='Kiểm tra chính tả & ngữ pháp'}
}
function setup(target){
if(target.dataset.scWaAttached||target.disabled||target.readOnly||target.closest('#sc-quick-shell'))return;
target.dataset.scWaAttached='1';target.setAttribute('spellcheck','true');target.setAttribute('lang','en-GB');
const toolbar=document.createElement('div');toolbar.className='sc-wa-toolbar';
const count=document.createElement('span');count.className='sc-wa-count';count.setAttribute('aria-live','off');
const action=document.createElement('button');action.type='button';action.className='sc-wa-check';action.textContent='Kiểm tra chính tả & ngữ pháp';
const complete=document.createElement('button');complete.type='button';complete.className='sc-wa-check';complete.textContent='Lưu bài vào lịch sử';toolbar.append(count,action,complete);
const disclosure=document.createElement('small');disclosure.className='sc-wa-disclosure';disclosure.textContent='Khi bấm kiểm tra, nội dung được gửi đến LanguageTool để gợi ý sửa. Không tự động gửi khi đang gõ.';
const feedback=document.createElement('div');feedback.className='sc-wa-feedback';feedback.hidden=true;target._scWritingFeedback=feedback;
const existingCount=target.id==='writing'?document.getElementById('wordCount'):target.id==='essay'?document.getElementById('wordcount'):null;
if(existingCount)existingCount.hidden=true;
target.insertAdjacentElement('afterend',toolbar);toolbar.insertAdjacentElement('afterend',disclosure);disclosure.insertAdjacentElement('afterend',feedback);
const update=()=>{const n=wordCount(target.value);count.textContent='Số từ: '+n;count.dataset.words=String(n)};
let draftTimer;
const record=(finished=false)=>{const h=window.SmartcomHistory;if(!h||!target.value.trim())return;const payload={attemptId:finished?undefined:'draft-'+location.pathname+'-'+(target.id||'writing'),kind:'Practice',skill:'Writing',title:document.title,exerciseId:location.pathname,path:location.pathname,text:target.value,wordCount:wordCount(target.value),field:target.id||'writing'};finished?h.submit(payload):h.draft(payload)};
target.addEventListener('input',()=>{update();clearTimeout(draftTimer);draftTimer=setTimeout(()=>record(false),900);if(!feedback.hidden){feedback.hidden=true;feedback.textContent=''}});
complete.addEventListener('click',()=>{if(!target.value.trim()){alert('Hãy viết bài trước khi lưu vào lịch sử.');return}record(true);complete.textContent='✓ Đã lưu vào lịch sử';setTimeout(()=>complete.textContent='Lưu bài vào lịch sử',2400)});

action.addEventListener('click',()=>proofread(target,action));update();
}
function scan(root=document){if(root.nodeType!==1&&root.nodeType!==9)return;if(root.matches?.('textarea'))setup(root);root.querySelectorAll?.('textarea').forEach(setup);root.querySelectorAll?.('#review').forEach(b=>{if(b.dataset.scWaReplaced)return;b.dataset.scWaReplaced='1';b.textContent='Kiểm tra chính tả & ngữ pháp';b.addEventListener('click',e=>{const box=document.getElementById('writing');if(!box)return;e.preventDefault();e.stopImmediatePropagation();proofread(box,b)},true)})}
function init(){scan();const observer=new MutationObserver(records=>{for(const m of records){for(const n of m.addedNodes){if(n.nodeType===1&&!n.closest?.('.sc-wa-toolbar,.sc-wa-feedback'))scan(n)}}});observer.observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();