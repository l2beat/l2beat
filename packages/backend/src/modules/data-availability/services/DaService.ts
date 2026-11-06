import type { DataAvailabilityRecord } from '@l2beat/database'
import type { DaBlob } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import type { BlockDaIndexedConfig } from '../../../config/Config'
import { matchEthereumConfigs } from './matchEthereumConfigs'

export class DaService {
  /**
   * `blobBaseFees`, wei per blob gas by block number, prices the blobs of
   * layers that charge for blob gas, Ethereum alone so far: the records of
   * the others carry no fee
   */
  generateRecords(
    blobs: DaBlob[],
    previousRecords: DataAvailabilityRecord[],
    configurations: BlockDaIndexedConfig[],
    blobBaseFees?: Map<number, bigint>,
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
        existing.totalFeeEth = sumFees(existing.totalFeeEth, record.totalFeeEth)
      } else {
        updatedRecords.push(record)
      }
    }

    for (const blob of blobs) {
      const totalFeeEth = blobBaseFees ? feeEth(blob, blobBaseFees) : null
      const records = this.createRecordsFromBlob(
        blob,
        configurations,
        totalFeeEth,
      )
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
    totalFeeEth: number | null,
  ): DataAvailabilityRecord[] {
    return configurations
      .filter((c) => matchesConfiguration(blob, c))
      .map((c) => ({
        timestamp: UnixTime.toStartOf(blob.blockTimestamp, 'hour'),
        daLayer: blob.daLayer,
        projectId: c.projectId,
        configurationId: c.configurationId,
        totalSize: blob.size,
        totalFeeEth,
      }))
  }
}

const WEI_PER_ETH = 1e18

/** What the blob cost at its block's blob base fee */
function feeEth(blob: DaBlob, blobBaseFees: Map<number, bigint>): number {
  const blobBaseFee = blobBaseFees.get(blob.blockNumber)
  assert(blobBaseFee !== undefined, 'No blob base fee for the block', {
    blockNumber: blob.blockNumber,
  })
  return Number(blob.size * blobBaseFee) / WEI_PER_ETH
}

/** A record indexed before fees were tracked keeps the fees of the blobs added since, whole */
function sumFees(existing: number | null, added: number | null): number | null {
  if (added === null) return existing
  return (existing ?? 0) + added
}

function matchesConfiguration(blob: DaBlob, c: BlockDaIndexedConfig) {
  return c.type === 'baseLayer'
    ? blob.daLayer === c.daLayer
    : matchEthereumConfigs([c], blob.blockNumber, blob).length > 0
}
