import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../api/api'
import type { AdminEntry, ApiAdminsResponse } from '../api/types'
import { normalizeForLookup } from '../apps/discovery/defidisco/addressUtils'
import { buildProxyTypeMap } from '../apps/discovery/defidisco/proxyTypeUtils'
import {
  computeDeduplicatedCapital,
  formatUsdValue,
  OwnerSection,
} from './scoringShared'

interface AdminsInventoryBreakdownProps {
  adminsData: ApiAdminsResponse
}

/**
 * Owners Inventory Breakdown Component
 * Displays breakdown of owners by address
 */
export function AdminsInventoryBreakdown({
  adminsData,
}: AdminsInventoryBreakdownProps) {
  const { project } = useParams()

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

  const isKeyOwner = (admin: AdminEntry) =>
    admin.type === 'EOA' ||
    admin.type === 'EOAPermissioned' ||
    admin.type === 'Multisig' ||
    admin.isGovernance

  const displayedAdmins = useMemo(() => {
    // Always exclude external owners (they appear in Dependencies)
    const nonExternal = adminsData.admins.filter((a) => !a.isExternal)

    // Filter by key owners (governance/EOA/multisig) unless showing all
    if (!showAllContracts) {
      return nonExternal.filter(isKeyOwner)
    }

    return nonExternal
  }, [adminsData.admins, showAllContracts])

  // Recalculate displayed values from visible admins only
  const displayedFunctionCount = displayedAdmins.reduce(
    (sum, admin) => sum + admin.functions.length,
    0,
  )
  const {
    totalFunds: displayedCapitalAtRisk,
    totalTokenValue: displayedTokenValueAtRisk,
  } = useMemo(() => {
    return computeDeduplicatedCapital(displayedAdmins)
  }, [displayedAdmins])

  const hasAnyCapital = adminsData.totals.totalCapitalAtRisk > 0

  const hasHiddenContractOwners = useMemo(() => {
    const nonExternal = adminsData.admins.filter((a) => !a.isExternal)
    return nonExternal.some((a) => !isKeyOwner(a))
  }, [adminsData.admins])

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
          <span>{adminsData.totals.adminCount}</span>
        </span>
      </div>

      {/* Owner breakdown - always shown */}
      <div className="mt-3 ml-2">
        {adminsData.admins.length === 0 ? (
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
                key={admin.address}
                admin={admin}
                proxyType={proxyTypeMap.get(normalizeForLookup(admin.address))}
                isGovernance={admin.isGovernance}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
