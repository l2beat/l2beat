import { formatNumber } from '@l2beat/shared-pure'
import maxBy from 'lodash/maxBy'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import type { ChartRangeOptionValue } from '~/components/core/chart/utils/rangeToOption'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type {
  CompleteTvlBreakdown,
  EthChange,
  TvlChanges,
} from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import { formatEthStaked, SUPPLY_SOURCE } from '../../liquidStakingMetrics'
import type { LiquidStakingChartProject } from '../LiquidStakingCharts'
import {
  formatChangeDates,
  formatChangePeriod,
  formatSigned,
  shareOf,
} from './liquidStakingTvlFormat'

export function LiquidStakingTvlBanner({
  projects,
  latest,
  changes,
  rangePreset,
}: {
  projects: LiquidStakingChartProject[]
  latest: CompleteTvlBreakdown | undefined
  /** Over the chart's period. */
  changes: TvlChanges | undefined
  rangePreset?: ChartRangeOptionValue | 'custom'
}) {
  return (
    <PrimaryCard className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 lg:col-span-2">
      {latest ? (
        <>
          <div className="min-w-0 flex-1">
            <div className="mb-1 font-medium text-label-value-12 text-secondary">
              As of {formatTimestamp(latest.timestamp, { mode: 'date' })}
            </div>
            <StakeSentence latest={latest} />
            <LiquidSentence projects={projects} latest={latest} />
          </div>
          {(changes?.stake || changes?.supply) && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 tabular-nums">
              {changes.stake && (
                <ChangeStat
                  label="Staked"
                  change={changes.stake}
                  period={formatChangePeriod(changes.stake, {
                    preset: rangePreset,
                    latestTimestamp: latest.timestamp,
                  })}
                />
              )}
              {changes.stake && changes.supply && (
                <div className="hidden h-8 w-px bg-divider sm:block" />
              )}
              {changes.supply && (
                <ChangeStat
                  label="Supply"
                  change={changes.supply}
                  period={formatChangePeriod(changes.supply, {
                    preset: rangePreset,
                    latestTimestamp: latest.timestamp,
                  })}
                />
              )}
            </div>
          )}
        </>
      ) : (
        <NoDataBadge size="regular" />
      )}
    </PrimaryCard>
  )
}

function StakeSentence({ latest }: { latest: CompleteTvlBreakdown }) {
  const { staked, supply, timestamp } = latest
  const supplyShare = shareOf(staked, supply)
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
              {formatNumber(supply)} ETH at the start of{' '}
              {formatTimestamp(timestamp, { mode: 'date' })}: {SUPPLY_SOURCE}
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
  latest,
}: {
  projects: LiquidStakingChartProject[]
  latest: CompleteTvlBreakdown
}) {
  const { liquid, staked, projects: ethByProject } = latest
  const [largestId, largestEth] =
    maxBy(Object.entries(ethByProject), ([, eth]) => eth) ?? []
  const largest = projects.find((project) => project.id === largestId)
  return (
    <p className="mt-1.5 text-pretty font-medium text-paragraph-14 text-secondary tabular-nums">
      The {Object.keys(ethByProject).length} liquid staking protocols hold{' '}
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

function ChangeStat({
  label,
  change,
  period,
}: {
  label: string
  change: EthChange
  period: string
}) {
  return (
    <div className="text-left sm:text-right" title={formatChangeDates(change)}>
      <div className="font-bold text-heading-20 text-primary leading-tight">
        <span className="whitespace-nowrap">
          {formatSigned(change.value, formatPercent)}
        </span>{' '}
        <span className="font-medium text-label-value-13 text-secondary">
          / {period}
        </span>
      </div>
      <div className="font-medium text-label-value-12 text-secondary">
        {label} ({formatSigned(change.eth, formatEthStaked)})
      </div>
    </div>
  )
}
