import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useIndex, useAllReviews } from '../../data/hooks'
import { formatUsdValue } from '../../utils/format'
import { adminTypeColor } from '../../utils/colors'
import { Badge } from '../../components/Badge'
import { ProtocolTypeBadge } from '../../components/ProtocolTypeBadge'

import { StatCard } from '../../components/StatCard'
import type { CompiledReview } from '../../types'
import { getHumanAdmins } from '../../utils/admins'

type SortKey = 'name' | 'tvs' | 'dependencies'

function hasGovernance(review: CompiledReview): boolean {
  return review.admins.some((a) => a.isGovernance)
}

export function LandingPage() {
  const { data: indexData, isLoading: indexLoading } = useIndex()
  const { data: allReviews, isLoading: reviewsLoading } = useAllReviews()

  const [sortKey, setSortKey] = useState<SortKey>('tvs')
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
        case 'tvs': {
          const aTvs = a.totals.totalCapitalAtRisk + (a.totals.totalTokenValue ?? a.totals.totalTokenValueAtRisk)
          const bTvs = b.totals.totalCapitalAtRisk + (b.totals.totalTokenValue ?? b.totals.totalTokenValueAtRisk)
          cmp = aTvs - bTvs
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
            {formatUsdValue(indexData.globalTotals.totalCapitalAtRisk)} total TVL
          </span>
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Protocols Reviewed"
          value={String(indexData.globalTotals.protocolsReviewed)}
        />
        <StatCard
          label="Total TVL"
          value={formatUsdValue(indexData.globalTotals.totalCapitalAtRisk)}
        />
      </div>

      {/* Protocol Table */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-muted">
              <SortHeader label="Protocol" sortKey="name" current={sortKey} asc={sortAsc} onToggle={toggleSort} />
              <th className="text-left px-3 py-3 font-medium text-text-secondary text-xs uppercase tracking-wide">Type</th>
              <SortHeader label="TVS (TVL + Token)" sortKey="tvs" current={sortKey} asc={sortAsc} onToggle={toggleSort} />
              <th className="px-3 py-3 text-xs uppercase tracking-wide font-medium text-text-secondary text-left whitespace-nowrap w-[1%]">Admins</th>
              <th className="px-3 py-3 text-xs uppercase tracking-wide font-medium text-text-secondary text-center whitespace-nowrap w-[1%]">Governance</th>
              <SortHeader label="Dependencies" sortKey="dependencies" current={sortKey} asc={sortAsc} onToggle={toggleSort} align="right" shrink />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const review = reviewMap.get(p.slug)
              const govExists = review ? hasGovernance(review) : false
              const adminBreakdown = review ? computeAdminBreakdown(review) : {}

              return (
                <tr key={p.slug} className="border-b border-border last:border-0 hover:bg-bg-muted/50 transition-colors">
                  <td className="px-3 py-3">
                    <Link to={`/protocol/${p.slug}`} className="font-medium text-purple-600 hover:text-purple-800 transition-colors">
                      {p.name}
                    </Link>
                    <div className="text-xs text-text-muted mt-0.5">{p.chain}</div>
                  </td>
                  <td className="px-3 py-3"><ProtocolTypeBadge type={p.projectType} /></td>
                  <td className="px-3 py-3">
                    {(() => {
                      const tvl = p.totals.totalCapitalAtRisk
                      const token = p.totals.totalTokenValue ?? p.totals.totalTokenValueAtRisk
                      const tvs = tvl + token
                      return (
                        <span className="tabular-nums">
                          <span className="font-semibold text-capital">{formatUsdValue(tvs)}</span>
                          {tvl > 0 && token > 0 && (
                            <span className="text-text-muted text-xs ml-1">
                              ({formatUsdValue(tvl)} + {formatUsdValue(token)})
                            </span>
                          )}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap"><AdminTypeBar breakdown={adminBreakdown} /></td>
                  <td className="px-3 py-3 text-center whitespace-nowrap text-xs">
                    {govExists
                      ? <span className="text-purple-600 font-medium" title="Has governance">Yes</span>
                      : <span className="text-text-muted" title="No governance">No</span>}
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

function computeAdminBreakdown(review: CompiledReview) {
  const counts: Record<string, number> = {}
  for (const admin of getHumanAdmins(review.admins)) {
    const t = admin.isGovernance ? 'Governance' : (admin.adminType || 'Unknown')
    counts[t] = (counts[t] || 0) + 1
  }
  return counts
}

function AdminTypeBar({ breakdown }: { breakdown: Record<string, number> }) {
  const total = Object.values(breakdown).reduce((s, n) => s + n, 0)
  if (total === 0) return <span className="inline-flex items-center gap-1 text-xs text-green-600"><svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>None</span>
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

function SortHeader({ label, sortKey, current, asc, onToggle, align = 'left', shrink }: {
  label: string; sortKey: SortKey; current: SortKey; asc: boolean; onToggle: (k: SortKey) => void; align?: 'left' | 'right' | 'center'; shrink?: boolean
}) {
  const active = current === sortKey
  return (
    <th
      className={`px-3 py-3 font-medium text-text-secondary cursor-pointer select-none hover:text-purple-600 transition-colors text-xs uppercase tracking-wide whitespace-nowrap ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'} ${shrink ? 'w-[1%]' : ''}`}
      onClick={() => onToggle(sortKey)}
    >
      {label}
      {active && <span className="ml-1">{asc ? '\u25B2' : '\u25BC'}</span>}
    </th>
  )
}

