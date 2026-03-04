// empty service worker so GitHub Pages stops erroring
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
