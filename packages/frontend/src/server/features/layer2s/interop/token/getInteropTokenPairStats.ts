import type { InteropTransferDeployedTokenPairStats } from '@l2beat/database'
import {
  Address32,
  INTEROP_TRANSFER_RETENTION,
  UnixTime,
} from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getAggregatedInteropSnapshotTimestamp } from '../utils/getAggregatedInteropTimestamp'
import { getInteropChains } from '../utils/getInteropChains'

/** Past 24h transfer stats per deployment pair, or undefined without a snapshot. */
export async function getInteropTokenPairStats(
  tokenId: string,
): Promise<InteropTransferDeployedTokenPairStats[] | undefined> {
  if (env.MOCK) {
    return MOCK_INTEROP_TOKEN_PAIR_STATS
  }
  const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
  if (!snapshotTimestamp) return undefined
  const from = snapshotTimestamp - UnixTime.DAY
  // Aggregates outlive raw transfers, so an aggregates timestamp override can
  // point at a day the cleaner has already emptied.
  if (from < UnixTime.now() - INTEROP_TRANSFER_RETENTION) return undefined
  const projects = await ps.getProjects({ select: ['interopConfig'] })
  const chains = getInteropChains()
    .filter((chain) => !chain.isUpcoming)
    .map((chain) => chain.id)
  return getDb().interopTransfer.getDeployedTokenPairStats(
    tokenId,
    { from, to: snapshotTimestamp },
    {
      plugins: projects.flatMap((project) => project.interopConfig.plugins),
      sourceChains: chains,
      destinationChains: chains,
    },
  )
}

const MOCK_INTEROP_TOKEN_PAIR_STATS: InteropTransferDeployedTokenPairStats[] = [
  {
    src: {
      chain: 'ethereum',
      address: Address32.from('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
    },
    dst: {
      chain: 'arbitrum',
      address: Address32.from('0xaf88d065e77c8cc2239327c5edb3a432268e5831'),
    },
    transferCount: 403,
    transfersWithDurationCount: 403,
    totalDurationSum: 9_672,
    volume: 2_170_000,
  },
  {
    src: {
      chain: 'arbitrum',
      address: Address32.from('0xaf88d065e77c8cc2239327c5edb3a432268e5831'),
    },
    dst: {
      chain: 'ethereum',
      address: Address32.from('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
    },
    transferCount: 125,
    transfersWithDurationCount: 125,
    totalDurationSum: 2_375,
    volume: 392_430,
  },
]
