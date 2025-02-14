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
import { assert, type ProjectId } from '@l2beat/shared-pure'

export class DaService {
  constructor(
    private configurations:
      | {
          configurationId: string
          type: 'ethereum'
          projectId: ProjectId
          config: EthereumDaTrackingConfig | { type: 'baseLayer' }
        }[]
      | {
          configurationId: string
          type: 'celestia'
          projectId: ProjectId
          config: CelestiaDaTrackingConfig | { type: 'baseLayer' }
        }[]
      | {
          configurationId: string
          type: 'avail'
          projectId: ProjectId
          config: AvailDaTrackingConfig | { type: 'baseLayer' }
        }[],
  ) {}

  generateRecords(
    blobs: DaBlob[],
    previousRecords: DataAvailabilityRecord[],
  ): DataAvailabilityRecord[] {
    const updatedRecords = [...previousRecords]

    const addOrMerge = (record: DataAvailabilityRecord) => {
      const existing = updatedRecords.find(
        (r) =>
          r.timestamp.toNumber() === record.timestamp.toNumber() &&
          r.configurationId === record.configurationId,
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
        case 'ethereum': {
          assert(blob.type === 'ethereum')
          if (c.config.type === 'baseLayer') {
            records.push({
              configurationId: c.configurationId,
              projectId: c.projectId,
              daLayer: blob.daLayer,
              timestamp: blob.blockTimestamp.toStartOf('day'),
              totalSize: blob.size,
            })
          } else {
            if (matchEthereumProject(blob, c.config)) {
              records.push({
                configurationId: c.configurationId,
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
          assert(blob.type === 'celestia')
          if (c.config.type === 'baseLayer') {
            records.push({
              configurationId: c.configurationId,
              projectId: c.projectId,
              daLayer: blob.daLayer,
              timestamp: blob.blockTimestamp.toStartOf('day'),
              totalSize: blob.size,
            })
          } else {
            if (matchCelestiaProject(blob, c.config)) {
              records.push({
                configurationId: c.configurationId,
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
          assert(blob.type === 'avail')
          if (c.config.type === 'baseLayer') {
            records.push({
              configurationId: c.configurationId,
              projectId: c.projectId,
              daLayer: blob.daLayer,
              timestamp: blob.blockTimestamp.toStartOf('day'),
              totalSize: blob.size,
            })
          } else {
            if (matchAvailProject(blob, c.config)) {
              records.push({
                configurationId: c.configurationId,
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
  const hasInboxMatch = config.inbox === blob.inbox

  if (!config.sequencers || config.sequencers.length === 0) {
    return hasInboxMatch
  }

  const hasMatchingSequencer = config.sequencers.some(
    (sequencer) => sequencer === blob.sequencer,
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
