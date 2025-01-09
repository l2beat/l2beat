import {
  type Layer2,
  type Layer3,
  areContractsDiscoveryDriven,
  arePermissionsDiscoveryDriven,
  layer2s,
  layer3s,
} from '@l2beat/config'
import { NextResponse } from 'next/server'
import { get7dTvlBreakdown } from '~/server/features/scaling/tvl/utils/get-7d-tvl-breakdown'

export async function GET() {
  const response = await getResponse()

  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow all origins
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // Allowed methods
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allowed headers
  }

  return NextResponse.json(response, { headers })
}

async function getResponse() {
  const tvl = await get7dTvlBreakdown()
  return {
    success: true,
    data: {
      projects: [...layer2s, ...layer3s].map((p) =>
        toResponseProject(p, tvl.projects[p.id.toString()]?.total ?? 0),
      ),
    },
  } as const
}

function toResponseProject(project: Layer2 | Layer3, tvl: number) {
  return {
    id: project.id.toString(),
    tvl,
    display: project.display,
    arePermissionsDiscoveryDriven: arePermissionsDiscoveryDriven(project),
    areContractsDiscoveryDriven: areContractsDiscoveryDriven(project),
    milestones: project.milestones,
  }
}
