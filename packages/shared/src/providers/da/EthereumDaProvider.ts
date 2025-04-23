import { assert, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type {
  BeaconChainBlob,
  BeaconChainClient,
  BlobScanClient,
  RpcClient,
} from '../../clients'
import type { DaBlobProvider } from './DaProvider'
import type { EthereumBlob } from './types'

// each blob is 128 KiB so 131,072 B
const BLOB_SIZE_BYTES = 131072n
const BEACON_CHAIN_GENESIS_TIMESTAMP = 1606824023

export class EthereumDaProvider implements DaBlobProvider {
  constructor(
    private readonly blobScanClient: BlobScanClient,
    private readonly beaconChainClient: BeaconChainClient,
    private readonly rpcClient: RpcClient,
    readonly daLayer: string,
  ) {}

  async getBlobs(from: number, to: number): Promise<EthereumBlob[]> {
    const blobScanResult = await this.blobScanClient.getBlobs(from, to)

    if (blobScanResult.length > 0) {
      return blobScanResult.map((blob) => ({
        type: 'ethereum',
        daLayer: this.daLayer,
        blockTimestamp: UnixTime.fromDate(new Date(blob.blockTimestamp)),
        size: BLOB_SIZE_BYTES,
        inbox: blob.transaction.to,
        sequencer: blob.transaction.from,
      }))
    }

    // fallback to RPC + beacon chain
    const getBlobs = []
    for (let blockNumber = from; blockNumber <= to; blockNumber++) {
      getBlobs.push(this.getBlobsFromBeaconChain(blockNumber))
    }

    return (await Promise.all(getBlobs)).flat()
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

  private async getBlobsFromBeaconChain(
    blockNumber: number,
  ): Promise<EthereumBlob[]> {
    const block = await this.rpcClient.getBlock(blockNumber, true)
    const slot = await this.getBeaconSlot(block.timestamp)
    const blockSidecar = await this.beaconChainClient.getBlockSidecar(
      slot.toString(),
    )

    const blobs: EthereumBlob[] = []
    for (const tx of block.transactions) {
      // Skip blob processing for type 2 transactions
      if (Number(tx.type) === 2 || !tx.blobVersionedHashes) {
        continue
      }

      const relevantBlobs = filterOutIrrelevant(
        blockSidecar,
        tx.blobVersionedHashes,
      )

      relevantBlobs.forEach(() =>
        blobs.push({
          type: 'ethereum',
          daLayer: this.daLayer,
          blockTimestamp: block.timestamp,
          size: BLOB_SIZE_BYTES,
          inbox: tx.to ?? '',
          sequencer: tx.from,
        }),
      )
    }

    return blobs
  }

  private getBeaconSlot(blockTimestamp: number): number {
    return (blockTimestamp - BEACON_CHAIN_GENESIS_TIMESTAMP) / 12
  }

  // this is very hacky, but it's the only way i know to get the beacon block id
  // if you know a better way, please fix it
  private async getBeaconBlockId(blockNumber: number): Promise<string> {
    return await this.rpcClient.getBlockParentBeaconRoot(blockNumber + 1)
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
