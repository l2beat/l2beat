import { useMemo } from 'react'
import type { CompiledReview } from '../../../../types'
import { formatUsdValue } from '../../../../utils/format'
import { computeRiskScore, riskLevelFromScore } from '../../../../utils/risk'
import { MetricCard } from '../../../../components/MetricCard'
import { RiskGauge } from './RiskGauge'
import { ExposureCharts } from './ExposureCharts'
import { RiskOverview } from './RiskOverview'

interface DashboardViewProps {
  review: CompiledReview
}

export function DashboardView({ review }: DashboardViewProps) {
  const riskScore = useMemo(() => computeRiskScore(review), [review])
  const riskLevel = useMemo(() => riskLevelFromScore(riskScore), [riskScore])

  const {
    totalCapitalAtRisk,
    totalTokenValueAtRisk,
    contractCount,
    adminCount,
    dependencyCount,
    permissionedFunctionCount,
  } = review.totals

  return (
    <div className="space-y-8">
      {/* Top row: 6 metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Funds Locked"
          value={formatUsdValue(totalCapitalAtRisk)}
          accent="green"
        />
        <MetricCard
          label="Token Value"
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
          value={String(adminCount)}
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

      {/* Two-column layout: left = gauge + charts, right = risk overview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column (3/5 width) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Risk Gauge card */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <RiskGauge score={riskScore} level={riskLevel} />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-text-primary">
                  Overall Risk Score
                </h3>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed max-w-md">
                  Computed from admin type centralization, dependency
                  concentration, capital exposure, and permissioned function
                  density.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <ScoreFactorPill
                    label="Admin risk"
                    value={adminRiskLabel(review)}
                    color={adminRiskPillColor(review)}
                  />
                  <ScoreFactorPill
                    label="Dependencies"
                    value={String(dependencyCount)}
                    color={dependencyCount >= 5 ? 'red' : dependencyCount >= 3 ? 'amber' : 'green'}
                  />
                  <ScoreFactorPill
                    label="Funds"
                    value={formatUsdValue(totalCapitalAtRisk)}
                    color={totalCapitalAtRisk > 100_000_000 ? 'red' : totalCapitalAtRisk > 10_000_000 ? 'amber' : 'green'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Exposure charts */}
          <ExposureCharts review={review} />
        </div>

        {/* Right column (2/5 width) */}
        <div className="lg:col-span-2">
          <RiskOverview review={review} />
        </div>
      </div>
    </div>
  )
}

// --- Helper components ---

function ScoreFactorPill({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: 'red' | 'amber' | 'green'
}) {
  const colorClasses = {
    red: 'bg-red-50 text-red-700 border-red-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    green: 'bg-green-50 text-green-700 border-green-200',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${colorClasses[color]}`}
    >
      <span className="text-text-muted font-normal">{label}:</span>
      {value}
    </span>
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

function adminRiskLabel(review: CompiledReview): string {
  const types = review.admins.map((a) => a.adminType)
  if (types.includes('EOA') || types.includes('EOAPermissioned')) return 'EOA'
  if (types.includes('Multisig')) return 'Multisig'
  if (types.includes('Timelock')) return 'Timelock'
  return 'Contract'
}

function adminRiskPillColor(review: CompiledReview): 'red' | 'amber' | 'green' {
  const types = review.admins.map((a) => a.adminType)
  if (types.includes('EOA') || types.includes('EOAPermissioned')) return 'red'
  if (types.includes('Multisig')) return 'amber'
  return 'green'
}
