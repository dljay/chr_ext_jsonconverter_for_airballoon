# Table → JSON Converter (Chrome Extension)

MV3 popup extension that converts a pasted spreadsheet table (TSV) into a JSON array.

## Dev

- Install pnpm if not present
- `pnpm install`
- `pnpm dev` → Vite dev server
- `pnpm build` → outputs `dist/`. In Chrome: Extensions → Developer mode → Load unpacked → select `dist/`.

## Rules

Columns (1-based):

1. id
2. tags (comma separated strings)
3. regionTags
4. title
5. region
6. nation
7. description
8. (ignored)
9. description_src (URL)
10. search_keywords (only letters/spaces/commas allowed; invalid rows are excluded and reported)
11. preferred_id (comma separated numbers)
12. ignore_id (comma separated numbers; `*` or empty → empty array)
13. gmap_url (URL)

Paste TSV from your spreadsheet; click Convert. Copy or Download JSON.
