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
  formatDays,
  formatYield,
} from '../../liquid-staking/formatLiquidStaking'
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
          tooltip="Total USD value of assets locked in the protocol."
          value={
            summary.totalValueLockedUsd !== undefined ? (
              formatCurrency(summary.totalValueLockedUsd, 'usd')
            ) : (
              <NoDataBadge />
            )
          }
        />
        <ProjectSummaryStat
          title="Yield"
          tooltip={withDate(
            "The annualised change of the token's exchange rate over the previous 30 days, net of protocol fees.",
            summary.yield,
          )}
          value={
            summary.yield ? formatYield(summary.yield.value) : <NoDataBadge />
          }
        />
        <ProjectSummaryStat
          title="Cost of exit"
          tooltip={withDate(
            'Days of staking yield an exit costs, by the cheaper route: waiting for a protocol withdrawal or selling at the market discount.',
            summary.costOfExit,
          )}
          value={
            summary.costOfExit ? (
              formatDays(summary.costOfExit.value)
            ) : (
              <NoDataBadge />
            )
          }
        />
      </ul>
      <HorizontalSeparator className="my-4 max-md:hidden" />
      <ul className="grid gap-4 max-md:mt-4 md:grid-cols-3 lg:grid-cols-6">
        {LIQUID_STAKING_RISKS.map(({ key, title, tooltip }) => (
          <ProjectSummaryStat
            key={key}
            title={title}
            tooltip={tooltip}
            value={<TableValueCell value={summary.risks[key]} />}
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
