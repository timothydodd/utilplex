import { $ } from "./_helpers.js";

// Curated list of common zones — covers majors without overwhelming the UI.
const COMMON = [
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Europe/Moscow",
  "Africa/Cairo",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const ALL = (Intl.supportedValuesOf?.("timeZone") || COMMON).slice();
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const sourceZone = $("#opt-source-zone");
const sourceTime = $("#opt-source-time");
const liveBox = $("#opt-live");
const addBtn = document.querySelector('[data-action="add-zone"]');
const addSel = $("#opt-add-zone");
const grid = $("#tz-grid");

let zones = unique([localZone, "UTC", "Europe/London", "America/New_York", "Asia/Tokyo"]);

function unique(a) { return Array.from(new Set(a)); }

function fillSelect(el, list, selected) {
  el.innerHTML = list.map(z => `<option value="${z}"${z === selected ? " selected" : ""}>${z}</option>`).join("");
}

fillSelect(sourceZone, ALL, localZone);
fillSelect(addSel, ALL.filter(z => !zones.includes(z)), "");

function fmt(date, zone) {
  const time = new Intl.DateTimeFormat([], {
    timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(date);
  const day = new Intl.DateTimeFormat([], {
    timeZone: zone, weekday: "short", month: "short", day: "numeric",
  }).format(date);
  return { time, day };
}

function getReferenceDate() {
  if (liveBox.checked || !sourceTime.value) return new Date();
  // datetime-local has no zone — interpret in source zone, convert to UTC.
  const local = sourceTime.value;            // "2026-04-25T10:30"
  const zone = sourceZone.value;
  return parseInZone(local, zone);
}

// Convert "yyyy-MM-ddTHH:mm" interpreted in `zone` to a real Date.
// Compute the zone's offset at the candidate instant via Intl, then subtract.
function parseInZone(local, zone) {
  const [d, t] = local.split("T");
  const [Y, M, D] = d.split("-").map(Number);
  const [h, m]    = t.split(":").map(Number);
  const utcGuess = Date.UTC(Y, M - 1, D, h, m);
  const offset = zoneOffsetMinutes(new Date(utcGuess), zone);
  return new Date(utcGuess - offset * 60_000);
}

function zoneOffsetMinutes(date, zone) {
  const tz = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour12: false, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(date);
  const get = type => +tz.find(p => p.type === type).value;
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"),
                         get("hour") % 24, get("minute"), get("second"));
  return (asUtc - date.getTime()) / 60_000;
}

function render() {
  const ref = getReferenceDate();
  grid.innerHTML = zones.map(z => {
    const { time, day } = fmt(ref, z);
    return `<div class="tz-card" data-zone="${z}">
      <span class="tz-zone">${z}</span>
      <span class="tz-time">${time}</span>
      <span class="tz-date">${day}</span>
    </div>`;
  }).join("");
}

addBtn.addEventListener("click", () => {
  addSel.style.display = "inline-block";
  addSel.focus();
});
addSel.addEventListener("change", () => {
  const z = addSel.value;
  if (!z || zones.includes(z)) return;
  zones.push(z);
  fillSelect(addSel, ALL.filter(zz => !zones.includes(zz)), "");
  addSel.style.display = "none";
  render();
});
[sourceZone, sourceTime, liveBox].forEach(el => el.addEventListener("change", render));
sourceTime.addEventListener("input", () => { liveBox.checked = false; render(); });

// Default datetime-local input to "now" in the user's zone.
{
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  sourceTime.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

render();
setInterval(() => { if (liveBox.checked) render(); }, 1000);
