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

const loader = document.querySelector(".site-loader");
const hero = document.getElementById("hero");
const product = document.querySelector(".hero-product");
const stage = document.querySelector(".product-stage");
const progress = document.querySelector(".scroll-progress i");

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  }
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

window.addEventListener("load", () => {
  window.setTimeout(() => {
    if (loader) loader.classList.add("is-done");
    if (hero) hero.classList.add("is-active");
  }, 1450);
}, { once: true });

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

  if (progress) progress.style.height = Math.min(Math.max(scrollRatio, 0), 1) * 100 + "%";

  if (!hero || !product || window.innerWidth <= 820) return;

  const heroProgress = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);
  const y = heroProgress * 115;
  const scale = 1 - heroProgress * 0.2;

  product.style.transform =
    "translateY(calc(-50% + " + y + "px)) rotate(" + heroProgress * 4 + "deg) scale(" + scale + ")";

  product.style.opacity = String(1 - heroProgress * 0.55);
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
