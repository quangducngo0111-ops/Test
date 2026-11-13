/* Speaking CEFR vocabulary library and level-specific game collections. */
(function(){
'use strict';
const levels=['B1','B2','C1','C2'];
const isSpeaking=()=>typeof selectedSkill==='string'&&/^speaking-part-[123]$/.test(selectedSkill);
const escape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let level='B1',tab='all',lastTopic='';
window.SPEAKING_ACTIVE_LEVEL=level;
function chooseLegacyLevel(item,index){
  return levels[Math.min(3,Math.floor(index/3))];
}
function getAllEntries(){
  if(!isSpeaking())return [];
  const original=(Array.isArray(window.VOCABULARY_DATA)?window.VOCABULARY_DATA:[])
    .filter(x=>Array.isArray(x.skills)&&x.skills.includes(selectedSkill)&&String(x.set)===String(selectedSet));
  let oldIndex=0;
  return original.map(x=>({
    ...x,
    _level:levels.includes(x.level)?x.level:chooseLegacyLevel(x,oldIndex++),
    _kind:x.itemType==='collocation'?'collocation':'vocabulary'
  }));
}
function applyLevel(){
  if(!isSpeaking())return;
  currentCollection=getAllEntries().filter(x=>x._level===level);
  window.SPEAKING_ACTIVE_LEVEL=level;
}
function speak(value){
  if(!('speechSynthesis' in window)&&!('SpeechSynthesisUtterance' in window)){
    alert('Không có chức năng phát âm trên trình duyệt này.');
    return;
  }
  if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){
    alert('Trình duyệt này không hỗ trợ giọng đọc tiếng Anh.');
    return;
  }
  window.speechSynthesis.cancel();
  const audio=new SpeechSynthesisUtterance(value);
  const voices=window.speechSynthesis.getVoices();
  const british=voices.find(v=>/^en-GB$/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));
  audio.lang=british?.lang||'en-GB';
  audio.voice=british||null;
  audio.rate=.88;
  window.speechSynthesis.speak(audio);
}
function css(){
  if(document.getElementById('speakingVocabStyles'))return;
  const style=document.createElement('style');
  style.id='speakingVocabStyles';
  style.textContent=`
  .sv-panel{background:white;border:1px solid #e3e0f0;border-radius:20px;margin:20px 0;padding:20px;box-shadow:0 6px 24px rgba(40,18,96,.06)}
  .sv-panel h3{color:#281260;font-size:20px;margin:0 0 6px}
  .sv-panel p{font-size:12px;color:#657084;line-height:1.6;margin:0 0 13px}
  .sv-controls{display:flex;flex-wrap:wrap;gap:9px;margin:12px 0}
  .sv-chip{cursor:pointer;padding:10px 15px;border-radius:11px;border:1px solid #ddd6ef;background:#faf8ff;color:#3b2576;font:700 13px system-ui}
  .sv-chip[aria-pressed=true]{background:#39217d;color:white;border-color:#39217d}
  .sv-count{margin:15px 0;font-size:12px;color:#646c7a}
  .sv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
  .sv-entry{padding:15px;background:#fbfaff;border:1px solid #e9e4f4;border-radius:15px;min-width:0}
  .sv-entry-head{display:flex;justify-content:space-between;align-items:center;gap:10px}
  .sv-entry strong{color:#281260;font-size:16px;overflow-wrap:anywhere}
  .sv-tag{color:#7453af;font-size:10px;font-weight:800;letter-spacing:.05em;margin-bottom:5px}
  .sv-entry .sv-meaning{font-size:13px;color:#444b59;margin-top:7px}
  .sv-entry .sv-example{font-size:12px;color:#717a8b;margin-top:7px;line-height:1.55}
  .sv-speak{min-width:40px;min-height:40px;border:1px solid #cfc4e9;background:#efebfc;border-radius:11px;cursor:pointer;font-size:19px}
  .sv-panel .sv-next{display:block;width:100%;margin:16px 0 0;padding:15px;border:0;border-radius:13px;background:linear-gradient(90deg,#3b0e90,#6541cf);color:#fff;font-weight:900;font-size:16px;cursor:pointer}\n  .sv-panel .sv-next:hover{filter:brightness(1.1)}\n  .sv-panel .sv-grid{max-height:min(40vh,360px);overflow:auto;scrollbar-color:#c3b6e5 transparent}\n  .sv-panel .sv-preview-toggle{background:none;border:0;color:#5931ac;cursor:pointer;font-weight:800;padding:8px 0}\n  .sv-panel .sv-preview[hidden]{display:none!important}\n  @media(max-width:650px){.sv-grid{grid-template-columns:1fr}.sv-panel{padding:14px}}
  `;
  document.head.appendChild(style);
}
function render(){
  const list=document.getElementById('wordList');
  if(!list)return;
  let panel=document.getElementById('speakingStudyPanel');
  if(!isSpeaking()||(typeof vocabularyStage!=='undefined'&&vocabularyStage==='games')){
    if(panel)panel.remove();
    list.style.display='';
    return;
  }
  css();
  if(!panel){
    panel=document.createElement('section');
    panel.id='speakingStudyPanel';
    panel.className='sv-panel';
    list.before(panel);
  }
  list.style.display='none';
  const entries=(Array.isArray(currentCollection)?currentCollection:[]);
  const show=entries.filter(x=>tab==='all'||x._kind===tab);
  const kinds=[['all','Tất cả'],['vocabulary','Vocabulary'],['collocation','Collocations']];
  panel.innerHTML=`
  <h3>📚 Chọn cấp độ từ vựng</h3>\n  <p>Chọn trình độ phù hợp. Bộ từ của cấp độ này sẽ được sử dụng trong trò chơi và bài kiểm tra.</p>
  <div class="sv-controls" role="group" aria-label="Chọn trình độ">
    ${levels.map(x=>`<button type="button" class="sv-chip" data-level="${x}" aria-pressed="${x===level}">${x}</button>`).join('')}
  </div>
  <div class="sv-preview" id="svPreview" hidden>\n  <div class="sv-controls" role="group" aria-label="Lọc loại từ">
    ${kinds.map(([x,label])=>`<button type="button" class="sv-chip" data-kind="${x}" aria-pressed="${x===tab}">${label}</button>`).join('')}
  </div>
  <div class="sv-count">${entries.length} mục học cấp ${level} · ${show.length} mục đang hiển thị · Game dùng cả Vocabulary và Collocations của ${level}</div>
  <div class="sv-grid">
    ${show.map((item,i)=>`
      <article class="sv-entry">
        <div class="sv-tag">${item._kind==='collocation'?'COLLOCATION':'VOCABULARY'} · ${escape(level)}</div>
        <div class="sv-entry-head"><strong>${escape(item.word)}</strong>
          <button type="button" class="sv-speak" data-say="${i}" aria-label="Nghe phát âm ${escape(item.word)}">🔊</button>
        </div>
        <div class="sv-meaning">${escape(item.meaning)}</div>
        ${item.collocation&&item._kind==='vocabulary'?'<div class="sv-example">Collocation: '+escape(item.collocation)+'</div>':''}
        ${item.example?'<div class="sv-example">Example: '+escape(item.example)+'</div>':''}
      </article>
    `).join('')}
  </div>\n  </div>\n  <button type="button" class="sv-preview-toggle" data-preview aria-expanded="false">Xem trước ${entries.length} từ vựng ↓</button>\n  <button type="button" class="sv-next" data-continue>Tiếp tục với ${escape(level)} → Chọn game</button>\n  `;\n  panel.onclick=e=>{
    const button=e.target.closest('button');if(!button)return;
    if(button.hasAttribute('data-level')){
      level=button.dataset.level;
      window.SPEAKING_ACTIVE_LEVEL=level;
      tab='all';
      applyLevel();
      // Rebuild stats, games and question pool for the selected level.
      showGameList();
      return;
    }
    if(button.hasAttribute('data-continue')){window.openVocabularyGameStage?.();return;}\n    if(button.hasAttribute('data-preview')){const preview=panel.querySelector('#svPreview');preview.hidden=!preview.hidden;button.setAttribute('aria-expanded',String(!preview.hidden));button.textContent=preview.hidden?'Xem trước '+entries.length+' từ vựng ↓':'Thu gọn danh sách từ ↑';return;}\n    if(button.hasAttribute('data-kind')){tab=button.dataset.kind;render();return;}
    if(button.hasAttribute('data-say')){
      const item=show[Number(button.dataset.say)];
      if(item)speak(item.word);
    }
  };
}
// Hook into existing site without changing the Reading/Writing gameplay.
const originalOpenSet=window.openSet;
if(typeof originalOpenSet==='function'){
  window.openSet=function(set,sync=true){
    const topic=String(selectedSkill)+'::'+String(set);
    if(lastTopic!==topic){level='B1';tab='all';lastTopic=topic;}
    window.SPEAKING_ACTIVE_LEVEL=level;
    const output=originalOpenSet.apply(this,arguments);
    if(isSpeaking()){
      applyLevel();
      showGameList();
    }
    return output;
  };
}
const originalRender=window.renderCollection;
if(typeof originalRender==='function'){
  window.renderCollection=function(){
    const output=originalRender.apply(this,arguments);
    render();
    return output;
  };
}
window.addEventListener('pagehide',()=>{
  if('speechSynthesis' in window)window.speechSynthesis.cancel();
});
})();
