import capitalize from 'lodash/capitalize'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { categoryToLabel } from '~/pages/scaling/project/tvs-breakdown/components/tables/categoryToLabel'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export function TokenSummaryBox({ token }: { token: ProjectToken }) {
  return (
    <ChartStats className="mt-3 md:grid-cols-3 lg:grid-cols-3">
      <ChartStatsItem label="Value">
        {formatCurrency(token.value, 'usd')}
      </ChartStatsItem>
      <ChartStatsItem label="Bridging Type">
        {capitalize(token.source)}
      </ChartStatsItem>
      <ChartStatsItem label="Category">
        {categoryToLabel(token.category)}
      </ChartStatsItem>
    </ChartStats>
  )
}
