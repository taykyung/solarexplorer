// Solar Explorer 오프라인 캐시: 앱 파일은 미리 저장, 3D 라이브러리·글꼴은 처음 받을 때 저장
const VER='solar-explorer-v1';
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(VER).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const req=e.request; if (req.method!=='GET') return;
  // 새 버전이 있으면 받아 두고, 없거나 오프라인이면 저장된 것으로
  e.respondWith(caches.open(VER).then(async c=>{
    const hit=await c.match(req, { ignoreSearch: req.mode==='navigate' });
    const net=fetch(req).then(r=>{ if (r && (r.ok || r.type==='opaque')) c.put(req, r.clone()); return r; }).catch(()=>hit);
    return hit || net;
  }));
});
