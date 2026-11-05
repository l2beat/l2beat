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
  wordSpans,
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
      titleSize={fitted.size}
      titleLineWidths={fitted.lineWidths}
      titleBaseline={fit.baseline(fitted.size, fitted.lines.length)}
      title={
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {fitted.lines.map((line) => (
            // Each line starts its first letter's ink on the column's edge.
            <div
              key={line}
              style={{
                display: 'flex',
                marginLeft: -measure.inkLeft(line, fitted.size, 700),
              }}
            >
              {wordSpans({ parts: [line], size: fitted.size, measure })}
            </div>
          ))}
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
const MIN_SIZE = 44
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
    const block = { titleSize: MAX_SIZE, titleLines: 1, withLabel }
    const baseline = titleBaseline(measure, {
      ...block,
      descriptionLines: lines,
    })
    lines = descriptionLayout(measure, description, {
      baseline,
      size: MAX_SIZE,
      lines: 1,
    }).lines
  }
  return lines
}

/**
 * One line at 96–120 px, or up to 128 px to run over the heart instead of
 * ending at its edge, where a line looks like it bumps into the heart. Else
 * two lines at up to 112 px, as balanced as the heart allows: every way to
 * break the title is tried before it shrinks, since a long name reads better
 * wrapped than small.
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

  const fitsAtMax = satoriWidth(widthOf(title, MAX_SIZE)) <= column(MAX_SIZE)
  if (fitsAtMax && !laidOut([title], MAX_SIZE)) {
    for (let size = MAX_SIZE + 1; size <= MAX_SIZE_OVER_HEART; size++) {
      if (satoriWidth(widthOf(title, size)) > column(size)) break
      const fitted = laidOut([title], size)
      if (fitted) return fitted
    }
  }
  for (let size = MAX_SIZE; size >= MIN_ONE_LINE_SIZE; size--) {
    const fitted = laidOut([title], size)
    if (fitted) return fitted
  }
  for (let size = MAX_TWO_LINE_SIZE; size >= MIN_SIZE; size -= 2) {
    const candidates = words.length > 1 ? breaks(size) : [[title]]
    for (const lines of candidates) {
      const fitted = laidOut(lines, size)
      if (fitted) return fitted
    }
  }
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
