import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from 'react'
import { clsx } from 'clsx'
import { MitigationBadge } from '../../../../components/MitigationBadge'
import { formatUsdValue } from '../../../../utils/format'
import {
  displayMitigationValue,
  type CompiledAdmin,
  type CompiledAdminFunction,
  type CompiledReachableContract,
  type Mitigation,
} from '../../../../types'

// ---------------------------------------------------------------------------
// SortHeader
// ---------------------------------------------------------------------------

export function SortHeader<T extends string>({
  field,
  label,
  current,
  dir,
  onClick,
  className,
}: {
  field: T
  label: string
  current: T
  dir: 'asc' | 'desc'
  onClick: (f: T) => void
  className?: string
}) {
  const isActive = current === field
  return (
    <th
      className={clsx(
        'px-4 py-2 font-medium text-text-secondary cursor-pointer select-none hover:text-text-primary transition-colors text-left',
        className,
      )}
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

// ---------------------------------------------------------------------------
// deduplicateMitigations
// ---------------------------------------------------------------------------

function mitigationDedupKey(m: Mitigation): string {
  // Mirror MitigationBadge's visible identity: two mitigations that render as
  // the same badge collapse to one. Descriptions / scope only show up in the
  // tooltip, so they don't differentiate badges and shouldn't differentiate
  // dedup keys either.
  if (m.label) return `label:${m.label}`
  switch (m.type) {
    case 'delay':
      return `delay:${m.delaySeconds ?? ''}`
    case 'valueRange':
      return `valueRange:${displayMitigationValue(m.valueRange?.min)}:${displayMitigationValue(m.valueRange?.max)}:${m.valueRange?.unit ?? ''}`
    case 'relativeValue':
      return `relativeValue:${displayMitigationValue(m.relativeValue?.maxChangePercent)}`
    case 'other':
      return `other:${m.description}`
  }
}

export function deduplicateMitigations(
  mitigations: Mitigation[],
): Mitigation[] {
  const seen = new Set<string>()
  const result: Mitigation[] = []
  for (const m of mitigations) {
    const key = mitigationDedupKey(m)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(m)
    }
  }
  // Stable sort: mitigations carrying an impact cap surface first so the
  // overflow slice in report/explorer lists keeps the most informative badges.
  return result.sort(
    (a, b) =>
      (a.impactCapUsd !== undefined ? 0 : 1) -
      (b.impactCapUsd !== undefined ? 0 : 1),
  )
}

// ---------------------------------------------------------------------------
// aggregateMitigationsByImpact
// ---------------------------------------------------------------------------

type FunctionLike = {
  mitigations?: Mitigation[]
  directFundsUsd: number
  directTokenValueUsd: number
  reachableContracts: CompiledReachableContract[]
}

function computeFunctionTvsImpact(fn: FunctionLike): number {
  let total = fn.directFundsUsd + fn.directTokenValueUsd
  for (const rc of fn.reachableContracts) {
    if (!rc.fundsAtRisk) continue
    const raw = rc.fundsUsd + rc.tokenValueUsd
    total +=
      rc.effectiveCapUsd !== undefined ? Math.min(raw, rc.effectiveCapUsd) : raw
  }
  return total
}

/**
 * Entity-level mitigation aggregation: drops mitigations whose only source
 * functions have $0 TVS impact, dedupes, and sorts by descending max TVS
 * impact across source functions. Used in places that show mitigation badges
 * at the admin/dependency level (above any per-function expansion).
 */
export function aggregateMitigationsByImpact(
  functions: FunctionLike[],
): Mitigation[] {
  const map = new Map<string, { mitigation: Mitigation; maxImpact: number }>()
  for (const fn of functions) {
    if (!fn.mitigations || fn.mitigations.length === 0) continue
    const impact = computeFunctionTvsImpact(fn)
    if (impact <= 0) continue
    for (const m of fn.mitigations) {
      const key = mitigationDedupKey(m)
      const existing = map.get(key)
      if (!existing) {
        map.set(key, { mitigation: m, maxImpact: impact })
      } else if (impact > existing.maxImpact) {
        existing.maxImpact = impact
      }
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.maxImpact - a.maxImpact)
    .map((e) => e.mitigation)
}

// ---------------------------------------------------------------------------
// MitigationsSummary — responsive badge overflow for table cells
// ---------------------------------------------------------------------------

/** Collects mitigations from an entity's functions and renders them with overflow.
 *  Mitigations from $0-TVS-impact functions are dropped, and the survivors are
 *  ordered by descending TVS impact of their source function. */
export function MitigationsSummary({
  functions,
}: {
  functions: FunctionLike[]
}) {
  const unique = aggregateMitigationsByImpact(functions)
  const measureRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(unique.length)

  const measure = useCallback(() => {
    const measureDiv = measureRef.current
    if (!measureDiv || unique.length === 0) return
    const td = measureDiv.closest('td')
    if (!td) return
    const available = td.clientWidth - 32
    const reservedForLabel = 28
    const children = Array.from(
      measureDiv.querySelectorAll<HTMLElement>('[data-measure]'),
    )
    let used = 0
    let count = 0
    for (const child of children) {
      used += child.offsetWidth + (count > 0 ? 2 : 0)
      if (used <= available - reservedForLabel) {
        count++
      } else {
        break
      }
    }
    if (count === unique.length) {
      setVisibleCount(unique.length)
    } else {
      setVisibleCount(Math.max(count, 1))
    }
  }, [unique])

  useLayoutEffect(measure, [measure])

  useEffect(() => {
    const measureDiv = measureRef.current
    if (!measureDiv) return
    const td = measureDiv.closest('td')
    if (!td) return
    const observer = new ResizeObserver(measure)
    observer.observe(td)
    return () => observer.disconnect()
  }, [measure])

  if (unique.length === 0) {
    return <span className="text-text-muted">-</span>
  }

  const remaining = unique.length - visibleCount

  return (
    <div className="relative">
      {/* Hidden measurement layer */}
      <div
        ref={measureRef}
        aria-hidden
        className="flex flex-nowrap gap-0.5 items-center invisible absolute top-0 left-0 pointer-events-none"
      >
        {unique.map((m, i) => (
          <span key={i} data-measure className="shrink-0">
            <MitigationBadge mitigation={m} />
          </span>
        ))}
      </div>
      {/* Visible badges */}
      <div className="flex flex-nowrap gap-0.5 items-center">
        {unique.slice(0, visibleCount).map((m, i) => (
          <span key={i} className="shrink-0">
            <MitigationBadge mitigation={m} />
          </span>
        ))}
        {remaining > 0 && (
          <span
            className="shrink-0 text-text-muted text-[10px] leading-4 ml-0.5"
            title={`${unique.length} unique mitigations total`}
          >
            +{remaining}
          </span>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ExpandedAdminFunctions — shared between AdminsTab and GovernanceTab
// ---------------------------------------------------------------------------

export function ExpandedAdminFunctions({ admin }: { admin: CompiledAdmin }) {
  return (
    <div className="bg-bg-muted/50 border-t border-border">
      {admin.description && (
        <p className="px-6 py-3 text-sm text-text-secondary border-b border-border/50 leading-relaxed">
          {admin.description}
        </p>
      )}
      <div className="px-6 py-3">
        <AdminFunctionTable functions={admin.functions} />
      </div>
    </div>
  )
}

export function AdminFunctionTable({
  functions,
}: {
  functions: CompiledAdminFunction[]
}) {
  const sorted = [...functions].sort(
    (a, b) => computeFunctionTvsImpact(b) - computeFunctionTvsImpact(a),
  )
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-text-muted">
          <th className="text-left pb-1 font-medium">Contract</th>
          <th className="text-left pb-1 font-medium">Function</th>
          <th className="text-left pb-1 font-medium">Mitigations</th>
          <th className="text-right pb-1 font-medium">TVS Impact</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((fn) => {
          const tvs = computeFunctionTvsImpact(fn)
          return (
            <tr
              key={`${fn.contractAddress}-${fn.functionName}`}
              className="border-t border-border/30"
            >
              <td className="py-1.5 text-text-secondary">{fn.contractName}</td>
              <td className="py-1.5">
                <span className="font-mono text-text-primary">
                  {fn.functionName}()
                </span>
                {fn.isUpgrade && (
                  <span className="ml-1 rounded px-1 text-[10px] font-medium bg-red-500/20 text-red-400">
                    upgrade
                  </span>
                )}
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
                {tvs > 0 ? (
                  <span className="text-capital font-medium">
                    {formatUsdValue(tvs)}
                  </span>
                ) : (
                  <span className="text-text-muted">-</span>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
