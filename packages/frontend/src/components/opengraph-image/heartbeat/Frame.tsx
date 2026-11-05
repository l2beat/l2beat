import type { ReactNode } from 'react'
import { heartEcho } from './echo'
import { HEART_RATIO, INK, lockup, PINK, place, WHITE } from './marks'
import { OG_SIZE, rasterize } from './render'
import type { TextMeasure } from './text'

// Every OG image but home's: the logo's heart glowing on the right, its echo
// spreading across the canvas, and a pink label over the title on the left.

export const MARGIN = 72
/** The title column, from the margin to short of the heart's first ring. */
export const COLUMN = 528

const HEART_HEIGHT = 400
const LABEL_TO_TITLE = 16
const LABEL = { size: 32, min: 28, tracking: 1.4 / 24 }

const heart = place(
  OG_SIZE.width - MARGIN - (HEART_HEIGHT * HEART_RATIO) / 2,
  OG_SIZE.height / 2,
  HEART_HEIGHT,
)
// Drawn on first use, not on import: the server imports this for token images.
let decor: string | undefined
const frameDecor = () =>
  (decor ??= rasterize(heartEcho(heart) + lockup(heart, { withBeat: false })))

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

/** Shrinks a label too long for the column, down to 28 px. */
function Label({ measure, text }: { measure: TextMeasure; text: string }) {
  const caps = text.toUpperCase()
  let size = LABEL.size
  while (
    size > LABEL.min &&
    measure.width(caps, size, 600, LABEL.tracking * size) > COLUMN
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
