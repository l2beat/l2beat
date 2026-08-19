/**
 * The badge a reviewed protocol puts on its own site.
 *
 * Emitted as HTML with inline styles rather than as an SVG file, for two
 * reasons: text in an SVG has to be laid out at fixed pixel widths, which
 * breaks the moment a visitor's font substitutes; and an `<img>` badge would
 * make their page depend on ours being up. This markup carries its own colours
 * and spacing, needs no stylesheet, survives a paste into a CMS, and renders
 * the same offline as online.
 *
 * Built as indented lines so the preview and the copy-paste block are the same
 * markup - one joined tight, one joined with newlines. What a protocol copies
 * is exactly what they saw.
 */

export type BadgeVariant = 'full' | 'compact' | 'mark'
export type BadgeTheme = 'light' | 'dark'

export interface BadgeOptions {
  variant: BadgeVariant
  theme: BadgeTheme
  /** Where the badge links. The protocol's garden page, ideally. */
  href: string
}

const PALETTE: Record<
  BadgeTheme,
  { bg: string; border: string; title: string; body: string; rule: string }
> = {
  light: {
    bg: '#ffffff',
    border: '#d8e3cd',
    title: '#16863f',
    body: '#5b6472',
    rule: '#e3e8ee',
  },
  dark: {
    bg: '#17181a',
    border: '#2c3a22',
    title: '#3fe07f',
    body: '#a2a8b3',
    rule: '#2a2d32',
  },
}

const FONT =
  "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

const TITLE = 'Reviewed under the CROPS framework by L2BEAT'

/** The sprout mark, at the given size and colour. */
function sprout(indent: string, size: number, color: string): string[] {
  return [
    `${indent}<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" style="flex:none;color:${color}" aria-hidden="true">`,
    `${indent}  <path d="M8 15V7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
    `${indent}  <path d="M8 8.4C4.9 8.4 2.6 6.3 2.2 3.2 5.6 2.9 8 5.1 8 8.4Z" fill="currentColor"/>`,
    `${indent}  <path d="M8 8.4c3.1 0 5.4-2.1 5.8-5.2C10.4 2.9 8 5.1 8 8.4Z" fill="currentColor" opacity=".75"/>`,
    `${indent}</svg>`,
  ]
}

function badgeLines({ variant, theme, href }: BadgeOptions): string[] {
  const c = PALETTE[theme]
  const shell = (padding: string, gap: string, radius: string) =>
    `display:inline-flex;align-items:center;gap:${gap};padding:${padding};` +
    `border:1px solid ${c.border};border-radius:${radius};background:${c.bg};` +
    `font-family:${FONT};text-decoration:none;line-height:1.2`

  if (variant === 'mark') {
    return [
      `<a href="${href}" title="${TITLE}" style="${shell('8px', '0', '999px')}">`,
      ...sprout('  ', 18, c.title),
      '</a>',
    ]
  }

  if (variant === 'compact') {
    return [
      `<a href="${href}" title="${TITLE}" style="${shell('6px 12px 6px 10px', '7px', '999px')}">`,
      ...sprout('  ', 15, c.title),
      `  <span style="font-size:12px;font-weight:700;letter-spacing:.04em;color:${c.title}">CROPS</span>`,
      `  <span style="font-size:12px;color:${c.body}">attested</span>`,
      '</a>',
    ]
  }

  return [
    `<a href="${href}" title="${TITLE}" style="${shell('9px 14px', '10px', '12px')}">`,
    ...sprout('  ', 20, c.title),
    '  <span style="display:flex;flex-direction:column;gap:1px">',
    `    <span style="font-size:13px;font-weight:700;letter-spacing:.04em;color:${c.title}">CROPS</span>`,
    `    <span style="font-size:11px;color:${c.body}">Reviewed &amp; attested onchain</span>`,
    '  </span>',
    `  <span style="width:1px;align-self:stretch;background:${c.rule}"></span>`,
    `  <span style="font-size:11px;font-weight:600;letter-spacing:.06em;color:${c.body}">L2BEAT</span>`,
    '</a>',
  ]
}

/** One line, for injecting into the live preview. */
export function cropsBadgeHtml(options: BadgeOptions): string {
  return badgeLines(options)
    .map((line) => line.trim())
    .join('')
}

/** The same markup, indented, for the copy-paste block. */
export function cropsBadgeSnippet(options: BadgeOptions): string {
  return badgeLines(options).join('\n')
}
