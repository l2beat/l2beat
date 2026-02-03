import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject, updateContractTag, updateFunction } from '../api/api'
import type {
  AdminModuleScore,
  DependencyModuleScore,
  Impact,
  Likelihood,
} from '../api/types'
import { buildProxyTypeMap } from '../apps/discovery/defidisco/proxyTypeUtils'
import { usePanelStore } from '../apps/discovery/store/panel-store'
import { useContractTags } from '../hooks/useContractTags'
import {
  computeDeduplicatedCapital,
  computeWorstGrade,
  formatUsdValue,
  getGradeBadgeStyles,
  getGradeColor,
  getLikelihoodColor,
  hasCapitalData,
  ImpactPicker,
  impactToScore,
  isZeroAddress,
  LikelihoodPicker,
  OwnerSection,
} from './scoringShared'

interface DependencyInventoryBreakdownProps {
  score: DependencyModuleScore
  adminScore?: AdminModuleScore
}

/**
 * Dependency section component - displays functions for a single external contract
 */
function DependencySection({
  dependency,
  onUpdateLikelihood,
  onUpdateImpact,
}: {
  dependency: any
  onUpdateLikelihood: (contractAddress: string, likelihood: Likelihood) => void
  onUpdateImpact: (
    contractAddress: string,
    functionName: string,
    impact: Impact,
  ) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const selectGlobal = usePanelStore((state) => state.select)

  const worstGrade = computeWorstGrade(dependency.functions)
  const badgeStyles = worstGrade ? getGradeBadgeStyles(worstGrade) : null

  return (
    <div className="mb-1 ml-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-coffee-800/30"
      >
        <span className="text-coffee-400 text-xs">
          {isExpanded ? '▼' : '▶'}
        </span>
        {badgeStyles && (
          <span
            className="inline-block rounded border px-2 py-0.5 font-mono text-xs"
            style={{
              backgroundColor: badgeStyles.backgroundColor,
              borderColor: badgeStyles.borderColor,
              color: badgeStyles.color,
            }}
          >
            {worstGrade}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            selectGlobal(dependency.dependencyAddress)
          }}
          className="cursor-pointer font-medium text-coffee-200 text-sm transition-colors hover:text-blue-400"
        >
          {dependency.dependencyName}
        </button>
        <span className="mx-1 text-coffee-500 text-xs">|</span>
        <span className="text-coffee-400 text-xs">Likelihood:</span>
        <LikelihoodPicker
          currentLikelihood={dependency.likelihood}
          onUpdate={(likelihood) =>
            onUpdateLikelihood(dependency.dependencyAddress, likelihood)
          }
          allowUnscored={true}
        />
        <span className="ml-2 text-coffee-400 text-xs">
          ({dependency.functions.length} function
          {dependency.functions.length !== 1 ? 's' : ''})
        </span>
      </button>

      {isExpanded && (
        <ul className="mt-2 ml-8 space-y-1.5">
          {dependency.functions.map((func: any, idx: number) => {
            const likelihoodColor = getLikelihoodColor(
              dependency.likelihood || '',
            )
            const gradeBadgeStyles = func.grade
              ? getGradeBadgeStyles(func.grade)
              : null

            return (
              <li
                key={idx}
                className="flex items-center gap-2 text-coffee-300 text-xs"
              >
                {gradeBadgeStyles ? (
                  <span
                    className="inline-block rounded border px-1.5 py-0.5 font-mono text-xs"
                    style={{
                      backgroundColor: gradeBadgeStyles.backgroundColor,
                      borderColor: gradeBadgeStyles.borderColor,
                      color: gradeBadgeStyles.color,
                    }}
                  >
                    {func.grade}
                  </span>
                ) : (
                  <span className="inline-block px-1.5 py-0.5 text-coffee-500 text-xs">
                    -
                  </span>
                )}
                <button
                  onClick={() => selectGlobal(func.contractAddress)}
                  className="cursor-pointer font-medium text-coffee-200 transition-colors hover:text-blue-400"
                >
                  {func.contractName}
                </button>
                <span className="text-coffee-500">.</span>
                <span className="text-blue-400">{func.functionName}()</span>
                <span className="ml-2 text-coffee-500">(Impact: </span>
                <ImpactPicker
                  currentImpact={func.impact}
                  onUpdate={(impact) =>
                    onUpdateImpact(
                      func.contractAddress,
                      func.functionName,
                      impact,
                    )
                  }
                />
                <span className="text-coffee-500">, Likelihood: </span>
                <span style={{ color: likelihoodColor }}>
                  {dependency.likelihood || 'unscored'}
                </span>
                <span className="text-coffee-500">)</span>
              </li>
            )
          })}
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
  const queryClient = useQueryClient()
  const { data: contractTags } = useContractTags(project!)
  const gradeColor = getGradeColor(score.grade)

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

  // Mutation for updating likelihood
  const updateLikelihoodMutation = useMutation({
    mutationFn: ({
      contractAddress,
      likelihood,
    }: {
      contractAddress: string
      likelihood: Likelihood
    }) => {
      if (!project) throw new Error('Project not found')

      const existingTag = contractTags?.tags.find(
        (tag) =>
          tag.contractAddress.toLowerCase() === contractAddress.toLowerCase(),
      )

      return updateContractTag(project, {
        contractAddress: contractAddress,
        isExternal: existingTag?.isExternal ?? true,
        centralization: existingTag?.centralization,
        likelihood: likelihood,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-tags', project] })
      queryClient.invalidateQueries({ queryKey: ['v2-score', project] })
    },
  })

  const handleUpdateLikelihood = (
    contractAddress: string,
    likelihood: Likelihood,
  ) => {
    updateLikelihoodMutation.mutate({ contractAddress, likelihood })
  }

  // Mutation for updating impact
  const updateImpactMutation = useMutation({
    mutationFn: ({
      contractAddress,
      functionName,
      impact,
    }: {
      contractAddress: string
      functionName: string
      impact: Impact
    }) => {
      if (!project) throw new Error('Project not found')

      return updateFunction(project, {
        contractAddress,
        functionName,
        score: impactToScore(impact),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['functions', project] })
      queryClient.invalidateQueries({ queryKey: ['v2-score', project] })
    },
  })

  const handleUpdateImpact = (
    contractAddress: string,
    functionName: string,
    impact: Impact,
  ) => {
    updateImpactMutation.mutate({ contractAddress, functionName, impact })
  }

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
          <span>
            {score.inventory}{' '}
            <span className={`font-semibold ${gradeColor}`}>
              (Grade: {score.grade})
            </span>
          </span>
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
              <DependencySection
                key={dep.dependencyAddress}
                dependency={dep}
                onUpdateLikelihood={handleUpdateLikelihood}
                onUpdateImpact={handleUpdateImpact}
              />
            ))}

            {/* External owners (rendered with OwnerSection for full tags/funds) */}
            {displayedExternalOwners.map((admin) => (
              <OwnerSection
                key={admin.adminAddress}
                admin={admin}
                proxyType={proxyTypeMap.get(admin.adminAddress.toLowerCase())}
                onUpdateLikelihood={handleUpdateLikelihood}
                onUpdateImpact={handleUpdateImpact}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
