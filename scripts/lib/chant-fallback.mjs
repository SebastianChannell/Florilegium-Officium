export const MISSING_SCORE = /GABC score[^<]*not found/i;

// Keep DO's prayer text when upstream has no score for a particular section.
// Other sections retain their original notation and the translation is unchanged.
export function restoreMissingChantText(html, plainHtml) {
  return html.replace(/<TR\b[^>]*>[\s\S]*?<\/TR>/gi, row => {
    if (!MISSING_SCORE.test(row)) return row;
    const cells = [...row.matchAll(/<TD\b[^>]*>[\s\S]*?<\/TD>/gi)];
    const latin = cells[0]?.[0];
    const id = /\bID=['"]([^'"]+)['"]/i.exec(latin || "")?.[1];
    const plain = [...plainHtml.matchAll(/<TD\b[^>]*>[\s\S]*?<\/TD>/gi)]
      .find(match => /\bID=['"]([^'"]+)['"]/i.exec(match[0])?.[1] === id)?.[0];
    if (!id || !plain || MISSING_SCORE.test(plain)) throw new Error("Missing DO text for chant fallback");
    return row.replace(latin, plain);
  });
}
