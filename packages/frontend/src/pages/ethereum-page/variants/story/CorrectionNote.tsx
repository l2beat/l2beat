import { useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { EASE_OUT_QUINT } from '~/utils/easing'
import type { Reorg } from '../../live/types'
import { formatInteger } from './format'

/**
 * An editor's note under the lede, as a paper prints a correction: what was
 * replaced, how deep, and that the figures moved. It stays after the rewind,
 * since a reader who looked away should still learn the numbers changed.
 */
export function CorrectionNote({
  reorg,
  active,
}: {
  reorg: Reorg
  active: boolean
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new reorg is what brings the note in
  useLayoutEffect(() => {
    ref.current?.animate(
      reducedMotion
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { opacity: 0, transform: 'translateY(-6px)' },
            { opacity: 1, transform: 'none' },
          ],
      { duration: 500, easing: EASE_OUT_QUINT },
    )
  }, [reorg.seenAt, reducedMotion])

  const replaced = reorg.replaced
  const name =
    replaced.number !== undefined
      ? `block ${formatInteger(replaced.number)}`
      : `the block at slot ${formatInteger(reorg.slot)}`
  return (
    <p
      ref={ref}
      role="status"
      className={cn(
        'mt-6 max-w-[40rem] border-l-2 py-0.5 pl-4 text-[15px] italic leading-[1.55] transition-colors duration-700 md:text-[16px]',
        active ? 'border-brand text-primary' : 'border-divider text-secondary',
      )}
    >
      <span className="font-semibold not-italic">Correction</span>{' '}
      {formatTimestamp(Math.floor(reorg.seenAt / 1000), { mode: 'time' })}:{' '}
      {name}
      {replaced.hash && <Hash value={replaced.hash} />} was replaced by another
      {reorg.by.hash && <Hash value={reorg.by.hash} />} at the same slot,{' '}
      {reorg.depth} block{reorg.depth === 1 ? '' : 's'} deep. Figures updated.
    </p>
  )
}

function Hash({ value }: { value: string }) {
  return (
    <span className="whitespace-nowrap not-italic">
      {' '}
      (<span className="font-mono text-[0.88em]">{value.slice(0, 8)}…</span>)
    </span>
  )
}
