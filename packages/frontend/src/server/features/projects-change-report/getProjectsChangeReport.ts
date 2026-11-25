import {
  buildProjectsChangeReport,
  hasHighSeverityFieldChanged,
  hasImpactfulChange,
  hasImplementationChanged,
  hasUltimateUpgraderChanged,
} from '@l2beat/config/build/utils/projectsChangeReport'
import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'

export type ProjectsChangeReport = Awaited<
  ReturnType<typeof getProjectsChangeReportWithFns>
>

export const EMPTY_PROJECTS_CHANGE_REPORT: ProjectsChangeReport = {
  projects: {},
  getChanges: () => ({
    impactfulChange: false,
    becameVerifiedContracts: {},
  }),
  hasImplementationChanged: () => false,
  hasHighSeverityFieldChanged: () => false,
  hasUltimateUpgraderChanged: () => false,
  getBecameVerifiedContracts: () => ({}),
}

export interface ProjectChanges {
  impactfulChange: boolean
  becameVerifiedContracts: Record<string, EthereumAddress[]>
}

export async function getProjectsChangeReport() {
  if (env.MOCK) {
    return getProjectsChangeReportMock()
  }

  return await getProjectsChangeReportWithFns()
}

async function getProjectsChangeReportWithFns() {
  const db = getDb()
  const updateDiffs = await db.updateDiff.getAll()

  const projects = await ps.getProjects({
    ids: [...new Set(updateDiffs.map((diff) => diff.projectId))].map(ProjectId),
    select: ['discoveryInfo'],
    where: ['discoveryInfo'],
  })
  const baseTimestamps = new Map(
    projects.map((p) => [p.id.toString(), p.discoveryInfo.baseTimestamp]),
  )

  return {
    projects: buildProjectsChangeReport(updateDiffs, (projectId) =>
      baseTimestamps.get(projectId),
    ),
    getChanges: function (projectId: string): ProjectChanges {
      return {
        impactfulChange: hasImpactfulChange(this.projects, projectId),
        becameVerifiedContracts: this.getBecameVerifiedContracts(projectId),
      }
    },
    hasImplementationChanged: function (projectId: string) {
      return hasImplementationChanged(this.projects, projectId)
    },
    hasHighSeverityFieldChanged: function (projectId: string) {
      return hasHighSeverityFieldChanged(this.projects, projectId)
    },
    hasUltimateUpgraderChanged: function (projectId: string) {
      return hasUltimateUpgraderChanged(this.projects, projectId)
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
