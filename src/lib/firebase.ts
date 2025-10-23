import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAojBY9DyRazf6HCTT0TzVXjVb0rHnNrUw",
  authDomain: "grupo-streaming-brasil-aa209.firebaseapp.com",
  projectId: "grupo-streaming-brasil-aa209",
  storageBucket: "grupo-streaming-brasil-aa209.firebasestorage.app",
  messagingSenderId: "327054711097",
  appId: "1:327054711097:web:e3faaceea1dacc6ac870e8",
  measurementId: "G-2XPES2JXS4"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

// Chave VAPID do seu projeto Firebase
const VAPID_KEY = 'BCPd6alYmTLBqQ91QgJhsmFQSl4sSK0JcZ2LRh0aLyi7eDuP5C9PKAX4-6-mJ-O58zJ8NnyKhqrxZqBunMlPvc8';

/**
 * Solicita permissão de notificação e recupera o token FCM.
 */
export async function requestPermissionAndToken() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    console.warn("Este navegador não suporta notificações push.");
    return;
  }
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Permissão para notificações concedida.");
      const registration = await navigator.serviceWorker.ready;
      const token = await getToken(messaging, { 
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration 
      });
      console.log("✅ Token FCM obtido:", token);
    } else {
      console.warn("🚫 Permissão de notificações negada.");
      sessionStorage.setItem('notification_prompt_dismissed', 'true');
    }
  } catch (error) {
    console.error("❌ Erro ao solicitar permissão ou obter token FCM:", error);
  }
}