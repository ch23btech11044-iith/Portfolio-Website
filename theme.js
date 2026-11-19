"use strict";

(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let selectedTheme = null;
  let toggle;

  try {
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    if (storedTheme === "light" || storedTheme === "dark") selectedTheme = storedTheme;
  } catch {
    // System preferences still work when browser storage is unavailable.
  }

  function applyTheme(theme) {
    const dark = theme === "dark";
    root.dataset.theme = theme;
    themeColor.setAttribute("content", dark ? "#0d111c" : "#f7f8fc");

    if (toggle) {
      const action = dark ? "Switch to light mode" : "Switch to dark mode";
      toggle.setAttribute("aria-label", action);
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.title = action;
    }
  }

  // Apply the preference before the stylesheet renders to avoid a light-theme flash.
  applyTheme(selectedTheme || (systemTheme.matches ? "dark" : "light"));

  document.addEventListener("DOMContentLoaded", () => {
    toggle = document.querySelector(".theme-toggle");
    applyTheme(root.dataset.theme);
    toggle.hidden = false;

    toggle.addEventListener("click", () => {
      selectedTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(selectedTheme);
      try {
        window.localStorage.setItem("portfolio-theme", selectedTheme);
      } catch {
        // Keep the selected theme for this visit when saving is unavailable.
      }
    });
  });

  systemTheme.addEventListener("change", (event) => {
    if (!selectedTheme) applyTheme(event.matches ? "dark" : "light");
  });
})();
