import { assert, slotAt, slotStart, type UnixTime } from '@l2beat/shared-pure'
import type {
  BeaconChainBlob,
  BeaconChainClient,
  EVMBlockWithTransactions,
  EVMLog,
  EVMTransaction,
} from '../../clients'
import type { IRpcClient } from '../../clients2'
import type { DaBlobProvider } from './DaProvider'
import type {
  EthereumBlob,
  EthereumBlobBatch,
  EthereumBlobBlock,
  EthereumBlockFee,
} from './types'

// each blob is 128 KiB so 131,072 B
export const ETHEREUM_BLOB_SIZE_BYTES = 131072n
/** Most blocks eth_feeHistory answers for at once: nodes cap it at 1024 */
const FEE_HISTORY_BLOCKS = 1000

export class EthereumDaProvider implements DaBlobProvider {
  constructor(
    private readonly beaconChainClient: BeaconChainClient,
    private readonly rpcClient: IRpcClient,
    readonly daLayer: string,
  ) {}

  async getBlobs(from: number, to: number): Promise<EthereumBlob[]> {
    const blocks = await this.getBlocksWithBlobBatches(from, to)
    return blocks.flatMap((block) =>
      block.batches.flatMap((batch) =>
        Array.from({ length: batch.blobs }, () => ({
          type: 'ethereum' as const,
          daLayer: this.daLayer,
          blockTimestamp: block.timestamp,
          blockNumber: block.number,
          size: ETHEREUM_BLOB_SIZE_BYTES,
          inbox: batch.to,
          sequencer: batch.from,
          topics: batch.topics,
        })),
      ),
    )
  }

  /** Every block of the range, both ends included, blobs or not */
  async getBlocksWithBlobBatches(
    from: number,
    to: number,
  ): Promise<EthereumBlobBlock[]> {
    const [blocks, logs] = await Promise.all([
      this.getBlocks(from, to),
      // to be able to track internal call we need to get logs
      this.rpcClient.getLogs(from, to),
    ])
    assertLogsOfBlocks(blocks, logs)
    return blocks.map((block) =>
      toBlobBlock(block, (txHash) =>
        logs
          .filter((log) => log.transactionHash === txHash)
          .flatMap((log) => log.topics),
      ),
    )
  }

  /**
   * As `getBlocksWithBlobBatches`, with the topics from the receipts of the
   * blob transactions alone: a small batch request per block in place of
   * every log of the range, so it suits the newest blocks, not long ranges.
   * Some RPCs answer logs from an index that trails their head; a receipt the
   * node has not got yet throws instead, and the caller asks again. One batch
   * rather than a call per transaction: a rate-limited client spaces calls
   * out, and the last of six receipts would come half a second after the
   * block. Nor the block's receipts in one call: the node behind a load
   * balancer often has not got them yet, and they weigh near a megabyte
   */
  async getBlocksWithBlobBatchesFromReceipts(
    from: number,
    to: number,
  ): Promise<EthereumBlobBlock[]> {
    const blocks = await this.getBlocks(from, to)
    return await Promise.all(
      blocks.map(async (block) => {
        const topics = await this.getBlobTxTopics(block)
        return toBlobBlock(block, (txHash) => topics.get(txHash) ?? [])
      }),
    )
  }

  /** By transaction hash, from receipts of `block` and no other */
  private async getBlobTxTopics(
    block: EVMBlockWithTransactions,
  ): Promise<Map<string, string[]>> {
    const hashes = block.transactions.filter(isBlobTx).map((tx) => tx.hash)
    if (hashes.length === 0) return new Map()

    const receipts = await this.rpcClient.getTransactionReceipts(hashes)
    return new Map(
      receipts.map((receipt, i) => {
        assert(
          receipt.blockHash === block.hash,
          `Receipt of ${hashes[i]} is from another chain than block ${block.number}`,
        )
        return [hashes[i], receipt.logs.flatMap((log) => log.topics)]
      }),
    )
  }

  private getBlocks(from: number, to: number) {
    return Promise.all(
      Array.from({ length: to - from + 1 }, (_, i) =>
        this.rpcClient.getBlock(from + i, true),
      ),
    )
  }

  async getBlockTimestamp(blockNumber: number): Promise<UnixTime> {
    const block = await this.rpcClient.getBlock(blockNumber, false)
    return block.timestamp
  }

  /** Wei per blob gas of every block of the range, both ends included, by block number */
  async getBlobBaseFees(
    from: number,
    to: number,
  ): Promise<Map<number, bigint>> {
    const chunks = await this.getFeeHistory(from, to)
    return new Map(
      chunks.flatMap((chunk) =>
        chunk.blobBaseFee.map((fee, i) => [chunk.from + i, fee] as const),
      ),
    )
  }

  /**
   * Fees of every block of the range, both ends included. A header is fetched
   * only at the ends of each chunk of fee history and the timestamps in
   * between are interpolated, since the history carries none: a call per
   * block would cost a thousand times the calls
   */
  async getBlobFees(from: number, to: number): Promise<EthereumBlockFee[]> {
    const chunks = await this.getFeeHistory(from, to)
    return (
      await Promise.all(
        chunks.map(async (chunk) => {
          const [first, last] = await Promise.all([
            this.getBlockTimestamp(chunk.from),
            this.getBlockTimestamp(chunk.to),
          ])
          const timestampOf = interpolateSlots(
            chunk.from,
            chunk.to,
            first,
            last,
          )
          return chunk.blobBaseFee.map((blobBaseFee, i) => ({
            blockNumber: chunk.from + i,
            timestamp: timestampOf(chunk.from + i),
            blobBaseFee,
            baseFeePerGas: chunk.baseFeePerGas[i],
          }))
        }),
      )
    ).flat()
  }

  private async getFeeHistory(from: number, to: number): Promise<FeeChunk[]> {
    assert(from <= to, 'Empty block range', { from, to })
    const ranges: [number, number][] = []
    for (let start = from; start <= to; start += FEE_HISTORY_BLOCKS) {
      ranges.push([start, Math.min(start + FEE_HISTORY_BLOCKS - 1, to)])
    }
    return await Promise.all(
      ranges.map(async ([start, end]) => {
        const count = end - start + 1
        const history = await this.rpcClient.getFeeHistory(count, end, [])
        // The history ends with the fees of the block after the range
        assert(
          history.oldestBlock === start &&
            history.baseFeePerBlobGas.length >= count &&
            history.baseFeePerGas.length >= count,
          'Fee history does not cover the range',
          { start, end, oldestBlock: history.oldestBlock },
        )
        return {
          from: start,
          to: end,
          blobBaseFee: history.baseFeePerBlobGas.slice(0, count),
          baseFeePerGas: history.baseFeePerGas.slice(0, count),
        }
      }),
    )
  }

  async getBlobsByVersionedHashesAndBlockNumber(
    blobVersionedHashes: string[],
    blockNumber: number,
  ): Promise<BeaconChainBlob[]> {
    const blockId = await this.getBeaconBlockId(blockNumber)
    return await this.beaconChainClient.getBlobs(blockId, blobVersionedHashes)
  }

  async getRelevantBlobs(txHash: string): Promise<BeaconChainBlob[]> {
    const tx = await this.rpcClient.getTransaction(txHash)

    assert(tx.blockNumber, `Tx ${tx}: No pending txs allowed`)

    // Skip blob processing for type 2 transactions
    if (Number(tx.type) === 2) {
      return []
    }

    // For type 3 transactions, ensure blobVersionedHashes exists
    assert(
      tx.blobVersionedHashes,
      'Type 3 transaction missing blobVersionedHashes',
    )

    const blockId = await this.getBeaconBlockId(tx.blockNumber)
    return await this.beaconChainClient.getBlobs(
      blockId,
      tx.blobVersionedHashes,
    )
  }

  // this is very hacky, but it's the only way i know to get the beacon block id
  // if you know a better way, please fix it
  private async getBeaconBlockId(blockNumber: number): Promise<string> {
    return await this.rpcClient.getBlockParentBeaconRoot(blockNumber + 1)
  }
}

interface FeeChunk {
  from: number
  to: number
  blobBaseFee: bigint[]
  baseFeePerGas: bigint[]
}

/**
 * Blocks sit on the slot grid, so the timestamps between the two known ones
 * are spread evenly in slots, and a block lands on the slot nearest its share
 */
function interpolateSlots(
  from: number,
  to: number,
  first: UnixTime,
  last: UnixTime,
): (blockNumber: number) => UnixTime {
  const firstSlot = slotAt(first)
  const slotsPerBlock =
    to === from ? 0 : (slotAt(last) - firstSlot) / (to - from)
  return (blockNumber) =>
    slotStart(Math.round(firstSlot + (blockNumber - from) * slotsPerBlock))
}

/**
 * A load-balanced RPC can answer the two calls from nodes on either side of a
 * reorg, or the logs from one still behind the blocks: the batches would be
 * stored with another chain's topics, or none. The throw makes the caller ask again
 */
function assertLogsOfBlocks(
  blocks: EVMBlockWithTransactions[],
  logs: EVMLog[],
) {
  const hashes = new Map(blocks.map((b) => [b.number, b.hash]))
  for (const log of logs) {
    assert(
      hashes.get(log.blockNumber) === log.blockHash,
      `Log of block ${log.blockNumber} is from another chain than the block`,
    )
  }
  const withLogs = new Set(logs.map((l) => l.blockHash))
  for (const block of blocks) {
    assert(
      isEmptyBloom(block.logsBloom) || withLogs.has(block.hash),
      `Block ${block.number} has logs the logs response lacks`,
    )
  }
}

function isEmptyBloom(logsBloom: string) {
  return /^0x0*$/.test(logsBloom)
}

function toBlobBlock(
  block: EVMBlockWithTransactions,
  topicsOf: (txHash: string) => string[],
): EthereumBlobBlock {
  const batches: EthereumBlobBatch[] = []
  block.transactions.forEach((tx, txIndex) => {
    if (!isBlobTx(tx)) {
      return
    }
    batches.push({
      txIndex,
      txHash: tx.hash,
      from: tx.from,
      to: tx.to ?? '',
      topics: topicsOf(tx.hash),
      blobs: tx.blobVersionedHashes.length,
    })
  })

  return {
    number: block.number,
    hash: block.hash,
    parentHash: block.parentHash,
    timestamp: block.timestamp,
    batches,
  }
}

function isBlobTx(
  tx: EVMTransaction,
): tx is EVMTransaction & { blobVersionedHashes: string[] } {
  return Number(tx.type) !== 2 && !!tx.blobVersionedHashes
}
