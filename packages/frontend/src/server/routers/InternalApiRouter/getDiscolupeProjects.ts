import { getCostsProjects } from '~/server/features/scaling/costs/utils/getCostsProjects'
import { getLiveness } from '~/server/features/scaling/liveness/getLiveness'
import { get7dTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { ps } from '~/server/projects'
import { getOperatorSection } from '~/utils/project/technology/getOperatorSection'
import { getOtherConsiderationsSection } from '~/utils/project/technology/getOtherConsiderationsSection'
import { getWithdrawalsSection } from '~/utils/project/technology/getWithdrawalsSection'

export async function getDiscolupeProjects() {
  const tvs = await get7dTvsBreakdown({ type: 'layer2' })
  const costs = (await getCostsProjects()).map((p) => p.id.toString())
  const liveness = Object.keys(await getLiveness())

  const projects = await ps.getProjects({
    select: ['statuses', 'scalingInfo', 'scalingTechnology'],
    optional: ['discoveryInfo', 'milestones', 'isUpcoming', 'archivedAt'],
  })

  return {
    projects: projects.map((project) => ({
      id: project.id.toString(),
      tvs: tvs.projects[project.id.toString()]?.breakdown.total ?? 0,
      display: {
        name: project.name,
        slug: project.slug,
        stacks: project.scalingInfo.stacks,
        category: project.scalingInfo.type,
      },
      type: project.scalingInfo.layer === 'layer2' ? 'L2' : 'L3',
      arePermissionsDiscoveryDriven:
        project.discoveryInfo?.permissionsDiscoDriven ?? false,
      areContractsDiscoveryDriven:
        project.discoveryInfo?.contractsDiscoDriven ?? false,
      isArchived: !!project.archivedAt,
      isUpcoming: !!project.isUpcoming,
      isUnderReview: !!project.statuses.reviewStatus,

      costsConfigured: costs.includes(project.id.toString()),
      livenessConfigured: liveness.includes(project.id.toString()),
      milestonesConfigured: (project.milestones ?? []).length > 0,
      operatorConfigured: getOperatorSection(project) !== undefined,
      withdrawalsConfigured: getWithdrawalsSection(project) !== undefined,
      otherConsiderationsConfigured:
        getOtherConsiderationsSection(project) !== undefined,
      stateDerivationConfigured:
        project.scalingTechnology.stateDerivation !== undefined,
      stateValidationConfigured:
        project.scalingTechnology.stateValidation !== undefined,
      upgradesAndGovernanceConfigured:
        project.scalingTechnology.upgradesAndGovernance !== undefined,
    })),
  }
}
