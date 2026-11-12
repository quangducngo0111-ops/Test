/* Match the two-column Thorndyke’s Builders lesson layout without replacing lesson controls. */
(()=>{'use strict';
function applyLayout(){
 const main=document.querySelector('main.page');
 if(!main || main.querySelector('.listening-unified-shell'))return;
 const audio=[...main.children].find(el=>el.matches?.('.audio-panel'));
 const paper=[...main.children].find(el=>el.matches?.('.paper'));
 if(!audio||!paper)return;
 const shell=document.createElement('div');shell.className='listening-unified-shell';
 const left=document.createElement('div');left.className='listening-unified-work';
 const right=document.createElement('aside');right.className='listening-unified-aside';
 right.setAttribute('aria-label','Audio luyện tập');
 const notes=[...main.children].find(el=>el.id==='studentNotesPanel');
 main.insertBefore(shell,audio);
 shell.append(left,right);
 if(notes)left.appendChild(notes);
 left.appendChild(paper);
 right.appendChild(audio);
 audio.classList.add('listening-unified-audio');
 paper.classList.add('listening-unified-paper');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyLayout,{once:true});else applyLayout();
})();