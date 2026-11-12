import { useEffect, useRef } from 'react'
import { writeText } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import type { EthereumHead } from '../../../live/types'
import { epochOf } from '../derive'
import { fmtNumber } from '../format'
import { Ticker } from '../ui/Ticker'
import { sentimentDotClass, type VerdictItem } from '../verdict'

/** The first line a researcher reads: is the feed live, where is the head, what is final, what do I trust */
export function StatusStrip({
  head,
  verdict,
  isUnderReview,
}: {
  head: EthereumHead
  verdict: VerdictItem[]
  isUnderReview: boolean
}) {
  const block = head.head
  // a missed head slot has no block: the number shown stays the latest one there is
  const latestNumber = head.blocks.findLast(
    (b) => b.number !== undefined,
  )?.number
  return (
    <div className="flex flex-wrap items-stretch bg-surface-primary text-[12px] md:col-span-12 md:flex-nowrap">
      <Cell className="max-md:w-full max-md:border-b">
        <FeedState status={head.status} />
        <span className="font-mono text-primary tabular-nums">
          slot <Ticker value={block?.slot} format={fmtInteger} />
        </span>
        <span className="font-mono text-primary tabular-nums">
          #<Ticker value={latestNumber} format={fmtInteger} />
        </span>
      </Cell>
      <Cell className="max-md:flex-1">
        <span className="text-secondary">Next slot</span>
        <NextSlot nextSlotAt={head.nextSlotAt} />
      </Cell>
      <Cell
        className="max-md:flex-1"
        title="Finality trails the head by about two epochs"
      >
        <span className="inline-flex size-1.5 rounded-full bg-positive" />
        <span className="text-secondary">Finalized</span>
        <span className="font-mono text-primary tabular-nums">
          epoch{' '}
          <Ticker
            value={
              head.finalizedSlot === undefined
                ? undefined
                : epochOf(head.finalizedSlot)
            }
            format={fmtInteger}
          />
        </span>
        <span className="font-mono text-secondary tabular-nums max-xl:hidden">
          {head.finalizedBlock === undefined
            ? ''
            : `#${fmtNumber(head.finalizedBlock)}`}
        </span>
      </Cell>
      <a
        href="#risk-summary"
        className="group flex min-w-0 flex-1 items-center gap-2.5 border-divider/60 px-3 py-2 hover:bg-surface-primary-hover max-md:w-full max-md:border-t md:border-l"
      >
        <span className="shrink-0 text-secondary">What you trust</span>
        <span className="flex min-w-0 items-center gap-3 overflow-hidden">
          {verdict.map((item) => (
            <span
              key={item.name}
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap"
            >
              <span
                className={cn(
                  'inline-flex size-1.5 rounded-full',
                  sentimentDotClass(item.sentiment),
                )}
              />
              <span className="text-secondary">{item.name}</span>
              <span className="font-semibold text-primary">{item.value}</span>
            </span>
          ))}
          {isUnderReview && (
            <span className="shrink-0 text-warning">Under review</span>
          )}
        </span>
      </a>
    </div>
  )
}

function Cell({
  children,
  className,
  title,
}: {
  children: React.ReactNode
  className?: string
  title?: string
}) {
  return (
    <div
      title={title}
      className={cn(
        'flex shrink-0 items-center gap-2 whitespace-nowrap border-divider/60 px-3 py-2 md:border-r md:last:border-r-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

function FeedState({ status }: { status: EthereumHead['status'] }) {
  const live = status === 'live'
  return (
    <span
      className="mr-1 flex items-center gap-1.5 font-mono text-[11px]"
      aria-live="polite"
    >
      <span className="relative flex size-2">
        {live && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:animate-none" />
        )}
        <span
          className={cn(
            'relative inline-flex size-2 rounded-full',
            live ? 'bg-brand' : 'bg-secondary',
          )}
        />
      </span>
      <span className={live ? 'text-primary' : 'text-secondary'}>
        {status === 'live'
          ? 'live'
          : status === 'reconnecting'
            ? 'reconnecting'
            : 'connecting'}
      </span>
    </span>
  )
}

/**
 * Counts down to the next slot. Drawn per frame straight to the DOM, so
 * the rest of the console does not render 60 times a second
 */
function NextSlot({ nextSlotAt }: { nextSlotAt: number | undefined }) {
  const bar = useRef<HTMLSpanElement>(null)
  const text = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (nextSlotAt === undefined) return
    const startedAt = Date.now()
    const total = Math.max(1, nextSlotAt - startedAt)
    let frame = requestAnimationFrame(function step() {
      const left = Math.max(0, nextSlotAt - Date.now())
      if (bar.current) {
        bar.current.style.transform = `scaleX(${1 - left / total})`
      }
      if (text.current) {
        writeText(text.current, `${(left / 1000).toFixed(1)}s`)
      }
      if (left > 0) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [nextSlotAt])
  return (
    <span className="flex items-center gap-2">
      <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-surface-secondary">
        <span
          ref={bar}
          className="absolute inset-0 origin-left scale-x-0 bg-primary/70"
        />
      </span>
      <span
        ref={text}
        className="w-9 font-mono text-primary slashed-zero tabular-nums"
      >
        —
      </span>
    </span>
  )
}

function fmtInteger(value: number) {
  return fmtNumber(Math.round(value))
}
