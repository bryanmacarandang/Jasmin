/* =========================================================
   FUTURE RN – Congratulations site
   ---------------------------------------------------------
   ADD YOUR PERMANENT PHOTOS HERE:
   1. Copy pictures (.jpg .png .webp) into the "images" folder.
   2. List them below, e.g.
        { src: "images/me-1.jpg", caption: "OUR MEMORIES 💗" },
   If this list is empty, cute placeholder frames are shown.
   Optional: set MUSIC_FILE = "music/song.mp3" to use your own song
   instead of the built-in chiptune tune.
   ========================================================= */
const PHOTOS = [
   { src: "jasmin.png", caption: "" },
   { src: "negneg.png", caption: "" },
   { src: "friends.png", caption: "" },
   { src: "nursing.png", caption: "" },
   { src: "family.png", caption: "" },
];
const MUSIC_FILE = "";
const CAPTIONS = ["OUR MEMORIES 💗", "FUTURE RN 🩺", "SO PROUD OF YOU!", "DREAM BIG ✨", "YOU DID IT! 🎉"];

/* ---------- pixel sprites ---------- */
const SPR = {
  heart: ["0110110", "1111111", "1111111", "0111110", "0011100", "0001000"],
  star: ["0001000", "0001000", "0011100", "1111111", "0011100", "0001000", "0001000"],
  cloud: ["0000011100000000", "0001111111000000", "0011111111110000", "0111111111111100", "1111111111111110", "0111111111111100"],
  nurse: [
    "...wwwwwwww...", "...wwwppwww...", "..hhwwppwwhh..", "..hhhhhhhhhh..", "..hssssssssh..",
    "..hskssssksh..", "..hsbssssbsh..", "...sssmmsss...", "...gttttttg...", ".sstgtttgtss..",
    ".sstttggtttss.", "..ttttggtttt..", "..tttttttttt..", "..tttttttttt..", "...tttttttt...", "...ww....ww..."
  ],
  trophy: ["011111110", "311111113", "311111113", "031111130", "003111300", "000131000", "000131000", "001111100", "011111110"]
};
const PAL = {
  nurse: { h: "#7a5548", s: "#FFE0C8", w: "#FFFFFF", p: "#FF8FB8", k: "#4a3f6b", b: "#FFB7D5", m: "#E8688F", t: "#8AD6D1", g: "#8a86a8" },
  trophy: { 1: "#FFD35A", 3: "#F2A93B" }
};
function sprite(grid, pal) {
  const w = grid[0].length; let r = "";
  grid.forEach((row, y) => [...row].forEach((c, x) => { if (pal[c]) r += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${pal[c]}"/>`; }));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${grid.length}" shape-rendering="crispEdges">${r}</svg>`;
}
const mono = (g, c) => sprite(g, { 1: c });
const uri = svg => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const $ = id => document.getElementById(id);
const rnd = (a, b) => a + Math.random() * (b - a);
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

const ICONS = [
  uri(mono(SPR.heart, "#FF8FB8")), uri(mono(SPR.heart, "#BFA3EE")), uri(mono(SPR.star, "#FFD35A")), uri(mono(SPR.star, "#8AD6D1")), uri(mono(SPR.star, "#ffffff"))
];

/* ---------- static art ---------- */
/* Your nurse picture: replace images/nurse.png to change her (transparent PNG works best) */
const nurseSVG = '<img src="marie.png" alt="" width="274" height="760" decoding="async">';
$("nurse").innerHTML = nurseSVG;
$("nurse2").innerHTML = nurseSVG;
$("trophy").innerHTML = sprite(SPR.trophy, PAL.trophy);
$("bigHeart").innerHTML = mono(SPR.heart, "#FF8FB8");
$("title").innerHTML = [..."CONGRATULATIONS!!"].map((c, i) => `<span style="animation-delay:${i * 90}ms">${c}</span>`).join("");

// drifting clouds + twinkling stars (background)
(function bg() {
  const sky = $("sky"), cloud = uri(mono(SPR.cloud, "#ffffff"));
  for (let i = 0; i < 5; i++) {
    const c = document.createElement("div"); c.className = "cloud";
    const w = rnd(90, 170);
    c.style.cssText = `width:${w}px;height:${w * .375}px;top:${rnd(4, 60)}%;background:${cloud} center/contain no-repeat;animation-duration:${rnd(60, 110)}s;animation-delay:-${rnd(0, 90)}s`;
    sky.appendChild(c);
  }
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("div"); s.className = "tw"; const z = rnd(10, 20);
    s.style.cssText = `left:${rnd(0, 97)}%;top:${rnd(0, 95)}%;width:${z}px;height:${z}px;background-image:${ICONS[2 + (i % 3)]};animation-delay:-${rnd(0, 2)}s`;
    sky.appendChild(s);
  }
})();

/* ---------- floating hearts / stars ---------- */
function floater(layer, big) {
  const e = document.createElement("div"); e.className = "fl";
  const z = big ? rnd(22, 40) : rnd(14, 28);
  e.style.cssText = `left:${rnd(2, 96)}%;width:${z}px;height:${z * .9}px;background-image:${ICONS[Math.floor(rnd(0, ICONS.length))]};--dx:${rnd(-40, 40)}px;animation-duration:${rnd(4, 7)}s`;
  layer.appendChild(e); e.addEventListener("animationend", () => e.remove());
}
const layers = [["heroFloat", 650], ["galFloat", 800], ["finFloat", 600]].map(([id, ms]) => ({ el: $(id), ms, on: id === "heroFloat" }));
layers.forEach(l => {
  new IntersectionObserver(([en]) => { l.on = en.isIntersecting; }).observe(l.el.parentElement);
  if (!REDUCED) setInterval(() => { if (l.on && !document.hidden) floater(l.el); }, l.ms);
});

/* ---------- confetti ---------- */
const cv = $("confetti"), cx = cv.getContext("2d"); let parts = [], running = false;
function fit() { const d = Math.min(devicePixelRatio || 1, 2); cv.width = innerWidth * d; cv.height = innerHeight * d; cx.setTransform(d, 0, 0, d, 0, 0); }
fit(); addEventListener("resize", fit);
function confetti(n = 120) {
  if (REDUCED) return;
  const cols = ["#FF8FB8", "#8AD6D1", "#BFE3F7", "#D9C9F5", "#FFD35A", "#ffffff"];
  for (let i = 0; i < n; i++) parts.push({ x: rnd(0, innerWidth), y: rnd(-40, -5), vx: rnd(-1.5, 1.5), vy: rnd(2, 5), s: Math.round(rnd(5, 11) / 2) * 2, c: cols[i % 6], l: rnd(140, 240) });
  if (!running) { running = true; requestAnimationFrame(cfTick); }
}
function cfTick() {
  cx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter(p => p.l-- > 0 && p.y < innerHeight + 20);
  parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .03; cx.fillStyle = p.c; cx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s); });
  if (parts.length) requestAnimationFrame(cfTick); else running = false;
}

/* ---------- achievement ---------- */
let achT;
function achievement() {
  const a = $("ach"); a.classList.add("show"); confetti(90);
  clearTimeout(achT); achT = setTimeout(() => a.classList.remove("show"), 6000);
}
$("ach").onclick = () => $("ach").classList.remove("show");
$("replayAch").onclick = () => { scrollTo({ top: 0, behavior: "smooth" }); setTimeout(achievement, 500); };
setTimeout(() => { achievement(); }, 1800);

/* ---------- reveal on scroll ---------- */
const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); rv.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => rv.observe(el));

/* ---------- gallery ---------- */
let photos = [], placeholders = false, x = 0, glide = 0, setW = 0, step = 260;
let paused = false, dragging = false, moved = false, visible = true, resumeT, SPEED = REDUCED ? 0 : 38;
const track = $("track"), viewport = $("viewport");

function placeholder(i) {
  const bg = ["#FFB7D5", "#BFE3F7", "#D9C9F5", "#8AD6D1", "#FFF6E3"][i % 5];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 35" shape-rendering="crispEdges"><rect width="28" height="35" fill="${bg}"/><g transform="translate(7 9) scale(2)">${sprite(SPR.heart, { 1: "#ffffff" }).replace(/<svg[^>]*>|<\/svg>/g, "")}</g><text x="14" y="28" font-size="3" text-anchor="middle" fill="#4a3f6b" font-family="monospace">YOUR PHOTO</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
function load() {
  if (PHOTOS.length) photos = PHOTOS.map(p => ({ ...p }));
  else { placeholders = true; photos = CAPTIONS.map((c, i) => ({ src: placeholder(i), caption: c })); }
  render();
}
function itemHTML(p, i) {
  const f = document.createElement("figure"); f.className = "item"; f.dataset.i = i; f.style.margin = "";
  const img = new Image(); img.src = p.src; img.alt = p.caption; img.loading = "lazy"; img.decoding = "async"; img.draggable = false;
  const cap = document.createElement("figcaption"); cap.textContent = p.caption;
  f.append(img, cap); return f;
}
function render() {
  track.textContent = "";
  const build = () => photos.forEach((p, i) => track.appendChild(itemHTML(p, i)));
  build(); build();
  const n = photos.length, kids = track.children;
  setW = kids[n].offsetLeft - kids[0].offsetLeft;
  step = n > 1 ? kids[1].offsetLeft - kids[0].offsetLeft : setW;
  const need = Math.ceil((viewport.clientWidth + 40) / setW);
  for (let k = 0; k < need; k++) build();
  // odd photo counts break the odd/even tilt pattern at the loop seam, so keep tilt per original index
  [...track.children].forEach((el, j) => { el.style.transform = (j % n) % 2 ? "rotate(3deg) translateY(8px)" : "rotate(-3deg)"; });
}
function wrap() { if (!setW) return; while (x <= -setW) x += setW; while (x > 0) x -= setW; }
let last = performance.now();
function tick(t) {
  const dt = Math.min((t - last) / 1000, .1); last = t;
  if (visible && !document.hidden) {
    if (glide) { const s = glide * Math.min(1, dt * 7); x += s; glide -= s; if (Math.abs(glide) < .5) glide = 0; }
    if (!paused && !dragging) x -= SPEED * dt;
    wrap(); track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
  }
  requestAnimationFrame(tick);
}
new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(viewport);
function hold(ms = 3000) { paused = true; clearTimeout(resumeT); resumeT = setTimeout(() => paused = false, ms); }
const nudge = d => { hold(); glide += d * -step; };
$("prev").onclick = () => nudge(-1); $("next").onclick = () => nudge(1);

let sx = 0, sx0 = 0, pid = null;
viewport.addEventListener("pointerdown", e => { sx = e.clientX; sx0 = x; moved = false; pid = e.pointerId; glide = 0; });
viewport.addEventListener("pointermove", e => {
  if (e.pointerId === pid && e.buttons !== 0 || (e.pointerType === "touch" && pid === e.pointerId)) {
    const dx = e.clientX - sx;
    if (!dragging && Math.abs(dx) > 8) { dragging = true; moved = true; paused = true; clearTimeout(resumeT); try { viewport.setPointerCapture(pid); } catch (_) { } }
    if (dragging) x = sx0 + dx;
  }
});
const endDrag = e => { if (e.pointerId !== pid) return; pid = null; if (dragging) { dragging = false; hold(2500); } };
viewport.addEventListener("pointerup", endDrag); viewport.addEventListener("pointercancel", endDrag);
viewport.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") { clearTimeout(resumeT); paused = true; } });
viewport.addEventListener("pointerleave", e => { if (e.pointerType === "mouse" && !dragging) paused = false; });
viewport.addEventListener("click", e => { if (moved) { moved = false; return; } const it = e.target.closest(".item"); if (it) openLB(+it.dataset.i); });
addEventListener("resize", () => { clearTimeout(load.t); load.t = setTimeout(render, 200); });

$("fileIn").addEventListener("change", e => {
  const ok = ["image/jpeg", "image/png", "image/webp"];
  const files = [...e.target.files].filter(f => ok.includes(f.type));
  if (!files.length) return;
  if (placeholders) { photos = []; placeholders = false; }
  files.forEach(f => photos.push({ src: URL.createObjectURL(f), caption: CAPTIONS[photos.length % CAPTIONS.length] }));
  x = 0; glide = 0; render(); hold(2500); e.target.value = "";
});

/* ---------- lightbox ---------- */
let cur = 0;
function showLB() { const p = photos[cur]; $("lbImg").src = p.src; $("lbImg").alt = p.caption; $("lbCap").value = p.caption; }
function openLB(i) { cur = i; showLB(); $("lb").hidden = false; hold(60000); $("lbClose").focus(); }
function closeLB() { $("lb").hidden = true; hold(800); }
const go = d => { cur = (cur + d + photos.length) % photos.length; showLB(); };
$("lbClose").onclick = closeLB; $("lbPrev").onclick = () => go(-1); $("lbNext").onclick = () => go(1);
$("lb").addEventListener("click", e => { if (e.target === $("lb")) closeLB(); });
$("lbCap").addEventListener("input", e => {
  photos[cur].caption = e.target.value;
  track.querySelectorAll(`.item[data-i="${cur}"]`).forEach(it => { it.lastChild.textContent = e.target.value; });
});
let tx = 0;
$("lbImg").addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
$("lbImg").addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); });
addEventListener("keydown", e => {
  if (!$("lb").hidden) { if (e.key === "Escape") closeLB(); if (e.key === "ArrowLeft" && e.target.id !== "lbCap") go(-1); if (e.key === "ArrowRight" && e.target.id !== "lbCap") go(1); }
  else if (!$("modal").hidden && e.key === "Escape") closeSurprise();
});

/* ---------- surprise ---------- */
let sT = [];
$("openSurprise").onclick = () => {
  const env = $("env"); $("modal").hidden = false; $("letter").hidden = true;
  env.className = "env"; env.style.display = ""; void env.offsetWidth;
  sT = [
    setTimeout(() => env.classList.add("open"), 700),
    setTimeout(() => { env.classList.add("gone"); }, 1500),
    setTimeout(() => { env.style.display = "none"; $("letter").hidden = false; confetti(160); $("closeLetter").focus(); }, 1900)
  ];
  const fl = setInterval(() => { if ($("modal").hidden) return clearInterval(fl); for (let i = 0; i < 2; i++) { const e = document.createElement("div"); e.className = "fl"; e.style.position = "fixed"; e.style.zIndex = 55; const z = rnd(18, 34); e.style.cssText += `left:${rnd(2, 96)}%;width:${z}px;height:${z * .9}px;background-image:${ICONS[i]};--dx:${rnd(-30, 30)}px`; document.body.appendChild(e); e.addEventListener("animationend", () => e.remove()); } }, 350);
};
function closeSurprise() { sT.forEach(clearTimeout); $("modal").hidden = true; confetti(100); }
$("closeLetter").onclick = closeSurprise;

/* ---------- music (muted until you tap) ---------- */
let ac, gain, timer, playing = false, audioEl, ni = 0;
const MEL = [523, 659, 784, 659, 587, 698, 880, 698, 659, 784, 1047, 784, 698, 587, 523, 0];
const BASS = [131, 175, 131, 196];
function note(f, type, dur, vol) {
  if (!f) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
  o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g).connect(gain); o.start(t); o.stop(t + dur);
}
function beat() { note(MEL[ni % 16], "square", .24, .5); if (ni % 4 === 0) note(BASS[(ni >> 2) % 4], "triangle", .9, 1); ni++; }
$("musicBtn").onclick = () => {
  playing = !playing;
  if (MUSIC_FILE) { audioEl = audioEl || Object.assign(new Audio(MUSIC_FILE), { loop: true, volume: .5 }); playing ? audioEl.play() : audioEl.pause(); }
  else if (playing) {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume();
    gain = gain || Object.assign(ac.createGain(), {}); gain.gain.value = .07; gain.connect(ac.destination);
    timer = setInterval(beat, 280);
  } else { clearInterval(timer); if (gain) gain.disconnect(); }
  $("musicBtn").textContent = playing ? "🎵 MUSIC: ON" : "🎵 MUSIC: OFF";
  $("musicBtn").setAttribute("aria-pressed", playing);
};

load();
requestAnimationFrame(tick);