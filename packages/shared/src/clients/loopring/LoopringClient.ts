import type { Block, json } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import type { BlockClient } from '../types'
import { DegateBlock, DegateError, LoopringBlock, LoopringError } from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  type: 'loopring' | 'degate3'
}

export class LoopringClient extends ClientCore implements BlockClient {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getLatestBlockNumber() {
    const block = await this.queryBlock('latest')
    return block.blockId
  }

  async getBlockWithTransactions(blockNumber: number): Promise<Block> {
    const block = await this.queryBlock(blockNumber)

    return {
      hash: block.blockId.toString(),
      number: block.blockId,
      timestamp: block.createdAt,
      transactions: block.transactions.map((t) => ({
        type: t.txType,
      })),
    }
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
    if (this.$.type === 'loopring') {
      const parsedError = LoopringError.safeParse(response)

      if (parsedError.success) {
        this.$.logger.warn('Response validation error', {
          message: parsedError.data.resultInfo.message,
          code: parsedError.data.resultInfo.code,
        })
        return { success: false, message: parsedError.data.resultInfo.message }
      }
    }

    if (this.$.type === 'degate3') {
      const parsedError = DegateError.safeParse(response)

      if (parsedError.success) {
        this.$.logger.warn('Response validation error', {
          message: parsedError.data.message,
          code: parsedError.data.code,
        })
        return { success: false, message: parsedError.data.message }
      }
    }

    return { success: true }
  }

  get chain() {
    return this.$.type
  }
}
