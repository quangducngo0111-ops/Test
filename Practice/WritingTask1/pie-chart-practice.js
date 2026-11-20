(()=>{'use strict';
const $=id=>document.getElementById(id),slug=document.body.dataset.pieSlug,steps=['Phân tích','Introduction','Overview','Body 1','Body 2','Hoàn thiện'],parts=['intro','overview','body1','body2'],colors=['#3b0e90','#9377de','#f39b32','#408ec4','#75b9a2'];let data,student,store,state;
const words=t=>(t.trim().match(/\b[\w’'-]+\b/g)||[]).length;
function esc(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]))}
function getStudent(){try{return JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null')}catch{return null}}
function save(){try{localStorage.setItem(store,JSON.stringify(state))}catch{};try{const text=Object.values(state.drafts||{}).filter(Boolean).join('\n\n');if(text.trim()&&window.SmartcomHistory){window.SmartcomHistory.draft({attemptId:'draft-'+location.pathname,kind:'Practice',skill:'Writing',title:data?.title||document.title,exerciseId:location.pathname,path:location.pathname,text:state.drafts?.full||text,wordCount:(text.match(/\b[\w'-]+\b/g)||[]).length,step:state.step})}}catch{}}
function section(i){return steps[i]}
function pieSegments(values){let at=-90;return values.map((v,i)=>{const first=at,last=at+v*3.6;at=last;const a=first*Math.PI/180,b=last*Math.PI/180,large=v>50?1:0;const x1=100+84*Math.cos(a),y1=100+84*Math.sin(a),x2=100+84*Math.cos(b),y2=100+84*Math.sin(b);const mid=(first+last)/2*Math.PI/180,tx=100+56*Math.cos(mid),ty=100+56*Math.sin(mid);return '<path d="M100 100 L'+x1.toFixed(3)+' '+y1.toFixed(3)+' A84 84 0 '+large+' 1 '+x2.toFixed(3)+' '+y2.toFixed(3)+' Z" fill="'+colors[i]+'" stroke="white" stroke-width="1.5" /><text x="'+tx.toFixed(2)+'" y="'+ty.toFixed(2)+'" font-size="12" text-anchor="middle" dominant-baseline="middle" font-weight="800" fill="'+(i<2?'white':'#1b2040')+'">'+v+'%</text>'}).join('')}
function showProvenance(){const el=document.querySelector('.task .source:last-of-type');if(!el)return;const type=data.sourceType||'user-pdf';const messages={'original':'Bộ số liệu giả định, được biên soạn để luyện IELTS Writing Task 1. Không phải thống kê thực tế hoặc đề IELTS chính thức.','source':'Số liệu dựng lại từ tài liệu tham khảo công khai; đề và biểu đồ được trình bày lại để luyện tập.','adapted':'Số liệu tổng hợp lại theo nhóm từ một bài tham khảo công khai; không giữ nguyên toàn bộ cách chia nhóm trong nguồn.','source-simulation':'Dữ liệu minh họa giả định từ một bài hướng dẫn trực tuyến; không phải số liệu thực tế.','user-pdf':'Số liệu chuyển từ PDF bài tập người dùng cung cấp.'};el.textContent=messages[type]||messages.original;if(data.sourceUrl){el.append(' ');const link=document.createElement('a');link.href=data.sourceUrl;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Xem nguồn tham khảo';el.append(link)}}
function charts(){return '<div class="chart-grid">'+data.groups.map(g=>'<div class="chart-item"><b>'+esc(g.name)+'</b><svg viewBox="0 0 200 200" role="img" aria-label="'+esc(g.name+': '+g.values.map((v,i)=>data.labels[i]+' '+v+'%').join(', '))+'">'+pieSegments(g.values)+'</svg></div>').join('')+'</div><div class="legend">'+data.labels.map((x,i)=>'<span><span class="swatch" style="background:'+colors[i]+'"></span>'+esc(x)+'</span>').join('')+'</div>'}
function renderTask(){$('taskTitle').textContent=data.title;$('prompt').textContent=data.prompt;$('chartHost').innerHTML=charts();$('dataTable').innerHTML='<summary>Xem dữ liệu dạng bảng (hỗ trợ kiểm tra số liệu)</summary><div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;font-size:12px"><thead><tr><th style="text-align:left">Hạng mục</th>'+data.groups.map(g=>'<th>'+esc(g.name)+'</th>').join('')+'</tr></thead><tbody>'+data.labels.map((x,i)=>'<tr><th style="text-align:left">'+esc(x)+'</th>'+data.groups.map(g=>'<td style="text-align:center">'+g.values[i]+'%</td>').join('')+'</tr>').join('')+'</tbody></table></div>'}
function currentText(){return state.drafts[parts[state.step-1]]||''}
function updateText(){const ta=$('writing');if(!ta)return;const part=state.step===5?'full':parts[state.step-1];state.drafts[part]=ta.value;save();$('wordCount').textContent=words(ta.value)+' từ'}

const PIE_ANALYSIS_VERSION=5;
const PIE_OVERVIEW_VERSION=2;
function headline(group){
 const ranked=group.values.map((v,i)=>({name:data.labels[i],value:v})).sort((a,b)=>b.value-a.value);
 return {top:ranked[0],bottom:ranked[ranked.length-1],second:ranked[1],ordered:ranked};
}
function analysisQuestions(){
 const isStatic=data.dataType==='Static',G=data.groups,first=headline(G[0]),last=headline(G[G.length-1]);
 const unit='percentages (%)';
 const mk=(title,question,options,answer,note,reason)=>({title,question,options,answer,note,reason});
 const q=[
 mk('01 · Nhận diện biểu đồ','Đây là dạng dữ liệu nào?', ['Static: so sánh tại các nhóm/mốc độc lập','Dynamic: thể hiện sự thay đổi theo thời gian','Process: mô tả các bước'],isStatic?0:1,'Dạng biểu đồ: '+(isStatic?'Static Pie Charts — so sánh tỷ trọng, không suy diễn tăng/giảm':'Dynamic Pie Charts — có mốc thời gian để phân tích sự thay đổi'),isStatic?'Các biểu đồ cho thấy tỷ lệ ở các nhóm, không biểu thị chuỗi thay đổi theo thời gian.':'Các mốc năm giúp so sánh sự thay đổi về tỷ trọng.'),
 mk('02 · Xác định đối tượng','Biểu đồ đang so sánh những nhóm nào?',[
 G.map(x=>x.name).join(' · '),'Chỉ so sánh một nhóm duy nhất','So sánh tỷ lệ tăng trưởng kinh tế mỗi năm'
 ],0,'Nhóm so sánh: '+G.map(x=>x.name).join(' / '),'Đọc tên ở đầu từng biểu đồ tròn, không tự thêm chủ thể ngoài đề.'),
 mk('03 · Xác định đơn vị','Số liệu trong biểu đồ được thể hiện bằng đơn vị nào?',[
 unit,'Số người tuyệt đối','Tốc độ tăng mỗi năm'
 ],0,'Đơn vị: tỷ trọng (%) — dùng accounted for / made up / represented khi mô tả','Mỗi phần của hình tròn là một tỷ lệ phần trăm trong tổng thể.'),
 mk('04 · Nhận diện các hạng mục','Những hạng mục nào được chia trong biểu đồ?',[
 data.labels.join(' · '),G.map(x=>x.name).join(' · '),'Revenue · Profit · Cost'
 ],0,'Hạng mục: '+data.labels.join(', '),'Hạng mục là các màu trong chú giải, khác với tên từng biểu đồ.'),
 ];
 return q;
}

function stageQuestions(stage){
 const G=data.groups, mk=(title,question,options,answer,note,reason)=>({title,question,options,answer,note,reason});
 if(stage==='overview'){
  // Overview idea 1: the single greatest percentage in the entire dataset.
  const all=G.flatMap(g=>g.values.map((value,i)=>({city:g.name,name:data.labels[i],value}))).sort((a,b)=>b.value-a.value);
  const greatest=all[0],runner=all.find(x=>x.value<greatest.value)||all[1]||greatest;
  const smallest=all[all.length-1];
  const firstQuestion=mk('Ý 1 · Tỷ trọng cao nhất toàn bài',
   'Trong tất cả các biểu đồ, hạng mục nào có tỷ trọng lớn nhất?',[
    runner.city+': '+runner.name+' ('+runner.value+'%)',
    greatest.city+': '+greatest.name+' ('+greatest.value+'%)',
    smallest.city+': '+smallest.name+' ('+smallest.value+'%)'
   ],1,'Ý 1 — '+greatest.name+' tại '+greatest.city+' có tỷ trọng lớn nhất toàn bài ('+greatest.value+'%).',
   'Đối chiếu tất cả hạng mục ở mọi biểu đồ để tìm con số cao nhất, không chỉ nhóm dẫn đầu ở từng thành phố.');
  // Overview idea 2: prefer a recurring, meaningful pattern over another list of maxima.
  const consistentlyLowest=data.labels.map((label,i)=>({
   label,index:i,values:G.map(g=>g.values[i]),
   strict:G.every(g=>g.values[i]===Math.min(...g.values)&&g.values.filter(v=>v===g.values[i]).length===1)
  })).filter(x=>x.strict);
  const consistentlyHighest=data.labels.map((label,i)=>({
   label,index:i,values:G.map(g=>g.values[i]),
   strict:G.every(g=>g.values[i]===Math.max(...g.values)&&g.values.filter(v=>v===g.values[i]).length===1)
  })).filter(x=>x.strict);
  let correct,alternatives,note,reason;
  if(consistentlyLowest.length){
   const low=consistentlyLowest[0];
   correct=low.label+' luôn chiếm tỷ trọng thấp nhất ở '+G.map(g=>g.name).join(', ')+'.';
   alternatives=[
    low.label+' có tỷ trọng lớn nhất trong mọi biểu đồ.',
    'Tất cả hạng mục đều có tỷ trọng bằng nhau ở mọi biểu đồ.'
   ];
   note='Ý 2 — '+low.label+' luôn đứng cuối tại cả '+G.length+' nhóm ('+G.map((g,i)=>g.name+': '+low.values[i]+'%').join('; ')+').';
   reason='So sánh cùng một hạng mục với các hạng mục khác bên trong từng biểu đồ; đây là đặc điểm lặp lại đáng nêu ở Overview.';
  }else if(consistentlyHighest.length){
   const high=consistentlyHighest[0];
   correct=high.label+' đứng đầu ở tất cả '+G.length+' biểu đồ.';
   alternatives=['Tất cả hạng mục có cùng tỷ lệ.','Không có hạng mục nào đứng đầu ở nhiều biểu đồ.'];
   note='Ý 2 — '+high.label+' đứng đầu tại mọi nhóm ('+G.map((g,i)=>g.name+': '+high.values[i]+'%').join('; ')+').';
   reason='Đây là một đặc điểm nhất quán qua các biểu đồ.';
  }else{
   const disparities=data.labels.map((name,i)=>({name,values:G.map(g=>g.values[i]),gap:Math.max(...G.map(g=>g.values[i]))-Math.min(...G.map(g=>g.values[i]))})).sort((a,b)=>b.gap-a.gap);
   const focus=disparities[0];
   correct=focus.name+' có chênh lệch tỷ trọng lớn nhất giữa các nhóm ('+focus.gap+' điểm phần trăm).';
   alternatives=['Tất cả hạng mục đều giống nhau giữa các nhóm.','Không có sự khác biệt đáng kể nào giữa các biểu đồ.'];
   note='Ý 2 — '+focus.name+' có khoảng cách lớn nhất giữa các nhóm: '+G.map((g,i)=>g.name+' '+focus.values[i]+'%').join('; ')+'.';
   reason='Khi không có đặc điểm đứng đầu/đứng cuối nhất quán, có thể chọn chênh lệch nổi bật giữa các nhóm.';
  }
  const secondQuestion=mk('Ý 2 · Đặc điểm nổi bật khác',
   'Ngoài tỷ trọng lớn nhất toàn bài, đặc điểm nào đáng chú ý nhất để đưa vào Overview?',
   [alternatives[0],alternatives[1],correct],2,note,reason);
  return [firstQuestion,secondQuestion];
 }
 const first=G[0],rest=G.slice(1),highlights=G.map(g=>{const h=headline(g);return g.name+': '+h.top.name+' '+h.top.value+'%, '+h.bottom.name+' '+h.bottom.value+'%'}).join(' · ');
 return [
  mk('Phân nhóm Body','Nên gom các nhóm nào vào Body 1 và Body 2?',[
   'Body 1: '+first.name+'; Body 2: '+rest.map(g=>g.name).join(' và '),
   'Đưa tất cả số liệu vào Body 1; để trống Body 2',
   'Chia theo nguyên nhân và dự đoán tương lai'
  ],0,'Dàn ý: Body 1 — '+first.name+'; Body 2 — '+rest.map(g=>g.name).join(', ')+'.','Đây là cách chia hợp lý để so sánh các nhóm.'),
  mk('Lựa chọn số liệu','Những số liệu nào nên được ưu tiên trong các đoạn Body?',[
   'Không cần đưa số liệu','Mỗi hạng mục đều có tỷ trọng giống nhau',highlights
  ],2,'Số liệu nên dùng: '+highlights+'.','Chọn số liệu nổi bật và đối chiếu thay vì liệt kê toàn bộ.')
 ];
}
function stageAnswers(k){state.stageAnswers ||= {};return state.stageAnswers[k] ||= {}}
function stageCount(k){const a=stageAnswers(k);return stageQuestions(k).filter((q,i)=>Object.prototype.hasOwnProperty.call(a,i)&&Number(a[i])===q.answer).length}
function stageComplete(k){return stageCount(k)===stageQuestions(k).length}
function stageNotes(){
 const n=[];for(const k of ['overview','body'])stageQuestions(k).forEach((q,i)=>{const a=stageAnswers(k);if(Object.prototype.hasOwnProperty.call(a,i)&&Number(a[i])===q.answer)n.push([q.title,q.note])});return n;
}
function stageQuiz(k){
 const qs=stageQuestions(k),a=stageAnswers(k);state.stageCursor ||= {};
 const at=Math.min(qs.length,Math.max(0,Number(state.stageCursor[k])||0));
 const title=k==='overview'?'Phân tích trước khi viết Overview':'Phân nhóm trước khi viết Body';
 let html='<h2>'+title+'</h2><p class="meta">'+(k==='overview'?'Tìm một tỷ trọng cao nhất toàn bài (ý 1) và một đặc điểm nhất quán hoặc tương phản nổi bật (ý 2).':'Xác định các nhóm dành cho Body 1, Body 2 và số liệu cần dùng.')+'</p><div class="pie-analysis-progress"><span>Đã hoàn thành '+stageCount(k)+'/'+qs.length+' ý</span><div><i style="width:'+(stageCount(k)/qs.length*100)+'%"></i></div></div>';
 if(at===qs.length&&stageComplete(k))return html+'<div class="pie-success"><strong>✓ Hoàn thành phần chuẩn bị</strong><p>Thông tin đã được lưu trong ghi chú.</p><div class="pie-analysis-actions"><button class="btn secondary" type="button" data-stage-restart="'+k+'">Xem lại</button><button class="btn" type="button" data-stage-finish="'+k+'">Bắt đầu viết '+(k==='overview'?'Overview':'Body 1')+' →</button></div></div>';
 const i=Math.min(at,qs.length-1),q=qs[i],v=a[i],correct=v!==undefined&&Number(v)===q.answer;
 return html+'<div class="pie-analysis-card"><span class="pie-q-label">Câu '+(i+1)+'/'+qs.length+' · '+esc(q.title)+'</span><h3>'+esc(q.question)+'</h3><div class="pie-mcq">'+q.options.map((opt,j)=>'<button type="button" data-stage-choice="'+j+'" data-stage="'+k+'" class="pie-option'+(v!==undefined&&Number(v)===j?' chosen '+(correct?'correct':'incorrect'):'')+'" '+(correct?'disabled':'')+'><span>'+String.fromCharCode(65+j)+'</span>'+esc(opt)+'</button>').join('')+'</div>'+(v!==undefined?'<div class="pie-explain '+(correct?'good':'retry')+'"><strong>'+(correct?'✓ Chính xác':'Chưa đúng')+'</strong><p>'+esc(q.reason)+(correct?' — '+esc(q.note):'')+'</p></div>':'')+'<div class="pie-analysis-actions"><button type="button" class="btn secondary" data-stage-back="'+k+'" '+(i===0?'disabled':'')+'>← Câu trước</button>'+(correct?'<button type="button" class="btn" data-stage-next="'+k+'">'+(i===qs.length-1?'Hoàn tất':'Câu tiếp theo →')+'</button>':'')+'</div></div>';
}
function ensureAnalysis(){
 if(state.analysisVersion!==PIE_ANALYSIS_VERSION){
  state.analysisVersion=PIE_ANALYSIS_VERSION;
  state.analysisAnswers={};state.analysisCursor=0;state.stageAnswers={};state.stageCursor={};state.stageReady={};
 }
 if(state.overviewVersion!==PIE_OVERVIEW_VERSION){
  // Change only the Overview quiz; preserve previous analysis, Body answers and drafts.
  state.overviewVersion=PIE_OVERVIEW_VERSION;
  state.stageAnswers ||= {};state.stageAnswers.overview={};
  state.stageCursor ||= {};state.stageCursor.overview=0;
  state.stageReady ||= {};state.stageReady.overview=false;
 }
 state.analysisAnswers=state.analysisAnswers||{};
 const qs=analysisQuestions();
 state.analysisCursor=Math.max(0,Math.min(Number(state.analysisCursor)||0,qs.length));
}
function completedAnalysis(){
 ensureAnalysis();
 return analysisQuestions().filter((q,i)=>Object.prototype.hasOwnProperty.call(state.analysisAnswers,i)&&Number(state.analysisAnswers[i])===q.answer);
}
function analysisNotes(){
 ensureAnalysis();
 const qs=analysisQuestions(),rows=qs.filter((q,i)=>Object.prototype.hasOwnProperty.call(state.analysisAnswers,i)&&Number(state.analysisAnswers[i])===q.answer);
 return [...rows.map(q=>[q.title.replace(/^\d+\s*·\s*/,''),q.note]),...stageNotes()];
}
function noteHTML(){
 const notes=analysisNotes(),count=analysisQuestions().length+stageQuestions('overview').length+stageQuestions('body').length;
 return '<aside class="pie-note" aria-label="Ghi chú phân tích đề"><header><span>✎ GHI CHÚ PHÂN TÍCH</span><small>'+notes.length+'/'+count+' ý</small></header><div class="pie-note-body">'+
 (notes.length?notes.map(([label,value])=>'<div class="pie-note-line"><strong>'+esc(label)+'</strong><span>'+esc(value)+'</span></div>').join(''):'<p class="meta">Trả lời các câu hỏi phân tích. Ý đúng sẽ tự được lưu vào tờ ghi chú này.</p>')+
 '</div><div class="pie-note-extra"><label for="analysisNotes">Ghi chú bổ sung (không bắt buộc)</label><textarea id="analysisNotes" rows="4" placeholder="Ghi lại nhận xét khác mà em phát hiện...">'+esc(state.notes||'')+'</textarea></div></aside>';
}
function analysisStep(){
 ensureAnalysis();
 const qs=analysisQuestions(),pos=state.analysisCursor;
 let box='<h2>01. Phân tích đề từng bước</h2><p class="meta">Quan sát biểu đồ bên trái, chọn đáp án phù hợp. Mỗi kết luận đúng được ghi lại để dùng khi viết Introduction, Overview và Body.</p>'+
 '<div class="pie-analysis-progress"><span>Đã phân tích '+completedAnalysis().length+'/'+qs.length+' ý</span><div><i style="width:'+(completedAnalysis().length/qs.length*100)+'%"></i></div></div>';
 if(pos===qs.length){
  box+='<div class="pie-success"><strong>✓ Đã hoàn thành phân tích</strong><p>Các ý chính đã được đưa vào tờ note, có thể xem lại khi viết. Em vẫn có thể sửa câu trả lời ở bất kỳ bước nào.</p><div class="pie-analysis-actions"><button class="btn secondary" type="button" id="restartAnalysis">Xem lại câu hỏi</button><button class="btn" type="button" id="startIntroduction">Tiếp tục: Viết Introduction →</button></div></div>';
 }else{
  const q=qs[pos],entry=state.analysisAnswers[pos],correct=Number(entry)===q.answer;
  box+='<div class="pie-analysis-card"><span class="pie-q-label">'+esc(q.title)+' · Câu '+(pos+1)+'/'+qs.length+'</span><h3>'+esc(q.question)+'</h3>'+
  '<div class="pie-mcq">'+q.options.map((text,i)=>'<button type="button" data-pie-option="'+i+'" class="pie-option'+(entry!==undefined&&Number(entry)===i?' chosen':'')+(entry!==undefined&&Number(entry)===i?(correct?' correct':' incorrect'):'')+'" '+(correct?'disabled':'')+'><span>'+String.fromCharCode(65+i)+'</span>'+esc(text)+'</button>').join('')+'</div>'+
  (entry!==undefined?'<div class="pie-explain '+(correct?'good':'retry')+'"><strong>'+(correct?'✓ Chính xác':'Chưa đúng, hãy xem lại biểu đồ')+'</strong><p>'+(correct?esc(q.reason)+' — <b>'+esc(q.note)+'</b>':esc(q.reason))+'</p></div>':'')+
  '<div class="pie-analysis-actions"><button class="btn secondary" type="button" id="previousQuestion" '+(pos===0?'disabled':'')+'>← Câu trước</button>'+(correct?'<button class="btn" type="button" id="nextQuestion">'+(pos===qs.length-1?'Hoàn tất phân tích':'Câu tiếp theo →')+'</button>':'')+'</div></div>';
 }

 return '<div class="pie-study-layout"><div class="pie-writing-area">'+box+'</div>'+noteHTML()+'</div>';
}
function stepBody(){
 const s=state.step;
 if(s===0)return analysisStep();
 if(s===5){
  const combined=parts.map(p=>state.drafts[p]||'').filter(Boolean).join('\n\n');
  return '<h2>Bài viết hoàn chỉnh</h2><p class="meta">Tổng hợp Introduction, Overview và hai đoạn Body (tối thiểu 150 từ).</p>'+
   '<div class="pie-study-layout"><div class="pie-writing-area"><div class="field"><label for="writing">Bài viết của em</label><textarea id="writing" rows="17">'+esc(state.drafts.full||combined)+'</textarea></div><div class="meta" id="wordCount">'+words(state.drafts.full||combined)+' từ</div>'+
   '<div class="buttons"><button class="btn secondary" id="assemble" type="button">Gộp 4 phần</button><button class="btn" id="download" type="button">Tải bài viết (.txt)</button><button class="btn secondary" id="review" type="button">Kiểm tra cơ bản</button></div><div class="feedback" id="feedback" hidden></div></div>'+noteHTML()+'</div>';
 }
 const stage=s===2?'overview':s===3?'body':null;
 if(stage&&!state.stageReady?.[stage])return '<div class="pie-study-layout"><div class="pie-writing-area">'+stageQuiz(stage)+'</div>'+noteHTML()+'</div>';
 const part=parts[s-1],hints={intro:'Paraphrase nội dung, chủ thể và đơn vị (%). Không đưa số liệu chi tiết vào Introduction.',overview:'Tóm tắt 2 đặc điểm nổi bật nhất. Không liệt kê tất cả tỷ lệ.',body1:'Chọn nhóm thông tin đầu tiên và mô tả số liệu quan trọng, so sánh có chọn lọc.',body2:'Mô tả nhóm còn lại, đối chiếu với Body 1, lưu ý trường hợp tương đồng hoặc ngoại lệ.'};
 return '<div class="pie-study-layout"><div class="pie-writing-area"><div class="question">'+esc(hints[part])+'</div>'+
 '<div class="field"><label for="writing">Bài viết của em</label><textarea id="writing" rows="12" placeholder="Write in English...">'+esc(state.drafts[part]||'')+'</textarea></div>'+
 '<div class="meta" id="wordCount">'+words(state.drafts[part]||'')+' từ</div><div class="buttons"><button class="btn secondary" id="review" type="button">Kiểm tra cơ bản</button>'+(part==='overview'?'<button class="btn secondary" id="modelToggle" type="button">Xem ví dụ Overview</button>':'')+'<button class="btn" type="button" data-writing-next="'+s+'">'+(s===1?'Phân tích Overview →':s===2?'Phân nhóm Body →':s===3?'Viết Body 2 →':'Hoàn thiện bài →')+'</button></div><div class="feedback" id="feedback" hidden></div>'+
 (part==='overview'?'<div class="model" id="model" hidden><b>Gợi ý Overview (tham khảo)</b><p>'+esc(data.overview)+'</p></div>':'')+'</div>'+noteHTML()+'</div>';
}
function render(){
 if(!data)return;
 const s=state.step;$('welcome').hidden=state.started;$('workspace').hidden=!state.started;
 if(!state.started){$('studentName').value=student?.name||'';$('studentClass').value=student?.className||'';document.body.classList.remove('pie-booting');return}
 ensureAnalysis();
 $('studentInfo').textContent=state.name+' · '+state.className;
 $('stepNav').innerHTML=steps.map((x,i)=>'<button type="button" data-step="'+i+'" '+(i>0&&completedAnalysis().length!==analysisQuestions().length&&!parts.some(p=>String(state.drafts[p]||'').trim())?'disabled title="Hoàn thành phân tích trước khi viết"':'')+' class="'+(s===i?'active':'')+' '+(i<s?'done':'')+'">'+(i+1)+'. '+x+'</button>').join('');
 $('progress').style.width=(s+1)/steps.length*100+'%';$('stepTitle').textContent=section(s);$('stepRoot').innerHTML=stepBody();
 $('stepNav').querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>move(Number(b.dataset.step)));
 if($('analysisNotes'))$('analysisNotes').oninput=e=>{state.notes=e.target.value;save()};
 document.querySelectorAll('[data-pie-option]').forEach(b=>b.onclick=()=>{
  const index=state.analysisCursor,answer=Number(b.dataset.pieOption);
  state.analysisAnswers[index]=answer;save();render();
 });
 if($('previousQuestion'))$('previousQuestion').onclick=()=>{state.analysisCursor=Math.max(0,state.analysisCursor-1);save();render()};
 if($('nextQuestion'))$('nextQuestion').onclick=()=>{state.analysisCursor=Math.min(analysisQuestions().length,state.analysisCursor+1);save();render()};
 if($('restartAnalysis'))$('restartAnalysis').onclick=()=>{state.analysisCursor=0;save();render()};
 if($('startIntroduction'))$('startIntroduction').onclick=()=>move(1);
 document.querySelectorAll('[data-stage-choice]').forEach(b=>b.onclick=()=>{const k=b.dataset.stage;state.stageCursor ||= {};stageAnswers(k)[Number(state.stageCursor[k]||0)]=Number(b.dataset.stageChoice);save();render()});
 document.querySelectorAll('[data-stage-next]').forEach(b=>b.onclick=()=>{const k=b.dataset.stageNext;state.stageCursor[k]=Math.min(stageQuestions(k).length,(state.stageCursor[k]||0)+1);save();render()});
 document.querySelectorAll('[data-stage-back]').forEach(b=>b.onclick=()=>{const k=b.dataset.stageBack;state.stageCursor[k]=Math.max(0,(state.stageCursor[k]||0)-1);save();render()});
 document.querySelectorAll('[data-stage-restart]').forEach(b=>b.onclick=()=>{state.stageCursor[b.dataset.stageRestart]=0;save();render()});
 document.querySelectorAll('[data-stage-finish]').forEach(b=>b.onclick=()=>{const k=b.dataset.stageFinish;if(!stageComplete(k))return;state.stageReady ||= {};state.stageReady[k]=true;save();render()});
 document.querySelectorAll('[data-writing-next]').forEach(b=>b.onclick=()=>move(Number(b.dataset.writingNext)+1));
 if($('writing'))$('writing').oninput=updateText;
 if($('modelToggle'))$('modelToggle').onclick=()=>{$('model').hidden=!$('model').hidden};
 if($('review'))$('review').onclick=review;
 if($('assemble'))$('assemble').onclick=()=>{state.drafts.full=parts.map(p=>state.drafts[p]||'').filter(Boolean).join('\n\n');save();render()};
 document.body.classList.remove('pie-booting');
 if($('download'))$('download').onclick=()=>{const blob=new Blob([data.title+'\n'+state.name+' | '+state.className+'\n\n'+(state.drafts.full||'')],{type:'text/plain;charset=utf-8'});const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='IELTS_Writing_Task1_'+slug+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
}

// On-demand grammar review: local rules work offline; LanguageTool offers broader suggestions.
// The student's text is sent to LanguageTool only after clicking the review button.
function localWritingIssues(t){
 const issues=[],seen=new Set();
 function add(match,before,after,message,kind='Ngữ pháp',priority=2){
  if(!match)return;
  const from=match.index,to=from+match[0].length,key=from+':'+to+':'+after;
  if(seen.has(key))return;seen.add(key);
  issues.push({from,to,original:match[0],replacement:after,message,kind,priority,source:'local'});
 }
 const rules=[
  {re:/\b(the\s+)?(two|three|four|five)\s+pie\s+chart\s+illustrates\b/gi,fix:m=>m[0].replace(/chart\s+illustrates$/i,'charts illustrate'),msg:'Sau số đếm cần charts (số nhiều), và chủ ngữ số nhiều đi với illustrate.'},
  {re:/\bmeans\s+of\s+transportation\s+of\s+inhabitant\b/gi,fix:()=>'modes of transport used by residents',msg:'Sửa số nhiều inhabitants/residents và dùng cấu trúc tự nhiên hơn “modes of transport used by residents”.'},

  {re:/\b(the\s+)?(two|three|four|five|six|seven|eight|nine|ten)\s+(pie|bar)\s+chart\b/gi,fix:m=>m[0]+'s',msg:'Danh từ đếm được đứng sau số đếm lớn hơn một phải dùng dạng số nhiều.'},
  {re:/\b(an?|the)\s+(inhabitant|resident|citizen)\s+in\s+(two|three|four)\s+cities\b/gi,fix:m=>m[0].replace(/\b(inhabitant|resident|citizen)\b/i,x=>x+'s'),msg:'Nhắc đến cư dân của nhiều thành phố cần sử dụng danh từ số nhiều.'},
  {re:/\bof\s+inhabitant\b/gi,fix:m=>'of inhabitants',msg:'Inhabitant là danh từ đếm được; ở đây cần dùng inhabitants hoặc residents.'},
  {re:/\b(city\s+[a-z])\b/gi,fix:m=>m[0].replace(/[a-z]$/i,c=>c.toUpperCase()),msg:'Tên thành phố được ký hiệu bằng chữ cái viết hoa.',kind:'Viết hoa'},
  {re:/\b(the\s+)?pie\s+charts\s+illustrates\b/gi,fix:m=>m[0].replace(/illustrates$/i,'illustrate'),msg:'Chủ ngữ số nhiều charts đi với illustrate, không phải illustrates.'},
  {re:/\b(the\s+)?pie\s+chart\s+illustrate\b/gi,fix:m=>m[0].replace(/illustrate$/i,'illustrates'),msg:'Chủ ngữ số ít chart đi với illustrates.'},
  {re:/\b(the\s+)?(three|four|five)\s+pie\s+charts\s+illustrates\b/gi,fix:m=>m[0].replace(/illustrates$/i,'illustrate'),msg:'Chủ ngữ số nhiều yêu cầu động từ illustrate.'},
  {re:/\b(informations|equipments|advices)\b/gi,fix:m=>({informations:'information',equipments:'equipment',advices:'advice'})[m[0].toLowerCase()],msg:'Đây là danh từ không đếm được trong cách dùng thông thường.'},
  {re:/\b(the\s+)?percentage\s+of\s+([A-Za-z\s]+?)\s+were\b/gi,fix:m=>m[0].replace(/\bwere$/i,'was'),msg:'Percentage là danh từ số ít khi đóng vai trò chủ ngữ.'}
 ];
 for(const rule of rules){for(const m of t.matchAll(rule.re)){const replacement=rule.fix(m);if(replacement!==m[0])add(m,m[0],replacement,rule.msg,rule.kind||'Ngữ pháp')}}
 if(state.step===1){
  const m=/\b(the\s+)?(pie\s+charts?|charts?)\s+(?:illustrate|illustrates|show|shows)\b/i.exec(t);
  if(!m && t.trim())issues.push({from:-1,to:-1,original:'',replacement:'',message:'Introduction nên giới thiệu biểu đồ và nội dung so sánh, tránh chỉ mô tả số liệu.',kind:'Task Achievement',priority:1,source:'local'});
  if(/\bmeans of transportation of\b/i.test(t)){
   const m=/means of transportation of/i.exec(t);
   add(m,m[0],'modes of transport used by','Cách diễn đạt tự nhiên hơn: “modes of transport used by residents”.','Diễn đạt',1);
  }
  if(/\b(different|various)\s+means\s+of\s+transportation\b/i.test(t)){
   // Only a style suggestion, not a hard grammar error.
   const m=/\b(different|various)\s+means\s+of\s+transportation\b/i.exec(t);
   add(m,m[0],'different modes of transport','Trong IELTS Task 1, “modes of transport” thường gọn và phù hợp hơn.','Diễn đạt',1);
  }
 }
 if(state.step===5&&words(t)<150)issues.push({from:-1,to:-1,original:'',replacement:'',message:'Bài Task 1 hoàn chỉnh thường cần tối thiểu 150 từ.',kind:'Độ dài',priority:1,source:'local'});
 if(state.step!==1&&state.step!==2&&state.step!==0&&!/\d/.test(t)&&t.trim())issues.push({from:-1,to:-1,original:'',replacement:'',message:'Body nên dùng số liệu cụ thể để hỗ trợ nhận xét.',kind:'Task Achievement',priority:1,source:'local'});
 if(data.dataType==='Static'&&/\b(increased|decreased|rose|fell|declined)\b/i.test(t))issues.push({from:-1,to:-1,original:'',replacement:'',message:'Đây là dữ liệu Static; không nên mô tả thay đổi theo thời gian nếu đề không có mốc thời gian.',kind:'Task Achievement',priority:2,source:'local'});
 return issues;
}
function languageToolIssues(raw,t){
 return (raw.matches||[]).filter(m=>Number.isFinite(m.offset)&&m.offset>=0&&m.offset+m.length<=t.length).map(m=>({
  from:m.offset,to:m.offset+m.length,original:t.slice(m.offset,m.offset+m.length),
  replacement:m.replacements?.[0]?.value||'',message:m.message||'Kiểm tra lại cách diễn đạt.',
  kind:m.rule?.issueType==='misspelling'?'Chính tả':m.rule?.category?.name||'Ngữ pháp',
  priority:3,source:'languagetool'
 }));
}
function mergeWritingIssues(local,remote){
 const issues=[...remote,...local].sort((a,b)=>b.priority-a.priority||a.from-b.from),seen=new Set(),out=[];
 for(const issue of issues){
  const key=issue.from+':'+issue.to+':'+issue.replacement.toLowerCase();
  if(seen.has(key))continue;
  if(issue.from>=0&&out.some(x=>x.from>=0&&x.from<issue.to&&issue.from<x.to))continue;
  seen.add(key);out.push(issue);
 }
 return out.sort((a,b)=>a.from-b.from);
}
function showWritingReview(issues,remoteStatus){
 const el=$('feedback');if(!el)return;
 el.hidden=false;
 let html='<div class="writing-review"><div class="writing-review-head"><strong>'+issues.length+' điểm cần xem lại</strong><small>'+esc(remoteStatus)+'</small></div>';
 if(!issues.length)html+='<p>Chưa phát hiện lỗi theo các quy tắc có thể kiểm tra. Điều này không có nghĩa bài viết hoàn toàn chính xác hoặc đạt một band IELTS cụ thể.</p>';
 else html+='<div class="writing-review-list">'+issues.map((issue,i)=>
  '<div class="writing-review-item"><div class="writing-review-label">'+esc(issue.kind)+'</div>'+
  (issue.original?'<div class="writing-review-original">Trong bài: <del>'+esc(issue.original)+'</del></div>':'')+
  '<p>'+esc(issue.message)+'</p>'+
  (issue.replacement?'<div class="writing-review-suggest">Gợi ý: <strong>'+esc(issue.replacement)+'</strong></div><button class="btn secondary writing-apply" type="button" data-apply-issue="'+i+'">Áp dụng sửa này</button>':'')+
  '</div>').join('')+'</div>';
 html+='</div>';el.innerHTML=html;
 el.querySelectorAll('[data-apply-issue]').forEach(b=>b.onclick=()=>{
  const issue=issues[Number(b.dataset.applyIssue)],input=$('writing');if(!input||!issue||issue.from<0)return;
  const text=input.value;
  if(text.slice(issue.from,issue.to)!==issue.original){review();return;}
  input.value=text.slice(0,issue.from)+issue.replacement+text.slice(issue.to);
  updateText();review();
 });
}
let writingReviewRequest=0;
async function review(){
 const input=$('writing'),t=input?.value.trim()||'',el=$('feedback'),button=$('review');
 if(!el)return;
 const request=++writingReviewRequest;
 const originalValue=input?.value||'';
 if(!t){showWritingReview([{from:-1,to:-1,original:'',replacement:'',kind:'Nội dung',message:'Hãy viết nội dung trước khi kiểm tra.',priority:1}], 'Chưa có bài viết');return}
 if(button){button.disabled=true;button.textContent='Đang kiểm tra…'}
 const local=localWritingIssues(input.value);
 showWritingReview(local,'Đang kiểm tra thêm lỗi ngữ pháp và chính tả…');
 let remote=[],status='Kiểm tra bằng quy tắc nội bộ';
 try{
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8000);
  try{
   const params=new URLSearchParams({text:input.value,language:'en-GB'});
   const response=await fetch('https://api.languagetool.org/v2/check',{method:'POST',body:params,signal:controller.signal});
   if(!response.ok)throw Error('HTTP '+response.status);
   remote=languageToolIssues(await response.json(),input.value);
   status='Đã đối chiếu thêm bằng LanguageTool · Gợi ý cần được xem xét';
  }finally{clearTimeout(timeout)}
 }catch(e){status='Dịch vụ kiểm tra mở rộng không khả dụng; đang hiển thị kiểm tra nội bộ';}
 if(request!==writingReviewRequest)return;
 if(button){button.disabled=false;button.textContent='Kiểm tra lại chính tả & ngữ pháp'}
 // The text may have changed during the asynchronous request.
 if(input.value!==originalValue){showWritingReview(localWritingIssues(input.value),'Bài đã thay đổi; bấm kiểm tra lại để cập nhật');return}
 showWritingReview(mergeWritingIssues(local,remote),status);
}
function move(i){if(i<0||i>=6)return;if(i>0&&completedAnalysis().length!==analysisQuestions().length&&!parts.some(p=>String(state.drafts[p]||'').trim())){state.step=0;render();return;}state.step=i;save();render();const top=$('stepNav').getBoundingClientRect().top+scrollY-90;scrollTo({top,behavior:'smooth'})}
async function init(){try{const r=await fetch('../../pie-chart-data.json?v=20261116-01',{cache:'no-store'});if(!r.ok)throw Error('Không tải được dữ liệu đề');data=(await r.json())[slug];if(!data)throw Error('Không tìm thấy bài');document.title=data.title+' — Writing Task 1';$('title').textContent=data.title;$('type').textContent='PIE CHART · '+data.dataType.toUpperCase();renderTask();showProvenance();student=getStudent();store='SC_WT1_PIE_V1_'+slug+'_'+((student?.name||'guest')+'|'+(student?.className||'')).toLowerCase();try{state=JSON.parse(localStorage.getItem(store)||'null')}catch{}state=state||{started:false,name:'',className:'',step:0,checked:{},notes:'',drafts:{}};state.drafts=state.drafts||{};state.checked=state.checked||{};ensureAnalysis();if(!Number.isInteger(state.step)||state.step<0||state.step>=steps.length)state.step=0;if(!state.started&&student?.name?.trim()&&student?.className?.trim()){state.started=true;state.name=student.name.trim();state.className=student.className.trim();save();}$('start').onclick=()=>{const name=$('studentName').value.trim(),cls=$('studentClass').value.trim();if(!name){$('startError').textContent='Vui lòng nhập họ tên.';return}state.name=name;state.className=cls;state.started=true;save();render()};render()}catch(e){document.body.classList.remove('pie-booting');$('loadError').textContent='Không tải được bài: '+e.message}}
init();
})();