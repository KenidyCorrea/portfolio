// Runs before first paint: restores theme and <html lang> from localStorage.
// Keys must match client/lib/storage.ts (STORAGE_KEYS).
(function () {
  var root = document.documentElement;
  var theme = null;
  var locale = null;
  try {
    theme = window.localStorage.getItem("kc:theme");
    locale = window.localStorage.getItem("kc:locale");
  } catch (e) {
    // Storage blocked (private mode, disabled cookies): fall back to defaults.
  }
  root.classList.toggle("dark", theme !== "light");
  if (!locale) {
    var lang = (navigator.language || "en").toLowerCase();
    locale = lang.indexOf("pt") === 0 ? "pt" : "en";
  }
  root.lang = locale === "pt" ? "pt-BR" : "en";
})();
