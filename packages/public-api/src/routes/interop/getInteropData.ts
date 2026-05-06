import { INTEROP_CHAINS, type ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { InteropChain, InteropProtocol } from './types'
import { getInteropChains } from './utils/getInteropChains'
import { getInteropProtocols } from './utils/getInteropProtocols'

export async function getInteropProtocolsData(
  db: Database,
  ps: ProjectService,
): Promise<InteropProtocol[]> {
  const [records, projects] = await Promise.all([
    getLatestAggregatedInteropTransfers(db),
    ps.getProjects({ select: ['interopConfig'] }),
  ])

  return getInteropProtocols(records, projects)
}

export async function getInteropChainsData(
  db: Database,
  ps: ProjectService,
): Promise<InteropChain[]> {
  const [records, projects] = await Promise.all([
    getLatestAggregatedInteropTransfers(db),
    ps.getProjects({ select: ['interopConfig'] }),
  ])

  return getInteropChains(records, projects)
}

async function getLatestAggregatedInteropTransfers(db: Database) {
  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()
  if (!latestTimestamp) {
    return []
  }

  const chainIds = INTEROP_CHAINS.map((chain) => chain.id)
  return db.aggregatedInteropTransfer.getByChainsAndTimestamp(
    latestTimestamp,
    chainIds,
    chainIds,
  )
}
