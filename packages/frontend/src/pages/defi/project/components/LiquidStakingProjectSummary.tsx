import { formatCurrency, UnixTime } from '@l2beat/shared-pure'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  ProjectSummaryStat,
  type ProjectSummaryStatProps,
} from '~/components/projects/ProjectSummaryStat'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import type {
  LiquidStakingLatestValue,
  LiquidStakingSummary,
} from '~/server/features/defi/liquid-staking/getLiquidStakingSummary'
import { formatRange, formatTimestamp } from '~/utils/dates'
import {
  formatLatestValue,
  LIQUID_STAKING_METRICS,
  type LiquidStakingMetric,
  TVL_TOOLTIP,
} from '../../liquid-staking/liquidStakingMetrics'
import { LIQUID_STAKING_RISKS } from '../../liquid-staking/liquidStakingRisks'

/** The project's row of the liquid staking table, with its latest yield and cost of exit. */
export function LiquidStakingProjectSummary({
  summary,
}: {
  summary: LiquidStakingSummary
}) {
  const stats: (ProjectSummaryStatProps & { key: string })[] = [
    {
      key: 'tvl',
      title: 'TVL',
      tooltip: TVL_TOOLTIP,
      value:
        summary.totalValueLockedUsd !== undefined ? (
          formatCurrency(summary.totalValueLockedUsd, 'usd')
        ) : (
          <NoDataBadge />
        ),
    },
    ...LIQUID_STAKING_METRICS.map((metric) => {
      const latest = summary[metric.key]
      return {
        key: metric.key,
        title: metric.title,
        tooltip: withDate(metric, latest),
        value: latest ? formatLatestValue(metric, latest) : <NoDataBadge />,
      }
    }),
    ...LIQUID_STAKING_RISKS.map(({ key, title, tooltip }) => ({
      key,
      title,
      tooltip,
      value: <TableValueCell value={summary.risks[key]} tooltipOnTouch />,
    })),
  ]

  return (
    <div>
      <ul className="grid gap-4 md:grid-cols-5">
        {stats.slice(0, 5).map(renderStat)}
      </ul>
      <HorizontalSeparator className="my-4 max-md:hidden" />
      <ul className="grid gap-4 max-md:mt-4 md:grid-cols-4">
        {stats.slice(5).map(renderStat)}
      </ul>
    </div>
  )
}

function renderStat({
  key,
  ...stat
}: ProjectSummaryStatProps & { key: string }) {
  return <ProjectSummaryStat key={key} {...stat} />
}

function withDate(
  metric: LiquidStakingMetric,
  latest: LiquidStakingLatestValue | undefined,
) {
  if (!latest) return metric.tooltip
  const date = metric.dailyBuckets
    ? formatRange(latest.timestamp, latest.timestamp + UnixTime.DAY)
    : formatTimestamp(latest.timestamp, { mode: 'date' })
  return `${metric.tooltip} Latest value from ${date}.`
}
