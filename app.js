const IOS_STORE_URL = "https://apps.apple.com/fr/app/localresto/id6744366088";
const ANDROID_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.appyourself.suite.local&pli=1";

// Liste de tous les schemes possibles à tester
const POSSIBLE_SCHEMES = [
  "localresto://",
  "localresto://home",
  "localresto://open",
  "com.appyourself.suite.local://",
  "com.appyourself.suite.local://home",
  "appyourself://",
  "appyourself://home",
  "suite.local://",
  "myapp://",
  "myapp://home",
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
    log("❌ Aucun scheme n'a fonctionné. Redirection vers l'App Store...");
    setTimeout(() => {
      window.location.href = IOS_STORE_URL;
    }, 2000);
    return;
  }

  const scheme = POSSIBLE_SCHEMES[currentSchemeIndex];
  log(`🔍 Test du scheme #${currentSchemeIndex + 1}:`, scheme);

  let appOpened = false;

  const checkAppOpened = () => {
    if (!appOpened) {
      appOpened = true;
      log(`✅ SUCCESS! Le scheme fonctionne:`, scheme);
      log(`⭐ UTILISEZ CE SCHEME DANS VOTRE CODE:`, scheme);
    }
  };

  document.addEventListener("visibilitychange", checkAppOpened, { once: true });
  document.addEventListener("pagehide", checkAppOpened, { once: true });
  window.addEventListener("blur", checkAppOpened, { once: true });

  try {
    window.location.href = scheme;
    log(`✓ Tentative d'ouverture...`);
  } catch (e) {
    log(`❌ Erreur:`, e.message);
  }

  setTimeout(() => {
    document.removeEventListener("visibilitychange", checkAppOpened);
    document.removeEventListener("pagehide", checkAppOpened);
    window.removeEventListener("blur", checkAppOpened);

    if (!appOpened) {
      log(`⏭️ Scheme ne fonctionne pas, essai suivant...`);
      currentSchemeIndex++;
      setTimeout(() => testNextScheme(), 1000);
    }
  }, 2000);
}

function openMobileApp() {
  log("🎯 Fonction openMobileApp appelée");
  log("📱 Plateforme:", isIOS() ? "iOS" : isAndroid() ? "Android" : "Inconnue");
  log("🧪 Mode test:", testMode ? "Activé" : "Désactivé");

  if (isIOS()) {
    if (testMode) {
      log("🚀 Mode test activé - Test de tous les schemes possibles");
      currentSchemeIndex = 0;
      testNextScheme();
    } else {
      // Mode normal - utilisez le scheme qui fonctionne une fois trouvé
      const workingScheme = POSSIBLE_SCHEMES[0];
      log(`📱 Tentative d'ouverture avec:`, workingScheme);

      let appOpened = false;

      const checkAppOpened = () => {
        appOpened = true;
        log("✅ App ouverte avec succès!");
      };

      document.addEventListener("visibilitychange", checkAppOpened, {
        once: true,
      });
      document.addEventListener("pagehide", checkAppOpened, { once: true });
      window.addEventListener("blur", checkAppOpened, { once: true });

      try {
        window.location.href = workingScheme;
      } catch (e) {
        log("❌ Erreur:", e.message);
      }

      setTimeout(() => {
        document.removeEventListener("visibilitychange", checkAppOpened);
        document.removeEventListener("pagehide", checkAppOpened);
        window.removeEventListener("blur", checkAppOpened);

        if (!appOpened) {
          log("⏭️ App non installée, redirection vers l'App Store...");
          window.location.href = IOS_STORE_URL;
        }
      }, 1500);
    }
  } else if (isAndroid()) {
    log("🤖 Android détecté");
    const intentUrl = `intent://open#Intent;scheme=localresto;package=com.appyourself.suite.local;end`;
    log("📱 Tentative avec Intent:", intentUrl);
    window.location.href = intentUrl;

    setTimeout(() => {
      if (!document.hidden) {
        log("⏭️ Redirection vers le Play Store...");
        window.location.href = ANDROID_STORE_URL;
      }
    }, 2000);
  } else {
    log("❌ Plateforme non supportée");
  }
}

// Activer le mode test
document.getElementById("test-mode-btn").addEventListener("click", () => {
  testMode = true;
  log("🧪 MODE TEST ACTIVÉ");
  log(
    "👉 Cliquez maintenant sur 'Ouvrir l'application' pour tester tous les schemes"
  );
  const btn = document.getElementById("test-mode-btn");
  btn.style.background = "#16a34a";
  btn.textContent = "✅ Mode test activé";
  btn.disabled = true;
});

// Ouvrir l'app
document
  .getElementById("open-app-btn")
  .addEventListener("click", openMobileApp);

// Log initial
log("✨ Page chargée avec succès");
log("📱 User Agent:", navigator.userAgent);
