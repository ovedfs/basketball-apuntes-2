/* =================================================================
   BasquetPro · Service Worker
   Estrategia: red primero para navegación, caché primero para assets.
================================================================= */
const CACHE_NAME = 'basquetpro-v1';
const APP_SHELL = [
  './',
  './index.html',
  './js/app.js',
  './js/flashcards.js',
  './js/games.js',
  './js/exam.js',
  './js/questions.js',
  './manifest.json',
  './icons/icon.svg'
];

// Instalación: precachear el "app shell"
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activación: limpiar cachés antiguas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Intercepción de peticiones
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // Solo gestionamos peticiones del mismo origen
  if (url.origin !== self.location.origin) return;

  // Navegación: red primero, con respaldo a la copia en caché (offline)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Assets: caché primero, luego red (y guardar para la próxima)
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
        }
        return res;
      });
    })
  );
});
