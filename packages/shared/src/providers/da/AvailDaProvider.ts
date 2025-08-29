import { UnixTime } from '@l2beat/shared-pure'
import type { PolkadotRpcClient } from '../../clients/rpc-polkadot/PolkadotRpcClient'
import type { DaBlobProvider } from './DaProvider'
import type { AvailBlob } from './types'

const TIMESTAMP_SHIFT = 4300
const DATA_EXTRINSIC_SHIFT = 236

export class AvailDaProvider implements DaBlobProvider {
  constructor(
    private readonly rpcClient: PolkadotRpcClient,
    readonly daLayer: string,
  ) {}

  async getBlobs(from: number, to: number): Promise<AvailBlob[]> {
    const promises = []
    for (let i = from; i <= to; i++) {
      promises.push(this.getBlobsFromBlock(i))
    }
    const blobArrays = await Promise.all(promises)
    return blobArrays.flat()
  }

  private async getBlobsFromBlock(blockNumber: number): Promise<AvailBlob[]> {
    const blobs: AvailBlob[] = []

    const block = await this.rpcClient.getBlock(blockNumber)

    if (
      !block.extrinsics ||
      block.extrinsics.length < 2 ||
      block.header.extension.V3.appLookup.index.length === 0
    ) {
      return []
    }

    const number = Number(block.header.number)
    const timestamp = this.calculateAvailTimestamp(number)

    // extrinsics are in reverse order
    const targetExtrinsics = block.extrinsics
      .filter((ex) => {
        // Get first 32 bytes (64 characters since hex is 2 chars per byte)
        return ex.substring(0, 64).includes('8400')
      })
      .reverse()

    const appIndex = block.header.extension.V3.appLookup.index

    if (targetExtrinsics.length === 0) {
      return []
    }

    for (let i = 0; i < targetExtrinsics.length; i++) {
      const sizeInBytes =
        (targetExtrinsics[i].length - DATA_EXTRINSIC_SHIFT) / 2

      // If we have more extrinsics than appIds, assign the extra ones to the last appId
      const appIdIndex = i < appIndex.length ? i : appIndex.length - 1

      blobs.push({
        type: 'avail',
        daLayer: this.daLayer,
        blockTimestamp: timestamp,
        blockNumber: number,
        size: BigInt(sizeInBytes),
        appId: appIndex[appIdIndex].appId.toString(),
      })
    }

    return blobs
  }

  private calculateAvailTimestamp(blockNumber: number): UnixTime {
    const referenceBlock = 1
    const referenceTimestamp = 1720082320

    // Define the block time interval in milliseconds (20 seconds)
    const blockInterval = 20 // 20 seconds

    // Calculate the difference in blocks
    const blockDifference = blockNumber - referenceBlock

    // Calculate the timestamp by adding the time difference to the reference timestamp
    const timestamp =
      referenceTimestamp + blockDifference * blockInterval + TIMESTAMP_SHIFT

    return UnixTime(timestamp)
  }
}
