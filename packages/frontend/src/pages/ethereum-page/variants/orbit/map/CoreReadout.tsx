import { useEffect, useRef } from 'react'
import { writeText } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import type { EthereumHead } from '../../../live/types'
import { formatWhole } from '../format'
import type { Geometry } from './geometry'
import type { RewindCursor } from './OrbitScene'

/**
 * The head block, written into the core the canvas draws: HTML stays crisp
 * and selectable. During a reorg it follows the map instead, counting back
 * through the replaced blocks and forward through the winning branch
 */
export function CoreReadout({
  geometry,
  live,
  cursor,
}: {
  geometry: Geometry
  live: EthereumHead
  cursor: RewindCursor | undefined
}) {
  const { head } = live
  const small = geometry.mode === 'arc'
  const size = geometry.core * 2
  const shown = cursor
    ? { slot: cursor.block.slot, number: cursor.block.number }
    : head && { slot: head.slot, number: head.number }
  return (
    <div
      className="pointer-events-none absolute flex flex-col items-center justify-center text-center"
      style={{
        left: geometry.cx - geometry.core,
        top: geometry.cy - geometry.core,
        width: size,
        height: size,
      }}
    >
      {shown === undefined ? (
        <span className="text-label-value-12 text-secondary">
          {live.status === 'connecting' ? 'Connecting' : 'Reconnecting'}
        </span>
      ) : (
        <>
          <span
            className={cn(
              cursor ? 'font-medium text-primary' : 'text-secondary',
              small ? 'text-[10px] leading-3' : 'text-label-value-12',
            )}
          >
            {describe(cursor, shown.number === undefined)}
          </span>
          <span
            className={cn(
              'mt-1 font-bold tabular-nums leading-none tracking-tight',
              small ? 'text-[15px]' : 'text-[22px]',
              (shown.number === undefined || cursor?.phase === 'back') &&
                'text-secondary',
              cursor?.phase === 'back' && 'line-through decoration-2',
            )}
          >
            {formatWhole(shown.number ?? shown.slot)}
          </span>
          {!small && (
            <span className="mt-1 text-label-value-12 text-secondary tabular-nums">
              slot {formatWhole(shown.slot)}
            </span>
          )}
          <Countdown
            nextSlotAt={live.nextSlotAt}
            className={cn(
              'font-medium tabular-nums',
              small ? 'mt-1 text-[11px] leading-3' : 'mt-2 text-label-value-13',
            )}
          />
        </>
      )}
    </div>
  )
}

function describe(cursor: RewindCursor | undefined, missed: boolean) {
  if (!cursor) return missed ? 'Slot missed' : 'Head block'
  const { phase, step, depth } = cursor
  if (depth === 1) return phase === 'back' ? 'Block replaced' : 'Replacement'
  const count = `${step} of ${depth}`
  if (phase === 'back') return `Undoing ${count}`
  return missed ? `Replaying ${count}, missed` : `Replaying ${count}`
}

/** Writes its own text a few times a second, so the page does not re-render to count down */
export function Countdown({
  nextSlotAt,
  className,
}: {
  nextSlotAt: number | undefined
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element || !nextSlotAt) return
    const update = () => {
      const seconds = Math.ceil((nextSlotAt - Date.now()) / 1000)
      writeText(
        element,
        seconds > 0 ? `next in ${seconds}s` : 'next any moment',
      )
    }
    update()
    const timer = setInterval(update, 250)
    return () => clearInterval(timer)
  }, [nextSlotAt])
  return <span ref={ref} className={className} />
}
