"use strict";

document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");
const navigationLinks = [...navigation.querySelectorAll("a")];
const mobileLayout = window.matchMedia("(max-width: 650px)");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const opening = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(opening));
  navigation.classList.toggle("is-open", opening);
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
    // Move focus from the collapsed mobile menu to the selected section.
    if (mobileLayout.matches) {
      const section = document.querySelector(link.hash);
      const heading = section.querySelector("h2");
      heading.setAttribute("tabindex", "-1");
      window.requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".header-inner")) closeMenu();
});

mobileLayout.addEventListener("change", closeMenu);

if ("IntersectionObserver" in window) {
  const visibleSections = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.add(entry.target.id);
        else visibleSections.delete(entry.target.id);
      });
      const activeLink = navigationLinks.find((link) => visibleSections.has(link.hash.slice(1)));
      navigationLinks.forEach((link) => {
        if (link === activeLink) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-20% 0px -45% 0px", threshold: 0 },
  );

  navigationLinks.forEach((link) => observer.observe(document.querySelector(link.hash)));
}

const copyButton = document.querySelector(".copy-email");
const copyStatus = document.querySelector(".copy-status");
let statusTimeout;

if (navigator.clipboard?.writeText && window.isSecureContext) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    window.clearTimeout(statusTimeout);
    try {
      await navigator.clipboard.writeText("ch23btech11044@iith.ac.in");
      copyStatus.textContent = "Email address copied.";
    } catch {
      copyStatus.textContent = "Select the email address to copy it, or click it to send an email.";
    }
    statusTimeout = window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 5000);
  });
}
