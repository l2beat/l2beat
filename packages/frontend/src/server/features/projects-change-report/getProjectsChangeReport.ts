import type { UpdateDiffRecord } from '@l2beat/database'
import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
} from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'

export type ProjectsChangeReport = Awaited<
  ReturnType<typeof getProjectsChangeReportWithFns>
>

export interface ProjectChanges {
  impactfulChange: boolean
  becameVerifiedContracts: Record<string, EthereumAddress[]>
}

type ProjectChangeReport = Record<
  string,
  {
    implementationChange: EthereumAddress[]
    highSeverityFieldChange: EthereumAddress[]
    ultimateUpgraderChange: EthereumAddress[]
    becameVerified: EthereumAddress[]
  }
>

export async function getProjectsChangeReport() {
  if (env.MOCK) {
    return getProjectsChangeReportMock()
  }

  return await getProjectsChangeReportWithFns()
}

async function getProjectsChangeReportWithFns() {
  const result: Record<string, ProjectChangeReport> = {}

  const db = getDb()
  const updateDiffs = await db.updateDiff.getAll()

  const byProject = groupBy(updateDiffs, (diff) => diff.projectId)
  for (const [projectId, diffs] of Object.entries(byProject)) {
    const project = await ps.getProject({
      id: ProjectId(projectId),
      select: ['discoveryInfo'],
      where: ['discoveryInfo'],
    })

    // NOTE(radomski): We're optimistically saying that diffs are only active
    // if all inputs used to create them are older than the block number we
    // used to build the project information.
    const activeDiffs = diffs.filter((diff) => {
      const baseTimestamp = project?.discoveryInfo.baseTimestamp
      if (baseTimestamp === undefined) return true
      const isDiffActive = baseTimestamp <= diff.diffBaseTimestamp
      return isDiffActive
    })

    const byChain = groupBy(activeDiffs, (diff) =>
      ChainSpecificAddress.longChain(ChainSpecificAddress(diff.address)),
    )
    for (const [chain, changes] of Object.entries(byChain)) {
      const changesByType = groupByType(changes)

      result[projectId] ??= {}
      result[projectId][chain] = {
        implementationChange: changesByType.implementationChange.map((c) =>
          ChainSpecificAddress.address(ChainSpecificAddress(c.address)),
        ),
        highSeverityFieldChange: changesByType.highSeverityFieldChange.map(
          (c) => ChainSpecificAddress.address(ChainSpecificAddress(c.address)),
        ),
        ultimateUpgraderChange: changesByType.ultimateUpgraderChange.map((c) =>
          ChainSpecificAddress.address(ChainSpecificAddress(c.address)),
        ),
        becameVerified: changesByType.becameVerified.map((c) =>
          ChainSpecificAddress.address(ChainSpecificAddress(c.address)),
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
        becameVerifiedContracts: this.getBecameVerifiedContracts(projectId),
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
    getBecameVerifiedContracts: function (projectId: string) {
      return Object.fromEntries(
        Object.entries(this.projects[projectId] ?? {}).map(
          ([chain, changes]) => [chain, changes.becameVerified],
        ),
      )
    },
  }
}

function groupByType(changes: UpdateDiffRecord[]) {
  const result: Record<UpdateDiffRecord['type'], UpdateDiffRecord[]> = {
    implementationChange: [],
    highSeverityFieldChange: [],
    ultimateUpgraderChange: [],
    becameVerified: [],
  }
  for (const change of changes) {
    result[change.type].push(change)
  }
  return result
}

function getProjectsChangeReportMock(): ProjectsChangeReport {
  return {
    projects: {
      geist: {
        base: {
          implementationChange: [],
          highSeverityFieldChange: [],
          ultimateUpgraderChange: [],
          becameVerified: [
            EthereumAddress(
              '0x9F904Fea0efF79708B37B99960e05900fE310A8E'.toLowerCase(),
            ),
          ],
        },
      },
    },
    getChanges: () => ({
      impactfulChange: false,
      becameVerifiedContracts: {
        base: [
          EthereumAddress(
            '0x9F904Fea0efF79708B37B99960e05900fE310A8E'.toLowerCase(),
          ),
        ],
      },
    }),
    hasImplementationChanged: () => false,
    hasHighSeverityFieldChanged: () => false,
    hasUltimateUpgraderChanged: () => false,
    getBecameVerifiedContracts: () => ({}),
  }
}
