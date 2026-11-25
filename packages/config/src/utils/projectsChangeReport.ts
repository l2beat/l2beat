import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'

/**
 * Turns discovery's update diffs into per-project change flags. It lives here
 * so the website and the public API flag the same projects as under review.
 */

export interface UpdateDiffLike {
  projectId: string
  address: string
  type:
    | 'implementationChange'
    | 'highSeverityFieldChange'
    | 'ultimateUpgraderChange'
    | 'becameVerified'
  diffBaseTimestamp: number
}

export type ProjectChangeReport = Record<
  string,
  Record<UpdateDiffLike['type'], EthereumAddress[]>
>

export type ProjectsChangeReportData = Record<string, ProjectChangeReport>

export function buildProjectsChangeReport(
  updateDiffs: UpdateDiffLike[],
  getBaseTimestamp: (projectId: string) => number | undefined,
): ProjectsChangeReportData {
  const result: ProjectsChangeReportData = {}

  const byProject = groupBy(updateDiffs, (diff) => diff.projectId)
  for (const [projectId, diffs] of Object.entries(byProject)) {
    // NOTE(radomski): We're optimistically saying that diffs are only active
    // if all inputs used to create them are older than the block number we
    // used to build the project information.
    const baseTimestamp = getBaseTimestamp(projectId)
    const activeDiffs = diffs.filter(
      (diff) =>
        baseTimestamp === undefined || baseTimestamp <= diff.diffBaseTimestamp,
    )

    const byChain = groupBy(activeDiffs, (diff) =>
      ChainSpecificAddress.longChain(ChainSpecificAddress(diff.address)),
    )
    for (const [chain, changes] of Object.entries(byChain)) {
      const addressesOfType = (type: UpdateDiffLike['type']) =>
        changes
          .filter((c) => c.type === type)
          .map((c) =>
            ChainSpecificAddress.address(ChainSpecificAddress(c.address)),
          )

      result[projectId] ??= {}
      result[projectId][chain] = {
        implementationChange: addressesOfType('implementationChange'),
        highSeverityFieldChange: addressesOfType('highSeverityFieldChange'),
        ultimateUpgraderChange: addressesOfType('ultimateUpgraderChange'),
        becameVerified: addressesOfType('becameVerified'),
      }
    }
  }
  return result
}

export function hasImplementationChanged(
  report: ProjectsChangeReportData,
  projectId: string,
): boolean {
  const chainChanges = report[projectId]
  if (!chainChanges) {
    return false
  }
  return Object.values(chainChanges).some(
    (c) => c.implementationChange.length > 0,
  )
}

export function hasHighSeverityFieldChanged(
  report: ProjectsChangeReportData,
  projectId: string,
): boolean {
  const ethereumChanges = report[projectId]?.ethereum
  return !!ethereumChanges && ethereumChanges.highSeverityFieldChange.length > 0
}

export function hasUltimateUpgraderChanged(
  report: ProjectsChangeReportData,
  projectId: string,
): boolean {
  const ethereumChanges = report[projectId]?.ethereum
  return !!ethereumChanges && ethereumChanges.ultimateUpgraderChange.length > 0
}

export function hasImpactfulChange(
  report: ProjectsChangeReportData,
  projectId: string,
): boolean {
  return (
    hasImplementationChanged(report, projectId) ||
    hasHighSeverityFieldChanged(report, projectId) ||
    hasUltimateUpgraderChanged(report, projectId)
  )
}
