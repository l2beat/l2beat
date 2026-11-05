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
 * `text` wrapped into as few lines as fit a `column` wide box, broken where it
 * reads best (see `raggedness`), like CSS `text-wrap: balance`, which satori
 * lacks. Every way to break it is tried: there are few for a line or three.
 */
export function balancedLines(
  measure: TextMeasure,
  text: string,
  size: number,
  weight: Weight,
  column: number,
) {
  const words = text.split(/\s+/).filter(Boolean)
  const lineWidth = (line: string[]) =>
    measure.width(line.join(' '), size, weight)
  const count = fewestLines(words, lineWidth, column)
  let best = { lines: [words], score: Number.POSITIVE_INFINITY }
  for (const starts of splits(words.length, count)) {
    const lines = starts.map((start, i) =>
      words.slice(start, starts[i + 1] ?? words.length),
    )
    const widths = lines.map(lineWidth)
    if (widths.some((width) => satoriWidth(width) > column)) continue
    const score = raggedness(lines, widths)
    if (score < best.score) best = { lines, score }
  }
  return best.lines.map((line) => line.join(' '))
}

/** How many lines filling each as full as it goes takes: the fewest there can be. */
function fewestLines(
  words: string[],
  lineWidth: (line: string[]) => number,
  column: number,
) {
  let lines = 1
  let line: string[] = []
  for (const word of words) {
    if (line.length > 0 && satoriWidth(lineWidth([...line, word])) > column) {
      lines++
      line = []
    }
    line.push(word)
  }
  return lines
}

/** Every way to split `n` words into `count` lines, as each line's first word. */
function* splits(n: number, count: number, from = 0): Generator<number[]> {
  if (count === 1) {
    yield [from]
    return
  }
  for (let next = from + 1; next <= n - count + 1; next++) {
    for (const rest of splits(n, count - 1, next)) yield [from, ...rest]
  }
}

/**
 * How unevenly lines fall short of the widest, squared, so one very short
 * line costs more than a few slightly short ones. The first line counts
 * triple: it sets the width the eye expects, and a short one reads as cut
 * off. The last counts half: it may end short, but a lone word there is a
 * widow, as bad as an empty line.
 */
function raggedness(lines: string[][], lineWidths: number[]) {
  const widest = Math.max(...lineWidths)
  const last = lines.length - 1
  return lineWidths.reduce((score, width, i) => {
    const widow = i === last && last > 0 && lines[i]?.length === 1
    const shortBy = widow ? widest : widest - width
    const weight = i === 0 ? 3 : i === last ? 0.5 : 1
    return score + weight * shortBy ** 2
  }, 0)
}
