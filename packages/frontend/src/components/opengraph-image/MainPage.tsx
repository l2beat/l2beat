import {
  COLUMN,
  descriptionLayout,
  HEART_CLEARANCE,
  HeartbeatFrame,
  heartFillBetween,
  MARGIN,
  TITLE_LINE_HEIGHT,
  textLeftBesideLogo,
  titleBaseline,
} from './heartbeat/Frame'
import type { DarkGroundLogo } from './heartbeat/logo'
import { satoriWidth, type TextMeasure } from './heartbeat/text'

export interface MainPage {
  /** Where the image goes, under static/meta-images. */
  path: string
  /** The page's type or section, when it says more than the title. */
  label?: string
  title: string
  /** A line or two under the title on what the page is for. */
  description?: string
}

interface Props {
  measure: TextMeasure
  label?: string
  title: string
  description?: string
  /** Shown beside the label and the title. */
  logo?: DarkGroundLogo
}

export function MainPageOpengraphImage({
  measure,
  label,
  title,
  description,
  logo,
}: Props) {
  const fit = titleFit(measure, { label, description, logo })
  const fitted = fitTitle(measure, title, fit)
  return (
    <HeartbeatFrame
      measure={measure}
      label={label}
      description={description}
      logo={logo}
      title={fitted.lines}
      titleSize={fitted.size}
      titleBaseline={fit.baseline(fitted.size, fitted.lines.length)}
    />
  )
}

// One-line titles stay within 10% of 120 px: a title whose end would land at
// the heart's edge, where it looks like it bumps into the heart, takes the
// size nearest 120 that clears it, growing past the edge or stopping short.
const ONE_LINE = { ideal: 120, min: 108, max: 132 }
const MIN_ONE_LINE_SIZE = 96
const MAX_TWO_LINE_SIZE = 112
const MIN_SIZE = 44
// A name wraps onto a second line only when that makes it more than this
// much bigger: splitting a short name ("Ebi / Chain") reads worse than a
// slightly smaller line.
const SECOND_LINE_COST = 10
// A line that runs over the heart puts its last letter, about this wide, on
// the pink.
const LAST_LETTER = 0.4 // em

interface TitleFit {
  /** Where the title's first baseline sits at a size and a line count. */
  baseline: (size: number, lines: number) => number
  /** Where the title starts at a size: beside a logo, which grows with it. */
  left: (size: number) => number
}

/** Where a page's title sits: its block centred on the heart, right of a logo. */
export function titleFit(
  measure: TextMeasure,
  page: { label?: string; description?: string; logo?: DarkGroundLogo },
): TitleFit {
  const withLabel = page.label !== undefined
  const descriptionLines =
    page.description === undefined
      ? 0
      : countDescriptionLines(measure, page.description, withLabel)
  const ink = page.logo?.ink
  return {
    baseline: (size, lines) =>
      titleBaseline(measure, {
        titleSize: size,
        titleLines: lines,
        withLabel,
        descriptionLines,
      }),
    left:
      ink === undefined
        ? () => MARGIN
        : (size) => textLeftBesideLogo(measure, size, withLabel, ink),
  }
}

/**
 * How many lines a description takes. Its wrap depends on where it sits, and
 * where it sits depends on its height, so this settles both from a guess.
 */
function countDescriptionLines(
  measure: TextMeasure,
  description: string,
  withLabel: boolean,
) {
  let lines = 2
  for (let pass = 0; pass < 2; pass++) {
    const block = { titleSize: ONE_LINE.ideal, titleLines: 1, withLabel }
    const baseline = titleBaseline(measure, {
      ...block,
      descriptionLines: lines,
    })
    lines = descriptionLayout(measure, description, {
      baseline,
      size: ONE_LINE.ideal,
      lines: 1,
    }).lines.length
  }
  return lines
}

/**
 * One line within 10% of 120 px if it can be. Else the bigger of one line at
 * 96–107 px and two lines at 96–112 px, as balanced as the heart allows (every
 * way to break the name is tried at a size before it shrinks), the second
 * line costing 10 px. Two smaller lines last.
 */
export function fitTitle(
  measure: TextMeasure,
  title: string,
  { baseline, left }: TitleFit = titleFit(measure, {}),
) {
  const column = (size: number) => COLUMN - (left(size) - MARGIN)
  const widthOf = (text: string, size: number) =>
    measure.width(text, size, 700, -0.01 * size)
  const clearOfHeartEdge = (widths: number[], size: number) =>
    widths.every(
      (width, i) =>
        !endsAtHeartEdge(
          measure,
          left(size) + width,
          size,
          baseline(size, widths.length) + i * TITLE_LINE_HEIGHT * size,
        ),
    )
  const laidOut = (lines: string[], size: number) => {
    const lineWidths = lines.map((line) => widthOf(line, size))
    const fits = lineWidths.every((width) => satoriWidth(width) <= column(size))
    return fits && clearOfHeartEdge(lineWidths, size)
      ? { size, lines, lineWidths }
      : undefined
  }
  const words = title.split(/\s+/).filter(Boolean)
  const breaks = (size: number) =>
    words
      .slice(1)
      .map((_, i) => [
        words.slice(0, i + 1).join(' '),
        words.slice(i + 1).join(' '),
      ])
      .sort(
        (a, b) =>
          Math.max(...a.map((line) => widthOf(line, size))) -
          Math.max(...b.map((line) => widthOf(line, size))),
      )

  const oneLine = (sizes: number[]) => firstFit(sizes, () => [[title]])
  const twoLines = (sizes: number[]) =>
    firstFit(sizes, (size) => (words.length > 1 ? breaks(size) : [[title]]))
  const firstFit = (
    sizes: number[],
    candidates: (size: number) => string[][],
  ) => {
    for (const size of sizes) {
      for (const lines of candidates(size)) {
        const fitted = laidOut(lines, size)
        if (fitted) return fitted
      }
    }
  }

  const nearIdeal = oneLine(nearestFirst(ONE_LINE))
  if (nearIdeal) return nearIdeal
  const smallerLine = oneLine(
    descending(ONE_LINE.min - 1, MIN_ONE_LINE_SIZE, 1),
  )
  const wrapped = twoLines(descending(MAX_TWO_LINE_SIZE, MIN_ONE_LINE_SIZE, 2))
  const worthWrapping =
    wrapped !== undefined &&
    (smallerLine === undefined ||
      wrapped.size - SECOND_LINE_COST > smallerLine.size)
  const fitted =
    (worthWrapping ? wrapped : smallerLine) ??
    twoLines(descending(MIN_ONE_LINE_SIZE - 2, MIN_SIZE, 2))
  if (fitted) return fitted
  const lines = breaks(MIN_SIZE)[0] ?? [title]
  return {
    size: MIN_SIZE,
    lines,
    lineWidths: lines.map((line) => widthOf(line, MIN_SIZE)),
  }
}

/**
 * Whether a line ending at `end` ends at one of the heart's edges: inside the
 * clearance in front of it, short of putting its last letter on the pink, or
 * so far over that it falls off the heart's other side.
 */
function endsAtHeartEdge(
  measure: TextMeasure,
  end: number,
  size: number,
  baseline: number,
) {
  const fill = heartFillBetween(baseline - measure.capHeight(size), baseline)
  const stopsShort = end + HEART_CLEARANCE <= fill.nearestStart
  const endsOnHeart =
    end - LAST_LETTER * size >= fill.furthestStart &&
    end + HEART_CLEARANCE <= fill.nearestEnd
  return !stopsShort && !endsOnHeart
}

/** Sizes from `ideal` outward, nearest first, a larger one first on a tie. */
function nearestFirst({ ideal, min, max }: typeof ONE_LINE) {
  const sizes: number[] = []
  for (let d = 0; ideal + d <= max || ideal - d >= min; d++) {
    if (ideal + d <= max) sizes.push(ideal + d)
    if (d > 0 && ideal - d >= min) sizes.push(ideal - d)
  }
  return sizes
}

function descending(from: number, to: number, step: number) {
  const sizes: number[] = []
  for (let size = from; size >= to; size -= step) sizes.push(size)
  return sizes
}
