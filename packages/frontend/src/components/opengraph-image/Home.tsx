import { heartEcho } from './heartbeat/echo'
import { Canvas, MARGIN, type TitlePart, wordSpans } from './heartbeat/Frame'
import { lockup, placeCentred } from './heartbeat/marks'
import { OG_SIZE, rasterize } from './heartbeat/render'
import { satoriWidth, type TextMeasure } from './heartbeat/text'

// The full lockup in the middle, its heart echoing out across the canvas, and
// the tagline centred under it.

const HEART_HEIGHT = 280
const LOCKUP_TO_TAGLINE = 52
// The rings fade out around the tagline: they crossed it, and "heartbeat" is
// as pink as they are. Only the rings fade, not the glow: darkening the ground
// there showed as a patch of its own. The clearing is `width` times as wide as
// the tagline's room and `height` times its size tall.
const TAGLINE_CLEARING = { width: 1.3, height: 1.9 }
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
  const taglineTop = top + HEART_HEIGHT + LOCKUP_TO_TAGLINE
  const clearing = {
    cx: W / 2,
    cy: taglineTop + (size * 1.06) / 2,
    rx: ((W - 2 * MARGIN) / 2) * TAGLINE_CLEARING.width,
    ry: size * TAGLINE_CLEARING.height,
  }
  return (
    <Canvas decor={rasterize(heartEcho(logo, clearing) + lockup(logo))}>
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
