/* Writing Task 2 vocabulary: derive every practice set from its actual Guided Writing lesson. */
(function(){
"use strict";
const TYPES=[
 {key:"opinion",dir:"OpinionEssay",title:"Opinion Essay",description:"Agree / Disagree · Nêu quan điểm"},
 {key:"discussion",dir:"DiscussionEssay",title:"Discussion Essay",description:"Discuss both views & give your opinion"},
 {key:"advantages",dir:"AdvantagesDisadvantages",title:"Advantages & Disadvantages",description:"Phân tích lợi ích và hạn chế"},
 {key:"problem",dir:"ProblemSolution",title:"Problem & Solution",description:"Phân tích vấn đề và giải pháp"},
 {key:"twopart",dir:"TwoPartQuestions",title:"Two-part Questions",description:"Trả lời hai câu hỏi"}
];
const DEFAULT_GROUPS={
 A:[["an ongoing debate","một cuộc tranh luận đang diễn ra"],["a growing concern","mối lo ngại ngày càng tăng"],["a balanced approach","một cách tiếp cận cân bằng"],["different viewpoints","những quan điểm khác nhau"],["long-term consequences","hệ quả dài hạn"],["from my perspective","theo quan điểm của tôi"]],
 B:[["play an important role in","đóng vai trò quan trọng trong"],["have an impact on","có tác động đến"],["provide opportunities for","tạo cơ hội cho"],["take into account","cân nhắc / tính đến"],["in practical terms","về mặt thực tiễn"],["as a result","kết quả là"]],
 C:[["address underlying causes","giải quyết nguyên nhân sâu xa"],["reduce the risk of","giảm nguy cơ"],["contribute to","góp phần vào"],["lead to improvements","dẫn đến sự cải thiện"],["in the long run","về lâu dài"],["ensure that","đảm bảo rằng"]]
};
const TOPIC_TERMS={
 Education:[["academic knowledge","kiến thức học thuật"],["practical skills","kỹ năng thực hành"]],
 Technology:[["digital tools","công cụ số"],["online platforms","nền tảng trực tuyến"]],
 Transport:[["public transport","giao thông công cộng"],["traffic congestion","ùn tắc giao thông"]],
 Environment:[["natural resources","tài nguyên thiên nhiên"],["environmental protection","bảo vệ môi trường"]],
 Health:[["healthcare services","dịch vụ y tế"],["healthy lifestyles","lối sống lành mạnh"]],
 Work:[["job opportunities","cơ hội việc làm"],["working conditions","điều kiện làm việc"]],
 Society:[["community support","hỗ trợ cộng đồng"],["social relationships","quan hệ xã hội"]],
 Culture:[["cultural heritage","di sản văn hóa"],["local traditions","truyền thống địa phương"]]
};
const BODY_LABELS={
 discussion:["Quan điểm 1","Quan điểm 2"],
 advantages:["Lợi ích","Hạn chế"],
 problem:["Vấn đề","Giải pháp"],
 twopart:["Câu hỏi 1","Câu hỏi 2"]
};
const catalogCache=new Map();
const lessonCache=new Map();
function code(type,n){return "essay-"+type+"-"+String(n).padStart(2,"0")}
function normalizeText(s){return String(s||"").replace(/\s+/g," ").trim()}
function getType(type){return TYPES.find(x=>x.key===type)}
async function fetchDocument(url){
 const response=await fetch(url,{cache:"no-store"});
 if(!response.ok)throw new Error("Không tải được dữ liệu bài học ("+response.status+").");
 return new DOMParser().parseFromString(await response.text(),"text/html");
}
function lessonHref(type,n){const t=getType(type);return "../WritingTask2/"+t.dir+"/Practice"+String(n).padStart(2,"0")+"/index.html";}
async function catalog(type){
 if(catalogCache.has(type))return catalogCache.get(type);
 const t=getType(type);
 if(!t)throw new Error("Dạng bài không hợp lệ");
 const promise=(async()=>{
   const page=await fetchDocument("../WritingTask2/"+t.dir+"/index.html");
   const cards=[...page.querySelectorAll(".grid a.card")];
   const entries=cards.map((a,index)=>{
     const match=(a.getAttribute("href")||"").match(/Practice(\d+)/i);
     const n=match?Number(match[1]):index+1;
     return {n,title:normalizeText(a.querySelector("h2")?.textContent)||"Bài "+n,type,code:code(type,n)};
   });
   if(!entries.length)throw new Error("Không tìm được danh sách đề của "+t.title);
   return entries;
 })();
 catalogCache.set(type,promise);
 try{return await promise}catch(e){catalogCache.delete(type);throw e}
}
function parseExactGroups(page,type,n){
 const key=type+"-"+String(n).padStart(2,"0");
 const legacy=window.WT2_LEGACY_OPINION_GROUPS?.[key];
 if(legacy)return legacy;
 for(const script of page.querySelectorAll("script:not([src])")){
   const source=script.textContent||"";
   const match=source.match(/const VOCAB_GROUPS\s*=\s*(\{[\s\S]*?\})\s*;\s*const vocab\s*=/);
   if(!match)continue;
   try{
     const value=JSON.parse(match[1]);
     if(value&&typeof value==="object"&&Object.values(value).every(g=>Array.isArray(g.rows)))return value;
   }catch(e){}
 }
 return null;
}
function templateGroups(config,type){
 const extra=TOPIC_TERMS[config.topic]||TOPIC_TERMS.Society;
 const labels=BODY_LABELS[type]||["Body 1","Body 2"];
 return {
 A:{title:"Nhóm A – Introduction & Conclusion",rows:DEFAULT_GROUPS.A},
 B:{title:"Nhóm B – "+labels[0],rows:[...extra,...DEFAULT_GROUPS.B]},
 C:{title:"Nhóm C – "+labels[1],rows:[...extra,...DEFAULT_GROUPS.C]}
 };
}
async function loadLesson(type,n){
 const key=code(type,n);
 if(lessonCache.has(key))return lessonCache.get(key);
 const promise=(async()=>{
  const items=await catalog(type);
  const lesson=items.find(x=>x.n===n);
  if(!lesson)throw new Error("Bài này không nằm trong danh sách luyện viết.");
  const page=await fetchDocument(lessonHref(type,n));
  const dataNode=page.querySelector("#lesson-data[type='application/json']");
  let config=null;
  if(dataNode){try{config=JSON.parse(dataNode.textContent)}catch(e){}}
  const curated=type==="discussion" ? window.WT2_DISCUSSION_VOCAB?.[String(n).padStart(2,"0")] : null;
  const groups=curated||parseExactGroups(page,type,n)||(config?templateGroups(config,type):null);
  if(!groups)throw new Error("Chưa trích xuất được từ vựng gốc từ bài "+n+".");
  const rows=Object.entries(groups).flatMap(([group,info])=>(info.rows||[]).map(([word,meaning],i)=>({
     id:key+"-"+group.toLowerCase()+"-"+String(i+1).padStart(2,"0"),
     word:normalizeText(word),meaning:normalizeText(meaning),skills:["writing-task-2"],
     set:key,topics:[type,config?.topic||"IELTS Writing Task 2"],
     collocation:normalizeText(word),category:info.title||"Nhóm "+group
  }))).filter(w=>w.word&&w.meaning);
  // The shared writing template repeats topic phrases across Body 1 and 2.
  // Keep each expression once to avoid ambiguous duplicate quiz choices.
  const seen=new Set();
  const uniqueRows=rows.filter(w=>{
    const k=w.word.toLocaleLowerCase();
    if(seen.has(k))return false;
    seen.add(k);
    return true;
  });
  if(!uniqueRows.length)throw new Error("Bài "+n+" chưa có từ vựng.");
  return {lesson,words:uniqueRows,groups};
 })();
 lessonCache.set(key,promise);
 try{return await promise}catch(e){lessonCache.delete(key);throw e}
}
async function attach(type,n){
 const pack=await loadLesson(type,n);
 const key=code(type,n);
 // Do not discard existing games or overwrite other skills.
 const old=Array.isArray(window.VOCABULARY_DATA)?window.VOCABULARY_DATA:[];
 window.VOCABULARY_DATA=old.filter(w=>!(w?.skills?.includes("writing-task-2")&&String(w.set)===key));
 window.VOCABULARY_DATA.push(...pack.words);
 window.VOCABULARY_SET_INFO ||= {};
 window.VOCABULARY_SET_INFO["writing-task-2"] ||= {};
 window.VOCABULARY_SET_INFO["writing-task-2"][key]={
   label:"Bài "+String(n).padStart(2,"0")+" · "+pack.lesson.title,
   titles:["Từ vựng trích từ Guided Writing · "+pack.words.length+" cụm"]
 };
 return pack;
}
window.WT2_ESSAY_VOCAB={TYPES,catalog,loadLesson,attach,code};
})();