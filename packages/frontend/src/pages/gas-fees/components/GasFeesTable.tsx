import { UnixTime } from '@l2beat/shared-pure'
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
import type { GasFeesRecent } from '~/server/features/gas-fees/getGasFeesRecent'
import type {
  GasFeesSummary,
  GasFeesSummaryRow,
} from '~/server/features/gas-fees/getGasFeesSummary'
import type { GasFeesUnit } from '~/server/features/gas-fees/types'
import { cn } from '~/utils/cn'
import {
  FEE_SPLIT_LABELS,
  FeeSplitBar,
  FeeSplitKey,
  type FeeSplitPart,
} from './FeeSplitBar'
import { formatFee, formatGasPrice, formatTimes } from './metrics'
import {
  GasFeesRecentStrip,
  type RecentHover,
} from './recent/GasFeesRecentStrip'
import { GasFeesRecentLegend } from './recent/GasFeesRecentTooltip'
import { formatHour, getSeries } from './recent/recentScale'
import type { GasFeesChain } from './types'

interface Props {
  chains: GasFeesChain[]
  summary: GasFeesSummary | undefined
  isLoading: boolean
  period: string
  unit: GasFeesUnit
  recent: {
    data: GasFeesRecent | undefined
    hover: RecentHover | undefined
    setHover: (hover: RecentHover | undefined) => void
  }
  highlightedChainId: string | undefined
  setHighlightedChainId: (id: string | undefined) => void
}

interface Column {
  id: string
  head: React.ReactNode
  tooltip?: string
  align?: 'right'
  cell: (row: GasFeesSummaryRow, chain: GasFeesChain) => React.ReactNode
}

export function GasFeesTable({
  chains,
  summary,
  isLoading,
  period,
  unit,
  recent,
  highlightedChainId,
  setHighlightedChainId,
}: Props) {
  const notLive = summary?.notLiveIds
    .map((id) => chains.find((c) => c.id === id)?.name)
    .filter(Boolean)
  const unsplit = summary?.rows.find((r) => r.id === 'ethereum')?.split.unsplit
  const columns = [
    getRecentColumn(recent, unit),
    ...(unit === 'usd' ? getUsdColumns() : getGasColumns()),
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1">
        <h2 className="font-bold text-xl">
          Ethereum vs Layer 2s
          <span className="font-normal text-secondary"> · {period}</span>
        </h2>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <GasFeesRecentLegend />
          <FeeSplitKey
            keys={
              unit === 'usd'
                ? ['base', 'priority', 'l1Data']
                : ['base', 'priority']
            }
          />
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
                >
                  {column.head}
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
            : summary.rows.map((row) => {
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
                      <ChainCell chain={chain} gasToken={row.gasToken} />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        className="tabular-nums"
                      >
                        {column.cell(row, chain)}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-1 text-2xs text-secondary">
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
  )
}

/** Two rows of 12 hours, oldest first */
function getRecentColumn(recent: Props['recent'], unit: GasFeesUnit): Column {
  const hours = recent.data?.hours
  const span = (from: number | undefined, to: number | undefined) =>
    from === undefined || to === undefined
      ? ''
      : `${formatHour(from)}–${formatHour(to + UnixTime.HOUR)}`
  return {
    id: 'recent',
    head: 'Last 24h',
    tooltip: hours
      ? `Top row ${span(hours[0], hours[11])}, bottom row ${span(hours[12], hours[23])} UTC`
      : undefined,
    cell: (row) => {
      const chain = recent.data?.chains.find((c) => c.id === row.id)
      if (!chain) return <Skeleton className="h-[30px] w-[192px]" />
      return (
        <GasFeesRecentStrip
          chainId={row.id}
          series={getSeries(chain, unit)}
          hover={recent.hover}
          onHover={recent.setHover}
          className="w-[192px] grid-cols-12 gap-0.5"
        />
      )
    },
  }
}

function getUsdColumns(): Column[] {
  const usd = (get: (row: GasFeesSummaryRow) => number): Column['cell'] => {
    return (row) => formatFee(get(row))
  }
  return [
    {
      id: 'avgFee',
      head: 'Avg fee',
      tooltip: 'With the change vs the previous period',
      align: 'right',
      cell: (row) => (
        <ValueWithChange
          value={formatFee(row.avgFee)}
          change={row.avgFeeChange}
        />
      ),
    },
    {
      id: 'median',
      head: 'Median fee',
      align: 'right',
      cell: usd((r) => r.medianFee),
    },
    {
      id: 'transfer',
      head: 'ETH transfer',
      tooltip: '21,000 gas',
      align: 'right',
      cell: usd((r) => r.transfer),
    },
    {
      id: 'erc20',
      head: 'ERC-20',
      tooltip: '65,000 gas',
      align: 'right',
      cell: usd((r) => r.erc20),
    },
    {
      id: 'swap',
      head: 'Swap',
      tooltip: '180,000 gas',
      align: 'right',
      cell: usd((r) => r.swap),
    },
    {
      id: 'total',
      head: 'Total fees',
      align: 'right',
      cell: usd((r) => r.totalFees),
    },
    ...getSplitColumn((row) => {
      const { base, priority, l1Data } = row.split
      return {
        parts: [
          { key: 'base', value: base },
          { key: 'priority', value: priority },
          { key: 'l1Data', value: row.id === 'ethereum' ? null : l1Data },
        ],
        format: formatFee,
      }
    }),
    {
      id: 'cheaper',
      head: 'Cheaper by',
      align: 'right',
      cell: (row) =>
        row.timesCheaper === null ? (
          <span className="text-secondary">baseline</span>
        ) : (
          <span className="font-medium">{formatTimes(row.timesCheaper)}</span>
        ),
    },
  ]
}

function getGasColumns(): Column[] {
  return [
    {
      id: 'gasPrice',
      head: 'Gas price',
      tooltip:
        'Base fee plus priority fee, per gas, with the change vs the previous period',
      align: 'right',
      cell: (row) => (
        <ValueWithChange
          value={formatGasPrice(row.gas.price, row.gasUnit)}
          change={row.gas.priceChange}
        />
      ),
    },
    // The bar alone hides the values, which the gas view is about
    {
      id: 'baseFee',
      head: 'Base fee',
      tooltip: SPLIT_TOOLTIPS.base,
      align: 'right' as const,
      cell: (row: GasFeesSummaryRow) =>
        row.gas.base === null
          ? EM_DASH
          : formatGasPrice(row.gas.base, row.gasUnit),
    },
    {
      id: 'priorityFee',
      head: 'Priority fee',
      tooltip: SPLIT_TOOLTIPS.priority,
      align: 'right' as const,
      cell: (row: GasFeesSummaryRow, chain: GasFeesChain) =>
        row.gas.priority === null ? (
          <NoPriorityFee note={chain.noPriorityFeeNote} />
        ) : (
          formatGasPrice(row.gas.priority, row.gasUnit)
        ),
    },
    ...getSplitColumn((row) => ({
      parts: [
        { key: 'base', value: row.gas.base ?? 0 },
        { key: 'priority', value: row.gas.priority },
      ],
      format: (value) => formatGasPrice(value, row.gasUnit),
    })),
  ]
}

type SplitParts = {
  /** null: the chain has no such fee */
  parts: { key: FeeSplitPart['key']; value: number | null }[]
  format: (value: number) => string
}

const SPLIT_TOOLTIPS: Record<FeeSplitPart['key'], string> = {
  base: 'Set by the protocol from demand and burned on Ethereum. On L2s, the L2’s own execution fee.',
  priority:
    'A tip users add to be included sooner. Bots racing for ordering often pay most of it.',
  l1Data: 'What L2 users pay for posting their data to Ethereum.',
}

/** The whole split as one bar, with the values on hover */
function getSplitColumn(
  getParts: (row: GasFeesSummaryRow) => SplitParts,
): Column[] {
  const total = ({ parts }: SplitParts) =>
    parts.reduce((sum, p) => sum + (p.value ?? 0), 0)

  return [
    {
      id: 'split',
      head: 'Fee split',
      cell: (row, chain) => {
        const split = getParts(row)
        const sum = total(split)
        return (
          <Tooltip>
            <TooltipTrigger className="flex w-32 flex-col gap-1 py-1">
              <FeeSplitBar
                className="h-2"
                parts={split.parts.map((p) => ({
                  key: p.key,
                  value: p.value ?? 0,
                }))}
              />
              <span className="flex gap-1.5 text-2xs text-secondary">
                {split.parts.map(
                  (p) =>
                    p.value !== null &&
                    sum > 0 && (
                      <span key={p.key}>
                        {Math.round((p.value / sum) * 100)}%
                      </span>
                    ),
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent className="flex w-60 flex-col gap-1.5 text-xs tabular-nums">
              {split.parts.map((p) => (
                <span key={p.key} className="flex justify-between gap-3">
                  <span className="text-secondary">
                    {FEE_SPLIT_LABELS[p.key]}
                  </span>
                  {p.value === null ? (
                    <span className="text-secondary">
                      {p.key === 'priority' ? 'n/a' : EM_DASH}
                    </span>
                  ) : (
                    <span>
                      {split.format(p.value)}{' '}
                      <span className="text-secondary">
                        {sum > 0 ? Math.round((p.value / sum) * 100) : 0}%
                      </span>
                    </span>
                  )}
                </span>
              ))}
              {split.parts.some(
                (p) => p.key === 'priority' && p.value === null,
              ) &&
                chain.noPriorityFeeNote && (
                  <span className="text-2xs text-secondary">
                    {chain.noPriorityFeeNote}
                  </span>
                )}
            </TooltipContent>
          </Tooltip>
        )
      },
    },
  ]
}

function NoPriorityFee({ note }: { note: string | undefined }) {
  return (
    <Tooltip>
      <TooltipTrigger className="text-secondary underline decoration-dotted underline-offset-2">
        n/a
      </TooltipTrigger>
      <TooltipContent className="w-64">{note}</TooltipContent>
    </Tooltip>
  )
}

function ValueWithChange({
  value,
  change,
}: {
  value: string
  change: number | null
}) {
  return (
    <span className="flex flex-col items-end leading-tight">
      <span className="font-medium">{value}</span>
      {change !== null && (
        <span
          className={cn(
            'text-2xs',
            change < 0 ? 'text-positive' : 'text-negative',
          )}
        >
          {change < 0 ? '▼' : '▲'} {Math.abs(change * 100).toFixed(1)}%
        </span>
      )}
    </span>
  )
}

function ChainCell({
  chain,
  gasToken,
}: {
  chain: GasFeesChain
  gasToken: string
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
        <span className="flex items-center gap-1.5 font-bold">
          {chain.name}
          {gasToken !== 'ETH' && (
            <span className="rounded border border-divider px-1 font-medium text-3xs text-secondary">
              {gasToken}
            </span>
          )}
        </span>
        <span className="text-2xs text-secondary">{chain.type}</span>
      </span>
    </a>
  )
}
