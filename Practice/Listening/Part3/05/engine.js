(()=>{'use strict';
const $=id=>document.getElementById(id),e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=Number(document.body.dataset.part),folder=document.body.dataset.folder;
const FIRST=21, LAST=30;
let D={},answers={},done=false,student={},started=Date.now(),seconds=0,clock,segmentEnd=null,hasAudio=false;
const store='SMARTCOM_SUSTAINABLE_FASHION_P3_'+folder,normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function field(n,placeholder='Điền từ'){return '<input class="cam-gap" id="q'+n+'" data-answer="'+n+'" autocomplete="off" spellcheck="false" placeholder="'+placeholder+'" aria-label="Câu '+n+'" value="'+e(answers[n]||'')+'">'}
function withGap(n,txt){const safe=e(txt);return /[.…·_]{2,}/.test(safe)?safe.replace(/[.…·_]{2,}/,field(n)):safe+' '+field(n)}
function row(n,txt){return '<tr id="row'+n+'"><td class="rownum">'+n+'</td><td>'+withGap(n,txt)+'</td></tr>'}
function group(start,end,inst,title,html){return '<section class="cam-group"><div class="cam-group-title"><h3>Questions '+start+'–'+end+'</h3><span class="cam-sub">'+e(title||'')+'</span></div><p class="cam-instruction">'+e(inst)+'</p>'+html+'</section>'}
function table(head,body){return '<table class="cam-table"><thead><tr>'+head.map(x=>'<th>'+e(x)+'</th>').join('')+'</tr></thead><tbody>'+body+'</tbody></table>'}
function opt(n,question,options){return '<div id="row'+n+'" class="cam-question"><div class="cam-qhead"><span class="cam-qnumber">'+n+'</span><span>'+e(question)+'</span></div><div class="cam-choice">'+options.map(([k,label])=>'<label><input type="radio" name="a'+n+'" data-answer="'+n+'" value="'+k+'"'+(answers[n]===k?' checked':'')+'><span><b>'+k+'</b> '+e(label)+'</span></label>').join('')+'</div></div>'}
function questionBlock(nums,raw){const lines=raw.split('\n'),items=[];for(const n of nums){let i=lines.findIndex(x=>new RegExp('^\\s*'+n+'\\s+').test(x));if(i<0){items.push(opt(n,'Question '+n,[['A','A'],['B','B'],['C','C']]));continue}const q=lines[i].replace(new RegExp('^\\s*'+n+'\\s+'),'').trim();let options=[];for(let j=i+1;j<lines.length;j++){let x=lines[j].trim();if(/^\d{1,2}\s+/.test(x))break;let m=x.match(/^([A-C])\s+(.+)$/);if(m)options.push([m[1],m[2]]);else if(options.length&&x&&!/^Questions?/.test(x))options[options.length-1][1]+=' '+x;}items.push(opt(n,q,options.length?options:[['A','A'],['B','B'],['C','C']]))}return items.join('')}
function letter(n,desc,options){return '<tr id="row'+n+'" class="cam-matching-row"><td class="rownum">'+n+'</td><td><div class="cam-matching-answer"><span>'+e(desc)+'</span><select id="q'+n+'" data-answer="'+n+'" class="cam-gap" aria-label="Chọn đáp án câu '+n+'"><option value="">Chọn</option>'+options.map(a=>'<option value="'+a+'"'+(answers[n]===a?' selected':'')+'>'+a+'</option>').join('')+'</select></div></td></tr>'}
function choicePair(start,description,choices){
 const next=start+1;
 const current=new Set([answers[start],answers[next]].filter(Boolean));
 return '<div class="cam-pair-group" id="pair'+start+'" role="group" aria-label="Questions '+start+' and '+next+'">'+
 '<h4>Questions '+start+' and '+next+'</h4>'+
 '<p class="cam-instruction"><em>Choose TWO letters, A–E.</em></p>'+
 '<p class="cam-pair-prompt">'+e(description)+'</p>'+
 '<div class="cam-pair-options">'+choices.map(([letter,label])=>
  '<label class="cam-pair-option"><input type="checkbox" class="cam-pair-checkbox" data-pair="'+start+'" value="'+letter+'"'+(current.has(letter)?' checked':'')+'><span class="cam-pair-letter">'+letter+'</span><span>'+e(label)+'</span></label>'
 ).join('')+'</div>'+
 '<p class="cam-pair-hint" id="pairHint'+start+'">Chọn tối đa 2 đáp án</p>'+
 '</div>';
}
function syncPair(start,changed){
 const root=$('pair'+start);if(!root)return;
 const boxes=[...root.querySelectorAll('.cam-pair-checkbox')];
 let chosen=boxes.filter(x=>x.checked);
 if(chosen.length>2){if(changed)changed.checked=false;chosen=boxes.filter(x=>x.checked)}
 answers[start]=chosen[0]?.value||'';
 answers[start+1]=chosen[1]?.value||'';
 const hint=$('pairHint'+start);
 if(hint)hint.textContent=chosen.length+'/2 đáp án đã chọn';
 localStorage.setItem(store+'_answers',JSON.stringify(answers));
 updateProgress();
}
function renderQuestions(){
 const ethics=[['A','Their definitions keep changing.'],['B','People think they mean the same thing.'],['C',"The term 'eco-friendly' is preferable."],['D','They are often used imprecisely.'],['E','Companies should avoid using them on clothing labels.']];
 const wool=[['A','Sheep are generally well-treated.'],['B','Wool is easy to recycle.'],['C','Wool is a long-lasting fabric.'],['D','Wool production involves few chemicals.'],['E','Sheep do less environmental damage than other livestock.']];
 const choices=[['A','The production process is fuel efficient.'],['B','It is the least sustainable of alternative fabrics.'],['C','Production costs are high.'],['D','It provides additional health benefits.'],['E','It is not durable in the long-term.'],['F','It needs to be produced in a certain way to be sustainable.'],['G','Chemicals required for production can be reused.'],['H','This is from a wholly sustainable source.']];
 const fabrics=['Lyocell','Cupro','Bamboo','EcoVero','Cork','Hemp'];
 let html=choicePair(21,"Which TWO points do the speakers make about the terms 'ethical' and 'sustainable' fashion?",ethics);
 html+=choicePair(23,'Which TWO claims about wool production do the speakers disagree with?',wool);
 html+=group(25,30,'Choose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.','Semi-synthetic fabrics','<div class="cam-note"><h4>Comments</h4><div class="cam-comments-grid">'+choices.map(([k,t])=>'<p><b>'+k+'</b> '+e(t)+'</p>').join('')+'</div><h4>Semi-synthetic fabrics</h4>'+fabrics.map((t,i)=>'<div class="cam-fabric-row">'+letter(i+25,t,choices.map(x=>x[0]))+'</div>').join('')+'</div>');
 $('questionsRoot').innerHTML=html;
 $('nav').innerHTML=Array.from({length:10},(_,i)=>{const n=21+i;return '<button id="nav'+n+'" type="button" data-nav="'+n+'">'+n+'</button>'}).join('')+'<button class="nav-submit" id="footerSubmit">Nộp bài</button>';
 $('footerSubmit').addEventListener('click',submit);
}
function formatAudio(seconds){const n=Math.max(0,Math.floor(Number(seconds)||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')}
function syncAudioControls(){
 const player=$('player'),duration=Number.isFinite(player.duration)?player.duration:0;
 $('audioPlay').textContent=player.paused?'▶ Phát':'Ⅱ Tạm dừng';
 $('audioTime').textContent=formatAudio(player.currentTime)+' / '+formatAudio(duration);
 $('audioSeek').value=duration?Math.min(100,100*player.currentTime/duration):0;
 $('audioSpeed').value=String(player.playbackRate);
}
function initAudio(){
 const audioUpload=document.getElementById('audioLocal');
 if(audioUpload)audioUpload.addEventListener('change',()=>{
  const file=audioUpload.files?.[0];if(!file)return;
  if(window.__localAudioUrl)URL.revokeObjectURL(window.__localAudioUrl);
  window.__localAudioUrl=URL.createObjectURL(file);
  $('player').src=window.__localAudioUrl;
  $('player').load();$('audioStatus').textContent='Đã tải audio từ thiết bị: '+file.name;
 });

 const player=$('player');
 player.src=D.audio;
 player.playbackRate=1;
 const sync=()=>syncAudioControls();
 player.addEventListener('loadedmetadata',()=>{hasAudio=true;$('audioStatus').textContent='Sẵn sàng luyện nghe';sync()});
 player.addEventListener('canplay',()=>{hasAudio=true;$('audioStatus').textContent='Sẵn sàng luyện nghe'});
 player.addEventListener('error',()=>{hasAudio=false;$('audioStatus').textContent='Chưa thể phát bản nghe này. Vui lòng thử lại sau.';sync()});
 player.addEventListener('timeupdate',()=>{if(segmentEnd!==null&&player.currentTime>=segmentEnd){player.pause();segmentEnd=null}sync()});
 player.addEventListener('play',sync);
 player.addEventListener('pause',sync);
 player.addEventListener('durationchange',sync);
 $('audioPlay').addEventListener('click',()=>{segmentEnd=null;if(player.paused)player.play().catch(()=>{$('audioStatus').textContent='Không thể phát audio hiện tại.'});else player.pause()});
 $('audioBack').addEventListener('click',()=>{if(!Number.isFinite(player.duration))return;segmentEnd=null;player.currentTime=Math.max(0,player.currentTime-10);sync()});
 $('audioForward').addEventListener('click',()=>{if(!Number.isFinite(player.duration))return;segmentEnd=null;player.currentTime=Math.min(player.duration,player.currentTime+10);sync()});
 $('audioSeek').addEventListener('input',v=>{if(!Number.isFinite(player.duration))return;segmentEnd=null;player.currentTime=Number(v.target.value)*player.duration/100;sync()});
 $('audioSpeed').addEventListener('change',v=>{player.playbackRate=Number(v.target.value)||1;sync()});
 sync();
}
function updateProgress(){let n=0;for(let i=FIRST;i<=LAST;i++){let answer=answers[i];const filled=Boolean(String(answer||'').trim());$('nav'+i)?.classList.toggle('is-answered',filled);if(filled)n++}$('progressText').textContent=n+'/10 câu đã trả lời';$('progressBar').style.width=(n*10)+'%'}
function acceptable(n){return String(D.answers[n]||'').split(/\s*\/\s*/).map(normalize)}
function correct(n){if(n===21||n===22||n===23||n===24){const a=n<=22?21:23,b=a+1;const chosen=[normalize(answers[a]),normalize(answers[b])].filter(Boolean).sort();const key=[normalize(D.answers[a]),normalize(D.answers[b])].sort();return chosen.length===2&&chosen[0]===key[0]&&chosen[1]===key[1]}return acceptable(n).includes(normalize(answers[n]||''))}
function relevant(n){
 const key=D.evidence?.[n];const lines=D.transcript.split(/\n+/).filter(Boolean);
 const matchIndex=lines.findIndex(t=>t.includes('(Q'+n+')')||t.includes('(Q'+n+'&Q'+(n+1)+')')||t.includes('(Q'+(n-1)+'&Q'+n+')'));
 return {text:key?.quote||lines[matchIndex]||'',index:Math.max(0,matchIndex),start:key?.start,end:key?.end,why:key?.why||''};
}
function seek(n){
 const span=D.evidence?.[n];
 if(!span||!Number.isFinite(span.start)){$('audioStatus').textContent='Chưa có timestamp chính xác cho câu này; hãy nghe bằng thanh audio.';return}
 if(!hasAudio){$('audioStatus').textContent='Audio chưa có trên máy chủ; vui lòng tải lại sau.';return}
 const player=$('player');
 player.currentTime=Math.max(0,span.start-1.5);
 segmentEnd=Math.min(player.duration||D.durationSeconds,(span.end||span.start+12)+1.5);
 player.play().catch(()=>{});
 $('audioStatus').textContent='Đang nghe dẫn chứng câu '+n+' · mốc '+formatAudio(span.start)+'–'+formatAudio(span.end)+'.';
}
function transcriptMarkup(){
 const lines=D.transcript.split(/\n+/).filter(Boolean);
 $('transcriptText').innerHTML=lines.map((t,i)=>{const tags=[...t.matchAll(/\(Q(\d+)(?:&Q(\d+))?\)/g)].flatMap(m=>[m[1],m[2]].filter(Boolean));return '<p class="cue-line" id="transcriptLine'+i+'"'+(tags.length?' data-transcript="'+tags[0]+'" title="Nhấn để nghe đoạn chứa đáp án"':'')+'>'+e(t)+'</p>'}).join('');
}
function review(){
 let score=0,out='';
 for(let n=FIRST;n<=LAST;n++){
  const ok=correct(n);if(ok)score++;
  const ev=relevant(n),code=Array.isArray(D.answers[n])?D.answers[n].join(', '):D.answers[n];
  out+='<div class="cam-review" id="review'+n+'"><strong>Câu '+n+'</strong> · <span class="'+(ok?'good':'bad')+'">'+(ok?'✓ Đúng':'✕ Cần sửa')+'</span>'+
  '<div>Đã chọn: '+e(answers[n]||'Chưa trả lời')+' · Đáp án: <strong>'+e(code)+'</strong></div>'+
  '<div style="color:#67677f">Giải thích: '+e(ev.why)+'</div>'+
  '<div class="cam-evidence" '+(Number.isFinite(ev.start)?'data-seek="'+n+'"':'')+'><b>🔎 Dẫn chứng trong transcript</b><span style="display:block">'+e(ev.text)+'</span></div></div>';
 }
 $('reviews').innerHTML=out;$('score').textContent='Kết quả: '+score+'/10';$('reviewPanel').classList.remove('cam-nodisplay');$('transcriptPanel').classList.remove('cam-nodisplay');$('transcriptPanel').open=true;
 document.querySelectorAll('[data-answer],.cam-pair-checkbox').forEach(el=>el.disabled=true);$('submit').disabled=true;$('footerSubmit').disabled=true;
}
const RESULT_ENDPOINT='https://script.google.com/macros/s/AKfycbwfwWjJ7Q3VTJEF5ldKGnFKYoziQdntAzRjq1Yqy6HSmbZSc69ijSdOvMCC_Zogbpcm/exec';
async function sendResult(){
 const score=Array.from({length:10},(_,i)=>FIRST+i).filter(n=>correct(n)).length;
 const body=new URLSearchParams({mode:'PRACTICE',name:student.name||'',className:student.className||'',skill:'Listening',practiceType:'Part '+number,practiceId:folder,score:String(score),total:'10',durationSeconds:String(seconds),details:JSON.stringify({title:D.title,source:'Listening Section '+number,answers,correctAnswers:D.answers,questions:FIRST+'–'+LAST}),submittedAt:new Date().toISOString()});
 try{await fetch(RESULT_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:body.toString()})}catch(error){console.warn('Không thể gửi kết quả Listening Practice:',error)}
}
function submit(){if(done)return;if(!confirm('Nộp bài và xem đáp án, giải thích?'))return;done=true;clearInterval(clock);$('player').pause();review();localStorage.setItem(store+'_done','1');sendResult();}
function start(){let name=$('studentName').value.trim(),className=$('studentClass').value.trim();if(!name||!className){$('startError').textContent='Vui lòng nhập họ tên và lớp';return}student={name,className};localStorage.setItem('IELTS_PRACTICE_STUDENT',JSON.stringify(student));$('startScreen').classList.add('cam-nodisplay');$('studentInfo').textContent=name+' · '+className;started=Date.now();clock=setInterval(()=>{seconds++;$('timer').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')},1000)}
async function main(){try{const r=await fetch('./data.json?v=20261117-01',{cache:'no-store'});if(!r.ok)throw Error('Missing data');D=await r.json();if(!D)throw Error('Missing part');try{answers=JSON.parse(localStorage.getItem(store+'_answers')||'{}')}catch{};$('brand').textContent='🎧 Listening Part '+number+' — 0'+folder;$('heroTitle').textContent='Listening Part '+number+' — Practice 0'+folder;$('heroSub').textContent=D.title+' · Questions '+FIRST+'–'+LAST;renderQuestions();initAudio();transcriptMarkup();updateProgress();const previous=JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null');if(previous){$('studentName').value=previous.name||'';$('studentClass').value=previous.className||'';if(previous.name&&previous.className)start()}
$('startButton').addEventListener('click',start);$('questionsRoot').addEventListener('input',event=>{const el=event.target.closest('[data-answer]');if(!el||done)return;answers[el.dataset.answer]=el.value;localStorage.setItem(store+'_answers',JSON.stringify(answers));updateProgress()});$('questionsRoot').addEventListener('change',event=>{const pair=event.target.closest('.cam-pair-checkbox');if(pair){syncPair(Number(pair.dataset.pair),pair);return}const el=event.target.closest('[data-answer]');if(!el||done)return;answers[el.dataset.answer]=el.value;localStorage.setItem(store+'_answers',JSON.stringify(answers));updateProgress()});$('nav').addEventListener('click',event=>{const n=event.target.closest('[data-nav]')?.dataset.nav;if(n){$('row'+n)?.scrollIntoView({behavior:'smooth',block:'center'})}});$('submit').addEventListener('click',submit);$('reviews').addEventListener('click',event=>{const n=event.target.closest('[data-seek]')?.dataset.seek;if(n){seek(Number(n));const ev=relevant(Number(n));const q=[...document.querySelectorAll('#transcriptText .cue-line')].find(el=>el.textContent.includes(ev.quote?.slice(0,24)));if(q){q.classList.add('cue-focus');q.scrollIntoView({behavior:'smooth',block:'center'})}}});$('transcriptText').addEventListener('click',event=>{const n=event.target.closest('[data-transcript]')?.dataset.transcript;if(n&&done)seek(Number(n))});}catch(err){$('loadError').textContent='Không tải được nội dung bài: '+err.message;console.error(err)}}
main();
})();