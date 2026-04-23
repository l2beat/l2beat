import { useState, useMemo } from 'react'
import { Badge } from '../../../../components/Badge'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import { UsdValue } from '../../../../components/UsdValue'
import { formatUsdValue } from '../../../../utils/format'
import { getHumanAdmins } from '../../../../utils/admins'
import type { CompiledReview, CompiledAdmin } from '../../../../types'
import {
  SortHeader,
  MitigationsSummary,
  ExpandedAdminFunctions,
} from './shared'

interface AdminsTabProps {
  review: CompiledReview
  variant?: 'page' | 'modal'
}

type SortField = 'name' | 'type' | 'tvs' | 'functions'
type SortDir = 'asc' | 'desc'

export function AdminsTab({ review }: AdminsTabProps) {
  const { admins, totals } = review
  const humanAdmins = useMemo(() => getHumanAdmins(admins), [admins])
  const [sortField, setSortField] = useState<SortField>('tvs')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const sorted = useMemo(() => {
    const copy = [...humanAdmins]
    copy.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name)
          break
        case 'type':
          cmp = a.adminType.localeCompare(b.adminType)
          break
        case 'tvs':
          cmp =
            a.totalReachableCapital +
            a.totalReachableTokenValue -
            (b.totalReachableCapital + b.totalReachableTokenValue)
          break
        case 'functions':
          cmp = a.functions.length - b.functions.length
          break
      }
      return sortDir === 'desc' ? -cmp : cmp
    })
    return copy
  }, [humanAdmins, sortField, sortDir])

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

  if (humanAdmins.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-6 py-5">
        <p className="text-lg font-semibold text-green-700 mb-1">No Admins</p>
        <p className="text-sm text-text-secondary leading-relaxed">
          The protocol's {formatUsdValue(totals.totalCapitalAtRisk)} in locked
          funds are not subject to any admin control. All contracts are either
          immutable or controlled by internal protocol logic.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <AdminsSummaryLabel admins={humanAdmins} />
        <span className="text-text-secondary">
          TVS:{' '}
          <UsdValue
            value={totals.totalCapitalAtRisk + totals.totalTokenValueAtRisk}
            variant="capital"
            className="text-sm"
          />
        </span>
      </div>

      {/* Sortable table */}
      <div className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-muted">
              <SortHeader
                field="name"
                label="Admin"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
              />
              <SortHeader
                field="type"
                label="Type"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
              />
              <SortHeader
                field="tvs"
                label="TVS"
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
              <AdminRow
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

function AdminRow({
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
        <td className="px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="admin-type" adminType={admin.adminType}>
              {admin.adminType}
            </Badge>
            {admin.isGovernance && (
              <Badge variant="governance">Governance</Badge>
            )}
          </div>
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums">
          {admin.totalReachableCapital + admin.totalReachableTokenValue > 0 ? (
            <UsdValue
              value={
                admin.totalReachableCapital + admin.totalReachableTokenValue
              }
              variant="capital"
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

function AdminsSummaryLabel({ admins }: { admins: CompiledAdmin[] }) {
  if (admins.length === 0) {
    return <span className="text-text-muted">No admins</span>
  }

  return (
    <span className="text-text-secondary">
      <span className="font-semibold text-text-primary">{admins.length}</span>{' '}
      admin{admins.length !== 1 ? 's' : ''}
    </span>
  )
}
