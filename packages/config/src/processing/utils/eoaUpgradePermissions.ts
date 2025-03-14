/**
 * Utility functions related to checking for EOAs with critical upgrade permissions
 */

import type { ProjectContracts, ProjectPermissions } from '../../types'

// TO BE REFACTORED
export interface UpgradePermissionCount {
  address: string
  count: number
}

export interface PermissionCounts {
  eoaCounts: Map<string, number>
  nonEoaCounts: Map<string, number>
  eoaAddresses: Set<string>
}

export interface EoaUpgradePermissionsAnalysis {
  shouldWarn: boolean
  eoaWithMostPermissions: UpgradePermissionCount | null
  nonEoaWithMostPermissions: UpgradePermissionCount | null
  /** Set of EOA addresses that are considered high risk */
  highRiskEoaAddresses: Set<string>
}

function getDefaultAnalysis(): EoaUpgradePermissionsAnalysis {
  return {
    shouldWarn: false,
    eoaWithMostPermissions: null,
    nonEoaWithMostPermissions: null,
    highRiskEoaAddresses: new Set<string>(),
  }
}

function countPermissions(
  permissions: Record<string, ProjectPermissions>,
  contracts: ProjectContracts,
): PermissionCounts {
  const counts: PermissionCounts = {
    eoaCounts: new Map<string, number>(),
    nonEoaCounts: new Map<string, number>(),
    eoaAddresses: new Set<string>(),
  }

  for (const contractList of Object.values(contracts.addresses)) {
    for (const contract of contractList) {
      if (!contract.upgradableBy) continue

      for (const actor of contract.upgradableBy) {
        for (const chainPermissions of Object.values(permissions)) {
          const allPermissions = [
            ...(chainPermissions.roles ?? []),
            ...(chainPermissions.actors ?? []),
          ]

          const matchingPermission = allPermissions.find(
            (p) => p.name === actor.name,
          )
          if (!matchingPermission) continue

          for (const account of matchingPermission.accounts) {
            const address = account.address.toString()
            const isEoa = account.type === 'EOA'
            const targetMap = isEoa ? counts.eoaCounts : counts.nonEoaCounts
            const currentCount = targetMap.get(address) ?? 0
            targetMap.set(address, currentCount + 1)

            if (isEoa) {
              counts.eoaAddresses.add(address)
            }
          }
        }
      }
    }
  }

  return counts
}

function findMaxPermissions(
  permissionCounts: Map<string, number>,
): UpgradePermissionCount | null {
  let maxCount = 0
  let maxAddress = ''

  permissionCounts.forEach((count, address) => {
    if (count > maxCount) {
      maxCount = count
      maxAddress = address
    }
  })

  return maxCount > 0
    ? {
        address: maxAddress,
        count: maxCount,
      }
    : null
}

function findHighRiskEoas(
  eoaCounts: Map<string, number>,
  maxEoaCount: number,
): Set<string> {
  const highRiskEoas = new Set<string>()
  eoaCounts.forEach((count, address) => {
    if (count === maxEoaCount) {
      highRiskEoas.add(address)
    }
  })
  return highRiskEoas
}

/**
 * Analyzes permissions for a project to check if an EOA has high number of upgrade permissions
 *
 * Checks if an EOA has a number of upgrade permissions that is >=
 * the next highest number of upgrade permissions granted to any other address
 */
export function analyzeEoaUpgradePermissions(
  permissions: Record<string, ProjectPermissions> | 'UnderReview' | undefined,
  contracts: ProjectContracts | undefined,
): EoaUpgradePermissionsAnalysis {
  if (!permissions || permissions === 'UnderReview' || !contracts) {
    return getDefaultAnalysis()
  }

  const permissionCounts = countPermissions(permissions, contracts)

  const eoaWithMost = findMaxPermissions(permissionCounts.eoaCounts)
  const nonEoaWithMost = findMaxPermissions(permissionCounts.nonEoaCounts)

  const result = {
    ...getDefaultAnalysis(),
    eoaWithMostPermissions: eoaWithMost,
    nonEoaWithMostPermissions: nonEoaWithMost,
  }

  if (
    eoaWithMost &&
    (!nonEoaWithMost || eoaWithMost.count >= nonEoaWithMost.count)
  ) {
    result.shouldWarn = true
    result.highRiskEoaAddresses = findHighRiskEoas(
      permissionCounts.eoaCounts,
      eoaWithMost.count,
    )
  }

  return result
}
