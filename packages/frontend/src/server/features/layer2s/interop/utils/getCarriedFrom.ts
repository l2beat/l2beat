import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
} from '@l2beat/database'
import {
  interopLaneKey,
  type KnownInteropBridgeType,
  UnixTime,
} from '@l2beat/shared-pure'
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
  const [transfers, token] = await Promise.all([
    db.aggregatedInteropTransfer.getByChainsAndTimestamp(
      timestamp,
      from,
      to,
      types,
      protocolIds,
    ),
    tokenId === undefined
      ? undefined
      : db.aggregatedInteropToken
          .getByChainsAndTimestamp(timestamp, from, to, types, protocolIds)
          .then((rows) => ({ id: tokenId, rows })),
  ])
  return findCarriedFrom(transfers, { anchorChain, token })
}

/**
 * Token rows carry no marker of their own, so a token's lanes are looked up in
 * the transfer rows, where the marker lives.
 */
export function findCarriedFrom(
  transfers: AggregatedInteropTransferRecord[],
  {
    anchorChain,
    token,
  }: {
    anchorChain?: string
    token?: { id: string; rows: AggregatedInteropTokenRecord[] }
  },
): UnixTime | undefined {
  const tokenLanes =
    token &&
    new Set(
      token.rows
        .filter((row) => row.abstractTokenId === token.id)
        .map(interopLaneKey),
    )
  const sources = transfers.flatMap((transfer) =>
    transfer.carriedFrom !== undefined &&
    transferTouchesChain(transfer, anchorChain) &&
    (tokenLanes === undefined || tokenLanes.has(interopLaneKey(transfer)))
      ? [transfer.carriedFrom]
      : [],
  )
  return sources.length > 0 ? UnixTime(Math.min(...sources)) : undefined
}
