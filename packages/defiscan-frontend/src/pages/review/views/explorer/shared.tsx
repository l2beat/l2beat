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

export function deduplicateMitigations(
  mitigations: Mitigation[],
): Mitigation[] {
  const seen = new Set<string>()
  const result: Mitigation[] = []
  for (const m of mitigations) {
    // 'other' mitigations with a label collapse by label only (ignoring scope and description variants)
    const key =
      m.type === 'other' && m.label
        ? `other-label:${m.label}`
        : `${m.type}:${m.delaySeconds ?? ''}:${displayMitigationValue(m.valueRange?.min)}:${displayMitigationValue(m.valueRange?.max)}:${displayMitigationValue(m.relativeValue?.maxChangePercent)}:${m.description}:${m.scopedTo?.address ?? ''}:${m.scopedTo?.type ?? ''}`
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
// MitigationsSummary — responsive badge overflow for table cells
// ---------------------------------------------------------------------------

/** Collects mitigations from an entity's functions and renders them with overflow. */
export function MitigationsSummary({
  functions,
}: {
  functions: { mitigations?: Mitigation[] }[]
}) {
  const allMitigations: Mitigation[] = []
  for (const fn of functions) {
    if (fn.mitigations) {
      allMitigations.push(...fn.mitigations)
    }
  }

  const unique = deduplicateMitigations(allMitigations)
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

/**
 * Per-function TVS impact = direct funds + direct token value + reachable
 * contract funds/token value (capped by effectiveCapUsd where applicable).
 * Mirrors the admin-level totalReachable* aggregation but scoped to one
 * function, so the researcher can see which function actually carries the
 * impact.
 */
function functionTvsImpact(fn: CompiledAdminFunction): number {
  let total = fn.directFundsUsd + fn.directTokenValueUsd
  for (const rc of fn.reachableContracts) {
    if (!rc.fundsAtRisk) continue
    const raw = rc.fundsUsd + rc.tokenValueUsd
    total +=
      rc.effectiveCapUsd !== undefined ? Math.min(raw, rc.effectiveCapUsd) : raw
  }
  return total
}

export function AdminFunctionTable({
  functions,
}: {
  functions: CompiledAdminFunction[]
}) {
  const sorted = [...functions].sort(
    (a, b) => functionTvsImpact(b) - functionTvsImpact(a),
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
          const tvs = functionTvsImpact(fn)
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
