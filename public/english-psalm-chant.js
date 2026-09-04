(() => {
  "use strict";

  const CHANT_LANGUAGE = "Cantilenae-English";
  const HALF_VERSE = '<v>\\greheightstar</v>(:)';
  const PSALM_HEADER = /(?:^|\n)user-notes:\s*Psalm\b/im;
  const HEADER_END = "%%";
  const MUSICAL_GROUP = /^([a-mA-M][a-zA-Z0-9+~<>/\\\-.'`]*)(?:\[[^\]]*\])?$/;

  function decodedGabc(element) {
    return (element?.innerHTML || "")
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&amp;/g, "&");
  }

  function currentLanguage() {
    return document.querySelector("#languageSelect")?.value
      || new URLSearchParams(location.search).get("lang")
      || "English";
  }

  function headerValue(source, key) {
    const header = source.split(HEADER_END, 1)[0] || "";
    const match = header.match(new RegExp(`(?:^|\\n)${key}:\\s*([^;\\n]+)`, "i"));
    return match?.[1]?.trim() || "";
  }

  function splitSource(source) {
    const marker = source.indexOf(HEADER_END);
    if (marker < 0) return null;
    return {
      header: source.slice(0, marker + HEADER_END.length),
      body: source.slice(marker + HEADER_END.length).trim(),
    };
  }

  function findGabcElement(source) {
    const exact = [...document.querySelectorAll(".GABC")]
      .find((element) => decodedGabc(element).trim() === source.trim());
    if (exact) return exact;

    const name = headerValue(source, "name");
    if (!name) return null;
    return [...document.querySelectorAll(".GABC")]
      .find((element) => headerValue(decodedGabc(element), "name") === name) || null;
  }

  function siblingEnglishCell(gabcElement) {
    const cell = gabcElement?.closest("td, th");
    const row = cell?.closest("tr");
    if (!cell || !row) return null;

    const cells = [...row.children].filter((node) => ["TD", "TH"].includes(node.nodeName));
    const index = cells.indexOf(cell);
    if (index < 0) return null;
    return cells[index + 1] || null;
  }

  function cleanEnglishLine(line) {
    return line
      .replace(/\u00a0/g, " ")
      .replace(/^\s*(?:Psalm\s+\d+[.:]?\s*)/i, "")
      .replace(/^\s*\d{1,3}:\d+[a-z]?\s+/i, "")
      .replace(/^\s*\d+[a-z]?[.)]\s+/i, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function englishPsalmLines(cell, expectedCount) {
    if (!cell || expectedCount < 1) return null;

    const lines = (cell.innerText || cell.textContent || "")
      .split(/\n+/)
      .map(cleanEnglishLine)
      .filter(Boolean)
      .filter((line) => line.includes("*"))
      .filter((line) => !/^(?:Ant\.|Antiphon|Psalm(?:us)?\b|Canticle\b)/i.test(line));

    if (lines.length < expectedCount) return null;

    // The Psalm row should normally contain exactly the Psalm verses. If an
    // upstream rubric happens to contribute another starred line, use the
    // first contiguous Psalm-sized block rather than failing the whole score.
    return lines.slice(0, expectedCount);
  }

  function stripMarkup(text) {
    return text
      .replace(/<v>[^<]*<\/v>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function noteGroups(half) {
    return [...half.matchAll(/\(([^()]*)\)/g)]
      .map((match) => match[1].trim())
      .filter((group) => group && !/^[cf][1-4]$/i.test(group))
      .filter((group) => !/^[:;,.]+$/.test(group));
  }

  function normalizedGroup(group) {
    return group
      .replace(/\[[^\]]*\]/g, "")
      .replace(/[._'`]/g, "")
      .trim();
  }

  function chooseRecitingGroup(groups) {
    const counts = new Map();
    const originals = new Map();

    for (const group of groups) {
      const normalized = normalizedGroup(group);
      if (!MUSICAL_GROUP.test(normalized)) continue;
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
      if (!originals.has(normalized)) originals.set(normalized, group);
    }

    let best = "";
    let bestCount = 0;
    for (const [group, count] of counts) {
      if (count > bestCount) {
        best = group;
        bestCount = count;
      }
    }

    return originals.get(best) || groups[Math.floor(groups.length / 2)] || "g";
  }

  function toneTemplate(half) {
    const groups = noteGroups(half);
    if (!groups.length) return null;

    const reciting = chooseRecitingGroup(groups);
    const recitingNormalized = normalizedGroup(reciting);

    let longestStart = 0;
    let longestLength = 0;
    let currentStart = 0;
    let currentLength = 0;

    for (let index = 0; index <= groups.length; index += 1) {
      const isReciting = index < groups.length
        && normalizedGroup(groups[index]) === recitingNormalized;

      if (isReciting) {
        if (!currentLength) currentStart = index;
        currentLength += 1;
      } else {
        if (currentLength > longestLength) {
          longestStart = currentStart;
          longestLength = currentLength;
        }
        currentLength = 0;
      }
    }

    if (!longestLength) {
      longestStart = 0;
      longestLength = Math.max(1, groups.length - 3);
    }

    const cadenceStart = longestStart + longestLength;
    let cadence = groups.slice(cadenceStart);
    if (!cadence.length && groups.length > 1) cadence = groups.slice(-1);

    return {
      reciting,
      intonation: groups.slice(0, longestStart),
      cadence,
    };
  }

  function isVowel(character) {
    return /[aeiouy]/i.test(character);
  }

  function syllabifyWord(rawWord) {
    const match = rawWord.match(/^([^A-Za-zÀ-ÖØ-öø-ÿ]*)([A-Za-zÀ-ÖØ-öø-ÿ'’\-]+)([^A-Za-zÀ-ÖØ-öø-ÿ]*)$/);
    if (!match) return [{ text: rawWord, wordEnd: true }];

    const [, leading, core, trailing] = match;
    const plain = core.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const nuclei = [];

    for (let index = 0; index < plain.length; index += 1) {
      if (!isVowel(plain[index])) continue;
      const start = index;
      while (index + 1 < plain.length && isVowel(plain[index + 1])) index += 1;
      nuclei.push({ start, end: index + 1 });
    }

    if (
      nuclei.length > 1
      && /e$/i.test(plain)
      && !/(?:le|ye)$/i.test(plain)
      && nuclei.at(-1).start === plain.length - 1
    ) {
      nuclei.pop();
    }

    if (nuclei.length <= 1) {
      return [{ text: `${leading}${core}${trailing}`, wordEnd: true }];
    }

    const boundaries = [];
    for (let index = 0; index < nuclei.length - 1; index += 1) {
      const left = nuclei[index];
      const right = nuclei[index + 1];
      const consonants = plain.slice(left.end, right.start);
      if (!consonants.length) boundaries.push(right.start);
      else if (consonants.length === 1) boundaries.push(left.end);
      else boundaries.push(right.start - 1);
    }

    const pieces = [];
    let start = 0;
    for (const boundary of boundaries) {
      if (boundary <= start) continue;
      pieces.push(core.slice(start, boundary));
      start = boundary;
    }
    pieces.push(core.slice(start));

    return pieces
      .filter(Boolean)
      .map((piece, index) => ({
        text: `${index === 0 ? leading : ""}${piece}${index === pieces.length - 1 ? trailing : ""}`,
        wordEnd: index === pieces.length - 1,
      }));
  }

  function syllabifyPhrase(phrase) {
    const words = phrase.trim().split(/\s+/).filter(Boolean);
    const syllables = [];

    words.forEach((word, wordIndex) => {
      const wordSyllables = syllabifyWord(word);
      wordSyllables.forEach((syllable, syllableIndex) => {
        syllables.push({
          ...syllable,
          wordStart: syllableIndex === 0,
          phraseStart: wordIndex === 0 && syllableIndex === 0,
        });
      });
    });

    return syllables;
  }

  function safeLyric(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/[()]/g, "");
  }

  function notesForSyllables(count, template, useIntonation) {
    if (count < 1) return [];

    let intonation = useIntonation ? [...template.intonation] : [];
    let cadence = [...template.cadence];

    if (cadence.length > count) cadence = cadence.slice(-count);
    const afterCadence = count - cadence.length;
    if (intonation.length > afterCadence) intonation = intonation.slice(0, afterCadence);

    const recitingCount = Math.max(0, count - intonation.length - cadence.length);
    return [
      ...intonation,
      ...Array(recitingCount).fill(template.reciting),
      ...cadence,
    ];
  }

  function composeHalf(phrase, template, useIntonation = false) {
    const syllables = syllabifyPhrase(stripMarkup(phrase));
    if (!syllables.length || !template) return null;

    const notes = notesForSyllables(syllables.length, template, useIntonation);
    if (notes.length !== syllables.length) return null;

    return syllables.map((syllable, index) => {
      const separator = syllable.wordStart && !syllable.phraseStart ? " " : "";
      return `${separator}${safeLyric(syllable.text)}(${notes[index]})`;
    }).join("");
  }

  function splitLatinVerse(line) {
    const marker = line.indexOf(HALF_VERSE);
    if (marker < 0) return null;

    let first = line.slice(0, marker).trim();
    const second = line.slice(marker + HALF_VERSE.length).trim();
    const clef = first.match(/^\s*(\([cf][1-4]\))/i)?.[1] || "";
    if (clef) first = first.slice(first.indexOf(clef) + clef.length).trim();

    const label = first.match(/^\s*(\d+[a-z]?[.)])\s*/i)?.[1] || "";
    if (label) first = first.replace(/^\s*\d+[a-z]?[.)]\s*/i, "");

    return {
      clef,
      label,
      first,
      second: second.replace(/\s*\(::\)\s*$/, "").trim(),
    };
  }

  function splitEnglishVerse(line) {
    const halves = line.split(/\s*\*\s*/, 2);
    if (halves.length !== 2) return null;
    return { first: halves[0].trim(), second: halves[1].trim() };
  }

  function buildEnglishPsalmGabc(source, englishCell) {
    if (!PSALM_HEADER.test(source)) return null;
    const split = splitSource(source);
    if (!split) return null;

    const latinLines = split.body
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.includes(HALF_VERSE));

    if (!latinLines.length) return null;
    const englishLines = englishPsalmLines(englishCell, latinLines.length);
    if (!englishLines) return null;

    const rendered = [];
    let firstTone = null;
    let secondTone = null;

    for (let index = 0; index < latinLines.length; index += 1) {
      const latin = splitLatinVerse(latinLines[index]);
      const english = splitEnglishVerse(englishLines[index]);
      if (!latin || !english) return null;

      const firstTemplate = toneTemplate(latin.first);
      const secondTemplate = toneTemplate(latin.second);
      if (!firstTemplate || !secondTemplate) return null;

      if (!firstTone) firstTone = firstTemplate;
      if (!secondTone) secondTone = secondTemplate;

      const first = composeHalf(english.first, firstTemplate, index === 0);
      const second = composeHalf(english.second, secondTemplate, false);
      if (!first || !second) return null;

      const label = index === 0 ? "" : `${latin.label || `${index + 1}.`} `;
      const clef = index === 0 ? (latin.clef || "(c4)") : "";
      rendered.push(`${label}${clef}${first} ${HALF_VERSE} ${second} (::)`);
    }

    if (firstTone && secondTone) {
      const gloria = [
        ["Glory be to the Father, and to the Son,", "and to the Holy Ghost."],
        ["As it was in the beginning, is now, and ever shall be,", "world without end. Amen."],
      ];

      for (const [firstText, secondText] of gloria) {
        const first = composeHalf(firstText, firstTone, false);
        const second = composeHalf(secondText, secondTone, false);
        if (first && second) rendered.push(`${first} ${HALF_VERSE} ${second} (::)`);
      }
    }

    const tone = headerValue(source, "annotation");
    const userNotes = headerValue(source, "user-notes");
    let header = split.header
      .replace(/centering-scheme:\s*latin\s*;/i, "centering-scheme: english;")
      .replace(/user-notes:\s*Psalm[^;]*;/i, `user-notes: ${userNotes || "Psalm"} · English;`);

    if (!/centering-scheme:/i.test(header)) {
      header = header.replace(HEADER_END, `centering-scheme: english;\n${HEADER_END}`);
    }

    return {
      gabc: `${header}\n${rendered.join("\n")}`,
      tone,
    };
  }

  function markEnglishPsalmRow(gabcElement, englishCell, tone) {
    const latinCell = gabcElement?.closest("td, th");
    const row = latinCell?.closest("tr");
    if (!latinCell || !row || !englishCell) return;

    const cells = [...row.children].filter((node) => ["TD", "TH"].includes(node.nodeName));
    if (cells.length > 1) latinCell.colSpan = cells.length;
    englishCell.hidden = true;
    row.classList.add("english-psalm-chant-row");

    const chantContainer = document.getElementById(gabcElement.id.replace("GABC", "GCHANT"));
    if (!chantContainer || chantContainer.previousElementSibling?.classList.contains("english-psalm-chant-label")) return;

    const label = document.createElement("div");
    label.className = "english-psalm-chant-label";
    label.textContent = tone ? `English Psalm · Tone ${tone}` : "English Psalm";
    chantContainer.before(label);
  }

  function addStyles() {
    if (document.querySelector("#englishPsalmChantStyles")) return;
    const style = document.createElement("style");
    style.id = "englishPsalmChantStyles";
    style.textContent = `
      .english-psalm-chant-row > td:first-child {
        width: 100% !important;
      }
      .english-psalm-chant-row > td[hidden] {
        display: none !important;
      }
      .english-psalm-chant-label {
        margin: .15rem 0 .4rem;
        font-size: .82em;
        font-style: italic;
        opacity: .68;
      }
    `;
    document.head.append(style);
  }

  function install() {
    const createMappings = window.exsurge?.Gabc?.createMappingsFromSource;
    if (typeof createMappings !== "function" || createMappings.__englishPsalmChantPatched) return;

    addStyles();

    function patchedCreateMappings(context, source, ...rest) {
      if (currentLanguage() === CHANT_LANGUAGE && PSALM_HEADER.test(source)) {
        try {
          const gabcElement = findGabcElement(source);
          const englishCell = siblingEnglishCell(gabcElement);
          const adapted = buildEnglishPsalmGabc(source, englishCell);

          if (adapted?.gabc && gabcElement && englishCell) {
            markEnglishPsalmRow(gabcElement, englishCell, adapted.tone);
            return createMappings.call(this, context, adapted.gabc, ...rest);
          }
        } catch (error) {
          console.warn("English Psalm chant adaptation fell back to Latin.", error);
        }
      }

      return createMappings.call(this, context, source, ...rest);
    }

    patchedCreateMappings.__englishPsalmChantPatched = true;
    window.exsurge.Gabc.createMappingsFromSource = patchedCreateMappings;
  }

  install();
})();
