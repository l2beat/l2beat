import opentype from '@shuding/opentype.js'

// Satori lays out text but can't tell us how wide it will be or where its
// baseline lands, and the layouts need both: a title stays on one line while
// that keeps it big enough, a label shrinks to end before the heart, and every
// title sits on the same baseline. So we measure with the same font files
// satori renders, through satori's own font parser.

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
  /** How far below the top of a line box its baseline sits, as satori lays it out. */
  baseline(size: number, lineHeight: number): number
  /** The height of a capital letter. */
  capHeight(size: number): number
  /** SVG path data of `text`'s letters, its baseline starting at (x, y). */
  outline(
    text: string,
    x: number,
    y: number,
    size: number,
    weight: Weight,
    letterSpacing?: number,
  ): string
}

/**
 * The width satori needs for text the font measures at `measured`. It sets
 * each word a little wider than that, so keep 2% spare plus a few px.
 */
export const satoriWidth = (measured: number) => measured * 1.02 + 8

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
    // Satori centres the font's ascender-to-descender box in the line box. Both
    // weights share Roboto's vertical metrics.
    baseline(size, lineHeight) {
      const { ascender, descender, unitsPerEm } = faces[700]
      const content = (ascender - descender) / unitsPerEm
      return size * ((lineHeight - content) / 2 + ascender / unitsPerEm)
    },
    outline(text, x, y, size, weight, letterSpacing = 0) {
      return faces[weight]
        .getPath(text, x, y, size, {
          kerning: true,
          letterSpacing: letterSpacing / size,
        })
        .toPathData(1)
    },
    capHeight(size) {
      const face = faces[700]
      return (size * face.tables.os2.sCapHeight) / face.unitsPerEm
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

/**
 * `text` wrapped into the narrowest box that keeps the line count a `column`
 * wide box gives, like CSS `text-wrap: balance`, which satori lacks: the box,
 * and each line's text and width.
 */
export function balancedLines(
  measure: TextMeasure,
  text: string,
  size: number,
  weight: Weight,
  column: number,
) {
  const words = text.split(/\s+/).filter(Boolean)
  const widths = words.map((word) => measure.width(word, size, weight))
  const space = measure.width(' ', size, weight)
  const count = wrap(widths, space, column).length
  let lo = Math.max(...widths)
  let hi = column
  while (hi - lo > 1) {
    const mid = (lo + hi) / 2
    if (wrap(widths, space, mid).length <= count) hi = mid
    else lo = mid
  }
  const box = Math.min(column, Math.ceil(hi))
  const lines = wrap(widths, space, box).map((line) =>
    line.map((i) => words[i]).join(' '),
  )
  return {
    box,
    lines,
    widths: lines.map((line) => measure.width(line, size, weight)),
  }
}

/**
 * Which words go on each line when they wrap in a `box` wide column. Every
 * word but the last carries a space as its right margin, and satori's flex
 * wrap counts that margin.
 */
function wrap(words: number[], space: number, box: number) {
  const lines: number[][] = [[]]
  let x = 0
  words.forEach((word, i) => {
    const margin = i < words.length - 1 ? space : 0
    const line = lines[lines.length - 1] as number[]
    if (x > 0 && satoriWidth(x + word + margin) > box) {
      lines.push([i])
      x = word + margin
      return
    }
    line.push(i)
    x += word + margin
  })
  return lines
}
