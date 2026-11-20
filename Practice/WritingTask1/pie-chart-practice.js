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

const PIE_ANALYSIS_VERSION=3;
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
 mk('05 · Tìm tỷ trọng lớn nhất','Trong '+G[0].name+', hạng mục nào đứng đầu?',[
 first.top.name+' — '+first.top.value+'%',first.bottom.name+' — '+first.bottom.value+'%',first.second.name+' — '+first.second.value+'%'
 ],0,'Tỷ trọng lớn nhất ở '+G[0].name+': '+first.top.name+' ('+first.top.value+'%).','So sánh trực tiếp các tỷ lệ của cùng một biểu đồ.'),
 mk('06 · Tìm tỷ trọng nhỏ nhất','Trong '+G[0].name+', hạng mục nào thấp nhất?',[
 first.second.name+' — '+first.second.value+'%',first.bottom.name+' — '+first.bottom.value+'%',first.top.name+' — '+first.top.value+'%'
 ],1,'Tỷ trọng nhỏ nhất ở '+G[0].name+': '+first.bottom.name+' ('+first.bottom.value+'%).','Ưu tiên nêu hạng mục nhỏ nhất khi tạo Overview hoặc Body.'),
 mk('07 · So sánh biểu đồ khác','Trong '+G[G.length-1].name+', hạng mục nào lớn nhất?',[
 last.bottom.name+' — '+last.bottom.value+'%',last.top.name+' — '+last.top.value+'%',last.second.name+' — '+last.second.value+'%'
 ],1,'Tỷ trọng lớn nhất ở '+G[G.length-1].name+': '+last.top.name+' ('+last.top.value+'%).','Tìm điểm tương đồng hoặc đối lập giữa các biểu đồ.'),
 mk('08 · Phân nhóm Body','Nên chia thông tin thành 2 đoạn Body theo cách nào?',[
 'Liệt kê tất cả các số liệu trong một câu','Body 1 phân tích nhóm nổi bật; Body 2 so sánh nhóm còn lại và ngoại lệ','Suy đoán nguyên nhân của tỷ lệ'
 ],1,'Dàn ý: Body 1 — '+G[0].name+' ('+first.top.name+' dẫn đầu); Body 2 — '+G.slice(1).map(x=>x.name).join(', ')+' (so sánh tỷ trọng và khác biệt).','Nhóm thông tin theo đặc điểm có ý nghĩa, dùng số liệu chọn lọc và đối chiếu.'),
 mk('09 · Xác định Overview','Nhận xét nào an toàn để viết Overview?',[
 'Các con số chắc chắn tiếp tục tăng trong tương lai',
 first.top.name+' đứng đầu ở '+G[0].name+', trong khi '+last.top.name+' có tỷ trọng lớn nhất ở '+G[G.length-1].name+'.',
 'Mọi nhóm đều có tỷ lệ hoàn toàn giống nhau'
 ],1,'Overview: '+first.top.name+' dẫn đầu tại '+G[0].name+'; '+last.top.name+' chiếm tỷ trọng cao nhất tại '+G[G.length-1].name+'.','Overview chỉ nêu đặc điểm lớn nhất, tránh đưa toàn bộ số liệu và tránh suy diễn.'),
 ];
// Include middle groups (e.g. City B) in both the quiz and automatic notes.
 if(G.length>2){
  for(let g=1;g<G.length-1;g++){
   const mid=headline(G[g]),name=G[g].name,idx=data.labels.indexOf(mid.top.name);
   q.splice(q.length-2,0,
    mk('Phân tích '+name,'Trong '+name+', phương tiện nào chiếm tỷ trọng lớn nhất?',[
     mid.second.name+' — '+mid.second.value+'%',mid.top.name+' — '+mid.top.value+'%',mid.bottom.name+' — '+mid.bottom.value+'%'
    ],1,'Tỷ trọng lớn nhất tại '+name+': '+mid.top.name+' ('+mid.top.value+'%).','So sánh các tỷ lệ của '+name+' trước khi chọn.'),
    mk('Đối chiếu '+name,'Tỷ trọng '+mid.top.name+' ở cả ba thành phố được mô tả đúng như thế nào?',[
     'Cả ba thành phố đều có tỷ trọng giống nhau',
     mid.top.name+' là hạng mục lớn nhất ở cả ba thành phố',
     G.map(x=>x.name+': '+x.values[idx]+'%').join(' · ')
    ],2,'So sánh '+mid.top.name+': '+G.map(x=>x.name+' '+x.values[idx]+'%').join('; ')+'.','Đối chiếu cùng một phương tiện giữa tất cả thành phố.')
   );
  }
 }
 q.forEach((item,index)=>item.title=String(index+1).padStart(2,'0')+' · '+item.title.replace(/^\d+\s*·\s*/, ''));
 
 if(!isStatic && G.length>1){
 const index=G[0].values.indexOf(first.top.value),a=G[0].values[index],b=G[G.length-1].values[index];
 q.push(mk('10 · So sánh thời gian','Tỷ trọng của '+first.top.name+' thay đổi thế nào từ '+G[0].name+' đến '+G[G.length-1].name+'?',[
 b>a?'Tăng từ '+a+'% lên '+b+'%':b<a?'Giảm từ '+a+'% xuống '+b+'%':'Giữ nguyên ở '+a+'%',
 b>a?'Giảm':b<a?'Tăng':'Tăng mạnh',
 'Không có đủ dữ liệu để so sánh'
 ],0,first.top.name+': '+a+'% → '+b+'% ('+(b>a?'tăng':b<a?'giảm':'không đổi')+' '+Math.abs(b-a)+' điểm phần trăm).','Đơn vị chênh lệch giữa hai tỷ lệ là điểm phần trăm.'));
 }
 return q;
}
function ensureAnalysis(){
 if(state.analysisVersion!==PIE_ANALYSIS_VERSION){
  state.analysisVersion=PIE_ANALYSIS_VERSION;
  state.analysisAnswers={};state.analysisCursor=0;
 }
 state.analysisAnswers=state.analysisAnswers||{};
 const qs=analysisQuestions();
 state.analysisCursor=Math.max(0,Math.min(Number(state.analysisCursor)||0,qs.length));
}
function completedAnalysis(){
 ensureAnalysis();
 return analysisQuestions().filter((q,i)=>Number(state.analysisAnswers[i])===q.answer);
}
function analysisNotes(){
 ensureAnalysis();
 const qs=analysisQuestions(),rows=qs.filter((q,i)=>Number(state.analysisAnswers[i])===q.answer);
 return rows.map(q=>[q.title.replace(/^\d+\s*·\s*/,''),q.note]);
}
function noteHTML(){
 const notes=analysisNotes(),count=analysisQuestions().length;
 return '<aside class="pie-note" aria-label="Ghi chú phân tích đề"><header><span>✎ GHI CHÚ PHÂN TÍCH</span><small>'+notes.length+'/'+count+' ý</small></header><div class="pie-note-body">'+
 (notes.length?notes.map(([label,value])=>'<div class="pie-note-line"><strong>'+esc(label)+'</strong><span>'+esc(value)+'</span></div>').join(''):'<p class="meta">Trả lời các câu hỏi phân tích. Ý đúng sẽ tự được lưu vào tờ ghi chú này.</p>')+
 (state.notes?.trim()?'<div class="pie-note-line"><strong>Ghi chú thêm của em</strong><span>'+esc(state.notes)+'</span></div>':'')+
 '</div></aside>';
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
 box+='<div class="field"><label for="analysisNotes">Ghi chú bổ sung (không bắt buộc)</label><textarea id="analysisNotes" rows="3" placeholder="Ghi lại nhận xét khác mà em phát hiện...">'+esc(state.notes||'')+'</textarea></div>';
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
 const part=parts[s-1],hints={intro:'Paraphrase nội dung, chủ thể và đơn vị (%). Không đưa số liệu chi tiết vào Introduction.',overview:'Tóm tắt 2 đặc điểm nổi bật nhất. Không liệt kê tất cả tỷ lệ.',body1:'Chọn nhóm thông tin đầu tiên và mô tả số liệu quan trọng, so sánh có chọn lọc.',body2:'Mô tả nhóm còn lại, đối chiếu với Body 1, lưu ý trường hợp tương đồng hoặc ngoại lệ.'};
 return '<h2>Viết '+esc(section(s))+'</h2><div class="pie-study-layout"><div class="pie-writing-area"><div class="question">'+esc(hints[part])+'</div>'+
 '<div class="field"><label for="writing">'+esc(section(s))+'</label><textarea id="writing" rows="12" placeholder="Write in English...">'+esc(state.drafts[part]||'')+'</textarea></div>'+
 '<div class="meta" id="wordCount">'+words(state.drafts[part]||'')+' từ</div><div class="buttons"><button class="btn secondary" id="review" type="button">Kiểm tra cơ bản</button>'+(part==='overview'?'<button class="btn secondary" id="modelToggle" type="button">Xem ví dụ Overview</button>':'')+'</div><div class="feedback" id="feedback" hidden></div>'+
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
 if($('analysisNotes'))$('analysisNotes').oninput=e=>{state.notes=e.target.value;save();const note=document.querySelector('.pie-note');if(note)note.outerHTML=noteHTML()};
 document.querySelectorAll('[data-pie-option]').forEach(b=>b.onclick=()=>{
  const index=state.analysisCursor,answer=Number(b.dataset.pieOption);
  state.analysisAnswers[index]=answer;save();render();
 });
 if($('previousQuestion'))$('previousQuestion').onclick=()=>{state.analysisCursor=Math.max(0,state.analysisCursor-1);save();render()};
 if($('nextQuestion'))$('nextQuestion').onclick=()=>{state.analysisCursor=Math.min(analysisQuestions().length,state.analysisCursor+1);save();render()};
 if($('restartAnalysis'))$('restartAnalysis').onclick=()=>{state.analysisCursor=0;save();render()};
 if($('startIntroduction'))$('startIntroduction').onclick=()=>move(1);
 if($('writing'))$('writing').oninput=updateText;
 if($('modelToggle'))$('modelToggle').onclick=()=>{$('model').hidden=!$('model').hidden};
 if($('review'))$('review').onclick=review;
 if($('assemble'))$('assemble').onclick=()=>{state.drafts.full=parts.map(p=>state.drafts[p]||'').filter(Boolean).join('\n\n');save();render()};
 document.body.classList.remove('pie-booting');
 if($('download'))$('download').onclick=()=>{const blob=new Blob([data.title+'\n'+state.name+' | '+state.className+'\n\n'+(state.drafts.full||'')],{type:'text/plain;charset=utf-8'});const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='IELTS_Writing_Task1_'+slug+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
}
function review(){const t=$('writing')?.value.trim()||'',found=[];if(!t)found.push('Chưa có nội dung để kiểm tra.');if(state.step===5&&words(t)<150)found.push('Task 1 thường yêu cầu tối thiểu 150 từ.');if(state.step!==1&&!/\d/.test(t)&&state.step!==2)found.push('Nên có số liệu phù hợp để hỗ trợ các nhận xét chính.');if(/\b(increased|decreased|rose|fell|declined)\b/i.test(t)&&data.dataType==='Static')found.push('Đây là biểu đồ Static; tránh mô tả thay đổi theo thời gian khi dữ liệu không thể hiện điều đó.');const el=$('feedback');el.hidden=false;el.textContent=found.length?found.join(' '):'Chưa thấy lỗi theo các quy tắc kiểm tra cơ bản. Đây không phải chấm band IELTS tự động.'}
function move(i){if(i<0||i>=6)return;if(i>0&&completedAnalysis().length!==analysisQuestions().length&&!parts.some(p=>String(state.drafts[p]||'').trim())){state.step=0;render();return;}state.step=i;save();render();const top=$('stepNav').getBoundingClientRect().top+scrollY-90;scrollTo({top,behavior:'smooth'})}
async function init(){try{const r=await fetch('../../pie-chart-data.json?v=20261116-01',{cache:'no-store'});if(!r.ok)throw Error('Không tải được dữ liệu đề');data=(await r.json())[slug];if(!data)throw Error('Không tìm thấy bài');document.title=data.title+' — Writing Task 1';$('title').textContent=data.title;$('type').textContent='PIE CHART · '+data.dataType.toUpperCase();renderTask();showProvenance();student=getStudent();store='SC_WT1_PIE_V1_'+slug+'_'+((student?.name||'guest')+'|'+(student?.className||'')).toLowerCase();try{state=JSON.parse(localStorage.getItem(store)||'null')}catch{}state=state||{started:false,name:'',className:'',step:0,checked:{},notes:'',drafts:{}};state.drafts=state.drafts||{};state.checked=state.checked||{};ensureAnalysis();if(!Number.isInteger(state.step)||state.step<0||state.step>=steps.length)state.step=0;if(!state.started&&student?.name?.trim()&&student?.className?.trim()){state.started=true;state.name=student.name.trim();state.className=student.className.trim();save();}$('start').onclick=()=>{const name=$('studentName').value.trim(),cls=$('studentClass').value.trim();if(!name){$('startError').textContent='Vui lòng nhập họ tên.';return}state.name=name;state.className=cls;state.started=true;save();render()};render()}catch(e){document.body.classList.remove('pie-booting');$('loadError').textContent='Không tải được bài: '+e.message}}
init();
})();