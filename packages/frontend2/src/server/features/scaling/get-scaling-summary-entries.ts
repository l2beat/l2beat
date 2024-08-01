import { layer2s, layer3s } from '@l2beat/config'
import { getL2Risks } from '~/app/(new)/(other)/scaling/_utils/get-l2-risks'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from './get-common-scaling-entry'

export async function getScalingSummaryEntries() {
  const implementationChangeReport = await getImplementationChangeReport()
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()

  return [...layer2s, ...layer3s].map((project) => {
    const isVerified = !!projectsVerificationStatuses[project.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[project.id.toString()]

    return {
      ...getCommonScalingEntry({
        project,
        isVerified,
        hasImplementationChanged,
      }),
      risks: getL2Risks(project.riskView),
    }
  })
}

export type ScalingSummaryEntry = Awaited<
  ReturnType<typeof getScalingSummaryEntries>
>[number]
