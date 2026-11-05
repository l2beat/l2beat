import type { ReactNode } from 'react'
import { heartEcho } from './echo'
import { HEART_RATIO, heart, INK, PINK, place, WHITE } from './marks'
import { OG_SIZE, rasterize } from './render'
import type { TextMeasure } from './text'

// Every OG image but home's: the logo's heart glowing on the right, its echo
// spreading across the canvas, and a pink label over a big white title on the
// left. Long titles run over the heart, which is why it carries no letters.

export const MARGIN = 72
/** The title column: the whole width between the margins. */
export const COLUMN = OG_SIZE.width - 2 * MARGIN

const HEART_HEIGHT = 440
const LABEL_TO_TITLE = 12
const LABEL = { size: 36, min: 28, tracking: 1.4 / 24 }
// The heart outline's left edge a little below its middle, where titles cross
// it, from its centre in the pieces' units. Measured on HEART's path.
const EDGE_DX = -141

const placement = place(
  OG_SIZE.width - MARGIN - (HEART_HEIGHT * HEART_RATIO) / 2,
  OG_SIZE.height / 2,
  HEART_HEIGHT,
)
/** Where a title starts running over the heart. */
export const HEART_EDGE = placement.hx + placement.scale * EDGE_DX
/** How far short of the heart's edge text stops when it doesn't run over the heart. */
export const HEART_CLEARANCE = 32

// Drawn on first use, not on import: the server imports this for token images.
let decor: string | undefined
const frameDecor = () =>
  (decor ??= rasterize(heartEcho(placement) + heart(placement)))

export function HeartbeatFrame({
  measure,
  label,
  title,
  titleInkLeft,
}: {
  measure: TextMeasure
  label: string | undefined
  title: ReactNode
  /** The title's first-letter side bearing, so its ink starts on the margin. */
  titleInkLeft: number
}) {
  return (
    <Canvas decor={frameDecor()}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'absolute',
          left: MARGIN,
          top: 0,
          bottom: 0,
          width: COLUMN,
        }}
      >
        {label && <Label measure={measure} text={label} />}
        <div style={{ display: 'flex', marginLeft: -titleInkLeft }}>
          {title}
        </div>
      </div>
    </Canvas>
  )
}

/** Shrinks a label that would reach the heart, down to 28 px: pink on pink would vanish. */
function Label({ measure, text }: { measure: TextMeasure; text: string }) {
  const caps = text.toUpperCase()
  const room = HEART_EDGE - HEART_CLEARANCE - MARGIN
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
        marginLeft: -measure.inkLeft(caps, size, 600),
        marginBottom: LABEL_TO_TITLE,
        fontSize: size,
        fontWeight: 600,
        letterSpacing: LABEL.tracking * size,
        lineHeight: 1.2,
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
  lineHeight = 1.06,
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
        marginRight: spaced ? space : 0,
      }}
    >
      {word}
    </span>
  ))
}

export type TitlePart = string | { highlight: string }
