import { useState } from 'react'
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
import type { PeriodMetric } from '~/server/features/gas-fees/daily/metrics'
import type {
  ChainSummary,
  SharedDays,
} from '~/server/features/gas-fees/daily/summarizeChains'
import type { GasFeesChain } from '~/server/features/gas-fees/getGasFeesChains'
import { cn } from '~/utils/cn'
import { compareCosts } from '../../utils/compare'
import { formatMissingDays, formatUsd } from '../../utils/format'
import {
  isOnScale,
  type LogScale,
  logPercent,
  logPosition,
  logScaleOf,
} from '../../utils/logScale'
import { useChainHighlight } from '../ChainHighlight'
import { DecadeAxis, DecadeLines, formatCentsDecade } from '../DecadeAxis'
import { KeySwatch } from '../ShareBar'
import { FEE_PARTS, FeeSplitBar } from './FeeSplitBar'
import { type CostSortKey, sortCostRows } from './sortCostRows'

const NEAR = [0x4a, 0xde, 0x80] // green
const FAR = [0xf5, 0xc7, 0x10] // yellow

interface CostRow {
  chain: GasFeesChain
  summary: ChainSummary
  cost: number | null
  shared: SharedDays | null
  isEthereum: boolean
  sortValues: Record<CostSortKey, number | null>
}

export function CostsTable({
  chains,
  summaries,
  metric,
  isPlaceholderData,
}: {
  chains: GasFeesChain[]
  summaries: ChainSummary[] | undefined
  metric: PeriodMetric
  isPlaceholderData: boolean
}) {
  const [sort, setSort] = useState<{ key: CostSortKey; desc: boolean }>({
    key: 'cost',
    desc: false,
  })
  const highlight = useChainHighlight()
  if (!summaries)
    return (
      <div
        aria-hidden
        className="h-[640px] animate-pulse rounded-lg bg-surface-secondary"
      />
    )

  const rows: CostRow[] = chains.flatMap((chain) => {
    const summary = summaries.find((s) => s.chain === chain.id)
    if (!summary) return []
    const cost = summary.costs[metric]
    const shared = summary.vsEthereum?.[metric] ?? null
    return [
      {
        chain,
        summary,
        cost,
        shared,
        isEthereum: chain.id === 'ethereum',
        sortValues: {
          cost,
          cheaper:
            shared && shared.chain > 0 ? shared.ethereum / shared.chain : null,
          totalFees: summary.hasData ? summary.feesUsd : null,
        },
      },
    ]
  })
  const ethereumCost = rows.find((r) => r.isEthereum)?.cost ?? null
  // Ethereum's shared-day costs are drawn as ticks, so the axis holds them too
  const axis = logScaleOf(
    rows.flatMap((r) => [r.cost ?? 0, r.shared?.ethereum ?? 0]),
  )
  const feesScale = logScaleOf(rows.map((r) => r.summary.feesUsd))
  const sorted = sortCostRows(rows, sort.key, sort.desc)
  const missing = rows.filter((r) => r.summary.missingDays > 0)

  const sortHead = (key: CostSortKey, label: string) => (
    <SortingArrows
      direction={sort.key === key ? (sort.desc ? 'desc' : 'asc') : false}
      nextDirection={sort.key === key && !sort.desc ? 'desc' : 'asc'}
      onClick={() =>
        setSort({ key, desc: sort.key === key ? !sort.desc : false })
      }
    >
      {label}
    </SortingArrows>
  )

  return (
    <div
      className={cn('flex flex-col gap-3', isPlaceholderData && 'opacity-60')}
    >
      <Table
        header={
          <TableHeader>
            <TableHeaderRow>
              <TableHead>Chain</TableHead>
              <TableHead align="right">{sortHead('cost', 'Cost')}</TableHead>
              <TableHead className="w-[380px] min-w-[260px] pl-4">
                <AxisHead scale={axis} ethereum={ethereumCost} />
              </TableHead>
              <TableHead align="right">
                {sortHead('cheaper', 'Cheaper')}
              </TableHead>
              <TableHead align="right">
                {sortHead('totalFees', 'Total fees')}
              </TableHead>
              <TableHead tooltip="Base fee: set by the protocol from demand, burned on Ethereum; on L2s, the L2’s own execution fee. Priority fee: a tip for being included sooner. L1 data: what L2 users pay for posting their data to Ethereum.">
                Fee split
              </TableHead>
              <TableHead>Paid in</TableHead>
            </TableHeaderRow>
          </TableHeader>
        }
      >
        <TableBody>
          {sorted.map((row) => (
            <TableRow
              key={row.chain.id}
              highlightId={undefined}
              className={cn(
                'hover:bg-surface-secondary',
                row.isEthereum && 'bg-surface-secondary/60',
              )}
              onMouseEnter={() => highlight.setChain(row.chain.id)}
              onMouseLeave={() => highlight.setChain(undefined)}
            >
              <TableCell>
                <a href={row.chain.href} className="flex items-center gap-2">
                  <img src={row.chain.iconUrl} alt="" className="size-5" />
                  <span className="flex flex-col">
                    <span className="font-bold">{row.chain.name}</span>
                    <span className="text-2xs text-secondary max-md:hidden">
                      {row.chain.type}
                    </span>
                  </span>
                </a>
              </TableCell>
              <TableCell align="right" className="font-bold tabular-nums">
                {row.cost === null ? '–' : formatUsd(row.cost)}
              </TableCell>
              <TableCell>
                <AxisCell scale={axis} row={row} ethereum={ethereumCost} />
              </TableCell>
              <TableCell align="right" className="font-bold tabular-nums">
                <Cheaper row={row} />
              </TableCell>
              <TableCell align="right">
                <span className="flex items-center justify-end gap-2 tabular-nums">
                  {row.summary.hasData ? formatUsd(row.summary.feesUsd) : '–'}
                  <span className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-tertiary">
                    {row.summary.feesUsd > 0 && (
                      <span
                        className="block h-full bg-secondary"
                        style={{
                          width: logPercent(feesScale, row.summary.feesUsd),
                        }}
                      />
                    )}
                  </span>
                </span>
              </TableCell>
              <TableCell>
                <FeeSplitBar
                  split={row.summary.split}
                  notes={row.chain.notes}
                />
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    'rounded border px-1 font-semibold text-2xs',
                    row.chain.gasToken === 'ETH'
                      ? 'border-divider'
                      : 'border-brand',
                  )}
                >
                  {row.chain.gasToken}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-3 text-2xs">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5">
            Cheaper
            <span className="h-1.5 w-10 rounded-full bg-linear-to-r from-[#4ade80] to-[#f5c710]" />
            Ethereum’s cost
          </span>
          {FEE_PARTS.map((part) => (
            <span key={part.key} className="flex items-center gap-1.5">
              <KeySwatch color={part.color} />
              {part.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-4 rounded-full bg-secondary" />
            Total fees, log scale
          </span>
        </div>
        {missing.length > 0 && (
          <span>
            {formatMissingDays(
              missing.map((r) => ({
                name: r.chain.name,
                days: r.summary.missingDays,
              })),
            )}
          </span>
        )}
      </div>
    </div>
  )
}

function Cheaper({ row }: { row: CostRow }) {
  if (row.isEthereum) return '1×'
  const comparison =
    row.shared && compareCosts(row.shared.chain, row.shared.ethereum)
  if (!comparison) return <span className="text-secondary">–</span>
  return comparison.cheaper ? (
    comparison.ratio
  ) : (
    <span className="text-negative">{comparison.ratio} dearer</span>
  )
}

function AxisHead({
  scale,
  ethereum,
}: {
  scale: LogScale
  ethereum: number | null
}) {
  return (
    <div className="relative h-8 w-full normal-case">
      {ethereum !== null && isOnScale(scale, ethereum) && (
        <span
          className="-translate-x-1/2 absolute top-0 text-2xs uppercase"
          style={{ left: logPercent(scale, ethereum) }}
        >
          Ethereum
        </span>
      )}
      <DecadeAxis
        scale={scale}
        format={formatCentsDecade}
        className="absolute bottom-0 font-medium"
      />
    </div>
  )
}

/** A faint rail and the chain's dot, coloured by how near Ethereum's cost it sits */
function AxisCell({
  scale,
  row,
  ethereum,
}: {
  scale: LogScale
  row: CostRow
  ethereum: number | null
}) {
  const ethereumOnScale = ethereum !== null && isOnScale(scale, ethereum)
  // Ethereum's cost over the days this chain has too, where that differs
  const sharedTick =
    row.shared &&
    ethereum !== null &&
    Math.abs(row.shared.ethereum / ethereum - 1) > 0.005
      ? row.shared.ethereum
      : undefined
  return (
    <div className="relative h-6 w-full">
      <DecadeLines scale={scale} className="inset-y-[-12px]" />
      {ethereumOnScale && (
        <div
          className="absolute inset-y-[-12px] border-secondary border-l border-dashed"
          style={{ left: logPercent(scale, ethereum) }}
        />
      )}
      <div className="-translate-y-1/2 absolute inset-x-0 top-1/2 h-1.5 rounded-full bg-linear-to-r from-[#4ade80]/30 to-[#f5c710]/30" />
      {sharedTick !== undefined && isOnScale(scale, sharedTick) && (
        <div
          className="-translate-x-1/2 absolute top-1 h-4 w-0.5 bg-secondary"
          style={{ left: logPercent(scale, sharedTick) }}
        />
      )}
      {row.cost !== null && isOnScale(scale, row.cost) && (
        <div
          className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 size-3 rounded-full"
          style={{
            left: logPercent(scale, row.cost),
            backgroundColor: nearness(scale, row.cost, ethereum),
          }}
        />
      )}
    </div>
  )
}

/** Green far below Ethereum's cost, yellow at it */
function nearness(scale: LogScale, cost: number, ethereum: number | null) {
  const at =
    ethereum !== null && ethereum > 0 ? logPosition(scale, ethereum) : 0
  const t = at > 0 ? Math.min(1, Math.max(0, logPosition(scale, cost) / at)) : 1
  const channel = (i: number) =>
    Math.round((NEAR[i] ?? 0) + ((FAR[i] ?? 0) - (NEAR[i] ?? 0)) * t)
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`
}
