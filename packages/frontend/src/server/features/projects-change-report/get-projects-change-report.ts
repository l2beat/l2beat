import type { UpdateDiffRecord } from '@l2beat/database'
import { EthereumAddress } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'

export type ProjectsChangeReport = Awaited<
  ReturnType<typeof getProjectsChangeReportWithFns>
>

export interface ProjectChanges {
  impactfulChange: boolean
}

type ProjectChangeReport = Record<
  string,
  {
    implementationChange: EthereumAddress[]
    highSeverityFieldChange: EthereumAddress[]
    ultimateUpgraderChange: EthereumAddress[]
  }
>

export async function getProjectsChangeReport() {
  if (env.MOCK) {
    return getProjectsChangeReportMock()
  }

  return getProjectsChangeReportWithFns()
}

async function getProjectsChangeReportWithFns() {
  const result: Record<string, ProjectChangeReport> = {}

  const db = getDb()
  const updateDiffs = await db.updateDiff.getAll()

  const byProject = groupBy(updateDiffs, (diff) => diff.projectId)
  for (const [projectId, diffs] of Object.entries(byProject)) {
    const byChain = groupBy(diffs, (diff) => diff.chain)
    for (const [chain, changes] of Object.entries(byChain)) {
      const changesByType = groupByType(changes)

      result[projectId] ??= {}
      result[projectId][chain] = {
        implementationChange: changesByType.implementationChange.map((c) =>
          EthereumAddress(c.address),
        ),
        highSeverityFieldChange: changesByType.highSeverityFieldChange.map(
          (c) => EthereumAddress(c.address),
        ),
        ultimateUpgraderChange: changesByType.ultimateUpgraderChange.map((c) =>
          EthereumAddress(c.address),
        ),
      }
    }
  }

  return {
    projects: result,
    getChanges: function (projectId: string): ProjectChanges {
      return {
        impactfulChange:
          this.hasImplementationChanged(projectId) ||
          this.hasHighSeverityFieldChanged(projectId) ||
          this.hasUltimateUpgraderChanged(projectId),
      }
    },
    hasImplementationChanged: function (projectId: string) {
      const chainChanges = this.projects[projectId]
      if (!chainChanges) {
        return false
      }
      return Object.values(chainChanges).some(
        (c) => c.implementationChange.length > 0,
      )
    },
    hasHighSeverityFieldChanged: function (projectId: string) {
      const ethereumChanges = this.projects[projectId]?.ethereum
      return (
        !!ethereumChanges && ethereumChanges.highSeverityFieldChange.length > 0
      )
    },
    hasUltimateUpgraderChanged: function (projectId: string) {
      const ethereumChanges = this.projects[projectId]?.ethereum
      return (
        !!ethereumChanges && ethereumChanges.ultimateUpgraderChange.length > 0
      )
    },
  }
}

function groupByType(changes: UpdateDiffRecord[]) {
  const result: Record<UpdateDiffRecord['type'], UpdateDiffRecord[]> = {
    implementationChange: [],
    highSeverityFieldChange: [],
    ultimateUpgraderChange: [],
  }
  for (const change of changes) {
    result[change.type].push(change)
  }
  return result
}

function getProjectsChangeReportMock(): ProjectsChangeReport {
  return {
    projects: {},
    getChanges: () => ({
      impactfulChange: false,
    }),
    hasImplementationChanged: () => false,
    hasHighSeverityFieldChanged: () => false,
    hasUltimateUpgraderChanged: () => false,
  }
}
