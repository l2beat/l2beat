import { memo, useEffect, useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { cn } from '~/utils/cn'
import type { HeadBlock } from '../../../live/types'
import { LAND } from '../ui/spring'

/** The replacement waits for the orphan to lift off its spot */
const REPLACEMENT_DELAY_MS = 1300

/**
 * One slot of the chain. The top half fills with gas used out of the limit,
 * the bottom half with blobs out of the max (who posted them is in the
 * inspector, where there's room to name them); a missed slot is an empty dashed frame the chain line runs through.
 */
export const Tile = memo(function Tile({
  block,
  column,
  maxBlobs,
  isHead,
  isSelected,
  enter,
}: {
  block: HeadBlock
  column: number
  maxBlobs: number
  isHead: boolean
  isSelected: boolean
  /** Set on the render a tile first appears in: a fresh head, or a reorg's replacement */
  enter: 'new' | 'replacement' | undefined
}) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const hash = block.hash

  // before paint, so a replacement never flashes in place before its entrance
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new hash is a new block in this slot
  useLayoutEffect(() => {
    const body = bodyRef.current
    if (!body || !enter || reducedMotion) return
    if (enter === 'replacement') {
      body.animate(
        [
          {
            transform: 'translateY(-55%) scale(0.5)',
            opacity: 0,
            filter: 'brightness(1.6)',
          },
          { transform: 'none', opacity: 1, filter: 'none' },
        ],
        {
          duration: LAND.duration,
          easing: LAND.easing,
          delay: REPLACEMENT_DELAY_MS,
          fill: 'backwards',
        },
      )
      return
    }
    body.animate(
      [
        { transform: 'scale(0.55, 0.2)', opacity: 0.2 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: LAND.duration, easing: LAND.easing },
    )
  }, [hash])

  if (block.status === 'missed') {
    return (
      <div
        style={{ gridColumn: column + 1 }}
        className="h-(--tile-h) rounded-[3px] border border-divider border-dashed"
      />
    )
  }

  const gasShare = Math.min(1, block.gasUsed / block.gasLimit)
  return (
    <div
      style={{ gridColumn: column + 1 }}
      className={cn(
        'can-hover:hover:-translate-y-1 relative h-(--tile-h) transition-transform duration-300',
        isSelected && '-translate-y-1.5 can-hover:hover:-translate-y-1.5',
      )}
    >
      <div
        ref={bodyRef}
        className={cn(
          'relative h-full rounded-[3px] bg-surface-secondary shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_1px_1.5px_rgb(0_0_0/0.18)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_1px_2px_rgb(0_0_0/0.5)]',
          isSelected &&
            'shadow-[0_6px_14px_-4px_color-mix(in_oklab,var(--chart-ethereum)_70%,transparent)] outline-2 outline-chart-ethereum outline-offset-[1.5px]',
        )}
      >
        <div className="absolute inset-x-0 top-0 h-[calc(50%-1px)] overflow-hidden rounded-t-[3px]">
          <div
            className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary/70 to-primary/45"
            style={{ height: `${gasShare * 100}%` }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[calc(50%-1px)] overflow-hidden rounded-b-[3px]">
          <div
            className="absolute inset-x-0 top-0 bg-linear-to-b from-chart-teal to-chart-teal/70"
            style={{
              height: `${Math.min(1, block.blobCount / maxBlobs) * 100}%`,
            }}
          />
        </div>
        {isHead && <HeadGlow />}
      </div>
    </div>
  )
})

/** The head breathes in the brand colour: the one block still being built on */
function HeadGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  useEffect(() => {
    if (!ref.current || reducedMotion) return
    const animation = ref.current.animate([{ opacity: 0.45 }, { opacity: 1 }], {
      duration: 1400,
      iterations: Number.POSITIVE_INFINITY,
      direction: 'alternate',
      easing: 'ease-in-out',
    })
    return () => animation.cancel()
  }, [reducedMotion])
  return (
    <div
      ref={ref}
      aria-hidden
      className="-inset-[3px] pointer-events-none absolute rounded-[5px] border-2 border-brand shadow-[0_0_16px_2px_color-mix(in_oklab,var(--brand)_55%,transparent)]"
    />
  )
}
