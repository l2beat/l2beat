import type {
  InteropTransferDeployedTokenPairStats,
  TokenRelationRoute,
} from '@l2beat/database'
import {
  Address32,
  INTEROP_TRANSFER_RETENTION,
  UnixTime,
} from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getTokenDb } from '~/server/tokenDb'
import { getAggregatedInteropSnapshotTimestamp } from '../utils/getAggregatedInteropTimestamp'

export interface InteropTokenRelations {
  routes: TokenRelationRoute[]
  /** Past 24h up to the aggregated snapshot; undefined without a snapshot. */
  pairStats: InteropTransferDeployedTokenPairStats[] | undefined
}

export async function getInteropTokenRelations(
  tokenId: string,
  deployments: { chain: string; address: string }[],
): Promise<InteropTokenRelations> {
  if (env.MOCK) {
    return MOCK_INTEROP_TOKEN_RELATIONS
  }
  if (deployments.length === 0) return { routes: [], pairStats: undefined }
  const [routes, pairStats] = await Promise.all([
    getTokenDb().tokenRelation.getRoutesBetween(deployments),
    getPairStats(tokenId),
  ])
  return { routes, pairStats }
}

async function getPairStats(tokenId: string) {
  const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
  if (!snapshotTimestamp) return undefined
  const from = snapshotTimestamp - UnixTime.DAY
  // Aggregates outlive raw transfers, so an aggregates timestamp override can
  // point at a day the cleaner has already emptied.
  if (from < UnixTime.now() - INTEROP_TRANSFER_RETENTION) return undefined
  return getDb().interopTransfer.getDeployedTokenPairStats(tokenId, {
    from,
    to: snapshotTimestamp,
  })
}

const MOCK_INTEROP_TOKEN_RELATIONS: InteropTokenRelations = {
  routes: [
    {
      tokenAChain: 'arbitrum',
      tokenAAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      tokenBChain: 'ethereum',
      tokenBAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      plugin: 'cctp-v2',
      bridgeType: 'burnAndMint',
      lockedToken: null,
    },
    {
      tokenAChain: 'base',
      tokenAAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      tokenBChain: 'ethereum',
      tokenBAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      plugin: 'opstack',
      bridgeType: 'lockAndMint',
      lockedToken: 'B',
    },
  ],
  pairStats: [
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
  ],
}
