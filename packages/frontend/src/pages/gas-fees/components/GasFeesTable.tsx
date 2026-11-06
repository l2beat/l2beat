import { UnixTime } from '@l2beat/shared-pure'
import { Fragment, useMemo, useState } from 'react'
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
import type { GasFeesRecent } from '~/server/features/gas-fees/getGasFeesRecent'
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
import { getTipDomain, TipLegend, TipPlot } from './GasFeesTips'
import { formatFee, formatTimes, GAS_FEES_METRIC_LABELS } from './metrics'
import {
  GasFeesRecentStrip,
  type RecentHover,
} from './recent/GasFeesRecentStrip'
import { GasFeesRecentLegend } from './recent/GasFeesRecentTooltip'
import { formatHour } from './recent/recentScale'
import type { GasFeesChain } from './types'

interface Props {
  chains: GasFeesChain[]
  summary: GasFeesSummary | undefined
  isLoading: boolean
  /** Picks the range of the tinted columns */
  rangeControl: React.ReactNode
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
  /** Follows the table's range, unlike the last 24 hours */
  ranged?: boolean
  sortValue?: (row: GasFeesSummaryRow) => number
  cell: (row: GasFeesSummaryRow, chain: GasFeesChain) => React.ReactNode
}

type Sort = { id: string; desc: boolean }

export function GasFeesTable({
  chains,
  summary,
  isLoading,
  rangeControl,
  recent,
  highlightedChainId,
  setHighlightedChainId,
}: Props) {
  const [action, setAction] = useState<GasFeesUsdMetric>('transfer')
  const [sort, setSort] = useState<Sort>({ id: 'cost', desc: false })
  const notLive = summary?.notLiveIds
    .map((id) => chains.find((c) => c.id === id)?.name)
    .filter(Boolean)
  const unsplit = summary?.rows.find((r) => r.id === 'ethereum')?.split.unsplit

  const columns: Column[] = [
    ...getCostColumns(action, setAction),
    {
      id: 'total',
      head: 'Total fees',
      align: 'right',
      ranged: true,
      sortValue: (row) => row.totalFees,
      cell: (row) => formatFee(row.totalFees),
    },
    getSplitColumn(),
    getRecentColumn(recent),
    getTipColumn(recent.data),
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
  // The ranged columns come first, so they can share a group
  const ranged = columns.filter((c) => c.ranged)
  const rest = columns.filter((c) => !c.ranged)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1">
        <h2 className="font-bold text-xl">Ethereum vs Layer 2s</h2>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <FeeSplitKey keys={['base', 'priority', 'l1Data']} />
          <GasFeesRecentLegend />
          <TipLegend />
        </div>
      </div>
      <Table
        header={
          <>
            {/* The ranged columns sit in a tinted group, like the liveness
                table's intervals; a filler column keeps it apart */}
            <colgroup>
              <col />
            </colgroup>
            <colgroup className="bg-header-secondary">
              {ranged.map((column) => (
                <col key={column.id} />
              ))}
            </colgroup>
            <colgroup className={FILLER}>
              <col />
            </colgroup>
            <colgroup>
              {rest.map((column) => (
                <col key={column.id} />
              ))}
            </colgroup>
            <TableHeader>
              <TableHeaderRow>
                <th />
                <th
                  colSpan={ranged.length}
                  className="rounded-t-lg px-6 pt-4 text-left font-medium text-primary normal-case tracking-[-0.13px]"
                >
                  <span className="flex items-center gap-2">
                    Values for
                    {rangeControl}
                  </span>
                </th>
                <th className={FILLER} />
                <th colSpan={rest.length} />
              </TableHeaderRow>
              <TableHeaderRow>
                <TableHead>Chain</TableHead>
                {columns.map((column, i) => (
                  <Fragment key={column.id}>
                    <TableHead
                      align={column.align}
                      tooltip={column.tooltip}
                      className={groupPadding(i, ranged.length)}
                    >
                      {column.sortValue ? (
                        <SortableHead
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
                    {i === ranged.length - 1 && <th className={FILLER} />}
                  </Fragment>
                ))}
              </TableHeaderRow>
            </TableHeader>
          </>
        }
      >
        <TableBody>
          {isLoading || !summary
            ? chains.map((chain) => (
                <TableRow key={chain.id} highlightId={undefined}>
                  <TableCell colSpan={columns.length + 2}>
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
                    {columns.map((column, i) => (
                      <Fragment key={column.id}>
                        <TableCell
                          align={column.align}
                          className={cn(
                            'tabular-nums',
                            groupPadding(i, ranged.length, true),
                          )}
                        >
                          {column.cell(row, chain)}
                        </TableCell>
                        {i === ranged.length - 1 && <td className={FILLER} />}
                      </Fragment>
                    ))}
                  </TableRow>
                )
              })}
          {/* Rounds off the bottom of the group */}
          <tr aria-hidden>
            <td />
            <td colSpan={ranged.length} className="h-4 rounded-b-lg" />
            <td className={FILLER} />
            <td colSpan={rest.length} />
          </tr>
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

const FILLER = 'h-full w-4 min-w-4'

/** The group's edge columns get the same inset as the liveness table's */
function groupPadding(index: number, size: number, body = false) {
  if (index === 0) return body ? 'pl-6!' : 'pl-6'
  if (index === size - 1) return body ? 'pr-6!' : 'pr-6'
  return undefined
}

function getCostColumns(
  action: GasFeesUsdMetric,
  setAction: (action: GasFeesUsdMetric) => void,
): Column[] {
  return [
    {
      id: 'cost',
      head: <ActionPicker value={action} onChange={setAction} />,
      align: 'right',
      ranged: true,
      sortValue: (row) => row[action],
      cell: (row) => (
        <span className="font-medium">{formatFee(row[action])}</span>
      ),
    },
    {
      id: 'cheaper',
      head: 'Cheaper by',
      align: 'right',
      ranged: true,
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
      <SelectTrigger className="-my-1 min-h-7 border border-divider px-2 font-medium text-xs normal-case md:text-xs">
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
  children,
}: {
  sort: Sort | undefined
  onSort: () => void
  children: React.ReactNode
}) {
  return (
    <span className="flex items-end gap-1">
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

/** A dense row of 24 hours, oldest first */
function getRecentColumn(recent: Props['recent']): Column {
  const hours = recent.data?.hours
  const span = (from: number | undefined, to: number | undefined) =>
    from === undefined || to === undefined
      ? ''
      : `${formatHour(from)}–${formatHour(to + UnixTime.HOUR)}`
  const baseline =
    "Each hour's average fee per transaction vs the chain's usual: the median of its daily averages over the past 30 days. The average follows the mix of transactions, so an hour with fewer cheap bot transactions reads above usual even when prices didn't move."
  const order = `${span(hours?.[0], hours?.[23])} UTC, oldest first.`
  return {
    id: 'recent',
    head: 'Last 24h',
    tooltip: hours ? `${baseline} ${order}` : baseline,
    cell: (row) => {
      if (!recent.data) return <Skeleton className="h-4 w-[120px]" />
      const chain = recent.data.chains.find((c) => c.id === row.id)
      if (!chain) return <span className="text-secondary">{EM_DASH}</span>
      return (
        <GasFeesRecentStrip
          chainId={row.id}
          series={chain.usd}
          hover={recent.hover}
          onHover={recent.setHover}
        />
      )
    },
  }
}

/** The base fee and the spread of tips over the last 24 hours */
function getTipColumn(data: GasFeesRecent | undefined): Column {
  const chains = data?.chains ?? []
  const domains = new Map(
    [...new Set(chains.map((c) => c.gasToken))].map((token) => [
      token,
      getTipDomain(chains, token),
    ]),
  )
  return {
    id: 'tip',
    head: 'Tip · last 24h',
    tooltip:
      "The last hour's base fee and the spread of tips per gas, on a log scale shared by chains priced in the same token. Hover a row for the values and unit.",
    cell: (row, chain) => {
      if (!data) return <Skeleton className="h-8 w-40" />
      const recent = data.chains.find((c) => c.id === row.id)
      const domain = domains.get(recent?.gasToken ?? 'ETH') ?? { lo: -7, hi: 0 }
      return <TipPlot chain={recent} domain={domain} role={chain.tipRole} />
    },
  }
}

/** The whole split as one bar, with the values on hover */
function getSplitColumn(): Column {
  return {
    id: 'split',
    head: 'Base · Priority · L1 fee',
    tooltip:
      'Base fee: set by the protocol from demand, burned on Ethereum; on L2s, the L2’s own execution fee. Priority fee: a tip for being included sooner. L1 fee: what L2 users pay for posting their data to Ethereum.',
    ranged: true,
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
