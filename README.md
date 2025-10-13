# Table → JSON Converter (Chrome Extension)

MV3 popup extension that converts a pasted spreadsheet table (TSV) into a JSON array.

## Dev

- Install pnpm if not present
- `pnpm install`
- `pnpm dev` → Vite dev server
- `pnpm build` → outputs `dist/`. In Chrome: Extensions → Developer mode → Load unpacked → select `dist/`.

## Rules

Columns (1-based):

1. title
2. region
3. nation
4. description
5. (ignored)
6. description_src (URL)
7. search_keywords (only letters/spaces/commas allowed; invalid rows are excluded and reported)
8. ignore_id (comma separated numbers)
9. preferred_id (comma separated numbers; `*` or empty → empty array)
10. gmap_url (URL)

Paste TSV from your spreadsheet; click Convert. Copy or Download JSON.
