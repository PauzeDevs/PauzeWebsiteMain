const caseSection = document.querySelector('.case-studies');
const caseArts = [...document.querySelectorAll('.case-art')];
const caseCopies = [...document.querySelectorAll('.case-copy')];
const caseNumber = document.getElementById('caseNumber');
const caseProgress = document.querySelector('.case-stage-meta i');

let activeCase = -1;

function setCase(index) {
  const safe = Math.max(0, Math.min(index, caseArts.length - 1));
  if (safe === activeCase && caseArts.length) return;
  activeCase = safe;
  caseArts.forEach((el, i) => el.classList.toggle('is-active', i === safe));
  caseCopies.forEach((el, i) => el.classList.toggle('is-active', i === safe));
  if (caseNumber) caseNumber.textContent = String(safe + 1).padStart(2, '0');
  if (caseProgress) caseProgress.style.setProperty('--case-progress', ((safe + 1) / caseArts.length * 100) + '%');
}

setCase(-1);

function updateCases() {
  if (!caseSection || !caseArts.length) return;
  const rect = caseSection.getBoundingClientRect();
  const travel = Math.max(caseSection.offsetHeight - window.innerHeight, 1);
  const progress = Math.max(0, Math.min(0.999, -rect.top / travel));
  setCase(Math.floor(progress * caseArts.length));
}

let caseTick = false;
window.addEventListener('scroll', () => {
  if (caseTick) return;
  caseTick = true;
  requestAnimationFrame(() => { updateCases(); caseTick = false; });
}, { passive: true });
window.addEventListener('resize', updateCases, { passive: true });
updateCases();

caseArts.forEach((art) => {
  art.addEventListener('pointermove', (event) => {
    if (window.innerWidth <= 820) return;
    const rect = art.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    art.style.transform = 'translate3d(' + (x * 12).toFixed(1) + 'px,' + (y * 10).toFixed(1) + 'px,0) rotate(' + (6 + x * 8).toFixed(2) + 'deg) scale(1.02)';
  });
  art.addEventListener('pointerleave', () => {
    if (art.classList.contains('is-active')) art.style.transform = '';
  });
});


const caseModal = document.getElementById("caseModal");
const caseModalCard = caseModal?.querySelector(".case-modal-card");
const caseModalClose = caseModal?.querySelector("[data-case-close]");
const caseModalTitle = document.getElementById("caseModalTitle");
const caseModalKicker = document.getElementById("caseModalKicker");
const caseModalCopy = document.getElementById("caseModalCopy");
const caseModalIndex = document.getElementById("caseModalIndex");
const caseModalFocus = document.getElementById("caseModalFocus");
const caseModalMode = document.getElementById("caseModalMode");
const caseModalTags = document.getElementById("caseModalTags");

const CASE_DETAILS = [
  {
    title: "BUILD.",
    kicker: "WEB / INTERACTION",
    copy: "Interfaces, tools and digital products that feel as good as they work — with motion used to make every interaction intentional.",
    focus: "INTERACTION / SYSTEMS",
    mode: "BUILD / SHIP",
    tags: "UI / MOTION / CODE"
  },
  {
    title: "PRODUCE.",
    kicker: "AUDIO / VISUAL",
    copy: "Music, visual identity and worlds designed to carry a mood from the first frame to the last note.",
    focus: "AUDIO / IDENTITY",
    mode: "MAKE / MIX",
    tags: "SOUND / VISUAL / MOOD"
  },
  {
    title: "EXPLORE.",
    kicker: "EXPERIMENT / R&D",
    copy: "Odd ideas, prototypes and the next thing that should exist — tested quickly, refined hard and kept moving.",
    focus: "R&D / PROTOTYPES",
    mode: "TEST / REPEAT",
    tags: "LAB / PROTOTYPE / FUTURE"
  }
];

let lastFocusedCaseTrigger = null;

function openCase(index) {
  if (!caseModal) return;
  const safe = Math.max(0, Math.min(index, CASE_DETAILS.length - 1));
  const detail = CASE_DETAILS[safe];

  if (caseModalTitle) caseModalTitle.innerHTML = detail.title;
  if (caseModalKicker) caseModalKicker.textContent = detail.kicker;
  if (caseModalCopy) caseModalCopy.textContent = detail.copy;
  if (caseModalIndex) caseModalIndex.textContent = String(safe + 1).padStart(2, "0") + " / 03";
  if (caseModalFocus) caseModalFocus.textContent = detail.focus;
  if (caseModalMode) caseModalMode.textContent = detail.mode;
  if (caseModalTags) caseModalTags.textContent = detail.tags;

  caseModal.classList.add("is-open");
  caseModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.documentElement.classList.add("modal-lock");
  lastFocusedCaseTrigger = document.activeElement;
  window.setTimeout(() => caseModalClose?.focus(), 50);
}

function closeCase() {
  if (!caseModal || !caseModal.classList.contains("is-open")) return;
  caseModal.classList.remove("is-open");
  caseModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  document.documentElement.classList.remove("modal-lock");
  if (lastFocusedCaseTrigger instanceof HTMLElement) lastFocusedCaseTrigger.focus();
}

document.querySelectorAll(".case-trigger").forEach((trigger) => {
  const open = () => openCase(Number(trigger.dataset.caseId) || 0);
  trigger.addEventListener("click", open);
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
});

caseModal?.querySelectorAll("[data-case-close]").forEach((node) => {
  node.addEventListener("click", closeCase);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCase();
});

caseModal?.addEventListener("click", (event) => {
  if (event.target === caseModalCard) event.stopPropagation();
});


/* Pauze live Discord presence — REST-first, WebSocket-independent fallback */
(() => {
  const USER_ID = "1547264515182432398";
  const API = "https://api.lanyard.rest/v1/users/" + USER_ID;
  const card = document.getElementById("lanyardPresence");
  const avatar = document.getElementById("presenceAvatar");
  const name = document.getElementById("presenceName");
  const state = document.getElementById("presenceState");
  const activity = document.getElementById("presenceActivity");
  const detail = document.getElementById("presenceDetail");
  const platform = document.getElementById("presencePlatform");
  const updated = document.getElementById("presenceUpdated");

  if (!card || !state || !activity || !detail) return;

  const labels = {
    online: "ONLINE",
    idle: "IDLE",
    dnd: "DO NOT DISTURB",
    offline: "OFFLINE"
  };

  function setState(status) {
    const safe = labels[status] ? status : "offline";
    state.className = "presence-state " + safe;
    const label = state.querySelector("span");
    if (label) label.textContent = labels[safe];
  }

  function platformText(data) {
    const list = [];
    if (data.active_on_discord_desktop) list.push("DESKTOP");
    if (data.active_on_discord_mobile) list.push("MOBILE");
    if (data.active_on_discord_web) list.push("WEB");
    return list.length ? list.join(" + ") : "LANYARD / REAL-TIME";
  }

  function mainActivity(activities) {
    return (activities || []).find((item) => item.type !== 4);
  }

  function customStatus(activities) {
    return (activities || []).find((item) => item.type === 4 && item.state);
  }

  function render(data, source) {
    if (!data) return;

    const user = data.discord_user || {};
    const display = user.global_name || user.username || "PAUZE";
    if (name) name.textContent = display;

    if (avatar && user.id && user.avatar) {
      avatar.src = "https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png?size=128";
      avatar.classList.add("has-image");
    }

    const status = data.discord_status || "offline";
    setState(status);

    const spotify = data.listening_to_spotify && data.spotify;
    const app = mainActivity(data.activities);
    const custom = customStatus(data.activities);

    if (spotify) {
      activity.textContent = spotify.song || "SPOTIFY";
      detail.textContent = [spotify.artist, spotify.album].filter(Boolean).join(" · ") || "Listening on Spotify";
      card.dataset.mode = "spotify";
    } else if (app) {
      activity.textContent = app.name || "DISCORD ACTIVITY";
      detail.textContent = [app.details, app.state].filter(Boolean).join(" · ") || "Active on Discord";
      card.dataset.mode = "activity";
    } else if (custom) {
      activity.textContent = "CUSTOM STATUS";
      detail.textContent = custom.state;
      card.dataset.mode = "custom";
    } else if (status === "offline") {
      activity.textContent = "PAUZE IS AWAY";
      detail.textContent = "No active Discord presence right now.";
      card.dataset.mode = "offline";
    } else {
      activity.textContent = "PAUZE IS HERE";
      detail.textContent = "Present on Discord, nothing currently playing.";
      card.dataset.mode = "idle";
    }

    if (platform) platform.textContent = platformText(data);
    if (updated) {
      const now = new Date();
      updated.textContent = (source || "REST") + " / " + now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
    }
  }

  function showConnection(message) {
    if (updated) updated.textContent = message;
  }

  let busy = false;

  async function pull() {
    if (busy || document.hidden) return;
    busy = true;

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      const response = await fetch(API + "?t=" + Date.now(), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal
      });
      window.clearTimeout(timeout);

      if (!response.ok) throw new Error("HTTP " + response.status);
      const payload = await response.json();
      if (!payload.success || !payload.data) throw new Error("No presence data");

      render(payload.data, "LIVE / REST");
    } catch (error) {
      showConnection("RETRYING / LANYARD");
      card.dataset.error = error.message || "unknown";
    } finally {
      busy = false;
    }
  }

  pull();
  const timer = window.setInterval(pull, 10000);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) pull();
  });

  window.addEventListener("beforeunload", () => window.clearInterval(timer), { once: true });
})();
