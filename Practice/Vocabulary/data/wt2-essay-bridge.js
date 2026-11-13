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
// Each vocabulary pack must come from the corresponding Guided Writing lesson.
// Generic filler packs are deliberately disallowed: they hide missing source content.
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
  const keyNum=String(n).padStart(2,"0");
  const curated=type==="discussion" ? window.WT2_DISCUSSION_VOCAB?.[keyNum] : type==="advantages" ? window.WT2_ADVANTAGES_VOCAB?.[keyNum] : type==="problem" ? window.WT2_PROBLEM_VOCAB?.[keyNum] : type==="twopart" ? window.WT2_TWOPART_VOCAB?.[keyNum] : null;
  const groups=curated||parseExactGroups(page,type,n);
  if(!groups)throw new Error("Bài "+String(n).padStart(2,"0")+" chưa có bộ từ vựng riêng theo đề. Không sử dụng bộ từ mẫu thay thế.");
  const requiredGroups=["A","B","C"];
  if(!requiredGroups.every(group=>Array.isArray(groups[group]?.rows)&&groups[group].rows.length)){
    throw new Error("Bài "+String(n).padStart(2,"0")+" thiếu nhóm từ A, B hoặc C.");
  }
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
   titles:["Bộ từ theo đúng nội dung Guided Writing · "+pack.words.length+" cụm","Nhóm A: Introduction · Nhóm B/C: Phát triển luận điểm"]
 };
 return pack;
}
window.WT2_ESSAY_VOCAB={TYPES,catalog,loadLesson,attach,code};
})();