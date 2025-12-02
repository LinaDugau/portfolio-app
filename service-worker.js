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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS))
  );
});

// Работа оффлайн
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
