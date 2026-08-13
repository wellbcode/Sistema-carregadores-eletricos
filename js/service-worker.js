const CACHE_NAME = "smart-charger-v1";

const URLS_TO_CACHE = [
    "../../index.html",
    "../../style.css",

    "../../assets/js/carregadores.js",
    "../../assets/js/recargas.js",
    "../../assets/js/conexao.js",

    "../audios/success-1-6297.mp3",
    "../audios/wah-wah-sad-trombone-6347.mp3"
];


// ================= INSTALAÇÃO =================

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(URLS_TO_CACHE))
    );

    self.skipWaiting();
});


// ================= ATIVAÇÃO =================

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(keys => {

            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );

        })
    );

    self.clients.claim();
});


// ================= REDE / CACHE =================

self.addEventListener("fetch", event => {

    if (!event.request.url.startsWith("http")) {
        return;
    }

    event.respondWith(

        fetch(event.request)

            .then(response => {

                const clone = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, clone);
                    });

                return response;
            })

            .catch(() => {

                return caches.match(event.request);
            })
    );
});