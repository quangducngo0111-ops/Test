(async()=>{'use strict';
const node=document.getElementById('lesson-data');
if(!node)return;
try{
const config=JSON.parse(node.textContent);
const response=await fetch('../../shared/full-template.html?v=20261112-opinion-original',{cache:'no-store'});
if(!response.ok)throw new Error('Không tải được giao diện gốc: '+response.status);
const markup=(await response.text()).replace('__WT2_DATA__',JSON.stringify(config).replace(/</g,'\\u003c'));
if(!markup.includes('const C='+JSON.stringify(config).slice(0,20)))throw new Error('Lỗi ghép dữ liệu đề bài');
document.open();document.write(markup);document.close();
}catch(err){
console.error('Writing Task 2 template:',err);
const x=document.createElement('div');x.style.cssText='margin:12px auto;max-width:1100px;padding:10px;border:1px solid #eeccaa;border-radius:10px;background:#fff4e8;color:#723b1c';
x.textContent='Giao diện hướng dẫn nâng cao chưa tải được; trang vẫn có thể sử dụng bản luyện viết dự phòng.';document.body.prepend(x);
}
})();