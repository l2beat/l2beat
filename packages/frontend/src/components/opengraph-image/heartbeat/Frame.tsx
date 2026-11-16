import type { ReactNode } from 'react'
import { boxOutline, heartGlow, heartRings, ringsClearOf } from './echo'
import { type DarkGroundLogo, GLOW_REACH, glowBehind } from './logo'
import { HEART_RATIO, heart, INK, lockup, PINK, place, WHITE } from './marks'
import { type Box, drawnBox, OG_SIZE, rasterize, rowExtents } from './render'
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
export const TITLE_LINE_HEIGHT = 1.06
// The text block, from the label's capitals to the title's last baseline (or
// the description's bottom), centres on the heart, but starts at least
// `belowSignature` under the corner lockup.
const BLOCK = { centre: OG_SIZE.height / 2, belowSignature: 52 }
// `gap` runs from the title's last baseline to the description's top. It may
// take up to `lines` lines, so it keeps clear of the heart across that many.
const DESCRIPTION = {
  size: 34,
  lineHeight: 1.3,
  lines: 3,
  gap: 40,
  color: `${WHITE}E6`,
}
// From the label's baseline down to the top of the title's capitals.
const LABEL_TO_TITLE = 32
const LABEL = { size: 40, min: 30, lineHeight: 1.2, tracking: 1.4 / 24 }
// A logo's drawn part runs from the label's cap top to the title's baseline, so
// its edges line up with both (a wide one gets as wide as that span is tall,
// centred on it), and text starts `gap` right of it. Its corners round like an
// app icon's.
const LOGO = { gap: 32, radius: 0.22 }

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

/** Where the title's first baseline sits so the text block centres on the heart. */
export function titleBaseline(
  measure: TextMeasure,
  block: {
    titleSize: number
    titleLines: number
    withLabel: boolean
    descriptionLines: number
  },
) {
  const above =
    (block.withLabel ? measure.capHeight(LABEL.size) + LABEL_TO_TITLE : 0) +
    measure.capHeight(block.titleSize)
  const below =
    (block.titleLines - 1) * TITLE_LINE_HEIGHT * block.titleSize +
    (block.descriptionLines > 0
      ? DESCRIPTION.gap +
        block.descriptionLines * DESCRIPTION.lineHeight * DESCRIPTION.size
      : 0)
  const top = Math.max(
    BLOCK.centre - (above + below) / 2,
    frameSignatureBox().y1 + BLOCK.belowSignature,
  )
  return top + above
}

/**
 * Path data of a line of title-style words (see `wordSpans`) whose first
 * letter's ink starts at `left`, so rings can be cut away around them.
 */
export function wordsOutline(
  measure: TextMeasure,
  line: string,
  left: number,
  baseline: number,
  size: number,
) {
  const space = measure.width(' ', size, 700)
  const tracking = -0.01 * size
  let x = left - measure.inkLeft(line, size, 700)
  return line
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const outline = measure.outline(word, x, baseline, size, 700, tracking)
      x += measure.width(word, size, 700, tracking) + space
      return outline
    })
    .join('')
}

/** Where the label and the title start beside a logo: it grows with the title. */
export function textLeftBesideLogo(
  measure: TextMeasure,
  titleSize: number,
  withLabel: boolean,
  ink: DarkGroundLogo['ink'],
) {
  const span = logoSpan(measure, titleSize, withLabel)
  return MARGIN + logoInkSize(span, ink).width + LOGO.gap
}

/** From the label's cap top (or the title's) to the title's first baseline. */
function logoSpan(measure: TextMeasure, titleSize: number, withLabel: boolean) {
  const title = measure.capHeight(titleSize)
  return withLabel
    ? title + LABEL_TO_TITLE + measure.capHeight(LABEL.size)
    : title
}

/** How big a logo's drawn part shows: as tall as the span, and no wider. */
function logoInkSize(span: number, ink: DarkGroundLogo['ink']) {
  const aspect = (ink.x1 - ink.x0) / (ink.y1 - ink.y0)
  return aspect > 1
    ? { width: span, height: span / aspect }
    : { width: span * aspect, height: span }
}

export function HeartbeatFrame({
  measure,
  label,
  title,
  titleSize,
  titleBaseline: baseline,
  description,
  logo,
}: {
  measure: TextMeasure
  label: string | undefined
  /** The title, line by line. */
  title: string[]
  titleSize: number
  titleBaseline: number
  description: string | undefined
  logo: DarkGroundLogo | undefined
}) {
  const capTop = baseline - measure.capHeight(titleSize)
  const span = logoSpan(measure, titleSize, label !== undefined)
  const logoInk = logo && logoInkSize(span, logo.ink)
  const textLeft =
    logoInk === undefined ? MARGIN : MARGIN + logoInk.width + LOGO.gap
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
          lines: title.length,
        })
  const logoInkTop =
    logoInk === undefined ? 0 : baseline - span + (span - logoInk.height) / 2

  // The rings stay off everything drawn over them.
  const outline = [
    boxOutline(frameSignatureBox()),
    ...title.map((line, i) =>
      wordsOutline(
        measure,
        line,
        textLeft,
        baseline + i * TITLE_LINE_HEIGHT * titleSize,
        titleSize,
      ),
    ),
    logoInk === undefined
      ? ''
      : boxOutline({
          x0: MARGIN,
          y0: logoInkTop,
          x1: MARGIN + logoInk.width,
          y1: logoInkTop + logoInk.height,
        }),
    fittedLabel === undefined
      ? ''
      : measure.outline(
          fittedLabel.caps,
          textLeft - measure.inkLeft(fittedLabel.caps, fittedLabel.size, 600),
          labelBaseline,
          fittedLabel.size,
          600,
          LABEL.tracking * fittedLabel.size,
        ),
    descriptionLaidOut === undefined
      ? ''
      : descriptionOutline(measure, descriptionLaidOut),
  ].join('')

  return (
    <Canvas decor={frameDecor()}>
      <img
        src={rasterize(ringsClearOf(frameRings(), outline))}
        alt=""
        {...OG_SIZE}
        style={{ position: 'absolute', left: 0, top: 0 }}
      />
      {logo !== undefined && logoInk !== undefined && (
        <Logo logo={logo} inkHeight={logoInk.height} inkTop={logoInkTop} />
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
          left: textLeft,
          top: baseline - measure.baseline(titleSize, TITLE_LINE_HEIGHT),
          flexDirection: 'column',
        }}
      >
        {title.map((line) => (
          <div
            key={line}
            style={{
              display: 'flex',
              marginLeft: -measure.inkLeft(line, titleSize, 700),
            }}
          >
            {wordSpans({ parts: [line], size: titleSize, measure })}
          </div>
        ))}
      </div>
      {descriptionLaidOut !== undefined && (
        <Description measure={measure} layout={descriptionLaidOut} />
      )}
    </Canvas>
  )
}

/**
 * The logo with app-icon corners, its drawn part `inkHeight` tall from
 * `inkTop` and starting on the margin, over a small pink glow when it needs
 * one to stand out.
 */
function Logo({
  logo: { src, glow, ink },
  inkHeight,
  inkTop,
}: {
  logo: DarkGroundLogo
  inkHeight: number
  inkTop: number
}) {
  const side = inkHeight / (ink.y1 - ink.y0)
  const left = MARGIN - ink.x0 * side
  const top = inkTop - ink.y0 * side
  const reach = GLOW_REACH * side
  return (
    <>
      {glow && (
        <img
          src={glowBehind(src, LOGO.radius)}
          alt=""
          width={side + 2 * reach}
          height={side + 2 * reach}
          style={{ position: 'absolute', left: left - reach, top: top - reach }}
        />
      )}
      <img
        src={src}
        alt=""
        width={side}
        height={side}
        style={{
          position: 'absolute',
          left,
          top,
          borderRadius: side * LOGO.radius,
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
  const lines = balancedLines(measure, text, DESCRIPTION.size, 600, room)
  return { top, lines, bottom: top + lines.length * lineHeight }
}

function descriptionOutline(
  measure: TextMeasure,
  layout: ReturnType<typeof descriptionLayout>,
) {
  const lineHeight = DESCRIPTION.lineHeight * DESCRIPTION.size
  const baseline = measure.baseline(DESCRIPTION.size, DESCRIPTION.lineHeight)
  return layout.lines
    .map((line, i) =>
      measure.outline(
        line,
        MARGIN - measure.inkLeft(line, DESCRIPTION.size, 600),
        layout.top + i * lineHeight + baseline,
        DESCRIPTION.size,
        600,
      ),
    )
    .join('')
}

/** A line or two on what the page is for, each line starting its ink on the margin. */
function Description({
  measure,
  layout,
}: {
  measure: TextMeasure
  layout: ReturnType<typeof descriptionLayout>
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        left: MARGIN,
        top: layout.top,
        fontSize: DESCRIPTION.size,
        fontWeight: 600,
        lineHeight: DESCRIPTION.lineHeight,
        color: DESCRIPTION.color,
        textShadow: TEXT_HALO,
      }}
    >
      {layout.lines.map((line) => (
        <div
          key={line}
          style={{
            display: 'flex',
            marginLeft: -measure.inkLeft(line, DESCRIPTION.size, 600),
            whiteSpace: 'nowrap',
          }}
        >
          {line}
        </div>
      ))}
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
 * Words as separate spans, so one phrase can take the highlight colour. A
 * space becomes the word's right margin. A plain function, not a component:
 * satori can't render a component that returns a list.
 */
export function wordSpans({
  parts,
  size,
  measure,
}: {
  parts: TitlePart[]
  size: number
  measure: TextMeasure
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
        lineHeight: TITLE_LINE_HEIGHT,
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
// only 3.5:1.
const TEXT_HALO = `0 1px 6px ${INK}4D`
