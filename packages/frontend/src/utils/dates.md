# Dates and times

Every date and time on the site is in UTC and uses one format. Build each one with the helpers in `dates.ts`, so the format lives in one place.

## Format

| What | Looks like | Use |
|---|---|---|
| Date | `3 Jun 2026` | `formatTimestamp(ts)`, `formatDate('2026-06-03')` |
| Exact time in React | `3 Jun 2026, 14:00 UTC` | `<UtcDateTime timestamp={ts} />` |
| Exact time in a string | `3 Jun 2026, 14:00 UTC` | `formatTimestamp(ts, { mode: 'datetime' })` |
| Time of day | `14:00 UTC` | `formatTimestamp(ts, { mode: 'time' })` |
| Range | `30 Jun — 2 Jul 2026` | `formatRange(from, to)` |
| Range within a day | `3 Jun 2026, 01:00 — 02:00 UTC` | `formatRange(from, to)` |
| Chart axis ticks | `3 Jun`, `Jun ‘26`, `2026` | `getXAxisProps` |

- Clock times are 24-hour and end with `UTC`.
- Name other zones by offset (`UTC+2`, `UTC-4`). An abbreviation like `CET` or `IST` can mean several zones.
- `<UtcDateTime>` adds the visitor's local time as a hover title after hydration. Use it for every exact moment rendered in React.

## Chart tooltips

The tooltip date follows what the point measures:

- **Snapshot** (value secured: the value at one moment): one date, `formatTimestamp(label)`. Use `mode: 'datetime'` for points within a day.
- **Bucket** (activity, costs, data posted, liveness, DA throughput: a sum or average over a period): the period as a range, `formatRange(label, label + UnixTime.periodToSeconds(resolution))`. A daily bucket reads `4 — 5 Jun 2026`. That range is intentional.

## Why UTC

- Daily data is bucketed by UTC day. In local time, a bucket would show the previous date anywhere west of UTC.
- Pages are rendered on the server and cached, so the HTML has to be the same for every visitor. Local time appears only after hydration.
- Screenshots people share read the same wherever they were taken.

## Code

- Read dates through UTC: `getUTCDate()`, `getUTCDay()`, `getUTCMonth()`, `toISOString()`, or `Intl.DateTimeFormat` with `timeZone: 'UTC'`. Local getters (`getDate()`, `toLocaleDateString()` without `timeZone`) show the previous day west of UTC and break hydration. The one local-time helper is `formatLocalDateTime`, and it runs only in the browser.
- Test time-zone-sensitive code under a zone west of UTC, with `withTimezone` in `dates.test.ts`. When `TZ` was unset, restore it with `Reflect.deleteProperty(process.env, 'TZ')`: assigning `undefined` stores the string `"undefined"`.

## Markdown pages

The markdown version of a page (`src/server/markdown`) writes `2024-08-01 12:00 UTC` with `formatUtcDateTime`. ISO order sorts and parses the same for every reader, so it keeps its own format.
