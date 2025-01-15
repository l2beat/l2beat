import { DaRecord } from '@l2beat/database'
import { BlobSizeData } from '../providers/DaProvider'

export function aggregatePerHour(
  project: string,
  blobs: BlobSizeData[],
): DaRecord[] {
  const result = new Map<number, DaRecord>()

  for (const blob of blobs) {
    const timestamp = blob.blockTimestamp.toStartOf('hour')
    const record = result.get(timestamp.toNumber())

    const size = (record?.totalSize ?? 0) + blob.size

    result.set(timestamp.toNumber(), {
      timestamp,
      totalSize: size,
      project,
    })
  }

  return [...result.values()]
}
