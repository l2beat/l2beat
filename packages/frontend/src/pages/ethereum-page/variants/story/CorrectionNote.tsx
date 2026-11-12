import { useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { EASE_OUT_QUINT } from '~/utils/easing'
import type { HeadBlock, Reorg } from '../../live/types'
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
      <WhatChanged reorg={reorg} /> Figures updated.
    </p>
  )
}

/**
 * One block swapped for another at its slot names both hashes, so it can be
 * checked on an explorer. A deeper rewrite names the range and the fork, and
 * the depth in slots when missed slots make it differ from the block count.
 */
function WhatChanged({ reorg }: { reorg: Reorg }) {
  const blocks = reorg.replaced.filter(
    (b): b is HeadBlock & { number: number } => b.number !== undefined,
  )
  const first = blocks[0]
  const last = blocks.at(-1)
  const fork = <>forking at slot {formatInteger(reorg.forkSlot)}</>
  const slots =
    blocks.length !== reorg.depth
      ? `, ${reorg.depth} slot${reorg.depth === 1 ? '' : 's'} deep`
      : ''

  if (!first || !last) {
    const from = reorg.forkSlot + 1
    const to = reorg.forkSlot + reorg.depth
    return (
      <>
        {from === to
          ? `slot ${formatInteger(from)}, empty on the branch we had, now holds a block`
          : `slots ${formatInteger(from)}–${formatInteger(to)}, empty on the branch we had, now hold blocks`}{' '}
        from another branch {fork}.
      </>
    )
  }
  const replacedOne = reorg.replaced[0]
  const byOne = reorg.by[0]
  if (reorg.depth === 1 && replacedOne?.hash && byOne?.hash) {
    return (
      <>
        block {formatInteger(first.number)}
        <Hash value={replacedOne.hash} /> was replaced by another
        <Hash value={byOne.hash} /> at the same slot, 1 block deep.
      </>
    )
  }
  if (first === last) {
    return (
      <>
        block {formatInteger(first.number)} was replaced by another branch{' '}
        {fork}
        {slots}.
      </>
    )
  }
  return (
    <>
      blocks {formatInteger(first.number)}–{formatInteger(last.number)} (
      {blocks.length} blocks) were replaced by another branch {fork}
      {slots}.
    </>
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
