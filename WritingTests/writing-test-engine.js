/* IELTS Academic Writing Tests 02–51. Original question visualisations.
   All data are fictional and for mock tests, not official historical statistics.
   No images from external sources are embedded. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const num=Number(params.get('test')||2);
const d=(window.SC_WRITING_TESTS||[]).find(x=>x.id===num);
if(!d){$('invalid').classList.remove('hidden');$('exam').classList.add('hidden');return}
const numFmt=String(num).padStart(2,'0');
document.title='IELTS Writing Test '+numFmt+' · Smartcom';
$('examTitle').textContent='IELTS WRITING TEST '+numFmt;
$('introTitle').textContent='Writing Test '+numFmt;
const profile=(()=>{try{return JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null')}catch{return null}})();
$('studentInfo').textContent=profile?.name?profile.name+' · '+(profile.className||''):'IELTS Academic';
const draftKey='SC_WRITING_MOCK_DRAFT_V2_'+num+'_'+[profile?.name||'guest',profile?.className||''].join('|').toLowerCase();
const wordCount=text=>String(text||'').trim()?String(text).trim().split(/\s+/u).filter(Boolean).length:0;
function escapeHTML(text){return String(text).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]))}
function values(seed,n,scale=1){return Array.from({length:n},(_,i)=>Math.round(((seed*19+i*17+29)%63+19+i*3)*scale))}
const axisLabels=['Area A','Area B','Area C','Area D','Area E'];
const base=(inner)=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 670 355" role="img" aria-label="'+escapeHTML(d.subject)+' — illustrative data graphic"><rect width="670" height="355" rx="18" fill="#FAFEFF"/>'+inner+'</svg>';
const text=(x,y,t,size=13,fill='#31546B',anchor='start')=>'<text x="'+x+'" y="'+y+'" font-family="Arial, sans-serif" font-size="'+size+'" fill="'+fill+'" text-anchor="'+anchor+'">'+escapeHTML(t)+'</text>';
function bar(){
 const vs=values(d.seed,5),max=Math.ceil(Math.max(...vs)/20)*20;
 let g=text(330,31,d.subject,19,'#173F58','middle')+text(330,52,d.unit,12,'#6C8594','middle');
 for(let i=0;i<=4;i++){const val=max*i/4,y=299-val/max*209;g+='<line x1="78" y1="'+y+'" x2="630" y2="'+y+'" stroke="#DDEAF0"/>'+text(67,y+4,Math.round(val),11,'#668093','end')}
 vs.forEach((v,i)=>{let x=99+i*106,y=299-v/max*209;g+='<rect x="'+x+'" y="'+y+'" width="66" height="'+(299-y)+'" rx="7" fill="'+(['#248899','#4AA0C0','#257EB4','#6BB8AE','#34769C'][i])+'"/>'+text(x+33,y-9,v,12,'#28516A','middle')+text(x+33,323,axisLabels[i],12,'#546F85','middle')});
 return base(g);
}
function line(){
 const years=[2015,2017,2019,2021,2023],v1=values(d.seed,5),v2=values(d.seed+37,5),max=Math.ceil(Math.max(...v1,...v2)/20)*20;
 let g=text(330,30,d.subject+' over time',19,'#173F58','middle')+text(330,50,d.unit,12,'#6C8594','middle');
 for(let i=0;i<=4;i++){let y=289-(max*i/4)/max*195;g+='<line x1="74" y1="'+y+'" x2="630" y2="'+y+'" stroke="#DDEAF0"/>'+text(63,y+4,Math.round(max*i/4),11,'#668093','end')}
 years.forEach((yr,i)=>{g+=text(97+i*120,317,yr,12,'#58758C','middle')});
 [[v1,'#19869B'],[v2,'#E4A44A']].forEach(([v,color],j)=>{let points=v.map((n,i)=>(97+i*120)+','+(289-n/max*195)).join(' ');g+='<polyline points="'+points+'" fill="none" stroke="'+color+'" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>';v.forEach((n,i)=>{let x=97+i*120,y=289-n/max*195;g+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="'+color+'" stroke="#FFF" stroke-width="2"/>'})});
 g+='<circle cx="465" cy="61" r="5" fill="#19869B"/>'+text(476,65,'Group A',11)+ '<circle cx="555" cy="61" r="5" fill="#E4A44A"/>'+text(567,65,'Group B',11);
 return base(g);
}
function table(){
 const labels=['Group A','Group B','Group C','Group D','Group E'];const cols=['2015','2020','2025'];
 let g=text(335,29,d.subject+' by category',19,'#173F58','middle')+text(335,49,d.unit,12,'#6C8594','middle');
 g+='<rect x="40" y="75" width="590" height="243" rx="12" fill="#FFF" stroke="#BAD9E3"/><rect x="40" y="75" width="590" height="41" rx="12" fill="#DDF1F4"/>';
 g+=text(76,102,'Category',13,'#194A60');cols.forEach((col,j)=>g+=text(317+j*115,102,col,13,'#194A60','middle'));
 for(let i=0;i<5;i++){let y=118+i*39;if(i%2===0)g+='<rect x="42" y="'+y+'" width="586" height="39" fill="#F5FAFC"/>';g+=text(76,y+25,labels[i],13);const v=values(d.seed+i*2,3);v.forEach((n,j)=>g+=text(317+j*115,y+25,n,13,'#1E6882','middle'))}
 return base(g);
}
function piePath(cx,cy,r,start,end){const polar=a=>{let z=(a-90)*Math.PI/180;return [cx+r*Math.cos(z),cy+r*Math.sin(z)]};let [x1,y1]=polar(start),[x2,y2]=polar(end);return 'M '+cx+' '+cy+' L '+x1+' '+y1+' A '+r+' '+r+' 0 '+((end-start)>180?1:0)+' 1 '+x2+' '+y2+' Z'}
function pie(){
 let g=text(330,31,d.subject+' by category',18,'#173F58','middle')+text(330,52,'percentage of total (%)',12,'#6C8594','middle');
 let cats=['Category A','Category B','Category C','Category D'];let colors=['#22889E','#70BFB2','#E2AF64','#617DB1'];
 [2015,2025].forEach((year,k)=>{const raw=values(d.seed+k*11,4),sum=raw.reduce((a,b)=>a+b,0),parts=raw.map(n=>n/sum*100);let angle=0,cx=k?464:203;parts.forEach((v,i)=>{g+='<path d="'+piePath(cx,196,95,angle,angle+v*3.6)+'" fill="'+colors[i]+'" stroke="#FFF" stroke-width="2"/>';angle+=v*3.6});g+=text(cx,325,year,14,'#274C66','middle')});
 cats.forEach((s,i)=>{const x=79+i*151;g+='<rect x="'+x+'" y="61" width="11" height="11" rx="2" fill="'+colors[i]+'"/>'+text(x+15,71,s,10)});
 return base(g);
}
const processSteps={
 'Glass bottle recycling':['Collection bins','Sorting','Glass cleaning','Crushing','Melting','New bottles'],
 'Rainwater collection':['Roof capture','Gutters','Storage tank','Filtration','Pumping','Household reuse'],
 'Coffee production':['Harvesting','Washing','Drying','Roasting','Grinding','Packaging'],
 'Recycled paper production':['Waste collection','Sorting','Pulping','Cleaning','Pressing','Drying']
};
function process(){
 const stages=processSteps[d.subject]||['Collection','Preparation','Processing','Quality check','Packaging','Delivery'];
 let g=text(335,32,d.subject,19,'#173F58','middle')+text(335,53,'illustrative process — stages in order',12,'#6C8594','middle');
 stages.forEach((s,i)=>{const row=Math.floor(i/3),col=i%3,x=29+col*217,y=94+row*115;g+='<rect x="'+x+'" y="'+y+'" width="191" height="72" rx="14" fill="'+(row?'#E8F3FB':'#E5F6F1')+'" stroke="#A4CBD6" stroke-width="1.6"/>'+text(x+95,y+30,'STEP '+(i+1),10,'#3B8094','middle')+text(x+95,y+50,s,13,'#234F68','middle');if(i!==2&&i!==5)g+='<path d="M '+(x+195)+' '+(y+35)+' h 16" stroke="#327F9C" stroke-width="3"/><path d="m '+(x+207)+' '+(y+29)+' 7 6 -7 6" fill="none" stroke="#327F9C" stroke-width="3"/>'});
 g+='<path d="M 563 164 V 208 H 90 V 212" stroke="#327F9C" stroke-width="2" fill="none" stroke-dasharray="5 5"/>';
 return base(g);
}
function map(){
 const labels=['Entrance','Garden','Library','Cafe','Path','Parking'];
 let g=text(330,32,d.subject,19,'#173F58','middle')+text(330,51,'schematic site plans — not to scale',12,'#6C8594','middle');
 [0,1].forEach(k=>{const x=k?350:31,y=85;g+=text(x+143,77,k?'2025':'2010',15,'#255D75','middle')+'<rect x="'+x+'" y="'+y+'" width="286" height="225" rx="11" fill="#EDF6E9" stroke="#9FBBAE" stroke-width="2"/>';
 g+='<path d="M '+(x+18)+' '+(y+112)+' H '+(x+266)+'" stroke="#CFD2CD" stroke-width="25"/><path d="M '+(x+18)+' '+(y+112)+' H '+(x+266)+'" stroke="#FFF" stroke-width="2" stroke-dasharray="10 10"/>';
 const items=k?[['Cafe',15,18],['Garden',142,18],['Library',142,155],['Parking',14,155]]:[['Garden',15,18],['Library',143,18],['Parking',144,155],['Entrance',14,155]];
 items.forEach(([label,dx,dy],i)=>{g+='<rect x="'+(x+dx)+'" y="'+(y+dy)+'" width="123" height="50" rx="7" fill="'+(label==='Garden'?'#B4DCB0':label==='Parking'?'#CCD6DB':'#C5E1F1')+'" stroke="#85ABBA"/>'+text(x+dx+61,y+dy+30,label,12,'#25546A','middle')});
 });
 return base(g);
}
function task1Visual(){return ({bar,line,table,pie,process,map}[d.kind]||bar)()}
const kindLabel={bar:'bar chart',line:'line graph',table:'table',pie:'pie charts',process:'process diagram',map:'maps'}[d.kind];
const instructions=d.kind==='map'
 ?'The maps below show how '+d.scope+' changed between 2010 and 2025.'
 :d.kind==='process'
 ?'The diagram below illustrates the stages involved in '+d.subject.toLowerCase()+' at '+d.scope+'.'
 :d.kind==='pie'
 ?'The pie charts below compare the distribution of '+d.subject.toLowerCase()+' in '+d.scope+' in 2015 and 2025.'
 :d.kind==='line'
 ?'The line graph below compares trends in '+d.subject.toLowerCase()+' for two groups in '+d.scope+' between 2015 and 2023.'
 :'The '+kindLabel+' below gives information about '+d.subject.toLowerCase()+' in '+d.scope+'.';
$('task1Text').textContent=instructions+' Summarise the information by selecting and reporting the main features, and make comparisons where relevant.';
$('task2Text').textContent=d.task2+' Give reasons for your answer and include any relevant examples from your own knowledge or experience.';
$('visual').innerHTML=task1Visual()+'<figcaption>Original illustrative dataset created for this mock test. Not an official IELTS graphic.</figcaption>';
let currentTask=1,started=false,submitted=false,secondsLeft=3600,startedAt=null,timerId=null;
function storage(){try{return JSON.parse(localStorage.getItem(draftKey)||'null')}catch{return null}}
function persist(){try{localStorage.setItem(draftKey,JSON.stringify({startedAt,submitted,task1:$('task1Essay').value,task2:$('task2Essay').value,test:num,savedAt:new Date().toISOString()}))}catch{}}
function updateCounts(){
 $('wordCount').textContent=wordCount($(currentTask===1?'task1Essay':'task2Essay').value);
 $('count1').textContent=wordCount($('task1Essay').value);
 $('count2').textContent=wordCount($('task2Essay').value);
 $('bottomStatus').textContent='Task 1: '+$('count1').textContent+' / 150 từ · Task 2: '+$('count2').textContent+' / 250 từ';
}
function showTask(n){currentTask=n;for(let i=1;i<=2;i++){const active=i===n;$('task'+i+'Tab').classList.toggle('active',active);$('task'+i+'Tab').setAttribute('aria-selected',String(active));$('task'+i+'Prompt').classList.toggle('hidden',!active);$('task'+i+'Essay').classList.toggle('hidden',!active)}
 $('writerTitle').textContent='Writing Task '+n;$('wordTarget').textContent=n===1?'150':'250';updateCounts()}
function tick(){
 if(!started||submitted)return;
 secondsLeft=Math.max(0,3600-Math.floor((Date.now()-startedAt)/1000));
 let m=Math.floor(secondsLeft/60),s=secondsLeft%60;
 $('timer').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
 $('timer').classList.toggle('warn',secondsLeft<=600&&secondsLeft>300);
 $('timer').classList.toggle('danger',secondsLeft<=300);
 if(secondsLeft===0)submit(true);
}
function launch(){if(started)return;started=true;startedAt=Date.now();$('intro').classList.add('hidden');persist();timerId=setInterval(tick,1000);tick()}
function loadDraft(){const saved=storage();if(!saved||saved.submitted)return;$('task1Essay').value=String(saved.task1||'');$('task2Essay').value=String(saved.task2||'');if(Number.isFinite(saved.startedAt)){startedAt=saved.startedAt;started=true;$('intro').classList.add('hidden');timerId=setInterval(tick,1000);tick()}updateCounts()}
function submit(auto){
 if(submitted||!started)return;
 if(!auto&&!window.confirm('Nộp cả Task 1 và Task 2? Bạn sẽ không thể chỉnh sửa sau khi nộp.'))return;
 submitted=true;clearInterval(timerId);let t1=$('task1Essay').value,t2=$('task2Essay').value;
 $('task1Essay').disabled=true;$('task2Essay').disabled=true;$('submitBtn').disabled=true;
 persist();
 const elapsed=Math.min(3600,Math.max(0,Math.round((Date.now()-startedAt)/1000)));
 const record={kind:'Test',skill:'Writing',title:'Writing Test '+numFmt,exerciseId:'Writing-Test-'+numFmt,path:location.pathname+location.search,task1Words:wordCount(t1),task2Words:wordCount(t2),answers:{task1:t1,task2:t2},durationSeconds:elapsed,score:null,band:null,status:'completed',gradingStatus:'not_graded',submittedAt:new Date().toISOString(),testSource:'original_illustrative'};
 let saved=null;
 try{saved=window.SmartcomHistory?.submit(record)}catch(e){console.warn('History:',e)}
 if(!saved){try{const key='SC_WRITING_TEST_LOCAL_SUBMISSIONS_V1',all=JSON.parse(localStorage.getItem(key)||'[]');all.push(record);localStorage.setItem(key,JSON.stringify(all.slice(-120)))}catch(e){}}
 $('result1').textContent=wordCount(t1);$('result2').textContent=wordCount(t2);
 $('resultMessage').textContent=auto?'Hết 60 phút. Bài làm đã được tự động nộp.':'Bài Writing Test đã được nộp.';
 $('resultSaved').textContent=saved?'Đã lưu vào Lịch sử làm bài của học sinh trên thiết bị.':'Đã lưu bản sao bài viết trên thiết bị. Chưa đồng bộ với máy chủ.';
 $('results').classList.remove('hidden');
}
$('task1Tab').onclick=()=>showTask(1);$('task2Tab').onclick=()=>showTask(2);
$('startBtn').onclick=launch;$('submitBtn').onclick=()=>submit(false);
for(const id of ['task1Essay','task2Essay'])$(id).addEventListener('input',()=>{updateCounts();if(started&&!submitted)persist()});
$('backResults').onclick=()=>{location.href='../?skill=writing'};
window.addEventListener('pagehide',()=>{if(started&&!submitted)persist()});
loadDraft();showTask(1);
})();