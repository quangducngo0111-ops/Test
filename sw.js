/* IELTS Test Portal PWA: navigation is network-first to avoid stale exams.
   Only the entry shell and icons are cached. Exam assets/questions/audio remain network requests. */
const VERSION='ielts-shell-v1-20261114';
const SCOPE=self.registration.scope;
const HOME=new URL('./',SCOPE).href;
const SHELL=[HOME,new URL('manifest.webmanifest',SCOPE).href,
  new URL('assets/pwa/icon-192.svg',SCOPE).href,
  new URL('assets/pwa/icon-512.svg',SCOPE).href];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(VERSION).then(async cache=>{
    await Promise.allSettled(SHELL.map(url=>cache.add(new Request(url,{cache:'reload'}))));
  }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ielts-shell-')&&k!==VERSION).map(k=>caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  // Navigation pages should never be served stale when the network works.
  if(req.mode==='navigate'){
    event.respondWith(fetch(new Request(req,{cache:'no-store'})).then(response=>{
      if(response.ok && (new URL(req.url).pathname===new URL(HOME).pathname ||
        new URL(req.url).pathname===new URL(HOME).pathname+'index.html')){
        const copy=response.clone();
        event.waitUntil(caches.open(VERSION).then(cache=>cache.put(HOME,copy)));
      }
      return response;
    }).catch(async()=>{
      const cache=await caches.open(VERSION);
      return await cache.match(HOME) || Response.error();
    }));
  }
});
