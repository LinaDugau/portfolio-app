const CACHE_NAME = "resume-cache-v1";

const URLS = [
  "/",
  "/index.html",
  "/style.css",
  "/manifest.json"
];

// Установка SW и кеширование
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS).catch((err) => {
        console.log("Ошибка кеширования:", err);
      });
    })
  );
  self.skipWaiting();
});

// Активация SW
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

// Работа оффлайн
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
