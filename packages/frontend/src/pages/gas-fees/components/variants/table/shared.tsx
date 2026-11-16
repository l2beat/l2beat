import { useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { EM_DASH } from '~/consts/characters'
import type {
  GasFeesSummary,
  GasFeesSummaryRow,
} from '~/server/features/gas-fees/getGasFeesSummary'
import {
  GAS_FEES_USD_METRICS,
  type GasFeesUsdMetric,
} from '~/server/features/gas-fees/types'
import { cn } from '~/utils/cn'
import { FEE_SPLIT_COLORS, FEE_SPLIT_LABELS } from '../../FeeSplitBar'
import type { GasFeesTable } from '../../GasFeesTable'
import { formatFee, GAS_FEES_METRIC_LABELS } from '../../metrics'
import type { GasFeesChain } from '../../types'

/** Every variant takes the props of the product table */
export type TableProps = React.ComponentProps<typeof GasFeesTable>

export type Sort = { id: string; desc: boolean }

type SplitKey = 'base' | 'priority' | 'l1Data'

export const SPLIT_KEYS: SplitKey[] = ['base', 'priority', 'l1Data']

export { FEE_SPLIT_COLORS, FEE_SPLIT_LABELS }

/** Ethereum stays first, the L2s follow the sort */
export function useSortedRows(
  summary: GasFeesSummary | undefined,
  sort: Sort,
  sortValue: ((row: GasFeesSummaryRow) => number) | undefined,
) {
  return useMemo(() => {
    const all = summary?.rows ?? []
    if (!sortValue) return all
    const ethereum = all.filter((r) => r.id === 'ethereum')
    const l2s = all
      .filter((r) => r.id !== 'ethereum')
      .sort((a, b) =>
        sort.desc ? sortValue(b) - sortValue(a) : sortValue(a) - sortValue(b),
      )
    return [...ethereum, ...l2s]
  }, [summary, sortValue, sort.desc])
}

export function toggleSort(id: string) {
  return (s: Sort): Sort => ({
    id,
    desc: s.id === id ? !s.desc : false,
  })
}

/** Ethereum is the L1, so it has no L1 fee to list */
export function getSplitParts(row: GasFeesSummaryRow) {
  const { base, priority, l1Data } = row.split
  const parts: { key: SplitKey; value: number | null }[] = [
    { key: 'base', value: base },
    { key: 'priority', value: priority },
    ...(row.id === 'ethereum'
      ? []
      : [{ key: 'l1Data' as const, value: l1Data }]),
  ]
  const sum = parts.reduce((s, p) => s + (p.value ?? 0), 0)
  return { parts, sum }
}

/** The values behind a split, with the chain's notes on how each part works */
export function SplitTooltipBody({
  row,
  chain,
}: {
  row: GasFeesSummaryRow
  chain: GasFeesChain
}) {
  const { parts, sum } = getSplitParts(row)
  const hasNotes = Object.keys(chain.feeSplitNotes).length > 0
  return (
    <div
      className={cn(
        'flex flex-col text-xs tabular-nums',
        hasNotes ? 'w-80 gap-2.5' : 'w-60 gap-1.5',
      )}
    >
      <span className="flex items-baseline justify-between gap-3">
        <span className="font-bold text-sm">Fees on {chain.name}</span>
        <span className="font-bold">{formatFee(row.totalFees)}</span>
      </span>
      {parts.map((p) => {
        const note = p.value === null ? undefined : chain.feeSplitNotes[p.key]
        return (
          <span key={p.key} className="flex flex-col gap-0.5">
            <span className="flex justify-between gap-3">
              <span className="flex items-center gap-1.5 whitespace-nowrap text-secondary">
                <span
                  className={cn('size-2 rounded-xs', FEE_SPLIT_COLORS[p.key])}
                />
                {FEE_SPLIT_LABELS[p.key]}
              </span>
              {p.value === null ? (
                <span className="text-secondary">
                  {p.key === 'priority' ? 'n/a' : EM_DASH}
                </span>
              ) : (
                <span>
                  {formatFee(p.value)}{' '}
                  <span className="inline-block w-9 text-right text-secondary">
                    {sum > 0 ? Math.round((p.value / sum) * 100) : 0}%
                  </span>
                </span>
              )}
            </span>
            {note && (
              <span className="text-2xs text-secondary leading-snug">
                {note}
              </span>
            )}
          </span>
        )
      })}
      {row.split.priority === null && chain.noPriorityFeeNote && (
        <span className="text-2xs text-secondary">
          {chain.noPriorityFeeNote}
        </span>
      )}
    </div>
  )
}

export function ActionPicker({
  value,
  onChange,
  className,
}: {
  value: GasFeesUsdMetric
  onChange: (value: GasFeesUsdMetric) => void
  className?: string
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as GasFeesUsdMetric)}
    >
      <SelectTrigger
        className={cn(
          'min-h-8 rounded-lg bg-surface-secondary px-3 font-medium',
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {GAS_FEES_USD_METRICS.map((metric) => (
          <SelectItem key={metric} value={metric}>
            {GAS_FEES_METRIC_LABELS[metric].short}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** A head that sorts on click; the arrow shows only when it's the sort */
export function SortButton({
  sort,
  onSort,
  align,
  children,
  className,
}: {
  sort: Sort | undefined
  onSort: () => void
  align?: 'right'
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onSort}
      className={cn(
        'group/sort flex cursor-pointer items-end gap-1 uppercase hover:text-primary',
        align === 'right' && 'flex-row-reverse',
        sort && 'text-primary',
        className,
      )}
    >
      <span className="whitespace-nowrap">{children}</span>
      <span
        className={cn(
          'w-2 text-[11px] leading-none',
          sort ? 'opacity-100' : 'opacity-0 group-hover/sort:opacity-50',
        )}
        aria-hidden
      >
        {sort?.desc ? '↓' : '↑'}
      </span>
    </button>
  )
}

export function ChainCell({
  chain,
  typeClassName,
}: {
  chain: GasFeesChain
  /** e.g. hides the chain's type where the row is tight */
  typeClassName?: string
}) {
  return (
    <a
      href={chain.href}
      className="flex items-center gap-2 whitespace-nowrap pr-2"
    >
      <img
        src={chain.iconUrl}
        alt=""
        width={20}
        height={20}
        className="size-5 rounded-full"
      />
      <span className="flex flex-col">
        <span className="font-bold">{chain.name}</span>
        <span className={cn('text-2xs text-secondary', typeClassName)}>
          {chain.type}
        </span>
      </span>
    </a>
  )
}

export function TokenBadge({ token }: { token: string }) {
  return (
    <span
      className={cn(
        'rounded border px-1 font-medium text-2xs leading-4',
        token === 'ETH'
          ? 'border-divider text-secondary'
          : 'border-chart-stacked-pink text-chart-stacked-pink',
      )}
    >
      {token}
    </span>
  )
}

export function Footnotes({
  chains,
  summary,
  className,
}: {
  chains: GasFeesChain[]
  summary: GasFeesSummary | undefined
  className?: string
}) {
  const notLive = summary?.notLiveIds
    .map((id) => chains.find((c) => c.id === id)?.name)
    .filter(Boolean)
  const unsplit = summary?.rows.find((r) => r.id === 'ethereum')?.split.unsplit
  return (
    <div
      className={cn(
        'flex flex-col gap-1 text-2xs text-secondary leading-snug',
        className,
      )}
    >
      {unsplit !== undefined && unsplit > 0 && (
        <span>
          Ethereum's base and priority fees start at London (5 Aug 2021).
        </span>
      )}
      {notLive && notLive.length > 0 && (
        <span>Not live yet: {notLive.join(', ')}</span>
      )}
    </div>
  )
}

/** Whole powers of ten around the values, so each step is 10× */
export function getLogDomain(values: number[]) {
  const positive = values.filter((v) => v > 0)
  if (positive.length === 0) return { lo: 0, hi: 1 }
  const lo = Math.floor(Math.log10(Math.min(...positive)))
  let hi = Math.ceil(Math.log10(Math.max(...positive)))
  if (hi === lo) hi = lo + 1
  return { lo, hi }
}

export function logShare(value: number, domain: { lo: number; hi: number }) {
  if (value <= 0) return 0
  const t = (Math.log10(value) - domain.lo) / (domain.hi - domain.lo)
  return Math.min(1, Math.max(0, t))
}

export function decades(domain: { lo: number; hi: number }) {
  const out: number[] = []
  for (let e = domain.lo; e <= domain.hi; e++) out.push(e)
  return out
}

const compact = Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumSignificantDigits: 3,
})

/** "$22.2M", "$581K", "$4.15K" */
export function compactUsd(value: number) {
  if (value === 0) return '$0'
  if (value < 1) return formatFee(value)
  return `$${compact.format(value)}`
}

/** "$1", "10¢", "1¢", "0.1¢": cents read faster than leading zeros */
export function formatCostTick(exponent: number) {
  if (exponent >= 0) return `$${compact.format(10 ** exponent)}`
  const cents = 10 ** (exponent + 2)
  return `${Number(cents.toPrecision(1))}¢`
}
