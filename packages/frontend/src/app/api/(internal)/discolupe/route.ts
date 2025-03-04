import { NextResponse } from 'next/server'
import { getCostsProjects } from '~/server/features/scaling/costs/utils/get-costs-projects'
import { getFinalityProjects } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { getLiveness } from '~/server/features/scaling/liveness/get-liveness'
import { get7dTvsBreakdown } from '~/server/features/scaling/tvs/utils/get-7d-tvs-breakdown'
import { ps } from '~/server/projects'
import { getOperatorSection } from '~/utils/project/technology/get-operator-section'
import { getOtherConsiderationsSection } from '~/utils/project/technology/get-other-considerations-section'
import { getWithdrawalsSection } from '~/utils/project/technology/get-withdrawals-section'

export async function GET() {
  const response = await getResponse()

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  return NextResponse.json(response, { headers })
}

async function getResponse() {
  const tvs = await get7dTvsBreakdown()
  const costs = (await getCostsProjects()).map((p) => p.id.toString())
  const liveness = Object.keys(await getLiveness())
  const finality = (await getFinalityProjects()).map((f) => f.id.toString())

  const projects = await ps.getProjects({
    select: ['statuses', 'scalingInfo', 'scalingTechnology'],
    optional: ['discoveryInfo', 'milestones', 'isUpcoming', 'isArchived'],
  })

  return {
    success: true,
    data: {
      projects: projects.map((project) => ({
        id: project.id.toString(),
        tvs: tvs.projects[project.id.toString()]?.breakdown.total ?? 0,
        display: {
          name: project.name,
          slug: project.slug,
          stack: project.scalingInfo.stack,
          category: project.scalingInfo.type,
        },
        type: project.scalingInfo.layer === 'layer2' ? 'L2' : 'L3',
        arePermissionsDiscoveryDriven:
          project.discoveryInfo?.permissionsDiscoDriven ?? false,
        areContractsDiscoveryDriven:
          project.discoveryInfo?.contractsDiscoDriven ?? false,
        isArchived: !!project.isArchived,
        isUpcoming: !!project.isUpcoming,
        isUnderReview: project.statuses.isUnderReview,

        costsConfigured: costs.includes(project.id.toString()),
        livenessConfigured: liveness.includes(project.id.toString()),
        finalityConfigured: finality.includes(project.id.toString()),
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
    },
  }
}
