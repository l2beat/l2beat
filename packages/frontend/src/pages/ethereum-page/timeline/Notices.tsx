import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { CloseIcon } from '~/icons/Close'
import { formatBlockNumber, formatInteger, shortHash } from '../format'
import type { HeadBlock, Reorg } from '../live/types'
import { useAnchor } from '../state/anchor'
import { rewindTiming, useRewind } from '../state/rewind'
import { RewindGlyph } from './RewindSweep'

/**
 * Hangs below the strip, after the fork lens has folded away, so it never pushes the page down: names the
 * block a reorg replaced, or says why the page went back to the head.
 */
export function Notices() {
  const rewind = useRewind()
  const anchor = useAnchor()
  const reducedMotion = usePrefersReducedMotion()
  const reorg = rewind.notice

  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-x-2 top-full mt-2 flex flex-col items-end gap-2 md:inset-x-auto md:right-4 md:w-[min(440px,100%)]"
    >
      {reorg && (
        <div
          key={reorg.seenAt}
          // after the fork lens has folded away; at once when there is no lens
          style={
            reducedMotion
              ? undefined
              : { animationDelay: `${rewindTiming(reorg.depth).total - 400}ms` }
          }
          className="fade-in slide-in-from-top-2 pointer-events-auto flex w-full animate-in gap-3 rounded-xl border border-chart-ethereum/40 bg-surface-primary p-3.5 shadow-popover duration-500 [animation-fill-mode:backwards] dark:bg-header-secondary"
        >
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-chart-ethereum/15">
            <RewindGlyph className="size-3.5 text-chart-ethereum" />
          </span>
          <ReorgSummary reorg={reorg} />
          <DismissButton onClick={rewind.dismissNotice} />
        </div>
      )}
      {anchor.notice && (
        <div className="pointer-events-auto flex w-full items-start gap-3 rounded-xl bg-surface-primary p-3.5 text-paragraph-13 shadow-popover dark:bg-header-secondary">
          <p className="flex-1">{anchor.notice}</p>
          <DismissButton onClick={anchor.dismissNotice} />
        </div>
      )}
    </div>
  )
}

function ReorgSummary({ reorg }: { reorg: Reorg }) {
  const firstSlot = reorg.forkSlot + 1
  const lastSlot = firstSlot + reorg.depth - 1
  const slots =
    reorg.depth === 1
      ? `slot ${formatInteger(firstSlot)}`
      : `slots ${formatInteger(firstSlot)} to ${formatInteger(lastSlot)}`
  const lost = proposed(reorg.replaced)
  const won = proposed(reorg.by)
  return (
    <div className="min-w-0 flex-1 text-paragraph-13">
      <div className="font-bold text-paragraph-14">
        Rewound {reorg.depth} {reorg.depth === 1 ? 'slot' : 'slots'}: a reorg of{' '}
        {slots}
      </div>
      <p className="mt-1 text-secondary">
        The chain forked after slot {formatInteger(reorg.forkSlot)}.{' '}
        {lost.length === 0
          ? 'No blocks'
          : lost.length === 1
            ? `Block ${formatBlockNumber(lost[0]?.number ?? 0)}`
            : `${lost.length} blocks, ${formatBlockNumber(lost[0]?.number ?? 0)} to ${formatBlockNumber(lost.at(-1)?.number ?? 0)},`}{' '}
        {lost.length === 1 ? 'was' : 'were'} replaced by{' '}
        {won.length === 1 ? 'one block' : `${won.length} blocks`}, ending in the
        new head{' '}
        <span className="font-mono text-primary">
          {shortHash(reorg.by.at(-1)?.hash)}
        </span>
        . Every number now reads from the winning branch; the losing one stays
        above the chain for a few minutes.
      </p>
    </div>
  )
}

function proposed(blocks: HeadBlock[]) {
  return blocks.filter((b) => b.status === 'proposed')
}

function DismissButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Dismiss"
      className="flex size-6 shrink-0 items-center justify-center rounded-md text-secondary hover:bg-surface-secondary hover:text-primary"
    >
      <CloseIcon className="size-3 fill-current" />
    </button>
  )
}
