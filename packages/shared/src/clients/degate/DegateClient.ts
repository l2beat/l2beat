import { Block, UnixTime, json } from '@l2beat/shared-pure'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'
import { ClientCore, ClientCoreDependencies } from '../ClientCore'
import { DegateBlock, DegateError } from './types'

export interface Dependencies extends ClientCoreDependencies {
  url: string
}

export class DegateClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getBlockWithTransactions(blockNumber: number): Promise<Block> {
    const blockResponse = await this.query(blockNumber)
    const { data: block } = DegateBlock.parse(blockResponse)

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
    const blockResponse = await this.query('latest')
    const { data } = DegateBlock.parse(blockResponse)
    const latest = data.blockId

    return await getBlockNumberAtOrBefore(
      timestamp,
      start,
      latest,
      async (block) => {
        const blockData = await this.getBlockWithTransactions(block)
        return { timestamp: blockData.timestamp }
      },
    )
  }

  async query(block: number | 'latest') {
    const query = new URLSearchParams({ id: block.toString() })
    const url = `${this.$.url}/block/getBlock?${query.toString()}`

    return await this.fetch(url, {
      timeout: 30_000,
    })
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
