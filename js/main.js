import router from './router.js';
import { urlBase64ToUint8Array } from './utils/web-push.js';

const VAPID_PUBLIC_KEY = 'BKt_cM0Uoq5ijZexhi46VAL7lRT0AjIXdSXuP_guU1NgfzCtSYUYeECFD-_KxX40TnFLbFRXWPwkF0c0epLFF60';

// Update navbar based on login state
function updateNavbar() {
  // Coba cari elemen navbar dengan 2 kemungkinan ID
  const navbar = document.getElementById('navbar') || document.getElementById('navLinks');
  const token = localStorage.getItem('token');

  if (!navbar) {
    console.warn('⚠️ Elemen navbar tidak ditemukan di halaman.');
    return;
  }

  // Jika sudah login
  if (token) {
    navbar.innerHTML = `
      <nav class="navbar">
        
        <div class="nav-links">
          <a href="#/" class="nav-btn">🏠 Home</a>
          <a href="#/add" class="nav-btn">➕ Tambah Story</a>
          <button id="logoutBtn" class="nav-btn logout-btn">🚪 Logout</button>
        </div>
      </nav>
    `;

    // Tombol logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('Anda telah berhasil logout.');
        updateNavbar();
        window.location.hash = '#/login';
      });
    }

  // Jika belum login
  } else {
    navbar.innerHTML = `
      <nav class="navbar">
        <div class="nav-brand">WebGIS Story</div>
        <div class="nav-links">
          <a href="#/" class="nav-btn">🏠 Home</a>
          <a href="#/login" class="nav-btn">🔑 Login</a>
          <a href="#/register" class="nav-btn">📝 Register</a>
        </div>
      </nav>
    `;
  }
}


// Register Service Worker for PWA
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('./service-worker.js');
      console.log('Service Worker registered successfully');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Initialize push notifications
const initializePushNotifications = async (swRegistration) => {
  try {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return;
      }
    }

    if (Notification.permission === 'granted') {
      const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
      console.log('Push notification subscription successful');
    }
  } catch (error) {
    console.error('Push notification setup failed:', error);
  }
};

// Initialize app on load
const initializeApp = async () => {
  updateNavbar();
  
  const swRegistration = await registerServiceWorker();
  if (swRegistration) {
    await navigator.serviceWorker.ready;
    await initializePushNotifications(swRegistration);
  }
};

// Event listeners
window.addEventListener('load', () => {
  router();
  initializeApp();
});

window.addEventListener('hashchange', () => {
  router();
  updateNavbar();
});

// Make updateNavbar global for router
window.updateNavbar = updateNavbar;