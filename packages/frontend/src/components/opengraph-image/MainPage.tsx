import {
  COLUMN,
  HEART_CLEARANCE,
  HeartbeatFrame,
  heartFillBetween,
  MARGIN,
  TITLE_LINE_HEIGHT,
  textLeftBesideLogo,
  titleBaseline,
  wordSpans,
} from './heartbeat/Frame'
import { balancedLines, satoriWidth, type TextMeasure } from './heartbeat/text'

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
  /** A data URI, shown beside the label and the title. */
  logo?: string
}

export function MainPageOpengraphImage({
  measure,
  label,
  title,
  description,
  logo,
}: Props) {
  const fitted = fitTitle(
    measure,
    title,
    titleFit(measure, { label, description, logo }),
  )
  return (
    <HeartbeatFrame
      measure={measure}
      label={label}
      description={description}
      logo={logo}
      titleSize={fitted.size}
      titleLines={fitted.lines}
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

interface TitleFit {
  baseline: number
  /** Where the title starts at a size: beside a logo, which grows with it. */
  left: (size: number) => number
}

/** Where a page's title sits: higher over a description, right of a logo. */
export function titleFit(
  measure: TextMeasure,
  page: { label?: string; description?: string; logo?: string },
): TitleFit {
  return {
    baseline: titleBaseline(page.description !== undefined),
    left:
      page.logo === undefined
        ? () => MARGIN
        : (size) => textLeftBesideLogo(measure, size, page.label !== undefined),
  }
}

/**
 * One line at 96–120 px, or up to 128 px to run over the heart instead of
 * ending at its edge, where a line looks like it bumps into the heart. Else
 * two lines at up to 112 px, balanced like CSS `text-wrap: balance`: a long
 * name reads better wrapped than shrunk.
 */
export function fitTitle(
  measure: TextMeasure,
  title: string,
  { baseline, left }: TitleFit = titleFit(measure, {}),
) {
  const column = (size: number) => COLUMN - (left(size) - MARGIN)
  const width = (size: number) => measure.width(title, size, 700, -0.01 * size)
  const fits = (size: number) => satoriWidth(width(size)) <= column(size)
  const atHeartEdge = (size: number) =>
    endsAtHeartEdge(measure, left(size) + width(size), size, baseline)
  const oneLine = (size: number) => ({ size, width: column(size), lines: 1 })

  if (fits(MAX_SIZE) && atHeartEdge(MAX_SIZE)) {
    for (let size = MAX_SIZE + 1; size <= MAX_SIZE_OVER_HEART; size++) {
      if (!fits(size)) break
      if (!atHeartEdge(size)) return oneLine(size)
    }
  }
  for (let size = MAX_SIZE; size >= MIN_ONE_LINE_SIZE; size--) {
    if (fits(size) && !atHeartEdge(size)) return oneLine(size)
  }
  for (let size = MAX_TWO_LINE_SIZE; size >= 44; size -= 2) {
    const { box, lines } = balancedLines(
      measure,
      title,
      size,
      700,
      column(size),
    )
    const clearOfHeartEdge = lines.every(
      (line, i) =>
        !endsAtHeartEdge(
          measure,
          left(size) + line,
          size,
          baseline + i * TITLE_LINE_HEIGHT * size,
        ),
    )
    if (lines.length <= 2 && clearOfHeartEdge) {
      return { size, width: box, lines: lines.length }
    }
  }
  const smallest = balancedLines(measure, title, 44, 700, column(44))
  return { size: 44, width: column(44), lines: smallest.lines.length }
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
