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
8. description_src (URL)
9. search_keywords (only letters/spaces/commas allowed; invalid rows are excluded and reported)
10. preferred_id (comma separated numbers)
11. ignore_id (comma separated numbers; `*` or empty → empty array)
12. gmap_url (URL)
13. latitude (number)
14. longitude (number)

Paste TSV from your spreadsheet; click Convert. Copy or Download JSON.
