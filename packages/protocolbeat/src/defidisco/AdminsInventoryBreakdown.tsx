import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../api/api'
import type { AdminModuleScore } from '../api/types'
import { useContractTags } from '../apps/discovery/defidisco/hooks/useContractTags'
import { buildProxyTypeMap } from '../apps/discovery/defidisco/proxyTypeUtils'
import {
  computeDeduplicatedCapital,
  formatUsdValue,
  hasCapitalData,
  OwnerSection,
} from './scoringShared'

interface AdminsInventoryBreakdownProps {
  score: AdminModuleScore
}

/**
 * Owners Inventory Breakdown Component
 * Displays breakdown of owners by address
 */
export function AdminsInventoryBreakdown({
  score,
}: AdminsInventoryBreakdownProps) {
  const { project } = useParams()
  const { data: contractTags } = useContractTags(project!)

  // Fetch project data for proxy type information
  const { data: projectData } = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project!),
    enabled: !!project,
  })

  // Build proxy type lookup map
  const proxyTypeMap = useMemo(
    () => buildProxyTypeMap(projectData),
    [projectData],
  )

  // Toggle for showing all contract owners (not just governance/EOA/multisig)
  const [showAllContracts, setShowAllContracts] = useState(false)

  // Filter helpers
  const isExternalOwner = (admin: any) => {
    if (!contractTags?.tags) return false
    return contractTags.tags.some(
      (tag) =>
        tag.contractAddress.toLowerCase() ===
          admin.adminAddress.toLowerCase() && tag.isExternal,
    )
  }

  const isGovernanceOwner = (admin: any) => {
    if (!contractTags?.tags) return false
    return contractTags.tags.some(
      (tag) =>
        tag.contractAddress.toLowerCase() ===
          admin.adminAddress.toLowerCase() && tag.isGovernance,
    )
  }

  const isKeyOwner = (admin: any) =>
    admin.adminType === 'EOA' ||
    admin.adminType === 'EOAPermissioned' ||
    admin.adminType === 'Multisig' ||
    isGovernanceOwner(admin)

  const displayedAdmins = useMemo(() => {
    if (!score.breakdown) return []

    // Always exclude external owners (they appear in Dependencies)
    const nonExternal = score.breakdown.filter((a) => !isExternalOwner(a))

    // Filter by key owners (governance/EOA/multisig) unless showing all
    if (!showAllContracts) {
      return nonExternal.filter(isKeyOwner)
    }

    return nonExternal
  }, [score.breakdown, showAllContracts, contractTags])

  // Recalculate displayed values from visible admins only
  const displayedFunctionCount = displayedAdmins.reduce(
    (sum, admin) => sum + admin.functions.length,
    0,
  )
  const {
    totalFunds: displayedCapitalAtRisk,
    totalTokenValue: displayedTokenValueAtRisk,
  } = useMemo(() => {
    const adminsWithCapital = displayedAdmins.filter(hasCapitalData)
    return computeDeduplicatedCapital(adminsWithCapital)
  }, [displayedAdmins])

  const hasAnyCapital =
    score.totalCapitalAtRisk !== undefined && score.totalCapitalAtRisk > 0

  const hasHiddenContractOwners = useMemo(() => {
    if (!score.breakdown) return false
    const nonExternal = score.breakdown.filter((a) => !isExternalOwner(a))
    return nonExternal.some((a) => !isKeyOwner(a))
  }, [score.breakdown, contractTags])

  return (
    <div className="text-coffee-300">
      {/* Main header - non-expandable, consistent with other inventory items */}
      <div className="flex items-center justify-between">
        <span className="font-medium">
          Owners:
          {hasAnyCapital && displayedCapitalAtRisk > 0 && (
            <span className="ml-2 font-normal text-green-400 text-sm">
              {formatUsdValue(displayedCapitalAtRisk)} controlled
            </span>
          )}
          {displayedTokenValueAtRisk > 0 && (
            <span className="ml-2 font-normal text-aux-yellow text-sm">
              + {formatUsdValue(displayedTokenValueAtRisk)} protocol tokens
            </span>
          )}
        </span>
        <span className="flex items-center gap-2">
          {hasHiddenContractOwners && (
            <label className="flex cursor-pointer items-center gap-1.5 text-coffee-400 text-xs">
              <input
                type="checkbox"
                checked={showAllContracts}
                onChange={(e) => setShowAllContracts(e.target.checked)}
                className="h-3 w-3 cursor-pointer accent-coffee-500"
              />
              Show all contracts
            </label>
          )}
          <span>{score.inventory}</span>
        </span>
      </div>

      {/* Owner breakdown - always shown */}
      <div className="mt-3 ml-2">
        {!score.breakdown || score.breakdown.length === 0 ? (
          <p className="ml-4 text-coffee-400 text-xs">
            No permission owners found
          </p>
        ) : (
          <>
            <p className="mb-3 ml-4 text-coffee-400 text-xs">
              {displayedFunctionCount} permissioned function
              {displayedFunctionCount !== 1 ? 's' : ''} controlled by{' '}
              {displayedAdmins.length} owner
              {displayedAdmins.length !== 1 ? 's' : ''}
            </p>
            {displayedAdmins.map((admin) => (
              <OwnerSection
                key={admin.adminAddress}
                admin={admin}
                proxyType={proxyTypeMap.get(admin.adminAddress.toLowerCase())}
                isGovernance={isGovernanceOwner(admin)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
