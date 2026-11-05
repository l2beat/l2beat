import { Resvg } from '@resvg/resvg-js'
import { INK } from './marks'

// Logos are drawn for light pages, and many get lost on the dark ground. Ones
// with nothing light in them turn into their own dark-mode version: near-black
// ones are inverted (a black mark turns white, its hues stay) and dim ones are
// brightened. The rest keep their colours, which already read on dark. White
// detail on a dark logo (a black square with a white mark) counts as light, so
// such a logo stays as it is: its mark reads, and inverting it would turn the
// square white.

export type LogoTreatment = 'invert' | 'brighten' | 'keep'

/** Contrast with the ground below which a logo with nothing light in it is inverted. */
const INVERT_BELOW = 1.5
/** Contrast with the ground below which such a logo is brightened. */
const BRIGHTEN_BELOW = 3.5
/** Pixels at least this bright count as light detail. */
const LIGHT = 0.5
/** A logo with at least this share of light pixels keeps its colours. */
const LIGHT_SHARE = 0.01
// Measured at full size: thin white lettering averages away when scaled down.
const MEASURE_SIZE = 128
// Redrawn larger than it shows, so it stays sharp.
const REDRAW_SIZE = 256

const FILTERS: Record<Exclude<LogoTreatment, 'keep'>, string> = {
  invert:
    '<feComponentTransfer><feFuncR type="table" tableValues="1 0"/><feFuncG type="table" tableValues="1 0"/><feFuncB type="table" tableValues="1 0"/></feComponentTransfer><feColorMatrix type="hueRotate" values="180"/>',
  brighten:
    '<feComponentTransfer><feFuncR type="gamma" exponent="0.55"/><feFuncG type="gamma" exponent="0.55"/><feFuncB type="gamma" exponent="0.55"/></feComponentTransfer>',
}

/** The logo, a data URI, as one that reads on the dark ground. */
export function onDarkGround(logo: string) {
  const treatment = logoTreatment(logo)
  if (treatment === 'keep') return logo
  const svg = square(
    REDRAW_SIZE,
    `<defs><filter id="f" color-interpolation-filters="sRGB">${FILTERS[treatment]}</filter></defs>${image(logo, REDRAW_SIZE, 'filter="url(#f)"')}`,
  )
  return `data:image/png;base64,${draw(svg).asPng().toString('base64')}`
}

export function logoTreatment(logo: string): LogoTreatment {
  const { pixels } = draw(square(MEASURE_SIZE, image(logo, MEASURE_SIZE)))
  let sum = 0
  let opaque = 0
  let light = 0
  for (let i = 0; i < pixels.length; i += 4) {
    if ((pixels[i + 3] ?? 0) < 128) continue
    const luminance = relativeLuminance(
      pixels[i] ?? 0,
      pixels[i + 1] ?? 0,
      pixels[i + 2] ?? 0,
    )
    sum += luminance
    opaque++
    if (luminance > LIGHT) light++
  }
  if (opaque === 0 || light / opaque >= LIGHT_SHARE) return 'keep'
  const contrast = (sum / opaque + 0.05) / (INK_LUMINANCE + 0.05)
  if (contrast < INVERT_BELOW) return 'invert'
  if (contrast < BRIGHTEN_BELOW) return 'brighten'
  return 'keep'
}

const square = (size: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${body}</svg>`

const image = (href: string, size: number, attributes = '') =>
  `<image href="${href}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet" ${attributes}/>`

const draw = (svg: string) =>
  new Resvg(svg, { font: { loadSystemFonts: false } }).render()

/** WCAG relative luminance of an sRGB colour given in 0–255 channels. */
function relativeLuminance(r: number, g: number, b: number) {
  const linear = (channel: number) => {
    const c = channel / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

const INK_LUMINANCE = relativeLuminance(
  Number.parseInt(INK.slice(1, 3), 16),
  Number.parseInt(INK.slice(3, 5), 16),
  Number.parseInt(INK.slice(5, 7), 16),
)
