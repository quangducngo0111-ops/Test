/* Smartcom portal category theme: route-driven, shared by every nested lesson. */
(()=>{'use strict';
if(window.__scAreaThemeLoaded)return;window.__scAreaThemeLoaded=true;
const parts=decodeURIComponent(location.pathname).split('/').filter(Boolean);
const has=x=>parts.some(p=>p.toLowerCase()===x.toLowerCase());
const match=x=>parts.some(p=>x.test(p));
const isTest=match(/^(Read|Lis|Wri)\d+$/i)||has('WritingTests')||has('mock-test')||has('FullTest');
const isFoundation=has('Foundations')||has('Vocabulary-Notebook')||has('GuidedListening')
 ||has('Grammar')||has('Vocabulary')||has('Intensive Listening')||has('Topic-based-Listening')
 ||has('Pre-IELTS');
const area=isTest?'test':isFoundation?'foundations':has('Progress')?'progress':has('Practice')?'practice':'home';
document.documentElement.dataset.scArea=area;
const apply=()=>document.body?.classList.add('sc-area-'+area);
if(document.body)apply();else document.addEventListener('DOMContentLoaded',apply,{once:true});
const base=new URL('./',document.currentScript?.src||location.href);
if(!document.querySelector('link[data-sc-area-theme]')){
 const link=document.createElement('link');
 link.rel='stylesheet';link.dataset.scAreaTheme=area;
 link.href=new URL('area-theme.css?v=20261119-portal-category03',base).href;
 document.head.append(link);
}
})();