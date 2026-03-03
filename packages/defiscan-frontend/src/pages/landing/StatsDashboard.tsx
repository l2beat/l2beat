import { StatCard } from '../../components/StatCard'
import { formatUsdValue } from '../../utils/format'
import type { IndexData } from '../../types'

interface StatsDashboardProps {
  data: IndexData
}

export function StatsDashboard({ data }: StatsDashboardProps) {
  const { globalTotals, dependencies } = data

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Funds Reviewed"
        value={formatUsdValue(globalTotals.totalCapitalAtRisk)}
        sublabel={`across ${globalTotals.protocolsReviewed} protocols`}
      />
      <StatCard
        label="Protocols Reviewed"
        value={String(globalTotals.protocolsReviewed)}
      />
      <StatCard
        label="Dependencies Tracked"
        value={String(dependencies.length)}
        sublabel="cross-protocol external dependencies"
      />
    </div>
  )
}
