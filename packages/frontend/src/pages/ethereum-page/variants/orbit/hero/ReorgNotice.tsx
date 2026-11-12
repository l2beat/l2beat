import { useEffect, useState } from 'react'
import { cn } from '~/utils/cn'
import type { Reorg } from '../../../live/types'
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
  const number = reorg.replaced.number ?? reorg.by.number

  return (
    <div
      role="status"
      className={cn(
        'mt-4 flex items-start gap-3 rounded-lg border border-divider bg-surface-secondary/60 px-4 py-3',
        'fade-in-0 animate-in duration-700',
      )}
    >
      <RewindIcon />
      <p className="min-w-0 flex-1 text-paragraph-14 text-secondary">
        <span className="font-medium text-primary">
          Block {number !== undefined ? formatWhole(number) : ''} was replaced.
        </span>{' '}
        Slot {formatWhole(reorg.slot)} now holds{' '}
        <code className="font-mono text-primary">
          {shortHash(reorg.by.hash)}
        </code>{' '}
        instead of{' '}
        <code className="font-mono line-through">
          {shortHash(reorg.replaced.hash)}
        </code>
        , a {reorg.depth}-block reorg. Every number on this page now follows the
        new block.
      </p>
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
