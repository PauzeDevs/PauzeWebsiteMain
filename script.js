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

const body = document.body;
const loader = document.querySelector(".site-loader");
const startButton = document.getElementById("startButton");
const hero = document.getElementById("hero");
const product = document.querySelector(".hero-product");
const stage = document.querySelector(".product-stage");
const progress = document.querySelector(".scroll-progress i");
const manifesto = document.querySelector(".manifesto");
const ticker = document.querySelector(".ticker");

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  }
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

let started = false;

function startExperience() {
  if (started) return;
  started = true;

  body.classList.remove("locked");
  body.classList.add("scene-started");

  if (loader) {
    loader.classList.add("entering");
    window.setTimeout(() => loader.remove(), 1250);
  }

  window.setTimeout(() => {
    hero?.classList.add("is-active");
    updateScrollScene();
  }, 250);
}

body.classList.add("locked");

startButton?.addEventListener("click", startExperience);
startButton?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    startExperience();
  }
});

const finePointer = window.matchMedia("(pointer:fine)").matches;

if (finePointer) {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (dot) {
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    }

    if (hero) {
      hero.style.setProperty("--mx", (mouseX / window.innerWidth) * 100 + "%");
      hero.style.setProperty("--my", (mouseY / window.innerHeight) * 100 + "%");
    }
  }, { passive: true });

  function animatePointer() {
    currentX += (mouseX - currentX) * 0.11;
    currentY += (mouseY - currentY) * 0.11;

    if (ring) {
      ring.style.left = currentX + "px";
      ring.style.top = currentY + "px";
    }

    if (stage && window.innerWidth > 820) {
      const nx = (mouseX / window.innerWidth - 0.5) * 2;
      const ny = (mouseY / window.innerHeight - 0.5) * 2;
      const rotation = (-5 + nx * 6).toFixed(2);
      const tx = (nx * 15).toFixed(1);
      const ty = (ny * 12).toFixed(1);
      stage.style.transform = "rotate(" + rotation + "deg) translate3d(" + tx + "px, " + ty + "px, 0)";
    }

    requestAnimationFrame(animatePointer);
  }

  animatePointer();

  document.querySelectorAll("a, .project, .playlist").forEach((node) => {
    node.addEventListener("mouseenter", () => {
      if (ring) {
        ring.style.width = "58px";
        ring.style.height = "58px";
      }
    });

    node.addEventListener("mouseleave", () => {
      if (ring) {
        ring.style.width = "34px";
        ring.style.height = "34px";
      }
    });
  });
}

document.querySelectorAll(".magnetic").forEach((node) => {
  node.addEventListener("pointermove", (event) => {
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    node.style.transform = "translate(" + x + "px," + y + "px)";
  });

  node.addEventListener("pointerleave", () => {
    node.style.transform = "";
  });
});

let ticking = false;

function updateScrollScene() {
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollRatio = pageHeight > 0 ? window.scrollY / pageHeight : 0;

  if (progress) {
    progress.style.height = Math.min(Math.max(scrollRatio, 0), 1) * 100 + "%";
  }

  if (!started || !hero) return;

  const heroHeight = Math.max(hero.offsetHeight, 1);
  const heroProgress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);

  if (product) {
    const y = heroProgress * 150;
    const scale = 1 - heroProgress * 0.28;
    const rotate = heroProgress * 8;

    product.style.transform =
      "translateY(calc(-50% + " + y + "px)) rotate(" + rotate + "deg) scale(" + scale + ")";
    product.style.opacity = String(1 - heroProgress * 0.62);
  }

  if (manifesto) {
    const rect = manifesto.getBoundingClientRect();
    const scene = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight * 0.9), 0), 1);
    manifesto.style.setProperty("--scene-progress", scene.toFixed(3));
  }

  if (ticker) {
    const tickerRect = ticker.getBoundingClientRect();
    const drift = (window.innerHeight * 0.5 - tickerRect.top) * 0.035;
    ticker.style.setProperty("--ticker-drift", drift.toFixed(2) + "px");
  }
}

window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;

  requestAnimationFrame(() => {
    updateScrollScene();
    ticking = false;
  });
}, { passive: true });

window.addEventListener("resize", updateScrollScene, { passive: true });

updateScrollScene();
