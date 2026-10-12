import { assert, type UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'
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
} from './types'

// each blob is 128 KiB so 131,072 B
export const ETHEREUM_BLOB_SIZE_BYTES = 131072n

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

  async getBlobsByVersionedHashesAndBlockNumber(
    blobVersionedHashes: string[],
    blockNumber: number,
  ): Promise<BeaconChainBlob[]> {
    const blockId = await this.getBeaconBlockId(blockNumber)
    const blockSidecar = await this.beaconChainClient.getBlockSidecar(blockId)
    return filterOutIrrelevant(blockSidecar, blobVersionedHashes)
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
    const blockSidecar = await this.beaconChainClient.getBlockSidecar(blockId)

    return filterOutIrrelevant(blockSidecar, tx.blobVersionedHashes)
  }

  // this is very hacky, but it's the only way i know to get the beacon block id
  // if you know a better way, please fix it
  private async getBeaconBlockId(blockNumber: number): Promise<string> {
    return await this.rpcClient.getBlockParentBeaconRoot(blockNumber + 1)
  }
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

function filterOutIrrelevant(
  sidecarData: BeaconChainBlob[],
  relevantBlobVersionedHashes: string[],
): BeaconChainBlob[] {
  return sidecarData.filter((blob) =>
    relevantBlobVersionedHashes.includes(
      kzgCommitmentToVersionedHash(blob.kzg_commitment),
    ),
  )
}

function kzgCommitmentToVersionedHash(commitment: string): string {
  return '0x01' + utils.sha256(commitment).substring(4)
}
