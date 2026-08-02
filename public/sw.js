self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.registration.unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      clients.forEach(client => {
        if (client.url && 'navigate' in client) {
          try {
            client.navigate(client.url);
          } catch (e) {
            console.error('Failed to reload client:', e);
          }
        }
      });
    });
});
