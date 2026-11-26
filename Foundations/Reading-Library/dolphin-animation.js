/* Dolphin reading: paragraph-synchronised pixel scene viewer.
   Images correspond to the approved pixel GIF, extracted into scene-N.webp files.
   The image URLs are intentionally local to the Reading Library. */
(()=>{
 'use strict';
 const scenes=[
  {file:'scene-1.webp',title:'1 · Moving together',detail:'A pod coordinates its movement underwater.',caption:'Coordination · movement · group behaviour'},
  {file:'scene-2.webp',title:'2 · Whistles and clicks',detail:'Clicks help dolphins investigate their surroundings through echolocation.',caption:'Whistles · clicks · echolocation'},
  {file:'scene-3.webp',title:'3 · Keeping in contact',detail:'Sound helps dolphins remain connected even when visibility is limited.',caption:'Underwater sound · communication'},
  {file:'scene-4.webp',title:'4 · Human-made noise',detail:'Shipping and other human activities introduce noise into marine habitats.',caption:'Shipping · underwater noise'}
 ];
 const CSS='dolphin-reading-active';
 function mount(host,paragraphs){
  if(!host||!paragraphs?.length)return;
  dispose(host);
  host.dataset.dolphinMounted='1';
  host.setAttribute('aria-label','Animated pixel illustrations for the dolphin article');
  const card=document.createElement('section');card.className='dolphin-scene-card';
  const visual=document.createElement('div');visual.className='dolphin-scene-visual';
  const img=document.createElement('img');img.alt='A pod of dolphins in detailed pixel art';img.decoding='async';img.draggable=false;
  visual.append(img);
  const fallback=document.createElement('div');fallback.className='dolphin-scene-fallback';fallback.hidden=true;
  fallback.textContent='Ảnh pixel đang được bổ sung vào thư viện.';
  visual.append(fallback);
  const copy=document.createElement('div');copy.className='dolphin-scene-copy';
  const heading=document.createElement('strong'),sub=document.createElement('p'),caption=document.createElement('span');
  copy.append(heading,sub,caption);
  const nav=document.createElement('div');nav.className='dolphin-scene-navigation';
  const prev=document.createElement('button'),next=document.createElement('button');
  prev.textContent='← Đoạn trước';next.textContent='Đoạn sau →';
  prev.type='button';next.type='button';nav.append(prev,next);
  card.append(visual,copy,nav);host.append(card);
  let current=-1;
  const all=Array.from(paragraphs);
  function go(i,scroll=false){
   i=Math.max(0,Math.min(scenes.length-1,i));
   if(current===i){if(scroll)all[i]?.scrollIntoView({behavior:'smooth',block:'center'});return}
   current=i;
   const scene=scenes[i];
   heading.textContent=scene.title;sub.textContent=scene.detail;caption.textContent=scene.caption;
   img.style.opacity='0';fallback.hidden=true;img.hidden=false;
   img.alt='Pixel art scene: '+scene.detail;
   img.onload=()=>{if(current===i){img.hidden=false;fallback.hidden=true;img.style.opacity='1'}};
   img.onerror=()=>{if(current===i){img.hidden=true;fallback.hidden=false}};
   img.src='./dolphin-scenes/'+scene.file;
   prev.disabled=i===0;next.disabled=i===scenes.length-1;
   all.forEach((p,index)=>{p.classList.toggle(CSS,index===i);p.setAttribute('aria-current',index===i?'true':'false')});
   if(scroll)all[i]?.scrollIntoView({behavior:'smooth',block:'center'});
  }
  const handlers=all.map((p,i)=>{
   p.classList.add('dolphin-reading-paragraph');p.tabIndex=0;
   const click=()=>go(i);
   const key=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go(i)}};
   p.addEventListener('click',click);p.addEventListener('keydown',key);
   return()=>{p.removeEventListener('click',click);p.removeEventListener('keydown',key);p.classList.remove('dolphin-reading-paragraph',CSS);p.removeAttribute('aria-current');p.removeAttribute('tabindex')};
  });
  prev.onclick=()=>go(current-1,true);next.onclick=()=>go(current+1,true);
  let scheduled=false;
  const onScroll=()=>{
   if(scheduled)return;scheduled=true;
   requestAnimationFrame(()=>{
    scheduled=false;
    const anchor=Math.min(window.innerHeight*.43,330);
    const distances=all.map(p=>{
     const r=p.getBoundingClientRect();
     if(r.top<=anchor&&r.bottom>=anchor)return 0;
     return Math.min(Math.abs(r.top-anchor),Math.abs(r.bottom-anchor));
    });
    const nearest=distances.indexOf(Math.min(...distances));if(nearest>=0)go(nearest);
   });
  };
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  host._disposeDolphin=()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);handlers.forEach(fn=>fn());img.onload=null;img.onerror=null;host.replaceChildren();delete host.dataset.dolphinMounted;};
  go(0);
 }
 function dispose(host){if(!host)return;host._disposeDolphin?.();host.replaceChildren()}
 window.SmartcomDolphinAnimation={mount,dispose};
})();
