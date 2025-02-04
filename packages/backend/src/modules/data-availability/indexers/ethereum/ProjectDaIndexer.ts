import type { EthereumDaTrackingConfig } from '@l2beat/config'
import type { BlobData, BlobSizeData } from '@l2beat/shared'
import { EthereumAddress, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { aggregatePerDay } from '../../utils/aggregatePerDay'
import { DaIndexer, type DaIndexerDeps } from '../DaIndexer'

export interface ProjectDaIndexerDeps extends DaIndexerDeps {
  projectConfigs: {
    id: ProjectId
    config: EthereumDaTrackingConfig
  }[]
}

export class ProjectDaIndexer extends DaIndexer {
  constructor(override readonly $: ProjectDaIndexerDeps) {
    super({
      ...$,
      tags: {
        tag: 'data-availability',
        ...$.tags,
      },
    })
  }

  protected override async process(
    fillBackSince: UnixTime,
    blobs: BlobData[],
  ): Promise<void> {
    await Promise.all(
      this.$.projectConfigs.map(({ id, config }) =>
        this.processProject(id, config, fillBackSince, blobs),
      ),
    )
  }

  async processProject(
    projectId: ProjectId,
    config: EthereumDaTrackingConfig,
    fillBackSince: UnixTime,
    blobs: BlobData[],
  ): Promise<void> {
    const presentRecords =
      await this.$.db.dataAvailability.getByProjectIdAndFrom(
        projectId,
        fillBackSince,
      )

    const presentBlobSizeData: BlobSizeData[] = presentRecords.map(
      (record) => ({
        blockTimestamp: record.timestamp,
        size: record.totalSize,
      }),
    )

    const projectBlobs = blobs.filter((blob) => {
      const hasInboxMatch =
        EthereumAddress(config.inbox) === EthereumAddress(blob.transaction.to)

      const hasAnySequencersConfigured =
        config.sequencers && config.sequencers.length > 0

      if (!hasAnySequencersConfigured) {
        return hasInboxMatch
      }

      const hasMatchingSequencer = config.sequencers?.some(
        (sequencer) =>
          EthereumAddress(sequencer) === EthereumAddress(blob.transaction.from),
      )

      return hasInboxMatch && hasMatchingSequencer
    })

    const records = aggregatePerDay(projectId, [
      ...presentBlobSizeData,
      ...projectBlobs.map((blob) => ({
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

    await this.$.db.transaction(async () => {
      await Promise.all(
        this.$.projectConfigs.map(({ id }) =>
          this.$.db.dataAvailability.deleteByProjectFrom(id, fillBackSince),
        ),
      )
    })

    return targetHeight
  }
}
