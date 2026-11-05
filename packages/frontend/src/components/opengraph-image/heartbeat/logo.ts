import { Resvg } from '@resvg/resvg-js'

// A few logos are all black on transparency (Forta, Shape, Immutable zkEVM)
// and would vanish into the dark ground, so those get a light plate. Measured
// rather than listed, because new projects and token icons can be dark too.

const SAMPLE = 32
/** A pixel with any channel this bright stands out from the ground, so saturated blues count. */
const VISIBLE_CHANNEL = 90
/** Below this share of visible pixels, the logo is lost. White wordmarks on black start at about 3%. */
const MIN_VISIBLE_SHARE = 0.02

/** Whether the logo, drawn as it is on the dark ground, would barely show. */
export function isLostOnDark(src: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SAMPLE}" height="${SAMPLE}"><image href="${src}" width="${SAMPLE}" height="${SAMPLE}"/></svg>`
  const pixels = new Resvg(svg, { font: { loadSystemFonts: false } }).render()
    .pixels
  let opaque = 0
  let visible = 0
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3] ?? 0
    if (alpha < 128) continue
    opaque++
    // Premultiplied by alpha, so divided back out.
    const brightest = Math.max(
      pixels[i] ?? 0,
      pixels[i + 1] ?? 0,
      pixels[i + 2] ?? 0,
    )
    if ((brightest * 255) / alpha >= VISIBLE_CHANNEL) visible++
  }
  return opaque > 0 && visible / opaque < MIN_VISIBLE_SHARE
}
