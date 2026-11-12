import { useEffect, useState } from 'react'
import { cn } from '~/utils/cn'
import type { HeadBlock, Reorg } from '../../../live/types'
import { formatWhole, shortHash } from '../format'

/** Long enough to read after the rewind, short enough not to linger as an alarm */
const SHOWN_MS = 45_000

/**
 * Names the replaced block in plain words once the map has rewound. Calm on
 * purpose: a 1-block reorg is routine for Ethereum, and the page has already
 * corrected every number
 */
export function ReorgNotice({ reorg }: { reorg: Reorg | undefined }) {
  const [dismissed, setDismissed] = useState<number>()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!reorg) return
    setNow(Date.now())
    const timer = setTimeout(() => setNow(Date.now()), SHOWN_MS)
    return () => clearTimeout(timer)
  }, [reorg])

  const visible =
    reorg !== undefined &&
    dismissed !== reorg.seenAt &&
    now - reorg.seenAt < SHOWN_MS
  if (!visible || !reorg) return null

  return (
    <div
      role="status"
      className={cn(
        'mt-4 flex items-start gap-3 rounded-lg border border-divider bg-surface-secondary/60 px-4 py-3',
        'fade-in-0 animate-in duration-700',
      )}
    >
      <RewindIcon />
      <div className="min-w-0 flex-1 text-paragraph-14 text-secondary">
        {reorg.depth === 1 ? (
          <SingleSlot reorg={reorg} />
        ) : (
          <SlotRange reorg={reorg} />
        )}
      </div>
      <button
        type="button"
        onClick={() => setDismissed(reorg.seenAt)}
        className="shrink-0 rounded px-1.5 text-label-value-13 text-secondary hover:text-primary"
      >
        Dismiss
      </button>
    </div>
  )
}

function SingleSlot({ reorg }: { reorg: Reorg }) {
  const replaced = reorg.replaced[0]
  const by = reorg.by[0]
  const number = replaced?.number ?? by?.number
  return (
    <p>
      <span className="font-medium text-primary">
        {number !== undefined
          ? `Block ${formatWhole(number)} was replaced.`
          : `Slot ${formatWhole(reorg.forkSlot + 1)} was rewritten.`}
      </span>{' '}
      Slot {formatWhole(reorg.forkSlot + 1)} now holds <BlockId block={by} />{' '}
      instead of <BlockId block={replaced} struck />, a 1-slot reorg. Nothing
      finalized changed, and every number on this page now follows the new
      block.
    </p>
  )
}

function SlotRange({ reorg }: { reorg: Reorg }) {
  const first = reorg.forkSlot + 1
  const last = first + reorg.depth - 1
  const flipped = reorg.replaced.filter(
    (block, i) => block.status !== reorg.by[i]?.status,
  ).length
  return (
    <>
      <p>
        <span className="font-medium text-primary">
          A {reorg.depth}-slot reorg rewrote slots {formatWhole(first)} to{' '}
          {formatWhole(last)}.
        </span>{' '}
        The chain forked after slot {formatWhole(reorg.forkSlot)} and the other
        branch won
        {flipped > 0 &&
          `; ${flipped} ${flipped === 1 ? 'slot' : 'slots'} switched between missed and proposed`}
        . Nothing finalized changed, and every number on this page now follows
        the new branch.
      </p>
      <details className="mt-2">
        <summary className="cursor-pointer font-medium text-label-value-13 text-primary">
          The {reorg.depth} slots, before and after
        </summary>
        <ol className="mt-2 grid gap-1 text-label-value-13 tabular-nums">
          {reorg.replaced.map((block, i) => (
            <li
              key={block.slot}
              className="grid grid-cols-[auto_1fr] gap-x-3 sm:grid-cols-[120px_1fr]"
            >
              <span>Slot {formatWhole(block.slot)}</span>
              <span>
                <BlockId block={block} struck /> to{' '}
                <BlockId block={reorg.by[i]} />
              </span>
            </li>
          ))}
        </ol>
      </details>
    </>
  )
}

function BlockId({
  block,
  struck = false,
}: {
  block: HeadBlock | undefined
  struck?: boolean
}) {
  if (!block || block.status === 'missed') {
    return (
      <span className={cn('italic', struck && 'line-through')}>missed</span>
    )
  }
  return (
    <code className={cn('font-mono', struck ? 'line-through' : 'text-primary')}>
      {shortHash(block.hash)}
    </code>
  )
}

function RewindIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="mt-0.5 size-4 shrink-0 fill-none stroke-current text-secondary"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 10a6.5 6.5 0 1 0 2-4.7" />
      <path d="M3 3v3.5h3.5" />
    </svg>
  )
}
