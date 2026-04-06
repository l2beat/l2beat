import { useState, useMemo, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { clsx } from 'clsx'
import { useAllReviews } from '../../data/hooks'
import {
  extractMetrics,
  buildRadarData,
} from '../../utils/comparison'
import { formatUsdValue } from '../../utils/format'
import { adminTypeBgClass } from '../../utils/colors'
import { Badge } from '../../components/Badge'
import { ProtocolTypeBadge } from '../../components/ProtocolTypeBadge'
import { UsdValue } from '../../components/UsdValue'
import type {
  CompiledReview,
  CompiledAdmin,
  CompiledDependency,
} from '../../types'
import { ComparisonTable } from './ComparisonTable'
import { ProtocolRadarChart } from './ProtocolRadarChart'
import { CapitalScatterPlot } from './CapitalScatterPlot'
import { AdminTypeChart } from './AdminTypeChart'
import { BenchmarkBars } from './BenchmarkBars'
import { RankingsPanel } from './RankingsPanel'
import { SharedDependencyMap } from './SharedDependencyMap'

type Tab = 'overview' | 'charts' | 'rankings'

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedSlugs = useMemo(
    () => (searchParams.get('protocols') ?? '').split(',').filter(Boolean),
    [searchParams],
  )
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const { data: allReviews, isLoading, error } = useAllReviews()

  // Compute all metrics for all reviews (used by table and rankings)
  const allMetrics = useMemo(() => {
    if (!allReviews) return []
    return allReviews.map((r, i) => extractMetrics(r, i))
  }, [allReviews])

  // Selected reviews based on URL slugs
  const selectedReviews = useMemo(() => {
    if (!allReviews) return []
    return selectedSlugs
      .map((slug) => allReviews.find((r) => r.metadata.protocolSlug === slug))
      .filter((r): r is CompiledReview => r !== undefined)
  }, [allReviews, selectedSlugs])

  // Metrics for selected reviews only
  const selectedMetrics = useMemo(
    () => selectedReviews.map((r, i) => extractMetrics(r, i)),
    [selectedReviews],
  )

  const radarData = useMemo(
    () => buildRadarData(selectedMetrics),
    [selectedMetrics],
  )

  const handleSelectForCompare = useCallback(
    (slug: string) => {
      const next = selectedSlugs.includes(slug)
        ? selectedSlugs.filter((s) => s !== slug)
        : [...selectedSlugs, slug]
      setSearchParams(next.length > 0 ? { protocols: next.join(',') } : {})
    },
    [selectedSlugs, setSearchParams],
  )

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-text-muted">Loading comparison data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-status-red">Failed to load data.</p>
        <Link
          to="/protocols"
          className="mt-4 inline-block text-accent hover:text-blue-800 font-medium"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const hasComparison = selectedReviews.length >= 2

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        to="/protocols"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors mb-6"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Protocol Comparison
      </h1>
      <p className="text-text-secondary mb-8">
        {hasComparison
          ? `Comparing ${selectedReviews.map((r) => r.metadata.protocolName).join(' vs ')}`
          : 'Select protocols from the table below to compare them side-by-side'}
      </p>

      {/* Protocol Selector Table (always visible) */}
      <div className="mb-8">
        <ComparisonTable
          metrics={allMetrics}
          onSelectForCompare={handleSelectForCompare}
          selectedSlugs={selectedSlugs}
        />
      </div>

      {/* Comparison content: only shows when 2+ protocols are selected */}
      {hasComparison && (
        <>
          {/* Protocol Headers */}
          <div
            className="grid gap-4 mb-8"
            style={{
              gridTemplateColumns: `repeat(${selectedReviews.length}, 1fr)`,
            }}
          >
            {selectedReviews.map((r, idx) => {
              const m = selectedMetrics[idx]
              if (!m) return null
              return (
                <div
                  key={r.project}
                  className="rounded-xl border-2 p-5"
                  style={{ borderColor: m.color }}
                >
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                    <Link
                      to={`/protocol/${r.metadata.protocolSlug}`}
                      className="text-lg font-bold text-text-primary hover:text-purple-600 transition-colors"
                    >
                      {r.metadata.protocolName}
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <ProtocolTypeBadge type={r.metadata.projectType} />
                    <Badge>{r.metadata.chain}</Badge>
                    {r.metadata.tokenName && (
                      <Badge variant="purple">{r.metadata.tokenName}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-3">
                    {r.metadata.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border mb-8">
            <nav className="flex gap-6">
              {(
                [
                  { key: 'overview', label: 'Overview' },
                  { key: 'charts', label: 'Charts' },
                  { key: 'rankings', label: 'Rankings' },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={clsx(
                    'pb-3 text-sm font-medium transition-colors border-b-2',
                    activeTab === key
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300',
                  )}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <OverviewTab
              selectedReviews={selectedReviews}
              selectedMetrics={selectedMetrics}
              radarData={radarData}
            />
          )}
          {activeTab === 'charts' && (
            <ChartsTab
              selectedReviews={selectedReviews}
              selectedMetrics={selectedMetrics}
              radarData={radarData}
            />
          )}
          {activeTab === 'rankings' && (
            <RankingsTab metrics={selectedMetrics} />
          )}
        </>
      )}
    </div>
  )
}

// ---- Overview Tab ----

function OverviewTab({
  selectedReviews,
  selectedMetrics,
  radarData,
}: {
  selectedReviews: CompiledReview[]
  selectedMetrics: ReturnType<typeof extractMetrics>[]
  radarData: ReturnType<typeof buildRadarData>
}) {
  return (
    <div className="space-y-8">
      {/* Radar Chart */}
      <ProtocolRadarChart data={radarData} metrics={selectedMetrics} />

      {/* Key Metrics Comparison Table */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold text-text-primary p-5 border-b border-border">
          Key Metrics
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-muted">
              <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Metric
              </th>
              {selectedReviews.map((r, idx) => {
                const m = selectedMetrics[idx]
                return (
                  <th
                    key={r.project}
                    className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: m?.color }}
                  >
                    {r.metadata.protocolName}
                  </th>
                )
              })}
              <th className="px-5 py-3 text-center text-xs font-medium text-text-muted uppercase tracking-wider">
                Diff
              </th>
            </tr>
          </thead>
          <tbody>
            <MetricRow
              label="TVL"
              values={selectedMetrics.map((m) => m.totalCapitalAtRisk)}
              format={formatUsdValue}
              colors={selectedMetrics.map((m) => m.color)}
              higherIsWorse
            />
            <MetricRow
              label="Token Value at Risk"
              values={selectedMetrics.map((m) => m.totalTokenValueAtRisk)}
              format={formatUsdValue}
              colors={selectedMetrics.map((m) => m.color)}
              higherIsWorse
            />
            <MetricRow
              label="Total Admins"
              values={selectedMetrics.map((m) => m.adminCount)}
              format={String}
              colors={selectedMetrics.map((m) => m.color)}
              higherIsWorse
            />
            <MetricRow
              label="EOA Admins"
              values={selectedMetrics.map((m) => m.eoaAdminCount)}
              format={String}
              colors={selectedMetrics.map((m) => m.color)}
              higherIsWorse
            />
            <MetricRow
              label="Multisig Admins"
              values={selectedMetrics.map((m) => m.multisigAdminCount)}
              format={String}
              colors={selectedMetrics.map((m) => m.color)}
              higherIsWorse={false}
            />
            <MetricRow
              label="Dependencies"
              values={selectedMetrics.map((m) => m.dependencyCount)}
              format={String}
              colors={selectedMetrics.map((m) => m.color)}
              higherIsWorse
            />
            <MetricRow
              label="Permissioned Functions"
              values={selectedMetrics.map((m) => m.permissionedFunctionCount)}
              format={String}
              colors={selectedMetrics.map((m) => m.color)}
              higherIsWorse
            />
            <MetricRow
              label="Contracts"
              values={selectedMetrics.map((m) => m.contractCount)}
              format={String}
              colors={selectedMetrics.map((m) => m.color)}
              higherIsWorse={false}
            />
            <MetricRow
              label="TVL per Admin"
              values={selectedMetrics.map((m) => m.capitalPerAdmin)}
              format={formatUsdValue}
              colors={selectedMetrics.map((m) => m.color)}
              higherIsWorse
            />
          </tbody>
        </table>
      </div>

      {/* Admin Comparison */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold text-text-primary p-5 border-b border-border">
          Admin Comparison
        </h3>
        <div
          className="grid gap-0 divide-x divide-border"
          style={{
            gridTemplateColumns: `repeat(${selectedReviews.length}, 1fr)`,
          }}
        >
          {selectedReviews.map((r, idx) => (
            <div key={r.project} className="p-5">
              <h4
                className="font-medium text-sm mb-3"
                style={{ color: selectedMetrics[idx]?.color }}
              >
                {r.metadata.protocolName} ({r.admins.length} admins)
              </h4>
              <div className="space-y-3">
                {r.admins.map((admin) => (
                  <AdminCompareCard key={admin.address} admin={admin} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dependencies Comparison */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold text-text-primary p-5 border-b border-border">
          Dependencies Comparison
        </h3>
        <div
          className="grid gap-0 divide-x divide-border"
          style={{
            gridTemplateColumns: `repeat(${selectedReviews.length}, 1fr)`,
          }}
        >
          {selectedReviews.map((r, idx) => (
            <div key={r.project} className="p-5">
              <h4
                className="font-medium text-sm mb-3"
                style={{ color: selectedMetrics[idx]?.color }}
              >
                {r.metadata.protocolName} ({r.dependencies.length} deps)
              </h4>
              <div className="space-y-2">
                {r.dependencies.map((dep) => (
                  <DependencyCompareCard key={dep.address} dep={dep} />
                ))}
                {r.dependencies.length === 0 && (
                  <p className="text-sm text-text-muted">No dependencies</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fund Holders Comparison */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold text-text-primary p-5 border-b border-border">
          TVL Holders Comparison
        </h3>
        <div
          className="grid gap-0 divide-x divide-border"
          style={{
            gridTemplateColumns: `repeat(${selectedReviews.length}, 1fr)`,
          }}
        >
          {selectedReviews.map((r, idx) => {
            const fundsWithValue = r.funds.filter(
              (f) =>
                (f.balances?.totalUsdValue ?? 0) > 0 ||
                (f.positions?.totalUsdValue ?? 0) > 0 ||
                (f.tokenInfo?.tokenValue ?? 0) > 0,
            )
            return (
              <div key={r.project} className="p-5">
                <h4
                  className="font-medium text-sm mb-3"
                  style={{ color: selectedMetrics[idx]?.color }}
                >
                  {r.metadata.protocolName} ({fundsWithValue.length} with TVL)
                </h4>
                <div className="space-y-2">
                  {fundsWithValue
                    .sort((a, b) => {
                      const aVal =
                        (a.balances?.totalUsdValue ?? 0) +
                        (a.positions?.totalUsdValue ?? 0)
                      const bVal =
                        (b.balances?.totalUsdValue ?? 0) +
                        (b.positions?.totalUsdValue ?? 0)
                      return bVal - aVal
                    })
                    .map((f) => (
                      <div
                        key={f.address}
                        className="rounded-lg border border-border p-3"
                      >
                        <p className="text-sm font-medium text-text-primary">
                          {f.name}
                        </p>
                        {f.balances && f.balances.totalUsdValue > 0 && (
                          <p className="text-xs text-capital">
                            Balances:{' '}
                            <UsdValue
                              value={f.balances.totalUsdValue}
                              variant="capital"
                              className="text-xs"
                            />
                          </p>
                        )}
                        {f.positions && f.positions.totalUsdValue > 0 && (
                          <p className="text-xs text-capital">
                            Positions:{' '}
                            <UsdValue
                              value={f.positions.totalUsdValue}
                              variant="capital"
                              className="text-xs"
                            />
                          </p>
                        )}
                        {f.tokenInfo && f.tokenInfo.tokenValue > 0 && (
                          <p className="text-xs text-token">
                            Token:{' '}
                            <UsdValue
                              value={f.tokenInfo.tokenValue}
                              variant="token"
                              className="text-xs"
                            />
                          </p>
                        )}
                      </div>
                    ))}
                  {fundsWithValue.length === 0 && (
                    <p className="text-sm text-text-muted">No TVL data</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ---- Charts Tab ----

function ChartsTab({
  selectedReviews,
  selectedMetrics,
  radarData,
}: {
  selectedReviews: CompiledReview[]
  selectedMetrics: ReturnType<typeof extractMetrics>[]
  radarData: ReturnType<typeof buildRadarData>
}) {
  return (
    <div className="space-y-8">
      {/* Radar */}
      <ProtocolRadarChart data={radarData} metrics={selectedMetrics} />

      {/* Scatter Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CapitalScatterPlot
          metrics={selectedMetrics}
          xKey="adminCount"
          xLabel="Admin Count"
        />
        <CapitalScatterPlot
          metrics={selectedMetrics}
          xKey="dependencyCount"
          xLabel="Dependencies"
        />
      </div>

      {/* Admin Type Chart */}
      <AdminTypeChart metrics={selectedMetrics} />

      {/* Benchmark Bars */}
      <BenchmarkBars metrics={selectedMetrics} />

      {/* Shared Dependencies */}
      <SharedDependencyMap reviews={selectedReviews} />
    </div>
  )
}

// ---- Rankings Tab ----

function RankingsTab({
  metrics,
}: {
  metrics: ReturnType<typeof extractMetrics>[]
}) {
  return (
    <div className="space-y-8">
      <RankingsPanel metrics={metrics} />
      <BenchmarkBars metrics={metrics} />
    </div>
  )
}

// ---- Shared Components ----

function MetricRow({
  label,
  values,
  format,
  colors,
  higherIsWorse,
}: {
  label: string
  values: number[]
  format: (v: number) => string
  colors: string[]
  higherIsWorse: boolean
}) {
  const maxVal = Math.max(...values)
  const minVal = Math.min(...values)
  const allSame = maxVal === minVal

  return (
    <tr className="border-b border-border last:border-0 hover:bg-bg-muted/50 transition-colors">
      <td className="px-5 py-3 font-medium text-text-primary">{label}</td>
      {values.map((val, idx) => {
        const isWorst =
          !allSame && val === (higherIsWorse ? maxVal : minVal)
        const isBest =
          !allSame && val === (higherIsWorse ? minVal : maxVal)

        return (
          <td
            key={idx}
            className={clsx(
              'px-5 py-3 text-right tabular-nums',
              isWorst
                ? 'text-status-red font-semibold'
                : isBest
                  ? 'text-status-green font-semibold'
                  : 'text-text-secondary',
            )}
          >
            {format(val)}
            {isWorst && (
              <span className="ml-1 text-xs text-status-red">worst</span>
            )}
            {isBest && (
              <span className="ml-1 text-xs text-status-green">best</span>
            )}
          </td>
        )
      })}
      <td className="px-5 py-3 text-center tabular-nums text-text-muted">
        {allSame ? (
          '='
        ) : (
          <span>
            {(((maxVal - minVal) / (minVal || 1)) * 100).toFixed(0)}%
          </span>
        )}
      </td>
    </tr>
  )
}

function AdminCompareCard({ admin }: { admin: CompiledAdmin }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${adminTypeBgClass(admin.adminType)}`}
        >
          {admin.adminType}
        </span>
        {admin.isGovernance && <Badge variant="governance">Gov</Badge>}
      </div>
      <p
        className="text-sm font-medium text-text-primary truncate"
        title={admin.name}
      >
        {admin.name}
      </p>
      <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
        <span>
          {admin.functions.length} fn
          {admin.functions.length !== 1 ? 's' : ''}
        </span>
        {admin.totalReachableCapital > 0 && (
          <span className="text-capital">
            {formatUsdValue(admin.totalReachableCapital)}
          </span>
        )}
      </div>
    </div>
  )
}

function DependencyCompareCard({ dep }: { dep: CompiledDependency }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-2 mb-1">
        <p
          className="text-sm font-medium text-text-primary truncate"
          title={dep.name}
        >
          {dep.name}
        </p>
        {dep.entity && <Badge variant="purple">{dep.entity}</Badge>}
      </div>
      <p className="text-xs text-text-secondary">
        Used by {dep.functions.length} function
        {dep.functions.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
