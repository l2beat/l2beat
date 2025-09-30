import type { Block, json } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import type { BlockClient } from '../types'
import { tai64ToUnix } from './tai64ToUnix'
import {
  FuelBlockResponse,
  FuelError,
  FuelLatestBlockNumberResponse,
} from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
}

export class FuelClient extends ClientCore implements BlockClient {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getLatestBlockNumber() {
    const query = `query LatestBlocks {
        blocks(last: 1) {
          nodes {
            height
          }
        }
      }`

    const response = await this.query(query)

    const latestBlockNumberResponse =
      FuelLatestBlockNumberResponse.safeParse(response)

    if (
      !latestBlockNumberResponse.success ||
      latestBlockNumberResponse.data.data.blocks.nodes.length === 0
    ) {
      throw new Error('Latest block number: Error during parsing')
    }

    return Number(latestBlockNumberResponse.data.data.blocks.nodes[0].height)
  }

  async getBlockWithTransactions(blockNumber: number): Promise<Block> {
    const query = `query Block($height: U32) {
        block(height: $height) {
            id
            height
            header {
                time
            }
            transactionIds
        }
      }`

    const variables = {
      height: blockNumber.toString(),
    }

    const response = await this.query(query, variables)

    const blockResponse = FuelBlockResponse.safeParse(response)

    if (!blockResponse.success) {
      throw new Error(`Block ${blockNumber}: Error during parsing`)
    }

    return {
      hash: blockResponse.data.data.block.id,
      logsBloom: 'UNSUPPORTED',
      number: Number(blockResponse.data.data.block.height),
      timestamp: tai64ToUnix(blockResponse.data.data.block.header.time),
      transactions: blockResponse.data.data.block.transactionIds.map(
        (id: string) => ({
          hash: id,
        }),
      ),
    }
  }

  async query(query: string, variables?: unknown) {
    return await this.fetch(this.$.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      redirect: 'follow',
      timeout: 10_000,
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = FuelError.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        ...parsedError.data.errors,
      })
      return { success: false }
    }

    return { success: true }
  }

  get chain() {
    return 'fuel'
  }
}
