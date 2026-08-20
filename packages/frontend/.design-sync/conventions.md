## How to build with the L2BEAT design system

Tailwind CSS v4 with a **CSS-first theme**. There is no `tailwind.config.js` — every
token is a CSS custom property in the stylesheet, exposed as a normal Tailwind
utility. Style with these utility classes; do not invent a parallel palette.

### No provider needed

Components import and render standalone — there is no theme provider, and none of
them read app context. Two exceptions, both self-contained:

```jsx
<TooltipProvider>…</TooltipProvider>   {/* required around Tooltip */}
<SidebarProvider>…</SidebarProvider>   {/* required around Sidebar  */}
```

**Dark mode** is a class on an ancestor, not a media query: put `class="dark"` on
`<html>` or any wrapper and every token flips. Use `dark:` for one-off overrides.
Page backgrounds should be `bg-background`; body text `text-primary`.

### Colour — semantic tokens, not raw palette

Use these on `bg-`, `text-`, `border-`, `fill-`, `ring-`, and with `/opacity`
(`bg-brand/30`). They are the whole design language and they auto-flip in dark mode:

| Role | Tokens |
|---|---|
| Text | `primary` (body), `secondary` (muted), `primary-invert` (on brand/dark fills) |
| Brand | `brand` — L2BEAT purple, for primary actions and active states |
| Surfaces | `background` (page), `surface-primary` (cards/controls), `surface-secondary` (raised/track), `surface-tertiary` (selected/active) |
| Status | `positive`, `warning`, `negative`; tinted fills `surface-info`, `surface-warning`, `surface-negative` |
| Chrome | `divider` (all rules/borders), `icon-secondary`, `header-primary`, `header-secondary`, `overlay` |
| Links | `link`, `link-stroke` |
| Absolutes | `pure-white`, `pure-black` (do NOT flip with theme) |

A raw scale (`gray-*`, `purple-*`, `red-*`, `blue-*`…) also exists, but prefer the
semantic tokens above — raw colours don't respond to dark mode.

### Type — a named scale, not `text-sm` guesswork

The default Tailwind font-size scale is **reset** (`--text-*: initial`) and replaced.
Each name carries its own line-height, and heading/subtitle names also carry weight:

- `text-heading-{16,18,20,24,28,32,36,40,44,48,64}` — headings (bold built in)
- `text-subtitle-{10,11,12,14}` — labels, eyebrows, table headers (semibold built in)
- `text-paragraph-{12,13,14,15,16,18}` — body copy
- `text-label-value-{12,13,14,15,16,18,20,24}` — numeric/stat values
- Generic sizes still exist: `text-3xs` … `text-6xl` (`text-base` = 16px)

Fonts: `font-roboto` (default UI), `font-roboto-serif`, `font-roboto-serif-ext`,
`font-mono`. Avoid `font-lora` — the token exists but no Lora file ships, so it
falls back to generic serif.

**Breakpoints are custom**: `xs` 400, `sm` 550, `md` 768, `lg` 1200, `xl` 1440,
`2xl` 1920. `md:` is the main desktop switch.

### Constraints that will silently bite

- **Never use arbitrary values** (`w-[520px]`, `p-[13px]`, `text-[15px]`). The
  stylesheet is pre-compiled, so arbitrary classes produce **no CSS at all**. Use
  scale utilities (`w-full max-w-xl`, `p-4`, `text-paragraph-15`).
- Required `name` prop on `Tabs`, `Switch`, `Checkbox`, `RadioGroup` (analytics).
- `SelectLabel` must be inside `SelectGroup`, or Select throws and renders nothing.
- `Sidebar` only renders at `lg` (>=1200px) — below that it's the mobile sheet.

### Where the truth is

Read `_ds/<folder>/styles.css` and the `_ds_bundle.css` it imports for the full
token and utility set, and each component's `<Name>.prompt.md` / `<Name>.d.ts` for
its real API. The compiled stylesheet is authoritative over this summary.

### Idiomatic example

```jsx
<div className="rounded-lg bg-surface-primary p-6">
  <h3 className="text-heading-20 text-primary">Value secured</h3>
  <p className="pt-1 text-paragraph-14 text-secondary">
    Across all tracked rollups.
  </p>
  <HorizontalSeparator className="my-4" />
  <div className="flex items-center justify-between">
    <span className="text-label-value-20 text-primary">$42.1B</span>
    <Button variant="fill" size="sm">View breakdown</Button>
  </div>
</div>
```
