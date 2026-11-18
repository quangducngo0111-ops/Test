/* IELTS Test Band: indicative conversion from full 40-question Listening/Academic Reading TESTS.
   Tables are approximate; examiners may vary score thresholds by paper.
   This file never grades Practice, Writing or Speaking. */
(()=>{'use strict';
if(window.SmartcomTestBands)return;
if(!document.querySelector('script[data-sc-area-loader]')){const t=document.createElement('script');t.dataset.scAreaLoader='1';t.src=new URL('area-theme-loader.js?v=20261118-scoped01',document.currentScript.src).href;document.head.append(t);}
const bandTables={
 reading:[[39,9],[37,8.5],[35,8],[33,7.5],[30,7],[27,6.5],[23,6],[19,5.5],[15,5],[13,4.5],[10,4],[8,3.5],[6,3],[4,2.5],[3,2],[1,1.5],[0,0]],
 listening:[[39,9],[37,8.5],[35,8],[32,7.5],[30,7],[26,6.5],[23,6],[18,5.5],[16,5],[13,4.5],[11,4],[8,3.5],[6,3],[4,2.5],[3,2],[1,1.5],[0,0]]
};
const skill=/\/Read\d+\//i.test(location.pathname)?'reading':/\/Lis\d+\//i.test(location.pathname)?'listening':null;
function toBand(score,type=skill){if(!bandTables[type]||!Number.isInteger(score)||score<0||score>40)return null;for(const [min,band] of bandTables[type])if(score>=min)return band;return null}
window.SmartcomTestBands={toBand};
if(!skill)return;
const css=document.createElement('style');
css.textContent='.sc-test-band{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:15px 18px;margin:12px 0 16px;border-radius:14px;background:linear-gradient(110deg,#E8F5FF,#F6FBFF);border:1px solid #B5DDF6;color:#175987;font:700 14px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 6px 18px #155F9B13}.sc-test-band-value{font-size:32px;font-weight:900;line-height:1.15;color:#197ABD}.sc-test-band-note{font-size:11px;line-height:1.5;font-weight:500;color:#526F87}.sc-test-band-title{font-size:13px;font-weight:850;color:#174D78}@media(max-width:520px){.sc-test-band{align-items:flex-start}.sc-test-band-value{font-size:27px}}';
document.head.append(css);
function render(){
 const scoreEl=document.getElementById('rscore')||document.getElementById('resultScore')||document.getElementById('scoreBig');
 if(!scoreEl)return;
 const container=scoreEl.id==='scoreBig' ? (document.getElementById('result')||scoreEl.closest('.result')) : (document.getElementById('overlay')||scoreEl.closest('.result'));
 if(!container)return;
 const isVisible=container.id==='overlay'?!container.classList.contains('hidden'):
   (container.classList.contains('show')||container.classList.contains('visible')||container.style.display==='block');
 if(!isVisible)return;
 const match=scoreEl.textContent.trim().match(/^(\d{1,2})\s*\/\s*40\b/);
 if(!match)return;
 const score=Number(match[1]),band=toBand(score,skill);
 if(band===null)return;
 let card=container.querySelector('.sc-test-band');
 if(!card){
  card=document.createElement('section');card.className='sc-test-band';
  card.setAttribute('role','status');card.setAttribute('aria-live','polite');
  scoreEl.insertAdjacentElement('afterend',card);
 }
 if(card.dataset.score===String(score))return;
 card.dataset.score=String(score);
 card.innerHTML='<div><div class="sc-test-band-title">IELTS '+(skill==='reading'?'Academic Reading':'Listening')+' Band tham khảo</div><div class="sc-test-band-note">Quy đổi từ '+score+'/40 câu đúng của bài Test. Band thực tế có thể khác theo từng đề.</div></div><div class="sc-test-band-value">'+band.toFixed(1)+'</div>';
}
function init(){
 const scoreEl=document.getElementById('rscore')||document.getElementById('resultScore')||document.getElementById('scoreBig');
 const container=scoreEl?.id==='scoreBig' ? (document.getElementById('result')||scoreEl?.closest('.result')) : (document.getElementById('overlay')||scoreEl?.closest('.result'));
 if(!scoreEl||!container)return;
 const observer=new MutationObserver(render);
 observer.observe(container,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','style']});
 render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();