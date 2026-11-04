import { COLUMN, HeartbeatFrame, wordSpans } from './heartbeat/Frame'
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
      titleInkLeft={measure.inkLeft(title, fitted.size, 700)}
      title={
        <div style={{ display: 'flex', flexWrap: 'wrap', width: fitted.width }}>
          {wordSpans({ parts: [title], size: fitted.size, measure })}
        </div>
      }
    />
  )
}

/**
 * One line while that keeps the title at 56 px or more, else two lines at
 * 44–80 px, balanced like CSS `text-wrap: balance`.
 */
function fitTitle(measure: TextMeasure, title: string) {
  const fitsOneLine = (size: number) =>
    satoriWidth(measure.width(title, size, 700)) <= COLUMN
  for (let size = 96; size >= 56; size--) {
    if (fitsOneLine(size)) return { size, width: COLUMN }
  }
  for (let size = 80; size >= 44; size -= 2) {
    const balanced = balancedWidth(measure, title, size)
    if (balanced.lines <= 2) return { size, width: balanced.width }
  }
  return { size: 44, width: COLUMN }
}

// Every word but the last carries a space as its right margin, and satori's
// flex wrap counts that margin.
function lineCount(widths: number[], space: number, width: number) {
  let lines = 1
  let x = 0
  widths.forEach((w, i) => {
    const item = w + (i < widths.length - 1 ? space : 0)
    if (x > 0 && satoriWidth(x + item) > width) {
      lines++
      x = 0
    }
    x += item
  })
  return lines
}

/** The narrowest width that keeps the line count the column gives. */
function balancedWidth(measure: TextMeasure, title: string, size: number) {
  const space = measure.width(' ', size, 700)
  const widths = title
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => measure.width(word, size, 700))
  const lines = lineCount(widths, space, COLUMN)
  let lo = Math.max(...widths)
  let hi = COLUMN
  while (hi - lo > 1) {
    const mid = (lo + hi) / 2
    if (lineCount(widths, space, mid) <= lines) hi = mid
    else lo = mid
  }
  return { width: Math.min(COLUMN, Math.ceil(hi)), lines }
}
