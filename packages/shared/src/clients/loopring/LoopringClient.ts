import { Block, UnixTime, json } from '@l2beat/shared-pure'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'
import { ClientCore, ClientCoreDependencies } from '../ClientCore'
import { DegateBlock, DegateError, LoopringBlock, LoopringError } from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  type: 'loopring' | 'degate3'
}

export class LoopringClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getBlockWithTransactions(blockNumber: number): Promise<Block> {
    const block = await this.queryBlock(blockNumber)

    return {
      hash: block.blockId.toString(),
      number: block.blockId,
      timestamp: block.createdAt.toNumber(),
      transactions: block.transactions.map((t) => ({
        type: t.txType,
      })),
    }
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime, start = 0) {
    const { blockId: latest } = await this.queryBlock('latest')

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

  async queryBlock(block: number | 'latest') {
    const tag = this.$.type === 'loopring' ? 'finalized' : 'latest'
    const id = block === 'latest' ? tag : block.toString()
    const query = new URLSearchParams({ id })
    const url = `${this.$.url}/block/getBlock?${query.toString()}`

    const blockResponse = await this.fetch(url, {
      timeout: 30_000,
    })

    return this.$.type === 'loopring'
      ? LoopringBlock.parse(blockResponse)
      : DegateBlock.parse(blockResponse).data
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError =
      this.$.type === 'loopring'
        ? LoopringError.safeParse(response)
        : DegateError.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn(`Response validation error`, {})
      return { success: false }
    }

    return { success: true }
  }

  get chain() {
    return this.$.type
  }
}
