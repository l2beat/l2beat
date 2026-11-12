import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
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
import type { GasFeesSummaryRow } from '~/server/features/gas-fees/getGasFeesSummary'
import type { GasFeesUsdMetric } from '~/server/features/gas-fees/types'
import { cn } from '~/utils/cn'
import { formatFee, formatTimes, GAS_FEES_METRIC_LABELS } from '../../metrics'
import {
  AxisGrid,
  AxisLegend,
  Connector,
  type CostAxis,
  CostDot,
  EthLine,
  getCostAxis,
  LabelledSplit,
  pct,
  SameDaysTick,
  SplitLegend,
} from './axis'
import {
  ActionPicker,
  ChainCell,
  compactUsd,
  Footnotes,
  formatCostTick,
  getLogDomain,
  logShare,
  type Sort,
  SortButton,
  type TableProps,
  TokenBadge,
  toggleSort,
  useSortedRows,
} from './shared'

const ROW = 'h-11 md:h-12'
const SPLIT_TOOLTIP =
  'Base fee: set by the protocol from demand, burned on Ethereum; on L2s, the L2’s own execution fee. Priority fee: a tip for being included sooner. L1 fee: what L2 users pay for posting their data to Ethereum.'

/**
 * B2: B, polished. The Ethereum line is named in the header, the fee bars
 * are big enough to compare, rows are tighter and the chain's type gives way
 * on mobile.
 */
export function TableB2({
  chains,
  summary,
  isLoading,
  rangeControl,
  period,
  highlightedChainId,
  setHighlightedChainId,
}: TableProps) {
  const [action, setAction] = useState<GasFeesUsdMetric>('erc20')
  const [sort, setSort] = useState<Sort>({ id: 'cost', desc: false })
  const sortValues: Record<string, (row: GasFeesSummaryRow) => number> = {
    cost: (row) => row[action],
    cheaper: (row) => row.timesCheaper?.[action] ?? 1,
    total: (row) => row.totalFees,
  }
  const rows = useSortedRows(summary, sort, sortValues[sort.id])
  const axis = getCostAxis(rows, action)
  const feeDomain = getLogDomain(rows.map((r) => r.totalFees))

  const head = (id: string, label: string, align?: 'right') => (
    <SortButton
      align={align}
      sort={sort.id === id ? sort : undefined}
      onSort={() => setSort(toggleSort(id))}
    >
      {label}
    </SortButton>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-xl md:text-2xl">
            What one transaction costs
          </h2>
          <p className="text-secondary text-xs leading-snug">
            {GAS_FEES_METRIC_LABELS[action].title}, {period}. Log scale, each
            gridline 10× the last. L2 costs include their L1 fee.
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
              <TableHead className="h-auto">Chain</TableHead>
              <TableHead align="right" className="h-auto">
                {head('cost', 'Cost', 'right')}
              </TableHead>
              <TableHead className="h-auto w-full min-w-[260px] pb-0 md:min-w-[300px]">
                <AxisHead axis={axis} />
              </TableHead>
              <TableHead align="right" className="h-auto">
                {head('cheaper', 'Cheaper', 'right')}
              </TableHead>
              <TableHead align="right" className="h-auto pl-4">
                {head('total', 'Total fees', 'right')}
              </TableHead>
              <TableHead className="h-auto" tooltip={SPLIT_TOOLTIP}>
                Fee split
              </TableHead>
              <TableHead className="h-auto">Paid in</TableHead>
            </TableHeaderRow>
          </TableHeader>
        }
      >
        <TableBody>
          {isLoading || !summary
            ? chains.map((chain) => (
                <TableRow key={chain.id} highlightId={undefined}>
                  <TableCell colSpan={7} className={ROW}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : rows.map((row) => {
                const chain = chains.find((c) => c.id === row.id)
                if (!chain) return null
                const isEthereum = row.id === 'ethereum'
                const isHighlighted = row.id === highlightedChainId
                const times = row.timesCheaper?.[action]
                const at = axis.at(row[action])
                const sameDaysAt = axis.sameDaysAt(row) ?? axis.ethAt
                return (
                  <TableRow
                    key={row.id}
                    highlightId={undefined}
                    className={cn(
                      isEthereum && 'bg-surface-secondary/50',
                      isHighlighted && 'bg-surface-secondary',
                    )}
                    onMouseEnter={() => setHighlightedChainId(row.id)}
                    onMouseLeave={() => setHighlightedChainId(undefined)}
                  >
                    <TableCell className={ROW}>
                      <ChainCell chain={chain} typeClassName="max-md:hidden" />
                    </TableCell>
                    <TableCell
                      align="right"
                      className={cn(ROW, 'pl-2 font-bold tabular-nums')}
                    >
                      {formatFee(row[action])}
                    </TableCell>
                    <TableCell className={ROW}>
                      <div className={cn('relative mx-3', ROW)}>
                        <AxisGrid ticks={axis.ticks} />
                        <EthLine at={axis.ethAt} />
                        {!isEthereum && (
                          <>
                            <Connector from={at} to={sameDaysAt} />
                            <SameDaysTick at={sameDaysAt} ethAt={axis.ethAt} />
                          </>
                        )}
                        <CostDot
                          at={at}
                          isEthereum={isEthereum}
                          isHighlighted={isHighlighted}
                        />
                      </div>
                    </TableCell>
                    <TableCell
                      align="right"
                      className={cn(ROW, 'tabular-nums')}
                    >
                      {isEthereum ? (
                        <span className="text-secondary text-xs">1×</span>
                      ) : times === undefined ? (
                        <span className="text-secondary">{EM_DASH}</span>
                      ) : (
                        <span className="font-bold">{formatTimes(times)}</span>
                      )}
                    </TableCell>
                    <TableCell
                      align="right"
                      className={cn(ROW, 'pl-4 tabular-nums')}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="w-[52px]">
                          {compactUsd(row.totalFees)}
                        </span>
                        <span className="flex h-2 w-16 overflow-hidden rounded-[2px] bg-divider/40 md:w-20">
                          <span
                            className="h-full rounded-[2px] bg-secondary/55"
                            style={{
                              width: pct(
                                Math.max(
                                  0.04,
                                  logShare(row.totalFees, feeDomain),
                                ),
                              ),
                            }}
                          />
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className={ROW}>
                      <LabelledSplit
                        row={row}
                        chain={chain}
                        className="w-32 md:w-36"
                      />
                    </TableCell>
                    <TableCell className={ROW}>
                      <TokenBadge token={row.gasToken} />
                    </TableCell>
                  </TableRow>
                )
              })}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-2xs text-secondary">
          <AxisLegend hasYoung={axis.hasYoung} />
          <span className="h-3 w-px bg-divider" />
          <SplitLegend />
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-[2px] bg-secondary/55" />
            Total fees, log scale
          </span>
        </div>
        <Footnotes chains={chains} summary={summary} className="md:items-end" />
      </div>
    </div>
  )
}

/** The ticks, one every 10× */
function AxisHead({ axis }: { axis: CostAxis }) {
  return (
    <div className="relative mx-3 h-10 flex-1">
      {axis.ticks.map((t) => (
        <span
          key={t.exponent}
          className="-translate-x-1/2 absolute bottom-2 font-medium text-[11px] text-secondary normal-case tabular-nums"
          style={{ left: pct(t.at) }}
        >
          {formatCostTick(t.exponent)}
        </span>
      ))}
    </div>
  )
}
