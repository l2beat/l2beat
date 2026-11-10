import { useMemo, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/components/table/Table'
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
import { FEE_SPLIT_LABELS, FeeSplitBar, FeeSplitKey } from './FeeSplitBar'
import { formatFee, formatTimes, GAS_FEES_METRIC_LABELS } from './metrics'
import type { GasFeesChain } from './types'

interface Props {
  chains: GasFeesChain[]
  summary: GasFeesSummary | undefined
  isLoading: boolean
  /** Picks the range every value in the table is for */
  rangeControl: React.ReactNode
  /** The picked range in words, e.g. "past 30 days" */
  period: string
  highlightedChainId: string | undefined
  setHighlightedChainId: (id: string | undefined) => void
}

interface Column {
  id: string
  head: React.ReactNode
  tooltip?: string
  align?: 'right'
  className?: string
  sortValue?: (row: GasFeesSummaryRow) => number
  cell: (row: GasFeesSummaryRow, chain: GasFeesChain) => React.ReactNode
}

type Sort = { id: string; desc: boolean }

export function GasFeesTable({
  chains,
  summary,
  isLoading,
  rangeControl,
  period,
  highlightedChainId,
  setHighlightedChainId,
}: Props) {
  const [action, setAction] = useState<GasFeesUsdMetric>('erc20')
  const [sort, setSort] = useState<Sort>({ id: 'cost', desc: false })
  const notLive = summary?.notLiveIds
    .map((id) => chains.find((c) => c.id === id)?.name)
    .filter(Boolean)
  const ethereum = summary?.rows.find((r) => r.id === 'ethereum')
  const unsplit = ethereum?.split.unsplit

  const columns: Column[] = [
    ...getCostColumns(action, ethereum),
    {
      id: 'total',
      head: 'Total fees',
      align: 'right',
      className: 'pl-8!',
      sortValue: (row) => row.totalFees,
      cell: (row) => formatFee(row.totalFees),
    },
    getSplitColumn(),
    {
      id: 'paidIn',
      head: 'Paid in',
      cell: (row) => (
        <span
          className={cn(
            'rounded border px-1 font-medium text-2xs',
            row.gasToken === 'ETH'
              ? 'border-divider text-secondary'
              : 'border-chart-stacked-pink text-chart-stacked-pink',
          )}
        >
          {row.gasToken}
        </span>
      ),
    },
  ]
  const sortValue = columns.find((c) => c.id === sort.id)?.sortValue
  const rows = useMemo(() => {
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-xl md:text-2xl">
            Ethereum vs Layer 2s
          </h2>
          <p className="text-secondary text-xs">
            {GAS_FEES_METRIC_LABELS[action].short} cost and fees, {period}. L2
            costs include their L1 fee.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ActionPicker value={action} onChange={setAction} />
          {rangeControl}
        </div>
      </div>
      <Table
        header={
          <TableHeader>
            <TableHeaderRow>
              <TableHead>Chain</TableHead>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  align={column.align}
                  tooltip={column.tooltip}
                  className={column.className}
                >
                  {column.sortValue ? (
                    <SortableHead
                      align={column.align}
                      sort={sort.id === column.id ? sort : undefined}
                      onSort={() =>
                        setSort((s) => ({
                          id: column.id,
                          desc: s.id === column.id ? !s.desc : false,
                        }))
                      }
                    >
                      {column.head}
                    </SortableHead>
                  ) : (
                    column.head
                  )}
                </TableHead>
              ))}
            </TableHeaderRow>
          </TableHeader>
        }
      >
        <TableBody>
          {isLoading || !summary
            ? chains.map((chain) => (
                <TableRow key={chain.id} highlightId={undefined}>
                  <TableCell colSpan={columns.length + 1}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : rows.map((row) => {
                const chain = chains.find((c) => c.id === row.id)
                if (!chain) return null
                return (
                  <TableRow
                    key={row.id}
                    highlightId={undefined}
                    className={cn(
                      row.id === 'ethereum' && 'bg-surface-secondary/50',
                      row.id === highlightedChainId && 'bg-surface-secondary',
                    )}
                    onMouseEnter={() => setHighlightedChainId(row.id)}
                    onMouseLeave={() => setHighlightedChainId(undefined)}
                  >
                    <TableCell>
                      <ChainCell chain={chain} />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        className={cn('tabular-nums', column.className)}
                      >
                        {column.cell(row, chain)}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <FeeSplitKey keys={['base', 'priority', 'l1Data']} />
        <div className="flex flex-col gap-1 text-2xs text-secondary md:items-end">
          {unsplit !== undefined && unsplit > 0 && (
            <span>
              Ethereum's base and priority fees start at London (5 Aug 2021).
            </span>
          )}
          {notLive && notLive.length > 0 && (
            <span>Not live yet: {notLive.join(', ')}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function getCostColumns(
  action: GasFeesUsdMetric,
  ethereum: GasFeesSummaryRow | undefined,
): Column[] {
  return [
    {
      id: 'cost',
      head: `${GAS_FEES_METRIC_LABELS[action].short} cost`,
      align: 'right',
      sortValue: (row) => row[action],
      cell: (row) => (
        <span className="font-bold">{formatFee(row[action])}</span>
      ),
    },
    {
      id: 'compared',
      head: 'Compared with Ethereum',
      tooltip: "Each chain's cost to scale, with Ethereum's as the full track.",
      className: 'pl-6!',
      cell: (row, chain) => {
        const base = ethereum?.[action]
        if (!base) return null
        const share = row[action] / base
        return (
          <span className="flex h-2.5 w-40 overflow-hidden rounded-full bg-surface-secondary lg:w-56">
            <span
              className="block h-full rounded-full"
              style={{
                width: `max(4px, ${Math.min(100, share * 100)}%)`,
                backgroundColor: chain.color,
              }}
            />
          </span>
        )
      },
    },
    {
      id: 'cheaper',
      head: 'Cheaper by',
      align: 'right',
      sortValue: (row) => row.timesCheaper?.[action] ?? 1,
      cell: (row) => {
        const times = row.timesCheaper?.[action]
        return times === undefined ? (
          <span className="text-secondary">baseline</span>
        ) : (
          <span className="font-medium">{formatTimes(times)}</span>
        )
      },
    },
  ]
}

function ActionPicker({
  value,
  onChange,
}: {
  value: GasFeesUsdMetric
  onChange: (value: GasFeesUsdMetric) => void
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as GasFeesUsdMetric)}
    >
      <SelectTrigger className="min-h-8 rounded-lg bg-surface-secondary px-3 font-medium">
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

function SortableHead({
  sort,
  onSort,
  align,
  children,
}: {
  sort: Sort | undefined
  onSort: () => void
  align?: 'right'
  children: React.ReactNode
}) {
  return (
    <span
      className={cn('flex items-end gap-1', align === 'right' && 'justify-end')}
    >
      {children}
      <button
        type="button"
        onClick={onSort}
        aria-label="Sort"
        className={cn(
          'cursor-pointer text-xs leading-none hover:text-primary',
          sort ? 'text-primary' : 'text-secondary opacity-50',
        )}
      >
        {sort?.desc ? '↓' : '↑'}
      </button>
    </span>
  )
}

/** The whole split as one bar, with the values on hover */
function getSplitColumn(): Column {
  return {
    id: 'split',
    head: 'Base · Priority · L1 fee',
    tooltip:
      'Base fee: set by the protocol from demand, burned on Ethereum; on L2s, the L2’s own execution fee. Priority fee: a tip for being included sooner. L1 fee: what L2 users pay for posting their data to Ethereum.',
    className: 'pl-6!',
    cell: (row, chain) => {
      const { base, priority, l1Data } = row.split
      const parts = [
        { key: 'base' as const, value: base },
        { key: 'priority' as const, value: priority },
        {
          key: 'l1Data' as const,
          value: row.id === 'ethereum' ? null : l1Data,
        },
      ]
      const sum = parts.reduce((s, p) => s + (p.value ?? 0), 0)
      return (
        <Tooltip>
          <TooltipTrigger className="flex w-36 items-center py-3">
            <FeeSplitBar
              className="h-2"
              parts={parts.map((p) => ({ key: p.key, value: p.value ?? 0 }))}
            />
          </TooltipTrigger>
          <TooltipContent className="flex w-60 flex-col gap-1.5 text-xs tabular-nums">
            {parts.map((p) => (
              <span key={p.key} className="flex justify-between gap-3">
                <span className="whitespace-nowrap text-secondary">
                  {FEE_SPLIT_LABELS[p.key]}
                </span>
                {p.value === null ? (
                  <span className="text-secondary">
                    {p.key === 'priority' ? 'n/a' : EM_DASH}
                  </span>
                ) : (
                  <span>
                    {formatFee(p.value)}{' '}
                    <span className="text-secondary">
                      {sum > 0 ? Math.round((p.value / sum) * 100) : 0}%
                    </span>
                  </span>
                )}
              </span>
            ))}
            {priority === null && chain.noPriorityFeeNote && (
              <span className="text-2xs text-secondary">
                {chain.noPriorityFeeNote}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      )
    },
  }
}

function ChainCell({ chain }: { chain: GasFeesChain }) {
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
        <span className="text-2xs text-secondary">{chain.type}</span>
      </span>
    </a>
  )
}
