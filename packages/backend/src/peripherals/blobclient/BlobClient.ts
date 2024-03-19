import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { utils } from 'ethers'
import { z } from 'zod'

import { RpcClient } from '../rpcclient/RpcClient'

export class BlobClient {
  constructor(
    private readonly beaconApiUrl: string,
    private readonly rpcClient: RpcClient,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
    const rateLimiter = new RateLimiter({
      // TODO: should be configurable
      callsPerMinute: 60,
    })
    this.call = rateLimiter.wrap(this.call.bind(this))
  }

  async getRelevantBlobs(txHash: string) {
    const tx = await this.rpcClient.getTransaction(txHash.toString())
    const txWithBlobs = TxWithBlobsSchema.parse(tx)

    const blockSidecar = await this.getBlockSidecar(txWithBlobs.blockNumber)
    const relevantBlobs = filterOutIrrelexant(
      blockSidecar,
      txWithBlobs.blobVersionedHashes,
    )

    return relevantBlobs
  }

  private async getBlockSidecar(blockNumber: number) {
    const blockId = await this.getBeaconBlockId(blockNumber)
    const endpoint = `/eth/v1/beacon/blob_sidecars/${blockId}`

    const response = await this.call(endpoint)
    const parsed = BlockSidecarSchema.parse(response)

    return parsed.data
  }

  private async call(endpoint: string) {
    const url = `${this.beaconApiUrl}${endpoint}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    })
    const json = await response.json()
    return json
  }

  // this is very hacky, but it's the only way i know to get the beacon block id
  // if you know a better way, please fix it
  private async getBeaconBlockId(blockNumber: number) {
    const childBlock = await this.rpcClient.getBlock(blockNumber + 1)
    const parsedBlock = BlockWithParentBeaconBlockRootSchema.parse(childBlock)
    return parsedBlock.parentBeaconBlockRoot
  }
}

function filterOutIrrelexant(
  sidecarData: BlockSidecar['data'],
  relevantBlobVersionedHashes: string[],
) {
  return sidecarData.filter((blob) =>
    relevantBlobVersionedHashes.includes(
      kzgCommitmentToVersionedHash(blob.kzg_commitment),
    ),
  )
}

function kzgCommitmentToVersionedHash(commitment: string) {
  return '0x01' + utils.sha256(commitment).substring(4)
}

const BlockSidecarSchema = z.object({
  data: z.array(
    z.object({
      kzg_commitment: z.string(),
      blob: z.string(),
    }),
  ),
})
type BlockSidecar = z.infer<typeof BlockSidecarSchema>

const TxWithBlobsSchema = z.object({
  blockNumber: z.number(),
  blobVersionedHashes: z.array(z.string()),
})

const BlockWithParentBeaconBlockRootSchema = z.object({
  parentBeaconBlockRoot: z.string(),
})
