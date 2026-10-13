import { mixColors, readableColor, toRgba } from '../color'
import type { ThemeTokens } from '../hooks'
import type { LivePoster } from '../model'

/** Canvas cannot read CSS variables, so the belt's colors are worked out here */
export interface BeltPalette {
  surface: string
  text: string
  textSecondary: string
  /** Numbers that only mark the way, as slot numbers */
  textFaint: string
  brand: string
  rackFill: string
  rackStroke: string
  futureStroke: string
  emptySlot: string
  bayFill: string
  /** The chute tiles fall down into the bay, fading out upwards */
  chuteTop: string
  chuteBottom: string
  glow: string
  hatch: string
  targetLine: string
  /** By poster index */
  posters: PosterInk[]
}

export interface PosterInk {
  fill: string
  /** The lit top edge that makes a tile read as a gel */
  sheen: string
}

export function paletteFor(
  tokens: ThemeTokens,
  posters: LivePoster[],
): BeltPalette {
  const ink = tokens.primary
  const dark = tokens.isDark
  return {
    surface: tokens.surface,
    text: tokens.primary,
    textSecondary: tokens.secondary,
    textFaint: mixColors(tokens.secondary, tokens.surface, dark ? 0.3 : 0.25),
    brand: tokens.brand,
    rackFill: toRgba(ink, dark ? 0.03 : 0.022),
    rackStroke: toRgba(ink, dark ? 0.17 : 0.15),
    futureStroke: toRgba(ink, dark ? 0.2 : 0.17),
    emptySlot: toRgba(ink, dark ? 0.045 : 0.04),
    bayFill: toRgba(tokens.brand, dark ? 0.08 : 0.05),
    chuteTop: toRgba(tokens.brand, 0),
    chuteBottom: toRgba(tokens.brand, dark ? 0.12 : 0.08),
    glow: toRgba(tokens.brand, dark ? 0.6 : 0.4),
    hatch: toRgba(ink, dark ? 0.06 : 0.055),
    targetLine: toRgba(ink, dark ? 0.5 : 0.42),
    posters: posters.map((poster) => {
      const fill = readableColor(poster.color, tokens.surface)
      return { fill, sheen: mixColors(fill, '#ffffff', 0.45) }
    }),
  }
}
