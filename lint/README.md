# Lint rules of our own

Rules that Biome does not ship, written as [GritQL plugins](https://biomejs.dev/linter/plugins/). Each one replaces a rule that was prose in `AGENTS.md`, so a mistake fails `biome ci` instead of waiting for a reviewer to spot it.

| Rule | Runs in | What it rejects |
|---|---|---|
| `repositoryMockType` | packages that use the database | `mockObject<SomeRepository>(...)`. Type the mock as `Database['repo']` or `TokenDatabase['repo']`, so no repository class is exported only for tests. |
| `staticErrorMessage` | `backend`, `token-backend` (services whose errors go to Kibana) | `new Error(...)` whose message is a template with `${}` or a concatenation. Write a fixed message and put the values in `cause`: `new Error('HTTP error', { cause: { status } })`. A fixed message lets one exact match in Elasticsearch find every occurrence. |
| `utcDates` | `frontend` | Local-time date reads and formatting: `getDate()`, `toLocaleDateString()`, `Intl.DateTimeFormat` without `timeZone: 'UTC'`. |

The rules match syntax and know no types. `staticErrorMessage` checks `new Error` only, so `assert(condition, message)` and error subclasses are not covered. `utcDates` leaves `toLocaleString()` alone, because numbers have it too.

## Comments

Code comments are banned, for the reasons in [ADR 1](../docs/adr/0001-decisions-live-in-adrs-not-comments.md). Grit cannot see comments, so this rule is a script, `noComments.mts`, which reads them with the oxc parser that ships in `rolldown`. It runs as `pnpm lint:comments` in the Typecheck job of CI.

It is a ratchet. `noComments.baseline.json` holds how many comments each file had when the rule landed, and the check fails when a file has more. When you delete comments, run `pnpm lint:comments --update` to lower the baseline, or the check fails until you do. `--update` never raises a count. `pnpm lint:comments --list <path>` prints every comment under a path. Comments that tools read, such as `biome-ignore` and `@ts-expect-error`, do not count.

To clear a package, run the `/delete-comment` skill (`.agents/skills/delete-comment`).

## Adding a rule

1. Write `lint/<ruleName>.grit`. Make the message say what to write instead and why.
2. Add `"../../lint/<ruleName>.grit"` to `plugins` in the `biome.json` of each package it applies to.
3. Run `pnpm lint` and fix what it finds.
4. Delete the prose the rule replaces from `AGENTS.md`.

The rules are listed in each package and not in the root `biome.json`, because Biome 2.3 resolves an inherited plugin path against the package's folder, where the file does not exist.

To silence a rule in one place, say why: `// biome-ignore lint/plugin/<ruleName>: <reason>`.
