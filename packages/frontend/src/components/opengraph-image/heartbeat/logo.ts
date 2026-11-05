import { Resvg } from '@resvg/resvg-js'
import { INK, PINK } from './marks'

// Logos are drawn for light pages, and many get lost on the dark ground. Ones
// with nothing light in them turn into their own dark-mode version: near-black
// ones are inverted (a black mark turns white, its hues stay) and dim ones are
// brightened. The rest keep their colours, which already read on dark. White
// detail on a dark logo (a black square with a white mark) counts as light, so
// such a logo stays as it is: its mark reads, and inverting it would turn the
// square white. Instead, a logo still that dark gets a pink glow behind it, so
// its own shape shows; the rest stand out without one.

export type LogoTreatment = 'invert' | 'brighten' | 'keep'

/** Contrast with the ground below which a logo with nothing light in it is inverted. */
const INVERT_BELOW = 1.5
/** Contrast with the ground below which such a logo is brightened. */
const BRIGHTEN_BELOW = 3.5
/** Contrast with the ground below which a logo, after its fix, gets a glow: WCAG's minimum for graphics. */
const GLOW_BELOW = 3
// The glow hugs the logo's outline and is kept small: it starts on the
// outline, grown by `spread`, and fades over about `blur`. Both, and how far
// its image reaches past the logo, are of the logo's size.
const GLOW = { reach: 0.3, spread: 0.015, blur: 0.035, opacity: 1 }
/** How far, of a logo's size, its glow's image reaches past it on every side. */
export const GLOW_REACH = GLOW.reach
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

export interface DarkGroundLogo {
  /** A data URI. */
  src: string
  /** Whether it still needs a glow behind it to stand out. */
  glow: boolean
  /** Where its drawn part sits in its square image, in fractions of its side. */
  ink: { x0: number; y0: number; x1: number; y1: number }
}

/** The logo, a data URI, as one that reads on the dark ground. */
export function onDarkGround(logo: string): DarkGroundLogo {
  const { treatment, contrast, ink } = measureOnGround(logo)
  if (treatment === 'keep') {
    return { src: logo, glow: contrast < GLOW_BELOW, ink }
  }
  const svg = square(
    REDRAW_SIZE,
    `<defs><filter id="f" color-interpolation-filters="sRGB">${FILTERS[treatment]}</filter></defs>${image(logo, REDRAW_SIZE, 'filter="url(#f)"')}`,
  )
  const src = `data:image/png;base64,${draw(svg).asPng().toString('base64')}`
  return { src, glow: measureOnGround(src).contrast < GLOW_BELOW, ink }
}

/**
 * A pink glow hugging the logo's outline, its corners rounded by `radius` of
 * its size like the logo's own, as an image `GLOW_REACH` of its size wider on
 * every side. Draw the logo over it.
 */
export function glowBehind(logo: string, radius: number) {
  const size = REDRAW_SIZE
  const reach = GLOW.reach * size
  const full = size + 2 * reach
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${full}" height="${full}"><defs>` +
    `<clipPath id="r"><rect x="${reach}" y="${reach}" width="${size}" height="${size}" rx="${radius * size}"/></clipPath>` +
    `<filter id="g" filterUnits="userSpaceOnUse" x="0" y="0" width="${full}" height="${full}"><feMorphology in="SourceAlpha" operator="dilate" radius="${GLOW.spread * size}" result="outline"/><feFlood flood-color="${PINK}" flood-opacity="${GLOW.opacity}"/><feComposite in2="outline" operator="in"/><feGaussianBlur stdDeviation="${GLOW.blur * size}"/></filter>` +
    `</defs><g filter="url(#g)"><image href="${logo}" x="${reach}" y="${reach}" width="${size}" height="${size}" clip-path="url(#r)"/></g></svg>`
  return `data:image/png;base64,${draw(svg).asPng().toString('base64')}`
}

export function logoTreatment(logo: string): LogoTreatment {
  return measureOnGround(logo).treatment
}

/**
 * How the logo contrasts with the ground on average, what that calls for, and
 * where its drawn part sits: logo files come with empty margins of all sizes.
 */
function measureOnGround(logo: string) {
  const { pixels } = draw(square(MEASURE_SIZE, image(logo, MEASURE_SIZE)))
  let sum = 0
  let opaque = 0
  let light = 0
  const ink = { x0: MEASURE_SIZE, y0: MEASURE_SIZE, x1: 0, y1: 0 }
  for (let i = 0; i < pixels.length; i += 4) {
    if ((pixels[i + 3] ?? 0) < 128) continue
    const x = (i / 4) % MEASURE_SIZE
    const y = Math.floor(i / 4 / MEASURE_SIZE)
    ink.x0 = Math.min(ink.x0, x)
    ink.y0 = Math.min(ink.y0, y)
    ink.x1 = Math.max(ink.x1, x + 1)
    ink.y1 = Math.max(ink.y1, y + 1)
    const luminance = relativeLuminance(
      pixels[i] ?? 0,
      pixels[i + 1] ?? 0,
      pixels[i + 2] ?? 0,
    )
    sum += luminance
    opaque++
    if (luminance > LIGHT) light++
  }
  const inkFractions =
    opaque === 0
      ? { x0: 0, y0: 0, x1: 1, y1: 1 }
      : {
          x0: ink.x0 / MEASURE_SIZE,
          y0: ink.y0 / MEASURE_SIZE,
          x1: ink.x1 / MEASURE_SIZE,
          y1: ink.y1 / MEASURE_SIZE,
        }
  if (opaque === 0) {
    return {
      treatment: 'keep' as const,
      contrast: Number.POSITIVE_INFINITY,
      ink: inkFractions,
    }
  }
  const contrast = (sum / opaque + 0.05) / (INK_LUMINANCE + 0.05)
  const treatment: LogoTreatment =
    light / opaque >= LIGHT_SHARE || contrast >= BRIGHTEN_BELOW
      ? 'keep'
      : contrast < INVERT_BELOW
        ? 'invert'
        : 'brighten'
  return { treatment, contrast, ink: inkFractions }
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
