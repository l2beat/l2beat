import { useState, useMemo } from 'react'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import { UsdValue } from '../../../../components/UsdValue'
import type { CompiledReview, CompiledAdmin } from '../../../../types'
import {
  SortHeader,
  MitigationsSummary,
  ExpandedAdminFunctions,
} from './shared'

interface GovernanceTabProps {
  review: CompiledReview
  variant?: 'page' | 'modal'
}

type SortField = 'name' | 'reachableCapital' | 'tokenValue' | 'functions'
type SortDir = 'asc' | 'desc'

export function GovernanceTab({ review }: GovernanceTabProps) {
  const { admins, totals } = review
  const govAdmins = useMemo(
    () => admins.filter((a) => a.isGovernance),
    [admins],
  )
  const [sortField, setSortField] = useState<SortField>('reachableCapital')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const sorted = useMemo(() => {
    const copy = [...govAdmins]
    copy.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name)
          break
        case 'reachableCapital':
          cmp = a.totalReachableCapital - b.totalReachableCapital
          break
        case 'tokenValue':
          cmp = a.totalReachableTokenValue - b.totalReachableTokenValue
          break
        case 'functions':
          cmp = a.functions.length - b.functions.length
          break
      }
      return sortDir === 'desc' ? -cmp : cmp
    })
    return copy
  }, [govAdmins, sortField, sortDir])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  function toggleExpand(address: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(address)) {
        next.delete(address)
      } else {
        next.add(address)
      }
      return next
    })
  }

  if (govAdmins.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-6 py-5">
        <p className="text-lg font-semibold text-green-700 mb-1">
          No Governance Contracts
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          This protocol does not use on-chain governance. All admin control is
          exercised through direct key holders.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <span className="text-text-secondary">
          <span className="font-semibold text-text-primary">
            {govAdmins.length}
          </span>{' '}
          governance contract{govAdmins.length !== 1 ? 's' : ''}
        </span>
        <span className="text-text-secondary">
          TVL:{' '}
          <UsdValue
            value={totals.totalCapitalAtRisk}
            variant="capital"
            className="text-sm"
          />
        </span>
        {totals.totalTokenValueAtRisk > 0 && (
          <span className="text-text-secondary">
            Market Cap:{' '}
            <UsdValue
              value={totals.totalTokenValueAtRisk}
              variant="token"
              className="text-sm"
            />
          </span>
        )}
      </div>

      {/* Sortable table */}
      <div className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-muted">
              <SortHeader
                field="name"
                label="Governance Contract"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
              />
              <SortHeader
                field="reachableCapital"
                label="TVL"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
                className="text-right"
              />
              <SortHeader
                field="tokenValue"
                label="Market Cap"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
                className="text-right"
              />
              <th className="px-4 py-2 font-medium text-text-secondary text-left">
                Mitigations
              </th>
              <SortHeader
                field="functions"
                label="Functions"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
                className="text-right"
              />
            </tr>
          </thead>
          <tbody>
            {sorted.map((admin) => (
              <GovRow
                key={admin.address}
                admin={admin}
                isExpanded={expanded.has(admin.address)}
                onToggle={() => toggleExpand(admin.address)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function GovRow({
  admin,
  isExpanded,
  onToggle,
}: {
  admin: CompiledAdmin
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <>
      <tr
        className="border-b border-border hover:bg-bg-muted/30 cursor-pointer"
        onClick={onToggle}
      >
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-2">
            <svg
              className={`w-3.5 h-3.5 text-text-muted transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
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
            <div className="min-w-0">
              <div
                className="font-medium text-text-primary truncate max-w-[200px]"
                title={admin.name}
              >
                {admin.name}
              </div>
              <AddressDisplay address={admin.address} className="text-xs" />
            </div>
          </div>
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums">
          {admin.totalReachableCapital > 0 ? (
            <UsdValue
              value={admin.totalReachableCapital}
              variant="capital"
              className="text-sm"
            />
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums">
          {admin.totalReachableTokenValue > 0 ? (
            <UsdValue
              value={admin.totalReachableTokenValue}
              variant="token"
              className="text-sm"
            />
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </td>
        <td className="px-4 py-2.5">
          <MitigationsSummary functions={admin.functions} />
        </td>
        <td className="px-4 py-2.5 text-right font-medium text-text-primary">
          {admin.functions.length}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={5} className="px-0 py-0">
            <ExpandedAdminFunctions admin={admin} />
          </td>
        </tr>
      )}
    </>
  )
}
