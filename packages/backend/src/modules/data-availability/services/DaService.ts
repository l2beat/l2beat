import type {
  AvailDaTrackingConfig,
  CelestiaDaTrackingConfig,
  EthereumDaTrackingConfig,
  ProjectDaTrackingConfig,
} from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import type {
  AvailBlob,
  CelestiaBlob,
  DaBlob,
  EthereumBlob,
} from '@l2beat/shared'
import type { ProjectId } from '@l2beat/shared-pure'

export class DaService {
  readonly mappedConfig: {
    ethereum: {
      id: ProjectId
      config: EthereumDaTrackingConfig
    }[]
    celestia: {
      id: ProjectId
      config: CelestiaDaTrackingConfig
    }[]
    avail: {
      id: ProjectId
      config: AvailDaTrackingConfig
    }[]
  }

  constructor(
    config: {
      id: ProjectId
      config: ProjectDaTrackingConfig
    }[],
  ) {
    this.mappedConfig = {
      ethereum: config
        .filter((entry) => entry.config.type === 'ethereum')
        .map((entry) => ({
          id: entry.id,
          config: entry.config as EthereumDaTrackingConfig,
        })),
      celestia: config
        .filter((entry) => entry.config.type === 'celestia')
        .map((entry) => ({
          id: entry.id,
          config: entry.config as CelestiaDaTrackingConfig,
        })),
      avail: config
        .filter((entry) => entry.config.type === 'avail')
        .map((entry) => ({
          id: entry.id,
          config: entry.config as AvailDaTrackingConfig,
        })),
    }
  }

  generateRecords(
    blobs: DaBlob[],
    previousRecords: DataAvailabilityRecord[],
  ): DataAvailabilityRecord[] {
    const updatedRecords = [...previousRecords]

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
      projectId: blob.daLayer,
      daLayer: blob.daLayer,
      timestamp: blob.blockTimestamp.toStartOf('day'),
      totalSize: blob.size,
    }

    let projectId = undefined

    switch (blob.type) {
      case 'ethereum':
        projectId = this.mappedConfig.ethereum.find((entry) =>
          matchEthereumProject(blob, entry.config),
        )?.id
        break
      case 'celestia':
        projectId = this.mappedConfig.celestia.find((entry) =>
          matchCelestiaProject(blob, entry.config),
        )?.id
        break
      case 'avail':
        projectId = this.mappedConfig.avail.find((entry) =>
          matchAvailProject(blob, entry.config),
        )?.id
        break
    }

    const projectRecord = projectId
      ? {
          projectId,
          daLayer: blob.daLayer,
          timestamp: blob.blockTimestamp.toStartOf('day'),
          totalSize: blob.size,
        }
      : undefined

    return [daLayerRecord, projectRecord]
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
