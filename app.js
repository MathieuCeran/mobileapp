const IOS_STORE_URL = "https://apps.apple.com/fr/app/localresto/id6744366088";
const ANDROID_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.appyourself.suite.local&pli=1";

// Liste de tous les schemes possibles à tester
const POSSIBLE_SCHEMES = [
  "localresto://",
  "com.appyourself.suite.local://",
  "appyourself://",
  "suite.local://",
];

let currentSchemeIndex = 0;
let testMode = false;

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isAndroid() {
  return /android/i.test(navigator.userAgent);
}

function log(message, data = "") {
  const logDiv = document.getElementById("log-output");
  if (!logDiv) return;
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement("div");
  logEntry.style.padding = "5px";
  logEntry.style.borderBottom = "1px solid #eee";
  logEntry.innerHTML = `<strong>${timestamp}:</strong> ${message} ${data}`;
  logDiv.appendChild(logEntry);
  logDiv.scrollTop = logDiv.scrollHeight;
  console.log(`${timestamp}: ${message}`, data);
}

function testNextScheme() {
  if (currentSchemeIndex >= POSSIBLE_SCHEMES.length) {
    log("❌ Aucun scheme testé n'a fonctionné");
    log("⏭️ Redirection vers l'App Store dans 2 secondes...");
    setTimeout(() => {
      location.replace(IOS_STORE_URL);
    }, 2000);
    return;
  }

  const scheme = POSSIBLE_SCHEMES[currentSchemeIndex];
  log(
    `🔍 Test ${currentSchemeIndex + 1}/${POSSIBLE_SCHEMES.length}: ${scheme}`
  );

  // Méthode rapide avec webkitHidden
  location.replace(scheme);

  setTimeout(() => {
    if (!document.webkitHidden) {
      log(`❌ Scheme ne fonctionne pas`);
      currentSchemeIndex++;
      setTimeout(() => testNextScheme(), 500);
    } else {
      log(`✅ SUCCESS! L'app s'est ouverte avec: ${scheme}`);
    }
  }, 25);
}

function openMobileApp() {
  log("🎯 Fonction appelée");
  log("📱 Device:", isIOS() ? "iOS" : isAndroid() ? "Android" : "Autre");

  if (isIOS()) {
    if (testMode) {
      log("🧪 Mode test - Test de tous les schemes");
      currentSchemeIndex = 0;
      testNextScheme();
    } else {
      // Mode normal - essayer d'ouvrir l'app directement
      const scheme = "com.appyourself.suite.local://";
      log(`📱 Tentative avec: ${scheme}`);

      location.replace(scheme);
      setTimeout(() => {
        if (!document.webkitHidden) {
          log("⏭️ Redirection App Store...");
          location.replace(IOS_STORE_URL);
        } else {
          log("✅ App ouverte!");
        }
      }, 25);
    }
  } else if (isAndroid()) {
    log("🤖 Android - Redirection Play Store");
    location.replace(ANDROID_STORE_URL);
  } else {
    log("❌ Device non supporté");
  }
}

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
  log("✨ Page chargée");
  log("📱 UserAgent:", navigator.userAgent);

  // Activer le mode test
  const testBtn = document.getElementById("test-mode-btn");
  if (testBtn) {
    testBtn.addEventListener("click", () => {
      testMode = true;
      log("🧪 MODE TEST ACTIVÉ");
      testBtn.style.background = "#16a34a";
      testBtn.textContent = "✅ Mode test activé";
      testBtn.disabled = true;
    });
  }

  // Ouvrir l'app
  const openBtn = document.getElementById("open-app-btn");
  if (openBtn) {
    openBtn.addEventListener("click", openMobileApp);
  }
});
