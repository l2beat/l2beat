import type { Project } from '@l2beat/config'

export interface BlobsData {
  totalData: {
    value: number
    change: number
  }
  blobsShare: number
}

export async function getBlobsData(
  _: Project<'scalingInfo'>[],
): Promise<BlobsData> {
  // const now = UnixTime.toStartOf(UnixTime.now(), 'hour')
  // const db = getDb()
  // const records = await db.dataAvailability.getForDaLayerInTimeRange(
  //   'ethereum',
  //   now - 30 * UnixTime.DAY,
  //   now,
  // )

  return {
    totalData: {
      value: 10 * 1024 * 1024 * 1024,
      change: 10,
    },
    blobsShare: 75,
  }
}
