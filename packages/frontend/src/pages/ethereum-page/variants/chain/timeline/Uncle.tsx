import { useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { cn } from '~/utils/cn'
import type { Reorg } from '../../../live/types'
import { formatBlockNumber, shortHash } from '../format'
import { FLOAT } from '../ui/spring'
import { columnLeft, columnsWidth } from './geometry'

/** The orphan waits for the rewind to reach its slot before it lifts */
const PEEL_DELAY_MS = 760
/** Small enough to sit in the lane above the chain */
const REST_SCALE = 0.4

/**
 * A replaced block, peeled off the chain onto a short side branch from its
 * parent, where it stays for a while as an uncle. Spans two columns: the
 * parent it forked from and its own slot.
 */
export function Uncle({
  reorg,
  column,
  maxBlobs,
  animate,
}: {
  reorg: Reorg
  maxBlobs: number
  /** The replaced slot's column */
  column: number
  /** True while the reorg is fresh: the orphan flies from its spot in the chain */
  animate: boolean
}) {
  const orphanRef = useRef<HTMLDivElement>(null)
  const branchRef = useRef<SVGSVGElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const block = reorg.replaced
  const rest = `translate(18%, calc(-1 * var(--lane-h) + 3px)) rotate(-5deg) scale(${REST_SCALE})`

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once per orphan, on mount
  useLayoutEffect(() => {
    const orphan = orphanRef.current
    if (!orphan || !animate || reducedMotion) return
    orphan.animate(
      [
        { transform: 'none', opacity: 1, filter: 'saturate(1)' },
        {
          transform: 'translate(4%, -18%) rotate(-9deg) scale(0.86)',
          opacity: 0.95,
          offset: 0.25,
        },
        { transform: rest, opacity: 0.6, filter: 'saturate(0.35)' },
      ],
      {
        duration: FLOAT.duration,
        easing: FLOAT.easing,
        delay: PEEL_DELAY_MS,
        fill: 'backwards',
      },
    )
    branchRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 500,
      delay: PEEL_DELAY_MS + 450,
      fill: 'backwards',
    })
  }, [])

  const gasShare = Math.min(1, block.gasUsed / block.gasLimit)
  return (
    <div
      className="group/uncle pointer-events-none absolute top-0 h-[calc(var(--lane-h)+var(--tile-h))]"
      style={{ left: columnLeft(column - 1), width: columnsWidth(2) }}
      title={`Uncle: block ${formatBlockNumber(block.number ?? 0)} (${shortHash(block.hash)}) was replaced in slot ${reorg.slot}`}
    >
      <svg
        ref={branchRef}
        aria-hidden
        className="absolute inset-0 size-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* from the parent's top to the uncle's foot, in the lane above the chain */}
        <path
          d="M 25 30 C 25 14, 55 12, 80 16"
          fill="none"
          strokeWidth={1.5}
          strokeDasharray="3 2"
          vectorEffect="non-scaling-stroke"
          className="stroke-chart-ethereum/70"
        />
      </svg>
      <div
        ref={orphanRef}
        className={cn(
          'absolute top-(--lane-h) right-0 h-(--tile-h) w-[calc((100%-var(--gap))/2)] origin-top rounded-[3px] bg-surface-secondary opacity-60 outline-dashed outline-[2.5px] outline-chart-ethereum',
        )}
        style={{ transform: rest }}
      >
        <div className="absolute inset-x-0 top-0 h-[calc(50%-1px)] overflow-hidden rounded-t-[3px]">
          <div
            className="absolute inset-x-0 bottom-0 bg-primary/60"
            style={{ height: `${gasShare * 100}%` }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[calc(50%-1px)] overflow-hidden rounded-b-[3px]">
          <div
            className="absolute inset-x-0 top-0 bg-chart-teal"
            style={{
              height: `${Math.min(1, block.blobCount / maxBlobs) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
