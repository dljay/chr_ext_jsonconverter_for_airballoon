export type Converted = {
  id: string;
  tags: string[];
  regionTags: string;
  title: string;
  region: string;
  nation: string;
  description: string;
  description_src: string;
  search_keywords: string[];
  preferred_id: string[];
  ignore_id: string[];
  gmap_url: string;
  latitude: number;
  longitude: number;
  custom_imgs?: string[];
};

export type ParseResult = {
  ok: Converted[];
  warnings: string[];
  errors: string[];
};

const isHttpUrl = (s: string): boolean => /^https?:\/\//i.test(s.trim());
const splitCsvLike = (s: string): string[] =>
  s
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

const onlyAlphabetRegex = /^[A-Za-z ]+$/; // letters and space only

function validateKeywords(raw: string): { keywords: string[]; error?: string } {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === '"*"' || trimmed === "*") return { keywords: [] };
  if (!onlyAlphabetRegex.test(trimmed)) {
    // find first offending character
    const idx = [...trimmed].findIndex((ch) => !/[A-Za-z ]/.test(ch));
    const bad = idx >= 0 ? trimmed[idx] : "?";
    return { keywords: [], error: `9열 search keyword에 알파벳/공백 외 문자 발견: '${bad}'` };
  }
  const kws = splitCsvLike(trimmed.toLowerCase());
  return { keywords: kws };
}

function parseIds(raw: string): string[] {
  if (!raw || raw.trim() === "" || raw.trim() === "*" || raw.trim() === '"*"') return [""];
  // keep digits only tokens
  return splitCsvLike(raw)
    .map((tok) => tok.replace(/[^0-9]/g, ""))
    .filter((t) => t.length > 0);
}

function parseIgnoreIds(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "") return [""]; // empty string for blank values
  if (trimmed === "*" || trimmed === '"*"') return ["*"]; // "*" for explicit asterisk
  // keep digits only tokens, but preserve "*" if it's the only value
  const tokens = splitCsvLike(trimmed);
  return tokens.map((tok) => {
    const digits = tok.replace(/[^0-9]/g, "");
    return digits.length > 0 ? digits : tok; // keep original if no digits found
  });
}

function parseTags(raw: string): string[] {
  if (!raw || raw.trim() === "" || raw.trim() === "*" || raw.trim() === '"*"') return [];
  return splitCsvLike(raw);
}

function parseNumber(raw: string): number {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "") return 0;
  const num = parseFloat(trimmed);
  return isNaN(num) ? 0 : num;
}

export function parseTsv(input: string): ParseResult {
  const lines = input
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length > 0);
  const ok: Converted[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  lines.forEach((line, idx) => {
    const rowNum = idx + 1;
    const cells = line.split("\t").map((c) => c.trim());
    if (cells.length < 14) {
      warnings.push(`행 ${rowNum}: 컬럼 수(${cells.length})가 14보다 적음`);
    }

    // normalize to at least 14 elements
    while (cells.length < 14) cells.push("");

    const [id, tags_raw, regionTags, title, region, nation, description, description_src, search_kw_raw, preferred_raw, ignore_raw, gmap_url, latitude_raw, longitude_raw] = cells;

    if (!title) {
      warnings.push(`행 ${rowNum}: title 비어있음`);
    }

    if (description_src && !isHttpUrl(description_src)) {
      warnings.push(`행 ${rowNum}: description_src URL 형식 아님`);
    }

    if (gmap_url && !isHttpUrl(gmap_url)) {
      warnings.push(`행 ${rowNum}: gmap_url URL 형식 아님`);
    }

    const latitude = parseNumber(latitude_raw);
    const longitude = parseNumber(longitude_raw);

    const kwCheck = validateKeywords(search_kw_raw);
    if (kwCheck.error) {
      errors.push(`행 ${rowNum}: ${kwCheck.error}`);
      return; // exclude row by default
    }

    const record: Converted = {
      id,
      tags: parseTags(tags_raw),
      regionTags,
      title,
      region,
      nation,
      description,
      description_src,
      search_keywords: kwCheck.keywords,
      preferred_id: parseIds(preferred_raw),
      ignore_id: parseIgnoreIds(ignore_raw),
      gmap_url,
      latitude,
      longitude,
    };

    ok.push(record);
  });

  return { ok, warnings, errors };
}
