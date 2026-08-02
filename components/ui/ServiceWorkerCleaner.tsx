"use client";

import { useEffect } from "react";

export default function ServiceWorkerCleaner() {
  useEffect(() => {
    // Avoid running on server side
    if (typeof window === "undefined") return;

    // Check if we've already done cleanup in this session
    const CLEANUP_KEY = "mourika_sw_cleaned_v1";
    if (sessionStorage.getItem(CLEANUP_KEY)) {
      return;
    }

    // Run clean up when browser is idle to protect load time
    const performCleanup = () => {
      let forceReload = false;
      const promises: Promise<any>[] = [];

      // 1. Unregister all service workers
      if ("serviceWorker" in navigator) {
        promises.push(
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            if (registrations.length > 0) {
              const unregisterPromises = registrations.map((reg) =>
                reg.unregister().then((unregistered) => {
                  if (unregistered) {
                    console.log("[Mourika SW Cleaner] Unregistered SW:", reg);
                    forceReload = true;
                  }
                })
              );
              return Promise.all(unregisterPromises);
            }
          })
        );
      }

      // 2. Clear all cache storage keys
      if ("caches" in window) {
        promises.push(
          caches.keys().then((keys) => {
            if (keys.length > 0) {
              const deletePromises = keys.map((key) =>
                caches.delete(key).then((deleted) => {
                  if (deleted) {
                    console.log("[Mourika SW Cleaner] Deleted Cache Storage:", key);
                    forceReload = true;
                  }
                })
              );
              return Promise.all(deletePromises);
            }
          })
        );
      }

      // 3. Wait for all cleanup tasks to finish, set session flag, and conditionally reload
      Promise.all(promises)
        .then(() => {
          sessionStorage.setItem(CLEANUP_KEY, "true");
          // If we actually deleted an active service worker or cache, reload the page
          // so the browser fetches the fresh version of the site directly from the server.
          if (forceReload) {
            console.log("[Mourika SW Cleaner] Active Service Worker or cache found & cleared. Reloading to serve latest site version...");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error("[Mourika SW Cleaner] Error during cleanup:", err);
          // Set key anyway to avoid loops on errors
          sessionStorage.setItem(CLEANUP_KEY, "true");
        });
    };

    // Schedule cleanup when browser is idle, fallback to setTimeout if requestIdleCallback not supported
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => performCleanup());
    } else {
      setTimeout(performCleanup, 1000);
    }
  }, []);

  return null;
}
