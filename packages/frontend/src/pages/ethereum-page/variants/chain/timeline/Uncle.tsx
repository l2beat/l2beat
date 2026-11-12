import { useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { cn } from '~/utils/cn'
import type { HeadBlock, Reorg } from '../../../live/types'
import { rewindTiming } from '../state/rewind'
import { FLOAT } from '../ui/spring'
import { columnCenter, columnLeft, columnsWidth } from './geometry'

/** Squashed to fit the lane above the chain, still one tile per slot so a deep branch stays readable */
const REST =
  'translate(calc(var(--gap) * 2), calc(-1 * var(--lane-h) + 3px)) scale(0.94, 0.38)'

/**
 * The orphaned branch of a reorg: every slot the losing side had, peeled off
 * the chain as one piece and hung in the lane above, forking from the last
 * block both sides share. It stays there a while as a ghost, the uncles.
 */
export function UncleBranch({
  reorg,
  firstColumn,
  forkColumn,
  maxBlobs,
  animate,
  highlightSlot,
}: {
  reorg: Reorg
  /** Column of the first rewritten slot */
  firstColumn: number
  /** Column of the fork point; -1 once it has left the window */
  forkColumn: number
  maxBlobs: number
  /** True while the reorg is fresh: the branch peels off its spot in the chain */
  animate: boolean
  /** A replaced slot the reader is anchored to, outlined on the ghost */
  highlightSlot: number | undefined
}) {
  const branchRef = useRef<HTMLDivElement>(null)
  const linkRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once per branch, on mount
  useLayoutEffect(() => {
    const branch = branchRef.current
    if (!branch || !animate || reducedMotion) return
    const { peel } = rewindTiming(reorg.depth)
    branch.animate(
      [
        { transform: 'none', opacity: 1, filter: 'saturate(1)' },
        {
          transform: 'translate(1%, -30%) rotate(-3deg) scale(0.97, 0.8)',
          opacity: 0.95,
          offset: 0.3,
        },
        { transform: REST, opacity: 0.7, filter: 'saturate(0.35)' },
      ],
      {
        duration: FLOAT.duration,
        easing: FLOAT.easing,
        delay: peel,
        fill: 'backwards',
      },
    )
    linkRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 400,
      delay: peel + 500,
      fill: 'backwards',
    })
  }, [])

  return (
    <>
      {forkColumn >= 0 && (
        <div
          ref={linkRef}
          aria-hidden
          className="pointer-events-none absolute top-[9px] h-[calc(var(--lane-h)-9px)]"
          style={{
            left: columnCenter(forkColumn),
            width: `calc(${columnLeft(firstColumn)} - ${columnCenter(forkColumn)} + var(--gap) * 2)`,
          }}
        >
          {/* up from the fork block's top and over to the branch's first slot */}
          <svg
            className="size-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 100 C 0 30, 40 20, 100 20"
              fill="none"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              className="stroke-chart-ethereum"
            />
          </svg>
        </div>
      )}
      <div
        ref={branchRef}
        aria-hidden
        className="pointer-events-none absolute top-(--lane-h) grid h-(--tile-h) origin-top-left gap-(--gap) opacity-70 saturate-[0.35]"
        style={{
          left: columnLeft(firstColumn),
          width: columnsWidth(reorg.depth),
          gridTemplateColumns: `repeat(${reorg.depth}, minmax(0, 1fr))`,
          transform: REST,
        }}
      >
        {reorg.replaced.map((b) => (
          <GhostTile
            key={b.slot}
            block={b}
            maxBlobs={maxBlobs}
            highlight={b.slot === highlightSlot}
          />
        ))}
      </div>
    </>
  )
}

function GhostTile({
  block,
  maxBlobs,
  highlight,
}: {
  block: HeadBlock
  maxBlobs: number
  highlight: boolean
}) {
  if (block.status === 'missed') {
    return (
      <div className="rounded-[3px] border border-chart-ethereum/60 border-dashed" />
    )
  }
  return (
    <div
      className={cn(
        'relative rounded-[3px] bg-surface-secondary outline-dashed outline-[2.5px] outline-chart-ethereum',
        highlight && 'outline-[4px] outline-solid',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-[calc(50%-1px)] overflow-hidden rounded-t-[3px]">
        <div
          className="absolute inset-x-0 bottom-0 bg-primary/60"
          style={{
            height: `${Math.min(1, block.gasUsed / block.gasLimit) * 100}%`,
          }}
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
  )
}
