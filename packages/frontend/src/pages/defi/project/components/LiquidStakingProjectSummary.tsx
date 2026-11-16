import { formatCurrency } from '@l2beat/shared-pure'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  ProjectSummaryStat,
  type ProjectSummaryStatProps,
} from '~/components/projects/ProjectSummaryStat'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import type {
  LiquidStakingLatestValue,
  ProjectLiquidStakingSummary,
} from '~/server/features/defi/liquid-staking/getLiquidStakingSummary'
import { StakedEthShare } from '../../liquid-staking/components/StakedEthShare'
import {
  formatLatestValue,
  formatMetricDate,
  getProjectMetrics,
  type LiquidStakingMetric,
  TVL_TOOLTIP,
} from '../../liquid-staking/liquidStakingMetrics'
import { LIQUID_STAKING_RISKS } from '../../liquid-staking/liquidStakingRisks'

/** The project's row of the liquid staking table, with its latest yield and cost of exit. */
export function LiquidStakingProjectSummary({
  summary,
}: {
  summary: ProjectLiquidStakingSummary
}) {
  const stats: (ProjectSummaryStatProps & { key: string })[] = [
    {
      key: 'tvl',
      title: 'TVL',
      tooltip: TVL_TOOLTIP,
      value:
        summary.totalValueLockedUsd !== undefined ? (
          <span className="flex flex-col items-end md:items-start">
            {formatCurrency(summary.totalValueLockedUsd, 'usd')}
            {summary.stakedEthShare && (
              <StakedEthShare
                share={summary.stakedEthShare}
                className="font-medium text-label-value-13"
              />
            )}
          </span>
        ) : (
          <NoDataBadge />
        ),
    },
    ...getProjectMetrics(summary.costOfExitDescription).map((metric) => {
      const latest = summary[metric.key]
      return {
        key: metric.key,
        title: metric.title,
        tooltip: withDate(metric, latest),
        value: latest ? (
          <a href="#yield-and-exit" className="hover:underline">
            {formatLatestValue(metric, latest)}
          </a>
        ) : (
          <NoDataBadge />
        ),
      }
    }),
    ...LIQUID_STAKING_RISKS.map(({ key, title, tooltip }) => ({
      key,
      title,
      tooltip,
      // On phones the two-line value sits flush right, like the stats above.
      valueClassName:
        'max-md:[&_div]:text-right max-md:[&_div.flex]:justify-end',
      value: (
        <TableValueCell
          value={summary.risks[key]}
          secondLineClassName="font-normal md:text-label-value-13 md:leading-4"
        />
      ),
    })),
  ]

  return (
    // Figures first (TVL, yield, cost of exit), then the six risks in two
    // rows of three, so every column lines up.
    <div>
      <ul className="grid gap-4 md:grid-cols-3">
        {stats.slice(0, 3).map(renderStat)}
      </ul>
      <HorizontalSeparator className="my-4" />
      <ul className="grid gap-4 md:grid-cols-3">
        {stats.slice(3).map(renderStat)}
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
  return `${metric.tooltip} Latest value from ${formatMetricDate(metric, latest.timestamp)}.`
}
