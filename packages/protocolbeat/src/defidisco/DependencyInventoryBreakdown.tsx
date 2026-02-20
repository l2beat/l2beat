import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../api/api'
import type { AdminModuleScore, DependencyModuleScore } from '../api/types'
import { useContractTags } from '../apps/discovery/defidisco/hooks/useContractTags'
import { buildProxyTypeMap } from '../apps/discovery/defidisco/proxyTypeUtils'
import { usePanelStore } from '../apps/discovery/store/panel-store'
import {
  computeDeduplicatedCapital,
  formatUsdValue,
  getImpactColor,
  hasCapitalData,
  isZeroAddress,
  OwnerSection,
} from './scoringShared'

interface DependencyInventoryBreakdownProps {
  score: DependencyModuleScore
  adminScore?: AdminModuleScore
}

/**
 * Dependency section component - displays functions for a single external contract
 */
function DependencySection({ dependency }: { dependency: any }) {
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
            selectGlobal(dependency.dependencyAddress)
          }}
          className="cursor-pointer font-medium text-coffee-200 text-sm transition-colors hover:text-blue-400"
        >
          {dependency.dependencyName}
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
 * Dependency Inventory Breakdown Component
 * Displays breakdown of dependencies by external contract,
 * including external owners from the admin breakdown.
 */
export function DependencyInventoryBreakdown({
  score,
  adminScore,
}: DependencyInventoryBreakdownProps) {
  const { project } = useParams()
  const { data: contractTags } = useContractTags(project!)

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

  // Extract external owners from admin breakdown
  const allExternalOwners = useMemo(() => {
    if (!adminScore?.breakdown || !contractTags?.tags) return []

    return adminScore.breakdown.filter((admin) => {
      return contractTags.tags.some(
        (tag) =>
          tag.contractAddress.toLowerCase() ===
            admin.adminAddress.toLowerCase() && tag.isExternal,
      )
    })
  }, [adminScore, contractTags])

  // Filter immutable/revoked external owners based on toggle
  const isImmutableOrRevoked = (admin: any) =>
    proxyTypeMap.get(admin.adminAddress.toLowerCase()) === 'immutable' ||
    isZeroAddress(admin.adminAddress)

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

  // Regular dependencies (from call graph / function dependencies)
  const regularDeps = score.breakdown || []

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
    const adminsWithCapital = displayedExternalOwners.filter(hasCapitalData)
    return computeDeduplicatedCapital(adminsWithCapital)
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
          <span>{score.inventory}</span>
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

            {/* Regular dependencies */}
            {regularDeps.map((dep) => (
              <DependencySection key={dep.dependencyAddress} dependency={dep} />
            ))}

            {/* External owners (rendered with OwnerSection for full tags/funds) */}
            {displayedExternalOwners.map((admin) => (
              <OwnerSection
                key={admin.adminAddress}
                admin={admin}
                proxyType={proxyTypeMap.get(admin.adminAddress.toLowerCase())}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
