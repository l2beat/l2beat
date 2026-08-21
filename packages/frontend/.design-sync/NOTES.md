# design-sync notes — @l2beat/frontend

## Shape: `package` (no Storybook anywhere in the monorepo)

`packages/frontend` is an **app**, not a published component library. There is no
`dist/` component entry, no `.d.ts` export tree, and no `package.json` `exports`.
Three things had to be built to make the converter work; all are durable and committed.

- **`.design-sync/entry.ts`** — the bundle entry, passed via `--entry`. Without it
  the converter falls into synth-entry mode and `export *`s **every `.tsx` under
  `src/`** (pages, server, tRPC) into one bundle. Keep this file in step with
  `src/components/core/`. Subparts (`DialogContent`, `SelectItem`, `SidebarGroup`…)
  ship in the bundle via `export *`; only the 23 names in `cfg.componentSrcMap` get
  cards and `.d.ts`.
- **`.design-sync/tailwind-entry.css`** — the `cssEntry` source. See "Stylesheet" below.
- **`.design-sync/fonts.css`** — generated from `src/ssr/head/fonts.ts`. The app
  injects `@font-face` at runtime (`src/ssr/head/FontStyles.tsx`), so there is no
  static sheet to point `extraFonts` at. 24 faces, 3 families (Roboto, Roboto Serif,
  Roboto Serif Ext) → `static/fonts/**`. **Regenerate if `fonts.ts` changes.**

## Stylesheet — the one thing that will silently break fidelity

Tailwind v4 only emits utilities it finds by scanning source. Compiling
`src/styles/globals.css` straight gives a sheet that covers **only classes the app
already uses** — so anything the design agent writes that the app never used
(`max-w-lg`, `grid-cols-3`, `shadow-lg`, `md:flex-row`) silently produces no CSS.
Caught during solo calibration: `w-[520px]` in a preview did nothing.

Fix: `.design-sync/tailwind-entry.css` imports `globals.css`, re-adds `@source` for
`src/` and `.design-sync/previews/`, and adds an `@source inline(...)` safelist built
from the real token names (147 colors, 41 text sizes, 13 font families) across the
standard utility space + `sm:/md:/lg:/xl:`, `hover:`, `dark:` variants. 306 KB → 1.6 MB.

Regenerate the compiled sheet before every build:

```sh
.ds-sync/node_modules/.bin/tailwindcss \
  -i .design-sync/tailwind-entry.css -o .design-sync/.cache/compiled.css
```

(`@tailwindcss/cli` is not a repo dep — install it into `.ds-sync/` at the repo's
pinned version, currently 4.1.11. `.design-sync/.cache/` is gitignored, so the
compiled sheet is rebuilt every sync; the *entry* is committed.)

**Arbitrary values (`w-[520px]`, `p-[13px]`) can never be safelisted** — infinite
space. Previews and agent-authored designs must use scale utilities.

## Authoring previews

- Import from `'@l2beat/frontend'` — esbuild shims it to `window.L2beat`.
- **Required `name` prop** (drives `useTracking`): `Tabs`, `Switch`, `Checkbox`,
  `RadioGroup`. Omitting it is a type error, not a render error, but pass it anyway.
- `Checkbox` renders its own `<label>` wrapper and takes `children` as the label text.
- Radix overlays render statically with `open modal={false}` (`modal` would trap focus
  and lock scroll in the capture).
- Overlay/portal components need `cfg.overrides.<Name> = {cardMode:"single", viewport:"WxH"}`
  or the fixed-position content escapes its grid cell. Already set for `Dialog`.
- `useTracking` needs no provider — it reads `window.op` defensively. No `cfg.provider`
  is required for this DS at all.

## Known render warns (triaged, expected — not new)

- `[TOKENS_MISSING]` — `--ecosystem-*`, `--stat-color`, `--circle-x/y/radius`,
  `--tablet-content-horizontal-padding`. All set at runtime via inline `style` by
  components outside the core set. Expected absent from a static sheet.
- `[FONT_MISSING] "Lora"` — **accepted, deliberate** (user decision, 2026-08-20).
  `globals.css` defines `--font-lora` but no Lora file ships anywhere in the repo
  and `src/ssr/head/fonts.ts` never loads it, so `font-lora` already falls back to
  generic serif on l2beat.com. Shipping a substitute would make designs diverge
  from production. Revisit only if the app starts serving Lora.
- `[RENDER_THIN] Sidebar` — **benign.** The grid measurement reports 0px because the
  desktop sidebar is `fixed inset-y-0`; the card renders correctly at its `single`
  1280x560 viewport (screenshot confirmed). Do not "fix" the preview.

## Real DS bugs found while authoring previews (not preview faults)

These render faithfully — the components themselves are at fault. Worth a repo fix:

- **`SheetContent` close button has no icon.** `SheetPrimitive.Close` contains only an
  `sr-only` span, so it renders as an empty button (a bare focus ring). Compare
  `DialogClose`, which correctly renders `<CloseIcon>`.
- **Carousel prev/next arrows both point up.** `CarouselPrevious`/`CarouselNext` pass
  `<ArrowIcon direction="left"|"right" />`, but `ArrowIcon` (`src/icons/Arrow.tsx`)
  takes no `direction` prop — it is a fixed up-chevron. `direction` is a valid SVG
  presentation attribute, so TypeScript accepts it silently and it has no effect.

## Preview gotchas worth keeping

- **`SelectLabel` throws outside `SelectGroup`** — it kills the whole portal, so the
  card renders blank with no visible error. Always wrap label + items in `SelectGroup`.
- **`Sidebar` needs a >=1200px card viewport.** It is `hidden ... lg:block`, and below
  `lg` `useBreakpoint()` renders the *closed* mobile Sheet — an empty card. Its
  override pins `1280x560`.
- **Carousel needs `viewportClassName="overflow-hidden"`** plus slide padding, since
  the arrows sit at `-left-12`/`-right-12`. Mirror
  `src/pages/interop/components/widgets/protocols/MobileCarouselWidget.tsx`.
- **Radix portal content captures fine**, but a story whose content escapes its grid
  cell needs `cardMode: single` (+ `primaryStory`); wide ones need `column`.

## Re-sync risks

- **`fonts.css` is generated, not live.** If `src/ssr/head/fonts.ts` gains a family or
  weight, `fonts.css` goes stale silently — regenerate it (snippet in git history of
  this file's first commit, or re-derive from `fonts.ts`).
- **`entry.ts` is a hand-maintained list.** A new file in `src/components/core/` does
  NOT appear automatically — add it to both `entry.ts` and `cfg.componentSrcMap`.
- **The safelist is a snapshot of token names.** New `--color-*` tokens in
  `globals.css` won't be safelisted until `tailwind-entry.css` is regenerated. The
  app's own usages still compile via `@source`; only agent-invented classes are affected.
- **`cssEntry` points into `.cache/`** (gitignored). A fresh clone must run the
  tailwind compile above *before* `package-build.mjs`, or the build fails on a
  missing `cssEntry`.
- **Tailwind version coupling.** The safelist syntax (`@source inline`, brace
  expansion) needs Tailwind ≥ 4.1. Repo pins 4.1.11.
- Only `src/components/core/` is synced. `src/components/core/chart/` (~25 Recharts
  pieces) and the app-level `src/components/*` were scoped out of the first sync.
