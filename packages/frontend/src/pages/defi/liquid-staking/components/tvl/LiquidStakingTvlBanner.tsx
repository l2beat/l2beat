import { formatNumber } from '@l2beat/shared-pure'
import maxBy from 'lodash/maxBy'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type {
  EthChange,
  LiquidStakingTvlSummary,
} from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import { formatEthStaked } from '../../liquidStakingMetrics'
import type { LiquidStakingChartProject } from '../LiquidStakingCharts'
import {
  formatChangeDates,
  formatChangePeriod,
  formatSigned,
  shareOf,
} from './liquidStakingTvlFormat'

/** One sentence on the stake across the top of the card, and its yearly changes. */
export function LiquidStakingTvlBanner({
  projects,
  summary,
}: {
  projects: LiquidStakingChartProject[]
  summary: LiquidStakingTvlSummary | undefined
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-divider border-b px-4 py-4 md:px-6 md:py-5">
      {summary ? (
        <>
          <div className="min-w-0 flex-1">
            <div className="mb-1 font-medium text-label-value-12 text-secondary">
              As of{' '}
              {formatTimestamp(summary.latest.timestamp, { mode: 'date' })}
            </div>
            <StakeSentence summary={summary} />
            <LiquidSentence projects={projects} summary={summary} />
          </div>
          {(summary.stakeChange || summary.supplyChange) && (
            <div className="flex shrink-0 items-center gap-5 tabular-nums">
              {summary.stakeChange && (
                <ChangeStat label="Staked" change={summary.stakeChange} />
              )}
              {summary.stakeChange && summary.supplyChange && (
                <div className="h-8 w-px bg-divider" />
              )}
              {summary.supplyChange && (
                <ChangeStat label="Supply" change={summary.supplyChange} />
              )}
            </div>
          )}
        </>
      ) : (
        <NoDataBadge size="regular" />
      )}
    </div>
  )
}

function StakeSentence({ summary }: { summary: LiquidStakingTvlSummary }) {
  const { staked, supply, notStaked, timestamp } = summary.latest
  // A supply below the stake disagrees with it, so it gives no share.
  const supplyShare = notStaked !== null ? shareOf(staked, supply) : undefined
  return (
    <p className="text-pretty font-semibold text-heading-20 text-primary tabular-nums leading-tight tracking-[-0.02em] md:text-heading-24">
      {supplyShare !== undefined && supply !== null ? (
        <>
          <Tooltip>
            <TooltipTrigger className="inline font-bold text-brand-deep underline decoration-brand-deep/30 decoration-dotted underline-offset-4">
              {formatPercent(supplyShare)}
            </TooltipTrigger>
            <TooltipContent>
              The balance of all active validators as a share of ETH's supply,{' '}
              {formatNumber(supply)} ETH: CoinGecko's market cap over its price,
              at the start of {formatTimestamp(timestamp, { mode: 'date' })}.
            </TooltipContent>
          </Tooltip>{' '}
          of all ETH is staked:{' '}
          <strong className="whitespace-nowrap font-bold text-brand-deep">
            {formatNumber(staked)}
          </strong>{' '}
          of{' '}
          <span className="whitespace-nowrap">{formatEthStaked(supply)}</span>
        </>
      ) : (
        <>
          <strong className="whitespace-nowrap font-bold text-brand-deep">
            {formatEthStaked(staked)}
          </strong>{' '}
          is staked
        </>
      )}
    </p>
  )
}

function LiquidSentence({
  projects,
  summary,
}: {
  projects: LiquidStakingChartProject[]
  summary: LiquidStakingTvlSummary
}) {
  const { liquid, staked, projects: ethByProject } = summary.latest
  const largest = maxBy(projects, (project) => ethByProject[project.id])
  const largestEth = largest && ethByProject[largest.id]
  return (
    <p className="mt-1.5 text-pretty font-medium text-paragraph-14 text-secondary tabular-nums">
      The {projects.length} liquid staking protocols hold{' '}
      <strong className="font-semibold text-primary">
        {formatPercent(liquid / staked)}
      </strong>{' '}
      ({formatEthStaked(liquid)})
      {largest && largestEth !== undefined && (
        <>
          , led by{' '}
          <strong className="font-semibold text-primary">
            {largest.shortName ?? largest.name}
          </strong>{' '}
          at {formatPercent(largestEth / staked)} ({formatEthStaked(largestEth)}
          )
        </>
      )}
      .
    </p>
  )
}

function ChangeStat({ label, change }: { label: string; change: EthChange }) {
  return (
    <div className="text-left sm:text-right" title={formatChangeDates(change)}>
      <div className="font-bold text-heading-20 text-primary leading-tight">
        {formatSigned(change.value, formatPercent)}
      </div>
      <div className="font-medium text-label-value-12 text-secondary">
        {label} · {formatChangePeriod(change)} (
        {formatSigned(change.eth, formatEthStaked)})
      </div>
    </div>
  )
}
