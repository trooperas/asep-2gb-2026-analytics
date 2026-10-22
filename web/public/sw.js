// web/public/sw.js
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Passive fetch passthrough: guarantees installability heuristic without memory/caching overhead
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});