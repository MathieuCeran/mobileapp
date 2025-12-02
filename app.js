const IOS_STORE_URL = "https://apps.apple.com/fr/app/localresto/id6744366088";
const ANDROID_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.appyourself.suite.local&pli=1";

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

// Solution simple : rediriger vers l'App Store
// Sur iOS, le système détecte automatiquement si l'app est installée
function openApp() {
  log("🎯 Ouverture de l'application");

  if (isIOS()) {
    log("📱 Redirection vers l'App Store");
    log("💡 iOS ouvrira automatiquement l'app si elle est installée");
    window.location.href = IOS_STORE_URL;
  } else if (isAndroid()) {
    log("🤖 Redirection vers le Play Store");
    window.location.href = ANDROID_STORE_URL;
  } else {
    log("❌ Plateforme non supportée");
  }
}

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
  log("✨ Page chargée avec succès");
  log("📱 Plateforme:", isIOS() ? "iOS" : isAndroid() ? "Android" : "Autre");
  log(
    "💡 Utilisez le Smart Banner en haut (Safari iOS) pour ouvrir l'app directement"
  );

  // Bouton principal
  const openBtn = document.getElementById("open-app-btn");
  if (openBtn) {
    openBtn.addEventListener("click", openApp);
  }

  // Masquer les boutons de test
  const testBtn = document.getElementById("test-mode-btn");
  if (testBtn) testBtn.style.display = "none";

  const customBtn = document.getElementById("custom-scheme-btn");
  if (customBtn) customBtn.style.display = "none";

  const customInput = document.getElementById("custom-scheme-input");
  if (customInput) customInput.style.display = "none";

  const separator = document.querySelector("hr");
  if (separator) separator.style.display = "none";

  const customText = document.querySelector("p");
  if (customText) customText.style.display = "none";
});
