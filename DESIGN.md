# ETHBEAT design rules

Rules for any agent or person building or changing ETHBEAT's UI (`packages/frontend`). Each rule comes from a correction by the design owner. The reason is under each rule. A reason marked *inferred* hasn't been confirmed yet. The HTML comment holds the date and the owner's words.

Some rules have a check in `packages/frontend/src/designRules.test.ts`. That test runs with the frontend unit tests.

## Color

- **Keep accent colour. Never neutralise an accent (pink, brand-deep, link blue, status, category palettes) to grey or ink for "consistency". Make its use consistent instead, one role per colour:**
  - brand pink for primary actions and selected states;
  - brand-deep for editorial meta (dates, tags, breadcrumbs, hints);
  - link blue for links and info icons;
  - positive, warning and negative for status;
  - each category's own palette for identity tags.

  If a colour use fails contrast or clashes, restyle it with the role's token instead of removing it.
  Why: without its accents the site reads as grayscale and loses its identity. Reviewer models keep proposing "make it neutral", so this needs to be written down.
  <!-- 2026-11-14: "You removed a lot of colors from the page. Basically every accent color you removed. I do not like it. Its bad and the page looks like a grayscale. I want you to bring back the colors (if you didnt like them then maybe in a new form? better form?)" -->

- **Labels, keys and category names stay `text-primary`. Never grey them (`text-secondary`) to make values lead. Build hierarchy with size and weight.** Hints and footnotes that are already secondary can stay.
  Why (*inferred*): grey keys read washed out. Reviewer models keep proposing "Stripe-style" muted keys, so this needs to be written down.
  <!-- 2026-11-02: "I do not like the muted text change" (rosette tooltip, reverted) -->

- **Images shown on the site use the site palette: `#FFFFFF`, `#E6E7EC` (`--surface-secondary`) and `#CCD0DA` (`--divider`). Never use the brand kit's paper `#F5F3EE` or warm beige tints.** Checked by `designRules.test.ts`.
  Why: paper is used nowhere on the site.
  <!-- 2026-11-03: "where did you get that stupid paper background from?" -->

- **Coloured badges use white text on a fill dark enough for 4.5:1 contrast (e.g. Lock & Mint `#8a6700`, Burn & Mint `#1b7f75`), not dark text on a bright fill.**
  Why (*inferred*): one text colour stays readable in both themes.
  <!-- 2026-11-13: picked option A for the transfer-type badges -->

## Surfaces

- **No bolt-on effects anywhere in the UI or in site graphics: no glow, blur, emboss, halftone, decorative textures, outlines or echo rings. Get emphasis from flat colour blocking and layout.**
  Why (*inferred*): effects read as cheap.
  <!-- 2026-10-22: "still ass, do something better with more taste" -->

## Layout

- **Status signals that summarise a section (anomaly banners, "No recent anomalies detected") stay at the top of their section, above charts, even in their all-good form. Never move them below a chart for alignment or rhythm.**
  Why: no one notices them below the chart.
  <!-- 2026-11-12: "ultra bad — no one is gonna notice this below the chart" -->

- **Prose inside cards has no line-length cap: no `max-w-prose` and no `max-w-[<N>ch]` on research or markdown text. It spans the card.** Display headlines may still use `ch` caps. Checked by `designRules.test.ts` for `components/markdown` and `components/projects`.
  Why: text should span the card like the tables and diagrams beside it, so each card has one right edge.
  <!-- 2026-11-12: "text should span the card like the tables and diagrams beside it" -->

- **A single control over a centred chart or graph is centred on its axis. A toolbar of several controls is left-aligned. Legends under a left-aligned title stay left.**
  Why (*inferred*): a lone control belongs to the graph it sits on. A toolbar belongs to the section.
  <!-- 2026-11-13: owner's review of #13959 re-centred the lone chain selector over "Volume and flows" -->

## Components

- **A badge that identifies something across the site (e.g. the proof-system `TechStackTag`) stays its label wherever it's grouped. Don't replace it with a plain heading.**
  Why: the badge marks the proof system in the summary, trusted setups and the ZK table, so a plain heading breaks recognition.
  <!-- 2026-11-13: owner's review of #13959, verifier groups -->

## Tables

- **On phones, a table's main metric is visible without a sideways scroll. Descriptive columns (Type and similar) hide below `md` and stay available in the Columns menu.**
  Why (*inferred*): the number the page is about shouldn't need a sideways scroll.
  <!-- 2026-11-13: "yup its fine" (hiding activity's Type column on phones) -->

## Charts

- **Chart axis labels are plain text: never a chip, halo, stroke or background behind them. On stacked charts, y labels stay inside the plot over the fills. Don't move them to a gutter and don't lower the fill opacity to clear them.**
  Why (*inferred*): boxes behind labels read as patches stuck onto the chart. The owner chose labels on fills over a gutter and over lighter fills.
  <!-- 2026-11-13: "things like this is not good … do not add this halo or backgrounds to y axis"; "keep current" on the stacked-label options -->

## Copy

- **A change shown with its period always reads "−5.65% / 7d": the change, then "/ period" in `text-secondary`.** Table column headers like "Total 7d" are headings and stay as they are. Table cells give the period in a tooltip.
  Why: without the slash, "−5.65% 7d" reads as one unclear figure.
  <!-- 2026-11-13: "this is really unclear… a '/' between them would do the work" -->
