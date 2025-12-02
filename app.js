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
  const start = Date.now();

  window.location.href = APP_SCHEME;

  setTimeout(() => {
    const elapsed = Date.now() - start;

    if (elapsed < 1500) {
      if (isIOS()) {
        window.location.href = IOS_STORE_URL;
      } else {
        window.location.href = ANDROID_STORE_URL;
      }
    }
  }, 1000);
}

document
  .getElementById("open-app-btn")
  .addEventListener("click", openMobileApp);
