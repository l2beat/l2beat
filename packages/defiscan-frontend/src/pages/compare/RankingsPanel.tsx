import { Link } from 'react-router-dom'
import type { ProtocolMetrics } from '../../utils/comparison'
import { formatUsdValue } from '../../utils/format'

interface RankingsPanelProps {
  metrics: ProtocolMetrics[]
}

interface RankingCategory {
  title: string
  description: string
  sortFn: (a: ProtocolMetrics, b: ProtocolMetrics) => number
  display: (m: ProtocolMetrics) => string
  isGood: boolean
}

const CATEGORIES: RankingCategory[] = [
  {
    title: 'Most TVL',
    description: 'Protocols with the most TVL',
    sortFn: (a, b) => b.totalCapitalAtRisk - a.totalCapitalAtRisk,
    display: (m) => formatUsdValue(m.totalCapitalAtRisk),
    isGood: false,
  },
  {
    title: 'Fewest EOA Admins',
    description: 'Protocols with least direct key holder risk',
    sortFn: (a, b) => a.eoaAdminCount - b.eoaAdminCount,
    display: (m) =>
      `${m.eoaAdminCount} EOA${m.eoaAdminCount === 1 ? '' : 's'}`,
    isGood: true,
  },
  {
    title: 'Highest TVL per Admin',
    description: 'Most TVL controlled per individual admin',
    sortFn: (a, b) => b.capitalPerAdmin - a.capitalPerAdmin,
    display: (m) => formatUsdValue(m.capitalPerAdmin),
    isGood: false,
  },
  {
    title: 'Most Dependencies',
    description: 'Protocols with the most external dependencies',
    sortFn: (a, b) => b.dependencyCount - a.dependencyCount,
    display: (m) =>
      `${m.dependencyCount} dep${m.dependencyCount === 1 ? '' : 's'}`,
    isGood: false,
  },
  {
    title: 'Most Permissioned Functions',
    description: 'Protocols with the most admin-controlled functions',
    sortFn: (a, b) =>
      b.permissionedFunctionCount - a.permissionedFunctionCount,
    display: (m) =>
      `${m.permissionedFunctionCount} fn${m.permissionedFunctionCount === 1 ? '' : 's'}`,
    isGood: false,
  },
  {
    title: 'Most Contracts',
    description: 'Largest protocol systems by contract count',
    sortFn: (a, b) => b.contractCount - a.contractCount,
    display: (m) => `${m.contractCount}`,
    isGood: false,
  },
]

export function RankingsPanel({ metrics }: RankingsPanelProps) {
  if (metrics.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary mb-1">
        Rankings
      </h3>
      <p className="text-sm text-text-secondary mb-6">
        Protocol leaderboards across key metrics
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => {
          const sorted = [...metrics].sort(cat.sortFn)
          return (
            <div
              key={cat.title}
              className="rounded-lg border border-border p-4"
            >
              <h4 className="font-medium text-text-primary text-sm">
                {cat.title}
              </h4>
              <p className="text-xs text-text-muted mb-3">
                {cat.description}
              </p>
              <ol className="space-y-2">
                {sorted.map((m, idx) => (
                  <li key={m.slug} className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        idx === 0
                          ? cat.isGood
                            ? 'bg-status-green'
                            : 'bg-status-red'
                          : 'bg-gray-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <Link
                      to={`/protocol/${m.slug}`}
                      className="text-sm text-purple-600 hover:text-purple-800 transition-colors truncate flex-1"
                    >
                      {m.name}
                    </Link>
                    <span className="text-sm font-mono text-text-secondary whitespace-nowrap">
                      {cat.display(m)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )
        })}
      </div>
    </div>
  )
}
