/* Presentation-only image correction for Manufacturing Bricks.
 * Does not modify process-data, model answers or scoring.
 * Masks the eight decorative number circles and labels the excavator as "digger".
 */
(function(){
  'use strict';
  if (String(window.PROCESS_TASK_ID) !== '01') return;
  const preview = document.querySelector('.imgwrap > img');
  const large = document.querySelector('#imgDialog .modalimg');
  if (!preview || !large) return;
  const asset = preview.getAttribute('src');
  if (!asset) return;
  const original = new Image();
  original.onload = function(){
    try {
      const canvas = document.createElement('canvas');
      canvas.width = original.naturalWidth;
      canvas.height = original.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(original,0,0);
      // Design coordinates are normalized to the current 1586 x 992 asset.
      ctx.save();
      ctx.scale(canvas.width/1586, canvas.height/992);
      // Keep the stage heading text while removing the numbered bubbles.
      const badges = [
        [62,163,37,40], [427,163,37,40],
        [866,164,37,40], [1238,163,37,40],
        [69,631,37,40], [367,631,37,40],
        [745,631,37,40], [1239,631,37,40]
      ];
      for(const [x,y,rx,ry] of badges){
        ctx.fillStyle='#fff';
        ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();
      }
      // Grounded label from the original process drawing: "digger".
      ctx.fillStyle='#071e49';
      ctx.font='bold 28px Georgia, serif';
      ctx.textBaseline='alphabetic';
      ctx.fillText('digger',48,258);
      ctx.strokeStyle='#071e49';
      ctx.fillStyle='#071e49';
      ctx.lineWidth=4;
      ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(115,270);ctx.lineTo(168,339);ctx.stroke();
      ctx.beginPath();ctx.moveTo(168,339);ctx.lineTo(151,331);ctx.lineTo(163,317);ctx.closePath();ctx.fill();
      ctx.restore();
      const clean = canvas.toDataURL('image/png');
      preview.src=clean;
      large.src=clean;
    }catch(error){console.warn('Unable to render brick diagram correction:',error);}
  };
  original.onerror=function(){console.warn('Brick diagram could not be loaded for number removal');};
  original.src=asset;
})();