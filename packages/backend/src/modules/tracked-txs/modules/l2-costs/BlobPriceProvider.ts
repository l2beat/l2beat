import type { Logger } from '@l2beat/backend-tools'
import type { IRpcClient } from '@l2beat/shared'

export class BlobPriceProvider {
  private readonly maxBlocksPerRequest = 1000
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

    // Calculate all chunk parameters upfront
    const chunkParams: Array<{ blockCount: number; newestBlock: number }> = []
    let currentNewestBlock = newestBlock

    while (currentNewestBlock >= oldestBlock) {
      const remainingBlocks = currentNewestBlock - oldestBlock + 1
      const blockCount = Math.min(remainingBlocks, this.maxBlocksPerRequest)

      chunkParams.push({
        blockCount,
        newestBlock: currentNewestBlock,
      })

      // Move to the next chunk: subtract the actual blockCount used
      currentNewestBlock -= blockCount
    }

    this.logger.info('Getting blob prices', {
      newestBlock,
      oldestBlock,
      blocksCount,
      chunks: chunkParams.map((p) => ({
        blockCount: p.blockCount,
        newestBlock: p.newestBlock,
      })),
    })

    // Execute all RPC calls in parallel
    const feeHistories = await Promise.all(
      chunkParams.map((params) =>
        this.ethRpcClient.getFeeHistory(
          params.blockCount,
          params.newestBlock,
          [],
        ),
      ),
    )

    // Process all results and merge into map
    const blobPriceByBlock = new Map<number, bigint>()

    for (const feeHistory of feeHistories) {
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
    }

    return blobPriceByBlock
  }
}
