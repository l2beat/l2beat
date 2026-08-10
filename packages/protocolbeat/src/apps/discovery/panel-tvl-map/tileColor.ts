import { assert } from '@l2beat/shared-pure'

interface Rgb {
  red: number
  green: number
  blue: number
}

export interface TileColor {
  background: string
  prefersDarkText: boolean
}

// coffee-900, which the panel paints behind the tiles and writes on the bright
// ones, and coffee-200, which it writes on the dim ones.
const DARK: Rgb = { red: 0x1d, green: 0x18, blue: 0x16 }
const LIGHT: Rgb = { red: 0xf0, green: 0xd8, blue: 0xbd }

const ALPHA_MIN = 0.18
const ALPHA_MAX = 0.92

export function toTileColor(hex: string, intensity: number): TileColor {
  assert(intensity >= 0, 'Intensity is below zero')
  assert(intensity <= 1, 'Intensity is above one')
  const color = toRgb(hex)
  const alpha = ALPHA_MIN + (ALPHA_MAX - ALPHA_MIN) * intensity
  const fill = relativeLuminance(blend(color, DARK, alpha))

  return {
    background: `rgba(${color.red}, ${color.green}, ${color.blue}, ${alpha.toFixed(3)})`,
    // Whichever of the two text colors the app owns reads better on this fill,
    // rather than a luminance threshold picked by hand.
    prefersDarkText:
      contrast(fill, relativeLuminance(DARK)) >
      contrast(fill, relativeLuminance(LIGHT)),
  }
}

// Rank rather than value, because holdings follow a power law: one escrow with
// a thousand times the value of the next would otherwise flatten every other
// tile to the same shade. Area already carries the magnitude.
export function toIntensity(rank: number, count: number): number {
  assert(rank >= 0 && rank < count, 'Rank is outside of the ranking')
  if (count === 1) {
    return 1
  }
  return 1 - rank / (count - 1)
}

function toRgb(hex: string): Rgb {
  assert(hex.length === 7, `Not a hex color: ${hex}`)
  assert(hex.startsWith('#'), `Not a hex color: ${hex}`)
  const red = Number.parseInt(hex.slice(1, 3), 16)
  const green = Number.parseInt(hex.slice(3, 5), 16)
  const blue = Number.parseInt(hex.slice(5, 7), 16)
  assert(Number.isFinite(red + green + blue), `Not a hex color: ${hex}`)

  return { red, green, blue }
}

function blend(color: Rgb, backdrop: Rgb, alpha: number): Rgb {
  return {
    red: color.red * alpha + backdrop.red * (1 - alpha),
    green: color.green * alpha + backdrop.green * (1 - alpha),
    blue: color.blue * alpha + backdrop.blue * (1 - alpha),
  }
}

// WCAG contrast ratio between two relative luminances.
function contrast(one: number, other: number): number {
  const lighter = Math.max(one, other)
  const darker = Math.min(one, other)
  return (lighter + 0.05) / (darker + 0.05)
}

function relativeLuminance(color: Rgb): number {
  return (
    0.2126 * toLinear(color.red) +
    0.7152 * toLinear(color.green) +
    0.0722 * toLinear(color.blue)
  )
}

function toLinear(channel: number): number {
  const value = channel / 0xff
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}
