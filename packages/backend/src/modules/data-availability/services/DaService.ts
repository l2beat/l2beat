import type {
  AvailDaTrackingConfig,
  CelestiaDaTrackingConfig,
  EthereumDaTrackingConfig,
} from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import type {
  AvailBlob,
  CelestiaBlob,
  DaBlob,
  EthereumBlob,
} from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import type { BlockDaIndexedConfig } from '../../../config/Config'

export class DaService {
  generateRecords(
    blobs: DaBlob[],
    previousRecords: DataAvailabilityRecord[],
    configurations: BlockDaIndexedConfig[],
  ): { records: DataAvailabilityRecord[]; latestTimestamp: number } {
    const updatedRecords = [...previousRecords]

    const addOrMerge = (record: DataAvailabilityRecord) => {
      const existing = updatedRecords.find(
        (r) =>
          r.timestamp === record.timestamp &&
          r.daLayer === record.daLayer &&
          r.projectId === record.projectId &&
          r.configurationId === record.configurationId,
      )
      if (existing) {
        existing.totalSize += record.totalSize
      } else {
        updatedRecords.push(record)
      }
    }

    for (const blob of blobs) {
      const records = this.createRecordsFromBlob(blob, configurations)
      records.forEach((r) => addOrMerge(r))
    }

    const lastBlob = blobs.at(-1)
    assert(lastBlob, 'No blobs provided')

    return {
      records: updatedRecords,
      latestTimestamp: lastBlob.blockTimestamp,
    }
  }

  private createRecordsFromBlob(
    blob: DaBlob,
    configurations: BlockDaIndexedConfig[],
  ): DataAvailabilityRecord[] {
    const records: DataAvailabilityRecord[] = []

    for (const c of configurations) {
      switch (c.type) {
        case 'baseLayer': {
          if (blob.daLayer === c.daLayer) {
            records.push({
              timestamp: UnixTime.toStartOf(blob.blockTimestamp, 'hour'),
              daLayer: blob.daLayer,
              projectId: c.projectId,
              configurationId: c.configurationId,
              totalSize: blob.size,
            })
          }
          break
        }
        case 'ethereum': {
          if (blob.type === 'ethereum') {
            if (matchEthereumProject(blob, c)) {
              records.push({
                timestamp: UnixTime.toStartOf(blob.blockTimestamp, 'hour'),
                daLayer: blob.daLayer,
                projectId: c.projectId,
                configurationId: c.configurationId,
                totalSize: blob.size,
              })
            }
          }
          break
        }
        case 'celestia': {
          if (blob.type === 'celestia') {
            if (matchCelestiaProject(blob, c)) {
              records.push({
                timestamp: UnixTime.toStartOf(blob.blockTimestamp, 'hour'),
                daLayer: blob.daLayer,
                projectId: c.projectId,
                configurationId: c.configurationId,
                totalSize: blob.size,
              })
            }
          }
          break
        }
        case 'avail': {
          if (blob.type === 'avail') {
            if (matchAvailProject(blob, c)) {
              records.push({
                timestamp: UnixTime.toStartOf(blob.blockTimestamp, 'hour'),
                daLayer: blob.daLayer,
                projectId: c.projectId,
                configurationId: c.configurationId,
                totalSize: blob.size,
              })
            }
          }
          break
        }
      }
    }

    return records
  }
}

function matchEthereumProject(
  blob: EthereumBlob,
  config: EthereumDaTrackingConfig,
) {
  if (config.topics) {
    const hasTopicMatch = config.topics.some((topic) =>
      blob.topics.includes(topic.toLowerCase()),
    )

    if (hasTopicMatch) {
      return true
    }
  }

  const hasInboxMatch = config.inbox.toLowerCase() === blob.inbox.toLowerCase()

  if (!config.sequencers || config.sequencers.length === 0) {
    return hasInboxMatch
  }

  const hasMatchingSequencer = config.sequencers.some(
    (sequencer) => sequencer.toLowerCase() === blob.sequencer.toLowerCase(),
  )

  return hasInboxMatch && hasMatchingSequencer
}

function matchCelestiaProject(
  blob: CelestiaBlob,
  config: CelestiaDaTrackingConfig,
) {
  return config.namespace === blob.namespace
}

function matchAvailProject(blob: AvailBlob, config: AvailDaTrackingConfig) {
  return config.appIds.includes(blob.appId)
}
