import { Canvas, MARGIN, type TitlePart, wordSpans } from './heartbeat/Frame'
import {
  heartLeftAt,
  INK,
  lockup,
  PINK,
  placeByRight,
  pulse,
  pulseY,
  stroke,
  svgDataUri,
  WHITE,
} from './heartbeat/marks'
import { OG_SIZE } from './heartbeat/render'
import type { TextMeasure } from './heartbeat/text'

// The X header's layout: a pink block on the left, the heartbeat running from
// it into the full lockup, and the tagline right-aligned under the lockup.

const PANEL_WIDTH = 250
const HEART_HEIGHT = 272
const LOCKUP_TO_TAGLINE = 36
const TAGLINE_SIZE = 72
const TAGLINE_LINE_HEIGHT = 1.06
// Rows set by hand, so the break falls where it reads best.
const TAGLINE: TitlePart[][] = [
  ['The ', { highlight: 'heartbeat' }, ' of the'],
  ['Ethereum ecosystem'],
]

const { width: W, height: H } = OG_SIZE
const blockHeight =
  HEART_HEIGHT +
  LOCKUP_TO_TAGLINE +
  TAGLINE.length * TAGLINE_SIZE * TAGLINE_LINE_HEIGHT
const top = (H - blockHeight) / 2
const logo = placeByRight(W - MARGIN, top + HEART_HEIGHT / 2, HEART_HEIGHT)
const lineY = pulseY(logo)
const line = pulse({
  x0: 0,
  x1: heartLeftAt(logo, lineY) + 4,
  y: lineY,
  scale: 0.9,
})
// The line is white on the pink block and ink on white.
const decor = svgDataUri(
  W,
  H,
  `<rect width="${PANEL_WIDTH}" height="${H}" fill="${PINK}"/>` +
    `<clipPath id="pink"><rect width="${PANEL_WIDTH}" height="${H}"/></clipPath>` +
    `<clipPath id="white"><rect x="${PANEL_WIDTH}" width="${W - PANEL_WIDTH}" height="${H}"/></clipPath>` +
    stroke(line, WHITE, 'clip-path="url(#pink)"') +
    stroke(line, INK, 'clip-path="url(#white)"') +
    lockup(logo),
)

export function HomeOpengraphImage({ measure }: { measure: TextMeasure }) {
  return (
    <Canvas decor={decor}>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          right: MARGIN,
          top: top + HEART_HEIGHT + LOCKUP_TO_TAGLINE,
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        {TAGLINE.map((row, i) => (
          <div key={i} style={{ display: 'flex', whiteSpace: 'nowrap' }}>
            {wordSpans({
              parts: row,
              size: TAGLINE_SIZE,
              measure,
              lineHeight: TAGLINE_LINE_HEIGHT,
            })}
          </div>
        ))}
      </div>
    </Canvas>
  )
}
