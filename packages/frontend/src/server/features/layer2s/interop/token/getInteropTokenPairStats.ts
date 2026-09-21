import type { Project } from '@l2beat/config'
import {
  INTEROP_TRANSFER_RETENTION,
  type InteropTransferDeployedTokenPairStats,
} from '@l2beat/database'
import { Address32, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getActiveInteropChainIds } from '../utils/getInteropChains'

export function getPairStatsParams(
  snapshotTimestamp: UnixTime,
  projects: Project<'interopConfig'>[],
) {
  const from = snapshotTimestamp - UnixTime.DAY
  // Aggregates outlive raw transfers, so an aggregates timestamp override can
  // point at a day the cleaner has already emptied.
  if (from < UnixTime.now() - INTEROP_TRANSFER_RETENTION) return undefined
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

export async function getInteropTokenPairStats(
  tokenId: string,
  snapshotTimestamp: UnixTime,
  projects: Project<'interopConfig'>[],
): Promise<InteropTransferDeployedTokenPairStats[] | undefined> {
  if (env.MOCK) {
    return MOCK_INTEROP_TOKEN_PAIR_STATS
  }
  const params = getPairStatsParams(snapshotTimestamp, projects)
  if (!params) return undefined
  return await getDb().interopTransfer.getDeployedTokenPairStats(
    tokenId,
    params.timeRange,
    params.selection,
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
