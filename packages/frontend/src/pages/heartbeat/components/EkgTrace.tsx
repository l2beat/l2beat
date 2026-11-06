import type { UnixTime } from '@l2beat/shared-pure'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useAnimationFrame } from '~/hooks/useAnimationFrame'
import { useElementSize } from '~/hooks/useElementSize'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { useThemeTokens } from '~/hooks/useThemeTokens'
import { cn } from '~/utils/cn'
import { toRgba } from '~/utils/color'
import { prepareCanvas } from '~/utils/prepareCanvas'
import { secondsPerBeat, toBeats, tracePoints } from './ekg'

/** Seconds the trace shows */
export const TRACE_SECONDS = 60
/**
 * Seconds the trace runs behind the clock: blocks reach the page up to this
 * late, as the backend looks for new ones every 10 s and the page asks every 2 s
 */
export const TRACE_DELAY = 20
/** Grid lines, as on ECG paper */
const GRID_SECONDS = 5
/** Scrolling a few pixels a second needs no more */
const FRAMES_PER_SECOND = 30
/** Of the height: the line the beats start from, and the tallest spike */
const BASELINE = 0.7
const SPIKE = 0.6

export function EkgTrace({
  seconds,
  newest,
  bold = false,
  className,
}: {
  /** [second, transactions] of every second with a block */
  seconds: [UnixTime, number][]
  /** The trace ends at the newest block, so a chain running behind shows a gap */
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
  const perBeat = secondsPerBeat(size.width / TRACE_SECONDS)
  const beats = useMemo(() => toBeats(seconds, perBeat), [seconds, perBeat])
  // over all the seconds sent, not those in view, so the scale holds still
  // while beats scroll in and out
  const busiest = useMemo(
    () => Math.max(0, ...beats.map(([, transactions]) => transactions)),
    [beats],
  )

  const draw = useCallback(
    (now: number) => {
      const canvas = ref.current
      if (!canvas || size.width === 0) return
      const context = prepareCanvas(canvas, size.width, size.height)
      if (!context) return
      const { width, height } = size
      const to = now - TRACE_DELAY
      const from = to - TRACE_SECONDS
      const xOf = (second: number) => ((second - from) / TRACE_SECONDS) * width
      const baseline = height * BASELINE
      context.clearRect(0, 0, width, height)

      context.lineWidth = 1
      context.strokeStyle = toRgba(tokens.brand, tokens.isDark ? 0.14 : 0.12)
      context.beginPath()
      for (
        let second = Math.ceil(from / GRID_SECONDS) * GRID_SECONDS;
        second <= to;
        second += GRID_SECONDS
      ) {
        const x = xOf(second)
        context.moveTo(x, 0)
        context.lineTo(x, height)
      }
      context.stroke()

      const end = Math.min(width, xOf(newest + 1))
      if (end < width) {
        // no signal yet past the newest block
        context.setLineDash([2, 4])
        context.strokeStyle = toRgba(tokens.secondary, 0.5)
        context.beginPath()
        context.moveTo(Math.max(0, end), baseline)
        context.lineTo(width, baseline)
        context.stroke()
        context.setLineDash([])
      }
      if (end <= 0) return

      const points = tracePoints(
        beats,
        perBeat,
        busiest,
        { from, to, width },
        end,
      )
      const yOf = (level: number) => baseline - level * height * SPIKE
      context.beginPath()
      for (const [i, [x, level]] of points.entries()) {
        if (i === 0) context.moveTo(x, yOf(level))
        else context.lineTo(x, yOf(level))
      }
      // the oldest seconds fade, as on a monitor drawing over its last sweep
      const ink = context.createLinearGradient(0, 0, width, 0)
      ink.addColorStop(0, toRgba(tokens.brand, 0))
      ink.addColorStop(0.25, toRgba(tokens.brand, 1))
      context.lineJoin = 'round'
      if (tokens.isDark) {
        context.strokeStyle = toRgba(tokens.brand, 0.25)
        context.lineWidth = bold ? 6 : 4
        context.stroke()
      }
      context.strokeStyle = ink
      context.lineWidth = bold ? 2 : 1.5
      context.stroke()

      context.fillStyle = tokens.brand
      context.beginPath()
      context.arc(end, baseline, bold ? 3 : 2.5, 0, 2 * Math.PI)
      context.fill()
    },
    [beats, perBeat, busiest, newest, bold, size, tokens],
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
