const APP_SCHEME = "myapp://home";
const IOS_STORE_URL = "https://apps.apple.com/fr/app/localresto/id6744366088";
const ANDROID_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.appyourself.suite.local&pli=1";

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isAndroid() {
  return /android/i.test(navigator.userAgent);
}

function openMobileApp() {
  if (isIOS()) {
    // Sur iOS, créer un iframe caché pour éviter la popup de confirmation
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = APP_SCHEME;
    document.body.appendChild(iframe);

    let appOpened = false;

    const checkAppOpened = () => {
      if (document.hidden || document.webkitHidden) {
        appOpened = true;
      }
    };

    document.addEventListener("visibilitychange", checkAppOpened);
    document.addEventListener("webkitvisibilitychange", checkAppOpened);

    // Si après 2.5 secondes l'app ne s'est pas ouverte, aller au store
    setTimeout(() => {
      document.removeEventListener("visibilitychange", checkAppOpened);
      document.removeEventListener("webkitvisibilitychange", checkAppOpened);
      
      if (!appOpened && !document.hidden) {
        window.location.href = IOS_STORE_URL;
      }
      
      // Nettoyer l'iframe
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }, 2500);
    
  } else if (isAndroid()) {
    // Pour Android, utiliser Intent avec fallback
    const intentUrl = `intent://home#Intent;scheme=myapp;package=com.appyourself.suite.local;end`;
    window.location.href = intentUrl;

    // Fallback vers le Play Store si l'app ne s'ouvre pas
    setTimeout(() => {
      if (!document.hidden) {
        window.location.href = ANDROID_STORE_URL;
      }
    }, 2000);
  }
}

document
  .getElementById("open-app-btn")
  .addEventListener("click", openMobileApp);
