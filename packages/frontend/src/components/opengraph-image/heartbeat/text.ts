import opentype from '@shuding/opentype.js'

// Satori lays out text but can't tell us how wide it will be, and the layouts
// pick sizes by width: a title stays on one line while that keeps it big enough,
// a label shrinks to end before the heartbeat. So we measure with the same font
// files satori renders, through satori's own font parser.

export type Weight = 600 | 700

export interface OpengraphFonts {
  semiBold: Buffer
  bold: Buffer
}

export interface TextMeasure {
  /** Advance width of `text`, with `letterSpacing` between its letters. */
  width(
    text: string,
    size: number,
    weight: Weight,
    letterSpacing?: number,
  ): number
  /** How far right of its box the first letter's ink starts. */
  inkLeft(text: string, size: number, weight: Weight): number
}

export function createTextMeasure(fonts: OpengraphFonts): TextMeasure {
  const faces = {
    600: parse(fonts.semiBold),
    700: parse(fonts.bold),
  }
  return {
    width(text, size, weight, letterSpacing = 0) {
      const advance = faces[weight].getAdvanceWidth(text, size, {
        kerning: true,
      })
      return advance + letterSpacing * Math.max(0, text.length - 1)
    },
    inkLeft(text, size, weight) {
      const face = faces[weight]
      const glyph = face.charToGlyph(text.charAt(0))
      return ((glyph.leftSideBearing ?? 0) * size) / face.unitsPerEm
    },
  }
}

export function satoriFonts(fonts: OpengraphFonts) {
  return [
    { name: 'roboto', data: fonts.semiBold, style: 'normal', weight: 600 },
    { name: 'roboto', data: fonts.bold, style: 'normal', weight: 700 },
  ] as const
}

function parse(buffer: Buffer) {
  return opentype.parse(
    buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    ),
  )
}
