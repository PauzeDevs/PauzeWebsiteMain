const LINKS = {
  punjab: "https://music.amazon.in/user-playlists/7d8b2c82ff544ae58455e2cdd411c1d3i8n0?ref=dm_sh_4BQ1GOhm7sfJiIO6uJSzcD2rw",
  english: "https://music.amazon.in/user-playlists/600349506def4aabb752b524c5476634i8n0?ref=dm_sh_3i39aHwXg7mWjgmyfVc0pAQpF",
  github: "https://github.com/PauzeDevs",
  instagram: "https://www.instagram.com/highonthehighwayy?stkn=MXR6ZHgzejM4dWs0ZQ=="
};

for (const [id, url] of Object.entries({
  punjabLink: LINKS.punjab,
  englishLink: LINKS.english,
  githubLink: LINKS.github,
  instagramLink: LINKS.instagram
})) {
  const node = document.getElementById(id);
  if (node) node.href = url;
}

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  }
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

const finePointer = window.matchMedia("(pointer:fine)").matches;
if (finePointer) {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  window.addEventListener("pointermove", (event) => {
    dot.style.left = event.clientX + "px";
    dot.style.top = event.clientY + "px";
    ring.animate({ left: event.clientX + "px", top: event.clientY + "px" }, { duration: 180, fill: "forwards" });
  }, { passive: true });
  document.querySelectorAll("a, .project, .playlist").forEach((node) => {
    node.addEventListener("mouseenter", () => { ring.style.width = "54px"; ring.style.height = "54px"; });
    node.addEventListener("mouseleave", () => { ring.style.width = "34px"; ring.style.height = "34px"; });
  });
}

document.querySelectorAll(".magnetic").forEach((node) => {
  node.addEventListener("pointermove", (event) => {
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    node.style.transform = `translate(${x}px,${y}px)`;
  });
  node.addEventListener("pointerleave", () => { node.style.transform = ""; });
});

const hero = document.getElementById("hero");
const product = document.querySelector(".hero-product");
let ticking = false;

function updateHero() {
  if (!hero || !product || window.innerWidth <= 820) return;
  const progress = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);
  const rotate = -5 + progress * 30;
  const scale = 1 - progress * 0.18;
  product.style.transform = `translateY(calc(-50% + ${progress * 95}px)) rotate(${progress * 3}deg) scale(${scale})`;
  product.style.opacity = String(1 - progress * 0.45);
}

window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { updateHero(); ticking = false; });
}, { passive: true });

updateHero();
