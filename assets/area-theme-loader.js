/* Area theme loader: route-driven and idempotent across all IELTS pages. */
(()=>{'use strict';
if(window.__scAreaThemeLoaded)return;window.__scAreaThemeLoaded=true;
const parts=decodeURIComponent(location.pathname).split('/').filter(Boolean);
const folder=parts.find(p=>/^Read\d+$/i.test(p)||/^Lis\d+$/i.test(p)||/^Wri\d+$/i.test(p));
const area=folder?'test':parts.includes('Practice')?'practice':parts.includes('Foundations')||parts.includes('Vocabulary-Notebook')?'foundations':parts.includes('Progress')?'progress':'home';
document.documentElement.dataset.scArea=area;
const apply=()=>{document.body?.classList.add('sc-area-'+area);};
if(document.body)apply();else document.addEventListener('DOMContentLoaded',apply,{once:true});
const base=new URL('./',document.currentScript?.src||location.href);
if(!document.querySelector('link[data-sc-area-theme]')){
 const link=document.createElement('link');link.rel='stylesheet';link.dataset.scAreaTheme=area;
 link.href=new URL('area-theme.css?v=20261118-scoped01',base).href;
 document.head.append(link);
}
})();