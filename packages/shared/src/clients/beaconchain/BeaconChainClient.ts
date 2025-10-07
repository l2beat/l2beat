import type { json } from '@l2beat/shared-pure'
import type { v } from '@l2beat/validate'
import { chain } from 'stream-chain'
import { parser } from 'stream-json'
import { pick } from 'stream-json/filters/Pick'
import { streamValues } from 'stream-json/streamers/StreamValues'
import type { Hex } from 'viem'
import { createGzip } from 'zlib'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  BeaconChainError,
  type Blob as BlobSchema,
  BlockSidecarSchema,
} from './types'

export type BeaconChainBlob = v.infer<typeof BlobSchema>

interface Dependencies extends ClientCoreDependencies {
  beaconApiUrl: string
  timeout?: number
  generateId?: () => string
}

export class BeaconChainClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getBlockSidecar(blockId: string): Promise<BeaconChainBlob[]> {
    const endpoint = `eth/v1/beacon/blob_sidecars/${blockId}`

    const response = await this.call(endpoint)
    const parsed = BlockSidecarSchema.safeParse(response)

    if (!parsed.success) {
      this.$.logger.warn('Invalid response', {
        endpoint,
        response: JSON.stringify(response),
      })
      throw new Error(`Block: ${blockId}: Error during sidecar parsing`)
    }

    return parsed.data.data.map((blob) => ({
      kzg_commitment: blob.kzg_commitment,
      data: blob.blob,
    }))
  }

  async getValidatorsInfo({
    stateId,
    status,
  }: {
    stateId: 'head' | 'genesis' | 'finalized' | 'justified' | 'slot' | Hex
    status?: string[]
  }) {
    const endpoint = `eth/v1/beacon/states/${stateId}/validators?${new URLSearchParams(
      {
        ...(status ? { status: status.join(',') } : {}),
      },
    ).toString()}`

    const response = await this.$.http.fetchRaw(
      `${this.$.beaconApiUrl}${endpoint}`,
      {
        headers: {
          'Content-Type': 'gzip',
        },
      },
    )

    if (!response.ok) {
      this.$.logger.warn('Invalid response', {
        endpoint,
        response: JSON.stringify(response),
      })
      throw new Error(
        `BeaconChain getValidators request failed with status: ${response.status}`,
      )
    }

    const pipeline = chain([
      createGzip(),
      // biome-ignore lint/suspicious/noExplicitAny: the types don't match, but it should be fine
      response.body as any,
      parser(),
      pick({ filter: /^data\.\d+\.balance/ }),
      streamValues(),
    ])

    let effectiveBalance = 0n
    let numberOfValidators = 0

    for await (const { value } of pipeline) {
      // gwei to wei
      effectiveBalance += BigInt(value) * 10n ** 9n
      numberOfValidators++
    }

    return {
      totalStake: effectiveBalance,
      numberOfValidators,
    }
  }

  async call(endpoint: string): Promise<unknown> {
    const url = `${this.$.beaconApiUrl}${endpoint}`

    return await this.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'gzip',
      },
      timeout: this.$.timeout,
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = BeaconChainError.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        error: parsedError.data,
      })
      return { success: false }
    }

    return { success: true }
  }
}
