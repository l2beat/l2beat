import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useIndex, useAllReviews } from '../../data/hooks'
import { formatUsdValue } from '../../utils/format'
import { Badge } from '../../components/Badge'
import { ProtocolTypeBadge } from '../../components/ProtocolTypeBadge'
import { UsdValue } from '../../components/UsdValue'
import { StatCard } from '../../components/StatCard'
import type { CompiledReview } from '../../types'
import { getHumanAdmins } from '../../utils/admins'

type SortKey = 'name' | 'capital' | 'tokenValue' | 'admins' | 'dependencies'

function computeHumanAdminCount(review: CompiledReview): number {
  return getHumanAdmins(review.admins).length
}

function hasGovernance(review: CompiledReview): boolean {
  return review.admins.some((a) => a.isGovernance)
}

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
          cmp = (a.totals.totalTokenValue ?? a.totals.totalTokenValueAtRisk) - (b.totals.totalTokenValue ?? b.totals.totalTokenValueAtRisk)
          break
        case 'admins': {
          const aReview = reviewMap.get(a.slug)
          const bReview = reviewMap.get(b.slug)
          cmp = (aReview ? computeHumanAdminCount(aReview) : 0) - (bReview ? computeHumanAdminCount(bReview) : 0)
          break
        }
        case 'dependencies':
          cmp = a.totals.dependencyCount - b.totals.dependencyCount
          break
      }
      return sortAsc ? cmp : -cmp
    })
  }, [protocols, sortKey, sortAsc, reviewMap])

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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
          label="Total Token Value"
          value={formatUsdValue(indexData.globalTotals.totalTokenValue)}
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
              <SortHeader label="Token Value" sortKey="tokenValue" current={sortKey} asc={sortAsc} onToggle={toggleSort} align="right" />
              <SortHeader label="Admins" sortKey="admins" current={sortKey} asc={sortAsc} onToggle={toggleSort} align="right" />
              <th className="px-3 py-3 text-xs uppercase tracking-wide font-medium text-text-secondary text-center">Gov</th>
              <SortHeader label="Deps" sortKey="dependencies" current={sortKey} asc={sortAsc} onToggle={toggleSort} align="right" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const review = reviewMap.get(p.slug)
              const humanAdminCount = review ? computeHumanAdminCount(review) : 0
              const govExists = review ? hasGovernance(review) : false

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
                  <td className="px-3 py-3 text-right">
                    {(p.totals.totalTokenValue ?? p.totals.totalTokenValueAtRisk) > 0 ? <UsdValue value={p.totals.totalTokenValue ?? p.totals.totalTokenValueAtRisk} variant="token" /> : <span className="text-text-muted">-</span>}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums font-medium">{humanAdminCount}</td>
                  <td className="px-3 py-3 text-center">
                    {govExists
                      ? <span title="Has governance">Yes</span>
                      : <span title="No governance">No</span>}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">{p.totals.dependencyCount}</td>
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

