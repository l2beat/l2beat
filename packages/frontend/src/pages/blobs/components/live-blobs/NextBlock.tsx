import { SLOT_SECONDS } from '@l2beat/shared-pure'
import { type CSSProperties, useRef } from 'react'
import { useAnimationFrame } from '~/hooks/useAnimationFrame'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { cn } from '~/utils/cn'
import { useChainClock } from './chainClock'
import { writeText } from './liveMotion'

const RING_RADIUS = 6
const RING_LENGTH = 2 * Math.PI * RING_RADIUS
/**
 * Under a device pixel of arc each at 2× density, so the ring still sweeps
 * smoothly, while it changes on an eighth of the frames: each change restyles
 * and repaints the page around it, and on a long page that is most of a frame
 */
const RING_STEPS = 96

/**
 * How long until the next block, as a ring that fills over the 12 seconds:
 * the wait between blocks, made visible. Drawn straight to the elements, and
 * only when they would look different, so it renders no React
 */
export function NextBlock({
  hidden,
  className,
  style,
}: {
  hidden: boolean
  className?: string
  style?: CSSProperties
}) {
  const clock = useChainClock()
  const rootRef = useRef<HTMLDivElement>(null)
  const onScreen = useIsOnScreen(rootRef)
  const ringRef = useRef<SVGCircleElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const drawnStep = useRef<number>(undefined)

  useAnimationFrame(() => {
    const progress = clock.progressNow()
    const into = progress - Math.floor(progress)
    const step = Math.floor(into * RING_STEPS)
    if (step !== drawnStep.current) {
      drawnStep.current = step
      ringRef.current?.setAttribute(
        'stroke-dashoffset',
        String(RING_LENGTH * (1 - step / RING_STEPS)),
      )
    }
    if (textRef.current) {
      const left = Math.max(1, Math.ceil((1 - into) * SLOT_SECONDS))
      writeText(textRef.current, `Next block in ${left}s`)
    }
  }, onScreen && !hidden)

  return (
    <div
      ref={rootRef}
      aria-hidden={hidden}
      style={style}
      className={cn(
        'flex items-center gap-1.5 font-medium text-label-value-14 text-secondary tabular-nums',
        hidden && 'invisible',
        className,
      )}
    >
      <svg viewBox="0 0 16 16" className="-rotate-90 size-4" aria-hidden>
        <circle
          cx={8}
          cy={8}
          r={RING_RADIUS}
          fill="none"
          strokeWidth={2}
          className="stroke-divider"
        />
        <circle
          ref={ringRef}
          cx={8}
          cy={8}
          r={RING_RADIUS}
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH}
          className="stroke-brand"
        />
      </svg>
      <span ref={textRef} />
    </div>
  )
}
