import type { json } from '@l2beat/shared-pure'
import type { v } from '@l2beat/validate'
import { Readable } from 'stream'
import { chain } from 'stream-chain'
import { parser } from 'stream-json'
import { pick } from 'stream-json/filters/Pick'
import { streamArray } from 'stream-json/streamers/StreamArray'
import { streamValues } from 'stream-json/streamers/StreamValues'

import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  BeaconChainError,
  type Blob as BlobSchema,
  BlobsSchema,
  ForkSchema,
  HeaderSchema,
  ValidatorSchema,
} from './types'

export type BeaconChainBlob = v.infer<typeof BlobSchema>

export interface BeaconValidator {
  pubkey: string
  /** For 0x01 and 0x02 credentials, the address withdrawals go to. */
  withdrawalAddress: string | undefined
  balanceGwei: bigint
}

export type BeaconStateId =
  | 'head'
  | 'genesis'
  | 'finalized'
  | 'justified'
  | number
  | `0x${string}`

interface Dependencies extends ClientCoreDependencies {
  beaconApiUrl: string
  timeout?: number
  generateId?: () => string
}

export class BeaconChainClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  /** In the block's order, which need not be that of `versionedHashes` */
  async getBlobs(
    blockId: string,
    versionedHashes: string[],
  ): Promise<BeaconChainBlob[]> {
    // Without the param the endpoint answers every blob of the block
    if (versionedHashes.length === 0) return []

    // The spec forbids repeating a hash, which a tx may do
    const query = [...new Set(versionedHashes)]
      .map((hash) => `versioned_hashes=${hash}`)
      .join('&')
    const endpoint = `eth/v1/beacon/blobs/${blockId}?${query}`

    const response = await this.call(endpoint)
    const parsed = BlobsSchema.safeParse(response)

    if (!parsed.success) {
      this.$.logger.warn('Invalid response', {
        endpoint,
        response: JSON.stringify(response),
      })
      throw new Error('Invalid blobs response', { cause: { blockId } })
    }

    // A beacon block without these blobs answers an empty list, not an error.
    // A blob posted twice in the block may come back twice, so count distinct
    // blobs: one per hash found
    if (new Set(parsed.data.data).size < new Set(versionedHashes).size) {
      throw new Error('Beacon node answered fewer blobs than asked for', {
        cause: {
          blockId,
          requested: versionedHashes.length,
          received: parsed.data.data.length,
        },
      })
    }

    return parsed.data.data.map((data) => ({ data }))
  }

  async getValidatorsInfo(stateId: BeaconStateId, status?: string[]) {
    // Commas unencoded, as the beacon API lists several statuses.
    const query = status ? `?status=${status.join(',')}` : ''
    const { wei, count } = await this.sumGwei(
      `eth/v1/beacon/states/${stateId}/validators${query}`,
      'balance',
    )
    return { totalStake: wei, numberOfValidators: count }
  }

  /** Every validator's balance at a state, summed in wei. */
  async getTotalBalance(stateId: BeaconStateId): Promise<bigint> {
    const { wei } = await this.sumGwei(
      `eth/v1/beacon/states/${stateId}/validator_balances`,
      'balance',
    )
    return wei
  }

  /**
   * Sum of the deposits waiting to be credited at a state, in wei. The queue
   * exists only since Electra.
   */
  async getPendingDepositsAmount(stateId: BeaconStateId): Promise<bigint> {
    const { wei } = await this.sumGwei(
      `eth/v1/beacon/states/${stateId}/pending_deposits`,
      'amount',
    )
    return wei
  }

  async getForkVersion(stateId: BeaconStateId): Promise<string> {
    const endpoint = `eth/v1/beacon/states/${stateId}/fork`
    const parsed = ForkSchema.safeParse(await this.call(endpoint))
    if (!parsed.success) {
      throw new Error('Invalid BeaconChain fork', { cause: { endpoint } })
    }
    return parsed.data.data.current_version
  }

  /**
   * How many deposits from the deposit contract a state has credited. From
   * Electra the counter stops at the first new deposit, as those are credited
   * in their own block. Only the start of the state is read, as the counter
   * comes before the validators.
   */
  async getDepositIndex(stateId: BeaconStateId): Promise<number> {
    for await (const value of this.stream(
      `eth/v2/debug/beacon/states/${stateId}`,
      'data.eth1_deposit_index',
    )) {
      return Number(value)
    }
    throw new Error('BeaconChain state has no deposit index', {
      cause: { stateId },
    })
  }

  /** The slot of a block, and the execution block it carries. */
  async getBlockNumbers(
    blockId: BeaconStateId,
  ): Promise<{ slot: number; blockNumber: number }> {
    const endpoint = `eth/v1/beacon/headers/${blockId}`
    const parsed = HeaderSchema.safeParse(await this.call(endpoint))
    if (!parsed.success) {
      throw new Error('Invalid BeaconChain header', { cause: { endpoint } })
    }
    const slot = Number(parsed.data.data.header.message.slot)
    // Only the number is read, so the rest of the block is never downloaded.
    for await (const value of this.stream(
      `eth/v2/beacon/blocks/${parsed.data.data.root}`,
      'data.message.body.execution_payload.block_number',
    )) {
      return { slot, blockNumber: Number(value) }
    }
    throw new Error('BeaconChain block has no execution payload', {
      cause: { blockId },
    })
  }

  /**
   * Every validator at a state with the given statuses. The list runs to
   * hundreds of megabytes, so each validator is yielded as it arrives.
   */
  async *getValidators(
    stateId: BeaconStateId,
    status: string[],
  ): AsyncGenerator<BeaconValidator> {
    const endpoint = `eth/v1/beacon/states/${stateId}/validators?status=${status.join(',')}`
    for await (const item of this.streamItems(endpoint, 'data')) {
      const parsed = ValidatorSchema.safeParse(item)
      if (!parsed.success) {
        throw new Error('Invalid BeaconChain validator', {
          cause: { endpoint },
        })
      }
      const credentials = parsed.data.validator.withdrawal_credentials
      // 0x01 and 0x02 credentials end in the address; 0x00 ones hold a key hash.
      const withdrawalAddress =
        credentials.startsWith('0x01') || credentials.startsWith('0x02')
          ? `0x${credentials.slice(26)}`
          : undefined
      yield {
        pubkey: parsed.data.validator.pubkey,
        withdrawalAddress,
        balanceGwei: BigInt(parsed.data.balance),
      }
    }
  }

  /** Sums the gwei amounts at `data[i].<field>` into wei, and counts them. */
  private async sumGwei(
    endpoint: string,
    field: string,
  ): Promise<{ wei: bigint; count: number }> {
    let gwei = 0n
    let count = 0
    for await (const value of this.stream(
      endpoint,
      (stack) =>
        stack.length === 3 && stack[0] === 'data' && stack[2] === field,
    )) {
      gwei += BigInt(value)
      count++
    }
    return { wei: gwei * 10n ** 9n, count }
  }

  /**
   * Streams the values at the paths matching `filter`, so a response of
   * hundreds of megabytes is never held in memory. Stopping early stops the
   * download. The beacon API sends every number as a decimal string.
   */
  private async *stream(
    endpoint: string,
    filter: string | ((stack: readonly (number | string | null)[]) => boolean),
  ): AsyncGenerator<string> {
    // Native fetch returns a Web stream; stream-chain only accepts Node streams
    const source = Readable.fromWeb(await this.fetchBody(endpoint))
    const pipeline = chain([source, parser(), pick({ filter }), streamValues()])
    try {
      for await (const { value } of pipeline) {
        if (typeof value !== 'string') {
          throw new Error('BeaconChain value is not a string', {
            cause: { endpoint, value },
          })
        }
        yield value
      }
    } finally {
      pipeline.destroy()
      source.destroy()
    }
  }

  /** Streams the items of the array at `path`, like `stream` does values. */
  private async *streamItems(
    endpoint: string,
    path: string,
  ): AsyncGenerator<unknown> {
    const response = await this.fetchBody(endpoint)
    const source = Readable.fromWeb(response)
    const pipeline = chain([
      source,
      parser(),
      pick({ filter: path }),
      streamArray(),
    ])
    try {
      for await (const { value } of pipeline) yield value
    } finally {
      pipeline.destroy()
      source.destroy()
    }
  }

  private async fetchBody(endpoint: string) {
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
    return response.body
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
