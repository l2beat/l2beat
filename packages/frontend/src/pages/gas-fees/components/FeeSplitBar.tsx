import { cn } from '~/utils/cn'
import { KeyItem, ShareBar } from './parts'

export interface FeeSplitPart {
  key: 'base' | 'priority' | 'l1Data'
  value: number
}

export const FEE_SPLIT_COLORS: Record<FeeSplitPart['key'], string> = {
  base: 'var(--chart-stacked-blue)',
  priority: 'var(--chart-stacked-pink)',
  l1Data: 'var(--chart-stacked-yellow)',
}

export const FEE_SPLIT_LABELS: Record<FeeSplitPart['key'], string> = {
  base: 'Base fee',
  priority: 'Priority fee',
  l1Data: 'L1 data',
}

export function FeeSplitBar({
  parts,
  className,
}: {
  parts: FeeSplitPart[]
  className?: string
}) {
  return (
    <ShareBar
      className={cn(
        'h-1.5 w-full gap-px rounded-full bg-surface-tertiary',
        className,
      )}
      parts={parts.map((part) => ({
        ...part,
        color: FEE_SPLIT_COLORS[part.key],
      }))}
    />
  )
}

export function FeeSplitKey({
  keys,
  className,
}: {
  keys: FeeSplitPart['key'][]
  className?: string
}) {
  return (
    <span className={cn('flex items-center gap-3 text-2xs', className)}>
      {keys.map((key) => (
        <KeyItem key={key} color={FEE_SPLIT_COLORS[key]}>
          {FEE_SPLIT_LABELS[key]}
        </KeyItem>
      ))}
    </span>
  )
}
