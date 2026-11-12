import { useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { CloseIcon } from '~/icons/Close'
import { EASE_OUT_QUINT } from '~/utils/easing'
import type { Reorg } from '../../../live/types'
import { formatInteger, shortHash } from '../format'

/**
 * Names what the rewind replaced, calmly: one block at the tip changing is
 * how the chain settles races, not a failure, and finalized blocks never do.
 */
export function ReorgNotice({
  reorg,
  onDismiss,
}: {
  reorg: Reorg
  onDismiss: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  useLayoutEffect(() => {
    if (reducedMotion) return
    ref.current?.animate(
      [
        { opacity: 0, transform: 'translateY(-6px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 400, easing: EASE_OUT_QUINT },
    )
  }, [reducedMotion])

  const number = reorg.by.number ?? reorg.replaced.number
  return (
    <div
      ref={ref}
      role="status"
      className="absolute top-2 left-4 z-10 flex max-w-[min(calc(100%-2rem),30rem)] items-start gap-3 rounded-xl border border-divider bg-surface-primary/95 py-3 pr-2 pl-4 shadow-popover backdrop-blur md:left-10"
    >
      <span
        aria-hidden
        className="mt-0.5 font-bold text-brand text-label-value-16 leading-none"
      >
        ⟲
      </span>
      <div className="text-paragraph-14 text-secondary">
        <p className="font-bold text-primary">
          Block {number === undefined ? '' : formatInteger(number)} was replaced
        </p>
        <p className="mt-1">
          Slot {formatInteger(reorg.slot)} now holds{' '}
          <span className="text-primary tabular-nums">
            {shortHash(reorg.by.hash)}
          </span>{' '}
          instead of{' '}
          <span className="tabular-nums line-through">
            {shortHash(reorg.replaced.hash)}
          </span>
          . Only the newest blocks can change like this; finalized ones never
          do.
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="rounded-md p-1.5 text-secondary hover:bg-surface-secondary"
      >
        <CloseIcon className="size-3 fill-current" />
      </button>
    </div>
  )
}
