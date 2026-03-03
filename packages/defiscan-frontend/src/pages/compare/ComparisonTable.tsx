import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { Badge } from '../../components/Badge'
import { ProtocolTypeBadge } from '../../components/ProtocolTypeBadge'
import type { ProtocolMetrics } from '../../utils/comparison'
import { formatUsdValue } from '../../utils/format'

interface ComparisonTableProps {
  metrics: ProtocolMetrics[]
  onSelectForCompare: (slug: string) => void
  selectedSlugs: string[]
}

type SortKey =
  | 'name'
  | 'capital'
  | 'admins'
  | 'deps'
  | 'functions'
  | 'contracts'
  | 'capitalPerAdmin'
  | 'eoaAdmins'

const SORT_CONFIGS: Record<
  SortKey,
  {
    label: string
    accessor: (m: ProtocolMetrics) => number | string
    align: 'left' | 'right'
  }
> = {
  name: { label: 'Protocol', accessor: (m) => m.name, align: 'left' },
  capital: {
    label: 'Funds Locked',
    accessor: (m) => m.totalCapitalAtRisk,
    align: 'right',
  },
  admins: { label: 'Admins', accessor: (m) => m.adminCount, align: 'right' },
  eoaAdmins: {
    label: 'EOAs',
    accessor: (m) => m.eoaAdminCount,
    align: 'right',
  },
  deps: {
    label: 'Deps',
    accessor: (m) => m.dependencyCount,
    align: 'right',
  },
  functions: {
    label: 'Perm. Fns',
    accessor: (m) => m.permissionedFunctionCount,
    align: 'right',
  },
  contracts: {
    label: 'Contracts',
    accessor: (m) => m.contractCount,
    align: 'right',
  },
  capitalPerAdmin: {
    label: 'Funds/Admin',
    accessor: (m) => m.capitalPerAdmin,
    align: 'right',
  },
}

export function ComparisonTable({
  metrics,
  onSelectForCompare,
  selectedSlugs,
}: ComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('capital')
  const [sortAsc, setSortAsc] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')

  const types = ['all', ...new Set(metrics.map((m) => m.projectType))]

  const filtered =
    filterType === 'all'
      ? metrics
      : metrics.filter((m) => m.projectType === filterType)

  const sorted = [...filtered].sort((a, b) => {
    const config = SORT_CONFIGS[sortKey]
    const aVal = config.accessor(a)
    const bVal = config.accessor(b)
    const cmp =
      typeof aVal === 'string'
        ? aVal.localeCompare(bVal as string)
        : (aVal as number) - (bVal as number)
    return sortAsc ? cmp : -cmp
  })

  const maxCapital = Math.max(...metrics.map((m) => m.totalCapitalAtRisk), 1)
  const maxAdmins = Math.max(...metrics.map((m) => m.adminCount), 1)
  const maxDeps = Math.max(...metrics.map((m) => m.dependencyCount), 1)
  const maxFns = Math.max(
    ...metrics.map((m) => m.permissionedFunctionCount),
    1,
  )

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  function SortHeader({ sortKeyValue }: { sortKeyValue: SortKey }) {
    const config = SORT_CONFIGS[sortKeyValue]
    const active = sortKey === sortKeyValue
    return (
      <th
        className={clsx(
          'px-3 py-3 font-medium text-text-secondary cursor-pointer select-none hover:text-purple-600 transition-colors text-xs uppercase tracking-wider',
          config.align === 'right' ? 'text-right' : 'text-left',
        )}
        onClick={() => toggleSort(sortKeyValue)}
      >
        {config.label}
        {active && (
          <span className="ml-1">{sortAsc ? '\u25B2' : '\u25BC'}</span>
        )}
      </th>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      {/* Filter bar */}
      <div className="px-4 py-3 border-b border-border bg-bg-muted flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Filter by type:</span>
          <div className="flex gap-1">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={clsx(
                  'px-3 py-1 text-xs rounded-full font-medium transition-colors',
                  filterType === t
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-border text-text-secondary hover:border-purple-300',
                )}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>
        </div>
        {selectedSlugs.length >= 2 && (
          <Link
            to={`/compare?protocols=${selectedSlugs.join(',')}`}
            className="px-4 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Compare Selected ({selectedSlugs.length})
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-muted/50">
              <th className="px-3 py-3 w-10">
                <span className="sr-only">Select</span>
              </th>
              <SortHeader sortKeyValue="name" />
              <th className="px-3 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Type
              </th>
              <SortHeader sortKeyValue="capital" />
              <SortHeader sortKeyValue="admins" />
              <SortHeader sortKeyValue="eoaAdmins" />
              <SortHeader sortKeyValue="deps" />
              <SortHeader sortKeyValue="functions" />
              <SortHeader sortKeyValue="capitalPerAdmin" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => {
              const isSelected = selectedSlugs.includes(m.slug)
              return (
                <tr
                  key={m.slug}
                  className={clsx(
                    'border-b border-border last:border-0 transition-colors',
                    isSelected ? 'bg-purple-50' : 'hover:bg-bg-muted/50',
                  )}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectForCompare(m.slug)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: m.color }}
                      />
                      <Link
                        to={`/protocol/${m.slug}`}
                        className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        {m.name}
                      </Link>
                      <Badge>{m.chain}</Badge>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <ProtocolTypeBadge type={m.projectType} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-capital rounded-full"
                          style={{
                            width: `${(m.totalCapitalAtRisk / maxCapital) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-medium text-capital tabular-nums whitespace-nowrap">
                        {formatUsdValue(m.totalCapitalAtRisk)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-10 h-2 bg-bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-400 rounded-full"
                          style={{
                            width: `${(m.adminCount / maxAdmins) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="tabular-nums">{m.adminCount}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span
                      className={clsx(
                        'tabular-nums font-medium',
                        m.eoaAdminCount > 0
                          ? 'text-status-red'
                          : 'text-status-green',
                      )}
                    >
                      {m.eoaAdminCount}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-10 h-2 bg-bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-status-amber rounded-full"
                          style={{
                            width: `${(m.dependencyCount / maxDeps) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="tabular-nums">
                        {m.dependencyCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-10 h-2 bg-bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-status-blue rounded-full"
                          style={{
                            width: `${(m.permissionedFunctionCount / maxFns) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="tabular-nums">
                        {m.permissionedFunctionCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="tabular-nums text-text-secondary">
                      {formatUsdValue(m.capitalPerAdmin)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
