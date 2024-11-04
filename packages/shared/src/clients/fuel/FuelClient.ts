import { UnixTime, json } from '@l2beat/shared-pure'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'
import { ClientCore, ClientCoreDependencies } from '../ClientCore'
import { tai64ToUnix } from './tai64ToUnix'
import {
  FuelBlock,
  FuelBlockResponse,
  FuelError,
  FuelLatestBlockNumberResponse,
} from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
}

export class FuelClient extends ClientCore {
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
      throw new Error(`Latest block number: Error during parsing`)
    }

    return Number(latestBlockNumberResponse.data.data.blocks.nodes[0].height)
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime, start = 0) {
    const end = await this.getLatestBlockNumber()
    return await getBlockNumberAtOrBefore(
      timestamp,
      start,
      end,
      this.getBlock.bind(this),
    )
  }

  async getBlock(blockNumber: number): Promise<FuelBlock> {
    const query = `query Block($height: U32) {
        block(height: $height) {
            id
            height
            header {
                time
                transactionsCount
            }
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
      id: blockResponse.data.data.block.id,
      height: Number(blockResponse.data.data.block.height),
      timestamp: tai64ToUnix(blockResponse.data.data.block.header.time),
      transactionsCount: Number(
        blockResponse.data.data.block.header.transactionsCount,
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

  override validateResponse(response: json): boolean {
    const parsedError = FuelError.safeParse(response)

    if (parsedError.success) {
      console.log(JSON.stringify(response))
      this.$.logger.warn(`Response validation error`, {
        ...parsedError.data.errors,
      })
      return false
    }

    return true
  }
}
