import type { ReactNode } from 'react'
import {
  beatsStart,
  HEART_RATIO,
  INK,
  lockup,
  PINK,
  place,
  pulse,
  pulseEntryX,
  pulseY,
  stroke,
  svgDataUri,
  WHITE,
} from './marks'
import { OG_SIZE } from './render'
import type { TextMeasure } from './text'

// Every OG image but home's: the logo's heart on the right, a heartbeat running
// into it at its middle, a pink label above the line and the title below it.

export const MARGIN = 72
/** The title column, from the margin to short of the beats. */
export const COLUMN = 528

const HEART_HEIGHT = 440
const PULSE_SCALE = 0.85
const LABEL_TO_LINE = 40 // clear of the beats, which rise about 26 px
const LINE_TO_TITLE = 30 // clear of the beats' dips
const LABEL_CLEARANCE = 24 // between the label's end and the first beat
const LABEL = { size: 32, min: 28, tracking: 1.4 / 24 }

const heart = place(
  OG_SIZE.width - MARGIN - (HEART_HEIGHT * HEART_RATIO) / 2,
  OG_SIZE.height / 2,
  HEART_HEIGHT,
)
const lineY = pulseY(heart)
const lineEnd = pulseEntryX(heart) + 4
const labelRoom = beatsStart(lineEnd, PULSE_SCALE) - LABEL_CLEARANCE - MARGIN
const decor = svgDataUri(
  OG_SIZE.width,
  OG_SIZE.height,
  stroke(pulse({ x0: 0, x1: lineEnd, y: lineY, scale: PULSE_SCALE }), INK) +
    lockup(heart, { withBeat: false }),
)

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
    <Canvas decor={decor}>
      {label && <Label measure={measure} text={label} />}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: MARGIN - titleInkLeft,
          top: lineY + LINE_TO_TITLE,
          width: COLUMN,
        }}
      >
        {title}
      </div>
    </Canvas>
  )
}

/** Shrinks a label too long for the room before the beats, down to 28 px. */
function Label({ measure, text }: { measure: TextMeasure; text: string }) {
  const caps = text.toUpperCase()
  let size = LABEL.size
  while (
    size > LABEL.min &&
    measure.width(caps, size, 600, LABEL.tracking * size) > labelRoom
  ) {
    size -= 0.5
  }
  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        left: MARGIN - measure.inkLeft(caps, size, 600),
        top: lineY - LABEL_TO_LINE - size * 1.2,
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

/** A white 1200×630 canvas with one SVG layer of decoration under the text. */
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
        backgroundColor: WHITE,
        fontFamily: 'roboto',
        color: INK,
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
    const color = typeof part === 'string' ? INK : PINK
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
