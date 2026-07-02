(() => {
  "use strict";

  // Register the service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .catch((err) => console.warn("Service worker registration failed:", err));
    });
  }

  // Capture the install prompt so it can be triggered later if a custom
  // "Add to Home Screen" button is ever added to the page.
  let deferredInstallPrompt = null;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
  });

  // Exposed in case a future UI element wants to trigger the install flow:
  // window.__installApp()
  window.__installApp = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  };
})();

