/* Shared outline icons – consistent with Practice cards. */
(()=>{'use strict';if(window.__scIcons)return;window.__scIcons=true;
const icons={
'🎧':'<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="2" y="13" width="4" height="8" rx="2"/><rect x="18" y="13" width="4" height="8" rx="2"/>',
'📖':'<path d="M12 7v14M3 18V4c4-1 7 0 9 3 2-3 5-4 9-3v14c-4-1-7 0-9 3-2-3-5-4-9-3Z"/>',
'📚':'<path d="M4 19V5a2 2 0 0 1 2-2h14v17H6a2 2 0 0 1 0-4h14"/>',
'📘':'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v18"/>',
'📗':'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v18"/>',
'📙':'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v18"/>',
'🎙':'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8"/>',
'🎤':'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8"/>',
'✍':'<path d="m4 20 4.7-1L20 7.5a2 2 0 0 0-3-3L5.7 16 4 20Zm10.5-12.5 3 3"/>',
'📝':'<path d="M6 2h8l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M14 2v6h5M8 13h8m-8 4h6"/>',
'📊':'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 16v-4m5 4V8m5 8V6"/>',
'📈':'<path d="M3 18h18M5 15l5-5 4 3 5-7"/>',
'🎯':'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
'🔄':'<path d="M20 11a8 8 0 0 0-14-5L4 8m0-5v5h5M4 13a8 8 0 0 0 14 5l2-2m0 5v-5h-5"/>',
'👤':'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
'👥':'<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 4 5"/>',
'💬':'<path d="M20 11a8 8 0 0 1-8 8H5l-2 2v-7a8 8 0 1 1 17-3Z"/><path d="M8 11h8"/>',
'✨':'<path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/>',
'🧩':'<path d="M8 3h3a2 2 0 0 0 4 0h3v5a2 2 0 1 1 0 4v8h-6a2 2 0 1 0-4 0H3v-7a2 2 0 1 0 0-4V3h5Z"/>',
'📋':'<rect x="5" y="4" width="14" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6m-6 4h6"/>',
'🧠':'<path d="M12 5a4 4 0 0 0-7 2 4 4 0 0 0-1 7 4 4 0 0 0 5 6h3V5Zm0 0a4 4 0 0 1 7 2 4 4 0 0 1 1 7 4 4 0 0 1-5 6h-3V5Z"/>',
'⚡':'<path d="m13 2-9 12h7l-1 8 10-12h-7V2Z"/>',
'🎓':'<path d="m2 9 10-5 10 5-10 5-10-5Zm4 3v5c4 4 8 4 12 0v-5m4-3v8"/>',
'✅':'<path d="m4 12 5 5L20 6"/>',
'📅':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 10h18"/>'
};
const keys=Object.keys(icons);
const css=document.createElement('style');css.textContent='.sc-outline-icon{display:inline-block;vertical-align:-.18em;width:1.15em;height:1.15em;flex-shrink:0;stroke:currentColor;stroke-width:1.9;fill:none;stroke-linecap:round;stroke-linejoin:round}.symbol>.sc-outline-icon,.icon>.sc-outline-icon{width:34px;height:34px;stroke-width:1.7}.sc-outline-icon *{pointer-events:none}';document.head.append(css);
function allowed(el){return el&&!el.closest('script,style,textarea,code,pre,svg,[contenteditable],#transcriptText,.cam-transcript,.transcript')&&!!el.closest('a,button,h1,h2,h3,h4,.brand,.eyebrow,.symbol,.icon,.cam-guide,.card,.tile,.skill-card,.sc-quick-item,.cam-audio,.back,.profile-pill,.badge,.mini-student');}
function make(mark){const node=document.createElementNS('http://www.w3.org/2000/svg','svg');node.setAttribute('class','sc-outline-icon');node.setAttribute('viewBox','0 0 24 24');node.setAttribute('aria-hidden','true');node.innerHTML=icons[mark];return node;}
function transform(node){
 if(!node||!node.parentElement||!allowed(node.parentElement))return;
 const str=node.nodeValue;if(!keys.some(k=>str.includes(k)))return;
 const parts=document.createDocumentFragment();let i=0;
 while(i<str.length){const k=keys.find(key=>str.startsWith(key,i));if(k){parts.append(make(k));i+=k.length;if(str[i]==='\uFE0F')i++;}else{let next=i+1;while(next<str.length&&!keys.some(key=>str.startsWith(key,next)))next++;parts.append(document.createTextNode(str.slice(i,next)));i=next;}}
 node.replaceWith(parts);
}
function scan(root){if(root.nodeType===3){transform(root);return}if(root.nodeType!==1)return;const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walk.nextNode())nodes.push(walk.currentNode);nodes.forEach(transform);}
function init(){scan(document.body);const ob=new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes)scan(n)});ob.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();