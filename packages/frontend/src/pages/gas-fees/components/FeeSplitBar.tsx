import type { FeeSplitPartKey } from '~/server/features/gas-fees/chains'
import { cn } from '~/utils/cn'
import { KeyItem, ShareBar } from './parts'

export const FEE_SPLIT_COLORS: Record<FeeSplitPartKey, string> = {
  base: 'var(--chart-stacked-blue)',
  priority: 'var(--chart-stacked-pink)',
  l1Data: 'var(--chart-stacked-yellow)',
}

export const FEE_SPLIT_LABELS: Record<FeeSplitPartKey, string> = {
  base: 'Base fee',
  priority: 'Priority fee',
  l1Data: 'L1 data',
}

/** A narrower part can't hold its share */
const NARROWEST_LABELLED = 0.17

/** The parts of a chain's fees as one bar, each share written in where it fits */
export function FeeSplitBar({
  parts,
  className,
}: {
  parts: { key: FeeSplitPartKey; value: number }[]
  className?: string
}) {
  const sum = parts.reduce((total, part) => total + part.value, 0)
  return (
    <ShareBar
      className={cn(
        'h-4 w-full gap-px rounded-[3px] bg-surface-secondary font-semibold text-3xs tabular-nums leading-none',
        className,
      )}
      parts={parts.map((part) => ({
        ...part,
        color: FEE_SPLIT_COLORS[part.key],
        className: cn(
          'justify-center',
          part.key === 'base' ? 'text-white' : 'text-black/75',
        ),
        inside:
          part.value / sum >= NARROWEST_LABELLED &&
          `${Math.round((part.value / sum) * 100)}%`,
      }))}
    />
  )
}

export function FeeSplitKey({ keys }: { keys: FeeSplitPartKey[] }) {
  return keys.map((key) => (
    <KeyItem key={key} color={FEE_SPLIT_COLORS[key]}>
      {FEE_SPLIT_LABELS[key]}
    </KeyItem>
  ))
}
