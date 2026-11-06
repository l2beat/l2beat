import type { UnixTime } from '@l2beat/shared-pure'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useAnimationFrame } from '~/hooks/useAnimationFrame'
import { useElementSize } from '~/hooks/useElementSize'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { type ThemeTokens, useThemeTokens } from '~/hooks/useThemeTokens'
import { cn } from '~/utils/cn'
import { toRgba } from '~/utils/color'
import { prepareCanvas } from '~/utils/prepareCanvas'
import {
  clipPoints,
  secondsPerBeat,
  type TraceWindow,
  toBeats,
  tracePoints,
} from './ekg'

/** Seconds the pen takes across, as a monitor sweeps the screen */
export const SWEEP_SECONDS = 60
/**
 * Seconds the pen runs behind the clock: blocks reach the page up to this
 * late, as the backend looks for new ones every 10 s and the page asks every
 * 2 s. A block in by then is drawn as the pen gets to it, never all at once
 */
export const TRACE_DELAY = 30
/** Grid lines, as on ECG paper */
const GRID_SECONDS = 5
/** Of the width: the blank the pen clears ahead of itself, and its glow behind */
const ERASED = 0.03
const AFTERGLOW = 0.15
/** A pen moving a few pixels a second needs no more */
const FRAMES_PER_SECOND = 30
/** Of the height: the line the beats start from, and the tallest spike */
const BASELINE = 0.7
const SPIKE = 0.6

/**
 * A pen sweeps the row left to right, drawing the chain's beats as it reaches
 * their time, over what it drew a sweep ago. Each sweep keeps the scale it
 * starts with, so a beat never changes height once drawn
 */
export function EkgTrace({
  seconds,
  newest,
  bold = false,
  className,
}: {
  /** [second, transactions] of every second with a block */
  seconds: [UnixTime, number][]
  /** No line is drawn past the newest block, so a chain running behind shows a gap */
  newest: UnixTime
  /** For the line of every chain together */
  bold?: boolean
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const size = useElementSize(ref)
  const tokens = useThemeTokens()
  const still = usePrefersReducedMotion()
  const onScreen = useIsOnScreen(ref)
  const lastDrawn = useRef(0)
  const scales = useRef(new Map<number, number>())
  const perBeat = secondsPerBeat(size.width / SWEEP_SECONDS)
  const beats = useMemo(() => toBeats(seconds, perBeat), [seconds, perBeat])

  const draw = useCallback(
    (now: number) => {
      const canvas = ref.current
      if (!canvas || size.width === 0) return
      const context = prepareCanvas(canvas, size.width, size.height)
      if (!context) return
      const { width, height } = size
      const time = now - TRACE_DELAY
      const busiest = () =>
        Math.max(0, ...beats.map(([, transactions]) => transactions))
      const line = (window: TraceWindow, scale: number) =>
        tracePoints(beats, perBeat, scale, window)
      const style = { tokens, width, height, newest, bold }
      context.clearRect(0, 0, width, height)
      drawGrid(context, tokens, width, height)

      if (still) {
        const window = { from: time - SWEEP_SECONDS, to: time, width }
        drawPart(context, line(window, busiest()), window, 0, width, 1, style)
        return
      }

      const scaleOf = (sweep: number) => {
        let scale = scales.current.get(sweep)
        if (scale === undefined) {
          scale = busiest()
          scales.current.set(sweep, scale)
          scales.current.delete(sweep - 2)
        }
        return scale
      }
      const sweep = Math.floor(time / SWEEP_SECONDS)
      const pen = ((time - sweep * SWEEP_SECONDS) / SWEEP_SECONDS) * width
      const previous = windowOf(sweep - 1, width)
      const current = windowOf(sweep, width)
      const erased = Math.max(12, width * ERASED)
      drawPart(
        context,
        line(previous, scaleOf(sweep - 1)),
        previous,
        pen + erased,
        width,
        0.4,
        style,
      )
      const drawn = line(current, scaleOf(sweep))
      const reached = drawPart(context, drawn, current, 0, pen, 1, style)
      drawPen(context, drawn, pen, reached, style)
    },
    [beats, perBeat, newest, bold, size, tokens, still],
  )

  useAnimationFrame((_, now) => {
    if (now - lastDrawn.current < 1 / FRAMES_PER_SECOND) return
    lastDrawn.current = now
    draw(Date.now() / 1000)
  }, onScreen && !still)
  // still, it moves on only as new blocks come
  useEffect(() => {
    if (still) draw(Date.now() / 1000)
  }, [draw, still])

  return (
    <canvas ref={ref} className={cn('block w-full', className)} aria-hidden />
  )
}

interface TraceStyle {
  tokens: ThemeTokens
  width: number
  height: number
  newest: UnixTime
  bold: boolean
}

function windowOf(sweep: number, width: number): TraceWindow {
  return {
    from: sweep * SWEEP_SECONDS,
    to: (sweep + 1) * SWEEP_SECONDS,
    width,
  }
}

function drawGrid(
  context: CanvasRenderingContext2D,
  tokens: ThemeTokens,
  width: number,
  height: number,
) {
  context.lineWidth = 1
  context.strokeStyle = toRgba(tokens.brand, tokens.isDark ? 0.14 : 0.12)
  context.beginPath()
  const step = (GRID_SECONDS / SWEEP_SECONDS) * width
  for (let x = step; x < width; x += step) {
    context.moveTo(Math.round(x) + 0.5, 0)
    context.lineTo(Math.round(x) + 0.5, height)
  }
  context.stroke()
}

/**
 * Draws the line from `from` to `to` across, solid as far as the newest block
 * and dotted past it. Returns where the solid line ends
 */
function drawPart(
  context: CanvasRenderingContext2D,
  points: [number, number][],
  window: TraceWindow,
  from: number,
  to: number,
  alpha: number,
  { tokens, height, newest, bold }: TraceStyle,
): number {
  if (to <= from) return from
  const pixelsPerSecond = window.width / (window.to - window.from)
  const solidTo = Math.min(to, (newest + 1 - window.from) * pixelsPerSecond)
  const baseline = height * BASELINE

  if (solidTo < to) {
    context.setLineDash([2, 4])
    context.lineWidth = 1
    context.strokeStyle = toRgba(tokens.secondary, 0.5 * alpha)
    context.beginPath()
    context.moveTo(Math.max(from, solidTo), baseline)
    context.lineTo(to, baseline)
    context.stroke()
    context.setLineDash([])
  }
  if (solidTo <= from) return from

  tracePath(context, clipPoints(points, from, solidTo), height)
  context.lineJoin = 'round'
  if (tokens.isDark) {
    context.strokeStyle = toRgba(tokens.brand, 0.25 * alpha)
    context.lineWidth = bold ? 6 : 4
    context.stroke()
  }
  context.strokeStyle = toRgba(tokens.brand, alpha)
  context.lineWidth = bold ? 2 : 1.5
  context.stroke()
  return solidTo
}

/** The pen, and the glow the line keeps for a moment behind it */
function drawPen(
  context: CanvasRenderingContext2D,
  points: [number, number][],
  pen: number,
  reached: number,
  { tokens, width, height, bold }: TraceStyle,
) {
  const tail = width * AFTERGLOW
  if (reached > 0) {
    tracePath(context, clipPoints(points, reached - tail, reached), height)
    const glow = context.createLinearGradient(reached - tail, 0, reached, 0)
    glow.addColorStop(0, toRgba('#ffffff', 0))
    glow.addColorStop(1, toRgba('#ffffff', tokens.isDark ? 0.8 : 0.6))
    context.strokeStyle = glow
    context.lineWidth = bold ? 2 : 1.5
    context.stroke()
  }

  // on the line where it is drawn, or at the line's height ahead of it
  const x = reached > 0 ? reached : pen
  const level = clipPoints(points, x, x)[0]?.[1] ?? 0
  const y = height * BASELINE - level * height * SPIKE
  context.fillStyle = toRgba(tokens.brand, 0.3)
  context.beginPath()
  context.arc(x, y, bold ? 7 : 6, 0, 2 * Math.PI)
  context.fill()
  context.fillStyle = tokens.brand
  context.beginPath()
  context.arc(x, y, bold ? 3 : 2.5, 0, 2 * Math.PI)
  context.fill()
}

function tracePath(
  context: CanvasRenderingContext2D,
  points: [number, number][],
  height: number,
) {
  const baseline = height * BASELINE
  context.beginPath()
  for (const [i, [x, level]] of points.entries()) {
    const y = baseline - level * height * SPIKE
    if (i === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  }
}
