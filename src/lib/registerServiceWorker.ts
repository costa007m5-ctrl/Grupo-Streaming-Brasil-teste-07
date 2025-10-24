export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        // Use an absolute path to ensure the SW is registered at the root scope
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('✅ Service Worker registrado com sucesso:', registration.scope);
      } catch (error) {
        console.error('❌ Falha ao registrar o Service Worker:', error);
      }
    });
  }
}