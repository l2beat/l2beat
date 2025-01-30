import type { DataAvailabilityRecord } from '@l2beat/database'
import type { BlobSizeData } from '../providers/DaProvider'

export function aggregatePerDay(
  project: string,
  blobs: BlobSizeData[],
): DataAvailabilityRecord[] {
  const result = new Map<number, DataAvailabilityRecord>()

  for (const blob of blobs) {
    const timestamp = blob.blockTimestamp.toStartOf('day')
    const record = result.get(timestamp.toNumber())

    const sizeToReduce = (record?.totalSize ?? 0n) + BigInt(blob.size)

    result.set(timestamp.toNumber(), {
      timestamp,
      totalSize: sizeToReduce,
      projectId: project,
    })
  }

  return [...result.values()]
}
