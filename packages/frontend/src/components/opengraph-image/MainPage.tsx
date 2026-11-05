import {
  COLUMN,
  HEART_CLEARANCE,
  HeartbeatFrame,
  heartEdgeBetween,
  MARGIN,
  TITLE_BASELINE,
  TITLE_LINE_HEIGHT,
  wordSpans,
} from './heartbeat/Frame'
import { satoriWidth, type TextMeasure } from './heartbeat/text'

export interface MainPage {
  /** Where the image goes, under static/meta-images. */
  path: string
  /** The page's type or section, when it says more than the title. */
  label?: string
  title: string
}

interface Props {
  measure: TextMeasure
  label?: string
  title: string
}

export function MainPageOpengraphImage({ measure, label, title }: Props) {
  const fitted = fitTitle(measure, title)
  return (
    <HeartbeatFrame
      measure={measure}
      label={label}
      titleSize={fitted.size}
      titleInkLeft={measure.inkLeft(title, fitted.size, 700)}
      title={
        <div style={{ display: 'flex', flexWrap: 'wrap', width: fitted.width }}>
          {wordSpans({ parts: [title], size: fitted.size, measure })}
        </div>
      }
    />
  )
}

const MAX_SIZE = 120
// A title that would end at the heart's edge first grows up to this to run
// over it, which looks the same as 120 px in a feed, before it shrinks to
// stop short of it.
const MAX_SIZE_OVER_HEART = 128
const MIN_ONE_LINE_SIZE = 96
const MAX_TWO_LINE_SIZE = 112
// A line that runs over the heart puts its last letter, about this wide, on
// the pink.
const LAST_LETTER = 0.4 // em

/**
 * One line at 96–120 px, or up to 128 px to run over the heart instead of
 * ending at its edge, where a line looks like it bumps into the heart. Else
 * two lines at up to 112 px, balanced like CSS `text-wrap: balance`: a long
 * name reads better wrapped than shrunk.
 */
export function fitTitle(measure: TextMeasure, title: string) {
  const width = (size: number) => measure.width(title, size, 700, -0.01 * size)
  const fits = (size: number) => satoriWidth(width(size)) <= COLUMN
  const atHeartEdge = (size: number) =>
    endsAtHeartEdge(measure, width(size), size, TITLE_BASELINE)

  if (fits(MAX_SIZE) && atHeartEdge(MAX_SIZE)) {
    for (let size = MAX_SIZE + 1; size <= MAX_SIZE_OVER_HEART; size++) {
      if (!fits(size)) break
      if (!atHeartEdge(size)) return { size, width: COLUMN }
    }
  }
  for (let size = MAX_SIZE; size >= MIN_ONE_LINE_SIZE; size--) {
    if (fits(size) && !atHeartEdge(size)) return { size, width: COLUMN }
  }
  for (let size = MAX_TWO_LINE_SIZE; size >= 44; size -= 2) {
    const { box, lines } = balancedLines(measure, title, size)
    const clearOfHeartEdge = lines.every(
      (line, i) =>
        !endsAtHeartEdge(
          measure,
          line,
          size,
          TITLE_BASELINE + i * TITLE_LINE_HEIGHT * size,
        ),
    )
    if (lines.length <= 2 && clearOfHeartEdge) return { size, width: box }
  }
  return { size: 44, width: COLUMN }
}

/**
 * Whether a line `width` wide ends at the heart's edge: inside the clearance
 * in front of it, but short of putting its last letter on the pink.
 */
function endsAtHeartEdge(
  measure: TextMeasure,
  width: number,
  size: number,
  baseline: number,
) {
  const end = MARGIN + width
  const edge = heartEdgeBetween(baseline - measure.capHeight(size), baseline)
  const stopsShort = end + HEART_CLEARANCE <= edge.nearest
  const runsOver = end - LAST_LETTER * size >= edge.furthest
  return !stopsShort && !runsOver
}

/** The title wrapped into the narrowest box that keeps the line count the column gives. */
function balancedLines(measure: TextMeasure, title: string, size: number) {
  const space = measure.width(' ', size, 700)
  const words = title
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => measure.width(word, size, 700))
  const count = wrap(words, space, COLUMN).length
  let lo = Math.max(...words)
  let hi = COLUMN
  while (hi - lo > 1) {
    const mid = (lo + hi) / 2
    if (wrap(words, space, mid).length <= count) hi = mid
    else lo = mid
  }
  const box = Math.min(COLUMN, Math.ceil(hi))
  return { box, lines: wrap(words, space, box) }
}

/**
 * The width of each line when words wrap in a `box` wide column. Every word
 * but the last carries a space as its right margin, and satori's flex wrap
 * counts that margin, but a line's letters end before it.
 */
function wrap(words: number[], space: number, box: number) {
  const lines: number[] = []
  let x = 0
  words.forEach((word, i) => {
    const margin = i < words.length - 1 ? space : 0
    if (x > 0 && satoriWidth(x + word + margin) > box) {
      lines.push(x - space)
      x = 0
    }
    x += word + margin
  })
  lines.push(x)
  return lines
}
