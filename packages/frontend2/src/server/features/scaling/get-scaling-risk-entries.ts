import { layer2s } from '@l2beat/config'
import { type ProjectId } from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { orderByTvl } from '../tvl/order-by-tvl'
import { getVerificationStatus } from '../verification-status/get-verification-status'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'

export async function getScalingRiskEntries(tvl: Record<ProjectId, number>) {
  const orderedProjects = orderByTvl(layer2s, tvl)

  const implementationChangeReport = await getImplementationChangeReport()
  const verificationStatus = await getVerificationStatus()

  return orderedProjects.map((project) => {
    const isVerified = !!verificationStatus.projects[project.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[project.id.toString()]

    return {
      type: project.type,
      category: project.display.category,
      stage: project.type === 'layer2' ? project.stage : undefined,
      provider: project.display.provider,
      purposes: project.display.purposes,
      name: project.display.name,
      shortName: project.display.shortName,
      slug: project.display.slug,
      href: `/scaling/projects/${project.display.slug}`,
      warning: project.display.warning,
      redWarning: project.display.redWarning,
      isVerified,
      showProjectUnderReview: isAnySectionUnderReview(project),
      hasImplementationChanged,
      risks: project.riskView,
      isUpcoming: !!project.isUpcoming,
      isArchived: !!project.isArchived,
    }
  })
}

export type ScalingRiskEntry = Awaited<
  ReturnType<typeof getScalingRiskEntries>
>[number]
