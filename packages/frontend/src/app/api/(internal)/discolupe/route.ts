import {
  type Layer2,
  type Layer3,
  areContractsDiscoveryDriven,
  arePermissionsDiscoveryDriven,
  layer2s,
  layer3s,
} from '@l2beat/config'
import { NextResponse } from 'next/server'
import { getCostsProjects } from '~/server/features/scaling/costs/utils/get-costs-projects'
import { getFinalityProjects } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { getLiveness } from '~/server/features/scaling/liveness/get-liveness'
import { get7dTvlBreakdown } from '~/server/features/scaling/tvl/utils/get-7d-tvl-breakdown'
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
  const tvl = await get7dTvlBreakdown()
  const costs = getCostsProjects().map((c) => c.id.toString())
  const liveness = Object.keys(await getLiveness())
  const finality = (await getFinalityProjects()).map((f) => f.id.toString())

  return {
    success: true,
    data: {
      projects: [...layer2s, ...layer3s].map((p) =>
        toResponseProject(
          p,
          costs,
          liveness,
          finality,
          tvl.projects[p.id.toString()]?.breakdown.total ?? 0,
        ),
      ),
    },
  } as const
}

function toResponseProject(
  project: Layer2 | Layer3,
  costs: string[],
  liveness: string[],
  finality: string[],
  tvl: number,
) {
  const operatorSection = getOperatorSection(project)
  const withdrawalsSection = getWithdrawalsSection(project)
  const otherConsiderationsSection = getOtherConsiderationsSection(project)

  return {
    id: project.id.toString(),
    tvl,
    display: project.display,
    type: project.type === 'layer2' ? 'L2' : 'L3',
    arePermissionsDiscoveryDriven: arePermissionsDiscoveryDriven(project),
    areContractsDiscoveryDriven: areContractsDiscoveryDriven(project),
    isArchived: project.isArchived === true,
    isUpcoming: project.isUpcoming === true,
    isUnderReview: project.isUnderReview === true,

    costsConfigured: costs.includes(project.id.toString()),
    livenessConfigured: liveness.includes(project.id.toString()),
    finalityConfigured: finality.includes(project.id.toString()),
    milestonesConfigured: (project.milestones ?? []).length > 0,
    operatorConfigured: operatorSection !== undefined,
    withdrawalsConfigured: withdrawalsSection !== undefined,
    otherConsiderationsConfigured: otherConsiderationsSection !== undefined,
    stateDerivationConfigured: project.stateDerivation !== undefined,
    stateValidationConfigured: project.stateValidation !== undefined,
    upgradesAndGovernanceConfigured:
      project.type === 'layer2' && project.upgradesAndGovernance !== undefined,
    knowledgeNuggetsConfigured: project.knowledgeNuggets !== undefined,
  }
}
