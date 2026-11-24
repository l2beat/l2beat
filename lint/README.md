# Lint rules of our own

Rules that Biome does not ship, written as [GritQL plugins](https://biomejs.dev/linter/plugins/). Each one replaces a rule that was prose in `AGENTS.md`, so a mistake fails `biome ci` instead of waiting for a reviewer to spot it.

| Rule | Runs in | What it rejects |
|---|---|---|
| `repositoryMockType` | packages that use the database | `mockObject<SomeRepository>(...)`. Type the mock as `Database['repo']` or `TokenDatabase['repo']`, so no repository class is exported only for tests. |
| `staticErrorMessage` | `backend`, `token-backend` (services whose errors go to Kibana) | `new Error(...)` whose message is a template with `${}` or a concatenation. Write a fixed message and put the values in `cause`: `new Error('HTTP error', { cause: { status } })`. A fixed message lets one exact match in Elasticsearch find every occurrence. |
| `utcDates` | `frontend` | Local-time date reads and formatting: `getDate()`, `toLocaleDateString()`, `Intl.DateTimeFormat` without `timeZone: 'UTC'`. |
| `warningGlyphColor` | `frontend` | The `fill-warning` class. Warning glyphs keep `fill-yellow-700 dark:fill-yellow-300`, as `packages/frontend/DESIGN.md` says. |
| `dotSeparator` | `frontend` | A plain space before a "·" separator in a string or JSX text. Use `DOT_SEPARATOR` from `~/utils/dotSeparator`, whose space does not break, so no wrapped line starts with "·". |

The rules match syntax and know no types. `staticErrorMessage` checks `new Error` only, so `assert(condition, message)` and error subclasses are not covered. `utcDates` leaves `toLocaleString()` alone, because numbers have it too. `dotSeparator` skips a "·" that is alone in its element, since wrapping there is up to the layout, and a "·" between two expressions with no text of its own (`{a} · {b}`).

## Adding a rule

1. Write `lint/<ruleName>.grit`. Make the message say what to write instead and why.
2. Add `"../../lint/<ruleName>.grit"` to `plugins` in the `biome.json` of each package it applies to.
3. Run `pnpm lint` and fix what it finds.
4. Delete the prose the rule replaces from `AGENTS.md`.

The rules are listed in each package and not in the root `biome.json`, because Biome 2.3 resolves an inherited plugin path against the package's folder, where the file does not exist.

To silence a rule in one place, say why: `// biome-ignore lint/plugin/<ruleName>: <reason>`.
