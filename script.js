const iconMap = [
  {
    matcher: /\bwebsite\b|\bdevpost\b|\bitch.io\b|\bproject\b/,
    iconId: "icon-live-link",
  },
  { matcher: /\bmockup\b|\bdesign\b/, iconId: "icon-mockup" },
  { matcher: /\brepository\b|\bcode\b/, iconId: "icon-repository" },
  {
    matcher: /\bcase\s*study\b|\bwriting\b|\bread\s*post\b|\bsee\s*more\b/,
    iconId: "icon-case-study",
  },
];

const embeddedSprite = `
  <symbol id="icon-live-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"></path>
  </symbol>
  <symbol id="icon-mockup" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
  </symbol>
  <symbol id="icon-repository" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="m16 18 6-6-6-6"></path>
    <path d="m8 6-6 6 6 6"></path>
  </symbol>
  <symbol id="icon-case-study" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
    <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
    <path d="M10 9H8"></path>
    <path d="M16 13H8"></path>
    <path d="M16 17H8"></path>
  </symbol>
`;

function ensureIconSprite() {
  if (document.getElementById("icon-sprite")) {
    return;
  }

  const sprite = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  sprite.id = "icon-sprite";
  sprite.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  sprite.setAttribute("aria-hidden", "true");
  sprite.setAttribute("focusable", "false");
  sprite.style.position = "absolute";
  sprite.style.width = "0";
  sprite.style.height = "0";
  sprite.style.overflow = "hidden";
  sprite.innerHTML = embeddedSprite;

  document.body.prepend(sprite);
}

function attachIcons() {
  for (const link of document.querySelectorAll(".project-links a")) {
    const label = link.textContent.trim().toLowerCase();
    const match = iconMap.find(({ matcher }) => matcher.test(label));

    if (!match || link.querySelector(".link-icon")) {
      continue;
    }

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("class", "link-icon");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("fill", "none");
    icon.setAttribute("stroke", "currentColor");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#${match.iconId}`);
    use.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      `#${match.iconId}`,
    );

    icon.appendChild(use);
    link.appendChild(icon);
  }
}

// Handles body class, icon swap, and persistent label updates for both theme toggle buttons.
function setupThemeToggle() {
  const toggles = document.querySelectorAll(".theme-toggle");
  if (!toggles.length) {
    return;
  }

  const storageKey = "portfolio-theme";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem(storageKey);
  const initialDark = savedTheme ? savedTheme === "dark" : prefersDark;

  document.body.classList.toggle("dark", initialDark);
  updateThemeToggleLabels(initialDark, toggles);

  for (const toggle of toggles) {
    toggle.addEventListener("click", () => {
      const nowDark = !document.body.classList.contains("dark");
      document.body.classList.toggle("dark", nowDark);
      localStorage.setItem(storageKey, nowDark ? "dark" : "light");
      updateThemeToggleLabels(nowDark, toggles);
    });
  }
}

function updateThemeToggleLabels(isDark, toggles) {
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";
  for (const toggle of toggles) {
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("title", label);
  }
}

// Mobile menu opens a simple vertical nav and closes on link click or viewport change.
function setupMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!menuToggle || !mobileMenu) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close mobile menu" : "Open mobile menu",
    );
    menuToggle.setAttribute("title", isOpen ? "Close menu" : "Open menu");
  });

  for (const link of mobileMenu.querySelectorAll("a")) {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open mobile menu");
      menuToggle.setAttribute("title", "Open menu");
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 600 && mobileMenu.classList.contains("is-open")) {
      mobileMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open mobile menu");
      menuToggle.setAttribute("title", "Open menu");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  ensureIconSprite();
  attachIcons();
  setupThemeToggle();
  setupMobileMenu();
});
