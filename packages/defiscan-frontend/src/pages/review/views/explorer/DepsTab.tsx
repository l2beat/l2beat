import { useState, useMemo } from 'react'
import { Badge } from '../../../../components/Badge'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import { UsdValue } from '../../../../components/UsdValue'
import { formatUsdValue } from '../../../../utils/format'
import { getDepFunctionFunds } from '../../../../utils/dependencies'
import { MitigationBadge } from '../../../../components/MitigationBadge'
import type { CompiledReview, CompiledDependency } from '../../../../types'
import { ShareableDiagram } from '../../../../components/ShareableDiagram'
import { DependencyRiskDiagram } from './svg/DependencyRiskDiagram'
import { SortHeader, MitigationsSummary } from './shared'

interface DepsTabProps {
  review: CompiledReview
}

type SortField = 'name' | 'entity' | 'fundsAtRisk' | 'functions'
type SortDir = 'asc' | 'desc'

export function DepsTab({ review }: DepsTabProps) {
  const { dependencies } = review
  const [sortField, setSortField] = useState<SortField>('fundsAtRisk')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Use pre-computed funds from compiled review (balances + token value)
  const depsWithFunds = useMemo(
    () =>
      dependencies.map((dep) => ({
        dep,
        fundsAtRisk: dep.totalFundsAtRisk + (dep.totalTokenValueAtRisk ?? 0),
      })),
    [dependencies],
  )

  const sorted = useMemo(() => {
    const copy = [...depsWithFunds]
    copy.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'name':
          cmp = a.dep.name.localeCompare(b.dep.name)
          break
        case 'entity':
          cmp = (a.dep.entity ?? '').localeCompare(b.dep.entity ?? '')
          break
        case 'fundsAtRisk':
          cmp = a.fundsAtRisk - b.fundsAtRisk
          break
        case 'functions':
          cmp = a.dep.functions.length - b.dep.functions.length
          break
      }
      return sortDir === 'desc' ? -cmp : cmp
    })
    return copy
  }, [depsWithFunds, sortField, sortDir])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  if (dependencies.length === 0) {
    return <p className="text-text-muted">No external dependencies found.</p>
  }

  // Entity summary
  const entities = new Map<string, number>()
  for (const dep of dependencies) {
    if (dep.entity) {
      entities.set(dep.entity, (entities.get(dep.entity) ?? 0) + 1)
    }
  }

  // Total funds at risk across all dependencies
  const totalFundsAtRisk = depsWithFunds.reduce(
    (sum, d) => sum + d.fundsAtRisk,
    0,
  )

  // Count read-only vs write deps
  const readOnlyCount = dependencies.filter((d) => d.viewOnlyPath).length
  const writeCount = dependencies.length - readOnlyCount

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-6 mb-4 text-sm flex-wrap">
        <span className="text-text-secondary">
          <span className="font-semibold text-text-primary">
            {dependencies.length}
          </span>{' '}
          dependenc{dependencies.length !== 1 ? 'ies' : 'y'}
        </span>
        {readOnlyCount > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <ReadBadge />
            <span className="text-text-muted">{readOnlyCount}</span>
          </span>
        )}
        {writeCount > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <WriteBadge />
            <span className="text-text-muted">{writeCount}</span>
          </span>
        )}
        {totalFundsAtRisk > 0 && (
          <span className="text-text-secondary">
            TVL{' '}
            <UsdValue
              value={totalFundsAtRisk}
              variant="capital"
              className="text-sm"
            />
          </span>
        )}
        {Array.from(entities.entries()).map(([entity, count]) => (
          <span key={entity} className="inline-flex items-center gap-1.5">
            <Badge variant="purple">{entity}</Badge>
            <span className="text-text-muted">{count}</span>
          </span>
        ))}
      </div>

      {/* Dependency risk diagram */}
      <ShareableDiagram
        id="dependency-diagram"
        title="Dependency Entity Concentration"
        linkQuery="?view=explorer&tab=dependencies"
        downloadName="dependency-concentration.png"
        className="mb-4"
      >
        <DependencyRiskDiagram dependencies={dependencies} />
      </ShareableDiagram>

      {/* Table */}
      <div className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-muted">
              <SortHeader
                field="name"
                label="Dependency"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
              />
              <SortHeader
                field="entity"
                label="Entity"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
              />
              <th className="px-4 py-2 font-medium text-text-secondary text-left">
                Access
              </th>
              <SortHeader
                field="functions"
                label="Used By"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
                className="text-right"
              />
              <th className="px-4 py-2 font-medium text-text-secondary text-left">
                Mitigations
              </th>
              <SortHeader
                field="fundsAtRisk"
                label="TVL"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
                className="text-right"
              />
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ dep, fundsAtRisk }) => (
              <DependencyRow
                key={dep.address}
                dep={dep}
                fundsAtRisk={fundsAtRisk}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DependencyRow({
  dep,
  fundsAtRisk,
}: {
  dep: CompiledDependency
  fundsAtRisk: number
}) {
  const [expanded, setExpanded] = useState(false)

  const readFns = dep.functions.filter((f) => f.viewOnlyPath).length
  const writeFns = dep.functions.length - readFns

  return (
    <>
      <tr
        className="border-b border-border hover:bg-bg-muted/30 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-2">
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
            <div className="min-w-0">
              <span className="font-medium text-text-primary">
                {dep.name}
              </span>
              <AddressDisplay
                address={dep.address}
                className="text-xs block"
              />
            </div>
          </div>
        </td>
        <td className="px-4 py-2.5">
          {dep.entity ? (
            <Badge variant="purple">{dep.entity}</Badge>
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </td>
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            {dep.viewOnlyPath ? <ReadBadge /> : <WriteBadge />}
          </div>
        </td>
        <td className="px-4 py-2.5 text-right">
          <span className="font-medium text-text-primary">
            {dep.functions.length}
          </span>
          {readFns > 0 && writeFns > 0 && (
            <span className="text-text-muted text-xs ml-1">
              ({readFns}R / {writeFns}W)
            </span>
          )}
        </td>
        <td className="px-4 py-2.5">
          <MitigationsSummary functions={dep.functions} />
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums">
          {fundsAtRisk > 0 ? (
            <UsdValue
              value={fundsAtRisk}
              variant="capital"
              className="text-sm"
            />
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td
            colSpan={6}
            className="px-0 py-0 bg-bg-muted/50 border-b border-border"
          >
            <ExpandedDependency dep={dep} />
          </td>
        </tr>
      )}
    </>
  )
}

function ExpandedDependency({ dep }: { dep: CompiledDependency }) {
  // Separate read and write functions
  const readFns = dep.functions.filter((f) => f.viewOnlyPath)
  const writeFns = dep.functions.filter((f) => !f.viewOnlyPath)

  return (
    <div>
      {dep.description && (
        <p className="px-6 py-3 text-sm text-text-secondary border-b border-border/50 leading-relaxed">
          {dep.description}
        </p>
      )}

      {/* Called functions on the dependency */}
      {dep.calledFunctions.length > 0 && (
        <div className="px-6 py-3 border-b border-border/50">
          <p className="text-xs font-medium text-text-muted mb-2">
            Functions called on this dependency:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {dep.calledFunctions.map((fn) => (
              <span
                key={fn}
                className="inline-flex items-center px-2 py-0.5 rounded bg-white border border-border text-xs font-mono text-text-primary"
              >
                {fn}()
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Write-access functions */}
      {writeFns.length > 0 && (
        <div className="px-6 py-3 border-b border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <WriteBadge />
            <span className="text-xs font-medium text-text-muted">
              {writeFns.length} function{writeFns.length !== 1 ? 's' : ''} with
              write access
            </span>
          </div>
          <FunctionList functions={writeFns} />
        </div>
      )}

      {/* Read-only functions */}
      {readFns.length > 0 && (
        <div className="px-6 py-3">
          <div className="flex items-center gap-2 mb-2">
            <ReadBadge />
            <span className="text-xs font-medium text-text-muted">
              {readFns.length} function{readFns.length !== 1 ? 's' : ''} with
              read-only access
            </span>
          </div>
          <FunctionList functions={readFns} />
        </div>
      )}
    </div>
  )
}

function FunctionList({
  functions,
}: {
  functions: CompiledDependency['functions']
}) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-text-muted">
          <th className="text-left pb-1 font-medium">Contract</th>
          <th className="text-left pb-1 font-medium">Function</th>
          <th className="text-left pb-1 font-medium">Mitigations</th>
          <th className="text-right pb-1 font-medium">TVL</th>
        </tr>
      </thead>
      <tbody>
        {functions.map((fn) => {
          const capital = getDepFunctionFunds(fn)
          return (
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
                {capital > 0 ? (
                  <span className="text-capital font-medium">
                    {formatUsdValue(capital)}
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

function ReadBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-status-blue/10 text-status-blue">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      Read
    </span>
  )
}

function WriteBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-status-amber/10 text-status-amber">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      Write
    </span>
  )
}
