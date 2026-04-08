import type { CompiledReview, CompiledDependency } from '../../../../types'
import { formatUsdValue } from '../../../../utils/format'
import { MitigationBadge } from '../../../../components/MitigationBadge'
import { deduplicateMitigations } from '../explorer/shared'
import { SectionHeader, ShowMoreButton, impactPct } from './_shared'

interface DependenciesSectionProps {
  review: CompiledReview
  onShowMore: () => void
}

function depFunds(dep: CompiledDependency): number {
  return dep.totalFundsAtRisk + (dep.totalTokenValueAtRisk ?? 0)
}

export function DependenciesSection({ review, onShowMore }: DependenciesSectionProps) {
  const { dependencies, totals } = review
  const totalTvs = totals.totalCapitalAtRisk + (totals.totalTokenValue ?? 0)

  // Empty state
  if (dependencies.length === 0) {
    return (
      <div className="bg-bg-card border border-border rounded-lg p-5 sm:p-[33px] flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <svg className="size-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
          <span className="font-bold text-[11px] uppercase text-text-muted tracking-[1.2px]">Dependencies</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-[30px] items-start">
          <div className="sm:w-[312px] sm:shrink-0 flex flex-row sm:flex-col justify-between sm:justify-start gap-6 sm:gap-8 bg-bg-card rounded-lg p-6 sm:p-[33px]">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-[10px] uppercase text-text-muted tracking-[0.5px]">Impacted TVS</p>
              <p className="font-mono font-bold text-[30px] leading-[36px] text-text-primary">0%</p>
              <p className="text-xs text-text-muted mt-1">Proportion of TVS exposed to external dependency risk.</p>
            </div>
            <div className="sm:border-t sm:border-border sm:pt-6 flex flex-col gap-2">
              <p className="font-bold text-[10px] uppercase text-text-muted tracking-[0.5px]">Dependencies Detected</p>
              <p className="font-mono font-bold text-[30px] leading-[36px] text-text-primary">0</p>
            </div>
          </div>
          <div className="flex-1 min-w-0 bg-white border border-border rounded-lg p-5 sm:p-[33px] flex flex-col items-center justify-center gap-4 min-h-[160px] sm:min-h-[220px]">
            <svg className="size-14 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            <p className="text-sm text-text-muted">No external dependencies detected</p>
          </div>
        </div>
      </div>
    )
  }

  // Group by entity (null last)
  const grouped = new Map<string | null, CompiledDependency[]>()
  for (const dep of dependencies) {
    const key = dep.entity
    const list = grouped.get(key) ?? []
    list.push(dep)
    grouped.set(key, list)
  }
  // Use pre-computed deduplicated entity totals from the compiler when available,
  // falling back to raw sum for old compiled reviews.
  const entityGroupMap = new Map(
    (review.dependencyEntityGroups ?? []).map((g) => [
      g.entity,
      g.totalFundsAtRisk + g.totalTokenValueAtRisk,
    ]),
  )
  const getGroupFunds = (entity: string | null, deps: CompiledDependency[]) =>
    entityGroupMap.has(entity)
      ? (entityGroupMap.get(entity) ?? 0)
      : deps.reduce((s, d) => s + depFunds(d), 0)

  // Sort entity groups by deduplicated funds descending
  const entityGroups = Array.from(grouped.entries()).sort(([aEntity, aDeps], [bEntity, bDeps]) =>
    getGroupFunds(bEntity, bDeps) - getGroupFunds(aEntity, aDeps),
  )

  const namedEntities = entityGroups
    .filter(([e]) => e !== null)
    .map(([e]) => e as string)

  const totalAtRisk = review.dependencyTotals
    ? review.dependencyTotals.totalFundsAtRisk + review.dependencyTotals.totalTokenValueAtRisk
    : review.dependencyEntityGroups !== undefined
      ? review.dependencyEntityGroups.reduce(
          (s, g) => s + g.totalFundsAtRisk + g.totalTokenValueAtRisk,
          0,
        )
      : dependencies.reduce((s, d) => s + depFunds(d), 0)
  const atRiskPct = impactPct(totalAtRisk, totalTvs)
  const displayedGroups = entityGroups.slice(0, 3)
  const maxGroupFunds = Math.max(
    ...entityGroups.map(([entity, ds]) => getGroupFunds(entity, ds)),
    0,
  )

  return (
    <div className="bg-bg-card border border-border rounded-lg p-5 sm:p-[33px] flex flex-col gap-6">
      {/* Section label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="size-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
          <span className="font-bold text-[11px] uppercase text-text-muted tracking-[1.2px]">
            Dependencies
          </span>
        </div>
        <ShowMoreButton onClick={onShowMore} />
      </div>
      <div className="flex flex-col sm:flex-row gap-[30px] items-start">
      {/* Left sidebar — same bg as outer frame so it blends */}
      <div className="sm:w-[312px] sm:shrink-0 flex flex-row sm:flex-col justify-between sm:justify-start gap-6 sm:gap-8 bg-bg-card rounded-lg p-6 sm:p-[33px]">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-[10px] uppercase text-text-muted tracking-[0.5px]">
            Impacted TVS
          </p>
          <p className="font-mono font-bold text-[30px] leading-[36px] text-text-primary">
            {atRiskPct}%
          </p>
          <p className="text-xs text-text-muted mt-1">
            Proportion of TVS exposed to external dependency risk.
          </p>
        </div>

        <div className="sm:border-t sm:border-border sm:pt-6 flex flex-col gap-2">
          <p className="font-bold text-[10px] uppercase text-text-muted tracking-[0.5px]">
            Dependencies Detected
          </p>
          <p className="font-mono font-bold text-[30px] leading-[36px] text-text-primary">
            {totals.dependencyCount}
          </p>
          {namedEntities.length > 0 && (
            <p className="text-xs text-text-muted">
              from {namedEntities.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Right: grouped dependency list card — contains header + rows */}
      <div className="flex-1 min-w-0 bg-white border border-border rounded-lg p-5 sm:p-[33px] flex flex-col gap-6">
        <SectionHeader
          icon={
            <svg className="size-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          }
          label="Top Dependencies"
        />
        {/* One row per entity group */}
        <div className="flex flex-col gap-6">
          {displayedGroups.map(([entity, deps]) => {
            const groupFunds = getGroupFunds(entity, deps)
            const groupLabel =
              entity ?? (namedEntities.length > 0 ? 'Other' : 'Unknown')
            const barWidth = maxGroupFunds > 0 ? (groupFunds / maxGroupFunds) * 100 : 0
            const mitigations = deduplicateMitigations(
              deps.flatMap((d) => d.functions?.flatMap((f) => f.mitigations ?? []) ?? []),
            )

            return (
              <div key={entity ?? '__ungrouped'} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-text-primary">{groupLabel}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-text-muted bg-border/60">
                      {deps.length} contract{deps.length !== 1 ? 's' : ''}
                    </span>
                    {mitigations.map((m, i) => (
                      <MitigationBadge key={i} mitigation={m} />
                    ))}
                  </div>
                  <span className="font-mono font-bold text-sm text-text-primary shrink-0 ml-2">
                    {groupFunds > 0 ? `${formatUsdValue(groupFunds)} Impact` : '—'}
                  </span>
                </div>
                <div className="h-[10px] bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${Math.max(barWidth, barWidth > 0 ? 1 : 0)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      </div>
    </div>
  )
}
