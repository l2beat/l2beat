import { useMemo } from 'react'
import { Badge } from '../../../../components/Badge'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import { UsdValue } from '../../../../components/UsdValue'
import { Expandable } from '../../../../components/Expandable'
import { GlossaryTooltip } from '../../../../components/GlossaryTooltip'
import { formatUsdValue } from '../../../../utils/format'
import {
  buildFunctionContractFundsMap,
  computeDepFundsAtRisk,
  getFunctionFunds,
} from '../../../../utils/dependencies'
import type { CompiledReview, CompiledDependency } from '../../../../types'

interface DependencyCardsProps {
  review: CompiledReview
}

export function DependencyCards({ review }: DependencyCardsProps) {
  const { dependencies } = review
  const fnContractMap = useMemo(
    () => buildFunctionContractFundsMap(review),
    [review],
  )

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
      <div className="space-y-8">
        {entityGroups.map(([entity, deps]) => (
          <div key={entity ?? '__ungrouped'}>
            {entity && (
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {entity}
                </h3>
                <span className="text-sm text-text-muted">
                  {deps.length} contract{deps.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {!entity && entityGroups.length > 1 && (
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Other Dependencies
              </h3>
            )}
            <div className="space-y-3">
              {deps.map((dep) => (
                <DependencyCard key={dep.address} dependency={dep} fnContractMap={fnContractMap} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DependencyCard({
  dependency,
  fnContractMap,
}: {
  dependency: CompiledDependency
  fnContractMap: Map<string, Map<string, number>>
}) {
  const fundsAtRisk = computeDepFundsAtRisk(dependency, fnContractMap)
  const readFns = dependency.functions.filter((f) => f.viewOnlyPath)
  const writeFns = dependency.functions.filter((f) => !f.viewOnlyPath)

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-1">
          {dependency.entity === 'Chainlink' ? (
            <GlossaryTooltip term="Oracle">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-status-blue/10 text-status-blue text-sm font-bold">
                O
              </span>
            </GlossaryTooltip>
          ) : (
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-purple-100 text-purple-600 text-sm font-bold">
              D
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {dependency.entity && (
              <Badge variant="purple">{dependency.entity}</Badge>
            )}
            <h4 className="font-semibold text-text-primary">
              {dependency.name}
            </h4>
            {dependency.viewOnlyPath ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-status-blue/10 text-status-blue">
                Read-only
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-status-amber/10 text-status-amber">
                Write access
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <AddressDisplay address={dependency.address} />
            {fundsAtRisk > 0 && (
              <UsdValue
                value={fundsAtRisk}
                variant="capital"
                className="text-sm"
              />
            )}
          </div>
          {dependency.description && (
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              {dependency.description}
            </p>
          )}

          {/* Called functions on this dependency */}
          {dependency.calledFunctions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {dependency.calledFunctions.map((fn) => (
                <span
                  key={fn}
                  className="inline-flex items-center px-2 py-0.5 rounded bg-bg-muted border border-border text-xs font-mono text-text-secondary"
                >
                  {fn}()
                </span>
              ))}
            </div>
          )}

          {/* Functions using this dependency */}
          {dependency.functions.length > 0 && (
            <div className="mt-3">
              <Expandable
                trigger={
                  <span className="text-sm font-medium text-text-secondary">
                    Used by {dependency.functions.length} function
                    {dependency.functions.length !== 1 ? 's' : ''}
                    {readFns.length > 0 && writeFns.length > 0 && (
                      <span className="text-text-muted ml-1">
                        ({writeFns.length} write, {readFns.length} read)
                      </span>
                    )}
                  </span>
                }
              >
                <div className="mt-2 space-y-1">
                  {dependency.functions.map((fn) => {
                    const fnFunds = getFunctionFunds(
                      fn.contractAddress,
                      fn.functionName,
                      fnContractMap,
                    )
                    return (
                      <div
                        key={`${fn.contractAddress}-${fn.functionName}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {fn.viewOnlyPath ? (
                            <span className="text-status-blue text-xs">R</span>
                          ) : (
                            <span className="text-status-amber text-xs">W</span>
                          )}
                          <span className="text-text-muted">
                            {fn.contractName}
                          </span>
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
                    )
                  })}
                </div>
              </Expandable>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
