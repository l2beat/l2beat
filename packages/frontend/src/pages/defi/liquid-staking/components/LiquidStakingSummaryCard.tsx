import { formatNumber } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useMemo } from 'react'
import { previousChartDataClassName } from '~/components/core/chart/ChartPreviousData'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import type { LiquidStakingChartProject } from './LiquidStakingCharts'
import {
  type EthChange,
  formatChangePeriod,
  getLiquidStakingSummary,
  getStakeChange,
  getSupplyChange,
} from './liquidStakingSummary'

interface Props {
  projects: LiquidStakingChartProject[]
  range: ChartRange
}

/**
 * A sentence and the numbers behind it, beside the value locked chart. It
 * reads the chart's queries, plus a year of them for the changes (the same
 * query when the range is 1Y) and ETH's supply history, kept on the server.
 */
export function LiquidStakingSummaryCard({ projects, range }: Props) {
  const trpc = useTRPC()
  const { data, isPlaceholderData } = useChartQuery(
    trpc.defi.liquidStakingTvlChart,
    { range },
  )
  const { data: ethSupply } = useQuery(trpc.defi.ethSupply.queryOptions())
  // The changes always cover the past year, whatever the range.
  const yearRange = useMemo(() => optionToRange('1y'), [])
  const { data: yearData } = useChartQuery(trpc.defi.liquidStakingTvlChart, {
    range: yearRange,
  })
  const { data: supplyHistory } = useQuery(
    trpc.defi.ethSupplyHistory.queryOptions(),
  )

  const summary = useMemo(
    () =>
      data &&
      getLiquidStakingSummary(
        data,
        projects.map((project) => project.id),
        ethSupply?.value,
      ),
    [data, projects, ethSupply],
  )
  const stakeChange = useMemo(
    () => yearData && getStakeChange(yearData),
    [yearData],
  )
  const supplyChange = useMemo(
    () => supplyHistory && getSupplyChange(supplyHistory),
    [supplyHistory],
  )
  const largest =
    summary?.largest &&
    projects.find((project) => project.id === summary.largest?.id)
  const largestName = largest && (largest.shortName ?? largest.name)

  return (
    // In dark mode, outlined on the page's background, so it reads as the
    // summary of the charts rather than another chart. In light mode that
    // background is grey, so it takes the cards' own.
    <PrimaryCard className="flex flex-col dark:bg-transparent md:dark:border md:dark:border-divider">
      {summary === undefined ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-3/5" />
        </div>
      ) : (
        <div
          className={cn(
            'flex flex-1 flex-col',
            isPlaceholderData && previousChartDataClassName,
          )}
        >
          {/* The headline, then the detail behind it, a size down. */}
          <p className="text-pretty font-semibold text-heading-24 text-primary leading-tight">
            {summary.supplyShare !== undefined &&
            summary.ethSupply !== undefined ? (
              <>
                <Strong>{formatPercent(summary.supplyShare)}</Strong> of all ETH
                is staked: <Strong>{formatNumber(summary.ethStaked)}</Strong> of{' '}
                <Strong>{formatNumber(summary.ethSupply)} ETH</Strong>.
              </>
            ) : (
              <>
                <Strong>{formatNumber(summary.ethStaked)} ETH</Strong> is
                staked.
              </>
            )}
          </p>
          {summary.liquid && (
            <p className="mt-2 text-pretty font-medium text-paragraph-16 text-secondary leading-normal">
              The {projects.length} liquid staking protocols on this page hold{' '}
              <Strong>{formatPercent(summary.liquid.share)}</Strong> of it{' '}
              <InBrackets eth={summary.liquid.eth} />
              {largestName && summary.largest && (
                <>
                  , and <Strong>{largestName}</Strong> alone{' '}
                  <Strong>{formatPercent(summary.largest.share)}</Strong>{' '}
                  <InBrackets eth={summary.largest.eth} />
                </>
              )}
              .
            </p>
          )}
          {/* At the bottom, so the numbers line up with the chart's legend
            beside them. */}
          <dl className="mt-auto flex flex-col divide-y divide-divider pt-5">
            <Stat
              label="ETH staked"
              value={formatEth(summary.ethStaked)}
              detail={
                summary.supplyShare !== undefined
                  ? `${formatPercent(summary.supplyShare)} of supply`
                  : undefined
              }
            />
            {largest && summary.largest && (
              <Stat
                label={
                  <span className="inline-flex items-center gap-1.5">
                    Largest:
                    <img
                      src={largest.icon}
                      alt=""
                      width={16}
                      height={16}
                      className="size-4 rounded-full"
                    />
                    {largestName}
                  </span>
                }
                value={formatPercent(summary.largest.share)}
                detail={formatEth(summary.largest.eth)}
              />
            )}
            {stakeChange && (
              <ChangeStat label="ETH staked change" change={stakeChange} />
            )}
            {supplyChange && (
              <ChangeStat label="ETH supply change" change={supplyChange} />
            )}
          </dl>
        </div>
      )}
    </PrimaryCard>
  )
}

/** E.g. "32.50M ETH". */
function formatEth(value: number): string {
  return `${formatNumber(value)} ETH`
}

/**
 * Signed, in plain text: a growing stake or supply is neither good nor bad,
 * so it gets no green or red.
 */
function formatSigned(value: number, format: (abs: number) => string) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${format(Math.abs(value))}`
}

/** E.g. "+2.08% / 1y  +707.43K ETH", with the exact days on hover. */
function ChangeStat({ label, change }: { label: string; change: EthChange }) {
  const days = `${formatTimestamp(change.since, { mode: 'date' })} to ${formatTimestamp(change.until, { mode: 'date' })}`
  return (
    <Stat
      label={<span title={days}>{label}</span>}
      value={
        <>
          {formatSigned(change.value, formatPercent)}{' '}
          <span className="font-medium text-secondary">
            / {formatChangePeriod(change)}
          </span>
        </>
      }
      detail={formatSigned(change.eth, formatEth)}
    />
  )
}

/** E.g. " (18.73M ETH)", kept on one line. */
function InBrackets({ eth }: { eth: number }) {
  return <span className="whitespace-nowrap">({formatEth(eth)})</span>
}

function Strong({ children }: { children: ReactNode }) {
  return (
    // brand-deep: the brand pink at a shade that reads as text.
    <strong className="whitespace-nowrap font-semibold text-brand-deep tabular-nums">
      {children}
    </strong>
  )
}

/** A row: the value, with its other unit after it in grey. */
function Stat({
  label,
  value,
  detail,
}: {
  label: ReactNode
  value: ReactNode
  detail?: string
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="font-medium text-label-value-14 text-secondary">
        {label}
      </dt>
      <dd className="flex shrink-0 items-baseline gap-2 whitespace-nowrap tabular-nums">
        <span className="font-semibold text-label-value-15 text-primary">
          {value}
        </span>
        {detail && (
          <span className="font-medium text-label-value-13 text-secondary">
            {detail}
          </span>
        )}
      </dd>
    </div>
  )
}
