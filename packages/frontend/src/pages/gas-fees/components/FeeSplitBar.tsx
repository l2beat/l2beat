import { cn } from '~/utils/cn'

export interface FeeSplitPart {
  key: 'base' | 'priority' | 'l1Data'
  value: number
}

export const FEE_SPLIT_COLORS: Record<FeeSplitPart['key'], string> = {
  base: 'bg-chart-stacked-blue',
  priority: 'bg-chart-stacked-pink',
  l1Data: 'bg-chart-stacked-yellow',
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
  const total = parts.reduce((sum, p) => sum + p.value, 0)
  return (
    <div
      className={cn(
        'flex h-1.5 w-full gap-px overflow-hidden rounded-full bg-surface-tertiary',
        className,
      )}
    >
      {total > 0 &&
        parts.map((part) =>
          part.value > 0 ? (
            <span
              key={part.key}
              className={FEE_SPLIT_COLORS[part.key]}
              style={{ width: `${(part.value / total) * 100}%` }}
            />
          ) : null,
        )}
    </div>
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
    <span
      className={cn(
        'flex items-center gap-3 text-2xs text-secondary',
        className,
      )}
    >
      {keys.map((key) => (
        <span key={key} className="flex items-center gap-1">
          <span className={cn('size-2 rounded-xs', FEE_SPLIT_COLORS[key])} />
          {FEE_SPLIT_LABELS[key]}
        </span>
      ))}
    </span>
  )
}
