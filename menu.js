(() => {
  const toggle = document.getElementById("pauzeMenuToggle");
  const menu = document.getElementById("pauzeMenu");
  if (!toggle || !menu) return;

  const links = [...menu.querySelectorAll(".pauze-menu-link")];
  const clock = document.getElementById("pauzeClock");
  const system = document.getElementById("pauzeSystem");
  const lanyard = document.getElementById("pauzeLanyard");
  const telemetry = document.getElementById("pauzeTelemetry");
  const presenceState = document.getElementById("presenceState");

  let previousFocus = null;
  let clockTimer = null;
  let telemetryTimer = null;

  function updateClock() {
    if (!clock) return;
    const value = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());
    clock.textContent = "IST " + value;
  }

  function syncSystem() {
    const status = presenceState?.querySelector("span")?.textContent || "CONNECTING";
    const live = /ONLINE|IDLE|DO NOT DISTURB/.test(status);
    if (lanyard) {
      lanyard.textContent = "LANYARD / " + (live ? "LIVE" : status === "OFFLINE" ? "OFFLINE" : "SYNCING");
    }
    telemetry?.classList.toggle("live", live);
    if (system) system.textContent = document.hidden ? "SYSTEM / PAUSED" : "SYSTEM / ONLINE";
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open Pauze menu");
    menu.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("pauze-menu-open");
    document.body.classList.remove("pauze-menu-open");
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  function openMenu() {
    previousFocus = document.activeElement;
    menu.classList.add("is-open");
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close Pauze menu");
    menu.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("pauze-menu-open");
    document.body.classList.add("pauze-menu-open");
    window.setTimeout(() => links[0]?.focus(), 120);
  }

  function toggleMenu() {
    menu.classList.contains("is-open") ? closeMenu() : openMenu();
  }

  toggle.addEventListener("click", toggleMenu);
  links.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      toggleMenu();
    }
  });
  menu.addEventListener("click", (event) => {
    if (event.target === menu) closeMenu();
  });

  updateClock();
  syncSystem();
  clockTimer = window.setInterval(updateClock, 1000);
  telemetryTimer = window.setInterval(syncSystem, 1000);

  document.addEventListener("visibilitychange", syncSystem);

  window.addEventListener("beforeunload", () => {
    window.clearInterval(clockTimer);
    window.clearInterval(telemetryTimer);
  }, { once: true });
})();
