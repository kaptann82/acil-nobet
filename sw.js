// Acil Nöbet 3D — çevrimdışı önbellek. Güncelleme yayınlarken SURUM değerini artırın.
const SURUM = 'acil-nobet-v2.33.0';
const DOSYALAR = ['./', './index.html', './three.min.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SURUM).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Önce ağ (güncel sürüm), ağ yoksa önbellek
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok && new URL(e.request.url).origin === location.origin) { const k = r.clone(); caches.open(SURUM).then(c => c.put(e.request, k)); }
    return r;
  }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
