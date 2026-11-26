/* Dolphin Reading — video-backed cinematic reading stage.
 * Four local scene videos are synchronized to reading paragraphs.
 * Other Reading Library articles remain untouched. */
(()=>{
 'use strict';
 const scenes=[
  {video:'scene-1.mp4',title:'Moving together',detail:'A pod coordinates its movement underwater.',caption:'Coordination · movement · group behaviour'},
  {video:'scene-2.mp4',title:'Whistles and clicks',detail:'Clicks help dolphins investigate their surroundings through echolocation.',caption:'Whistles · clicks · echolocation'},
  {video:'scene-3.mp4',title:'Keeping in contact',detail:'Sound helps dolphins remain connected even when visibility is limited.',caption:'Underwater sound · communication'},
  {video:'scene-4.mp4',title:'Human-made noise',detail:'Shipping and other human activities introduce noise into marine habitats.',caption:'Shipping · underwater noise'}
 ];
 const ACTIVE='dolphin-reading-active';
 function mount(host,paragraphs){
  if(!host||!paragraphs?.length)return;
  dispose(host);
  const all=Array.from(paragraphs);
  const reading=all[0].parentElement;
  if(!reading)return;
  host.dataset.dolphinMounted='1';
  host.setAttribute('aria-label','Dolphin video scenes');
  const card=document.createElement('section');card.className='dolphin-scene-card';
  const visual=document.createElement('div');visual.className='dolphin-scene-visual';
  const poster=document.createElement('img');poster.src='./dolphin-scenes/scene-1.webp';poster.alt='Dolphins underwater';poster.decoding='async';poster.draggable=false;
  const video=document.createElement('video');
  video.className='dolphin-scene-video';
  video.muted=true;video.autoplay=true;video.loop=true;video.playsInline=true;
  video.setAttribute('muted','');video.setAttribute('playsinline','');video.setAttribute('aria-hidden','true');
  video.preload='metadata';
  const fallback=document.createElement('div');fallback.className='dolphin-scene-fallback';fallback.hidden=true;
  fallback.textContent='Video tạm thời chưa phát được. Có thể tiếp tục đọc và chọn đoạn.';
  visual.append(poster,video,fallback);
  const copy=document.createElement('div');copy.className='dolphin-scene-copy';
  const heading=document.createElement('strong'),sub=document.createElement('p'),caption=document.createElement('span');
  copy.append(heading,sub,caption);
  const nav=document.createElement('div');nav.className='dolphin-scene-navigation';
  const prev=document.createElement('button'),next=document.createElement('button');
  prev.type='button';next.type='button';prev.textContent='← Đoạn trước';next.textContent='Đoạn sau →';
  prev.setAttribute('aria-label','Chuyển sang đoạn trước');
  next.setAttribute('aria-label','Chuyển sang đoạn sau');
  nav.append(prev,next);card.append(visual,copy,nav);host.append(card);
  let current=-1,changing=false;
  function go(index,scroll=false){
   const i=Math.max(0,Math.min(scenes.length-1,index));
   if(i===current){if(scroll)all[i]?.scrollIntoView({behavior:'smooth',block:'nearest'});return}
   current=i;changing=true;
   const scene=scenes[i];
   heading.textContent=(i+1)+' · '+scene.title;sub.textContent=scene.detail;caption.textContent=scene.caption;
   visual.dataset.scene=String(i+1);video.hidden=false;fallback.hidden=true;
   poster.hidden=false;video.style.opacity='0';
   video.pause();
   // Changing src only after pausing avoids playback of an out-of-date scene.
   video.src='./dolphin-scenes/'+scene.video;
   video.load();
   video.play().catch(()=>{poster.hidden=false});
   prev.disabled=i===0;next.disabled=i===scenes.length-1;
   all.forEach((p,n)=>{const active=n===i;p.classList.toggle(ACTIVE,active);p.setAttribute('aria-current',active?'true':'false')});
   if(scroll)all[i]?.scrollIntoView({behavior:'smooth',block:'nearest'});
   window.setTimeout(()=>{changing=false},300);
  }
  const onPlaying=()=>{video.style.opacity='1';poster.hidden=true;fallback.hidden=true};
  const onError=()=>{video.hidden=true;poster.hidden=false;fallback.hidden=false};
  video.addEventListener('playing',onPlaying);video.addEventListener('error',onError);
  const handlers=all.map((p,i)=>{
   p.classList.add('dolphin-reading-paragraph');
   p.tabIndex=0;
   const click=e=>{if(e.detail>1||window.getSelection()?.toString())return;go(Math.min(i,scenes.length-1))};
   const key=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go(Math.min(i,scenes.length-1))}};
   p.addEventListener('click',click);p.addEventListener('keydown',key);
   return()=>{p.removeEventListener('click',click);p.removeEventListener('keydown',key);p.classList.remove('dolphin-reading-paragraph',ACTIVE);p.removeAttribute('aria-current');p.removeAttribute('tabindex')};
  });
  prev.addEventListener('click',()=>go(current-1,true));
  next.addEventListener('click',()=>go(current+1,true));
  // Scroll only the reading overlay; synchronization does not depend on window scroll.
  let scheduled=false;
  const onReadingScroll=()=>{
   if(scheduled||changing)return;
   scheduled=true;
   requestAnimationFrame(()=>{
    scheduled=false;if(changing)return;
    const box=reading.getBoundingClientRect(),anchor=box.top+Math.min(box.height*.34,160);
    const distances=all.map(p=>{const r=p.getBoundingClientRect();return r.top<=anchor&&r.bottom>=anchor?0:Math.min(Math.abs(r.top-anchor),Math.abs(r.bottom-anchor))});
    const nearest=distances.indexOf(Math.min(...distances));
    if(nearest>=0)go(Math.min(nearest,scenes.length-1));
   });
  };
  reading.addEventListener('scroll',onReadingScroll,{passive:true});
  host._disposeDolphin=()=>{
   reading.removeEventListener('scroll',onReadingScroll);
   handlers.forEach(fn=>fn());
   video.removeEventListener('playing',onPlaying);video.removeEventListener('error',onError);
   video.pause();video.removeAttribute('src');video.load();
   host.replaceChildren();delete host.dataset.dolphinMounted;delete host._disposeDolphin;
  };
  go(0);
 }
 function dispose(host){if(!host)return;host._disposeDolphin?.();host.replaceChildren()}
 window.SmartcomDolphinAnimation={mount,dispose};
})();
