import { INTEROP_TRANSFER_RETENTION } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { getAggregatedInteropSnapshotTimestamp } from '../utils/getAggregatedInteropTimestamp'
import { getActiveInteropChainIds } from '../utils/getInteropChains'

/** Shared time window and eligibility for the tiles and detailed token graphs. */
export async function getPairStatsParams() {
  const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
  if (!snapshotTimestamp) return undefined
  const from = snapshotTimestamp - UnixTime.DAY
  // Aggregates outlive raw transfers, so an aggregates timestamp override can
  // point at a day the cleaner has already emptied.
  if (from < UnixTime.now() - INTEROP_TRANSFER_RETENTION) return undefined
  const projects = await ps.getProjects({ select: ['interopConfig'] })
  const chains = getActiveInteropChainIds()
  return {
    timeRange: { from, to: snapshotTimestamp },
    selection: {
      plugins: projects.flatMap((project) => project.interopConfig.plugins),
      sourceChains: chains,
      destinationChains: chains,
    },
  }
}
