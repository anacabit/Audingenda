const CACHE = 'audio-agenda-v3.2';
const ARCHIVOS = [
  './index.html',
  './manifest-english.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(
    e.request.url.includes('script.google.com') ||
    e.request.url.includes('allorigins') ||
    e.request.url.includes('corsproxy') ||
    e.request.url.includes('translate.googleapis') ||
    e.request.url.includes('emailjs') ||
    e.request.url.includes('rss')
  ){
    e.respondWith(fetch(e.request).catch(() => new Response('No connection')));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
