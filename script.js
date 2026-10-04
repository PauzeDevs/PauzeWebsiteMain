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
const journeyTracks = Array.from(document.querySelectorAll(".journey-track"));
const sceneWash = document.querySelector(".scene-wash");

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      if (
        started &&
        sceneWash &&
        entry.target.matches("section.reveal") &&
        entry.target.id !== "hero"
      ) {
        sceneWash.classList.remove("playing");
        void sceneWash.offsetWidth;
        sceneWash.classList.add("playing");
      }
    }
  }
}, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

document.querySelectorAll(".reveal, .reveal-stagger").forEach((node) => {
  revealObserver.observe(node);
});

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
    if (hero) hero.classList.add("is-active");
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

  let pointerFrame = null;

  function animatePointer() {
    if (document.hidden) {
      pointerFrame = null;
      return;
    }

    currentX += (mouseX - currentX) * 0.11;
    currentY += (mouseY - currentY) * 0.11;

    if (ring) {
      ring.style.left = currentX + "px";
      ring.style.top = currentY + "px";
    }

    if (stage && window.innerWidth > 820) {
      const nx = (mouseX / window.innerWidth - 0.5) * 2;
      const ny = (mouseY / window.innerHeight - 0.5) * 2;
      const rotation = -5 + nx * 6;
      const tx = nx * 15;
      const ty = ny * 12;
      stage.style.transform =
        "rotate(" + rotation.toFixed(2) + "deg) translate3d(" +
        tx.toFixed(1) + "px," + ty.toFixed(1) + "px,0)";
    }

    pointerFrame = requestAnimationFrame(animatePointer);
  }

  pointerFrame = requestAnimationFrame(animatePointer);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && pointerFrame === null) {
      pointerFrame = requestAnimationFrame(animatePointer);
    }
  });

  document.querySelectorAll("a, .project, .question").forEach((node) => {
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
      "translateY(calc(-50% + " + y + "px)) rotate(" +
      rotate.toFixed(2) + "deg) scale(" + scale.toFixed(3) + ")";
    product.style.opacity = String(1 - heroProgress * 0.62);
  }

  const manifesto = document.querySelector(".manifesto");
  if (manifesto) {
    const rect = manifesto.getBoundingClientRect();
    const scene = Math.min(
      Math.max((window.innerHeight - rect.top) / (window.innerHeight * 0.9), 0),
      1
    );
    manifesto.style.setProperty("--scene-progress", scene.toFixed(3));
  }

  if (ticker) {
    const rect = ticker.getBoundingClientRect();
    const drift = (window.innerHeight * 0.5 - rect.top) * 0.035;
    ticker.style.setProperty("--ticker-drift", drift.toFixed(2) + "px");
  }

  for (const track of journeyTracks) {
    const rect = track.getBoundingClientRect();
    const drift = (window.innerHeight * 0.5 - rect.top) * 0.018;
    track.style.setProperty("--journey-drift", drift.toFixed(2) + "px");
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


const story = document.getElementById("story");
const storyProduct = document.querySelector(".story-product");
const storyCounter = document.getElementById("storyCounter");
const storyCounterLine = document.querySelector(".story-counter i");
const storySteps = Array.from(document.querySelectorAll(".story-step"));

if (storySteps.length) {
  const stepObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const active = storySteps.indexOf(entry.target);
      if (active < 0) continue;

      storySteps.forEach((step, index) => {
        step.classList.toggle("is-active", index === active);
      });

      if (storyCounter) {
        storyCounter.textContent = storySteps[active].dataset.step || String(active + 1).padStart(2, "0");
      }

      if (storyCounterLine) {
        storyCounterLine.style.setProperty("--story-progress", ((active + 1) / storySteps.length * 100) + "%");
      }

      if (storyProduct) {
        const rotations = [-8, 4, -14, 10];
        const scales = [1, .94, .88, .82];
        storyProduct.style.transform =
          "translate3d(0," + (active * -6) + "px,0) rotate(" +
          rotations[active] + "deg) scale(" + scales[active] + ")";
      }
    }
  }, { threshold: 0.62, rootMargin: "-8% 0px -8% 0px" });

  storySteps.forEach((step) => stepObserver.observe(step));
}

if (storyProduct) {
  storyProduct.addEventListener("pointermove", (event) => {
    if (window.innerWidth <= 820) return;
    const rect = storyProduct.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    storyProduct.style.transform =
      "translate3d(" + (nx * 18).toFixed(1) + "px," +
      (ny * 15).toFixed(1) + "px,0) rotate(" +
      (nx * 7).toFixed(1) + "deg)";
  });

  storyProduct.addEventListener("pointerleave", () => {
    storyProduct.style.transform = "";
  });
}


const musicScene = document.getElementById("music");
const playlistChoices = Array.from(document.querySelectorAll(".playlist-choice"));
const listenButton = document.getElementById("listenButton");
const musicTitle = document.getElementById("musicTitle");
const musicDescription = document.getElementById("musicDescription");
const musicMode = document.getElementById("musicMode");
const recordEyebrow = document.getElementById("recordEyebrow");
const selectorFill = document.getElementById("selectorFill");
const musicStatus = document.getElementById("musicStatus");
const signalBars = document.getElementById("signalBars");
const disc = document.querySelector(".interactive-disc");

const MUSIC_SIDES = [
  {
    eyebrow: "SIDE A / PUNJAB",
    mode: "NOW SPINNING",
    title: "PUNJAB<br /><em>DA PIND.</em>",
    description: "A late-night Punjabi side of the Pauze headspace.",
    url: LINKS.punjab,
    status: "SIDE A READY"
  },
  {
    eyebrow: "SIDE B / ENGLISH",
    mode: "NOW SPINNING",
    title: "ESSENTIALS<br /><em>ENGLISH.</em>",
    description: "A clean English soundtrack for focus, motion and after-hours.",
    url: LINKS.english,
    status: "SIDE B READY"
  }
];

function selectMusicSide(index, fromScroll = false) {
  const safe = Math.max(0, Math.min(index, MUSIC_SIDES.length - 1));
  const side = MUSIC_SIDES[safe];

  playlistChoices.forEach((button, i) => {
    const active = i === safe;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  if (musicTitle) musicTitle.innerHTML = side.title;
  if (musicDescription) musicDescription.textContent = side.description;
  if (musicMode) musicMode.textContent = side.mode;
  if (recordEyebrow) recordEyebrow.textContent = side.eyebrow;
  if (musicStatus) musicStatus.textContent = side.status;
  if (listenButton) {
    listenButton.href = side.url;
    listenButton.setAttribute("aria-label", "Open " + side.eyebrow + " on Amazon Music");
  }
  if (selectorFill) selectorFill.style.transform = "translateX(" + (safe * 100) + "%)";
  if (musicScene) musicScene.classList.toggle("side-b", safe === 1);

  if (disc) {
    disc.animate(
      [
        { transform: "scale(1) rotate(0deg)" },
        { transform: "scale(.96) rotate(-12deg)" },
        { transform: "scale(1) rotate(12deg)" }
      ],
      { duration: fromScroll ? 480 : 620, easing: "cubic-bezier(.16,1,.3,1)" }
    );
  }
}

playlistChoices.forEach((button) => {
  button.addEventListener("click", () => {
    selectMusicSide(Number(button.dataset.playlist) || 0);
  });
});

if (signalBars && !signalBars.children.length) {
  for (let i = 0; i < 48; i++) {
    const bar = document.createElement("i");
    bar.style.setProperty("--h", (25 + ((i * 17) % 70)) + "%");
    bar.style.animationDelay = (i * 35) + "ms";
    signalBars.appendChild(bar);
  }
}

let musicTick = false;
let activeMusicSide = 0;

function updateMusicScene() {
  if (!musicScene || window.innerWidth <= 820) return;

  const rect = musicScene.getBoundingClientRect();
  const travel = Math.max(musicScene.offsetHeight - window.innerHeight, 1);
  const progress = Math.max(0, Math.min(0.999, -rect.top / travel));
  const side = progress >= 0.5 ? 1 : 0;

  if (side !== activeMusicSide) {
    activeMusicSide = side;
    selectMusicSide(side, true);
  }

  if (disc) {
    const tilt = (progress - 0.5) * 10;
    disc.style.setProperty("--scroll-tilt", tilt.toFixed(2) + "deg");
  }
}

window.addEventListener("scroll", () => {
  if (musicTick) return;
  musicTick = true;
  requestAnimationFrame(() => {
    updateMusicScene();
    musicTick = false;
  });
}, { passive: true });

window.addEventListener("resize", updateMusicScene, { passive: true });

activeMusicSide = 0;
selectMusicSide(0);
updateMusicScene();


/* Lanyard live Discord presence */
const LANYARD_USER_ID = "1547264515182432398";
const LANYARD_REST = "https://api.lanyard.rest/v1/users/" + LANYARD_USER_ID;
const LANYARD_SOCKET = "wss://api.lanyard.rest/socket";

const presenceCard = document.getElementById("lanyardPresence");
const presenceAvatar = document.getElementById("presenceAvatar");
const presenceName = document.getElementById("presenceName");
const presenceState = document.getElementById("presenceState");
const presenceActivity = document.getElementById("presenceActivity");
const presenceDetail = document.getElementById("presenceDetail");
const presencePlatform = document.getElementById("presencePlatform");
const presenceUpdated = document.getElementById("presenceUpdated");

const presenceLabels = {
  online: "ONLINE",
  idle: "IDLE",
  dnd: "DO NOT DISTURB",
  offline: "OFFLINE"
};

function setPresenceState(status, copy) {
  const safe = presenceLabels[status] ? status : "offline";
  if (presenceState) {
    presenceState.className = "presence-state " + safe;
    const label = presenceState.querySelector("span");
    if (label) label.textContent = copy || presenceLabels[safe];
  }
}

function setPresenceText(activity = "PAUZE", detail = "Waiting for a live Discord signal.") {
  if (presenceActivity) presenceActivity.textContent = activity;
  if (presenceDetail) presenceDetail.textContent = detail;
}

function formatPlatform(data) {
  const platforms = [];
  if (data.active_on_discord_desktop) platforms.push("DESKTOP");
  if (data.active_on_discord_mobile) platforms.push("MOBILE");
  if (data.active_on_discord_web) platforms.push("WEB");
  return platforms.length ? platforms.join(" + ") : "LANYARD / REAL-TIME";
}

function findCustomStatus(activities) {
  return (activities || []).find((activity) => activity.type === 4 && activity.state);
}

function findMainActivity(activities) {
  return (activities || []).find((activity) => activity.type !== 4);
}

function renderPresence(data) {
  if (!data) return;

  const user = data.discord_user || {};
  const displayName = user.global_name || user.username || "PAUZE";
  if (presenceName) presenceName.textContent = displayName;

  if (presenceAvatar && user.id && user.avatar) {
    presenceAvatar.src = "https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png?size=128";
    presenceAvatar.classList.add("has-image");
  }

  const status = data.discord_status || "offline";
  setPresenceState(status);

  const spotify = data.listening_to_spotify && data.spotify;
  const mainActivity = findMainActivity(data.activities);
  const customStatus = findCustomStatus(data.activities);

  if (spotify) {
    setPresenceText(
      spotify.song || "SPOTIFY",
      [spotify.artist, spotify.album].filter(Boolean).join(" · ") || "Listening on Spotify"
    );
    if (presenceCard) presenceCard.dataset.mode = "spotify";
  } else if (mainActivity) {
    const details = [mainActivity.details, mainActivity.state].filter(Boolean).join(" · ");
    setPresenceText(mainActivity.name || "DISCORD ACTIVITY", details || "Active on Discord");
    if (presenceCard) presenceCard.dataset.mode = "activity";
  } else if (customStatus) {
    setPresenceText("CUSTOM STATUS", customStatus.state);
    if (presenceCard) presenceCard.dataset.mode = "custom";
  } else {
    setPresenceText(
      status === "offline" ? "PAUZE IS AWAY" : "PAUZE IS HERE",
      status === "offline" ? "No active Discord presence right now." : "Present on Discord, nothing currently playing."
    );
    if (presenceCard) presenceCard.dataset.mode = "idle";
  }

  if (presencePlatform) presencePlatform.textContent = formatPlatform(data);

  if (presenceUpdated) {
    const time = new Date();
    presenceUpdated.textContent = "SIGNAL / " + time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
  }
}

function setPresenceConnection(copy) {
  if (presenceUpdated) presenceUpdated.textContent = copy;
}

async function bootstrapPresence() {
  try {
    const response = await fetch(LANYARD_REST, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Lanyard REST " + response.status);

    const payload = await response.json();
    if (payload.success && payload.data) {
      renderPresence(payload.data);
    } else {
      throw new Error("User is not being monitored");
    }
  } catch (error) {
    setPresenceState("offline", "NOT CONNECTED");
    setPresenceText("LANYARD SIGNAL", "Join Lanyard's Discord server to expose this account to the public presence API.");
    setPresenceConnection("WAITING / LANYARD");
  }
}

function connectLanyard() {
  if (!("WebSocket" in window)) return;

  let socket;
  let heartbeatTimer;
  let reconnectTimer;
  let reconnectDelay = 1500;

  const cleanup = () => {
    window.clearInterval(heartbeatTimer);
    window.clearTimeout(reconnectTimer);
    heartbeatTimer = null;
    reconnectTimer = null;
  };

  const scheduleReconnect = () => {
    if (reconnectTimer || document.hidden) return;
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 1.6, 30000);
  };

  function connect() {
    cleanup();
    setPresenceConnection("CONNECTING / LANYARD");

    try {
      socket = new WebSocket(LANYARD_SOCKET);
    } catch {
      scheduleReconnect();
      return;
    }

    socket.addEventListener("open", () => {
      reconnectDelay = 1500;
    });

    socket.addEventListener("message", (event) => {
      let packet;
      try { packet = JSON.parse(event.data); } catch { return; }

      if (packet.op === 1) {
        const interval = Number(packet.d?.heartbeat_interval) || 30000;
        window.clearInterval(heartbeatTimer);
        heartbeatTimer = window.setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ op: 3 }));
          }
        }, interval);

        socket.send(JSON.stringify({
          op: 2,
          d: { subscribe_to_ids: [LANYARD_USER_ID] }
        }));
        return;
      }

      if (packet.op === 0 && packet.t === "INIT_STATE") {
        const data = packet.d?.[LANYARD_USER_ID];
        if (data) renderPresence(data);
        else {
          setPresenceState("offline", "NOT CONNECTED");
          setPresenceText("LANYARD SIGNAL", "This Discord account is not currently monitored by Lanyard.");
        }
        setPresenceConnection("LIVE / LANYARD");
        return;
      }

      if (packet.op === 0 && packet.t === "PRESENCE_UPDATE" && packet.d?.user_id === LANYARD_USER_ID) {
        renderPresence(packet.d);
        setPresenceConnection("LIVE / LANYARD");
      }
    });

    socket.addEventListener("close", () => {
      cleanup();
      setPresenceConnection("RECONNECTING / LANYARD");
      scheduleReconnect();
    });

    socket.addEventListener("error", () => {
      if (socket.readyState === WebSocket.OPEN) socket.close();
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cleanup();
      if (socket && socket.readyState === WebSocket.OPEN) socket.close();
    } else {
      reconnectDelay = 1500;
      connect();
      bootstrapPresence();
    }
  });

  connect();
}

bootstrapPresence();
connectLanyard();
