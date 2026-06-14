// sw.js (Debe estar en la raíz del proyecto)
const CACHE_NAME = 'music-app';
const ASSETS_TO_CACHE = [
  '/',
  '/login.html',
  '/dashboard.html',
  '/login.js',
  '/dashboard.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); })
    ))
  );
  self.clients.claim();
});

// ESTRATEGIA EXCLUSIVA PARA EL PROYECTO
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Si son peticiones a la API de Deezer (búsquedas, álbumes, artistas, etc.)
  if (url.includes('api.deezer.com')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si hay internet y la respuesta es válida, guardamos una copia dinámica
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open('deezer-dynamic-cache').then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // SI NO HAY INTERNET: Buscamos si el usuario ya había entrado a este álbum/artista antes
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            
            // Si nunca lo visitó, devolvemos un JSON vacío estructurado para que jQuery no rompa el código
            return new Response(JSON.stringify({ data: [], error: "offline" }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Para los archivos locales del proyecto (HTML, JS, CSS)
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