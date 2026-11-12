import { useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { cn } from '~/utils/cn'
import { EASE_OUT_QUINT } from '~/utils/easing'
import { UNKNOWN_POSTER_ID } from '../../live/simulatedHead'
import type { EthereumHead, HeadBlock } from '../../live/types'
import { TYPE } from './Article'
import { SLOT_SECONDS } from './facts'
import { formatInteger } from './format'

const UNKNOWN_COLOR = 'var(--surface-tertiary)'
const SLIDE_MS = 700
/** How long rewritten slots stay marked */
const REPLACED_MS = 12_000

/**
 * The last slots as columns of blobs, coloured by who posted them, against the
 * target. A glance at the market the cost chapter prices; the full live view
 * is the Blobs page.
 */
export function BlobStrip({
  head,
  posters,
}: {
  head: EthereumHead
  posters: Map<string, BlobPoster>
}) {
  const stripRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const { maxBlobs, targetBlobs } = head.limits
  const headSlot = head.head?.slot
  const reorg =
    head.lastReorg && Date.now() - head.lastReorg.seenAt < REPLACED_MS
      ? head.lastReorg
      : undefined
  const rewritten = reorg
    ? head.blocks.flatMap((b, i) =>
        b.slot > reorg.forkSlot && b.slot <= reorg.forkSlot + reorg.depth
          ? [i]
          : [],
      )
    : []

  // the strip slides one column left as a block lands, like a ticker
  useLayoutEffect(() => {
    const strip = stripRef.current
    const column = strip?.lastElementChild
    if (!strip || !column || reducedMotion || headSlot === undefined) return
    const shift = column.getBoundingClientRect().width + 2
    strip.animate(
      [{ transform: `translateX(${shift}px)` }, { transform: 'none' }],
      { duration: SLIDE_MS, easing: EASE_OUT_QUINT },
    )
  }, [headSlot, reducedMotion])

  return (
    <div>
      <div className="relative h-32 overflow-hidden md:h-40">
        <div
          className="pointer-events-none absolute inset-x-0 z-[1] border-primary/50 border-t border-dashed"
          style={{ bottom: `${(targetBlobs / maxBlobs) * 100}%` }}
        >
          <span className="absolute bottom-1 left-0 rounded-sm bg-surface-primary/85 px-1 text-[11px] text-secondary">
            Target, {targetBlobs} blobs
          </span>
        </div>
        <div
          ref={stripRef}
          className="relative flex h-full items-end gap-[2px]"
          aria-label={`Blobs in each of the last ${head.blocks.length} slots`}
          role="img"
        >
          {head.blocks.length === 0
            ? Array.from({ length: 64 }, (_, i) => (
                <span
                  key={i}
                  className="h-1/2 flex-1 animate-pulse rounded-t-[2px] bg-surface-secondary motion-reduce:animate-none"
                />
              ))
            : head.blocks.map((block) => (
                <Column
                  key={block.slot}
                  block={block}
                  maxBlobs={maxBlobs}
                  posters={posters}
                  replaced={
                    reorg !== undefined &&
                    block.slot > reorg.forkSlot &&
                    block.slot <= reorg.forkSlot + reorg.depth
                  }
                />
              ))}
          {rewritten.length > 0 && (
            <RewrittenBand
              from={rewritten[0] ?? 0}
              count={rewritten.length}
              of={head.blocks.length}
            />
          )}
        </div>
      </div>
      <div className={cn(TYPE.note, 'mt-2 flex justify-between')}>
        <span>
          {head.blocks.length > 0 &&
            `${Math.round((head.blocks.length * SLOT_SECONDS) / 60)} minutes ago`}
        </span>
        <span>Now</span>
      </div>
    </div>
  )
}

/** Brackets the rewritten slots, so a deep reorg reads as one event, not several */
function RewrittenBand({
  from,
  count,
  of,
}: {
  from: number
  count: number
  of: number
}) {
  const column = `((100% + 2px) / ${of})`
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 rounded-[3px] bg-brand/10"
      style={{
        left: `calc(${from} * ${column} - 3px)`,
        width: `calc(${count} * ${column} + 4px)`,
      }}
    >
      <span className="absolute top-1 right-1 whitespace-nowrap rounded-sm bg-brand px-1 font-semibold text-[10px] text-white">
        {count === 1 ? 'Replaced' : `${count} slots rewritten`}
      </span>
    </span>
  )
}

function Column({
  block,
  maxBlobs,
  posters,
  replaced,
}: {
  block: HeadBlock
  maxBlobs: number
  posters: Map<string, BlobPoster>
  replaced: boolean
}) {
  const title =
    block.status === 'missed'
      ? `Slot ${formatInteger(block.slot)}: missed, no block`
      : `Block ${formatInteger(block.number ?? 0)}: ${block.blobCount} blobs${block.blobs
          .map(
            (b) =>
              `\n${posters.get(b.posterId)?.name ?? 'Unattributed'}: ${b.blobs}`,
          )
          .join('')}`
  if (block.status === 'missed') {
    return (
      <span
        title={title}
        className={cn(
          'relative h-full flex-1 border-divider border-b-2 border-dotted',
          replaced && 'border-brand',
        )}
      />
    )
  }
  return (
    <span
      title={title}
      className={cn(
        'relative flex flex-1 flex-col-reverse gap-px',
        replaced && 'rounded-[2px] outline-2 outline-brand outline-offset-1',
      )}
      style={{ height: `${(block.blobCount / maxBlobs) * 100}%` }}
    >
      {block.blobs.map((b) => (
        <span
          key={b.posterId}
          className="w-full first:rounded-b-[1px] last:rounded-t-[2px]"
          style={{
            flexGrow: b.blobs,
            background:
              b.posterId === UNKNOWN_POSTER_ID
                ? UNKNOWN_COLOR
                : (posters.get(b.posterId)?.color ?? UNKNOWN_COLOR),
          }}
        />
      ))}
    </span>
  )
}
