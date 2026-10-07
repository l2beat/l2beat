import { assert, type UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type {
  BeaconChainBlob,
  BeaconChainClient,
  EVMBlockWithTransactions,
  EVMLog,
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
    const blockNumbers = Array.from(
      { length: to - from + 1 },
      (_, i) => from + i,
    )
    const [blocks, logs] = await Promise.all([
      Promise.all(blockNumbers.map((n) => this.rpcClient.getBlock(n, true))),
      // to be able to track internal call we need to get logs
      this.rpcClient.getLogs(from, to),
    ])
    return blocks.map((block) => toBlobBlock(block, logs))
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

function toBlobBlock(
  block: EVMBlockWithTransactions,
  logs: EVMLog[],
): EthereumBlobBlock {
  const batches: EthereumBlobBatch[] = []
  block.transactions.forEach((tx, txIndex) => {
    // Skip blob processing for type 2 transactions
    if (Number(tx.type) === 2 || !tx.blobVersionedHashes) {
      return
    }

    const txLogs = logs.filter((l) => l.transactionHash === tx.hash)
    batches.push({
      txIndex,
      txHash: tx.hash,
      from: tx.from,
      to: tx.to ?? '',
      topics: txLogs.flatMap((log) => log.topics),
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
