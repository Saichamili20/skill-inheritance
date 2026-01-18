// language.js

const translations = {
  en: {
    title: "🔐 Login",
    email: "📧 Email",
    password: "🔑 Password",
    loginBtn: "Continue",
    createAccount: "New user? Create Account"
  },
  hi: {
    title: "🔐 लॉगिन",
    email: "📧 ईमेल",
    password: "🔑 पासवर्ड",
    loginBtn: "जारी रखें",
    createAccount: "नया उपयोगकर्ता? खाता बनाएँ"
  },
  te: {
    title: "🔐 లాగిన్",
    email: "📧 ఇమెయిల్",
    password: "🔑 పాస్‌వర్డ్",
    loginBtn: "కొనసాగించండి",
    createAccount: "కొత్తవారు? ఖాతా సృష్టించండి"
  }
};

// Get the dropdown
const languageSwitcher = document.getElementById("languageSwitcher");

// Apply selected language
function applyLanguage(lang) {
  document.querySelector('[data-translate="title"]').innerText = translations[lang].title;
  document.querySelector('[data-translate="email"]').placeholder = translations[lang].email;
  document.querySelector('[data-translate="password"]').placeholder = translations[lang].password;
  document.querySelector('[data-translate="loginBtn"]').innerText = translations[lang].loginBtn;
  document.querySelector('[data-translate="createAccount"]').innerText = translations[lang].createAccount;
}

// Load saved language or default
window.addEventListener("load", () => {
  const lang = localStorage.getItem("lang") || "en";
  languageSwitcher.value = lang;
  applyLanguage(lang);
});

// Handle dropdown change
languageSwitcher.addEventListener("change", () => {
  const lang = languageSwitcher.value;
  localStorage.setItem("lang", lang);
  applyLanguage(lang);
});
