const caseSection = document.querySelector('.case-studies');
const caseArts = [...document.querySelectorAll('.case-art')];
const caseCopies = [...document.querySelectorAll('.case-copy')];
const caseNumber = document.getElementById('caseNumber');
const caseProgress = document.querySelector('.case-stage-meta i');

function setCase(index) {
  const safe = Math.max(0, Math.min(index, caseArts.length - 1));
  caseArts.forEach((el, i) => el.classList.toggle('is-active', i === safe));
  caseCopies.forEach((el, i) => el.classList.toggle('is-active', i === safe));
  if (caseNumber) caseNumber.textContent = String(safe + 1).padStart(2, '0');
  if (caseProgress) caseProgress.style.setProperty('--case-progress', ((safe + 1) / caseArts.length * 100) + '%');
}

function updateCases() {
  if (!caseSection || !caseArts.length || window.innerWidth <= 820) return;
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

caseArts.forEach((art, index) => {
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
