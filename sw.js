// Three Beards service worker — network-first (updates always win online), cache fallback (offline still plays)
const CACHE='three-beards-v1';
self.addEventListener('install',e=>{self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./three-beards.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'])));});
self.addEventListener('activate',e=>{e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;})
      .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./three-beards.html'))));});
