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

const LANGUAGES = new Set(["English", "Espanol", "Cantilenae-English", "Cantilenae-Sung", "Cantilenae-Ssung"]);
const CHANT_LANGUAGES = new Set(["Cantilenae-English", "Cantilenae-Sung", "Cantilenae-Ssung"]);

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

const CONFITEOR_PRAYERS = {
  title: { English: "Compline · Confiteor", Espanol: "Completas · Confiteor" },
  latin: [
    "<FONT COLOR=\"red\"><I>Confiteor</I></FONT><br>Confíteor Deo omnipoténti, beátæ Maríæ semper Vírgini, beáto Michaéli Archángelo, beáto Joánni Baptístæ, sanctis Apóstolis Petro et Paulo, et ómnibus Sanctis, quia peccávi nimis, cogitatióne, verbo et ópere: <FONT COLOR=\"red\"><I>(percutit sibi pectus)</I></FONT> mea culpa, mea culpa, mea máxima culpa. Ídeo precor beátam Maríam semper Vírginem, beátum Michaélem Archángelum, beátum Joánnem Baptístam, sanctos Apóstolos Petrum et Paulum, et omnes Sanctos, oráre pro me ad Dóminum Deum nostrum.",
    "<FONT COLOR=\"red\"><I>Misereatur nostri</I></FONT><br>Misereátur nostri omnípotens Deus, et dimíssis peccátis nostris, perdúcat nos ad vitam ætérnam. Amen.",
    "<FONT COLOR=\"red\"><I>Indulgentiam</I></FONT><br>Indulgéntiam, + absolutiónem et remissiónem peccatórum nostrórum tríbuat nobis omnípotens et miséricors Dóminus. Amen.",
  ],
  English: [
    "<FONT COLOR=\"red\"><I>Confiteor</I></FONT><br>I confess to almighty God, to blessed Mary ever Virgin, to blessed Michael the Archangel, to blessed John the Baptist, to the holy Apostles Peter and Paul, and to all the Saints, that I have sinned exceedingly in thought, word and deed: <FONT COLOR=\"red\"><I>(strikes his breast)</I></FONT> through my fault, through my fault, through my most grievous fault. Therefore I beseech blessed Mary ever Virgin, blessed Michael the Archangel, blessed John the Baptist, the holy Apostles Peter and Paul, and all the Saints, to pray for me to the Lord our God.",
    "<FONT COLOR=\"red\"><I>Misereatur nostri</I></FONT><br>May almighty God have mercy on us, forgive us our sins, and bring us to everlasting life. Amen.",
    "<FONT COLOR=\"red\"><I>Indulgentiam</I></FONT><br>May the almighty + and merciful Lord grant us pardon, absolution and remission of our sins. Amen.",
  ],
  Espanol: [
    "<FONT COLOR=\"red\"><I>Confiteor</I></FONT><br>Yo, pecador, me confieso a Dios todopoderoso, a la bienaventurada siempre Virgen María, al bienaventurado San Miguel Arcángel, al bienaventurado San Juan Bautista, a los bienaventurados apóstoles Pedro y Pablo, a todos los santos, que pequé gravemente con el pensamiento, palabra y obra: <FONT COLOR=\"red\"><I>(se golpea el pecho tres veces)</I></FONT> por mi culpa, por mi culpa, por mi grandísima culpa; por tanto, ruego a la bienaventurada siempre Virgen María, al bienaventurado San Miguel Arcángel, al bienaventurado San Juan Bautista, a los santos Apóstoles Pedro y Pablo, a todos los santos, que rueguen por mí a Dios, nuestro Señor.",
    "<FONT COLOR=\"red\"><I>Misereatur nostri</I></FONT><br>Dios todopoderoso tenga misericordia de nosotros, perdone nuestros pecados, y nos lleve a la vida eterna. Amén.",
    "<FONT COLOR=\"red\"><I>Indulgentiam</I></FONT><br>El Señor + todopoderoso, rico en misericordia, nos conceda la indulgencia, absolución y remisión de nuestros pecados. Amén.",
  ],
};

const els = {
  weekday: document.querySelector("#weekday"),
  displayDate: document.querySelector("#displayDate"),
  dateButton: document.querySelector("#dateButton"),
  dateControls: document.querySelector("#dateControls"),
  datePicker: document.querySelector("#datePicker"),
  prevDay: document.querySelector("#prevDay"),
  nextDay: document.querySelector("#nextDay"),
  hourNav: document.querySelector("#hourNav"),
  matinsTools: document.querySelector("#matinsTools"),
  lessonsToggle: document.querySelector("#lessonsToggle"),
  primeTools: document.querySelector("#primeTools"),
  martyrologyToggle: document.querySelector("#martyrologyToggle"),
  complineTools: document.querySelector("#complineTools"),
  confiteorToggle: document.querySelector("#confiteorToggle"),
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
const savedDateControlsExpanded = localStorage.getItem("officium.dateControlsExpanded") !== "false";

const state = {
  date: validIsoDate(params.get("date")) ? params.get("date") : todayIso(),
  hour: HOURS.some(([value]) => value === params.get("hour")) ? params.get("hour") : savedHour,
  version: ["1939", "1954", "1954-bvm", "1955", "1960"].includes(params.get("version"))
    ? params.get("version")
    : savedVersion,
  language: LANGUAGES.has(params.get("lang"))
    ? params.get("lang")
    : (LANGUAGES.has(savedLanguage) ? savedLanguage : "English"),
  fontSize: Math.min(24, Math.max(15, savedSize)),
  lessonsOnly: params.get("view") === "lessons",
  martyrologyOnly: params.get("view") === "martyrology",
  confiteorOnly: params.get("view") === "confiteor",
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
      state.lessonsOnly = false;
      state.martyrologyOnly = false;
      state.confiteorOnly = false;
      localStorage.setItem("officium.hour", value);
      renderHours();
      renderHourTools();
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

function extractPrimeMartyrology(doc) {
  const rows = [...doc.querySelectorAll("table tr")];
  const selected = [];
  let started = false;
  let sawPretiosa = false;

  for (const row of rows) {
    const text = normalizedText([row]);

    if (!started) {
      if (!/(Martyrologium|Martyrology|Martirologio)/i.test(text)) continue;
      started = true;
    } else if (/(De Officio Capituli|Office of the Chapter|Oficio del Capítulo)/i.test(text)) {
      break;
    }

    selected.push(row.cloneNode(true));

    if (/(Sancta María et omnes Sancti|Sancta Maria et omnes Sancti|Holy Mary and all the Saints|Santa María y todos los santos)/i.test(text)) {
      sawPretiosa = true;
    }

    if (sawPretiosa && /\bAm[eé]n\b/i.test(text)) break;
  }

  if (!selected.length) return;

  const table = document.createElement("table");
  const body = document.createElement("tbody");
  for (const row of selected) body.append(row);
  table.append(body);

  const heading = document.createElement("h2");
  heading.textContent = ["Espanol", "Cantilenae-Ssung"].includes(state.language)
    ? "Prima · Martirologio (1954)"
    : "Prime · Martyrologium (1954)";

  doc.body.replaceChildren(heading, table);
}

function cleanMarkup(markup, view = "") {
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

  if (view === "lessons") extractMatinsLessons(doc);
  if (view === "martyrology") extractPrimeMartyrology(doc);

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

function confiteorMarkup() {
  const language = ["Espanol", "Cantilenae-Ssung"].includes(state.language) ? "Espanol" : "English";
  const rows = CONFITEOR_PRAYERS.latin.map((latin, index) =>
    "<tr><td>" + latin + "</td><td>" + CONFITEOR_PRAYERS[language][index] + "</td></tr>"
  ).join("");
  return "<h2>" + CONFITEOR_PRAYERS.title[language] + "</h2><table><tbody>" + rows + "</tbody></table>";
}

function renderOfficeContent() {
  chantLayouts = [];
  els.officeContent.classList.toggle("chant-mode", CHANT_LANGUAGES.has(state.language));

  const view =
    state.hour === "Matutinum" && state.lessonsOnly ? "lessons"
      : state.hour === "Prima" && state.martyrologyOnly ? "martyrology"
        : "";

  els.officeContent.innerHTML = cleanMarkup(state.rawHtml, view);
  if (CHANT_LANGUAGES.has(state.language) && !view) renderChants();
  renderSupplementaryPrayers();
}

function supplementaryPrayerMarkup(prayer) {
  const language = ["Espanol", "Cantilenae-Ssung"].includes(state.language) ? "Espanol" : "English";
  const rows = prayer.latin.map((latin, index) => `
    <tr><td>${latin}</td><td>${prayer[language][index]}</td></tr>
  `).join("");
  return `<h2>${prayer.title[language]}</h2><table><tbody>${rows}</tbody></table>`;
}

function hasFocusedView() {
  return (
    (state.hour === "Matutinum" && state.lessonsOnly)
    || (state.hour === "Prima" && state.martyrologyOnly)
    || (state.hour === "Completorium" && state.confiteorOnly)
  );
}

function renderSupplementaryPrayers() {
  const spanish = ["Espanol", "Cantilenae-Ssung"].includes(state.language);
  const hideForFocusedView = hasFocusedView();
  els.anteToggleLabel.textContent = spanish ? "Ante Officium · Antes" : "Ante Officium";
  els.postToggleLabel.textContent = spanish ? "Post Officium · Después" : "Post Officium";
  els.anteToggle.checked = state.showAnte;
  els.postToggle.checked = state.showPost;
  els.antePrayer.hidden = hideForFocusedView || !state.showAnte;
  els.postPrayer.hidden = hideForFocusedView || !state.showPost;
  els.antePrayer.innerHTML = !hideForFocusedView && state.showAnte
    ? supplementaryPrayerMarkup(SUPPLEMENTARY_PRAYERS.ante)
    : "";
  els.postPrayer.innerHTML = !hideForFocusedView && state.showPost
    ? supplementaryPrayerMarkup(SUPPLEMENTARY_PRAYERS.post)
    : "";
}

function renderHourTools() {
  const spanish = ["Espanol", "Cantilenae-Ssung"].includes(state.language);
  const isMatins = state.hour === "Matutinum";
  const isPrime = state.hour === "Prima";
  const isCompline = state.hour === "Completorium";

  els.matinsTools.hidden = !isMatins;
  els.lessonsToggle.setAttribute("aria-pressed", String(isMatins && state.lessonsOnly));
  els.lessonsToggle.textContent = spanish
    ? (state.lessonsOnly ? "Maitines completos" : "Solo lecciones")
    : (state.lessonsOnly ? "Full Matins" : "Lessons only");

  els.primeTools.hidden = !isPrime;
  els.martyrologyToggle.setAttribute("aria-pressed", String(isPrime && state.martyrologyOnly));
  els.martyrologyToggle.textContent = spanish
    ? (state.martyrologyOnly ? "Prima completa" : "Martirologio")
    : (state.martyrologyOnly ? "Full Prime" : "Martyrologium");

  els.complineTools.hidden = !isCompline;
  els.confiteorToggle.setAttribute("aria-pressed", String(isCompline && state.confiteorOnly));
  els.confiteorToggle.textContent = spanish
    ? (state.confiteorOnly ? "Completas" : "Confiteor")
    : (state.confiteorOnly ? "Full Compline" : "Confiteor");
}

function syncUrl() {
  const url = new URL(location.href);
  url.searchParams.set("date", state.date);
  url.searchParams.set("hour", state.hour);
  url.searchParams.set("version", state.version);
  url.searchParams.set("lang", state.language);
  if (state.hour === "Matutinum" && state.lessonsOnly) url.searchParams.set("view", "lessons");
  else if (state.hour === "Prima" && state.martyrologyOnly) url.searchParams.set("view", "martyrology");
  else if (state.hour === "Completorium" && state.confiteorOnly) url.searchParams.set("view", "confiteor");
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

  if (state.hour === "Completorium" && state.confiteorOnly) {
    state.rawHtml = confiteorMarkup();
    renderOfficeContent();
    setStatus("");
    return;
  }

  const isMartyrology = state.hour === "Prima" && state.martyrologyOnly;
  const query = isMartyrology
    ? new URLSearchParams({ date: state.date, lang: state.language })
    : new URLSearchParams({
        date: state.date,
        hour: state.hour,
        version: state.version,
        lang: state.language,
      });

  try {
    const endpoint = isMartyrology ? "/api/martyrology" : "/api/office";
    const response = await fetch(`${endpoint}?${query}`, {
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

function setDateControlsExpanded(expanded) {
  els.dateButton.setAttribute("aria-expanded", String(expanded));
  els.dateControls.hidden = !expanded;
  localStorage.setItem("officium.dateControlsExpanded", String(expanded));
}

els.prevDay.addEventListener("click", () => shiftDate(-1));
els.nextDay.addEventListener("click", () => shiftDate(1));
els.dateButton.addEventListener("click", () => {
  setDateControlsExpanded(els.dateButton.getAttribute("aria-expanded") !== "true");
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
  renderHourTools();
  loadOffice(true);
});

els.lessonsToggle.addEventListener("click", () => {
  state.lessonsOnly = !state.lessonsOnly;
  state.martyrologyOnly = false;
  state.confiteorOnly = false;
  renderHourTools();
  syncUrl();
  renderOfficeContent();
  window.scrollTo({ top: 0, behavior: "auto" });
});

els.martyrologyToggle.addEventListener("click", () => {
  state.martyrologyOnly = !state.martyrologyOnly;
  state.lessonsOnly = false;
  state.confiteorOnly = false;
  renderHourTools();
  syncUrl();
  loadOffice(true);
});

els.confiteorToggle.addEventListener("click", () => {
  state.confiteorOnly = !state.confiteorOnly;
  state.lessonsOnly = false;
  state.martyrologyOnly = false;
  renderHourTools();
  syncUrl();
  loadOffice(true);
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
setDateControlsExpanded(savedDateControlsExpanded);
applyFontSize();
renderHours();
renderHourTools();
renderSupplementaryPrayers();
loadOffice();
