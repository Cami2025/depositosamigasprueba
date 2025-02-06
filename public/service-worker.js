const CACHE_NAME = 'depositosamigas-cache-v2';
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

// ✅ Instalar y almacenar archivos en caché
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Archivos cacheados exitosamente');
        return cache.addAll(urlsToCache);
      })
  );
});

// 🚀 Activar y limpiar cachés antiguos
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 🌐 Interceptar solicitudes de red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
          .catch(() => {
            // 📴 Si no hay conexión, devolver `index.html` solo si es una página
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});
