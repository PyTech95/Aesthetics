/* CLA Aesthetics & Wellness — App shell service worker */
const CACHE = "cla-shell-v1";
const SHELL = ["/", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never cache the API
  if (url.pathname.startsWith("/api/")) return;

  // Network-first for navigation, fallback to cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => null);
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Stale-while-revalidate for everything else
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => null);
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
