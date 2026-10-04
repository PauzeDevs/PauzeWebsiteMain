const links = {
  amazon: "https://music.amazon.com/",
  github: "https://github.com/PauzeDevs",
  instagram: "https://www.instagram.com/aviation_byaarav/"
};

for (const [id, url] of Object.entries({
  musicLink: links.amazon,
  amazonLink: links.amazon,
  githubLink: links.github,
  instagramLink: links.instagram
})) {
  const el = document.getElementById(id);
  if (el) el.href = url;
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

window.addEventListener("scroll", () => {
  const orb = document.querySelector(".hero-orbit");
  if (orb && window.innerWidth > 760) {
    orb.style.marginTop = `${window.scrollY * 0.08}px`;
  }
}, { passive: true });
