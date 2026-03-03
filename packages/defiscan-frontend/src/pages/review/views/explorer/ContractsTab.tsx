import { useState, useMemo } from 'react'
import { Badge } from '../../../../components/Badge'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import type {
  CompiledReview,
  CompiledContract,
  CompiledFunction,
} from '../../../../types'

interface ContractsTabProps {
  review: CompiledReview
}

type SortField = 'name' | 'functions' | 'external' | 'governance' | 'proxy'
type SortDir = 'asc' | 'desc'
type Filter = 'all' | 'permissioned' | 'external' | 'governance'

export function ContractsTab({ review }: ContractsTabProps) {
  const { contracts, functions, admins } = review
  const [sortField, setSortField] = useState<SortField>('functions')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  // Build function count per contract
  const fnCountByContract = useMemo(() => {
    const map = new Map<string, number>()
    for (const fn of functions) {
      map.set(fn.contractAddress, (map.get(fn.contractAddress) ?? 0) + 1)
    }
    return map
  }, [functions])

  // Build admin lookup
  const adminsByFunction = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const admin of admins) {
      for (const fn of admin.functions) {
        const key = `${fn.contractAddress}:${fn.functionName}`
        const list = map.get(key) ?? []
        list.push(admin.name)
        map.set(key, list)
      }
    }
    return map
  }, [admins])

  // Filter and sort
  const filtered = useMemo(() => {
    let list = [...contracts]

    // Apply filter
    switch (filter) {
      case 'permissioned':
        list = list.filter((c) => fnCountByContract.has(c.address))
        break
      case 'external':
        list = list.filter((c) => c.isExternal)
        break
      case 'governance':
        list = list.filter((c) => c.isGovernance)
        break
    }

    // Apply search
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          (c.entity ?? '').toLowerCase().includes(q),
      )
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name)
          break
        case 'functions':
          cmp =
            (fnCountByContract.get(a.address) ?? 0) -
            (fnCountByContract.get(b.address) ?? 0)
          break
        case 'external':
          cmp = Number(a.isExternal) - Number(b.isExternal)
          break
        case 'governance':
          cmp = Number(a.isGovernance) - Number(b.isGovernance)
          break
        case 'proxy':
          cmp = (a.proxyType ?? '').localeCompare(b.proxyType ?? '')
          break
      }
      return sortDir === 'desc' ? -cmp : cmp
    })

    return list
  }, [contracts, filter, search, sortField, sortDir, fnCountByContract])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  // Contract type breakdown
  const externalCount = contracts.filter((c) => c.isExternal).length
  const governanceCount = contracts.filter((c) => c.isGovernance).length
  const permissionedCount = new Set(
    functions.map((f) => f.contractAddress),
  ).size

  const filters: { label: string; value: Filter; count: number }[] = [
    { label: 'All', value: 'all', count: contracts.length },
    {
      label: 'Permissioned',
      value: 'permissioned',
      count: permissionedCount,
    },
    { label: 'External', value: 'external', count: externalCount },
    { label: 'Governance', value: 'governance', count: governanceCount },
  ]

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-bg-muted text-text-secondary hover:bg-purple-50'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search contracts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 text-sm border border-border rounded-md bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-purple-500 w-48"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-muted">
              <SortHeader
                field="name"
                label="Contract"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
              />
              <th className="px-4 py-2 font-medium text-text-secondary text-left">
                Address
              </th>
              <SortHeader
                field="proxy"
                label="Proxy"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
              />
              <th className="px-4 py-2 font-medium text-text-secondary text-left">
                Entity
              </th>
              <th className="px-4 py-2 font-medium text-text-secondary text-center">
                Flags
              </th>
              <SortHeader
                field="functions"
                label="Perm. Fn"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
                className="text-right"
              />
            </tr>
          </thead>
          <tbody>
            {filtered.map((contract) => (
              <ContractRow
                key={contract.address}
                contract={contract}
                fnCount={fnCountByContract.get(contract.address) ?? 0}
                functions={functions.filter(
                  (f) => f.contractAddress === contract.address,
                )}
                adminsByFunction={adminsByFunction}
              />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-text-muted">
            No contracts match the current filter.
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-text-muted">
        Showing {filtered.length} of {contracts.length} contracts
      </p>
    </div>
  )
}

function ContractRow({
  contract,
  fnCount,
  functions,
  adminsByFunction,
}: {
  contract: CompiledContract
  fnCount: number
  functions: CompiledFunction[]
  adminsByFunction: Map<string, string[]>
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <tr
        className={`border-b border-border hover:bg-bg-muted/30 ${fnCount > 0 ? 'cursor-pointer' : ''}`}
        onClick={() => fnCount > 0 && setExpanded(!expanded)}
      >
        <td className="px-4 py-2">
          <div className="flex items-center gap-2">
            {fnCount > 0 && (
              <svg
                className={`w-3 h-3 text-text-muted transition-transform shrink-0 ${expanded ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            <span
              className={`font-medium ${fnCount > 0 ? 'text-text-primary' : 'text-text-secondary'}`}
            >
              {contract.name}
            </span>
          </div>
        </td>
        <td className="px-4 py-2">
          <AddressDisplay address={contract.address} className="text-xs" />
        </td>
        <td className="px-4 py-2">
          {contract.proxyType ? (
            <Badge>{contract.proxyType}</Badge>
          ) : (
            <span className="text-text-muted text-xs">-</span>
          )}
        </td>
        <td className="px-4 py-2">
          {contract.entity ? (
            <Badge variant="purple">{contract.entity}</Badge>
          ) : (
            <span className="text-text-muted text-xs">-</span>
          )}
        </td>
        <td className="px-4 py-2 text-center">
          <div className="flex items-center justify-center gap-1">
            {contract.isExternal && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-status-amber/10 text-status-amber">
                Ext
              </span>
            )}
            {contract.isGovernance && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-status-green/10 text-status-green">
                Gov
              </span>
            )}
          </div>
        </td>
        <td className="px-4 py-2 text-right font-medium text-text-primary">
          {fnCount > 0 ? (
            fnCount
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </td>
      </tr>
      {expanded && functions.length > 0 && (
        <tr>
          <td
            colSpan={6}
            className="px-0 py-0 bg-bg-muted/50 border-b border-border"
          >
            <div className="px-8 py-3">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-text-muted">
                    <th className="text-left pb-1 font-medium">Function</th>
                    <th className="text-left pb-1 font-medium">Impact</th>
                    <th className="text-left pb-1 font-medium">Admins</th>
                  </tr>
                </thead>
                <tbody>
                  {functions.map((fn) => {
                    const key = `${fn.contractAddress}:${fn.functionName}`
                    const fnAdmins = adminsByFunction.get(key) ?? []
                    return (
                      <tr
                        key={fn.functionName}
                        className="border-t border-border/30"
                      >
                        <td className="py-1 font-mono text-text-primary">
                          {fn.functionName}()
                        </td>
                        <td className="py-1">
                          <span className="px-1.5 py-0.5 rounded bg-status-red/10 text-status-red text-xs">
                            {fn.impact}
                          </span>
                        </td>
                        <td className="py-1 text-text-secondary">
                          {fnAdmins.length > 0
                            ? fnAdmins.join(', ')
                            : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function SortHeader({
  field,
  label,
  current,
  dir,
  onClick,
  className,
}: {
  field: SortField
  label: string
  current: SortField
  dir: SortDir
  onClick: (f: SortField) => void
  className?: string
}) {
  const isActive = current === field
  return (
    <th
      className={`px-4 py-2 font-medium text-text-secondary cursor-pointer select-none hover:text-text-primary transition-colors text-left ${className ?? ''}`}
      onClick={() => onClick(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive && (
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
            {dir === 'desc' ? (
              <path d="M6 8L2 4h8z" />
            ) : (
              <path d="M6 4l4 4H2z" />
            )}
          </svg>
        )}
      </span>
    </th>
  )
}
