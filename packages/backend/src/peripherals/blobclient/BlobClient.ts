import { assert, Logger, RateLimiter } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { stringAsInt } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { z } from 'zod'

type BlobClientOptions = {
  callsPerMinute: number | undefined
  timeout: number | undefined
}

export class BlobClient {
  timeout: number

  static BLOB_TX_TYPE = 3

  constructor(
    private readonly beaconApiUrl: string,
    private readonly rpcUrl: string,
    private readonly httpClient: HttpClient,
    private readonly logger: Logger,
    options: BlobClientOptions,
  ) {
    this.logger = this.logger.for(this)
    this.timeout = options.timeout ?? 10_000
    const rateLimiter = new RateLimiter({
      callsPerMinute: options.callsPerMinute ?? 60,
    })
    this.call = rateLimiter.wrap(this.call.bind(this))
    this.callRpc = rateLimiter.wrap(this.callRpc.bind(this))
  }

  static create(
    services: {
      httpClient: HttpClient
      logger: Logger
    },
    options: {
      beaconApiUrl: string
      rpcUrl: string
      callsPerMinute: number | undefined
      timeout: number | undefined
    },
  ) {
    return new BlobClient(
      options.beaconApiUrl,
      options.rpcUrl,
      services.httpClient,
      services.logger,
      options,
    )
  }

  async getTxWithRelevantBlobs(txHash: string) {
    const tx = await this.getTransaction(txHash.toString())

    if (tx.type !== BlobClient.BLOB_TX_TYPE) {
      return { ...tx, relevantBlobs: [] }
    }

    const blockSidecar = await this.getBlockSidecar(tx.blockNumber)
    assert(tx.blobVersionedHashes, 'Blob transaction without blob hashes')

    const relevantBlobs = filterOutIrrelevant(
      blockSidecar,
      tx.blobVersionedHashes,
    )

    return { ...tx, relevantBlobs }
  }

  private async getBlockSidecar(blockNumber: number) {
    const blockId = await this.getBeaconBlockId(blockNumber)
    const endpoint = `eth/v1/beacon/blob_sidecars/${blockId}`

    const response = await this.call(endpoint)
    const parsed = BlockSidecarSchema.parse(response)

    return parsed.data
  }

  private async call(endpoint: string) {
    const url = `${this.beaconApiUrl}${endpoint}`

    const response = await this.httpClient.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'gzip',
      },
      timeout: this.timeout,
    })
    const json = (await response.json()) as unknown
    return json
  }

  private async getTransaction(txHash: string) {
    const result = await this.callRpc('eth_getTransactionByHash', [txHash])

    return TxWithBlobsSchema.parse(result)
  }

  private async getBlock(blockNumber: number) {
    this.logger.debug('Getting block ' + blockNumber, { blockNumber })
    const result = await this.callRpc('eth_getBlockByNumber', [
      '0x' + blockNumber.toString(16),
      false,
    ])
    const parsed = BlockWithParentBeaconBlockRootSchema.safeParse(result)

    if (!parsed.success) {
      this.logger.error('Error downloading block', {
        blockNumber,
        error: parsed.error,
        result,
      })
      throw parsed.error
    }

    return parsed.data
  }

  private async callRpc(method: string, params?: (string | boolean)[]) {
    const id = Math.floor(Math.random() * 1000)
    const response = await this.httpClient.fetch(this.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id,
        method,
        params,
      }),
    })

    const json = (await response.json()) as unknown
    const parsed = RpcResultSchema.parse(json)
    return parsed.result
  }

  // this is very hacky, but it's the only way i know to get the beacon block id
  // if you know a better way, please fix it
  private async getBeaconBlockId(blockNumber: number) {
    const childBlock = await this.getBlock(blockNumber + 1)
    const parsedBlock = BlockWithParentBeaconBlockRootSchema.parse(childBlock)
    return parsedBlock.parentBeaconBlockRoot
  }
}

function filterOutIrrelevant(
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
  blockNumber: stringAsInt(),
  blobVersionedHashes: z.array(z.string()).optional(),
  type: stringAsInt(),
  input: z.string(),
  hash: z.string(),
})

const BlockWithParentBeaconBlockRootSchema = z.object({
  parentBeaconBlockRoot: z.string(),
})

const RpcResultSchema = z.object({
  result: z.unknown(),
})
