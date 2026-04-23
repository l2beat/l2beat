import { useState } from 'react'
import { Badge } from '../../../../components/Badge'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import { GlossaryTooltip } from '../../../../components/GlossaryTooltip'
import { formatUsdValue } from '../../../../utils/format'
import { getDepFunctionFunds } from '../../../../utils/dependencies'
import { MitigationBadge } from '../../../../components/MitigationBadge'
import type {
  CompiledReview,
  CompiledDependency,
  Mitigation,
} from '../../../../types'
import { deduplicateMitigations } from '../explorer/shared'

interface DependencyCardsProps {
  review: CompiledReview
  forceExpanded?: boolean
}

const DEP_BAR_COLORS = [
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#A78BFA',
  '#C4B5FD',
  '#10B981',
]

export function DependencyCards({ review, forceExpanded }: DependencyCardsProps) {
  const { dependencies } = review
  const [expandedDeps, setExpandedDeps] = useState<Set<string>>(new Set())

  if (dependencies.length === 0) {
    return (
      <div className="rounded-xl border border-status-green/30 bg-status-green/5 p-6">
        <p className="text-status-green font-semibold">
          No external dependencies detected.
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          This protocol does not rely on any external contracts for its core
          operations. This minimizes the risk of failures cascading from third
          parties.
        </p>
      </div>
    )
  }

  // Group by entity
  const grouped = new Map<string | null, CompiledDependency[]>()
  for (const dep of dependencies) {
    const key = dep.entity
    const list = grouped.get(key) ?? []
    list.push(dep)
    grouped.set(key, list)
  }

  const entityGroups = Array.from(grouped.entries()).sort(([a], [b]) => {
    if (a === null) return 1
    if (b === null) return -1
    return a.localeCompare(b)
  })

  const entities = entityGroups
    .filter(([entity]) => entity !== null)
    .map(([entity]) => entity as string)

  function toggleDep(key: string) {
    setExpandedDeps((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <div>
      <p className="text-lg text-text-secondary leading-relaxed max-w-3xl mb-8">
        {review.metadata.protocolName} depends on{' '}
        <span className="font-semibold text-text-primary">
          {dependencies.length} external contract
          {dependencies.length !== 1 ? 's' : ''}
        </span>
        {entities.length > 0 && (
          <>
            {' '}from{' '}
            <span className="font-semibold text-text-primary">
              {entities.join(', ')}
            </span>
          </>
        )}
        . If any of these dependencies fail or behave unexpectedly, it could
        affect the protocol's operation or the safety of user funds.
      </p>

      {/* "What does this mean for you?" callout */}
      <div className="rounded-xl border border-status-blue/30 bg-status-blue/5 p-5 mb-8">
        <p className="text-sm font-semibold text-status-blue mb-1">
          What does this mean for you?
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          External dependencies are contracts maintained by other teams or
          protocols. If{' '}
          {entities.length > 0 ? (
            entities.map((e, i) => (
              <span key={e}>
                {i > 0 && (i === entities.length - 1 ? ' or ' : ', ')}
                <span className="font-medium text-text-primary">{e}</span>
              </span>
            ))
          ) : (
            <span className="font-medium text-text-primary">
              any dependency
            </span>
          )}{' '}
          experiences downtime, provides incorrect data, or is exploited, it
          could impact this protocol. The more dependencies, the wider the
          attack surface.
        </p>
      </div>

      {/* Dependencies grouped by entity */}
      <div className="space-y-6">
        {entityGroups.map(([entity, deps]) => {
          // Sort deps by funds at risk descending within each group
          const depsWithFunds = deps.map((dep) => ({
            dep,
            fundsAtRisk: dep.totalFundsAtRisk + (dep.totalTokenValueAtRisk ?? 0),
          }))
          depsWithFunds.sort((a, b) => b.fundsAtRisk - a.fundsAtRisk)
          const groupTotal = depsWithFunds.reduce(
            (sum, d) => sum + d.fundsAtRisk,
            0,
          )

          const groupTitle =
            entity ??
            (entityGroups.length > 1 ? 'Other Dependencies' : undefined)

          return (
            <DepDistributionChart
              key={entity ?? '__ungrouped'}
              title={groupTitle}
              deps={depsWithFunds}
              groupTotal={groupTotal}
              expandedSet={expandedDeps}
              onToggle={toggleDep}
              forceExpanded={forceExpanded}
            />
          )
        })}
      </div>
    </div>
  )
}

function DepDistributionChart({
  title,
  deps,
  groupTotal,
  expandedSet,
  onToggle,
  forceExpanded,
}: {
  title: string | undefined
  deps: { dep: CompiledDependency; fundsAtRisk: number }[]
  groupTotal: number
  expandedSet: Set<string>
  onToggle: (key: string) => void
  forceExpanded?: boolean
}) {
  const maxFunds = Math.max(...deps.map((d) => d.fundsAtRisk), 0)

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      {title && (
        <h3 className="text-base font-semibold text-text-primary mb-4">
          {title}
        </h3>
      )}
      <div className="space-y-3">
        {deps.map(({ dep, fundsAtRisk }, index) => {
          const percentage =
            maxFunds > 0 ? (fundsAtRisk / maxFunds) * 100 : 0
          const expandKey = `dep-${dep.address}`
          const isExpanded = forceExpanded || expandedSet.has(expandKey)

          return (
            <div key={expandKey}>
              <button
                type="button"
                onClick={() => onToggle(expandKey)}
                className="w-full text-left cursor-pointer group"
              >
                <div className="flex items-center justify-between text-sm mb-1 gap-2">
                  <span className="text-text-primary font-medium truncate flex items-center gap-1.5">
                    <span className="text-text-muted text-xs" data-print-hide>
                      {isExpanded ? '\u25BC' : '\u25B6'}
                    </span>
                    {dep.entity && (
                      <Badge variant="purple">{dep.entity}</Badge>
                    )}
                    {dep.viewOnlyPath ? (
                      <GlossaryTooltip term="Read-only Dependency">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-status-blue/10 text-status-blue">
                          R
                        </span>
                      </GlossaryTooltip>
                    ) : (
                      <GlossaryTooltip term="Write Dependency">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-status-amber/10 text-status-amber">
                          W
                        </span>
                      </GlossaryTooltip>
                    )}
                    {dep.name}
                    {(() => {
                      const all: Mitigation[] = []
                      for (const fn of dep.functions) {
                        if (fn.mitigations) all.push(...fn.mitigations)
                      }
                      const unique = deduplicateMitigations(all)
                      const MAX_BADGES = 4
                      const visible = unique.slice(0, MAX_BADGES)
                      const remaining = unique.length - visible.length
                      return (
                        <>
                          {visible.map((m, i) => (
                            <MitigationBadge key={i} mitigation={m} />
                          ))}
                          {remaining > 0 && (
                            <span
                              className="shrink-0 text-text-muted text-[10px] leading-4 ml-0.5"
                              title={`${unique.length} unique mitigations total`}
                            >
                              +{remaining}
                            </span>
                          )}
                        </>
                      )
                    })()}
                  </span>
                  {fundsAtRisk > 0 && (
                    <span className="font-semibold shrink-0 text-capital">
                      {formatUsdValue(fundsAtRisk)}
                    </span>
                  )}
                </div>
                {groupTotal > 0 && (
                  <div className="h-3 rounded-full bg-bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(percentage, 1)}%`,
                        backgroundColor:
                          DEP_BAR_COLORS[index % DEP_BAR_COLORS.length],
                      }}
                    />
                  </div>
                )}
              </button>

              {isExpanded && <DepExpandedContent dep={dep} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DepExpandedContent({ dep }: { dep: CompiledDependency }) {
  const readFns = dep.functions.filter((f) => f.viewOnlyPath)
  const writeFns = dep.functions.filter((f) => !f.viewOnlyPath)

  return (
    <div className="mt-2 ml-6 rounded-lg border border-border/60 bg-bg-muted/30 p-5 space-y-4">
      <div>
        <AddressDisplay address={dep.address} />
      </div>

      {dep.description && (
        <div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {dep.description}
          </p>
        </div>
      )}

      {/* Called functions on this dependency */}
      {dep.calledFunctions?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
            Called functions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {dep.calledFunctions.map((fn) => (
              <span
                key={fn}
                className="inline-flex items-center px-2 py-0.5 rounded bg-white border border-border text-xs font-mono text-text-secondary"
              >
                {fn}()
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Functions using this dependency */}
      {dep.functions.length > 0 && (
        <div className="pt-2 border-t border-border/40">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
            Used by {dep.functions.length} function
            {dep.functions.length !== 1 ? 's' : ''}
            {readFns.length > 0 && writeFns.length > 0 && (
              <span className="text-text-muted ml-1">
                ({writeFns.length} write, {readFns.length} read)
              </span>
            )}
          </p>
          <div className="space-y-1">
            {dep.functions.map((fn) => {
              const fnFunds = getDepFunctionFunds(fn)
              return (
                <div
                  key={`${fn.contractAddress}-${fn.functionName}`}
                  className="text-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {fn.viewOnlyPath ? (
                        <span className="text-status-blue text-xs">R</span>
                      ) : (
                        <span className="text-status-amber text-xs">W</span>
                      )}
                      <span className="text-text-muted">{fn.contractName}</span>
                      <span className="text-text-primary font-medium font-mono">
                        .{fn.functionName}()
                      </span>
                    </div>
                    {fnFunds > 0 && (
                      <span className="text-capital text-xs font-medium tabular-nums">
                        {formatUsdValue(fnFunds)}
                      </span>
                    )}
                  </div>
                  {fn.mitigations && fn.mitigations.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 ml-5">
                      {fn.mitigations.map((m, i) => (
                        <MitigationBadge key={i} mitigation={m} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
