const HOURS = [
  ["Matutinum", "Matins", "Maitines"],
  ["Laudes", "Lauds", "Laudes"],
  ["Prima", "Prime", "Prima"],
  ["Tertia", "Terce", "Tercia"],
  ["Sexta", "Sext", "Sexta"],
  ["Nona", "None", "Nona"],
  ["Vesperae", "Vespers", "Vísperas"],
  ["Completorium", "Compline", "Completas"],
];

const LANGUAGES = new Set(["English", "Espanol", "Cantilenae-English"]);
const CHANT_LANGUAGE = "Cantilenae-English";

const SUPPLEMENTARY_PRAYERS = {
  ante: {
    title: { English: "Before the Divine Office", Espanol: "Antes del Oficio Divino" },
    latin: [
      "Apéri Dómine, os meum ad benedicéndum nomen sanctum tuum: munda quoque cor meum ab ómnibus vanis, pervérsis et aliénis cogitatiónibus; intelléctum illúmina, afféctum inflámma, ut digne, atténte ac devóte hoc Offícium recitáre váleam, et exaudíri mérear ante conspéctum divínæ Majestátis tuæ. Per Christum Dóminum nostrum. ℟. Amen.",
      "Dómine, in unióne illíus divínæ intentiónis, qua ipse in terris laudes Deo persolvísti, has tibi Horas (vel hanc tibi Horam) persólvo.",
    ],
    English: [
      "O Lord, open Thou my mouth that I may bless Thy Holy Name. Cleanse my heart from all vain, evil, and wandering thoughts; enlighten my understanding; kindle my affections, that I may pray to, and praise Thee with attention and devotion; and may worthily be heard before the presence of Thy Divine Majesty. Through Christ our Lord. Amen.",
      "Lord, in union with that Divine Intention wherewith Thou didst Thyself praise God, while Thou wast on earth, I offer these Hours (or this Hour) unto Thee.",
    ],
    Espanol: [
      "Abre, Señor, mi boca para bendecir tu santo nombre; limpia también mi corazón de todos los pensamientos vanos, perversos y ajenos; ilumina mi entendimiento, enciende mi afecto, para que pueda recitar digna, atenta y devotamente este Oficio, y merezca ser escuchado ante la presencia de tu divina Majestad. Por Cristo nuestro Señor. ℟. Amén.",
      "Señor, en unión con aquella divina intención con la que tú mismo, mientras estabas en la tierra, tributaste alabanzas a Dios, te ofrezco estas Horas (o esta Hora).",
    ],
  },
  post: {
    title: { English: "After the Divine Office", Espanol: "Después del Oficio Divino" },
    latin: [
      "Sacrosánctæ et indivíduæ Trinitáti, crucifíxi Dómini nostri Jesu Christi humanitáti, beatíssimæ et gloriosíssimæ sempérque Vírginis Maríæ fœcúndæ integritáti, et ómnium Sanctórum universitáti sit sempitérna laus, honor, virtus et glória ab omni creatúra, nobísque remíssio ómnium peccatórum, per infiníta sǽcula sæculórum. ℟. Amen.",
      "℣. Beáta víscera Maríæ Vírginis, quæ portavérunt ætérni Pátris Fílium.<br>℟. Et beáta úbera, quæ lactavérunt Christum Dóminum.<br>Pater noster.<br><br>Ave Maria.",
      "<em>Pius X concessit indulgentiam 300 dierum semel in die lucrandam iis, qui Orationem sequentem post Orationem Sacrosanctæ recitaverint; indulgentiam vero plenariam semel in mense lucrandam iis, qui istam Orationem cotidie per mensem recitaverint (2 Dec. 1905).</em>",
      "O clementíssime Jesu, grátias ago tibi ex toto corde meo. Propitius esto mihi vilíssimo peccatóri. Ego hanc actiónem óffero divíno Cordi tuo emendándam atque perficiéndam, ad laudem et glóriam sanctíssimi nóminis tui et beatíssimæ Matris tuæ, ad salútem ánimæ meæ totiúsque Ecclésiæ tuæ. Amen.",
    ],
    English: [
      "To the Most Holy and Undivided Trinity, to the Manhood of our Lord Jesus Christ Crucified, to the fruitful Virginity of the most blessed and most glorious Mary, always a Virgin, and to the holiness of all the Saints be ascribed everlasting praise, honour, and glory, by all creatures, and to us be granted the forgiveness of all our sins, world without end. Amen.",
      "℣. Blessed be the womb of the Virgin Mary which bore the Son of the Eternal Father.<br>℟. And blessed be the paps which gave suck to Christ our Lord.<br>Our Father…<br><br>Hail Mary…",
      "<em>Pius X granted an indulgence of 300 days to be gained once a day by those who recite the following prayer after the prayer Sacrosanctæ; and a plenary indulgence once a month to be gained by those who recite this prayer daily throughout the month (2 Dec. 1905).</em>",
      "O Most clement Jesus, I thank Thee with all my heart. Be propitious to me, a most vile sinner. I offer this action to Thy Divine Heart to be emended and perfected, to the praise and glory of Thy Most Holy Name and of Thy Most Blessed Mother, for the salvation of my soul and of Thy whole Church. Amen.",
    ],
    Espanol: [
      "A la sacrosanta e indivisa Trinidad, a la humanidad de nuestro Señor Jesucristo crucificado, a la fecunda integridad de la beatísima y gloriosísima siempre Virgen María, y a la universalidad de todos los Santos, sean dadas por toda criatura alabanza, honor, poder y gloria sempiternos, y a nosotros el perdón de todos nuestros pecados, por los infinitos siglos de los siglos. Amén.",
      "℣. Bienaventuradas las entrañas de la Virgen María, que llevaron al Hijo del Padre eterno.<br>℟. Y bienaventurados los pechos que amamantaron a Cristo nuestro Señor.<br>Padre nuestro…<br><br>Ave María…",
      "<em>Pío X concedió una indulgencia de 300 días, que podía ganarse una vez al día, a quienes recitaran la siguiente oración después de la oración Sacrosanctæ; y una indulgencia plenaria una vez al mes a quienes recitaran esta oración todos los días durante el mes (2 dic. 1905).</em>",
      "Oh clementísimo Jesús, te doy gracias de todo corazón. Sé propicio conmigo, vilísimo pecador. Ofrezco esta acción a tu divino Corazón para que sea corregida y perfeccionada, para alabanza y gloria de tu santísimo nombre y de tu beatísima Madre, para la salvación de mi alma y de toda tu Iglesia. Amén.",
    ],
  },
};

const els = {
  weekday: document.querySelector("#weekday"),
  displayDate: document.querySelector("#displayDate"),
  dateButton: document.querySelector("#dateButton"),
  datePicker: document.querySelector("#datePicker"),
  prevDay: document.querySelector("#prevDay"),
  nextDay: document.querySelector("#nextDay"),
  hourNav: document.querySelector("#hourNav"),
  matinsTools: document.querySelector("#matinsTools"),
  lessonsToggle: document.querySelector("#lessonsToggle"),
  anteToggle: document.querySelector("#anteToggle"),
  postToggle: document.querySelector("#postToggle"),
  anteToggleLabel: document.querySelector("#anteToggleLabel"),
  postToggleLabel: document.querySelector("#postToggleLabel"),
  antePrayer: document.querySelector("#antePrayer"),
  postPrayer: document.querySelector("#postPrayer"),
  versionSelect: document.querySelector("#versionSelect"),
  languageSelect: document.querySelector("#languageSelect"),
  fontDown: document.querySelector("#fontDown"),
  fontUp: document.querySelector("#fontUp"),
  status: document.querySelector("#status"),
  officeContent: document.querySelector("#officeContent"),
};

const params = new URLSearchParams(location.search);
const savedVersion = localStorage.getItem("officium.version") || "1954";
const savedHour = localStorage.getItem("officium.hour") || "Laudes";
const savedLanguage = localStorage.getItem("officium.language") || "English";
const savedSize = Number(localStorage.getItem("officium.fontSize")) || 18;

const state = {
  date: validIsoDate(params.get("date")) ? params.get("date") : todayIso(),
  hour: HOURS.some(([value]) => value === params.get("hour")) ? params.get("hour") : savedHour,
  version: ["1939", "1954", "1955", "1960"].includes(params.get("version"))
    ? params.get("version")
    : savedVersion,
  language: LANGUAGES.has(params.get("lang"))
    ? params.get("lang")
    : (LANGUAGES.has(savedLanguage) ? savedLanguage : "English"),
  fontSize: Math.min(24, Math.max(15, savedSize)),
  lessonsOnly: params.get("view") === "lessons",
  showAnte: localStorage.getItem("officium.showAnte") === "true",
  showPost: localStorage.getItem("officium.showPost") === "true",
  rawHtml: "",
  controller: null,
};

let chantLayouts = [];
let chantResizeFrame = null;

function todayIso() {
  return toIso(new Date());
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
  const locale = state.language === "Espanol" ? "es" : "en-US";
  els.weekday.textContent = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
  els.displayDate.textContent = new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function renderHours() {
  els.hourNav.replaceChildren();
  for (const [value, englishLabel, spanishLabel] of HOURS) {
    const label = state.language === "Espanol" ? spanishLabel : englishLabel;
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
      renderMatinsTools();
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

function normalizedText(nodes) {
  return nodes
    .map((node) => node.textContent || "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function splitCellIntoLines(cell) {
  const lines = [[]];
  for (const node of cell.childNodes) {
    if (node.nodeName === "BR") lines.push([]);
    else lines.at(-1).push(node);
  }
  return lines;
}

function lessonOnlyCell(cell) {
  const lines = splitCellIntoLines(cell);
  const start = lines.findIndex((line) => /^(Lectio|Reading|Lecci[oó]n)\s+\d+\b/i.test(normalizedText(line)));
  if (start < 0) return null;

  let end = lines.findIndex(
    (line, index) => index > start && /^℣\.\s*(Tu autem|But thou)\b/i.test(normalizedText(line)),
  );
  if (end < 0) end = lines.length;

  const extracted = cell.cloneNode(false);
  for (const [index, line] of lines.slice(start, end).entries()) {
    for (const node of line) extracted.append(node.cloneNode(true));
    if (index < end - start - 1) extracted.append(document.createElement("br"));
  }
  return extracted;
}

function extractMatinsLessons(doc) {
  const lessonsTable = document.createElement("table");
  const lessonsBody = document.createElement("tbody");
  let lessonCount = 0;

  for (const row of doc.querySelectorAll("table tr")) {
    const cells = [...row.children].filter((node) => ["TD", "TH"].includes(node.nodeName));
    const extractedCells = cells.map(lessonOnlyCell);
    if (!extractedCells.some(Boolean)) continue;

    const lessonRow = document.createElement("tr");
    for (const cell of extractedCells) {
      if (cell) lessonRow.append(cell);
    }
    lessonsBody.append(lessonRow);
    lessonCount += 1;
  }

  if (!lessonCount) return;

  lessonsTable.append(lessonsBody);
  const dayHeading = doc.body.querySelector(":scope > p")?.cloneNode(true);
  const hourHeading = doc.body.querySelector(":scope > h2")?.cloneNode(true);
  doc.body.replaceChildren();
  if (dayHeading) doc.body.append(dayHeading);
  if (hourHeading) {
    hourHeading.textContent = state.language === "Espanol" ? "Maitines · Lecciones" : "Matins · Lessons";
    doc.body.append(hourHeading);
  }
  doc.body.append(lessonsTable);
}

function cleanMarkup(markup, lessonsOnly = false) {
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

  if (lessonsOnly) extractMatinsLessons(doc);

  return doc.body.innerHTML;
}

function renderOneChant(layout, performLayout = false) {
  const { context, score, container } = layout;
  if (!container?.isConnected) return;

  const layoutLines = () => {
    if (!container.isConnected) return;
    const width = Math.max(1, container.clientWidth);
    score.layoutChantLines(context, width, () => {
      if (container.isConnected) container.innerHTML = score.createSvg(context);
    });
  };

  if (performLayout) score.performLayoutAsync(context, layoutLines);
  else layoutLines();
}

function renderChants() {
  chantLayouts = [];
  const gabcSources = [...els.officeContent.querySelectorAll(".GABC")];
  if (!gabcSources.length) return;

  const exsurge = window.exsurge;
  const getHeader = window.getHeader;
  if (!exsurge || typeof getHeader !== "function") {
    for (const gabcSource of gabcSources) {
      gabcSource.hidden = true;
      const chantContainer = document.getElementById(gabcSource.id.replace("GABC", "GCHANT"));
      if (chantContainer) chantContainer.textContent = "Cantilenæ notation could not be rendered.";
    }
    return;
  }

  for (const gabcSource of gabcSources) {
    const chantContainer = document.getElementById(gabcSource.id.replace("GABC", "GCHANT"));
    if (!chantContainer) continue;

    try {
      const context = new exsurge.ChantContext();
      context.lyricTextFont = "'Iowan Old Style', Palatino, Georgia, serif";
      context.lyricTextSize *= 1.2;
      context.spaceBetweenSystems = 0;
      context.dropCapTextFont = context.lyricTextFont;
      context.annotationTextFont = context.lyricTextFont;

      const source = gabcSource.innerHTML.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
      const header = getHeader(gabcSource.innerHTML);
      header["centering-scheme"] = "latin";
      const mapping = exsurge.Gabc.createMappingsFromSource(context, source);
      const useDropCap = header["initial-style"] !== "0";
      const score = new exsurge.ChantScore(context, mapping, useDropCap);
      if (useDropCap && header.annotation) {
        score.annotation = new exsurge.Annotation(context, header.annotation);
      }

      gabcSource.hidden = true;
      const layout = { context, score, container: chantContainer };
      chantLayouts.push(layout);
      renderOneChant(layout, true);
    } catch (error) {
      console.error("Unable to render Cantilenæ notation", error);
      gabcSource.hidden = true;
      chantContainer.textContent = "Cantilenæ notation could not be rendered.";
    }
  }
}

function renderOfficeContent() {
  chantLayouts = [];
  els.officeContent.classList.toggle("chant-mode", state.language === CHANT_LANGUAGE);
  els.officeContent.innerHTML = cleanMarkup(
    state.rawHtml,
    state.hour === "Matutinum" && state.lessonsOnly,
  );
  if (state.language === CHANT_LANGUAGE) renderChants();
  renderSupplementaryPrayers();
}

function supplementaryPrayerMarkup(prayer) {
  const language = state.language === "Espanol" ? "Espanol" : "English";
  const rows = prayer.latin.map((latin, index) => `
    <tr><td>${latin}</td><td>${prayer[language][index]}</td></tr>
  `).join("");
  return `<h2>${prayer.title[language]}</h2><table><tbody>${rows}</tbody></table>`;
}

function renderSupplementaryPrayers() {
  const spanish = state.language === "Espanol";
  els.anteToggleLabel.textContent = spanish ? "Ante Officium · Antes" : "Ante Officium";
  els.postToggleLabel.textContent = spanish ? "Post Officium · Después" : "Post Officium";
  els.anteToggle.checked = state.showAnte;
  els.postToggle.checked = state.showPost;
  els.antePrayer.hidden = !state.showAnte;
  els.postPrayer.hidden = !state.showPost;
  els.antePrayer.innerHTML = state.showAnte ? supplementaryPrayerMarkup(SUPPLEMENTARY_PRAYERS.ante) : "";
  els.postPrayer.innerHTML = state.showPost ? supplementaryPrayerMarkup(SUPPLEMENTARY_PRAYERS.post) : "";
}

function renderMatinsTools() {
  const isMatins = state.hour === "Matutinum";
  els.matinsTools.hidden = !isMatins;
  els.lessonsToggle.setAttribute("aria-pressed", String(isMatins && state.lessonsOnly));
  els.lessonsToggle.textContent = state.language === "Espanol"
    ? (state.lessonsOnly ? "Maitines completos" : "Solo lecciones")
    : (state.lessonsOnly ? "Full Matins" : "Lessons only");
}

function syncUrl() {
  const url = new URL(location.href);
  url.searchParams.set("date", state.date);
  url.searchParams.set("hour", state.hour);
  url.searchParams.set("version", state.version);
  url.searchParams.set("lang", state.language);
  if (state.hour === "Matutinum" && state.lessonsOnly) url.searchParams.set("view", "lessons");
  else url.searchParams.delete("view");
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
  setStatus(state.language === "Espanol" ? "Cargando el Oficio…" : "Loading the Office…");
  state.rawHtml = "";
  chantLayouts = [];
  els.officeContent.innerHTML = "";

  if (scrollTop) window.scrollTo({ top: 0, behavior: "auto" });

  const query = new URLSearchParams({
    date: state.date,
    hour: state.hour,
    version: state.version,
    lang: state.language,
  });

  try {
    const response = await fetch(`/api/office?${query}`, {
      signal: state.controller.signal,
      headers: { Accept: "application/json" },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);

    state.rawHtml = data.html;
    renderOfficeContent();
    setStatus("");
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error(error);
    setStatus(
      state.language === "Espanol"
        ? "No se pudo cargar el Oficio. Inténtalo de nuevo en un momento."
        : "The Office could not be loaded. Try again in a moment.",
      true,
    );
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

els.languageSelect.addEventListener("change", () => {
  state.language = els.languageSelect.value;
  localStorage.setItem("officium.language", state.language);
  renderDate();
  renderHours();
  renderMatinsTools();
  loadOffice(true);
});

els.lessonsToggle.addEventListener("click", () => {
  state.lessonsOnly = !state.lessonsOnly;
  renderMatinsTools();
  syncUrl();
  renderOfficeContent();
  window.scrollTo({ top: 0, behavior: "auto" });
});

els.anteToggle.addEventListener("change", () => {
  state.showAnte = els.anteToggle.checked;
  localStorage.setItem("officium.showAnte", String(state.showAnte));
  renderSupplementaryPrayers();
});

els.postToggle.addEventListener("change", () => {
  state.showPost = els.postToggle.checked;
  localStorage.setItem("officium.showPost", String(state.showPost));
  renderSupplementaryPrayers();
});

els.fontDown.addEventListener("click", () => {
  state.fontSize = Math.max(15, state.fontSize - 1);
  applyFontSize();
});

els.fontUp.addEventListener("click", () => {
  state.fontSize = Math.min(24, state.fontSize + 1);
  applyFontSize();
});

window.addEventListener("resize", () => {
  if (!chantLayouts.length) return;
  if (chantResizeFrame) cancelAnimationFrame(chantResizeFrame);
  chantResizeFrame = requestAnimationFrame(() => {
    chantResizeFrame = null;
    for (const layout of chantLayouts) renderOneChant(layout);
  });
});

els.datePicker.value = state.date;
els.versionSelect.value = state.version;
els.languageSelect.value = state.language;
applyFontSize();
renderHours();
renderMatinsTools();
renderSupplementaryPrayers();
loadOffice();
