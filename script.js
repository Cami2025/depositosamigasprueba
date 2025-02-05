const CACHE_NAME = 'depositosamigas-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/style.css',
  '/script.js',
  '/creamfields.mp4',
  '/audiofile.mp3',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// ✅ Instalación y almacenamiento en caché
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Archivos cacheados exitosamente');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Activar inmediatamente
});

// 🚀 Activación y eliminación de cachés antiguos
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 🌐 Interceptar solicitudes de red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve el recurso desde la caché si está disponible
        return response || fetch(event.request).catch(() => {
          // Si no hay conexión, muestra index.html
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
