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
import type { DaTrackingConfig } from '../../../config/Config'

export class DaService {
  constructor(private configurations: DaTrackingConfig[]) {}

  generateRecords(
    blobs: DaBlob[],
    previousRecords: DataAvailabilityRecord[],
  ): DataAvailabilityRecord[] {
    const updatedRecords = [...previousRecords]

    const addOrMerge = (record: DataAvailabilityRecord) => {
      const existing = updatedRecords.find(
        (r) =>
          r.timestamp.toNumber() === record.timestamp.toNumber() &&
          r.daLayer === record.daLayer &&
          r.projectId === record.projectId,
      )
      if (existing) {
        existing.totalSize += record.totalSize
      } else {
        updatedRecords.push(record)
      }
    }

    for (const blob of blobs) {
      const records = this.createRecordsFromBlob(blob)
      records.forEach((r) => addOrMerge(r))
    }

    return updatedRecords
  }

  private createRecordsFromBlob(blob: DaBlob): DataAvailabilityRecord[] {
    const records: DataAvailabilityRecord[] = []

    for (const c of this.configurations) {
      switch (c.type) {
        case 'baseLayer': {
          if (blob.daLayer === c.daLayer) {
            records.push({
              projectId: c.projectId,
              daLayer: blob.daLayer,
              timestamp: blob.blockTimestamp.toStartOf('day'),
              totalSize: blob.size,
            })
          }
          break
        }
        case 'ethereum': {
          if (blob.type === 'ethereum') {
            if (matchEthereumProject(blob, c)) {
              records.push({
                projectId: c.projectId,
                daLayer: blob.daLayer,
                timestamp: blob.blockTimestamp.toStartOf('day'),
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
                projectId: c.projectId,
                daLayer: blob.daLayer,
                timestamp: blob.blockTimestamp.toStartOf('day'),
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
                projectId: c.projectId,
                daLayer: blob.daLayer,
                timestamp: blob.blockTimestamp.toStartOf('day'),
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
  return config.appId === blob.appId
}
