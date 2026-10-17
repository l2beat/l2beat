import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
} from '@l2beat/database'
import { type KnownInteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { transferTouchesChain } from './transferTouchesChain'

/**
 * A lane carried over from an older snapshot counts transfers from that
 * snapshot's window, so listing the current window next to it would show
 * fewer transfers than the count. Returns the oldest snapshot such a lane in
 * the selection was computed in, or undefined when every lane is fresh.
 */
export async function getCarriedFrom({
  snapshotTimestamp,
  from,
  to,
  type,
  protocolIds,
  anchorChain,
  tokenId,
}: {
  snapshotTimestamp: number
  from: string[]
  to: string[]
  type?: KnownInteropBridgeType
  protocolIds?: string[]
  anchorChain?: string
  tokenId?: string
}): Promise<UnixTime | undefined> {
  const db = getDb()
  const timestamp = UnixTime(snapshotTimestamp)
  const types = type ? [type] : undefined
  const [transfers, tokens] = await Promise.all([
    db.aggregatedInteropTransfer.getByChainsAndTimestamp(
      timestamp,
      from,
      to,
      types,
      protocolIds,
    ),
    tokenId
      ? db.aggregatedInteropToken.getByChainsAndTimestamp(
          timestamp,
          from,
          to,
          types,
          protocolIds,
        )
      : undefined,
  ])
  return findCarriedFrom(transfers, { anchorChain, tokenId, tokens })
}

/**
 * Token rows carry no marker of their own, so a token's lanes are looked up in
 * the transfer rows, where the marker lives.
 */
export function findCarriedFrom(
  transfers: AggregatedInteropTransferRecord[],
  scope: {
    anchorChain?: string
    tokenId?: string
    tokens?: AggregatedInteropTokenRecord[]
  },
): UnixTime | undefined {
  const tokenLanes =
    scope.tokenId !== undefined
      ? new Set(
          (scope.tokens ?? [])
            .filter((token) => token.abstractTokenId === scope.tokenId)
            .map(laneKey),
        )
      : undefined
  const sources = transfers.flatMap((transfer) =>
    transfer.carriedFrom !== undefined &&
    transferTouchesChain(transfer, scope.anchorChain) &&
    (tokenLanes === undefined || tokenLanes.has(laneKey(transfer)))
      ? [transfer.carriedFrom]
      : [],
  )
  return sources.length > 0 ? UnixTime(Math.min(...sources)) : undefined
}

function laneKey(lane: {
  id: string
  bridgeType: string
  srcChain: string
  dstChain: string
}): string {
  return `${lane.id}:${lane.bridgeType}:${lane.srcChain}:${lane.dstChain}`
}
