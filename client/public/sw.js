const CACHE_NAME = 'taskflowpro-cache-v1';
const ASSETS = [
  '/',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
];

self.addEventListener('error', event => {
  console.error('SW Global Error:', event.error);
});

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching core assets');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    ).catch((error) => {
      console.error('Activation failed:', error);
    })
  );
});

// Fetch Event (Unified)
self.addEventListener('fetch', (event) => {
  // Network first for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event?.request)
        .then(response => {
          if (response.ok && event.request.method === 'GET') {
            const clone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then(cachedResponse => cachedResponse ||
            new Response('Network error', { status: 503 })
          ))
    );
  }
  // Cache first for static assets
  else {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => cachedResponse || fetch(event.request))
        .catch((error) => {
          console.error('Error in fetch event handler:', error);
          // Return an appropriate fallback or error response
          return new Response('An error occurred.', {
            status: 500,
            headers: { 'Content-Type': 'text/plain' }
          })
        })
    );
  }
});
