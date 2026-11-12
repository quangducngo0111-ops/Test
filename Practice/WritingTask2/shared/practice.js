(()=>{'use strict';
const $=id=>document.getElementById(id);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const C=JSON.parse($('lesson-data').textContent),type=C.type;
const forms={discussion:{title:'Discussion Essay',views:['Quan điểm thứ nhất','Quan điểm thứ hai'],question:'Discuss both views and give your own opinion.',idea:'Hai Body phân tích hai quan điểm đối lập. Trong mở bài và kết bài cần thể hiện quan điểm của bạn.'},advantages:{title:'Advantages & Disadvantages',views:['Lợi ích (Advantages)','Hạn chế (Disadvantages)'],question:'Discuss the advantages and disadvantages.',idea:'Body 1 phân tích lợi ích; Body 2 phân tích hạn chế. Nếu đề hỏi outweigh, cần nêu rõ bên nào mạnh hơn.'},problem:{title:'Problem & Solution',views:['Vấn đề / nguyên nhân','Giải pháp'],question:'What are the problems and what solutions can you suggest?',idea:'Body 1 làm rõ vấn đề hoặc nguyên nhân; Body 2 đề xuất giải pháp trực tiếp xử lý vấn đề đó.'},twopart:{title:'Two-part Questions',views:['Trả lời câu hỏi 1','Trả lời câu hỏi 2'],question:'Answer both questions.',idea:'Hai Body lần lượt trả lời chính xác hai câu hỏi. Tránh chỉ trả lời câu thứ nhất hoặc nêu ý chung.'}};
const F=forms[type];let student={};try{student=JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'{}')}catch{}
$('learner').textContent=student.name?(student.name+' · '+(student.className||'')):'';
$('formType').textContent='BÀI '+String(C.n).padStart(2,'0')+' · '+F.title.toUpperCase();$('pageTitle').textContent=C.title;$('topic').textContent=C.topic;$('prompt').textContent=C.prompt;
const storage='SMARTCOM_WT2_GUIDED_V2_'+type+'_'+C.n+'_'+(student.name||'guest')+'_'+(student.className||'');
let state={step:0,text:{},checked:{}};try{state={...state,...JSON.parse(localStorage.getItem(storage)||'{}')}}catch{}
const save=()=>localStorage.setItem(storage,JSON.stringify(state));
const stepNames=['Phân tích đề','Nhận diện dạng bài','Lập ý Body 1','Logic Chain Body 1','Viết Body 1','Lập ý Body 2','Logic Chain Body 2','Viết Body 2','Mở bài & Kết bài','Viết bài hoàn chỉnh'];
const field=(key,label,hint='',rows=5)=>'<div class="group"><label for="'+key+'">'+esc(label)+'</label>'+(hint?'<p class="help">'+esc(hint)+'</p>':'')+'<textarea id="'+key+'" data-field="'+key+'" rows="'+rows+'" placeholder="Viết câu trả lời của bạn tại đây...">'+esc(state.text[key]||'')+'</textarea></div>';
const sample=(title,body)=>'<details class="sample"><summary>'+esc(title)+' · Xem sau khi tự làm</summary><p>'+esc(body)+'</p></details>';
const scenarios={
Education:['students participating in supervised school projects','teachers assessing progress through real classroom activities'],
Transport:['commuters choosing an affordable bus or train route','a city council investing in safer, more dependable connections'],
Environment:['communities cutting avoidable waste and protecting local habitats','local authorities testing conservation measures in affected districts'],
Health:['patients receiving timely preventive advice','schools and clinics supporting healthier daily routines'],
Technology:['learners using a digital tool with human oversight','organisations evaluating the reliability and limits of new software'],
Work:['employees adapting their working hours to their needs','businesses offering practical training to new staff'],
Economy:['households comparing everyday spending decisions','small businesses managing costs and customer demand'],
Society:['local residents taking part in a community programme','families adjusting to changes in social expectations'],
Culture:['a public institution offering access to cultural activities','community groups protecting local traditions and heritage'],
Tourism:['local guides earning an income from responsible visitors','town councils managing overcrowding near popular sites'],
Travel:['families choosing destinations based on time and cost','regional businesses receiving spending from visitors'],
Lifestyle:['individuals making realistic changes to everyday routines','families weighing convenience against long-term wellbeing'],
Media:['people comparing reports from several sources','young viewers learning to evaluate information critically'],
Housing:['residents looking for affordable homes near jobs','local authorities planning mixed-income neighbourhoods'],
Children:['children practising skills with guidance from adults','schools creating activities for different personalities'],
Science:['researchers cooperating with public institutions','policymakers deciding which scientific projects meet social needs'],
'Urban planning':['planners weighing heritage against housing demand','residents taking part in public consultation']
};
const scenario=(index)=>{let examples=scenarios[C.topic]||['individuals facing this issue in everyday life','institutions implementing practical changes'];return examples[index%examples.length]};
const consequence=(i)=>type==='discussion'
 ?(i===0?'This helps explain why supporters of this position consider it convincing.':'As a result, this alternative may offer greater long-term value.')
 :type==='advantages'?(i===0?'This is a meaningful advantage when the trend is implemented responsibly.':'Nevertheless, this drawback should be considered before the trend is expanded.')
 :type==='problem'?(i===0?'Without a response, the resulting pressure can affect more people over time.':'Such an intervention directly addresses an important part of the difficulty.')
 :'This helps to answer that part of the question rather than simply describing the trend.';
const chain=(claim,detail,example,i=0)=>'Main idea: '+claim+'\nHow / why: Xác định nhóm chịu tác động và điều kiện khiến luận điểm đúng.\nMechanism: Giải thích tác động từng bước thay vì lặp lại luận điểm.\nIllustrative situation: '+scenario(i)+'\nResult: '+consequence(i);
const paragraph=(claim,detail,example,transition,i=0)=>{
 const clean=claim.replace(/\.$/,'');
 return transition+', '+clean.charAt(0).toLowerCase()+clean.slice(1)+'. This matters because decisions in this area affect the way people use resources, respond to opportunities and deal with everyday difficulties. Consider '+scenario(i)+': the outcome will depend on whether the relevant people have adequate support and realistic options. '+consequence(i);
};
const fullSample=()=>{const intros={
 discussion:'There are contrasting views on the subject described in the question. Both positions deserve consideration, although I find the second perspective more convincing because of its broader implications.',
 advantages:'The development described in the question has both positive and negative consequences. The following discussion will examine its main advantages and limitations.',
 problem:'The issue described in the question is a growing concern. Identifying the difficulties involved is necessary before effective solutions can be proposed.',
 twopart:'The trend described in the question raises two distinct questions. The first concerns the reasons behind it, while the second focuses on its wider implications.'};
const ends={
 discussion:'In conclusion, both arguments have value. However, I support the second view because the likely long-term benefits appear more compelling.',
 advantages:'In conclusion, the trend can create valuable opportunities but it also entails drawbacks that need careful management.',
 problem:'In conclusion, a targeted response that addresses the sources of the issue is more promising than dealing only with its visible symptoms.',
 twopart:'In conclusion, considering both the reasons and the consequences provides a more balanced understanding of this trend.'};
return intros[type]+'\n\n'+paragraph(C.b1,C.d1,C.e1,'First',0)+'\n\n'+paragraph(C.b2,C.d2,C.e2,'Second',1)+'\n\n'+ends[type]};
function body(){switch(state.step){
case 0:return '<h2>01 · Phân tích đề</h2><p class="help">Xác định chủ đề, từ khóa, phạm vi đề và yêu cầu trả lời. Không viết luận ngay khi chưa hiểu đề.</p>'+field('keywords','Từ khóa & yêu cầu của đề','Gạch chân các cụm bắt buộc phải trả lời.',4)+field('paraphrase','Paraphrase lại đề bằng tiếng Anh','Không làm sai ý nghĩa của câu hỏi.',4)+sample('Gợi ý nội dung cần nắm','Chủ đề: '+C.topic+'\nYêu cầu: '+F.question);
case 1:return '<h2>02 · Nhận diện cấu trúc '+F.title+'</h2><div class="callout">'+esc(F.idea)+'</div>'+field('approach','Lựa chọn hướng trả lời','Ghi lập trường hoặc cách triển khai hai Body.',4)+sample('Khung triển khai',F.views[0]+' → '+F.views[1]+'\n'+F.idea);
case 2:return '<h2>03 · Lập ý Body 1</h2><div class="callout"><b>'+F.views[0]+'</b><p>'+esc(C.b1)+'</p></div>'+field('body1ideas','Viết luận điểm và supporting ideas','Cần bám sát đúng hướng của Body 1.',6)+sample('Luận điểm tham khảo',C.b1+'\n'+C.d1);
case 3:return '<h2>04 · Logic Chain Body 1</h2><p class="help">Sắp xếp theo Main Idea → Explanation → Example → Additional Support.</p>'+field('chain1','Phát triển logic của Body 1','Thể hiện quan hệ nguyên nhân – cơ chế – kết quả, tránh nhảy ý.',8)+sample('Mẫu Logic Chain',chain(C.b1,C.d1,C.e1,0));
case 4:return '<h2>05 · Viết Body 1</h2>'+field('body1','Viết một đoạn Body 1 hoàn chỉnh','Khoảng 90–120 từ; có câu chủ đề, giải thích và ví dụ.',10)+sample('Đoạn tham khảo',paragraph(C.b1,C.d1,C.e1,'To begin with',0));
case 5:return '<h2>06 · Lập ý Body 2</h2><div class="callout"><b>'+F.views[1]+'</b><p>'+esc(C.b2)+'</p></div>'+field('body2ideas','Viết luận điểm của Body 2','Không lặp lại luận điểm Body 1.',6)+sample('Luận điểm tham khảo',C.b2+'\n'+C.d2);
case 6:return '<h2>07 · Logic Chain Body 2</h2><p class="help">Main Idea → Explanation → Example → Additional Support, với chuỗi logic khác Body 1.</p>'+field('chain2','Phát triển logic của Body 2','Giải thích rõ cơ chế để chứng minh luận điểm.',8)+sample('Mẫu Logic Chain',chain(C.b2,C.d2,C.e2,1));
case 7:return '<h2>08 · Viết Body 2</h2>'+field('body2','Viết đoạn Body 2 hoàn chỉnh','Khoảng 90–120 từ, không dùng ví dụ không liên quan.',10)+sample('Đoạn tham khảo',paragraph(C.b2,C.d2,C.e2,'Furthermore',1));
case 8:return '<h2>09 · Introduction & Conclusion</h2>'+field('introduction','Introduction','Paraphrase đề + Thesis Statement.',5)+field('conclusion','Conclusion','Tóm tắt hai lập luận, nhất quán với quan điểm đã nêu.',5)+sample('Gợi ý','Introduction: '+fullSample().split('\n\n')[0]+'\nConclusion: '+fullSample().split('\n\n').at(-1));
default:return '<h2>10 · Viết bài hoàn chỉnh & tự kiểm tra</h2><p class="help">Tổng hợp Introduction, hai Body và Conclusion thành bài độc lập. Khung minh họa chỉ dùng để gợi ý cách triển khai, chưa phải bài mẫu đủ 250 từ hoặc bài đã được chấm band.</p>'+field('essay','Bài viết hoàn chỉnh (≥250 từ)','Ưu tiên mạch lập luận tự nhiên. Có thể sao chép nháp các đoạn phía trước.',16)+'<p class="wordcount" id="wordcount"></p><div class="checks">'+['Trả lời đầy đủ tất cả yêu cầu của đề','Hai Body có luận điểm khác nhau','Mỗi Body có giải thích, ví dụ và kết nối hợp lý','Mở bài và kết bài nhất quán','Rà soát từ vựng, ngữ pháp và số từ'].map((v,i)=>'<label><input type="checkbox" data-check="'+i+'" '+(state.checked[i]?'checked':'')+'>'+v+'</label>').join('')+'</div><div class="toolbar"><button type="button" id="copyEssay">Sao chép bài viết</button><button type="button" id="copySample">Sao chép khung minh họa</button></div>'+sample('Khung minh họa 4 đoạn (chưa phải bài mẫu 250 từ)',fullSample());
}}
function render(){if(state.step<0)state.step=0;if(state.step>9)state.step=9;
$('steps').innerHTML=stepNames.map((x,i)=>'<button type="button" class="'+(state.step===i?'active':'')+'" data-step="'+i+'"><small>'+String(i+1).padStart(2,'0')+'</small>'+esc(x)+'</button>').join('');
document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{state.step=Number(b.dataset.step);save();render()});
$('lesson').innerHTML=body();
document.querySelectorAll('[data-field]').forEach(t=>t.oninput=()=>{state.text[t.dataset.field]=t.value;save();updateCount()});
document.querySelectorAll('[data-check]').forEach(c=>c.onchange=()=>{state.checked[c.dataset.check]=c.checked;save()});
$('prev').disabled=state.step===0;$('next').disabled=state.step===9;$('progress').textContent='Bước '+(state.step+1)+'/10 · Đã lưu tự động';$('prev').onclick=()=>{state.step--;save();render()};$('next').onclick=()=>{state.step++;save();render()};
if($('copyEssay'))$('copyEssay').onclick=()=>navigator.clipboard?.writeText(state.text.essay||'').catch(()=>{});
if($('copySample'))$('copySample').onclick=()=>navigator.clipboard?.writeText(fullSample()).catch(()=>{});
updateCount();
}
function updateCount(){const el=$('wordcount');if(el)el.textContent='Số từ: '+(state.text.essay||'').trim().split(/\s+/).filter(Boolean).length+' / tối thiểu 250 từ'}
render();
})();