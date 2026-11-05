import { heartEcho } from './heartbeat/echo'
import { Canvas, MARGIN, type TitlePart, wordSpans } from './heartbeat/Frame'
import { lockup, placeCentred } from './heartbeat/marks'
import { OG_SIZE, rasterize } from './heartbeat/render'
import { satoriWidth, type TextMeasure } from './heartbeat/text'

// The full lockup in the middle, its heart echoing out across the canvas, and
// the tagline centred under it.

const HEART_HEIGHT = 280
const LOCKUP_TO_TAGLINE = 52
const TAGLINE_MAX_SIZE = 56
const TAGLINE: TitlePart[] = [
  'The ',
  { highlight: 'heartbeat' },
  ' of the Ethereum ecosystem',
]

const { width: W, height: H } = OG_SIZE

export function HomeOpengraphImage({ measure }: { measure: TextMeasure }) {
  const size = taglineSize(measure)
  const blockHeight = HEART_HEIGHT + LOCKUP_TO_TAGLINE + size * 1.06
  const top = (H - blockHeight) / 2
  const logo = placeCentred(W / 2, top + HEART_HEIGHT / 2, HEART_HEIGHT)
  return (
    <Canvas decor={rasterize(heartEcho(logo) + lockup(logo))}>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: 0,
          width: W,
          top: top + HEART_HEIGHT + LOCKUP_TO_TAGLINE,
          justifyContent: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {wordSpans({ parts: TAGLINE, size, measure })}
      </div>
    </Canvas>
  )
}

/** The largest size, up to 56 px, at which the tagline fits one line between the margins. */
function taglineSize(measure: TextMeasure) {
  const text = TAGLINE.map((part) =>
    typeof part === 'string' ? part : part.highlight,
  ).join('')
  let size = TAGLINE_MAX_SIZE
  while (
    satoriWidth(measure.width(text, size, 700, -0.01 * size)) >
    W - 2 * MARGIN
  ) {
    size--
  }
  return size
}
