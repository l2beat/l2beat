import {
  getInteropTransferValue,
  type InteropBridgeType,
  UnixTime,
} from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import type { InteropSelectionInput } from '../types'

export async function getPreviousProtocolData(
  snapshotTimestamp: UnixTime | undefined,
  params: InteropSelectionInput,
  projectIds: string[],
  types?: InteropBridgeType[],
): Promise<Map<string, { volume: number; transferCount: number }>> {
  const result = new Map<string, { volume: number; transferCount: number }>()
  if (!snapshotTimestamp) return result

  const db = getDb()
  const previousTimestamp = snapshotTimestamp - UnixTime.DAY
  const previousRecords =
    await db.aggregatedInteropTransfer.getByChainsAndTimestamp(
      previousTimestamp,
      params.from,
      params.to,
      types,
      projectIds,
    )

  for (const record of previousRecords) {
    const current = result.get(record.id) ?? { volume: 0, transferCount: 0 }
    current.volume += getInteropTransferValue(record) ?? 0
    current.transferCount += record.transferCount ?? 0
    result.set(record.id, current)
  }

  return result
}
