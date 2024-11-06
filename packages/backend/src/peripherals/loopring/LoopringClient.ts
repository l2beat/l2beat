import { UnixTime, json } from '@l2beat/shared-pure'

import {
  ClientCore,
  ClientCoreDependencies,
} from '@l2beat/shared/build/clients/ClientCore'
import { getBlockNumberAtOrBefore } from '../getBlockNumberAtOrBefore'
import { LoopringError, LoopringResponse } from './schemas'

type Block = number | 'finalized'

export interface Dependencies extends ClientCoreDependencies {
  url: string
}

export class LoopringClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getFinalizedBlockNumber() {
    const block = await this.query('finalized')
    return block.blockId
  }

  async getBlock(blockNumber: number) {
    return await this.query(blockNumber)
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime, start = 0) {
    const end = await this.getFinalizedBlockNumber()

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

  async query(block: Block) {
    const query = new URLSearchParams({ id: block.toString() })
    const url = `${this.$.url}/block/getBlock?${query.toString()}`

    const res = await this.fetch(url, {
      timeout: 10_000,
    })

    const loopringResponse = LoopringResponse.parse(res)
    return loopringResponse
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = LoopringError.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn(`Response validation error`, {
        error: parsedError.data.resultInfo.message,
      })
      return { success: false }
    }

    return { success: true }
  }
}
