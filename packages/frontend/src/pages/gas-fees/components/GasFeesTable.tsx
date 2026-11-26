import { useMemo, useState } from 'react'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { rangeToOption } from '~/components/core/chart/utils/rangeToOption'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
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
import type { FeeSplitPartKey } from '~/server/features/gas-fees/chains'
import type { GasFeesSummaryRow } from '~/server/features/gas-fees/getGasFeesSummary'
import {
  GAS_FEES_PERIOD_METRICS,
  type GasFeesPeriodMetric,
} from '~/server/features/gas-fees/types'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import {
  FEE_SPLIT_COLORS,
  FEE_SPLIT_LABELS,
  FeeSplitBar,
  FeeSplitKey,
} from './FeeSplitBar'
import { compareWithEthereum, formatFee, percent, usd } from './format'
import {
  CostAxisHead,
  CostAxisKey,
  CostAxisRow,
  getCostAxis,
} from './GasFeesCostAxis'
import { getDecadeDomain, logShare } from './logScale'
import {
  GAS_FEES_METRIC_LABELS,
  GAS_FEES_RANGE_LABELS,
  GAS_FEES_RANGE_OPTIONS,
  getPeriodLabel,
} from './metrics'
import { DataGaps } from './parts'
import type { GasFeesChain } from './types'

interface Props {
  chains: GasFeesChain[]
  /** The range every value in the table is for, until another is picked */
  initialRange: ChartRange
  highlightedChainId: string | undefined
  setHighlightedChainId: (id: string | undefined) => void
}

type SortId = 'cost' | 'cheaper' | 'total'
type Sort = { id: SortId; desc: boolean }

const ROW = 'h-11 md:h-12'
const COLUMNS = 7

export function GasFeesTable({
  chains,
  initialRange,
  highlightedChainId,
  setHighlightedChainId,
}: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState(initialRange)
  const {
    data: summary,
    isLoading,
    shownInput,
  } = useChartQuery(trpc.gasFees.summary, { range })
  const [action, setAction] = useState<GasFeesPeriodMetric>('erc20')
  const [sort, setSort] = useState<Sort>({ id: 'cost', desc: false })

  const rows = useMemo(() => {
    // null sorts last in either direction: a chain that had no transactions has no cost
    const sortValue: Record<SortId, (row: GasFeesSummaryRow) => number | null> =
      {
        cost: (row) => row[action],
        cheaper: (row) => getTimesCheaper(row, action),
        total: (row) => row.totalFees,
      }
    const value = sortValue[sort.id]
    const all = summary?.rows ?? []
    // Ethereum stays first, the L2s follow the sort
    return [
      ...all.filter((row) => row.id === 'ethereum'),
      ...all
        .filter((row) => row.id !== 'ethereum')
        .sort((a, b) => {
          const [x, y] = [value(a), value(b)]
          if (x === null || y === null) {
            return Number(x === null) - Number(y === null)
          }
          return sort.desc ? y - x : x - y
        }),
    ]
  }, [summary, action, sort])
  const axis = useMemo(() => getCostAxis(rows, action), [rows, action])
  const feesDomain = getDecadeDomain(rows.map((row) => row.totalFees))

  const sortable = (id: SortId, label: string) => {
    const direction = sort.id === id && (sort.desc ? 'desc' : 'asc')
    return (
      <SortingArrows
        direction={direction}
        nextDirection={direction === 'asc' ? 'desc' : 'asc'}
        onClick={() => setSort({ id, desc: direction === 'asc' })}
      >
        {label}
      </SortingArrows>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-xl md:text-2xl">
            What one transaction costs
          </h2>
          <p className="text-secondary text-xs leading-snug">
            {GAS_FEES_METRIC_LABELS[action].title},{' '}
            {getPeriodLabel(shownInput.range)}. Log scale. L2 costs add the
            chain’s average L1 fee per transaction.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ActionPicker value={action} onChange={setAction} />
          <RadioGroup
            name="gasFeesTableRange"
            value={rangeToOption(range, GAS_FEES_RANGE_OPTIONS)}
            onValueChange={(value) =>
              setRange(
                optionToRange(value as (typeof GAS_FEES_RANGE_OPTIONS)[number]),
              )
            }
          >
            {GAS_FEES_RANGE_OPTIONS.map((option) => (
              <RadioGroupItem key={option} value={option}>
                {GAS_FEES_RANGE_LABELS[option]}
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </div>
      </div>
      <Table
        header={
          <TableHeader>
            <TableHeaderRow>
              <TableHead className="h-auto">Chain</TableHead>
              <TableHead align="right" className="h-auto">
                {sortable('cost', 'Cost')}
              </TableHead>
              <TableHead className="h-auto w-full min-w-[260px] pb-0 md:min-w-[300px]">
                <CostAxisHead axis={axis} />
              </TableHead>
              <TableHead align="right" className="h-auto">
                {sortable('cheaper', 'Cheaper')}
              </TableHead>
              <TableHead align="right" className="h-auto pl-4">
                {sortable('total', 'Total fees')}
              </TableHead>
              <TableHead
                className="h-auto"
                tooltip="Base fee: set by the protocol from demand, burned on Ethereum; on L2s, the L2’s own execution fee. Priority fee: a tip for being included sooner. L1 fee: what L2 users pay for posting their data to Ethereum."
              >
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
                  <TableCell colSpan={COLUMNS} className={ROW}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : rows.map((row) => {
                const chain = chains.find((c) => c.id === row.id)
                if (!chain) return null
                const isEthereum = row.id === 'ethereum'
                const isHighlighted = row.id === highlightedChainId
                const cost = row[action]
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
                      <ChainCell chain={chain} />
                    </TableCell>
                    <TableCell
                      align="right"
                      className={cn(ROW, 'pl-2 font-bold tabular-nums')}
                    >
                      {cost === null ? EM_DASH : formatFee(cost)}
                    </TableCell>
                    <TableCell className={ROW}>
                      <CostAxisRow
                        axis={axis}
                        row={row}
                        cost={cost}
                        isHighlighted={isHighlighted}
                        className={ROW}
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      className={cn(ROW, 'whitespace-nowrap tabular-nums')}
                    >
                      {isEthereum ? (
                        <span className="text-xs">1×</span>
                      ) : (
                        <Cheaper times={getTimesCheaper(row, action)} />
                      )}
                    </TableCell>
                    <TableCell
                      align="right"
                      className={cn(ROW, 'pl-4 tabular-nums')}
                    >
                      <span className="inline-flex items-center gap-2">
                        {usd(row.totalFees)}
                        <span className="flex h-2 w-16 overflow-hidden rounded-[2px] bg-divider/40 md:w-20">
                          {/* A chain with no fees has no bar, and the smallest still shows */}
                          {feesDomain && row.totalFees > 0 && (
                            <span
                              className="h-full rounded-[2px] bg-secondary/55"
                              style={{
                                width: `${Math.max(0.04, logShare(row.totalFees, feesDomain)) * 100}%`,
                              }}
                            />
                          )}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className={ROW}>
                      <FeeSplit row={row} chain={chain} />
                    </TableCell>
                    <TableCell className={ROW}>
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
                    </TableCell>
                  </TableRow>
                )
              })}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-2xs">
          <CostAxisKey axis={axis} />
          <span className="h-3 w-px bg-divider" />
          <FeeSplitKey keys={['base', 'priority', 'l1Data']} />
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-[2px] bg-secondary/55" />
            Total fees, log scale
          </span>
        </div>
        <DataGaps summary={summary} chains={chains} className="md:items-end" />
      </div>
    </div>
  )
}

/** How many times cheaper than Ethereum over the same days, or how many times dearer */
function Cheaper({ times }: { times: number | null }) {
  const compared = times === null ? undefined : compareWithEthereum(times)
  if (!compared) return <span className="text-secondary">{EM_DASH}</span>
  return (
    <>
      <span className="font-bold">{compared.times}</span>
      {compared.amount === 'more' && <span className="text-xs"> dearer</span>}
    </>
  )
}

/** Ethereum's cost over the chain's, over the days both have one */
function getTimesCheaper(row: GasFeesSummaryRow, action: GasFeesPeriodMetric) {
  const sameDays = row.sameDays?.[action]
  return sameDays ? sameDays.ethereum / sameDays.chain : null
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
function FeeSplit({
  row,
  chain,
}: {
  row: GasFeesSummaryRow
  chain: GasFeesChain
}) {
  const { base, priority, l1Data } = row.split
  // Ethereum is the L1, so it has no L1 fee to list
  const parts: { key: FeeSplitPartKey; value: number | null }[] = [
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
      <TooltipTrigger className="flex w-32 items-center py-3 md:w-36">
        <FeeSplitBar
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
        <span className="flex items-baseline justify-between gap-3 font-bold">
          <span className="text-sm">Fees on {chain.name}</span>
          {formatFee(row.totalFees)}
        </span>
        {parts.map((p) => {
          const note = p.value === null ? undefined : chain.feeSplitNotes[p.key]
          return (
            <span key={p.key} className="flex flex-col gap-0.5">
              <span className="flex justify-between gap-3">
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <span
                    className="size-2 rounded-xs"
                    style={{ backgroundColor: FEE_SPLIT_COLORS[p.key] }}
                  />
                  {FEE_SPLIT_LABELS[p.key]}
                </span>
                {p.value === null ? (
                  <span className="text-secondary">
                    {p.key === 'priority' ? 'n/a' : EM_DASH}
                  </span>
                ) : (
                  <span>
                    {formatFee(p.value)} {percent(sum > 0 ? p.value / sum : 0)}
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
        <span className="text-2xs text-secondary max-md:hidden">
          {chain.type}
        </span>
      </span>
    </a>
  )
}
