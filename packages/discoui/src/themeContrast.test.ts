import { readFileSync } from 'node:fs'
import { expect } from 'earl'

// Methodology: read both palettes straight from index.css (dark is the
// default theme block, light overrides it) and check the text colors against
// the surfaces they are drawn on, using the WCAG AA ratio for body text.
//
// Left out on purpose: coffee-500 and coffee-600 only draw decorative glyphs
// (quotes, separators, an empty-cell dash), and aux-purple, aux-amber and
// aux-brown are only used as fills and strokes.
const TEXT_COLORS = [
  'coffee-100',
  'coffee-200',
  'coffee-300',
  'coffee-400',
  'autumn-300',
  'aux-red',
  'aux-green',
  'aux-orange',
  'aux-blue',
  'aux-yellow',
  'aux-teal',
  'aux-cyan',
  'aux-pink',
]
const PANEL_SURFACES = ['coffee-900', 'coffee-800']

// Highlighted rows, toasts, chips and active toolbar buttons sit on coffee-700.
// Dark mode's muted coffee-400 and the status colors are below AA there, so
// muted text on it uses coffee-300, and colored diffs sit on coffee-800.
const HOVER_TEXT_COLORS = [
  'coffee-100',
  'coffee-200',
  'coffee-300',
  'autumn-300',
]
const HOVER_SURFACE = 'coffee-700'

const WCAG_AA_TEXT_RATIO_MIN = 4.5

describe('theme contrast', () => {
  for (const theme of ['dark', 'light'] as const) {
    it(`keeps ${theme} text readable on panels, chrome and hover`, () => {
      const palette = readPalette(theme)
      const failures = [
        ...findContrastFailures(palette, TEXT_COLORS, PANEL_SURFACES),
        ...findContrastFailures(palette, HOVER_TEXT_COLORS, [HOVER_SURFACE]),
      ]
      expect(failures).toEqual([])
    })
  }

  it('gives light mode its own value for every checked color', () => {
    const lightOverrides = parsePalette(readBlock('[data-theme="light"] {'))
    for (const name of [...TEXT_COLORS, ...PANEL_SURFACES, HOVER_SURFACE]) {
      expect(lightOverrides.has(name)).toEqual(true)
    }
  })
})

function readPalette(theme: 'dark' | 'light'): Map<string, string> {
  const dark = parsePalette(readBlock('@theme static {'))
  if (theme === 'dark') {
    return dark
  }
  const light = parsePalette(readBlock('[data-theme="light"] {'))
  return new Map([...dark, ...light])
}

function readBlock(opening: string): string {
  const css = readFileSync(new URL('./index.css', import.meta.url), 'utf8')
  const start = css.indexOf(opening)
  expect(start).not.toEqual(-1)
  const end = css.indexOf('}', start)
  expect(end).toBeGreaterThan(start)
  const body = css.slice(start + opening.length, end)
  // A nested rule would end the block at its own closing brace.
  expect(body.includes('{')).toEqual(false)
  return body
}

function parsePalette(block: string): Map<string, string> {
  const palette = new Map<string, string>()
  for (const [, name, value] of block.matchAll(
    /--color-([\w*-]+):\s*([^;]+);/g,
  )) {
    expect(name).not.toEqual(undefined)
    expect(value).not.toEqual(undefined)
    palette.set(name ?? '', (value ?? '').trim())
  }
  expect(palette.size).toBeGreaterThan(0)
  return palette
}

function findContrastFailures(
  palette: Map<string, string>,
  textColors: string[],
  surfaces: string[],
): string[] {
  const failures: string[] = []
  for (const surface of surfaces) {
    for (const text of textColors) {
      const ratio = contrastRatio(hexOf(palette, text), hexOf(palette, surface))
      if (ratio < WCAG_AA_TEXT_RATIO_MIN) {
        failures.push(`${text} on ${surface}: ${ratio.toFixed(2)}`)
      }
    }
  }
  return failures
}

function hexOf(palette: Map<string, string>, name: string): string {
  const value = palette.get(name)
  if (value === undefined) {
    throw new Error('Color missing from index.css', { cause: { name } })
  }
  if (!/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error('Color is not #rrggbb', { cause: { name, value } })
  }
  return value
}

function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(foreground)
  const backgroundLuminance = relativeLuminance(background)
  const lighter = Math.max(foregroundLuminance, backgroundLuminance)
  const darker = Math.min(foregroundLuminance, backgroundLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

function relativeLuminance(hex: string): number {
  const red = linearChannel(hex, 1)
  const green = linearChannel(hex, 3)
  const blue = linearChannel(hex, 5)
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function linearChannel(hex: string, offset: number): number {
  const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255
  if (channel <= 0.04045) {
    return channel / 12.92
  }
  return ((channel + 0.055) / 1.055) ** 2.4
}
