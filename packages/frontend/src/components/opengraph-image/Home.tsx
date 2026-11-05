import {
  boxOutline,
  heartGlow,
  heartRings,
  ringsClearOf,
} from './heartbeat/echo'
import {
  Canvas,
  MARGIN,
  type TitlePart,
  wordSpans,
  wordsOutline,
} from './heartbeat/Frame'
import { beatWord, lockup, placeCentred } from './heartbeat/marks'
import { drawnBox, OG_SIZE, rasterize } from './heartbeat/render'
import { satoriWidth, type TextMeasure } from './heartbeat/text'

// The full lockup in the middle, its heart echoing out across the canvas, and
// the tagline centred under it.

const HEART_HEIGHT = 280
const LOCKUP_TO_TAGLINE = 52
const TAGLINE_LINE_HEIGHT = 1.06
const TAGLINE_MAX_SIZE = 56
const TAGLINE: TitlePart[] = [
  'The ',
  { highlight: 'heartbeat' },
  ' of the Ethereum ecosystem',
]

const { width: W, height: H } = OG_SIZE

export function HomeOpengraphImage({ measure }: { measure: TextMeasure }) {
  const size = taglineSize(measure)
  const blockHeight =
    HEART_HEIGHT + LOCKUP_TO_TAGLINE + size * TAGLINE_LINE_HEIGHT
  const top = (H - blockHeight) / 2
  const logo = placeCentred(W / 2, top + HEART_HEIGHT / 2, HEART_HEIGHT)
  const taglineTop = top + HEART_HEIGHT + LOCKUP_TO_TAGLINE
  const width = taglineWidth(measure, size)
  // The rings are cut away around the tagline, where "heartbeat" is as pink as
  // they are, and around BEAT. They never reach the heart and its ETH.
  const text = taglineText()
  const tagline = wordsOutline(
    measure,
    text,
    (W - width) / 2 + measure.inkLeft(text, size, 700),
    taglineTop + measure.baseline(size, TAGLINE_LINE_HEIGHT),
    size,
  )
  const decor =
    heartGlow(logo) +
    ringsClearOf(
      rasterize(heartRings(logo)),
      tagline + boxOutline(drawnBox(beatWord(logo))),
    ) +
    lockup(logo)
  return (
    <Canvas decor={rasterize(decor)}>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: 0,
          width: W,
          top: taglineTop,
          justifyContent: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {wordSpans({
          parts: TAGLINE,
          size,
          measure,
          lineHeight: TAGLINE_LINE_HEIGHT,
        })}
      </div>
    </Canvas>
  )
}

/** The largest size, up to 56 px, at which the tagline fits one line between the margins. */
function taglineSize(measure: TextMeasure) {
  let size = TAGLINE_MAX_SIZE
  while (satoriWidth(taglineWidth(measure, size)) > W - 2 * MARGIN) size--
  return size
}

function taglineWidth(measure: TextMeasure, size: number) {
  return measure.width(taglineText(), size, 700, -0.01 * size)
}

const taglineText = () =>
  TAGLINE.map((part) =>
    typeof part === 'string' ? part : part.highlight,
  ).join('')
