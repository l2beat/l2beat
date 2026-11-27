import { INTEROP_CHAINS, type ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { InteropChain, InteropProtocol } from './types'
import { getInteropChains } from './utils/getInteropChains'
import { getInteropProtocols } from './utils/getInteropProtocols'

export async function getInteropProtocolsData(
  db: Database,
  ps: ProjectService,
): Promise<InteropProtocol[]> {
  const [{ timestamp, records }, projects] = await Promise.all([
    getLatestAggregatedInteropTransfers(db),
    ps.getProjects({ select: ['interopConfig'] }),
  ])

  return getInteropProtocols(records, projects).map((protocol) => ({
    ...protocol,
    timestamp,
  }))
}

export async function getInteropChainsData(
  db: Database,
  ps: ProjectService,
): Promise<InteropChain[]> {
  const [{ timestamp, records }, projects] = await Promise.all([
    getLatestAggregatedInteropTransfers(db),
    ps.getProjects({ select: ['interopConfig'] }),
  ])

  return getInteropChains(records, projects).map((chain) => ({
    ...chain,
    timestamp,
  }))
}

/**
 * The newest snapshot, which covers the 24 hours before its timestamp. With
 * no snapshot there are no records, so the timestamp is never read.
 */
async function getLatestAggregatedInteropTransfers(db: Database) {
  const timestamp = await db.interopAggregateStatus.getLatestPromotedTimestamp()
  if (!timestamp) {
    return { timestamp: 0, records: [] }
  }

  const chainIds = INTEROP_CHAINS.map((chain) => chain.id)
  const records = await db.aggregatedInteropTransfer.getByChainsAndTimestamp(
    timestamp,
    chainIds,
    chainIds,
  )
  return { timestamp, records }
}
