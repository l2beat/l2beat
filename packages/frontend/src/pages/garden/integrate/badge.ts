import { SPROUT_PATHS } from '../components/SproutIcon'

/**
 * The badge a reviewed protocol puts on its own site: inline-styled HTML, so
 * it needs no stylesheet, no image from our domain and no fixed-width text.
 * Built as lines so the preview and the copy-paste block are the same markup.
 */

export type BadgeVariant = 'full' | 'compact' | 'mark'
export type BadgeTheme = 'light' | 'dark'

export interface BadgeOptions {
  variant: BadgeVariant
  theme: BadgeTheme
  /** Without one the badge is a plain span: illustration only, never a link. */
  href?: string
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

function sprout(indent: string, size: number, color: string): string[] {
  return [
    `${indent}<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" style="flex:none;color:${color}" aria-hidden="true">`,
    `${indent}  <path d="${SPROUT_PATHS.stem}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
    `${indent}  <path d="${SPROUT_PATHS.leftLeaf}" fill="currentColor"/>`,
    `${indent}  <path d="${SPROUT_PATHS.rightLeaf}" fill="currentColor" opacity=".75"/>`,
    `${indent}</svg>`,
  ]
}

function badgeLines({ variant, theme, href }: BadgeOptions): string[] {
  const c = PALETTE[theme]
  const shell = (padding: string, gap: string, radius: string) =>
    `display:inline-flex;align-items:center;gap:${gap};padding:${padding};` +
    `border:1px solid ${c.border};border-radius:${radius};background:${c.bg};` +
    `font-family:${FONT};text-decoration:none;line-height:1.2`
  const open = (style: string) =>
    href
      ? `<a href="${href}" title="${TITLE}" style="${style}">`
      : `<span title="${TITLE}" style="${style}">`
  const close = href ? '</a>' : '</span>'

  if (variant === 'mark') {
    return [
      open(shell('8px', '0', '999px')),
      ...sprout('  ', 18, c.title),
      close,
    ]
  }

  if (variant === 'compact') {
    return [
      open(shell('6px 12px 6px 10px', '7px', '999px')),
      ...sprout('  ', 15, c.title),
      `  <span style="font-size:12px;font-weight:700;letter-spacing:.04em;color:${c.title}">CROPS</span>`,
      `  <span style="font-size:12px;color:${c.body}">attested</span>`,
      close,
    ]
  }

  return [
    open(shell('9px 14px', '10px', '12px')),
    ...sprout('  ', 20, c.title),
    '  <span style="display:flex;flex-direction:column;gap:1px">',
    `    <span style="font-size:13px;font-weight:700;letter-spacing:.04em;color:${c.title}">CROPS</span>`,
    `    <span style="font-size:11px;color:${c.body}">Reviewed &amp; attested onchain</span>`,
    '  </span>',
    `  <span style="width:1px;align-self:stretch;background:${c.rule}"></span>`,
    `  <span style="font-size:11px;font-weight:600;letter-spacing:.06em;color:${c.body}">L2BEAT</span>`,
    close,
  ]
}

/** One line, for the live preview. */
export function cropsBadgeHtml(options: BadgeOptions): string {
  return badgeLines(options)
    .map((line) => line.trim())
    .join('')
}

/** Indented, for the copy-paste block. */
export function cropsBadgeSnippet(options: BadgeOptions): string {
  return badgeLines(options).join('\n')
}
