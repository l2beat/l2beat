import type {
  AvailDaTrackingConfig,
  CelestiaDaTrackingConfig,
  EthereumDaTrackingConfig,
  ProjectDaTrackingConfig,
} from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import type { DaBlob } from '@l2beat/shared'
import { ProjectId } from '@l2beat/shared-pure'

export class DaService {
  constructor(
    private readonly projectConfigs: {
      id: ProjectId
      config: ProjectDaTrackingConfig
    }[],
  ) {}

  processBlobs(
    blobs: DaBlob[],
    records: DataAvailabilityRecord[],
  ): DataAvailabilityRecord[] {
    const updatedRecords = [...records]

    const addOrMerge = (record: DataAvailabilityRecord) => {
      const existing = updatedRecords.find(
        (r) =>
          r.timestamp.toNumber() === record.timestamp.toNumber() &&
          r.projectId === record.projectId,
      )
      if (existing) {
        existing.totalSize += record.totalSize
      } else {
        updatedRecords.push(record)
      }
    }

    for (const blob of blobs) {
      const [daLayerRecord, projectRecord] = this.createRecordFromBlob(blob)
      // DA layer record is always created
      addOrMerge(daLayerRecord)
      // project record is created only if we could match to one of the tracked projects
      if (projectRecord) addOrMerge(projectRecord)
    }

    return updatedRecords
  }

  private createRecordFromBlob(
    blob: DaBlob,
  ): [DataAvailabilityRecord, DataAvailabilityRecord | undefined] {
    const daLayerRecord: DataAvailabilityRecord = {
      projectId: ProjectId(blob.type),
      timestamp: blob.blockTimestamp.toStartOf('day'),
      totalSize: blob.size,
    }

    const matchEthereumProject = (config: ProjectDaTrackingConfig): boolean => {
      if (blob.type !== 'ethereum') return false

      const ethereumConfig = config as EthereumDaTrackingConfig

      const hasInboxMatch = ethereumConfig.inbox === blob.inbox

      if (!ethereumConfig.sequencers || ethereumConfig.sequencers.length > 0) {
        return hasInboxMatch
      }

      const hasMatchingSequencer = ethereumConfig.sequencers.some(
        (sequencer) => sequencer === blob.sequencer,
      )

      return hasInboxMatch && hasMatchingSequencer
    }

    const matchAvailProject = (config: ProjectDaTrackingConfig): boolean => {
      if (blob.type !== 'avail') return false

      const availConfig = config as AvailDaTrackingConfig

      return availConfig.appId === blob.appId
    }

    const matchCelestiaProject = (config: ProjectDaTrackingConfig): boolean => {
      if (blob.type !== 'celestia') return false

      const availConfig = config as CelestiaDaTrackingConfig

      return availConfig.namespace === blob.namespace
    }

    let projectId = undefined

    switch (blob.type) {
      case 'ethereum':
        projectId = this.projectConfigs.find((entry) =>
          matchEthereumProject(entry.config),
        )?.id
        break
      case 'avail':
        projectId = this.projectConfigs.find((entry) =>
          matchAvailProject(entry.config),
        )?.id
        break
      case 'celestia':
        projectId = this.projectConfigs.find((entry) =>
          matchCelestiaProject(entry.config),
        )?.id
        break
    }

    const projectRecord = projectId
      ? {
          projectId,
          timestamp: blob.blockTimestamp.toStartOf('day'),
          totalSize: blob.size,
        }
      : undefined

    return [daLayerRecord, projectRecord]
  }
}
