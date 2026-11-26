/* Silk-specific UI: IELTS source-style note layout + shared Reading Library
 * dictionary + functional Reading Practice highlights. Preserve engine answers,
 * local storage, grading, progress and submitted results. */
(()=>{
 'use strict';
 document.body.classList.add('silk-reading');
 const $=id=>document.getElementById(id);
 const list=$('answerList'),source=$('source');
 if(!list||!source||!$('row1')||!$('row13'))return;
 const create=(tag,className,text)=>{
  const n=document.createElement(tag);
  if(className)n.className=className;
  if(text!==undefined)n.textContent=text;
  return n;
 };
 const intro=(first)=>{
  const box=create('div','silk-questions-intro');
  box.append(create('h3','',first?'Questions 1–9':'Questions 10–13'));
  if(first){
   box.append(create('p','','Complete the notes below.'));
   const p=create('p');
   p.append('Choose ',create('strong','','ONE WORD ONLY'),' from the passage for each answer.');
   box.append(p);
   box.append(create('p','','Write your answers in boxes 1–9.'));
   box.append(create('span','silk-answer-rule','NOTE COMPLETION'));
  }else{
   box.append(create('p','','Do the following statements agree with the information in Reading Passage 1?'));
   box.append(create('p','','Choose TRUE, FALSE or NOT GIVEN for each statement.'));
   const legend=create('div','silk-tfng-legend');
   for(const [value,definition] of [
    ['TRUE','agrees with the passage'],
    ['FALSE','contradicts the passage'],
    ['NOT GIVEN','not stated in the passage']
   ]){
    const item=create('span');item.append(create('b','',value),' · '+definition);legend.append(item);
   }
   box.append(legend);
  }
  return box;
 };
 const firstSection=$('row1').closest('.question-section');
 const lastSection=$('row10').closest('.question-section');
 if(!firstSection||!lastSection||firstSection===lastSection)return;
 const rows=Array.from({length:9},(_,i)=>$('row'+(i+1)));
 const definitions={
  1:{before:'– silkworm cocoon fell into emperor’s wife’s ',after:'',sub:true},
  2:{before:'– emperor’s wife invented a ',after:' to pull out silk fibres',sub:true},
  3:{before:'• Only ',after:' were allowed to produce silk'},
  4:{before:'• Only ',after:' were allowed to wear silk'},
  5:{before:'• Silk used as a form of ',after:''},
  6:{before:'– e.g. evidence found of ',after:' made from silk around 168 AD',sub:true},
  7:{before:'• Merchants use Silk Road to take silk westward and bring back ',after:' and precious metals'},
  8:{before:'• 550 AD: ',after:' hide silkworm eggs in canes and take them to Constantinople'},
  9:{before:'• 20th century: ',after:' and other manmade fibres cause decline in silk production'}
 };
 const sheet=create('div','silk-note-sheet');
 sheet.append(create('h4','','THE STORY OF SILK'),create('h5','','Early silk production in China'));
 sheet.append(create('div','silk-note-static','• Around 3000 BC, according to legend:'));
 function addQuestion(n){
  const row=rows[n-1],field=row.querySelector('input[data-n="'+n+'"]');
  if(!field)return;
  const definition=definitions[n];
  row.className='question-card silk-note-line'+(definition.sub?' silk-subline':'');
  row.querySelector('.question-row')?.remove();
  const copy=create('div','qcopy');
  copy.append(document.createTextNode(definition.before));
  const answer=create('span','silk-answer-wrap');
  answer.append(create('span','silk-answer-index',String(n)),field);
  field.placeholder='Điền từ';
  answer.append(create('span','silk-answer-tail',''));
  copy.append(answer,document.createTextNode(definition.after));
  row.prepend(copy);sheet.append(row);
 }
 function staticLine(text,sub=false){sheet.append(create('div','silk-note-static'+(sub?' silk-subline':''),text))}
 addQuestion(1);addQuestion(2);addQuestion(3);addQuestion(4);addQuestion(5);
 staticLine('– e.g. farmers’ taxes consisted partly of silk',true);
 staticLine('• Silk used for many purposes');
 addQuestion(6);
 sheet.append(create('h5','','Silk reaches rest of world'));
 addQuestion(7);addQuestion(8);
 staticLine('• Silk production spreads across Middle East and Europe');
 addQuestion(9);
 firstSection.replaceChildren(intro(true),sheet);
 const judgeIntro=intro(false);
 const secondRows=Array.from({length:4},(_,i)=>$('row'+(i+10)));
 for(let i=0;i<secondRows.length;i++){
  const row=secondRows[i],n=i+10;
  row.classList.add('silk-judgement');
  const rowEl=row.querySelector('.question-row'),select=row.querySelector('select.choice-dropdown');
  if(rowEl&&select){
   select.setAttribute('aria-label','Câu '+n+': Chọn TRUE, FALSE hoặc NOT GIVEN');
   rowEl.append(select);
  }
 }
 lastSection.querySelector('.questionsIntro,.instructions')?.remove();
 lastSection.prepend(judgeIntro);
 
 // Shared dictionary/IPA/audio/save-to-notebook module used by Reading Library.
 // Use the same word wrappers and popover rather than a second translation widget.
 function installSharedDictionary(){
  if(typeof window.scMarkReadingTerms==='function'){
   window.scMarkReadingTerms(source);
   // Stop the legacy local dictionary handler after the shared dictionary
   // has already handled the annotated word during document capture.
   source.addEventListener('dblclick',e=>{
    if(e.target.closest?.('.sc-lexeme'))e.stopImmediatePropagation();
   },true);
   return true;
  }
  return false;
 }
 if(!installSharedDictionary()){
  const existing=document.querySelector('script[data-sc-word-tools]');
  if(existing){
   existing.addEventListener('load',installSharedDictionary,{once:true});
  }else{
   const wordScript=document.createElement('script');
   wordScript.dataset.scWordTools='1';
   wordScript.src='../../../shared/word-tools.js?v=20261126-silk-dictionary-click01';
   wordScript.addEventListener('load',installSharedDictionary,{once:true});
   document.body.append(wordScript);
  }
 }
 // Reading Practice retains its existing persistent 6-colour highlight/take-note
 // system. Selecting a colour applies it instantly to the preserved selection.
 const menu=$('selectionMenu');
 if(menu){
  menu.setAttribute('aria-label','Highlight màu và ghi chú');
  menu.addEventListener('click',e=>{
   const chip=e.target.closest?.('button[aria-label^="Highlight "]');
   if(!chip||!menu.contains(chip))return;
   const highlight=menu.querySelector('[data-action="highlight"]');
   if(!highlight||highlight.hidden)return;
   highlight.click();
  });
 }
})();
