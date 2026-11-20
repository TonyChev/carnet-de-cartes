/* Carnet de cartes : cartes de jeux HD zoomables avec marqueurs, sauvegardés sur Supabase. */
(() => {
"use strict";

/* ---------- constants ---------- */
const I = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICONS = {
  flag:'<path d="M6 21V4h11l-2.5 3.5L17 11H6"/>',
  star:'<path d="M12 3.5l2.5 5.1 5.5.7-4 3.8 1 5.5L12 16l-5 2.6 1-5.5-4-3.8 5.5-.7z"/>',
  question:'<path d="M9.2 9.3a2.9 2.9 0 1 1 4.1 2.7c-.8.4-1.3 1-1.3 1.9v.4"/><path d="M12 18.2h.01"/>',
  car:'<path d="M4.5 16v-3.2L6.8 8h10.4l2.3 4.8V16z"/><path d="M4.5 12.8h15"/><circle cx="8" cy="16.5" r="1.6"/><circle cx="16" cy="16.5" r="1.6"/>',
  target:'<circle cx="12" cy="12" r="6"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>',
  bag:'<path d="M6 8.5h12L17 20H7z"/><path d="M9 8.5a3 3 0 0 1 6 0"/>',
  bolt:'<path d="M13 3L6 13.5h5L10 21l7-10.5h-5z"/>',
  clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4.2l2.8 1.8"/>',
  skull:'<path d="M12 3.5a7 7 0 0 0-7 7c0 2.3 1.1 3.9 3 5v3h8v-3c1.9-1.1 3-2.7 3-5a7 7 0 0 0-7-7z"/><circle cx="9.5" cy="11" r="1.3"/><circle cx="14.5" cy="11" r="1.3"/>',
  house:'<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
  dollar:'<path d="M12 3v18"/><path d="M16.5 7.5c-.8-1.3-2.5-2-4.5-2-2.5 0-4 1.3-4 3s1.5 2.5 4 3 4 1.4 4 3.2-1.7 3-4.3 3c-2 0-3.6-.8-4.4-2.2"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2.5 2.5M13.5 9.5l2 2"/>',
  book:'<path d="M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2z"/><path d="M12 6.5v13"/>',
  camera:'<path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  boat:'<path d="M3 15h18l-3 5H6z"/><path d="M12 15V4l6 8h-6"/>',
  chest:'<path d="M4 10h16v10H4z"/><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4"/><path d="M11 13h2v3h-2z"/>',
  mountain:'<path d="M3 20l6.5-12 4 7 2.5-4 5 9z"/>',
  person:'<circle cx="12" cy="7.5" r="3.5"/><path d="M5.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  drop:'<path d="M12 3.5s6 6.5 6 10.5a6 6 0 0 1-12 0c0-4 6-10.5 6-10.5z"/>',
  paw:'<circle cx="7" cy="10" r="1.8"/><circle cx="17" cy="10" r="1.8"/><circle cx="10" cy="6" r="1.8"/><circle cx="14" cy="6" r="1.8"/><path d="M12 12.5c-3 0-5 3.5-5 5.5 0 1.5 1.5 2 2.5 2 1 0 1.5-.5 2.5-.5s1.5.5 2.5.5 2.5-.5 2.5-2c0-2-2-5.5-5-5.5z"/>',
  sword:'<path d="M14.5 4H20v5.5L9 20.5 3.5 15z"/><path d="M6 12.5l5.5 5.5M4 20l2.5-2.5"/>',
  music:'<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  dot:'<circle cx="12" cy="12" r="4"/>',
};
const ICON_KEYS = Object.keys(ICONS);
const COLORS = ["#ff7a59","#ffc24b","#8be15a","#2fd4c4","#5aa8ff","#b48cff","#ff4f8b","#ff5d6c","#f2994a","#3ddc97","#56ccf2","#e05cff","#d6deea"];
const DEFAULT_TYPES = [
  ["Mission faite","#ff7a59","flag"],["Objet de collection","#ffc24b","star"],["Secret","#b48cff","question"],
  ["Véhicule","#2fd4c4","car"],["Arme","#ff4f8b","target"],["Magasin / planque","#5aa8ff","bag"],
  ["Activité","#8be15a","bolt"],["À revenir","#d6deea","clock"],
];
const MISSING = {id:"_missing", label:"Type supprimé", color:"#8a96a8", icon:"dot"};
const BUCKET = "carnet-maps";
const MAX_BYTES = 45 * 1024 * 1024;
const COLS = "ABCDEFGHIJKL";
const grid = (x,y) => COLS[Math.min(11, Math.floor(x*12))] + (Math.min(11, Math.floor(y*12)) + 1);
const $ = id => document.getElementById(id);
const PHONE = () => innerWidth < 760;

const okColor = c => typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c) ? c : MISSING.color;
const okIcon = k => ICONS[k] ? k : "dot";
function ink(hex){
  const n = parseInt(hex.slice(1), 16), ch = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  const L = .2126 * ch(n >> 16 & 255) + .7152 * ch(n >> 8 & 255) + .0722 * ch(n & 255);
  return L > .28 ? "#0a1120" : "#ffffff";
}
const tvars = t => `--c:${t.color};--k:${ink(t.color)}`;

const vp = $("vp"), stage = $("stage"), img = $("map"), pinsEl = $("pins");

/* ---------- state ---------- */
let sb = null, user = null;
let games = [], gameId = null;
let types = [], markers = [];
let imgW = 0, imgH = 0, z = 1, tx = 0, ty = 0, fitZ = 1;
let hidden = new Set();
let ed = null;          // marker editor: {mode:"new", x, y, type} | {mode:"edit", id, type}
let tEd = null;         // type editor: {id|null, label, color, icon, back}
let gView = {mode:"list"};
let pendingFile = null;
let movingId = null;
const urlCache = new Map();   // image_path -> {url, exp}

const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

const typeOf = id => types.find(t => t.id === id) || MISSING;
const sortedTypes = () => [...types].sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label));
const game = () => games.find(g => g.id === gameId) || null;

/* ---------- toast / busy / cloud ---------- */
let toastT;
function toast(msg, err){
  const t = $("toast"); t.textContent = msg; t.className = err ? "err" : ""; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2800);
}
function busy(msg){ const b = $("busy"); b.hidden = !msg; if (msg) b.textContent = msg; }
function setCloud(state, txt){ $("cloud").className = "chip " + state; $("cloudTxt").textContent = txt; }
function fail(e, fallback){
  console.error(e);
  const msg = (e && (e.message || e.error_description)) || "";
  if (e && e.code === "too_large") toast("Image trop lourde, même compressée. Essaie une version plus petite.", true);
  else if (/JWT|session|not authenticated/i.test(msg)) toast("Session expirée : reconnecte-toi.", true);
  else if (/Failed to fetch|NetworkError/i.test(msg)) toast("Pas de connexion. Réessaie dans un instant.", true);
  else toast(fallback || "Échec de l'enregistrement. Réessaie.", true);
}
const must = ({data, error}) => { if (error) throw error; return data; };

/* ---------- sheets ---------- */
const RIGHT = ["editor", "typeEd", "games"];
function showSheet(id){
  for (const s of RIGHT) if (s !== id) $(s).hidden = true;
  if (PHONE()) closePanel();
  $(id).hidden = false;
}
document.querySelectorAll("[data-close]").forEach(b => b.onclick = () => {
  const s = b.dataset.close;
  if (s === "editor") closeEditor();
  else if (s === "typeEd") closeTypeEd();
  else if (s === "panel") closePanel();
  else $(s).hidden = true;
});

/* ---------- view transform ---------- */
let raf = 0;
function apply(){
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    stage.style.width = (imgW * z) + "px"; stage.style.height = (imgH * z) + "px";
    stage.style.transform = `translate3d(${Math.round(tx)}px,${Math.round(ty)}px,0)`;
    if (info) placeInfo();
  });
}
const clampZ = v => Math.max(fitZ * 0.8, Math.min(Math.max(4, fitZ * 4), v));
function clampPan(){
  const vw = vp.clientWidth, vh = vp.clientHeight, w = imgW * z, h = imgH * z, m = 60;
  tx = w <= vw ? (vw - w) / 2 : Math.min(m, Math.max(vw - w - m, tx));
  ty = h <= vh ? (vh - h) / 2 : Math.min(m, Math.max(vh - h - m, ty));
}
function zoomAt(px, py, f){
  const nz = clampZ(z * f);
  tx = px - (px - tx) * (nz / z); ty = py - (py - ty) * (nz / z); z = nz;
  clampPan(); apply();
}
function fit(){
  fitZ = Math.min(vp.clientWidth / imgW, vp.clientHeight / imgH);
  z = fitZ; clampPan(); apply();
}
function flyTo(m){
  const vw = vp.clientWidth, vh = vp.clientHeight;
  z = clampZ(Math.max(z, fitZ * 3));
  tx = vw / 2 - m.x * imgW * z;
  ty = (PHONE() ? vh * 0.3 : vh / 2) - m.y * imgH * z;
  clampPan(); apply();
}
function toNorm(cx, cy){
  const r = vp.getBoundingClientRect();
  return { x: (cx - r.left - tx) / z / imgW, y: (cy - r.top - ty) / z / imgH };
}
window.addEventListener("resize", () => {
  if (!imgW) return;
  const old = fitZ; fitZ = Math.min(vp.clientWidth / imgW, vp.clientHeight / imgH);
  if (z < fitZ * .8 || z === old) z = fitZ; clampPan(); apply();
});

/* ---------- gestures ---------- */
const ptrs = new Map();
let tap = null, lastMid = null, lastDist = 0;
vp.addEventListener("pointerdown", e => {
  if (!imgW || e.target.closest(".bubble")) return;
  vp.setPointerCapture(e.pointerId);
  ptrs.set(e.pointerId, {x:e.clientX, y:e.clientY});
  if (ptrs.size === 1) tap = {x:e.clientX, y:e.clientY, t:performance.now(), pin:e.target.closest(".pin"), ok:true};
  else if (tap) tap.ok = false;
  if (ptrs.size === 2) { const [a,b] = [...ptrs.values()]; lastMid = {x:(a.x+b.x)/2, y:(a.y+b.y)/2}; lastDist = Math.hypot(a.x-b.x, a.y-b.y); }
});
vp.addEventListener("pointermove", e => {
  const p = ptrs.get(e.pointerId); if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y;
  p.x = e.clientX; p.y = e.clientY;
  if (tap && tap.ok && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > (e.pointerType === "mouse" ? 6 : 12)) { tap.ok = false; vp.classList.add("grabbing"); }
  if (ptrs.size === 1) { if (!tap || !tap.ok) { tx += dx; ty += dy; clampPan(); apply(); } }
  else if (ptrs.size === 2 && lastMid) {
    const [a,b] = [...ptrs.values()];
    const mid = {x:(a.x+b.x)/2, y:(a.y+b.y)/2}, dist = Math.hypot(a.x-b.x, a.y-b.y);
    const r = vp.getBoundingClientRect();
    tx += mid.x - lastMid.x; ty += mid.y - lastMid.y;
    if (lastDist > 0) zoomAt(mid.x - r.left, mid.y - r.top, dist / lastDist); else { clampPan(); apply(); }
    lastMid = mid; lastDist = dist;
  }
});
function endPtr(e){
  if (!ptrs.has(e.pointerId)) return;
  ptrs.delete(e.pointerId);
  if (ptrs.size === 1) { lastMid = null; lastDist = 0; tap = null; }
  if (ptrs.size === 0) {
    vp.classList.remove("grabbing");
    if (e.type === "pointerup" && tap && tap.ok && performance.now() - tap.t < 600) onTap(tap, e.clientX, e.clientY);
    tap = null;
  }
}
vp.addEventListener("pointerup", endPtr);
vp.addEventListener("pointercancel", endPtr);
vp.addEventListener("wheel", e => {
  if (!imgW) return; e.preventDefault();
  const r = vp.getBoundingClientRect();
  zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)));
}, {passive:false});
const zoomCenter = f => zoomAt(vp.clientWidth / 2, vp.clientHeight / 2, f);
$("zin").onclick = () => zoomCenter(1.6);
$("zout").onclick = () => zoomCenter(1 / 1.6);
$("zfit").onclick = fit;
document.addEventListener("keydown", e => {
  if (e.target.matches("input,textarea")) { if (e.key === "Escape") e.target.blur(); return; }
  if (e.key === "Escape") { closeInfo(); closeTypeEd(); closeEditor(); closePanel(); $("games").hidden = true; cancelMove(); }
  if (!imgW) return;
  if (e.key === "+" || e.key === "=") zoomCenter(1.4);
  if (e.key === "-") zoomCenter(1 / 1.4);
});

function onTap(t, cx, cy){
  if (t.pin && !movingId) { showInfo(t.pin.dataset.id); return; }
  if (info) { closeInfo(); return; }
  const n = toNorm(cx, cy);
  if (n.x < 0 || n.y < 0 || n.x > 1 || n.y > 1) { closeEditor(); return; }
  if (movingId) { moveTo(n); return; }
  if (!$("games").hidden || !$("typeEd").hidden) { $("games").hidden = true; closeTypeEd(true); return; }
  if (ed && ed.mode === "edit") { closeEditor(); return; }
  openNew(n);
}

/* ---------- pins ---------- */
const isHome = t => t.icon === "house";
function pinHTML(t){
  if (isHome(t)) return `<svg class="drop" viewBox="0 0 40 46" aria-hidden="true"><path d="M20 2.5L37.5 17v18.5a1.5 1.5 0 0 1-1.5 1.5H25l-5 7-5-7H4a1.5 1.5 0 0 1-1.5-1.5V17z" fill="${t.color}" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/></svg><span class="ico" style="color:${ink(t.color)}">${I(ICONS[t.icon])}</span>`;
  return `<svg class="drop" viewBox="0 0 30 40" aria-hidden="true"><path d="M15 39C15 39 2 24 2 14.5a13 13 0 0 1 26 0C28 24 15 39 15 39z" fill="${t.color}" stroke="#0a1120" stroke-width="2"/></svg><span class="ico" style="color:${ink(t.color)}">${I(ICONS[t.icon])}</span>`;
}
function renderPins(){
  pinsEl.innerHTML = "";
  for (const m of markers) {
    const t = typeOf(m.type);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pin" + (isHome(t) ? " home" : "") + (hidden.has(t.id) ? " off" : "") + ((ed && ed.id === m.id) || (info && info.id === m.id) ? " sel" : "");
    b.dataset.id = m.id;
    b.style.left = (m.x * 100) + "%"; b.style.top = (m.y * 100) + "%";
    b.setAttribute("aria-label", t.label + (m.note ? " : " + m.note : ""));
    b.title = t.label + (m.note ? " : " + m.note : "");
    b.innerHTML = pinHTML(t);
    b.addEventListener("click", ev => { if (ev.detail === 0) showInfo(m.id); });
    pinsEl.appendChild(b);
  }
  if (info) renderInfo();
  if (ed && ed.mode === "new") {
    const g = document.createElement("div");
    g.className = "pin ghost" + (isHome(typeOf(ed.type)) ? " home" : "");
    g.style.left = (ed.x * 100) + "%"; g.style.top = (ed.y * 100) + "%";
    g.innerHTML = pinHTML(typeOf(ed.type));
    pinsEl.appendChild(g);
  }
}
function typeTile(t, cls){
  const b = document.createElement("button");
  b.type = "button"; b.className = cls; b.dataset.type = t.id; b.style.cssText = tvars(t);
  b.innerHTML = `<span class="sw">${I(ICONS[t.icon])}</span><span class="lab"></span>`;
  b.querySelector(".lab").textContent = t.label;
  return b;
}

/* ---------- info bubble ---------- */
let info = null;      // {id}
function showInfo(id){
  if (!markers.some(m => m.id === id)) return;
  if (ed) { ed = null; $("editor").hidden = true; }
  info = {id}; renderPins();
}
function closeInfo(){ if (!info) return; info = null; renderPins(); }
function renderInfo(){
  const m = markers.find(m => m.id === info.id);
  if (!m || hidden.has(typeOf(m.type).id)) { info = null; return; }
  const t = typeOf(m.type);
  const el = document.createElement("div");
  el.className = "bubble" + (isHome(t) ? " home" : ""); el.style.cssText = tvars(t);
  el.style.left = (m.x * 100) + "%"; el.style.top = (m.y * 100) + "%";
  el.setAttribute("role", "dialog");
  el.innerHTML = `<div class="bh"><span class="sw">${I(ICONS[t.icon])}</span><b></b><button class="bx" type="button" aria-label="Fermer">${I('<path d="M6 6l12 12M18 6L6 18"/>')}</button></div>` +
    `<p></p><div class="bf"><span>Secteur ${grid(m.x, m.y)}</span><button class="link" type="button">Modifier</button></div>`;
  el.querySelector("b").textContent = t.label;
  const p = el.querySelector("p");
  if (m.note) p.textContent = m.note; else { p.textContent = "Sans note"; p.className = "none"; }
  el.querySelector(".bx").onclick = closeInfo;
  el.querySelector(".link").onclick = () => { info = null; openEdit(m.id); };
  el.addEventListener("wheel", e => e.stopPropagation(), {passive:true});
  pinsEl.appendChild(el);
  placeInfo();
}
function placeInfo(){
  const el = pinsEl.querySelector(".bubble"); if (!el) return;
  const m = markers.find(m => m.id === info.id); if (!m) return;
  const py = ty + m.y * imgH * z, px = tx + m.x * imgW * z;
  const top = $("bar").getBoundingClientRect().bottom;
  el.classList.toggle("below", py - el.offsetHeight - 60 < top);
  const half = el.offsetWidth / 2, vw = vp.clientWidth;
  const shift = Math.max(12 + half - px, Math.min(0, vw - 12 - half - px));
  el.style.setProperty("--sx", shift + "px");
}

/* ---------- marker editor ---------- */
function renderEdTypes(){
  const box = $("edTypes"); box.innerHTML = "";
  if (!types.length) {
    const p = document.createElement("div"); p.className = "empty"; p.style.gridColumn = "1/-1";
    p.textContent = "Aucun type pour cette carte. Crée-en un pour poser ton marqueur.";
    box.appendChild(p);
  }
  for (const t of sortedTypes()) {
    const b = typeTile(t, "type");
    b.setAttribute("aria-pressed", ed && ed.type === t.id ? "true" : "false");
    box.appendChild(b);
  }
  const add = document.createElement("button");
  add.type = "button"; add.className = "type add"; add.dataset.add = "1";
  add.innerHTML = `<span class="sw">${I('<path d="M12 5v14M5 12h14"/>')}</span><span class="lab">Nouveau type</span>`;
  box.appendChild(add);
}
$("edTypes").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b || !ed) return;
  if (b.dataset.add) { openTypeEd(null, "editor"); return; }
  ed.type = b.dataset.type; renderEdTypes(); renderPins(); updateSave();
});
function updateSave(){ const s = $("edSave"); if (s) s.disabled = !ed || !types.some(t => t.id === ed.type); }
function fmtDate(ms){ try { return new Date(ms).toLocaleDateString("fr-FR", {day:"numeric", month:"long", year:"numeric"}); } catch (e) { return ""; } }

function openNew(n){
  info = null;
  const st = sortedTypes();
  const last = lsGet("carnet.lastType." + gameId);
  ed = {mode:"new", x:n.x, y:n.y, type: st.some(t => t.id === last) ? last : (st[0] ? st[0].id : null)};
  $("edTitle").textContent = "Nouveau marqueur";
  $("edPos").textContent = `Secteur ${grid(n.x, n.y)} · ${n.x.toFixed(4)}, ${n.y.toFixed(4)}`;
  $("edNote").value = ""; $("edMeta").textContent = "";
  $("edActions").innerHTML = `<button class="btn primary" type="button" id="edSave">Enregistrer</button>`;
  $("edSave").onclick = save;
  renderEdTypes(); updateSave();
  showSheet("editor"); renderPins();
}
function openEdit(id){
  const m = markers.find(m => m.id === id); if (!m) return;
  info = null;
  ed = {mode:"edit", id, type: m.type};
  $("edTitle").textContent = typeOf(m.type).label;
  $("edPos").textContent = `Secteur ${grid(m.x, m.y)} · ${m.x.toFixed(4)}, ${m.y.toFixed(4)}`;
  $("edNote").value = m.note || "";
  $("edMeta").textContent = m.createdAt ? "Ajouté le " + fmtDate(m.createdAt) : "";
  $("edActions").innerHTML = `<button class="btn primary" type="button" id="edSave">Enregistrer</button><button class="btn" type="button" id="edMove">Déplacer</button><button class="btn danger" type="button" id="edDel">Supprimer</button>`;
  $("edSave").onclick = save;
  $("edMove").onclick = () => startMove(id);
  $("edDel").onclick = e => {
    const b = e.currentTarget;
    if (!b.classList.contains("armed")) { b.classList.add("armed"); b.textContent = "Confirmer"; return; }
    removeMarker(id);
  };
  renderEdTypes(); updateSave();
  showSheet("editor"); renderPins();
}
function closeEditor(){ if (!ed && $("editor").hidden) return; ed = null; $("editor").hidden = true; renderPins(); }

async function save(){
  if (!ed || !gameId) return;
  const btn = $("edSave"); btn.disabled = true; btn.textContent = "Enregistrement…";
  const note = $("edNote").value.trim().slice(0, 500);
  try {
    if (ed.mode === "new") {
      must(await sb.from("carnet_markers").insert({game_id: gameId, type_id: ed.type, x: ed.x, y: ed.y, note}));
      lsSet("carnet.lastType." + gameId, ed.type);
      toast("Marqueur enregistré dans le cloud");
    } else {
      must(await sb.from("carnet_markers").update({type_id: ed.type, note}).eq("id", ed.id));
      toast("Marqueur mis à jour");
    }
    closeEditor();
    await loadGameData();
  } catch (e) { fail(e); btn.disabled = false; btn.textContent = "Enregistrer"; }
}
async function removeMarker(id){
  try { must(await sb.from("carnet_markers").delete().eq("id", id)); toast("Marqueur supprimé"); closeEditor(); await loadGameData(); }
  catch (e) { fail(e); }
}

/* ---------- move ---------- */
function startMove(id){
  movingId = id; info = null; closeEditor();
  showHint(`Touche le nouvel emplacement <button type="button" id="mvCancel">Annuler</button>`, true);
  $("mvCancel").onclick = cancelMove;
}
function cancelMove(){ if (!movingId) return; movingId = null; showDefaultHint(); }
async function moveTo(n){
  const id = movingId; movingId = null; showDefaultHint();
  try { must(await sb.from("carnet_markers").update({x: n.x, y: n.y}).eq("id", id)); toast("Marqueur déplacé"); await loadGameData(); }
  catch (e) { fail(e); }
}

/* ---------- hint ---------- */
let hintTimer;
function showHint(html, act){ const h = $("hint"); h.innerHTML = html; h.className = act ? "act" : ""; h.hidden = false; clearTimeout(hintTimer); }
function showDefaultHint(){
  if (!imgW) { $("hint").hidden = true; return; }
  showHint("Touche la carte pour poser un marqueur");
  hintTimer = setTimeout(() => { if (!movingId) $("hint").hidden = true; }, 6000);
}

/* ---------- type editor ---------- */
function openTypeEd(id, back){
  const t = id ? types.find(t => t.id === id) : null;
  tEd = t ? {id:t.id, label:t.label, color:t.color, icon:t.icon, back}
          : {id:null, label:"", color:COLORS[types.length % COLORS.length], icon:ICON_KEYS[types.length % ICON_KEYS.length], back};
  $("tTitle").textContent = t ? "Modifier le type" : "Nouveau type";
  const g = game(); $("tSub").textContent = g ? "Carte : " + g.name : "";
  $("tName").value = tEd.label;
  renderTypeEd();
  const used = t ? markers.filter(m => m.type === t.id).length : 0;
  $("tMeta").textContent = t ? (used ? `Utilisé par ${used} marqueur${used > 1 ? "s" : ""}. Les changements s'appliquent à tous.` : "Aucun marqueur n'utilise ce type.") : "";
  $("tActions").innerHTML = `<button class="btn primary" type="button" id="tSave">${t ? "Enregistrer" : "Créer le type"}</button>` +
    (t ? `<button class="btn danger" type="button" id="tDel"${used ? " disabled title=\"Change d'abord le type de ces marqueurs\"" : ""}>Supprimer</button>` : "");
  $("tSave").onclick = saveType;
  if (t) $("tDel").onclick = e => {
    const b = e.currentTarget;
    if (!b.classList.contains("armed")) { b.classList.add("armed"); b.textContent = "Confirmer"; return; }
    deleteType(t.id);
  };
  for (const s of RIGHT) if (s !== "typeEd") $(s).hidden = true;
  if (PHONE()) closePanel();
  $("typeEd").hidden = false;
  if (!t && !PHONE()) setTimeout(() => $("tName").focus(), 50);
}
function renderTypeEd(){
  const prev = {label: tEd.label || "Nom du type", color: tEd.color, icon: tEd.icon};
  $("tPreview").innerHTML = `<span class="pin">${pinHTML(prev)}</span><b></b>`;
  $("tPreview").querySelector("b").textContent = prev.label;
  const custom = !COLORS.includes(tEd.color.toLowerCase());
  $("tColors").innerHTML = COLORS.map(c => `<button type="button" data-c="${c}" style="--c:${c}" aria-label="Couleur ${c}" aria-pressed="${c === tEd.color.toLowerCase()}"></button>`).join("") +
    `<label class="${custom ? "on" : ""}" title="Autre couleur" style="${custom ? "background:" + tEd.color : ""}"><input type="color" id="tCustom" value="${tEd.color}" aria-label="Autre couleur"></label>`;
  $("tCustom").oninput = e => { tEd.color = okColor(e.target.value); renderTypeEd(); };
  $("tIcons").style.cssText = tvars(tEd);
  $("tIcons").innerHTML = ICON_KEYS.map(k => `<button type="button" data-i="${k}" aria-label="Icône ${k}" aria-pressed="${k === tEd.icon}">${I(ICONS[k])}</button>`).join("");
}
$("tName").addEventListener("input", e => { if (!tEd) return; tEd.label = e.target.value; const b = $("tPreview").querySelector("b"); if (b) b.textContent = tEd.label || "Nom du type"; });
$("tColors").addEventListener("click", e => { const b = e.target.closest("button[data-c]"); if (b && tEd) { tEd.color = b.dataset.c; renderTypeEd(); } });
$("tIcons").addEventListener("click", e => { const b = e.target.closest("button[data-i]"); if (b && tEd) { tEd.icon = b.dataset.i; renderTypeEd(); } });

function closeTypeEd(silent){
  if (!tEd) { $("typeEd").hidden = true; return; }
  const back = tEd.back; tEd = null; $("typeEd").hidden = true;
  if (!silent && back === "editor" && ed) { renderEdTypes(); updateSave(); showSheet("editor"); }
  else if (back === "editor") { ed = null; renderPins(); }
  else if (!silent && back === "panel") openPanel();
}
async function saveType(){
  if (!tEd || !gameId) return;
  const label = $("tName").value.trim().slice(0, 40);
  if (!label) { toast("Donne un nom au type.", true); $("tName").focus(); return; }
  const btn = $("tSave"); btn.disabled = true;
  const body = {label, color: okColor(tEd.color), icon: okIcon(tEd.icon)};
  try {
    if (tEd.id) { must(await sb.from("carnet_types").update(body).eq("id", tEd.id)); toast("Type mis à jour"); }
    else {
      const row = must(await sb.from("carnet_types").insert({...body, game_id: gameId, sort: Date.now()}).select("id").single());
      toast("Type créé");
      if (tEd.back === "editor" && ed) ed.type = row.id;
    }
    await loadGameData();
    closeTypeEd();
  } catch (e) { fail(e); btn.disabled = false; }
}
async function deleteType(id){
  if (markers.some(m => m.type === id)) { toast("Ce type est encore utilisé par des marqueurs.", true); return; }
  try { must(await sb.from("carnet_types").delete().eq("id", id)); toast("Type supprimé"); await loadGameData(); closeTypeEd(); }
  catch (e) { fail(e); }
}

/* ---------- panel ---------- */
function openPanel(){
  if (PHONE()) { for (const s of RIGHT) $(s).hidden = true; if (ed) { ed = null; renderPins(); } }
  $("panel").hidden = false; $("listBtn").setAttribute("aria-expanded", "true"); renderList();
}
function closePanel(){ $("panel").hidden = true; $("listBtn").setAttribute("aria-expanded", "false"); }
$("listBtn").onclick = () => $("panel").hidden ? openPanel() : closePanel();
$("q").addEventListener("input", renderList);
$("addTypeBtn").onclick = () => openTypeEd(null, "panel");
$("filters").addEventListener("click", e => {
  const pen = e.target.closest("[data-edit]");
  if (pen) { openTypeEd(pen.dataset.edit, "panel"); return; }
  const b = e.target.closest(".type"); if (!b) return;
  const id = b.dataset.type;
  hidden.has(id) ? hidden.delete(id) : hidden.add(id);
  lsSet("carnet.hidden." + gameId, JSON.stringify([...hidden]));
  renderAll();
});
const PENCIL = I('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>');
function renderList(){
  const counts = {}; for (const m of markers) { const k = typeOf(m.type).id; counts[k] = (counts[k] || 0) + 1; }
  const f = $("filters"); f.innerHTML = "";
  const list = sortedTypes(); if (counts[MISSING.id]) list.push(MISSING);
  for (const t of list) {
    const row = document.createElement("div"); row.className = "frow";
    const b = typeTile(t, "type");
    b.setAttribute("aria-pressed", hidden.has(t.id) ? "false" : "true");
    b.insertAdjacentHTML("beforeend", `<span class="cnt">${counts[t.id] || 0}</span>`);
    row.appendChild(b);
    if (t !== MISSING) {
      const e = document.createElement("button");
      e.type = "button"; e.className = "ibtn"; e.dataset.edit = t.id; e.setAttribute("aria-label", "Modifier " + t.label);
      e.innerHTML = PENCIL; row.appendChild(e);
    }
    f.appendChild(row);
  }
  if (!list.length) f.innerHTML = `<div class="empty">Aucun type pour cette carte.</div>`;
  const vis = markers.filter(m => !hidden.has(typeOf(m.type).id));
  $("pSub").textContent = `${markers.length} au total · ${vis.length} visibles`;
  const q = $("q").value.trim().toLowerCase();
  const rows = vis
    .filter(m => !q || (m.note || "").toLowerCase().includes(q) || typeOf(m.type).label.toLowerCase().includes(q))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const box = $("list"); box.innerHTML = "";
  if (!markers.length) { box.innerHTML = `<div class="empty">Aucun marqueur sur cette carte. Touche un endroit de la carte pour poser le premier.</div>`; return; }
  if (!rows.length) { box.innerHTML = `<div class="empty">Aucun marqueur ne correspond.</div>`; return; }
  for (const m of rows) {
    const t = typeOf(m.type);
    const r = document.createElement("button");
    r.type = "button"; r.className = "row"; r.style.cssText = tvars(t);
    r.innerHTML = `<span class="sw">${I(ICONS[t.icon])}</span><span class="t"><b></b><span></span></span><span class="g">${grid(m.x, m.y)}</span>`;
    r.querySelector(".t b").textContent = t.label;
    r.querySelector(".t span").textContent = m.note || "Sans note";
    r.onclick = () => { flyTo(m); openEdit(m.id); };
    box.appendChild(r);
  }
}
function renderAll(){
  $("count").textContent = markers.length;
  renderPins();
  if (!$("panel").hidden) renderList();
  if (!$("editor").hidden && ed) { renderEdTypes(); updateSave(); if (ed.mode === "edit") $("edTitle").textContent = typeOf(ed.type).label; }
}

/* ---------- images ---------- */
async function signedUrl(path){
  const c = urlCache.get(path);
  if (c && c.exp > Date.now()) return c.url;
  const data = must(await sb.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24));
  urlCache.set(path, {url: data.signedUrl, exp: Date.now() + 23 * 3600 * 1000});
  return data.signedUrl;
}
async function prepareImage(file){
  const okType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  if (okType && file.size <= MAX_BYTES) return file;
  const bmp = await createImageBitmap(file);
  let scale = Math.min(1, 16384 / Math.max(bmp.width, bmp.height), Math.sqrt(180e6 / (bmp.width * bmp.height)));
  for (let pass = 0; pass < 4; pass++) {
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    for (const q of [0.92, 0.85, 0.75]) {
      const blob = await new Promise(r => c.toBlob(r, "image/jpeg", q));
      if (blob && blob.size <= MAX_BYTES) return blob;
    }
    scale *= 0.8;
  }
  throw {code: "too_large"};
}
async function uploadImage(file){
  const blob = await prepareImage(file);
  const type = blob.type || "image/jpeg";
  const ext = type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  must(await sb.storage.from(BUCKET).upload(path, blob, {contentType: type, upsert: false}));
  return path;
}
const removeImage = path => sb.storage.from(BUCKET).remove([path]).catch(() => {});

/* ---------- games ---------- */
$("gameBtn").onclick = () => { if (!user) return; if (!$("games").hidden) { $("games").hidden = true; return; } openGames({mode:"list"}); };
$("splashBtn").onclick = () => openGames({mode:"new"});
function openGames(view){
  gView = view; pendingFile = null;
  if (ed) { ed = null; renderPins(); }
  tEd = null;
  renderGames(); showSheet("games");
}
function renderGames(){
  const body = $("gBody"), act = $("gActions");
  body.innerHTML = ""; act.innerHTML = "";
  $("whoEmail").textContent = user ? user.email : "";
  if (gView.mode === "list") {
    $("gTitle").textContent = "Mes cartes";
    $("gSub").textContent = `${games.length} carte${games.length > 1 ? "s" : ""}`;
    if (!games.length) body.innerHTML = `<div class="empty">Aucune carte pour l'instant. Ajoute la première avec le bouton ci-dessous.</div>`;
    for (const g of games) {
      const row = document.createElement("div"); row.className = "grow";
      const b = document.createElement("button");
      b.type = "button"; b.className = "game"; b.setAttribute("aria-current", g.id === gameId ? "true" : "false");
      b.innerHTML = `<span class="thumb"></span><span class="t"><b></b><span>${g.id === gameId ? "Carte affichée" : "Ouvrir"}</span></span>`;
      b.querySelector("b").textContent = g.name;
      const th = b.querySelector(".thumb");
      signedUrl(g.image_path).then(u => { th.style.backgroundImage = `url("${u}")`; }).catch(() => {});
      b.onclick = () => { selectGame(g.id); $("games").hidden = true; };
      row.appendChild(b);
      const e = document.createElement("button");
      e.type = "button"; e.className = "ibtn"; e.setAttribute("aria-label", "Modifier " + g.name); e.innerHTML = PENCIL;
      e.onclick = () => { gView = {mode:"edit", id:g.id}; pendingFile = null; renderGames(); };
      row.appendChild(e);
      body.appendChild(row);
    }
    act.innerHTML = `<button class="btn primary" type="button" id="gNew">Ajouter une carte</button>`;
    $("gNew").onclick = () => { gView = {mode:"new"}; pendingFile = null; renderGames(); };
    return;
  }
  const g = gView.mode === "edit" ? games.find(x => x.id === gView.id) : null;
  if (gView.mode === "edit" && !g) { gView = {mode:"list"}; renderGames(); return; }
  $("gTitle").textContent = g ? "Modifier la carte" : "Nouvelle carte";
  $("gSub").textContent = g ? g.name : "";
  body.innerHTML = `
    ${games.length ? `<button class="back" type="button" id="gBack">← Toutes les cartes</button>` : ""}
    <label class="lbl" for="gName">Nom du jeu</label>
    <input type="text" id="gName" maxlength="60" placeholder="Ex. : GTA 6">
    <span class="lbl">Image de la carte</span>
    <div class="pick"><button class="btn" type="button" id="gPick">${g ? "Remplacer l'image" : "Choisir une image"}</button><span id="gFile"></span></div>
    <div class="meta">${g ? "Les marqueurs gardent leur place si la nouvelle image a le même cadrage." : "JPEG, PNG ou WebP. Une image trop lourde est recompressée automatiquement. La carte reçoit 8 types de marqueurs de départ, que tu peux modifier."}</div>`;
  $("gName").value = g ? g.name : "";
  $("gFile").textContent = pendingFile ? pendingFile.name : (g ? "Image actuelle conservée" : "Aucune image choisie");
  if ($("gBack")) $("gBack").onclick = () => { gView = {mode:"list"}; pendingFile = null; renderGames(); };
  $("gPick").onclick = () => $("file").click();
  act.innerHTML = `<button class="btn primary" type="button" id="gSave">${g ? "Enregistrer" : "Créer la carte"}</button>` +
    (g ? `<button class="btn danger" type="button" id="gDel">Supprimer</button>` : "");
  $("gSave").onclick = () => g ? saveGame(g) : createGame();
  if (g) $("gDel").onclick = e => {
    const b = e.currentTarget;
    if (!b.classList.contains("armed")) { b.classList.add("armed"); b.textContent = "Confirmer : tout supprimer"; return; }
    deleteGame(g);
  };
}
$("file").onchange = e => {
  pendingFile = e.target.files[0] || null; e.target.value = "";
  if ($("gFile")) $("gFile").textContent = pendingFile ? pendingFile.name : "Aucune image choisie";
};

async function createGame(){
  const name = $("gName").value.trim().slice(0, 60);
  if (!name) { toast("Donne un nom au jeu.", true); $("gName").focus(); return; }
  if (!pendingFile) { toast("Choisis l'image de la carte.", true); return; }
  busy("Envoi de la carte…");
  let path = null;
  try {
    path = await uploadImage(pendingFile);
    busy("Création de la carte…");
    const row = must(await sb.from("carnet_games").insert({name, image_path: path}).select("id").single());
    must(await sb.from("carnet_types").insert(DEFAULT_TYPES.map(([label, color, icon], i) => ({game_id: row.id, label, color, icon, sort: i}))));
    pendingFile = null; $("games").hidden = true;
    await loadGames(row.id);
    toast("Carte créée");
  } catch (e) {
    if (path) removeImage(path);
    fail(e, "La création de la carte a échoué. Réessaie.");
  } finally { busy(null); }
}
async function saveGame(g){
  const name = $("gName").value.trim().slice(0, 60);
  if (!name) { toast("Donne un nom au jeu.", true); return; }
  busy(pendingFile ? "Envoi de la nouvelle image…" : "Enregistrement…");
  try {
    const patch = {name};
    if (pendingFile) patch.image_path = await uploadImage(pendingFile);
    must(await sb.from("carnet_games").update(patch).eq("id", g.id));
    if (patch.image_path) removeImage(g.image_path);
    pendingFile = null; gView = {mode:"list"};
    await loadGames();
    renderGames();
    toast("Carte mise à jour");
  } catch (e) { fail(e); }
  finally { busy(null); }
}
async function deleteGame(g){
  busy("Suppression de la carte…");
  try {
    must(await sb.from("carnet_games").delete().eq("id", g.id));   // types et marqueurs supprimés en cascade
    removeImage(g.image_path);
    gView = {mode:"list"};
    if (gameId === g.id) gameId = null;
    await loadGames();
    renderGames();
    toast("Carte supprimée");
  } catch (e) { fail(e); }
  finally { busy(null); }
}

/* ---------- data loading ---------- */
function showSplash(txt, opts = {}){
  $("splash").hidden = false; $("splashTxt").textContent = txt;
  $("splashBtn").hidden = !opts.add;
  $("authForm").hidden = !opts.auth;
  $("resetForm").hidden = !opts.reset;
}
async function loadGames(prefer){
  const list = must(await sb.from("carnet_games").select("id,name,image_path,created_at").order("created_at"));
  games = list;
  setCloud("ok", "Sauvegardé");
  if (!games.length) {
    selectGame(null);
    showSplash("Ajoute la carte d'un jeu (image HD) pour commencer. Tes cartes et tes marqueurs sont stockés dans le cloud : tu les retrouves sur ton téléphone comme sur ton PC.", {add: true});
    return;
  }
  const saved = lsGet("carnet.game");
  const target = [prefer, gameId, saved].find(id => id && games.some(g => g.id === id)) || games[games.length - 1].id;
  if (target !== gameId) await selectGame(target);
  else { updateHeader(); loadImage(); }
}
let loadSeq = 0;
async function loadGameData(){
  if (!gameId) return;
  const id = gameId, seq = ++loadSeq;
  const [t, m] = await Promise.all([
    sb.from("carnet_types").select("id,label,color,icon,sort").eq("game_id", id),
    sb.from("carnet_markers").select("id,type_id,x,y,note,created_at").eq("game_id", id),
  ]);
  if (seq !== loadSeq || id !== gameId) return;
  types = must(t).map(r => ({id: r.id, label: r.label, color: okColor(r.color), icon: okIcon(r.icon), sort: Number(r.sort) || 0}));
  markers = must(m).map(r => ({id: r.id, type: r.type_id, x: r.x, y: r.y, note: r.note, createdAt: Date.parse(r.created_at) || 0}));
  if (ed && ed.mode === "edit" && !markers.some(x => x.id === ed.id)) closeEditor();
  setCloud("ok", "Sauvegardé");
  renderAll();
}
async function selectGame(id){
  if (id === gameId && id) { loadImage(); return; }
  gameId = id; lsSet("carnet.game", id || "");
  ed = null; tEd = null; info = null; movingId = null; $("editor").hidden = true; $("typeEd").hidden = true;
  types = []; markers = [];
  try { hidden = new Set(JSON.parse(lsGet("carnet.hidden." + id) || "[]")); } catch (e) { hidden = new Set(); }
  imgW = 0; img.removeAttribute("src"); pinsEl.innerHTML = "";
  updateHeader();
  if (!id) return;
  loadImage();
  try { await loadGameData(); } catch (e) { fail(e, "Impossible de charger les marqueurs."); }
}
function updateHeader(){
  const g = game();
  $("gameName").textContent = g ? g.name : "Mes cartes";
  $("listBtn").hidden = !g;
  $("zoom").hidden = !imgW;
  if (!$("games").hidden) renderGames();
}
let imgPath = null;
async function loadImage(){
  const g = game(); if (!g) return;
  if (imgPath === g.image_path && (imgW || img.getAttribute("src"))) return;
  imgPath = g.image_path;
  imgW = 0; $("zoom").hidden = true; $("hint").hidden = true;
  showSplash("Chargement de la carte « " + g.name + " »…");
  let src;
  try { src = await signedUrl(g.image_path); }
  catch (e) { showSplash("Impossible de charger l'image de cette carte. Ouvre « Mes cartes » pour la remplacer."); imgPath = null; return; }
  if (imgPath !== g.image_path) return;
  img.onload = () => {
    if (imgPath !== g.image_path) return;
    imgW = img.naturalWidth; imgH = img.naturalHeight;
    $("splash").hidden = true; $("zoom").hidden = false;
    fit(); renderAll(); showDefaultHint();
  };
  img.onerror = () => { imgPath = null; showSplash("Impossible de charger l'image de cette carte. Ouvre « Mes cartes » pour la remplacer."); };
  img.src = src;
}

/* ---------- live sync ---------- */
let channel = null, syncT = null;
function scheduleSync(what){
  clearTimeout(syncT);
  syncT = setTimeout(async () => {
    try { if (what === "games") await loadGames(); else await loadGameData(); }
    catch (e) { setCloud("err", "Synchro interrompue"); }
  }, 400);
}
function startRealtime(){
  if (channel) sb.removeChannel(channel);
  channel = sb.channel("carnet-" + user.id)
    .on("postgres_changes", {event: "*", schema: "public", table: "carnet_games"}, () => scheduleSync("games"))
    .on("postgres_changes", {event: "*", schema: "public", table: "carnet_types"}, () => scheduleSync("data"))
    .on("postgres_changes", {event: "*", schema: "public", table: "carnet_markers"}, () => scheduleSync("data"))
    .subscribe();
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && user) scheduleSync("games");
});

/* ---------- auth ---------- */
function showAuth(msg){
  if (!msg && !user && !$("authForm").hidden) return;   // déjà sur l'écran de connexion : garder le message affiché
  user = null; games = []; selectGame(null);
  $("games").hidden = true; closePanel();
  setCloud("", "Non connecté");
  showSplash(msg || "Connecte-toi pour retrouver tes cartes sur tous tes appareils.", {auth: true});
}
async function authSubmit(signup){
  const email = $("authEmail").value.trim(), password = $("authPass").value;
  $("authErr").textContent = "";
  if (!email || password.length < 6) { $("authErr").textContent = "Saisis ton e-mail et un mot de passe d'au moins 6 caractères."; return; }
  $("authIn").disabled = $("authUp").disabled = true;
  try {
    if (signup) {
      const {data, error} = await sb.auth.signUp({email, password, options: {emailRedirectTo: location.origin + location.pathname}});
      if (error) throw error;
      if (!data.session) $("authErr").textContent = "Compte créé. Clique sur le lien reçu par e-mail pour le confirmer, puis connecte-toi.";
    } else {
      const {error} = await sb.auth.signInWithPassword({email, password});
      if (error) throw error;
    }
  } catch (e) {
    const m = (e && e.message) || "";
    $("authErr").textContent = /Invalid login/i.test(m) ? "E-mail ou mot de passe incorrect."
      : /not confirmed/i.test(m) ? "Confirme d'abord ton e-mail avec le lien reçu."
      : /already registered/i.test(m) ? "Ce compte existe déjà : connecte-toi."
      : "Échec : " + m;
  } finally { $("authIn").disabled = $("authUp").disabled = false; }
}
const appUrl = () => location.origin + location.pathname;
function authMsg(text, ok){ const el = $("authErr"); el.textContent = text; el.className = "err" + (ok ? " ok" : ""); }

$("authForgot").onclick = async () => {
  const email = $("authEmail").value.trim();
  if (!email || !$("authEmail").checkValidity()) { authMsg("Saisis d'abord ton adresse e-mail ci-dessus."); $("authEmail").focus(); return; }
  const b = $("authForgot"); b.disabled = true;
  try {
    const {error} = await sb.auth.resetPasswordForEmail(email, {redirectTo: appUrl()});
    if (error) throw error;
    authMsg("Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d'être envoyé. Ouvre le lien qu'il contient.", true);
  } catch (e) {
    const m = (e && e.message) || "";
    authMsg(/rate limit|seconds/i.test(m) ? "Trop de demandes. Attends une minute puis réessaie." : "Échec de l'envoi : " + m);
  } finally { b.disabled = false; }
};

/* Retour depuis le lien « mot de passe oublié » */
let recovering = /type=recovery/.test(location.hash) || /type=recovery/.test(location.search);
function showReset(){
  recovering = true;
  $("games").hidden = true; closePanel();
  setCloud("", "Nouveau mot de passe");
  $("resetErr").textContent = ""; $("resetErr").className = "err";
  showSplash("Choisis ton nouveau mot de passe.", {reset: true});
  setTimeout(() => $("resetPass").focus(), 50);
}
$("resetForm").addEventListener("submit", async e => {
  e.preventDefault();
  const p1 = $("resetPass").value, p2 = $("resetPass2").value, err = $("resetErr");
  err.className = "err";
  if (p1.length < 6) { err.textContent = "Le mot de passe doit faire au moins 6 caractères."; return; }
  if (p1 !== p2) { err.textContent = "Les deux mots de passe ne correspondent pas."; return; }
  $("resetSave").disabled = true;
  try {
    const {data, error} = await sb.auth.updateUser({password: p1});
    if (error) throw error;
    recovering = false;
    history.replaceState(null, "", appUrl());
    $("resetPass").value = $("resetPass2").value = "";
    toast("Mot de passe modifié");
    user = null;
    await onSession({user: data.user});
  } catch (e2) {
    const m = (e2 && e2.message) || "";
    err.textContent = /different from the old/i.test(m) ? "Choisis un mot de passe différent de l'ancien."
      : /session|expired|JWT/i.test(m) ? "Le lien a expiré. Redemande un e-mail depuis « Mot de passe oublié ? »."
      : "Échec : " + m;
  } finally { $("resetSave").disabled = false; }
});

$("authForm").addEventListener("submit", e => { e.preventDefault(); authSubmit(false); });
$("authUp").onclick = () => authSubmit(true);
$("logout").onclick = async () => { await sb.auth.signOut(); };

async function onSession(session){
  const u = session && session.user;
  if (!u) { if (channel) { sb.removeChannel(channel); channel = null; } showAuth(); return; }
  if (user && user.id === u.id) return;
  user = u;
  showSplash("Chargement de tes cartes…");
  setCloud("", "Connexion…");
  try { await loadGames(); startRealtime(); }
  catch (e) {
    setCloud("err", "Cloud injoignable");
    const m = (e && e.message) || "";
    showSplash(/relation|does not exist|schema cache/i.test(m)
      ? "La base n'est pas encore prête : exécute le fichier supabase/schema.sql dans l'éditeur SQL de Supabase."
      : "Impossible de joindre le cloud. Vérifie ta connexion puis recharge la page.");
  }
}

/* ---------- boot ---------- */
function boot(){
  const cfg = window.CARNET_CONFIG || {};
  if (!window.supabase || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
    setCloud("err", "Non configuré");
    showSplash(!window.supabase
      ? "Impossible de charger la bibliothèque Supabase. Vérifie ta connexion puis recharge la page."
      : "Renseigne l'URL et la clé publique de ton projet Supabase dans le fichier config.js.");
    return;
  }
  sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {auth: {persistSession: true, autoRefreshToken: true}});
  sb.auth.onAuthStateChange((event, session) => {
    setTimeout(() => {
      if (event === "PASSWORD_RECOVERY" || (recovering && session)) { showReset(); return; }
      if (recovering && !session) {
        recovering = false;
        history.replaceState(null, "", appUrl());
        showAuth("Ce lien de réinitialisation n'est plus valide. Redemande un e-mail avec « Mot de passe oublié ? ».");
        return;
      }
      onSession(session);
    }, 0);
  });
}
boot();
})();
