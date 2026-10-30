import { formatCurrency } from '@l2beat/shared-pure'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import type {
  LiquidStakingLatestValue,
  LiquidStakingSummary,
} from '~/server/features/defi/liquid-staking/getLiquidStakingSummary'
import { formatTimestamp } from '~/utils/dates'
import {
  LIQUID_STAKING_METRICS,
  TVL_TOOLTIP,
} from '../../liquid-staking/liquidStakingMetrics'
import { LIQUID_STAKING_RISKS } from '../../liquid-staking/liquidStakingRisks'

/** The project's row of the liquid staking table, with its latest yield and cost of exit. */
export function LiquidStakingProjectSummary({
  summary,
}: {
  summary: LiquidStakingSummary
}) {
  return (
    <div>
      <ul className="grid gap-4 md:grid-cols-3">
        <ProjectSummaryStat
          title="TVL"
          tooltip={TVL_TOOLTIP}
          value={
            summary.totalValueLockedUsd !== undefined ? (
              formatCurrency(summary.totalValueLockedUsd, 'usd')
            ) : (
              <NoDataBadge />
            )
          }
        />
        {LIQUID_STAKING_METRICS.map(({ key, title, tooltip, format }) => {
          const latest = summary[key]
          return (
            <ProjectSummaryStat
              key={key}
              title={title}
              tooltip={withDate(tooltip, latest)}
              value={latest ? format(latest.value) : <NoDataBadge />}
            />
          )
        })}
      </ul>
      <HorizontalSeparator className="my-4 max-md:hidden" />
      <ul className="grid gap-4 max-md:mt-4 md:grid-cols-3 lg:grid-cols-6">
        {LIQUID_STAKING_RISKS.map(({ key, title, tooltip }) => (
          <ProjectSummaryStat
            key={key}
            title={title}
            tooltip={tooltip}
            value={
              <TableValueCell value={summary.risks[key]} tooltipOnMobile />
            }
          />
        ))}
      </ul>
    </div>
  )
}

function withDate(text: string, latest: LiquidStakingLatestValue | undefined) {
  return latest
    ? `${text} Latest value from ${formatTimestamp(latest.timestamp, { mode: 'date' })}.`
    : text
}
