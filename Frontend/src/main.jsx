import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Temporarily disabled context providers for debugging
// import { LanguageProvider } from "./context/LanguageContext.jsx";
// import { ThemeProvider } from "./context/ThemeContext.jsx";

// Register Service Worker for PWA - disabled for debugging
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/sw.js")
//       .then((registration) => {
//         console.log("SW registered:", registration);
//       })
//       .catch((error) => {
//         console.log("SW registration failed:", error);
//       });
//   });
// }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
