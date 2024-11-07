import { Block, UnixTime, json } from '@l2beat/shared-pure'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'
import { ClientCore, ClientCoreDependencies } from '../ClientCore'
import { DegateError, DegateResponse } from './types'

type BlockTag = number | 'latest'

export interface Dependencies extends ClientCoreDependencies {
  url: string
}

export class DegateClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getLatestBlockNumber() {
    const block = await this.query('latest')
    return block.blockId
  }

  async getBlock(blockNumber: number) {
    return await this.query(blockNumber)
  }

  async getBlockWithTransactions(blockNumber: number): Promise<Block> {
    const block = await this.query(blockNumber)

    return {
      hash: 'UNSUPPORTED',
      number: block.blockId,
      timestamp: block.createdAt.toNumber(),
      transactions: block.transactions.map((t) => ({
        hash: 'UNSUPPORTED',
        type: t.txType,
      })),
    }
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime, start = 0) {
    const end = await this.getLatestBlockNumber()

    return await getBlockNumberAtOrBefore(
      timestamp,
      start,
      end,
      async (block) => {
        const blockData = await this.getBlock(block)
        return { timestamp: blockData.createdAt.toNumber() }
      },
    )
  }

  async query(block: BlockTag) {
    const query = new URLSearchParams({ id: block.toString() })
    const url = `${this.$.url}/block/getBlock?${query.toString()}`

    const res = await this.fetch(url, {
      timeout: 30_000,
    })

    const degateResponse = DegateResponse.parse(res)
    return degateResponse.data
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = DegateError.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn(`Response validation error`, {
        error: parsedError.data.message,
      })
      return { success: false, message: parsedError.data.message }
    }

    return { success: true }
  }

  get chain() {
    return 'degate3'
  }
}
