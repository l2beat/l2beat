import { heartEcho } from './heartbeat/echo'
import { Canvas, MARGIN, type TitlePart, wordSpans } from './heartbeat/Frame'
import { INK, lockup, placeCentred } from './heartbeat/marks'
import { OG_SIZE, rasterize } from './heartbeat/render'
import { satoriWidth, type TextMeasure } from './heartbeat/text'

// The full lockup in the middle, its heart echoing out across the canvas, and
// the tagline centred under it.

const HEART_HEIGHT = 280
const LOCKUP_TO_TAGLINE = 52
// The rings fade out in an ellipse this much wider and taller than the
// tagline: they cross it, and "heartbeat" is as pink as they are.
const TAGLINE_FADE = { width: 1.3, height: 1.8 }
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
  const fade = taglineFade(taglineTop + (size * 1.06) / 2, size)
  return (
    <Canvas decor={rasterize(heartEcho(logo) + fade + lockup(logo))}>
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

function taglineFade(centre: number, size: number) {
  const rx = ((W - 2 * MARGIN) / 2) * TAGLINE_FADE.width
  const ry = size * TAGLINE_FADE.height
  return (
    `<defs><radialGradient id="taglineFade" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(${W / 2} ${centre}) scale(${rx} ${ry})">` +
    `<stop offset="0" stop-color="${INK}" stop-opacity="0.9"/>` +
    `<stop offset="0.6" stop-color="${INK}" stop-opacity="0.9"/>` +
    `<stop offset="1" stop-color="${INK}" stop-opacity="0"/>` +
    `</radialGradient></defs><rect width="${W}" height="${H}" fill="url(#taglineFade)"/>`
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
