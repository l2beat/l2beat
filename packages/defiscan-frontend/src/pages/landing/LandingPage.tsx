import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useIndex, useAllReviews } from '../../data/hooks'
import { formatUsdValue } from '../../utils/format'
import { adminTypeColor } from '../../utils/colors'
import { Badge } from '../../components/Badge'
import { ProtocolTypeBadge } from '../../components/ProtocolTypeBadge'
import { UsdValue } from '../../components/UsdValue'
import { StatCard } from '../../components/StatCard'
import type { CompiledReview, ProtocolSummary } from '../../types'

type SortKey = 'name' | 'capital' | 'tokenValue' | 'admins' | 'dependencies' | 'contracts' | 'functions' | 'capitalPerAdmin'

export function LandingPage() {
  const { data: indexData, isLoading: indexLoading } = useIndex()
  const { data: allReviews, isLoading: reviewsLoading } = useAllReviews()

  const [sortKey, setSortKey] = useState<SortKey>('capital')
  const [sortAsc, setSortAsc] = useState(false)

  const isLoading = indexLoading || reviewsLoading
  const protocols = indexData?.protocols ?? []

  const reviewMap = useMemo(() => {
    const map = new Map<string, CompiledReview>()
    if (allReviews) {
      for (const r of allReviews) {
        map.set(r.metadata.protocolSlug, r)
      }
    }
    return map
  }, [allReviews])

  const sorted = useMemo(() => {
    return [...protocols].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'name':
          cmp = a.name.localeCompare(b.name)
          break
        case 'capital':
          cmp = a.totals.totalCapitalAtRisk - b.totals.totalCapitalAtRisk
          break
        case 'tokenValue':
          cmp = a.totals.totalTokenValueAtRisk - b.totals.totalTokenValueAtRisk
          break
        case 'admins':
          cmp = a.totals.adminCount - b.totals.adminCount
          break
        case 'dependencies':
          cmp = a.totals.dependencyCount - b.totals.dependencyCount
          break
        case 'contracts':
          cmp = a.totals.contractCount - b.totals.contractCount
          break
        case 'functions':
          cmp = a.totals.permissionedFunctionCount - b.totals.permissionedFunctionCount
          break
        case 'capitalPerAdmin': {
          const aRatio = a.totals.adminCount > 0 ? a.totals.totalCapitalAtRisk / a.totals.adminCount : 0
          const bRatio = b.totals.adminCount > 0 ? b.totals.totalCapitalAtRisk / b.totals.adminCount : 0
          cmp = aRatio - bRatio
          break
        }
      }
      return sortAsc ? cmp : -cmp
    })
  }, [protocols, sortKey, sortAsc])

  const maxCapital = useMemo(
    () => Math.max(...protocols.map((p) => p.totals.totalCapitalAtRisk), 1),
    [protocols],
  )

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(false) }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-text-muted">Loading protocols...</p>
      </div>
    )
  }

  if (!indexData) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-status-red">Failed to load data.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">DeFiScan Reviews</h1>
        <p className="mt-2 text-text-secondary">
          Independent security reviews of DeFi protocols.{' '}
          <span className="text-text-muted">
            {indexData.globalTotals.protocolsReviewed} protocols |{' '}
            {formatUsdValue(indexData.globalTotals.totalCapitalAtRisk)} total funds locked
          </span>
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Protocols Reviewed"
          value={String(indexData.globalTotals.protocolsReviewed)}
        />
        <StatCard
          label="Total Funds Locked"
          value={formatUsdValue(indexData.globalTotals.totalCapitalAtRisk)}
        />
        <StatCard
          label="Token Value at Risk"
          value={formatUsdValue(indexData.globalTotals.totalTokenValueAtRisk)}
        />
        <StatCard
          label="Shared Dependencies"
          value={String(indexData.dependencies.length)}
        />
      </div>

      {/* Protocol Table */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-muted">
              <SortHeader label="Protocol" sortKey="name" current={sortKey} asc={sortAsc} onToggle={toggleSort} />
              <th className="text-left px-3 py-3 font-medium text-text-secondary text-xs uppercase tracking-wide">Type</th>
              <SortHeader label="Funds Locked" sortKey="capital" current={sortKey} asc={sortAsc} onToggle={toggleSort} align="right" />
              <th className="px-3 py-3 text-xs uppercase tracking-wide font-medium text-text-secondary text-left w-32">Relative</th>
              <SortHeader label="Token Value" sortKey="tokenValue" current={sortKey} asc={sortAsc} onToggle={toggleSort} align="right" />
              <SortHeader label="Admins" sortKey="admins" current={sortKey} asc={sortAsc} onToggle={toggleSort} align="right" />
              <SortHeader label="$/Admin" sortKey="capitalPerAdmin" current={sortKey} asc={sortAsc} onToggle={toggleSort} align="right" />
              <SortHeader label="Deps" sortKey="dependencies" current={sortKey} asc={sortAsc} onToggle={toggleSort} align="right" />
              <SortHeader label="Contracts" sortKey="contracts" current={sortKey} asc={sortAsc} onToggle={toggleSort} align="right" />
              <SortHeader label="Perm Fns" sortKey="functions" current={sortKey} asc={sortAsc} onToggle={toggleSort} align="right" />
              <th className="px-3 py-3 text-xs uppercase tracking-wide font-medium text-text-secondary text-left">Admin Types</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const review = reviewMap.get(p.slug)
              const adminBreakdown = review ? computeAdminBreakdown(review) : {}
              const capitalPct = maxCapital > 0 ? (p.totals.totalCapitalAtRisk / maxCapital) * 100 : 0
              const capitalPerAdmin = p.totals.adminCount > 0 ? p.totals.totalCapitalAtRisk / p.totals.adminCount : 0

              return (
                <tr key={p.slug} className="border-b border-border last:border-0 hover:bg-bg-muted/50 transition-colors">
                  <td className="px-3 py-3">
                    <Link to={`/protocol/${p.slug}`} className="font-medium text-purple-600 hover:text-purple-800 transition-colors">
                      {p.name}
                    </Link>
                    <div className="text-xs text-text-muted mt-0.5">{p.chain}</div>
                  </td>
                  <td className="px-3 py-3"><ProtocolTypeBadge type={p.projectType} /></td>
                  <td className="px-3 py-3 text-right"><UsdValue value={p.totals.totalCapitalAtRisk} variant="capital" /></td>
                  <td className="px-3 py-3">
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-capital h-2.5 rounded-full transition-all" style={{ width: `${capitalPct}%` }} />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    {p.totals.totalTokenValueAtRisk > 0 ? <UsdValue value={p.totals.totalTokenValueAtRisk} variant="token" /> : <span className="text-text-muted">-</span>}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums font-medium">{p.totals.adminCount}</td>
                  <td className="px-3 py-3 text-right"><span className="tabular-nums text-text-secondary">{formatUsdValue(capitalPerAdmin)}</span></td>
                  <td className="px-3 py-3 text-right tabular-nums">{p.totals.dependencyCount}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{p.totals.contractCount}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{p.totals.permissionedFunctionCount}</td>
                  <td className="px-3 py-3"><AdminTypeBar breakdown={adminBreakdown} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SortHeader({ label, sortKey, current, asc, onToggle, align = 'left' }: {
  label: string; sortKey: SortKey; current: SortKey; asc: boolean; onToggle: (k: SortKey) => void; align?: 'left' | 'right'
}) {
  const active = current === sortKey
  return (
    <th
      className={`px-3 py-3 font-medium text-text-secondary cursor-pointer select-none hover:text-purple-600 transition-colors text-xs uppercase tracking-wide ${align === 'right' ? 'text-right' : 'text-left'}`}
      onClick={() => onToggle(sortKey)}
    >
      {label}
      {active && <span className="ml-1">{asc ? '\u25B2' : '\u25BC'}</span>}
    </th>
  )
}

function AdminTypeBar({ breakdown }: { breakdown: Record<string, number> }) {
  const total = Object.values(breakdown).reduce((s, n) => s + n, 0)
  if (total === 0) return <span className="text-text-muted text-xs">-</span>
  return (
    <div className="flex items-center gap-1">
      {Object.entries(breakdown).map(([type, count]) => (
        <span key={type} className="inline-flex items-center gap-0.5 text-xs" title={`${count} ${type}`}>
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: adminTypeColor(type) }} />
          <span className="text-text-secondary">{count}</span>
        </span>
      ))}
    </div>
  )
}

function computeAdminBreakdown(review: CompiledReview) {
  const counts: Record<string, number> = {}
  for (const admin of review.admins) {
    const t = admin.adminType || 'Unknown'
    counts[t] = (counts[t] || 0) + 1
  }
  return counts
}
