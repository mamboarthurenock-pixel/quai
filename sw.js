const CACHE = "quai-v2";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.pathname.startsWith("/api/") || u.pathname.startsWith("/img/") || u.pathname.startsWith("/login")) return;
  // réseau d'abord (app toujours à jour), cache en secours
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && r.ok) { const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)).catch(()=>{}); }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
