import type { json } from '@l2beat/shared-pure'
import type { v } from '@l2beat/validate'
import { Readable } from 'stream'
import { chain } from 'stream-chain'
import { parser } from 'stream-json'
import { pick } from 'stream-json/filters/Pick'
import { streamValues } from 'stream-json/streamers/StreamValues'

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
    stateId:
      | 'head'
      | 'genesis'
      | 'finalized'
      | 'justified'
      | 'slot'
      | `0x${string}`
    status?: string[]
  }) {
    const endpoint = `eth/v1/beacon/states/${stateId}/validators?${new URLSearchParams(
      status ? { status: status.join(',') } : {},
    ).toString()}`

    const { sum, count } = await this.sumStreamed(
      endpoint,
      /^data\.\d+\.balance/,
    )
    return {
      // gwei to wei
      totalStake: sum * 10n ** 9n,
      numberOfValidators: count,
    }
  }

  /** Sum of every validator's balance at a state, in wei. */
  async getTotalBalance(slot: number): Promise<bigint> {
    const { sum } = await this.sumStreamed(
      `eth/v1/beacon/states/${slot}/validator_balances`,
      /^data\.\d+\.balance/,
    )
    return sum * 10n ** 9n
  }

  /**
   * Sum of the deposits waiting to be credited at a state, in wei. The queue
   * exists only since Electra.
   */
  async getPendingDepositsAmount(slot: number): Promise<bigint> {
    const { sum } = await this.sumStreamed(
      `eth/v1/beacon/states/${slot}/pending_deposits`,
      /^data\.\d+\.amount/,
    )
    return sum * 10n ** 9n
  }

  /**
   * Streams a response and sums the integers at the paths matching `filter`,
   * so a response of hundreds of megabytes is never held in memory.
   */
  private async sumStreamed(
    endpoint: string,
    filter: RegExp,
  ): Promise<{ sum: bigint; count: number }> {
    const response = await this.$.http.fetchRaw(
      `${this.$.beaconApiUrl}${endpoint}`,
      { timeout: this.$.timeout },
    )

    if (!response.ok) {
      await response.body?.cancel()
      this.$.logger.warn('Invalid response', {
        endpoint,
        response: JSON.stringify(response),
      })
      throw new Error('BeaconChain request failed', {
        cause: { endpoint, status: response.status },
      })
    }

    if (!response.body) {
      throw new Error('BeaconChain response has no body', {
        cause: { endpoint },
      })
    }

    // Native fetch returns a Web stream; stream-chain only accepts Node streams
    const pipeline = chain([
      Readable.fromWeb(response.body),
      parser(),
      pick({ filter }),
      streamValues(),
    ])

    let sum = 0n
    let count = 0
    for await (const { value } of pipeline) {
      sum += BigInt(value)
      count++
    }
    return { sum, count }
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
