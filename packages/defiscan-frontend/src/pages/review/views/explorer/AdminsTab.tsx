import { useState, useMemo } from 'react'
import { Badge } from '../../../../components/Badge'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import { UsdValue } from '../../../../components/UsdValue'
import { formatUsdValue } from '../../../../utils/format'
import { getHumanAdmins } from '../../../../utils/admins'
import {
  displayMitigationValue,
  type CompiledReview,
  type CompiledAdmin,
  type Mitigation,
} from '../../../../types'

interface AdminsTabProps {
  review: CompiledReview
}

type SortField =
  | 'name'
  | 'type'
  | 'reachableCapital'
  | 'tokenValue'
  | 'functions'
type SortDir = 'asc' | 'desc'

export function AdminsTab({ review }: AdminsTabProps) {
  const { admins, totals } = review
  const humanAdmins = useMemo(
    () => getHumanAdmins(admins).filter((a) => !a.isGovernance),
    [admins],
  )
  const [sortField, setSortField] = useState<SortField>('reachableCapital')
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
          <Badge variant="admin-type" adminType={admin.adminType}>
            {admin.adminType}
          </Badge>
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
        <td className="px-4 py-2.5 text-right font-medium text-text-primary">
          {admin.functions.length}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="px-0 py-0">
            <ExpandedFunctions admin={admin} />
          </td>
        </tr>
      )}
    </>
  )
}

function ExpandedFunctions({ admin }: { admin: CompiledAdmin }) {
  return (
    <div className="bg-bg-muted/50 border-t border-border">
      {admin.description && (
        <p className="px-6 py-3 text-sm text-text-secondary border-b border-border/50 leading-relaxed">
          {admin.description}
        </p>
      )}
      <div className="px-6 py-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-text-muted">
              <th className="text-left pb-1 font-medium">Contract</th>
              <th className="text-left pb-1 font-medium">Function</th>
              <th className="text-left pb-1 font-medium">Mitigations</th>
              <th className="text-right pb-1 font-medium">Direct $</th>
              <th className="text-right pb-1 font-medium">
                Reachable Contracts
              </th>
            </tr>
          </thead>
          <tbody>
            {admin.functions.map((fn) => (
              <tr
                key={`${fn.contractAddress}-${fn.functionName}`}
                className="border-t border-border/30"
              >
                <td className="py-1.5 text-text-secondary">
                  {fn.contractName}
                </td>
                <td className="py-1.5">
                  <span className="font-mono text-text-primary">
                    {fn.functionName}()
                  </span>
                </td>
                <td className="py-1.5">
                  {fn.mitigations && fn.mitigations.length > 0 ? (
                    <div className="flex flex-wrap gap-0.5">
                      {fn.mitigations.map((m, i) => (
                        <MitigationBadge key={i} mitigation={m} />
                      ))}
                    </div>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {fn.directFundsUsd > 0 ? (
                    <span className="text-capital font-medium">
                      {formatUsdValue(fn.directFundsUsd)}
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-1.5 text-right">
                  {fn.reachableContracts.length > 0 ? (
                    <span className="text-text-primary">
                      {fn.reachableContracts.length}
                      {fn.reachableContracts.some((rc) => rc.fundsAtRisk) && (
                        <span className="ml-1 text-capital">
                          (
                          {formatUsdValue(
                            fn.reachableContracts
                              .filter((rc) => rc.fundsAtRisk)
                              .reduce((s, rc) => s + rc.fundsUsd, 0),
                          )}
                          )
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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

function formatDelayLabel(seconds: number): string {
  if (seconds >= 86400) {
    const days = seconds / 86400
    const d = days === Math.floor(days) ? `${days}` : `${days.toFixed(1)}`
    return `${d}-day Delay`
  }
  if (seconds >= 3600) {
    const hours = seconds / 3600
    const h = hours === Math.floor(hours) ? `${hours}` : `${hours.toFixed(1)}`
    return `${h}-hour Delay`
  }
  if (seconds >= 60) {
    const minutes = seconds / 60
    const m = minutes === Math.floor(minutes) ? `${minutes}` : `${minutes.toFixed(1)}`
    return `${m}-min Delay`
  }
  return `${seconds}s Delay`
}

function MitigationBadge({ mitigation: m }: { mitigation: Mitigation }) {
  const colorClass =
    m.type === 'delay'
      ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
      : m.type === 'valueRange'
        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
        : m.type === 'relativeValue'
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-gray-50 text-gray-600 border-gray-200'

  let label: string
  let tooltip: string
  if (m.type === 'delay') {
    label =
      m.delaySeconds !== undefined
        ? formatDelayLabel(m.delaySeconds)
        : 'Delay'
    tooltip = m.description
  } else if (m.type === 'valueRange') {
    const parts: string[] = []
    if (m.valueRange?.min !== undefined)
      parts.push(displayMitigationValue(m.valueRange.min))
    if (m.valueRange?.max !== undefined)
      parts.push(displayMitigationValue(m.valueRange.max))
    const unit = m.valueRange?.unit ? ` ${m.valueRange.unit}` : ''
    label = `Range: ${parts.join(' to ')}${unit}`
    tooltip = m.description || label
  } else if (m.type === 'relativeValue') {
    label = 'Relative'
    tooltip = `Max change: ${m.relativeValue?.maxChangePercent !== undefined ? displayMitigationValue(m.relativeValue.maxChangePercent) : '?'}%`
    if (m.description) tooltip += ` — ${m.description}`
  } else {
    label =
      m.description.length > 20
        ? m.description.slice(0, 20) + '…'
        : m.description
    tooltip = m.description
  }

  return (
    <span
      className={`inline-block rounded-full border px-1.5 py-0 text-[10px] font-medium leading-4 ${colorClass}`}
      title={tooltip}
    >
      {label}
    </span>
  )
}
