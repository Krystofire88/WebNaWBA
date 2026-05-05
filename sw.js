const CACHE_NAME = "minesweeper-v3";
const FILES_TO_CACHE = [
    "/WebNaWBA/",
    "/WebNaWBA/index.html",
    "/WebNaWBA/index.js",
    "/WebNaWBA/minefield.html",
    "/WebNaWBA/minefield.js",
    "/WebNaWBA/manifest.json",
    "/WebNaWBA/src/output.css",
    "/WebNaWBA/assets/bomb.png",
    "/WebNaWBA/assets/flag.png",
    "/WebNaWBA/assets/dessert_numbers_1.png",
    "/WebNaWBA/assets/dessert_numbers_2.png",
    "/WebNaWBA/assets/dessert_numbers_3.png",
    "/WebNaWBA/assets/dessert_numbers_4.png",
    "/WebNaWBA/assets/dessert_numbers_5.png",
    "/WebNaWBA/assets/dessert_numbers_6.png",
    "/WebNaWBA/assets/dessert_numbers_7.png",
    "/WebNaWBA/assets/dessert_numbers_8.png",
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});