import type { BlobData, BlobSizeData } from '@l2beat/shared'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { aggregatePerDay } from '../../utils/aggregatePerDay'
import { DaIndexer, type DaIndexerDeps } from '../DaIndexer'

export interface LayerDaIndexerDeps extends DaIndexerDeps {
  projectId: ProjectId
}

export class LayerDaIndexer extends DaIndexer {
  constructor(override readonly $: LayerDaIndexerDeps) {
    super({
      ...$,
      tags: {
        tag: 'data-availability',
        project: $.projectId,
      },
    })
  }

  override async process(
    fillBackSince: UnixTime,
    blobs: BlobData[],
  ): Promise<void> {
    const presentRecords =
      await this.$.db.dataAvailability.getByProjectIdAndFrom(
        this.$.projectId,
        fillBackSince,
      )

    const presentBlobSizeData: BlobSizeData[] = presentRecords.map(
      (record) => ({
        blockTimestamp: record.timestamp,
        size: record.totalSize,
      }),
    )

    const records = aggregatePerDay(this.$.projectId, [
      ...presentBlobSizeData,
      ...blobs.map((blob) => ({
        blockTimestamp: blob.transaction.blockTimestamp,
        size: blob.size,
      })),
    ])

    await this.$.db.dataAvailability.upsertMany(records)
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const { timestamp } =
      await this.$.blockProvider.getBlockWithTransactions(targetHeight)

    const fillBackSince = new UnixTime(timestamp).toStartOf('day')

    await this.$.db.dataAvailability.deleteByProjectFrom(
      this.$.projectId,
      fillBackSince,
    )

    return targetHeight
  }
}
