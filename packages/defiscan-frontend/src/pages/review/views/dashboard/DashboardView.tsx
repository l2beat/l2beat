import { useMemo } from 'react'
import type { CompiledReview } from '../../../../types'
import { formatUsdValue } from '../../../../utils/format'
import { computeEntityDependencyCount } from '../../../../utils/dependencies'
import { getHumanAdmins } from '../../../../utils/admins'
import { MetricCard } from '../../../../components/MetricCard'
import { ExposureCharts } from './ExposureCharts'

interface DashboardViewProps {
  review: CompiledReview
}

export function DashboardView({ review }: DashboardViewProps) {
  const dependencyCount = useMemo(
    () => computeEntityDependencyCount(review.dependencies),
    [review.dependencies],
  )

  const humanAdminCount = useMemo(
    () => getHumanAdmins(review.admins).length,
    [review.admins],
  )

  const {
    totalCapitalAtRisk,
    totalTokenValueAtRisk,
    contractCount,
    permissionedFunctionCount,
  } = review.totals

  return (
    <div className="space-y-8">
      {/* Top row: 6 metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          label="TVL"
          value={formatUsdValue(totalCapitalAtRisk)}
          accent="green"
        />
        <MetricCard
          label="Protocol Token Value"
          value={formatUsdValue(totalTokenValueAtRisk)}
          accent="amber"
        />
        <MetricCard
          label="Contracts"
          value={String(contractCount)}
          accent="blue"
        />
        <MetricCard
          label="Admins"
          value={String(humanAdminCount)}
          sublabel={adminSublabel(review)}
          accent="red"
        />
        <MetricCard
          label="Dependencies"
          value={String(dependencyCount)}
          accent="purple"
        />
        <MetricCard
          label="Perm. Functions"
          value={String(permissionedFunctionCount)}
          sublabel={
            review.totals.scoredFunctionCount > 0
              ? `${review.totals.scoredFunctionCount} scored`
              : undefined
          }
          accent="default"
        />
      </div>

      {/* Exposure charts */}
      <ExposureCharts review={review} />
    </div>
  )
}

// --- Helper functions ---

function adminSublabel(review: CompiledReview): string | undefined {
  const types = review.admins.map((a) => a.adminType)
  const eoaCount = types.filter(
    (t) => t === 'EOA' || t === 'EOAPermissioned',
  ).length
  const msigCount = types.filter((t) => t === 'Multisig').length
  const parts: string[] = []
  if (eoaCount > 0) parts.push(`${eoaCount} EOA`)
  if (msigCount > 0) parts.push(`${msigCount} MSig`)
  return parts.length > 0 ? parts.join(', ') : undefined
}
