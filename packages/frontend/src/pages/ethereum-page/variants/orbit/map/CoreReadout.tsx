import { useEffect, useRef, useState } from 'react'
import { writeText } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import type { EthereumHead } from '../../../live/types'
import { formatWhole } from '../format'
import type { Geometry } from './geometry'

/** The head block, written into the core the canvas draws: HTML stays crisp and selectable */
export function CoreReadout({
  geometry,
  live,
}: {
  geometry: Geometry
  live: EthereumHead
}) {
  const { head } = live
  const rewinding = useRewinding(live.lastReorg?.seenAt)
  const small = geometry.mode === 'arc'
  const size = geometry.core * 2
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
      {head === undefined ? (
        <span className="text-label-value-12 text-secondary">
          {live.status === 'connecting' ? 'Connecting' : 'Reconnecting'}
        </span>
      ) : (
        <>
          <span
            className={cn(
              'text-secondary',
              small ? 'text-[10px] leading-3' : 'text-label-value-12',
            )}
          >
            {rewinding
              ? 'Block replaced'
              : head.status === 'missed'
                ? 'Slot missed'
                : 'Head block'}
          </span>
          <span
            className={cn(
              'mt-1 font-bold tabular-nums leading-none tracking-tight',
              small ? 'text-[15px]' : 'text-[22px]',
              head.status === 'missed' && 'text-secondary',
            )}
          >
            {head.number !== undefined
              ? formatWhole(head.number)
              : formatWhole(head.slot)}
          </span>
          {!small && (
            <span className="mt-1 text-label-value-12 text-secondary tabular-nums">
              slot {formatWhole(head.slot)}
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

/** As long as the map spins back, so the core says why it runs backwards */
const REWIND_LABEL_MS = 1600

function useRewinding(seenAt: number | undefined) {
  const [rewinding, setRewinding] = useState(false)
  const first = useRef(seenAt)
  useEffect(() => {
    // a reorg already in the stream when the page opened is not replayed
    if (seenAt === undefined || seenAt === first.current) return
    setRewinding(true)
    const timer = setTimeout(() => setRewinding(false), REWIND_LABEL_MS)
    return () => clearTimeout(timer)
  }, [seenAt])
  return rewinding
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
