import type { Logger } from '@l2beat/backend-tools'
import type { IRpcClient } from '@l2beat/shared'

export class BlobPriceProvider {
  constructor(
    private readonly logger: Logger,
    private readonly ethRpcClient: IRpcClient,
  ) {
    this.logger = this.logger.for(this)
  }

  async getBlobPricesByBlockRange(
    blockRange: [number, number],
  ): Promise<Map<number, bigint>> {
    const [oldestBlock, newestBlock] = blockRange

    if (oldestBlock > newestBlock) {
      return new Map()
    }

    const blockDiff = newestBlock - oldestBlock
    const blocksCount = blockDiff + 1

    this.logger.info('Getting blob base fees', {
      newestBlock,
      oldestBlock,
      blocksCount,
    })

    const blobPriceByBlock = new Map<number, bigint>()
    const MAX_BLOCKS_PER_REQUEST = 1000

    let currentNewestBlock = newestBlock

    while (currentNewestBlock >= oldestBlock) {
      const remainingBlocks = currentNewestBlock - oldestBlock + 1
      const blockCount = Math.min(remainingBlocks, MAX_BLOCKS_PER_REQUEST)

      this.logger.info('Getting blob prices', {
        blockCount,
        newestBlock: currentNewestBlock,
      })

      const feeHistory = await this.ethRpcClient.getFeeHistory(
        blockCount,
        currentNewestBlock,
        [],
      )

      let blockNumber = feeHistory.oldestBlock
      for (const blobBaseFee of feeHistory.baseFeePerBlobGas) {
        if (
          blobBaseFee !== 0n &&
          blockNumber >= oldestBlock &&
          blockNumber <= newestBlock
        ) {
          if (blobPriceByBlock.has(blockNumber)) {
            throw new Error(
              `Blob price for block ${blockNumber} was already set. This indicates overlapping ranges or duplicate processing.`,
            )
          }
          blobPriceByBlock.set(blockNumber, blobBaseFee)
        }
        blockNumber++
      }

      currentNewestBlock = feeHistory.oldestBlock - 1
    }

    return blobPriceByBlock
  }
}
