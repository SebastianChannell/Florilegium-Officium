const HOURS = [
  ["Matutinum", "Matins"],
  ["Laudes", "Lauds"],
  ["Prima", "Prime"],
  ["Tertia", "Terce"],
  ["Sexta", "Sext"],
  ["Nona", "None"],
  ["Vesperae", "Vespers"],
  ["Completorium", "Compline"],
];

const els = {
  weekday: document.querySelector("#weekday"),
  displayDate: document.querySelector("#displayDate"),
  dateButton: document.querySelector("#dateButton"),
  datePicker: document.querySelector("#datePicker"),
  prevDay: document.querySelector("#prevDay"),
  nextDay: document.querySelector("#nextDay"),
  hourNav: document.querySelector("#hourNav"),
  versionSelect: document.querySelector("#versionSelect"),
  fontDown: document.querySelector("#fontDown"),
  fontUp: document.querySelector("#fontUp"),
  dayHeadline: document.querySelector("#dayHeadline"),
  status: document.querySelector("#status"),
  officeContent: document.querySelector("#officeContent"),
};

const params = new URLSearchParams(location.search);
const savedVersion = localStorage.getItem("officium.version") || "1954";
const savedHour = localStorage.getItem("officium.hour") || "Laudes";
const savedSize = Number(localStorage.getItem("officium.fontSize")) || 18;

const state = {
  date: validIsoDate(params.get("date")) ? params.get("date") : todayIso(),
  hour: HOURS.some(([value]) => value === params.get("hour")) ? params.get("hour") : savedHour,
  version: ["1939", "1954", "1955", "1960"].includes(params.get("version"))
    ? params.get("version")
    : savedVersion,
  fontSize: Math.min(24, Math.max(15, savedSize)),
  controller: null,
};

function todayIso() {
  const now = new Date();
  return toIso(now);
}

function toIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function validIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const date = localDate(value);
  return !Number.isNaN(date.getTime()) && toIso(date) === value;
}

function localDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function shiftDate(amount) {
  const date = localDate(state.date);
  date.setDate(date.getDate() + amount);
  state.date = toIso(date);
  els.datePicker.value = state.date;
  loadOffice(true);
}

function renderDate() {
  const date = localDate(state.date);
  els.weekday.textContent = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  els.displayDate.textContent = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function renderHours() {
  els.hourNav.replaceChildren();
  for (const [value, label] of HOURS) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.dataset.hour = value;
    if (value === state.hour) button.setAttribute("aria-current", "page");
    button.addEventListener("click", () => {
      if (state.hour === value) return;
      state.hour = value;
      localStorage.setItem("officium.hour", value);
      renderHours();
      loadOffice(true);
    });
    els.hourNav.append(button);
  }

  requestAnimationFrame(() => {
    els.hourNav.querySelector('[aria-current="page"]')?.scrollIntoView({
      block: "nearest",
      inline: "center",
    });
  });
}

function cleanMarkup(markup) {
  if (!markup) return "";
  const doc = new DOMParser().parseFromString(markup, "text/html");

  doc.querySelectorAll("script, style, link, iframe, object, embed, meta").forEach((node) => node.remove());
  doc.querySelectorAll("*").forEach((node) => {
    for (const attr of [...node.attributes]) {
      if (attr.name.toLowerCase().startsWith("on")) node.removeAttribute(attr.name);
    }
  });

  doc.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) link.removeAttribute("href");
  });

  return doc.body.innerHTML;
}

function syncUrl() {
  const url = new URL(location.href);
  url.searchParams.set("date", state.date);
  url.searchParams.set("hour", state.hour);
  url.searchParams.set("version", state.version);
  history.replaceState(null, "", url);
}

function setStatus(message, error = false) {
  els.status.textContent = message;
  els.status.classList.toggle("error", error);
  els.status.hidden = !message;
}

async function loadOffice(scrollTop = false) {
  state.controller?.abort();
  state.controller = new AbortController();

  renderDate();
  syncUrl();
  setStatus("Loading the Office…");
  els.dayHeadline.innerHTML = "";
  els.officeContent.innerHTML = "";

  if (scrollTop) window.scrollTo({ top: 0, behavior: "auto" });

  const query = new URLSearchParams({
    date: state.date,
    hour: state.hour,
    version: state.version,
  });

  try {
    const response = await fetch(`/api/office?${query}`, {
      signal: state.controller.signal,
      headers: { Accept: "application/json" },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);

    els.dayHeadline.innerHTML = cleanMarkup(data.headline);
    els.officeContent.innerHTML = cleanMarkup(data.html);
    setStatus("");
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error(error);
    setStatus("The Office could not be loaded. Try again in a moment.", true);
  }
}

function applyFontSize() {
  document.documentElement.style.setProperty("--reader-size", `${state.fontSize}px`);
  localStorage.setItem("officium.fontSize", String(state.fontSize));
}

els.prevDay.addEventListener("click", () => shiftDate(-1));
els.nextDay.addEventListener("click", () => shiftDate(1));
els.dateButton.addEventListener("click", () => {
  if (typeof els.datePicker.showPicker === "function") els.datePicker.showPicker();
  else els.datePicker.click();
});
els.datePicker.addEventListener("change", () => {
  if (!validIsoDate(els.datePicker.value)) return;
  state.date = els.datePicker.value;
  loadOffice(true);
});

els.versionSelect.addEventListener("change", () => {
  state.version = els.versionSelect.value;
  localStorage.setItem("officium.version", state.version);
  loadOffice(true);
});

els.fontDown.addEventListener("click", () => {
  state.fontSize = Math.max(15, state.fontSize - 1);
  applyFontSize();
});

els.fontUp.addEventListener("click", () => {
  state.fontSize = Math.min(24, state.fontSize + 1);
  applyFontSize();
});

els.datePicker.value = state.date;
els.versionSelect.value = state.version;
applyFontSize();
renderHours();
loadOffice();
