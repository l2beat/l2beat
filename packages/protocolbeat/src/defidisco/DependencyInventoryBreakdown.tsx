import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../api/api'
import type {
  AdminEntry,
  ApiAdminsResponse,
  ApiDependenciesResponse,
  DependencyEntry,
} from '../api/types'
import { normalizeForLookup } from '../apps/discovery/defidisco/addressUtils'
import { buildProxyTypeMap } from '../apps/discovery/defidisco/proxyTypeUtils'
import { usePanelStore } from '../apps/discovery/store/panel-store'
import {
  computeDeduplicatedCapital,
  formatUsdValue,
  getImpactColor,
  isZeroAddress,
  OwnerSection,
} from './scoringShared'

interface DependencyInventoryBreakdownProps {
  depsData: ApiDependenciesResponse
  adminsData: ApiAdminsResponse
}

/**
 * Dependency section component - displays functions for a single external contract
 */
function DependencySection({ dependency }: { dependency: DependencyEntry }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const selectGlobal = usePanelStore((state) => state.select)

  return (
    <div className="mb-1 ml-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-coffee-800/30"
      >
        <span className="text-coffee-400 text-xs">
          {isExpanded ? '▼' : '▶'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            selectGlobal(dependency.address)
          }}
          className="cursor-pointer font-medium text-coffee-200 text-sm transition-colors hover:text-blue-400"
        >
          {dependency.name}
        </button>
        <span className="ml-2 text-coffee-400 text-xs">
          ({dependency.functions.length} function
          {dependency.functions.length !== 1 ? 's' : ''})
        </span>
      </button>

      {isExpanded && (
        <ul className="mt-2 ml-8 space-y-1.5">
          {dependency.functions.map((func: any, idx: number) => (
            <li
              key={idx}
              className="flex items-center gap-2 text-coffee-300 text-xs"
            >
              <button
                onClick={() => selectGlobal(func.contractAddress)}
                className="cursor-pointer font-medium text-coffee-200 transition-colors hover:text-blue-400"
              >
                {func.contractName}
              </button>
              <span className="text-coffee-500">.</span>
              <span className="text-blue-400">{func.functionName}()</span>
              <span className="ml-2 text-coffee-500">(</span>
              <span
                className="text-xs capitalize"
                style={{ color: getImpactColor(func.impact) }}
              >
                {func.impact}
              </span>
              <span className="text-coffee-500">)</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * Entity group component - collapsible group of dependencies sharing the same entity
 */
function EntityGroup({
  entity,
  deps,
}: {
  entity: string
  deps: DependencyEntry[]
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  const totalFunctions = deps.reduce(
    (sum, dep) => sum + dep.functions.length,
    0,
  )

  return (
    <div className="mb-2 ml-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-coffee-800/30"
      >
        <span className="text-coffee-400 text-xs">
          {isExpanded ? '▼' : '▶'}
        </span>
        <span className="font-medium text-aux-orange text-sm">{entity}</span>
        <span className="text-coffee-500 text-xs">
          ({deps.length} contract{deps.length !== 1 ? 's' : ''},{' '}
          {totalFunctions} fn{totalFunctions !== 1 ? 's' : ''})
        </span>
      </button>
      {isExpanded &&
        deps.map((dep) => (
          <DependencySection key={dep.address} dependency={dep} />
        ))}
    </div>
  )
}

/**
 * Dependency Inventory Breakdown Component
 * Displays breakdown of dependencies by external contract,
 * including external owners from the admin breakdown.
 */
export function DependencyInventoryBreakdown({
  depsData,
  adminsData,
}: DependencyInventoryBreakdownProps) {
  const { project } = useParams()

  // Fetch project data for proxy type information (needed for external owners)
  const { data: projectData } = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project!),
    enabled: !!project,
  })

  const proxyTypeMap = useMemo(
    () => buildProxyTypeMap(projectData),
    [projectData],
  )

  // Toggle for showing/hiding immutable dependencies (default: on)
  const [showImmutable, setShowImmutable] = useState(true)

  // Regular dependencies (from call graph / function dependencies)
  const regularDeps = depsData.dependencies

  // Addresses already covered by write-dependencies in the regular dep breakdown
  const depAddresses = useMemo(() => {
    const set = new Set<string>()
    for (const dep of regularDeps) {
      set.add(normalizeForLookup(dep.address))
    }
    return set
  }, [regularDeps])

  // Extract external owners from admin breakdown, excluding those already
  // covered by write-dependencies in the regular dependency pipeline
  const allExternalOwners = useMemo(() => {
    return adminsData.admins.filter((admin) => {
      if (!admin.isExternal) return false
      // Skip if already shown as a write-dependency
      if (depAddresses.has(normalizeForLookup(admin.address))) return false
      return true
    })
  }, [adminsData, depAddresses])

  // Filter immutable/revoked external owners based on toggle
  const isImmutableOrRevoked = (admin: AdminEntry) =>
    proxyTypeMap.get(normalizeForLookup(admin.address)) === 'immutable' ||
    isZeroAddress(admin.address)

  const displayedExternalOwners = useMemo(() => {
    if (showImmutable) {
      // Show all, but put immutable/revoked at the end
      const mutable = allExternalOwners.filter((a) => !isImmutableOrRevoked(a))
      const immutable = allExternalOwners.filter((a) => isImmutableOrRevoked(a))
      return [...mutable, ...immutable]
    }
    return allExternalOwners.filter((a) => !isImmutableOrRevoked(a))
  }, [allExternalOwners, proxyTypeMap, showImmutable])

  const hasImmutableExternalOwners = useMemo(() => {
    return allExternalOwners.some((a) => isImmutableOrRevoked(a))
  }, [allExternalOwners, proxyTypeMap])

  // Group regular deps by entity
  const { entityGroups, ungroupedDeps, sortedEntities } = useMemo(() => {
    const groups = new Map<string, DependencyEntry[]>()
    const noEntity: DependencyEntry[] = []

    for (const dep of regularDeps) {
      if (dep.entity) {
        const list = groups.get(dep.entity) || []
        list.push(dep)
        groups.set(dep.entity, list)
      } else {
        noEntity.push(dep)
      }
    }

    return {
      entityGroups: groups,
      ungroupedDeps: noEntity,
      sortedEntities: [...groups.keys()].sort(),
    }
  }, [regularDeps])

  // Count functions across regular dependencies
  const depFunctionCount = regularDeps.reduce(
    (sum, dep) => sum + dep.functions.length,
    0,
  )

  // Count functions across displayed external owners
  const extOwnerFunctionCount = displayedExternalOwners.reduce(
    (sum, admin) => sum + admin.functions.length,
    0,
  )

  // Aggregate capital at risk across displayed external owners (deduplicated by contract)
  const {
    totalFunds: displayedCapitalAtRisk,
    totalTokenValue: displayedTokenValueAtRisk,
  } = useMemo(() => {
    return computeDeduplicatedCapital(displayedExternalOwners)
  }, [displayedExternalOwners])

  const totalFunctionCount = depFunctionCount + extOwnerFunctionCount
  const totalContractCount = regularDeps.length + displayedExternalOwners.length
  const hasAnyEntries = regularDeps.length > 0 || allExternalOwners.length > 0

  return (
    <div className="text-coffee-300">
      {/* Main header */}
      <div className="flex items-center justify-between">
        <span className="font-medium">
          Dependencies:
          {displayedCapitalAtRisk > 0 && (
            <span className="ml-2 font-normal text-green-400 text-sm">
              {formatUsdValue(displayedCapitalAtRisk)} at risk
            </span>
          )}
          {displayedTokenValueAtRisk > 0 && (
            <span className="ml-2 font-normal text-aux-yellow text-sm">
              + {formatUsdValue(displayedTokenValueAtRisk)} protocol tokens
            </span>
          )}
        </span>
        <span className="flex items-center gap-2">
          {hasImmutableExternalOwners && (
            <label className="flex cursor-pointer items-center gap-1.5 text-coffee-400 text-xs">
              <input
                type="checkbox"
                checked={showImmutable}
                onChange={(e) => setShowImmutable(e.target.checked)}
                className="h-3 w-3 cursor-pointer accent-coffee-500"
              />
              Show immutable
            </label>
          )}
          <span>{depsData.totals.dependencyCount}</span>
        </span>
      </div>

      {/* Dependency breakdown */}
      <div className="mt-3 ml-2">
        {!hasAnyEntries ? (
          <p className="ml-4 text-coffee-400 text-xs">
            No functions with dependencies on external contracts
          </p>
        ) : (
          <>
            <p className="mb-3 ml-4 text-coffee-400 text-xs">
              {totalFunctionCount} function
              {totalFunctionCount !== 1 ? 's' : ''} using {totalContractCount}{' '}
              external contract
              {totalContractCount !== 1 ? 's' : ''}
            </p>

            {/* Regular dependencies grouped by entity */}
            {sortedEntities.map((entity) => (
              <EntityGroup
                key={entity}
                entity={entity}
                deps={entityGroups.get(entity) || []}
              />
            ))}
            {ungroupedDeps.map((dep) => (
              <DependencySection key={dep.address} dependency={dep} />
            ))}

            {/* External owners (rendered with OwnerSection for full tags/funds) */}
            {displayedExternalOwners.map((admin) => (
              <OwnerSection
                key={admin.address}
                admin={admin}
                proxyType={proxyTypeMap.get(normalizeForLookup(admin.address))}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
