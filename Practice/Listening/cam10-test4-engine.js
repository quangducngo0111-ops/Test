(()=>{'use strict';
const $=id=>document.getElementById(id),e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=Number(document.body.dataset.part),folder=document.body.dataset.folder;
const FIRST=(number-1)*10+1, LAST=number*10, names={1:'Thorndyke’s Builders',2:'Manham Port',3:'Work Placement',4:'Nanotechnology: Technology on a Small Scale'};
let D={},answers={},done=false,student={},started=Date.now(),seconds=0,clock,segmentEnd=null,hasAudio=false;
const store='SMARTCOM_C10T4_P'+number,normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
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
let html='';
if(number===1){
 html+=group(1,6,'Complete the notes below. Write ONE WORD ONLY.','NOTE COMPLETION','<div class="cam-note"><h4>THORNDYKE’S BUILDERS</h4>'+table(['Thông tin','Chi tiết'],[
 '<tr><td>Example</td><td>Customer heard about Thorndyke’s from a <b>friend</b>.</td></tr>',
 ...[[1,'Name','Edith ………'],[2,'Address','Flat 4, ……… Park Flats'],[3,'Location','Behind the ………'],[4,'Best time to contact','During the ………'],[5,'Where to park','Opposite entrance next to the ………'],[6,'Full quote','All the jobs and the ………']].map(([n,label,txt])=>'<tr id="row'+n+'"><td>'+label+'</td><td>'+withGap(n,txt)+'</td></tr>')
 ].join(''))+'</div>');
 html+=group(7,10,'Complete the table below. Write ONE WORD ONLY.','TABLE COMPLETION',table(['Area','Work to be done','Notes'],[
 '<tr id="row7"><td rowspan="3">Kitchen</td><td>Replace the '+field(7)+' in the door</td><td>Fix tomorrow</td></tr>',
 '<tr id="row8"><td>Paint wall above the '+field(8)+'</td><td rowspan="2">Strip paint and plaster approximately one '+field(9)+' in advance</td></tr>',
 '<tr><td>Painting preparation</td></tr>',
 '<tr id="row10"><td>Garden</td><td>One '+field(10)+' needs replacing</td><td>End of garden</td></tr>'
 ].join('')));
}else if(number===2){
 html+=group(11,15,'Choose the correct letter, A, B or C.','MULTIPLE CHOICE',questionBlock([11,12,13,14,15],D.questionsText.split(/Questions 16-20/)[0]));
 html+=group(16,20,'Complete the table. Write NO MORE THAN TWO WORDS.','TABLE COMPLETION',table(['Place','Features and activities','Advice'],[
 '<tr id="row16"><td rowspan="2">Copper mine</td><td>Specially adapted miners’ '+field(16)+' take visitors into the mountain</td><td rowspan="2">Mine is '+field(17)+' and enclosed — unsuitable for children and animals</td></tr>',
 '<tr><td>Watch the historic machinery</td></tr>',
 '<tr id="row18"><td rowspan="2">Village school</td><td>Classrooms and a special exhibition of '+field(18)+'</td><td rowspan="2">A '+field(19)+' is recommended</td></tr>',
 '<tr><td>Interactive exhibits</td></tr>',
 '<tr id="row20"><td>“The George” (old sailing ship)</td><td>Restored ship’s wheel</td><td>Children shouldn’t use the '+field(20)+'</td></tr>'
 ].join('')));
}else if(number===3){
 html+=choicePair(21,'Which TWO skills did Laura improve as a result of her work placement?',[['A','communication'],['B','design'],['C','IT'],['D','marketing'],['E','organisation']])+choicePair(23,'Which TWO immediate benefits did the company get from Laura’s work placement?',[['A','updates for its software'],['B','cost savings'],['C','an improved image'],['D','new clients'],['E','a growth in sales']]);
 const bank=[['A','company manager'],['B','company’s personnel department'],['C','personal tutor'],['D','psychology department'],['E','mentor'],['F','university careers officer'],['G','internet']];
 html+=group(25,30,'Choose the correct letter, A–G, for each stage.','MATCHING','<div class="cam-wordbank"><div class="bank-title">Sources of information</div>'+bank.map(([a,b])=>'<div><b>'+a+'</b>'+e(b)+'</div>').join('')+'</div>'+table(['Số','Stages of the work placement procedure'],[[25,'obtaining booklet'],[26,'discussing options'],[27,'getting updates'],[28,'responding to invitation for interview'],[29,'informing about outcome of interview'],[30,'requesting a reference']].map(([n,d])=>letter(n,d,bank.map(x=>x[0]))).join('')));
}else if(number===4){
 html+=group(31,33,'Choose the correct letter, A, B or C.','MULTIPLE CHOICE',questionBlock([31,32,33],D.questionsText.split(/Questions 34-40/)[0]));
 const rows=[
 ['Transport',[[34,'Nanotechnology could allow the development of stronger ………'],[35,'……… travel will be made available to the masses.']]],
 ['Technology',[[36,'Computers will be smaller, faster and have greater ………'],[37,'……… energy will become more affordable.']]],
 ['The Environment',[[38,'Pollutants such as ……… could be removed from water.'],[39,'There will be no ……… from manufacturing.']]],
 ['Health and Medicine',[[40,'Analysis of medical ……… will be speeded up.']]]
 ];
 html+=group(34,40,'Complete the notes below. Write ONE WORD ONLY.','NOTE COMPLETION',table(['Ứng dụng','Ghi chú'],rows.map(([k,list])=>list.map(([n,t],i)=>'<tr id="row'+n+'">'+(i===0?'<td rowspan="'+list.length+'"><b>'+e(k)+'</b></td>':'')+'<td>'+withGap(n,t)+'</td></tr>').join('')).join('')));
}
$('questionsRoot').innerHTML=html;
$('nav').innerHTML=Array.from({length:10},(_,i)=>{let n=FIRST+i;return '<button id="nav'+n+'" type="button" data-nav="'+n+'">'+n+'</button>'}).join('')+'<button class="nav-submit" id="footerSubmit">Nộp bài</button>';
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
function correct(n){if(number===3&&(n===21||n===22||n===23||n===24)){const a=n<=22?21:23,b=a+1;const chosen=[normalize(answers[a]),normalize(answers[b])].filter(Boolean).sort();const key=[normalize(D.answers[a]),normalize(D.answers[b])].sort();return chosen.length===2&&chosen[0]===key[0]&&chosen[1]===key[1]}return acceptable(n).includes(normalize(answers[n]||''))}
function relevant(n){const lines=D.transcript.split(/\n+/).filter(Boolean);const regex=new RegExp('\\(Q'+n+'(?:\\b|&|\\))');let i=lines.findIndex(s=>regex.test(s));if(i<0&&n===13)i=lines.findIndex(s=>s.includes('(Q3)'));if(i<0&&n===30)i=lines.findIndex(s=>s.includes('(Q3)'));if(i<0)i=Math.min(lines.length-1,Math.max(0,Math.round((n-FIRST+0.5)*lines.length/10)));const txt=lines[i]?.replace(/\(Q\d+(?:&Q\d+)?\)/g,'').trim()||'';return {text:txt,index:i,count:lines.length};}
function estimate(n){const whole=D.transcript,match=new RegExp('\\(Q'+n+'(?:\\b|&|\\))').exec(whole);const rel=match?match.index/whole.length:(n-FIRST+0.5)/10;const pre=Math.max(0,Math.round(D.durationSeconds*0.12));const end=Math.max(pre+60,Math.floor(D.durationSeconds*0.96));return Math.max(0,Math.round(pre+rel*(end-pre)-12));}
function seek(n){if(!hasAudio){$('audioStatus').textContent='Audio chưa sẵn sàng để nghe lại đoạn này.';return}const seconds=estimate(n);const player=$('player');player.currentTime=seconds;segmentEnd=Math.min(D.durationSeconds,seconds+35);player.play().catch(()=>{});$('audioStatus').textContent='Đang phát gần đoạn câu '+n+' ('+Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')+') · Mốc ước lượng từ transcript';}
function transcriptMarkup(){const lines=D.transcript.split(/\n+/).filter(Boolean);$('transcriptText').innerHTML=lines.map((t,i)=>{const q=[...t.matchAll(/\(Q(\d+)(?:&Q(\d+))?\)/g)].flatMap(m=>[m[1],m[2]].filter(Boolean));return '<p class="cue-line" data-transcript="'+(q[0]||'')+'" id="transcriptLine'+i+'">'+e(t)+'</p>'}).join('')}
function review(){let score=0,out='';for(let n=FIRST;n<=LAST;n++){const ok=correct(n);if(ok)score++;const ev=relevant(n);out+='<div class="cam-review" id="review'+n+'"><strong>Câu '+n+'</strong> · <span class="'+(ok?'good':'bad')+'">'+(ok?'✓ Đúng':'✕ Cần sửa')+'</span><div>Đã chọn: '+e(answers[n]||'Chưa trả lời')+' · Đáp án: <strong>'+e(D.answers[n])+'</strong></div><div style="color:#67677f">Giải thích: '+(number===4?part4Why[n]||'Đối chiếu câu diễn đạt tương đương trong transcript.':'Transcript cho thấy thông tin phù hợp với đáp án này. Xem đoạn dẫn chứng dưới đây.')+'</div><button class="cam-evidence" data-seek="'+n+'"><b>▶ Nghe đoạn chứa đáp án · Câu '+n+'</b><span style="display:block">'+e(ev.text.slice(0,360))+'</span><small>Nhấn để tua audio tới mốc tham khảo và đối chiếu transcript.</small></button></div>';}
$('reviews').innerHTML=out;$('score').textContent='Kết quả: '+score+'/10';$('reviewPanel').classList.remove('cam-nodisplay');$('transcriptPanel').classList.remove('cam-nodisplay');$('transcriptPanel').open=true;document.querySelectorAll('[data-answer],.cam-pair-checkbox').forEach(el=>el.disabled=true);$('submit').disabled=true;$('footerSubmit').disabled=true;
}
const part4Why={31:'Người nói nhấn mạnh xã hội thường hiểu sai về khả năng của công nghệ nano, không khẳng định việc giám sát con người đã xảy ra.',32:'Các nhà khoa học đề nghị kiểm tra an toàn, dán nhãn rõ và thận trọng hơn khi sử dụng hạt nano.',33:'“Plough ahead” nghĩa là tiếp tục tiến hành nghiên cứu, thay vì dừng lại.',34:'“More durable metals” diễn đạt lại ý vật liệu kim loại bền chắc hơn.',35:'“Travelling into space” cho biết loại hình du lịch là space travel.',36:'Máy tính trong tương lai sẽ có “a million times more memory”.',37:'Giá thành “solar cells” giảm làm năng lượng mặt trời dễ tiếp cận.',38:'Người nói nhắc việc loại bỏ “oil and other contaminants” khỏi nước.',39:'Sản xuất đúng lượng cần dùng nên không tạo ra “waste”.',40:'Biosensors sẽ phân tích “tests” trong vài phút thay vì vài ngày.'};
const RESULT_ENDPOINT='https://script.google.com/macros/s/AKfycbwfwWjJ7Q3VTJEF5ldKGnFKYoziQdntAzRjq1Yqy6HSmbZSc69ijSdOvMCC_Zogbpcm/exec';
async function sendResult(){
 const score=Array.from({length:10},(_,i)=>FIRST+i).filter(n=>correct(n)).length;
 const body=new URLSearchParams({mode:'PRACTICE',name:student.name||'',className:student.className||'',skill:'Listening',practiceType:'Part '+number,practiceId:folder,score:String(score),total:'10',durationSeconds:String(seconds),details:JSON.stringify({title:D.title,source:'Listening Section '+number,answers,correctAnswers:D.answers,questions:FIRST+'–'+LAST}),submittedAt:new Date().toISOString()});
 try{await fetch(RESULT_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:body.toString()})}catch(error){console.warn('Không thể gửi kết quả Listening Practice:',error)}
}
function submit(){if(done)return;if(!confirm('Nộp bài và xem đáp án, giải thích?'))return;done=true;clearInterval(clock);$('player').pause();review();localStorage.setItem(store+'_done','1');sendResult();}
function start(){let name=$('studentName').value.trim(),className=$('studentClass').value.trim();if(!name||!className){$('startError').textContent='Vui lòng nhập họ tên và lớp';return}student={name,className};localStorage.setItem('IELTS_PRACTICE_STUDENT',JSON.stringify(student));$('startScreen').classList.add('cam-nodisplay');$('studentInfo').textContent=name+' · '+className;started=Date.now();clock=setInterval(()=>{seconds++;$('timer').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')},1000)}
async function main(){try{const r=await fetch('../../cam10-test4-data.json?v=20261112-01');if(!r.ok)throw Error('Missing data');D=(await r.json()).parts[number];if(!D)throw Error('Missing part');try{answers=JSON.parse(localStorage.getItem(store+'_answers')||'{}')}catch{};$('brand').textContent='🎧 Listening Part '+number+' — 0'+folder;$('heroTitle').textContent='Listening Part '+number+' — Practice 0'+folder;$('heroSub').textContent=D.title+' · Questions +FIRST+'–'+LAST;renderQuestions();initAudio();transcriptMarkup();updateProgress();const previous=JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null');if(previous){$('studentName').value=previous.name||'';$('studentClass').value=previous.className||'';if(previous.name&&previous.className)start()}
$('startButton').addEventListener('click',start);$('questionsRoot').addEventListener('input',event=>{const el=event.target.closest('[data-answer]');if(!el||done)return;answers[el.dataset.answer]=el.value;localStorage.setItem(store+'_answers',JSON.stringify(answers));updateProgress()});$('questionsRoot').addEventListener('change',event=>{const pair=event.target.closest('.cam-pair-checkbox');if(pair){syncPair(Number(pair.dataset.pair),pair);return}const el=event.target.closest('[data-answer]');if(!el||done)return;answers[el.dataset.answer]=el.value;localStorage.setItem(store+'_answers',JSON.stringify(answers));updateProgress()});$('nav').addEventListener('click',event=>{const n=event.target.closest('[data-nav]')?.dataset.nav;if(n){$('row'+n)?.scrollIntoView({behavior:'smooth',block:'center'})}});$('submit').addEventListener('click',submit);$('reviews').addEventListener('click',event=>{const n=event.target.closest('[data-seek]')?.dataset.seek;if(n){seek(Number(n));const ev=relevant(Number(n));const q=document.querySelector('#transcriptLine'+ev.index);if(q){q.classList.add('cue-focus');q.scrollIntoView({behavior:'smooth',block:'center'})}}});$('transcriptText').addEventListener('click',event=>{const n=event.target.closest('[data-transcript]')?.dataset.transcript;if(n&&done)seek(Number(n))});}catch(err){$('loadError').textContent='Không tải được nội dung bài: '+err.message;console.error(err)}}
main();
})();