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
import { cn } from '~/utils/cn'
import type { ChartRange } from '~/utils/range/range'
import { formatFee, formatTimes, getPeriodLabel } from './metrics'
import type { GasFeesChain } from './types'

interface Props {
  chains: GasFeesChain[]
  summary: GasFeesSummary | undefined
  range: ChartRange
  isLoading: boolean
  setHighlightedChainId: (id: string | undefined) => void
}

const SPLIT_PARTS = [
  { key: 'base', label: 'Base fee', color: 'bg-chart-stacked-blue' },
  { key: 'priority', label: 'Priority fee', color: 'bg-chart-stacked-pink' },
  { key: 'l1Data', label: 'L1 data fee', color: 'bg-chart-stacked-yellow' },
  { key: 'unsplit', label: 'Before London (no split)', color: 'bg-secondary' },
] as const

export function GasFeesTable({
  chains,
  summary,
  range,
  isLoading,
  setHighlightedChainId,
}: Props) {
  const period = getPeriodLabel(range)
  const notLive = summary?.notLiveIds
    .map((id) => chains.find((c) => c.id === id)?.name)
    .filter(Boolean)

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-bold text-xl">Ethereum vs Layer 2s</h2>
        <p className="text-secondary text-xs">
          Averages and totals, {period}. Change compares the average fee with
          the previous period of the same length. Action costs assume fixed gas
          per action (ETH transfer 21K, ERC-20 transfer 65K, swap 180K) at each
          day's typical fee.
        </p>
      </div>
      <Table
        header={
          <TableHeader>
            <TableHeaderRow>
              <TableHead>Chain</TableHead>
              <TableHead align="right">Avg fee</TableHead>
              <TableHead align="right">Change</TableHead>
              <TableHead align="right">Median fee</TableHead>
              <TableHead align="right">ETH transfer</TableHead>
              <TableHead align="right">ERC-20 transfer</TableHead>
              <TableHead align="right">Swap</TableHead>
              <TableHead align="right">Total fees</TableHead>
              <TableHead
                align="right"
                tooltip="What users paid for: the base fee, the priority tip they added, and on L2s the cost of posting data to Ethereum."
              >
                Fee split
              </TableHead>
              <TableHead align="right">vs Ethereum</TableHead>
            </TableHeaderRow>
          </TableHeader>
        }
      >
        <TableBody>
          {isLoading || !summary
            ? chains.map((chain) => (
                <TableRow key={chain.id} highlightId={undefined}>
                  <TableCell colSpan={10}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : summary.rows.map((row) => {
                const chain = chains.find((c) => c.id === row.id)
                if (!chain) return null
                return (
                  <Row
                    key={row.id}
                    row={row}
                    chain={chain}
                    setHighlightedChainId={setHighlightedChainId}
                  />
                )
              })}
        </TableBody>
      </Table>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-2xs text-secondary">
        {SPLIT_PARTS.map((part) => (
          <span key={part.key} className="flex items-center gap-1.5">
            <span className={cn('size-2 rounded-sm', part.color)} />
            {part.key === 'base' ? 'Base fee (L2: execution)' : part.label}
          </span>
        ))}
        {notLive && notLive.length > 0 && (
          <span>Not live yet in this period: {notLive.join(', ')}</span>
        )}
      </div>
    </div>
  )
}

function Row({
  row,
  chain,
  setHighlightedChainId,
}: {
  row: GasFeesSummaryRow
  chain: GasFeesChain
  setHighlightedChainId: (id: string | undefined) => void
}) {
  const isEthereum = row.id === 'ethereum'
  return (
    <TableRow
      highlightId={undefined}
      className={cn(isEthereum && 'bg-surface-secondary/50')}
      onMouseEnter={() => setHighlightedChainId(row.id)}
      onMouseLeave={() => setHighlightedChainId(undefined)}
    >
      <TableCell>
        <a href={chain.href} className="flex items-center gap-2">
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
      </TableCell>
      <TableCell align="right" className="font-medium tabular-nums">
        {formatFee(row.avgFee)}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {row.avgFeeChange === null ? (
          <span className="text-secondary">{EM_DASH}</span>
        ) : (
          <span
            className={row.avgFeeChange < 0 ? 'text-positive' : 'text-negative'}
          >
            {row.avgFeeChange < 0 ? '▼' : '▲'}{' '}
            {Math.abs(row.avgFeeChange * 100).toFixed(1)}%
          </span>
        )}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {formatFee(row.medianFee)}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {formatFee(row.transfer)}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {formatFee(row.erc20)}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {formatFee(row.swap)}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {formatFee(row.totalFees)}
      </TableCell>
      <TableCell align="right">
        <SplitBar split={row.split} note={chain.noPriorityFeeNote} />
      </TableCell>
      <TableCell align="right" className="font-medium tabular-nums">
        {row.timesCheaper === null ? (
          <span className="font-normal text-secondary">baseline</span>
        ) : (
          `${formatTimes(row.timesCheaper)} cheaper`
        )}
      </TableCell>
    </TableRow>
  )
}

function SplitBar({
  split,
  note,
}: {
  split: GasFeesSummaryRow['split']
  note: string | undefined
}) {
  const total =
    split.base + (split.priority ?? 0) + split.l1Data + split.unsplit
  const parts = SPLIT_PARTS.map((part) => ({
    ...part,
    value: split[part.key],
  }))
  return (
    <Tooltip>
      <TooltipTrigger className="ml-auto flex h-2 w-28 gap-0.5 overflow-hidden rounded-sm">
        {parts.map((part) =>
          part.value ? (
            <span
              key={part.key}
              className={part.color}
              style={{ width: `${(part.value / total) * 100}%` }}
            />
          ) : null,
        )}
      </TooltipTrigger>
      <TooltipContent className="w-64">
        <div className="flex flex-col gap-1">
          {parts
            .filter((part) => part.value !== 0)
            .map((part) => (
              <div
                key={part.key}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="flex items-center gap-1.5">
                  <span className={cn('size-2 rounded-sm', part.color)} />
                  {part.label}
                </span>
                <span className="tabular-nums">
                  {part.value === null
                    ? 'n/a'
                    : `${((part.value / total) * 100).toFixed(1)}%`}
                </span>
              </div>
            ))}
          {note && split.priority === null && (
            <p className="mt-1 text-2xs text-secondary">{note}</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
