/* Ensure the same floating AssistiveTouch appears in every learning/exam module that loads a shared toolkit. */
(()=>{'use strict';if(window.__scQuickLoaderQueued||document.getElementById('sc-quick-shell'))return;window.__scQuickLoaderQueued=true;
const current=document.currentScript;if(!current)return;
const script=document.createElement('script');script.dataset.scGlobalQuick='1';
script.src=new URL('../Practice/shared/smartcom-ui.js?v=20261126-reading-timer02',current.src).href;
(document.body||document.head||document.documentElement).append(script);
})();