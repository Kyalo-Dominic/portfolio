
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarClose = document.getElementById("sidebar-close");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const yearElement = document.getElementById("year");

  // Automatically update the copyright year.
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Stop safely if the mobile navigation elements are missing.
  if (!menuToggle || !sidebar || !sidebarClose || !sidebarOverlay) {
    return;
  }

  let previousFocus = null;

  function openSidebar() {
    previousFocus = document.activeElement;

    sidebar.classList.add("open");
    sidebarOverlay.classList.add("open");
    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    sidebar.setAttribute("aria-hidden", "false");

    sidebarClose.focus();
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    sidebar.setAttribute("aria-hidden", "true");

    if (previousFocus) {
      previousFocus.focus();
    }
  }

  menuToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  sidebarClose.addEventListener("click", closeSidebar);
  sidebarOverlay.addEventListener("click", closeSidebar);

  // Close the sidebar after a navigation link is selected.
  sidebar.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  // Allow users to close the sidebar with Escape.
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      sidebar.classList.contains("open")
    ) {
      closeSidebar();
    }
  });

  // Highlight desktop navigation links for the visible section.
  const sections = document.querySelectorAll("main section[id]");
  const desktopLinks = document.querySelectorAll(".desktop-nav a");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          desktopLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // If the screen grows from mobile to desktop, reset the sidebar.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 700 && sidebar.classList.contains("open")) {
      closeSidebar();
    }
  });
});
