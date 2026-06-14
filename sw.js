// sw.js
const CACHE_NAME = 'music-app-v1';
const DYNAMIC_CACHE = 'deezer-dynamic-cache';

const ASSETS_TO_CACHE = [
  '/',
  '/login.html',
  '/dashboard.html',
  '/login.js',
  '/dashboard.js'
];

// Instalación: Guardar archivos estáticos esenciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activación: Limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim();
});

// Intercepción de Red y Estrategia de Caché
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Interceptar peticiones orientadas a Deezer (incluyendo variaciones de JSONP simuladas o fetch directo)
  if (url.includes('api.deezer.com')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Fallback en modo Offline: Buscar en la caché dinámica
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            
            // Si no está en caché, devolvemos una respuesta vacía limpia para evitar que la app explote
            return new Response(JSON.stringify({ data: [], total: 0, error: "offline" }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Estrategia Network-First con Fallback a Caché para recursos locales
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200 && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});