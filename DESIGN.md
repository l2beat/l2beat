# ETHBEAT design rules

Rules for any agent or person building or changing ETHBEAT's UI (`packages/frontend`). Each rule comes from a correction by the design owner. The rules are fixed: they win over suggestions from reviewers and design councils, so put them in a council's brief as constraints. The reason is under each rule. A reason marked *inferred* hasn't been confirmed yet. The HTML comment holds the date and the owner's words.

## Color

- **Keep accent colour, with one role per colour:**
  - brand pink for primary actions and selected states, as solid `#ff3776` with white text;
  - brand-deep for editorial meta (dates, tags, breadcrumbs, hints);
  - link blue for links and info icons;
  - positive, warning and negative for status;
  - each category's own palette for identity tags.

  If a colour use fails contrast or clashes, restyle it with the role's token. Removing an accent, or neutralising it to grey or ink for "consistency", is off the table. So is toning down or recolouring the pink.
  Why: without its accents the site reads as grayscale and loses its identity. Reviewer models keep proposing "make it neutral", so this needs to be written down.
  <!-- 2026-11-14: "You removed a lot of colors from the page. Basically every accent color you removed. I do not like it. Its bad and the page looks like a grayscale. I want you to bring back the colors (if you didnt like them then maybe in a new form? better form?)" -->
  <!-- 2026-11-14: after eight softer directions, the owner kept solid pink with white text -->

- **Labels, keys, category names and table values (timestamps included) stay `text-primary`. Build hierarchy with size and weight.** Hints and footnotes that are already secondary on main can stay secondary.
  Why (*inferred*): grey keys read washed out. Reviewer models keep proposing "Stripe-style" muted keys, so this needs to be written down.
  <!-- 2026-11-02: "I do not like the muted text change" (rosette tooltip, reverted) -->
  <!-- 2026-11-16: "why grey out the timestamp?" (interop transfers table, reverted) -->

- **Rosette slice and chip colours stay exactly as on main, including when sentiment tokens change.**
  Why (*inferred*): readers learn risk from the rosette's colours, so they must mean the same everywhere.
  <!-- 2026-11-16: "rosette colours must not change" -->

- **Coloured badges keep main's fill, size and text colour:** transfer-type badges are white all-caps text on `bg-yellow-700` (Lock & Mint) and `bg-teal-500` (Burn & Mint); proof-system badges keep their coloured text. Contrast fixes that darken a fill, shrink a label or switch its text to ink are off the table.
  Why: the owner found the darker fills, the smaller label and the black badge text worse than main's.
  <!-- 2026-11-16: reverted the darker transfer-type fills and size: "got worse"; reverted black text on proof-system badges -->

- **Images shown on the site use the site palette: `#FFFFFF`, `#E6E7EC` (`--surface-secondary`) and `#CCD0DA` (`--divider`).** The brand kit's paper `#F5F3EE` and warm beige tints stay out.
  Why: paper is used nowhere on the site.
  <!-- 2026-11-03: "where did you get that stupid paper background from?" -->

## Type

- **Short labels that tag, categorise or name a period are all caps:**
  - eyebrows, and dates or meta kickers;
  - badges, pills and tags;
  - section breadcrumbs;
  - micro section labels ("ABOUT", "STATS");
  - table column headers, including change headers ("1D", "7D", "24H", "30D");
  - range buttons ("7D", "30D", "1Y", "MAX");
  - node labels in diagrams ("L2 BLOCK", "KEY REGISTRY"), with their tracking.

  Sentences, headings, action buttons and long strings use sentence case. Toggle options keep main's case (e.g. "Per L2 User Op", "Tx Data"). The period after a change ("−5.65% / 7d") is lower case; see Copy. Change case one label at a time, never as a site-wide sweep in either direction.
  Why: short all-caps labels are part of ETHBEAT's look. The owner accepts sentence case for some labels, not a blanket sweep.
  <!-- 2026-11-14: "you also remove all caps stuff - i do not know why, in some cases i get it, in some cases i dont. I like when some stuff on the page are all caps." -->
  <!-- 2026-11-16: owner's picks from the capitalisation review put range buttons, change headers, table headers and the native rollups diagram labels back in caps, and toggle options back to main's case -->

## Surfaces

- **Get emphasis from flat colour blocking and layout.** Bolt-on effects stay out of the UI and site graphics: glow, blur, emboss, halftone, decorative textures, outlines and echo rings.
  Why (*inferred*): effects read as cheap.
  <!-- 2026-10-22: "still ass, do something better with more taste" -->

## Layout

- **Status signals that summarise a section (anomaly banners, "No recent anomalies detected") stay at the top of their section, above charts, even in their all-good form.** Alignment and rhythm never justify moving them below a chart.
  Why: no one notices them below the chart.
  <!-- 2026-11-12: "ultra bad — no one is gonna notice this below the chart" -->

- **Prose inside cards spans the card: no `max-w-prose` and no `max-w-[<N>ch]` on research or markdown text.** Display headlines outside those components may still use `ch` caps. Publication articles are not cards: their text stays in the 720px column.
  Why: text should span the card like the tables and diagrams beside it, so each card has one right edge.
  <!-- 2026-11-12: "text should span the card like the tables and diagrams beside it" -->
  <!-- 2026-11-16: reverted a wider publication text column back to 720px -->

- **On phones, stacked cards and blocks are separated by a divider, with no grey gap between them.**
  Why (*inferred*): grey gaps break a phone page into islands.
  <!-- 2026-11-16: liquid staking at 375 and the L2 summary tabs: "remove the grey gaps … put a divider" -->

- **A single control over a centred chart or graph is centred on its axis. A toolbar of several controls is left-aligned. Legends under a left-aligned title stay left.**
  Why (*inferred*): a lone control belongs to the graph it sits on. A toolbar belongs to the section.
  <!-- 2026-11-13: owner's review of #13959 re-centred the lone chain selector over "Volume and flows" -->

## Components

- **A badge that identifies something across the site (e.g. the proof-system `TechStackTag`) stays its label wherever it's grouped.**
  Why: the badge marks the proof system in the summary, trusted setups and the ZK table, so a plain heading breaks recognition.
  <!-- 2026-11-13: owner's review of #13959, verifier groups -->

- **A time-window note like "Last 24h" is plain text, not a badge.**
  Why (*inferred*): it qualifies the figures beside it; a badge makes it read as a status.
  <!-- 2026-11-16: "didnt we agree on having the Last 24h as text and not badge?" -->

- **Article pages (research, advice, publications) may keep their own components, such as tabs styled for reading.** Unify them with the app's controls only when the owner asks.
  Why: an article reads differently from a dashboard.
  <!-- 2026-11-16: reverted the privacy advice tabs to their article style: "its article it can be different a lil bit" -->

## Tables

- **On phones, tables keep their columns, Stage included, and scroll sideways.**
  Why (*inferred*): phone readers compare projects too, and Stage is the column they compare most.
  <!-- 2026-11-16: PM feedback on #13972, passed on by the owner as a fix: "leave all columns shown (especially Stage)". Supersedes 2026-11-13, which hid activity's Type column below md. -->

## Charts

- **Chart axis labels are plain text, with no chip, halo, stroke or background behind them. On stacked charts, y labels stay inside the plot over the fills,** at the fills' current opacity rather than in a gutter.
  Why (*inferred*): boxes behind labels read as patches stuck onto the chart. The owner chose labels on fills over a gutter and over lighter fills.
  <!-- 2026-11-13: "things like this is not good … do not add this halo or backgrounds to y axis"; "keep current" on the stacked-label options -->

## Copy

- **A change shown with its period always reads "−5.65% / 7d": the change, then "/ period" in `text-secondary`.** Table column headers like "7D" are headings and stay as they are. Table cells give the period in a tooltip.
  Why: without the slash, "−5.65% 7d" reads as one unclear figure.
  <!-- 2026-11-13: "this is really unclear… a '/' between them would do the work" -->

- **When a list joined by " · " wraps, the separator ends the line, so no line starts with "·".** Join the separator to the item before it with a non-breaking space.
  Why: a line that starts with "·" reads as a stray bullet.
  <!-- 2026-11-16: "Phase 2 / · Circuit-specific" on trusted setups -->
