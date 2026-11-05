import type { ReactNode } from 'react'
import { type Box, heartGlow, heartRings, ringsClearOf } from './echo'
import { GLOW_REACH, glowBehind, onDarkGround } from './logo'
import { HEART_RATIO, heart, INK, lockup, PINK, place, WHITE } from './marks'
import { drawnBox, OG_SIZE, rasterize, rowExtents } from './render'
import { balancedLines, type TextMeasure } from './text'

// Every OG image but home's: the logo's heart glowing on the right, its echo
// spreading across the canvas, and a pink label over a big white title on the
// left, with a project's own logo beside them. Long titles run over the heart,
// so it carries no letters, and the full lockup signs the top-left corner
// instead: a bare heart doesn't say ETHBEAT.

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
// A description under the title lifts the title by `lift`, so the block keeps
// its weight in the middle of the card; `gap` runs from the title's last
// baseline to the description's top. It may take up to `lines` lines, so it
// keeps clear of the heart across that many.
const DESCRIPTION = {
  size: 34,
  lineHeight: 1.3,
  lines: 3,
  lift: 34,
  gap: 48,
  color: `${WHITE}CC`,
}
// From the label's baseline down to the top of the title's capitals.
const LABEL_TO_TITLE = 42
const LABEL = { size: 40, min: 30, lineHeight: 1.2, tracking: 1.4 / 24 }
// A logo runs from the label's cap top to the title's baseline, so its edges
// line up with both, and text starts `gap` right of it. Its corners round like
// an app icon's.
const LOGO = { gap: 32, radius: 0.22 }
// How far a line's letters reach above and below its baseline, in em: Roboto's
// tallest lowercase and its descenders.
const LETTERS = { above: 0.76, below: 0.22 }

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

// Drawn on first use, not on import: the server imports this for token images.
// The rings go on a layer of their own, cut away around each image's text.
let decor: string | undefined
const frameDecor = () =>
  (decor ??= rasterize(
    heartGlow(placement) + heart(placement) + lockup(signature),
  ))
let rings: string | undefined
const frameRings = () => (rings ??= rasterize(heartRings(placement)))
let signatureBox: Box | undefined
const frameSignatureBox = () => (signatureBox ??= drawnBox(lockup(signature)))

let heartRows: { start: number; end: number }[] | undefined
/**
 * The heart's fill across the canvas rows from `top` to `bottom`: the nearest
 * and the furthest it starts from the left, and the nearest it ends on the
 * right. Both sides slant, so text has to check the rows its letters cover.
 */
export function heartFillBetween(top: number, bottom: number) {
  heartRows ??= rowExtents(heart(placement))
  const rows = heartRows.slice(
    Math.max(0, Math.floor(top)),
    Math.ceil(bottom) + 1,
  )
  return {
    nearestStart: Math.min(...rows.map((row) => row.start)),
    furthestStart: Math.max(...rows.map((row) => row.start)),
    nearestEnd: Math.min(...rows.map((row) => row.end)),
  }
}

/** Where the title's first baseline sits: higher when a description goes under it. */
export function titleBaseline(withDescription: boolean) {
  return withDescription ? TITLE_BASELINE - DESCRIPTION.lift : TITLE_BASELINE
}

/** The box the letters of a line of text cover. */
export function lineBox(
  left: number,
  baseline: number,
  width: number,
  size: number,
): Box {
  return {
    x0: left,
    y0: baseline - LETTERS.above * size,
    x1: left + width,
    y1: baseline + LETTERS.below * size,
  }
}

/** Where the label and the title start beside a logo: it grows with the title. */
export function textLeftBesideLogo(
  measure: TextMeasure,
  titleSize: number,
  withLabel: boolean,
) {
  return MARGIN + logoSize(measure, titleSize, withLabel) + LOGO.gap
}

function logoSize(measure: TextMeasure, titleSize: number, withLabel: boolean) {
  const title = measure.capHeight(titleSize)
  return withLabel
    ? title + LABEL_TO_TITLE + measure.capHeight(LABEL.size)
    : title
}

export function HeartbeatFrame({
  measure,
  label,
  title,
  titleSize,
  titleLineWidths,
  titleInkLeft,
  description,
  logo,
}: {
  measure: TextMeasure
  label: string | undefined
  title: ReactNode
  titleSize: number
  titleLineWidths: number[]
  /** The title's first-letter side bearing, so its ink starts on the margin. */
  titleInkLeft: number
  description: string | undefined
  /** A data URI. */
  logo: string | undefined
}) {
  const baseline = titleBaseline(description !== undefined)
  const capTop = baseline - measure.capHeight(titleSize)
  const textLeft =
    logo === undefined
      ? MARGIN
      : textLeftBesideLogo(measure, titleSize, label !== undefined)
  const logoHeight = textLeft - LOGO.gap - MARGIN
  const labelBaseline = capTop - LABEL_TO_TITLE
  const fittedLabel =
    label === undefined
      ? undefined
      : fitLabel(measure, label, labelBaseline, textLeft)
  const descriptionLaidOut =
    description === undefined
      ? undefined
      : descriptionLayout(measure, description, {
          baseline,
          size: titleSize,
          lines: titleLineWidths.length,
        })

  const textBoxes: Box[] = [
    frameSignatureBox(),
    ...titleLineWidths.map((width, i) =>
      lineBox(
        textLeft,
        baseline + i * TITLE_LINE_HEIGHT * titleSize,
        width,
        titleSize,
      ),
    ),
  ]
  if (logo !== undefined) {
    textBoxes.push({
      x0: MARGIN,
      y0: baseline - logoHeight,
      x1: MARGIN + logoHeight,
      y1: baseline,
    })
  }
  if (fittedLabel !== undefined) {
    textBoxes.push(
      lineBox(textLeft, labelBaseline, fittedLabel.width, fittedLabel.size),
    )
  }
  if (descriptionLaidOut !== undefined) {
    textBoxes.push({
      x0: MARGIN,
      y0: descriptionLaidOut.top,
      x1: MARGIN + descriptionLaidOut.box,
      y1: descriptionLaidOut.bottom,
    })
  }

  return (
    <Canvas decor={frameDecor()}>
      <img
        src={rasterize(ringsClearOf(frameRings(), textBoxes))}
        alt=""
        {...OG_SIZE}
        style={{ position: 'absolute', left: 0, top: 0 }}
      />
      {logo !== undefined && (
        <Logo
          {...onDarkGround(logo)}
          size={logoHeight}
          top={baseline - logoHeight}
        />
      )}
      {fittedLabel && (
        <Label
          measure={measure}
          label={fittedLabel}
          baseline={labelBaseline}
          left={textLeft}
        />
      )}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: textLeft - titleInkLeft,
          top: baseline - measure.baseline(titleSize, TITLE_LINE_HEIGHT),
          width: COLUMN - (textLeft - MARGIN),
        }}
      >
        {title}
      </div>
      {description !== undefined && descriptionLaidOut !== undefined && (
        <Description
          measure={measure}
          text={description}
          layout={descriptionLaidOut}
        />
      )}
    </Canvas>
  )
}

/** The logo with app-icon corners, over a small pink glow when it needs one to stand out. */
function Logo({
  src,
  glow,
  size,
  top,
}: {
  src: string
  glow: boolean
  size: number
  top: number
}) {
  const reach = GLOW_REACH * size
  return (
    <>
      {glow && (
        <img
          src={glowBehind(src, LOGO.radius)}
          alt=""
          width={size + 2 * reach}
          height={size + 2 * reach}
          style={{
            position: 'absolute',
            left: MARGIN - reach,
            top: top - reach,
          }}
        />
      )}
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        style={{
          position: 'absolute',
          left: MARGIN,
          top,
          borderRadius: size * LOGO.radius,
        }}
      />
    </>
  )
}

/** Where a description goes under the title: wrapped balanced, short of the heart. */
export function descriptionLayout(
  measure: TextMeasure,
  text: string,
  title: { baseline: number; size: number; lines: number },
) {
  const lastBaseline =
    title.baseline + (title.lines - 1) * TITLE_LINE_HEIGHT * title.size
  const top = lastBaseline + DESCRIPTION.gap
  const lineHeight = DESCRIPTION.lineHeight * DESCRIPTION.size
  const heartStart = heartFillBetween(
    top,
    top + DESCRIPTION.lines * lineHeight,
  ).nearestStart
  const room = Math.min(COLUMN, heartStart - HEART_CLEARANCE - MARGIN)
  const { box, lines } = balancedLines(
    measure,
    text,
    DESCRIPTION.size,
    600,
    room,
  )
  return {
    top,
    box,
    lines: lines.length,
    bottom: top + lines.length * lineHeight,
  }
}

/** A line or two on what the page is for. */
function Description({
  measure,
  text,
  layout,
}: {
  measure: TextMeasure
  text: string
  layout: ReturnType<typeof descriptionLayout>
}) {
  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        left: MARGIN - measure.inkLeft(text, DESCRIPTION.size, 600),
        top: layout.top,
        width: layout.box,
        fontSize: DESCRIPTION.size,
        fontWeight: 600,
        lineHeight: DESCRIPTION.lineHeight,
        color: DESCRIPTION.color,
        textShadow: TEXT_HALO,
      }}
    >
      {text}
    </div>
  )
}

/** The label in caps, shrunk if it would reach the heart, down to 30 px: pink on pink would vanish. */
function fitLabel(
  measure: TextMeasure,
  text: string,
  baseline: number,
  left: number,
) {
  const caps = text.toUpperCase()
  const heartStart = heartFillBetween(
    baseline - measure.capHeight(LABEL.size),
    baseline,
  ).nearestStart
  const room = heartStart - HEART_CLEARANCE - left
  const width = (size: number) =>
    measure.width(caps, size, 600, LABEL.tracking * size)
  let size = LABEL.size
  while (size > LABEL.min && width(size) > room) size -= 0.5
  return { caps, size, width: width(size) }
}

function Label({
  measure,
  label: { caps, size },
  baseline,
  left,
}: {
  measure: TextMeasure
  label: ReturnType<typeof fitLabel>
  baseline: number
  left: number
}) {
  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        left: left - measure.inkLeft(caps, size, 600),
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
