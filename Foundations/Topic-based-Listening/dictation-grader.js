/* Dictation word-level alignment: missing, extra, incorrect and correct words. */
(function(root){
 'use strict';
 const tokens=text=>String(text||'').normalize('NFKC').toLowerCase()
  .replace(/[‘’]/g,"'").replace(/[‐‑–—]/g,'-')
  .match(/[a-z0-9]+(?:['-][a-z0-9]+)*/g)||[];
 function compare(expected,actual){
  const a=tokens(expected),b=tokens(actual),m=a.length,n=b.length;
  const dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
  for(let i=0;i<=m;i++)dp[i][0]=i;
  for(let j=0;j<=n;j++)dp[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){
   dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,
       dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1.25));
  }
  let i=m,j=n;const edits=[];
  while(i>0||j>0){
   if(i>0&&j>0&&a[i-1]===b[j-1]&&Math.abs(dp[i][j]-dp[i-1][j-1])<.001){
    edits.push({kind:'correct',expected:a[i-1],actual:b[j-1]});i--;j--;continue;
   }
   if(i>0&&j>0&&Math.abs(dp[i][j]-dp[i-1][j-1]-1.25)<.001){
    edits.push({kind:'incorrect',expected:a[i-1],actual:b[j-1]});i--;j--;continue;
   }
   if(i>0&&Math.abs(dp[i][j]-dp[i-1][j]-1)<.001){
    edits.push({kind:'missing',expected:a[i-1],actual:''});i--;continue;
   }
   if(j>0){edits.push({kind:'extra',expected:'',actual:b[j-1]});j--;continue}
   edits.push({kind:'missing',expected:a[i-1],actual:''});i--;
  }
  edits.reverse();
  const counts={correct:0,missing:0,extra:0,incorrect:0};
  for(const edit of edits)counts[edit.kind]++;
  return {edits,counts,expectedWords:m,actualWords:n,accuracy:m?Math.round(100*counts.correct/m):0,perfect:counts.correct===m&&!counts.missing&&!counts.extra&&!counts.incorrect};
 }
 root.SmartcomDictationGrader={compare,tokens};
})(window);
