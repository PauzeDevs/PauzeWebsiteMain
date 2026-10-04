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
