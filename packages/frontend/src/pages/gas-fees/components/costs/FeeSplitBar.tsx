import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { FeeSplit } from '~/server/features/gas-fees/daily/feeRules'
import type { FeeNotes } from '~/server/features/gas-fees/feeNotes'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import { formatShare, formatUsd } from '../../utils/format'
import { KeySwatch, ShareBar } from '../ShareBar'

export const FEE_PARTS = [
  { key: 'base', label: 'Base fee', color: 'var(--chart-stacked-blue)' },
  {
    key: 'priority',
    label: 'Priority fee',
    color: 'var(--chart-stacked-pink)',
  },
  { key: 'l1Data', label: 'L1 data', color: 'var(--chart-stacked-yellow)' },
] as const

export function FeeSplitBar({
  split,
  notes,
}: {
  split: FeeSplit
  notes: FeeNotes
}) {
  const total = split.base + (split.priority ?? 0) + split.l1Data
  if (!(total > 0)) return <span className="text-secondary">–</span>
  const shareOf = (value: number | null) =>
    value === null ? 'n/a' : formatShare(value / total)
  return (
    <Tooltip>
      <TooltipTrigger
        className="block w-36"
        aria-label={FEE_PARTS.map(
          (part) => `${part.label} ${shareOf(split[part.key])}`,
        ).join(', ')}
      >
        <ShareBar
          className="h-4 rounded-sm"
          parts={FEE_PARTS.map((part) => ({
            key: part.key,
            value: split[part.key] ?? 0,
            color: part.color,
            textClassName: 'text-[9px]',
          }))}
          minLabelledShare={0.15}
        />
      </TooltipTrigger>
      <TooltipContent className="flex max-w-80 flex-col gap-2">
        {FEE_PARTS.map((part) => {
          const value = split[part.key]
          const note = notes[part.key]
          return (
            <div key={part.key} className="flex flex-col gap-0.5">
              <span className="flex items-center justify-between gap-4 font-medium">
                <span className="flex items-center gap-1.5">
                  <KeySwatch color={part.color} />
                  {part.label}
                </span>
                <span className="tabular-nums">
                  {value === null
                    ? 'n/a'
                    : `${formatUsd(value)}${DOT_SEPARATOR}${shareOf(value)}`}
                </span>
              </span>
              {note && <span className="text-secondary text-xs">{note}</span>}
            </div>
          )
        })}
      </TooltipContent>
    </Tooltip>
  )
}
