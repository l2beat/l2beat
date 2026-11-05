import type { ReactNode } from 'react'
import { heartEcho } from './echo'
import { HEART_RATIO, heart, INK, lockup, PINK, place, WHITE } from './marks'
import { OG_SIZE, rasterize, rowStarts } from './render'
import type { TextMeasure } from './text'

// Every OG image but home's: the logo's heart glowing on the right, its echo
// spreading across the canvas, and a pink label over a big white title on the
// left. Long titles run over the heart, so it carries no letters, and the full
// lockup signs the top-left corner instead: a bare heart doesn't say ETHBEAT.

export const MARGIN = 72
/** The title column: the whole width between the margins. */
export const COLUMN = OG_SIZE.width - 2 * MARGIN

const HEART_HEIGHT = 400
// Any smaller and ETH gets hard to read in a card ~500 px wide.
const SIGNATURE_HEIGHT = 72
// Every title's first baseline sits here, so cards in a feed line up; a
// second line grows down from it.
export const TITLE_BASELINE = 382
export const TITLE_LINE_HEIGHT = 1.06
// From the label's baseline down to the top of the title's capitals.
const LABEL_TO_TITLE = 42
const LABEL = { size: 40, min: 30, lineHeight: 1.2, tracking: 1.4 / 24 }

const placement = place(
  OG_SIZE.width - MARGIN - (HEART_HEIGHT * HEART_RATIO) / 2,
  OG_SIZE.height / 2,
  HEART_HEIGHT,
)
/** How far short of the heart's edge text stops when it doesn't run over the heart. */
export const HEART_CLEARANCE = 24

const signature = place(
  MARGIN + (SIGNATURE_HEIGHT * HEART_RATIO) / 2,
  MARGIN + SIGNATURE_HEIGHT / 2,
  SIGNATURE_HEIGHT,
)

// The rings fade out in an ellipse over the corner lockup and the label: a
// ring running through small text cuts it.
const CORNER_FADE =
  '<defs><radialGradient id="cornerFade" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(190 200) scale(330 230)">' +
  `<stop offset="0" stop-color="${INK}" stop-opacity="0.85"/>` +
  `<stop offset="0.55" stop-color="${INK}" stop-opacity="0.85"/>` +
  `<stop offset="1" stop-color="${INK}" stop-opacity="0"/>` +
  `</radialGradient></defs><rect width="${OG_SIZE.width}" height="${OG_SIZE.height}" fill="url(#cornerFade)"/>`

// Drawn on first use, not on import: the server imports this for token images.
let decor: string | undefined
const frameDecor = () =>
  (decor ??= rasterize(
    heartEcho(placement) + CORNER_FADE + heart(placement) + lockup(signature),
  ))

let heartRows: number[] | undefined
/**
 * Where the heart's fill starts between two canvas rows: the nearest it comes
 * to text on those rows and the furthest right it starts. Its left side
 * slants, so text has to check the rows its own letters cover.
 */
export function heartEdgeBetween(top: number, bottom: number) {
  heartRows ??= rowStarts(heart(placement))
  const rows = heartRows.slice(
    Math.max(0, Math.floor(top)),
    Math.ceil(bottom) + 1,
  )
  return { nearest: Math.min(...rows), furthest: Math.max(...rows) }
}

export function HeartbeatFrame({
  measure,
  label,
  title,
  titleSize,
  titleInkLeft,
}: {
  measure: TextMeasure
  label: string | undefined
  title: ReactNode
  titleSize: number
  /** The title's first-letter side bearing, so its ink starts on the margin. */
  titleInkLeft: number
}) {
  const capTop = TITLE_BASELINE - measure.capHeight(titleSize)
  return (
    <Canvas decor={frameDecor()}>
      {label && (
        <Label
          measure={measure}
          text={label}
          baseline={capTop - LABEL_TO_TITLE}
        />
      )}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: MARGIN - titleInkLeft,
          top: TITLE_BASELINE - measure.baseline(titleSize, TITLE_LINE_HEIGHT),
          width: COLUMN,
        }}
      >
        {title}
      </div>
    </Canvas>
  )
}

/** Shrinks a label that would reach the heart, down to 30 px: pink on pink would vanish. */
function Label({
  measure,
  text,
  baseline,
}: {
  measure: TextMeasure
  text: string
  baseline: number
}) {
  const caps = text.toUpperCase()
  const heartEdge = heartEdgeBetween(
    baseline - measure.capHeight(LABEL.size),
    baseline,
  ).nearest
  const room = heartEdge - HEART_CLEARANCE - MARGIN
  let size = LABEL.size
  while (
    size > LABEL.min &&
    measure.width(caps, size, 600, LABEL.tracking * size) > room
  ) {
    size -= 0.5
  }
  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        left: MARGIN - measure.inkLeft(caps, size, 600),
        top: baseline - measure.baseline(size, LABEL.lineHeight),
        fontSize: size,
        fontWeight: 600,
        letterSpacing: LABEL.tracking * size,
        lineHeight: LABEL.lineHeight,
        color: PINK,
      }}
    >
      {caps}
    </div>
  )
}

/** A dark 1200×630 canvas with one image of decoration under the text. */
export function Canvas({
  decor,
  children,
}: {
  decor: string
  children: ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        ...OG_SIZE,
        backgroundColor: INK,
        fontFamily: 'roboto',
        color: WHITE,
      }}
    >
      <img
        src={decor}
        alt=""
        {...OG_SIZE}
        style={{ position: 'absolute', left: 0, top: 0 }}
      />
      {children}
    </div>
  )
}

/**
 * Words as separate flex items, so a title wraps like inline text and one
 * phrase can take the highlight colour. A space becomes the word's right margin.
 * A plain function, not a component: satori can't render a component that
 * returns a list.
 */
export function wordSpans({
  parts,
  size,
  measure,
  lineHeight = TITLE_LINE_HEIGHT,
}: {
  parts: TitlePart[]
  size: number
  measure: TextMeasure
  lineHeight?: number
}) {
  const space = measure.width(' ', size, 700)
  const words = parts.flatMap((part) => {
    const text = typeof part === 'string' ? part : part.highlight
    const color = typeof part === 'string' ? WHITE : PINK
    return text.split(/(\s+)/).map((word) => ({ word, color }))
  })
  const items: { word: string; color: string; spaced: boolean }[] = []
  for (const { word, color } of words) {
    if (!word) continue
    const last = items.at(-1)
    if (/^\s+$/.test(word)) {
      if (last) last.spaced = true
      continue
    }
    items.push({ word, color, spaced: false })
  }
  return items.map(({ word, color, spaced }, i) => (
    <span
      key={i}
      style={{
        fontSize: size,
        fontWeight: 700,
        lineHeight,
        letterSpacing: -0.01 * size,
        color,
        textShadow: TEXT_HALO,
        marginRight: spaced ? space : 0,
      }}
    >
      {word}
    </span>
  ))
}

export type TitlePart = string | { highlight: string }

// Darkens the ground just around the letters: white on the heart's pink is
// 3.5:1, and the rings crossing a line of text read as strikes.
const TEXT_HALO = `0 1px 12px ${INK}4D`
