import type { DataAvailabilityRecord } from '@l2beat/database'
import type { DaBlob } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import type { BlockDaIndexedConfig } from '../../../config/Config'
import { matchEthereumConfigs } from './matchEthereumConfigs'

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
    return configurations
      .filter((c) => matchesConfiguration(blob, c))
      .map((c) => ({
        timestamp: UnixTime.toStartOf(blob.blockTimestamp, 'hour'),
        daLayer: blob.daLayer,
        projectId: c.projectId,
        configurationId: c.configurationId,
        totalSize: blob.size,
      }))
  }
}

function matchesConfiguration(blob: DaBlob, c: BlockDaIndexedConfig) {
  return c.type === 'baseLayer'
    ? blob.daLayer === c.daLayer
    : matchEthereumConfigs([c], blob.blockNumber, blob).length > 0
}
