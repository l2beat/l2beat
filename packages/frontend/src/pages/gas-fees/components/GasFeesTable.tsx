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
import { SortingArrows } from '~/components/table/sorting/SortingArrows'
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
  GAS_FEES_PERIOD_METRICS,
  type GasFeesPeriodMetric,
} from '~/server/features/gas-fees/types'
import { cn } from '~/utils/cn'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import {
  FEE_SPLIT_COLORS,
  FEE_SPLIT_LABELS,
  FeeSplitBar,
  FeeSplitKey,
} from './FeeSplitBar'
import {
  compareWithEthereum,
  formatFee,
  GAS_FEES_METRIC_LABELS,
} from './metrics'

import { DataGaps, percent } from './parts'
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
  /** null sorts last in either direction */
  sortValue?: (row: GasFeesSummaryRow) => number | null
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
  const [action, setAction] = useState<GasFeesPeriodMetric>('erc20')
  const [sort, setSort] = useState<Sort>({ id: 'cost', desc: false })
  const sortedBy = (id: string) =>
    sort.id === id && (sort.desc ? 'desc' : 'asc')

  const columns: Column[] = [
    ...getCostColumns(action),
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
              ? 'border-divider'
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
      .sort((a, b) => {
        const [x, y] = [sortValue(a), sortValue(b)]
        if (x === null || y === null)
          return Number(x === null) - Number(y === null)
        return sort.desc ? y - x : x - y
      })
    return [...ethereum, ...l2s]
  }, [summary, sortValue, sort.desc])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-xl md:text-2xl">Summary table</h2>
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
                    <SortingArrows
                      direction={sortedBy(column.id)}
                      nextDirection={
                        sortedBy(column.id) === 'asc' ? 'desc' : 'asc'
                      }
                      onClick={() =>
                        setSort({
                          id: column.id,
                          desc: sortedBy(column.id) === 'asc',
                        })
                      }
                    >
                      {column.head}
                    </SortingArrows>
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
        <DataGaps summary={summary} chains={chains} className="md:items-end" />
      </div>
    </div>
  )
}

function getCostColumns(action: GasFeesPeriodMetric): Column[] {
  return [
    {
      id: 'cost',
      head: `${GAS_FEES_METRIC_LABELS[action].short} cost`,
      align: 'right',
      // A chain that had no transactions has no cost
      sortValue: (row) => row[action],
      cell: (row) => {
        const cost = row[action]
        return cost === null ? (
          <span className="text-secondary">{EM_DASH}</span>
        ) : (
          <span className="font-bold">{formatFee(cost)}</span>
        )
      },
    },
    {
      id: 'compared',
      head: 'Compared with Ethereum',
      tooltip:
        "Each chain's cost to scale, with Ethereum's as the full track, and how many times cheaper it is than Ethereum over the same days.",
      className: 'pl-6!',
      sortValue: (row) => row.timesCheaper?.[action] ?? null,
      cell: (row, chain) => {
        // The bar and the words are one comparison, over the same days
        const times =
          row.id === 'ethereum' ? 1 : (row.timesCheaper?.[action] ?? null)
        if (times === null) {
          return <span className="text-secondary">{EM_DASH}</span>
        }
        const compared = compareWithEthereum(times)
        return (
          <span className="flex items-center gap-3">
            <span className="flex h-2.5 w-28 shrink-0 overflow-hidden rounded-full bg-surface-secondary lg:w-44">
              <span
                className="block h-full rounded-full"
                style={{
                  width: `max(4px, ${Math.min(100, 100 / times)}%)`,
                  backgroundColor: chain.color,
                }}
              />
            </span>
            {row.id === 'ethereum' ? (
              <span className="whitespace-nowrap text-xs">baseline</span>
            ) : (
              compared && (
                <span className="whitespace-nowrap text-xs">
                  <span className="font-bold">{compared.times}</span>{' '}
                  {compared.word}
                </span>
              )
            )}
          </span>
        )
      },
    },
  ]
}

function ActionPicker({
  value,
  onChange,
}: {
  value: GasFeesPeriodMetric
  onChange: (value: GasFeesPeriodMetric) => void
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as GasFeesPeriodMetric)}
    >
      <SelectTrigger className="min-h-8 rounded-lg bg-surface-secondary px-3 font-medium">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {GAS_FEES_PERIOD_METRICS.map((metric) => (
          <SelectItem key={metric} value={metric}>
            {GAS_FEES_METRIC_LABELS[metric].short}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** The whole split as one bar, with the values on hover */
function getSplitColumn(): Column {
  return {
    id: 'split',
    head: ['Base', 'Priority', 'L1 fee'].join(DOT_SEPARATOR),
    tooltip:
      'Base fee: set by the protocol from demand, burned on Ethereum; on L2s, the L2’s own execution fee. Priority fee: a tip for being included sooner. L1 fee: what L2 users pay for posting their data to Ethereum.',
    className: 'pl-6!',
    cell: (row, chain) => {
      const { base, priority, l1Data } = row.split
      // Ethereum is the L1, so it has no L1 fee to list
      const parts: {
        key: 'base' | 'priority' | 'l1Data'
        value: number | null
      }[] = [
        { key: 'base', value: base },
        { key: 'priority', value: priority },
        ...(row.id === 'ethereum'
          ? []
          : [{ key: 'l1Data' as const, value: l1Data }]),
      ]
      const sum = parts.reduce((s, p) => s + (p.value ?? 0), 0)
      const hasNotes = Object.keys(chain.feeSplitNotes).length > 0
      return (
        <Tooltip>
          <TooltipTrigger className="flex w-36 items-center py-3">
            <FeeSplitBar
              className="h-2"
              parts={parts.map((p) => ({ key: p.key, value: p.value ?? 0 }))}
            />
          </TooltipTrigger>
          {/* Wider when the chain explains its parts, so each note fits in a few lines */}
          <TooltipContent
            className={cn(
              'flex flex-col text-xs tabular-nums',
              hasNotes ? 'w-80 gap-2.5' : 'w-60 gap-1.5',
            )}
          >
            {hasNotes && (
              <span className="font-bold text-sm">Fees on {chain.name}</span>
            )}
            {parts.map((p) => {
              const note =
                p.value === null ? undefined : chain.feeSplitNotes[p.key]
              return (
                <span key={p.key} className="flex flex-col gap-0.5">
                  <span className="flex justify-between gap-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      {hasNotes && (
                        <span
                          className="size-2 rounded-xs"
                          style={{ backgroundColor: FEE_SPLIT_COLORS[p.key] }}
                        />
                      )}
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
                          {percent(sum > 0 ? p.value / sum : 0)}
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
