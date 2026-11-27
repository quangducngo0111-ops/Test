/* Standalone Tomato Ketchup visual guard. Fixes old cached engine paths as well. */
(()=>{'use strict';
const TOMATO_PHOTO_URLS=["https://static-images.vnncdn.net/files/publish/2024/1/29/vn-warned-of-barriers-facing-farm-exports-told-to-improve-quality-8.jpg?s=x9oC9IWxyPuDClhG1B2g1Q&width=0","https://www.filtrade.co/inicio/images/demo/projects/i9.jpg","https://www.lonkiaru.com/dm-content/uploads/jt5dmxi47yfwozq3861nal2u.jpg","https://www.agrolink.com.br/upload/imagens-resizes/98e41889c1db44a3944197d4eecb1a02_1200x800.jpg","https://www.zfhd.co.jp/img/kv_pht0102.jpg","https://www.sgs.com/-/media/sgscorp/images/l-middleeast/gfi-improves-productivity-and-boosts-exports-with-certifications-by-sgs.cdn.en-LB.1.jpg","https://resourcewebsite.singoo.cc/attached/20240625052621_85496.jpg","https://investsaudi.sa/sectors/SectorsDetails/agriculture/blocks/5.webp","https://cdn.visiteliti.com/article/2022-12/29/sCOQziWvBz1iXhASmdkS_1672309908.jpeg","https://static.ssb.ee/images/universal/PALETTIVEDU-TURVALINE-JA-OIGEAEGNE-PALETTIDE-TRANSPORT-KOOS-FTL-LTL-JA-LAADIMIS-NING-MAHALAADIMISTEENUSTEGA_19153722_m_l.jpeg"];
const TOMATO_STEPS=[
 ['Hái cà chua','🍅','pick'],
 ['Phân loại cà chua','🍅','sort'],
 ['Bỏ cuống và hạt','🔪','seed'],
 ['Nghiền cà chua','⚙️','crush'],
 ['Thêm đường và giấm','🧂','add'],
 ['Đun sôi hỗn hợp','♨️','boil'],
 ['Để hỗn hợp lắng','⏳','stand'],
 ['Đóng chai tương cà','🍾','bottle'],
 ['Kiểm tra chất lượng','🔎','inspect'],
 ['Vận chuyển đến siêu thị','🚚','deliver']
];
function tomatoStageScene(index){
 const item=TOMATO_STEPS[index]||TOMATO_STEPS[0];
 const background='<rect width="780" height="580" fill="#f8eee4"/><rect width="780" height="350" fill="#fff4e9"/><rect y="350" width="780" height="230" fill="#e8d4bd"/><path d="M0 350H780" stroke="#d0a98c" stroke-width="5"/>';
 const tomato=(x,y,r=43)=>'<g transform="translate('+x+' '+y+')"><circle r="'+r+'" fill="#db3f2e" stroke="#b3241d" stroke-width="4"/><ellipse cx="'+(-r*.25)+'" cy="'+(-r*.3)+'" rx="'+(r*.2)+'" ry="'+(r*.12)+'" fill="#ffad86" opacity=".55"/><path d="M0 0l-12 -22 12 7 12 -7 -6 20 22 -8 -14 15 -16 2 -14 -9 -18 2 21 -12Z" fill="#397947"/><path d="M0 -12v-16" stroke="#36713b" stroke-width="5"/></g>';
 const bottle=(x,y,filled=true)=>'<g transform="translate('+x+' '+y+')"><path d="M-26 -110H26V-76L44 -46V105Q44 118 32 118H-32Q-44 118-44 105V-46L-26 -76Z" fill="'+(filled?'#d64b36':'#fcffff')+'" stroke="#935a49" stroke-width="6"/><rect x="-30" y="-124" width="60" height="19" rx="5" fill="#e9dcc8" stroke="#956b54" stroke-width="4"/><rect x="-37" y="-22" width="74" height="73" rx="6" fill="#fff2d4" stroke="#e2c69d" stroke-width="3"/><text x="0" y="12" text-anchor="middle" font-size="15" font-family="Arial" fill="#ac382a" font-weight="bold">TOMATO</text>'+tomato(0,28,13)+'</g>';
 const pot='<path d="M220 283H560L530 462Q525 482 506 482H274Q255 482 250 462Z" fill="#a9b8bc" stroke="#5e7e8c" stroke-width="9"/><path d="M235 283H545" stroke="#fff" stroke-width="13"/><path d="M220 322Q390 295 560 322V370Q390 345 220 370Z" fill="#d94c38"/>';
 const machine='<rect x="220" y="205" width="350" height="260" rx="25" fill="#b6ccd3" stroke="#6e94a0" stroke-width="10"/><rect x="263" y="240" width="268" height="135" rx="16" fill="#e6f3f0" stroke="#7c9ca5" stroke-width="6"/><rect x="300" y="400" width="190" height="28" rx="13" fill="#5d8b9e"/>';
 let art='';
 switch(index){
 case 0:art='<path d="M0 344Q175 292 360 336T780 330" fill="#8eb97c"/><path d="M365 70v244M250 160q105 -67 115 55M365 215q102 -100 205 -35" fill="none" stroke="#477d49" stroke-width="17"/>'+tomato(240,270,60)+tomato(366,307,59)+tomato(536,264,60)+'<path d="M520 120q80 -85 130 -8" fill="none" stroke="#457b48" stroke-width="17"/>';break;
 case 1:art='<path d="M50 340L700 340 650 430 110 430Z" fill="#8b999a" stroke="#536f78" stroke-width="9"/><path d="M75 370H670M95 408H650" stroke="#d6e1df" stroke-width="8"/>'+tomato(160,310,47)+tomato(310,310,47)+tomato(460,310,47)+tomato(600,310,38)+'<path d="M365 220v-70m0 0l-32 32m32-32l32 32" fill="none" stroke="#3979a6" stroke-width="10"/><rect x="285" y="453" width="190" height="54" rx="10" fill="#bb8b62"/>';break;
 case 2:art='<rect x="90" y="270" width="600" height="195" rx="24" fill="#ddbb8d" stroke="#ae805f" stroke-width="8"/>'+tomato(240,315,66)+'<path d="M410 240a95 95 0 1 0 0 190a95 95 0 1 0 0-190" fill="#d8402c" stroke="#a72d1d" stroke-width="5"/><path d="M410 240v190M315 335h190" stroke="#f0a675" stroke-width="8"/>'+Array.from({length:8},(_,i)=>'<ellipse cx="'+(377+(i%4)*20)+'" cy="'+(310+Math.floor(i/4)*45)+'" rx="6" ry="10" fill="#f3d5a1"/>').join('')+'<path d="M530 140l115 145 -20 16 -130-120Z" fill="#7f9ea8"/>';break;
 case 3:art=machine+'<path d="M296 270q45 -34 85 0t90 0v68q-50 48-90 0t-85 0Z" fill="#d64834"/><path d="M300 200L390 124 480 200" fill="#8da6a9" stroke="#587d86" stroke-width="8"/><circle cx="390" cy="315" r="42" fill="#a02b25" stroke="#712721" stroke-width="7"/><path d="M355 315h70M390 280v70" stroke="#fff0e0" stroke-width="9"/>';break;
 case 4:art=pot+'<path d="M135 110l100 150 -25 18 -105-155Z" fill="#e2e2d3" stroke="#8da7af" stroke-width="6"/><path d="M545 122v115h90V122Z" fill="#edf4f4" stroke="#8aa7ae" stroke-width="7"/><path d="M545 194h90v43h-90Z" fill="#e0ab5d"/><path d="M585 94v29" stroke="#947145" stroke-width="11"/><circle cx="390" cy="310" r="16" fill="#fff"/>';break;
 case 5:art=pot+'<path d="M270 515h240" stroke="#f29b39" stroke-width="32" stroke-linecap="round"/><path d="M306 528q20 48 35 0t35 0t35 0t35 0" fill="none" stroke="#dd5d2c" stroke-width="14"/><path d="M295 210q-20 -25 0 -56t0 -56M395 210q-20 -25 0 -56t0 -56M495 210q-20 -25 0 -56t0 -56" stroke="#b4afb2" stroke-width="12" fill="none" stroke-linecap="round"/>';break;
 case 6:art=pot+'<path d="M210 278H570" stroke="#6c8a93" stroke-width="18"/><circle cx="555" cy="205" r="55" fill="#fdf8e7" stroke="#728f98" stroke-width="9"/><path d="M555 205v-35m0 35l27 15" stroke="#6b7f84" stroke-width="8" stroke-linecap="round"/><path d="M225 270L390 194 550 270" fill="#94a9ae" stroke="#67818b" stroke-width="8"/>';break;
 case 7:art=bottle(270,335)+bottle(510,335)+'<path d="M100 490H680" stroke="#738e94" stroke-width="14"/><path d="M390 112v116" stroke="#7b9599" stroke-width="18"/><path d="M350 220H430" stroke="#7b9599" stroke-width="15"/><path d="M390 220l-28 35h56Z" fill="#db4f3a"/>';break;
 case 8:art=bottle(255,329)+bottle(490,329)+'<circle cx="490" cy="214" r="105" fill="none" stroke="#6e9caa" stroke-width="23"/><path d="M565 290l100 95" stroke="#477283" stroke-width="27" stroke-linecap="round"/><path d="M459 219l22 22 38-49" fill="none" stroke="#3a8b64" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>';break;
 case 9:art='<rect x="140" y="255" width="455" height="185" rx="13" fill="#dba077" stroke="#aa7254" stroke-width="9"/><path d="M150 315h438M310 255v185M460 255v185" stroke="#b78158" stroke-width="8"/><rect x="100" y="430" width="600" height="18" rx="9" fill="#8b6e55"/><rect x="465" y="330" width="230" height="110" rx="12" fill="#e3c28b" stroke="#9b795b" stroke-width="7"/><path d="M695 357h42l32 47v37h-74Z" fill="#e3c28b" stroke="#9b795b" stroke-width="7"/><circle cx="240" cy="460" r="37" fill="#4b545d"/><circle cx="666" cy="460" r="37" fill="#4b545d"/>';break;
 }
 return '<svg class="tomato-stage-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 580" role="img" aria-label="'+item[0]+'" preserveAspectRatio="xMidYMid meet">'+background+art+'</svg>';
}

const style=document.createElement('style');
style.textContent=`
#main .vocab-flip-inner .vocab-picture.tomato-stage-patched{display:block;position:relative;flex:0 0 48%;width:48%;max-width:48%;height:100%;min-width:0;align-self:stretch;overflow:hidden;border-radius:14px;background:#fff4e9}
#main .vocab-picture.tomato-stage-patched img.tomato-stage-photo{display:block!important;width:100%!important;height:100%!important;max-width:100%!important;object-fit:cover!important;object-position:center!important;border-radius:0!important}
#main .vocab-picture.tomato-stage-patched .vocab-image-label{position:absolute;bottom:8px;left:9px;background:#fffffff0;padding:5px 8px;border-radius:20px;font-size:10px;font-weight:700;color:#57607c}
@media(max-width:650px){#main .vocab-flip-inner .vocab-picture.tomato-stage-patched{flex:0 0 58%;width:100%;max-width:100%;height:auto;min-height:0}}
`;
document.head.append(style);
const root=document.getElementById('main');
if(!root)return;
let active=-1;
function fixCards(){
 const card=root.querySelector('.vocab-flip-inner');
 if(!card){active=-1;return;}
 const heading=root.querySelector('.vocab-single-head');
 const match=heading?.textContent?.match(/(?:Thẻ|Card)\s*(\d+)\s*\/\s*\d+/i);
 if(!match)return;
 const idx=Number(match[1])-1;
 if(idx<0||idx>=TOMATO_STEPS.length)return;
 const pictures=card.querySelectorAll('.vocab-face .vocab-picture');
 if(!pictures.length)return;
 if(active===idx&&[...pictures].every(p=>p.dataset.tomatoStage===String(idx)))return;
 const photo=TOMATO_PHOTO_URLS[idx];
 const svg=tomatoStageScene(idx);
 pictures.forEach(p=>{
   p.className='vocab-picture tomato-stage-patched';
   p.innerHTML='<img class="tomato-stage-photo" src="'+photo+'" alt="'+TOMATO_STEPS[idx][0]+'" loading="eager" decoding="async" referrerpolicy="no-referrer" onerror="this.outerHTML=this.parentNode.dataset.fallbackSvg" width="780" height="580">'+'<span class="vocab-image-label">'+TOMATO_STEPS[idx][0]+'</span>';
   p.dataset.fallbackSvg=svg;
   p.dataset.tomatoStage=String(idx);
 });
 active=idx;
}
let busy=false;
const observer=new MutationObserver(()=>{
 if(busy)return;
 busy=true;
 try{fixCards()}finally{busy=false}
});
observer.observe(root,{childList:true,subtree:true});
fixCards();
})();