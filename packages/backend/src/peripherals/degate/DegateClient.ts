import { UnixTime, json } from '@l2beat/shared-pure'

import {
  ClientCore,
  ClientCoreDependencies,
} from '@l2beat/shared/build/clients/ClientCore'
import { getBlockNumberAtOrBefore } from '../getBlockNumberAtOrBefore'
import { DegateError, DegateResponse } from './schemas'

type Block = number | 'latest'

interface Dependencies extends ClientCoreDependencies {
  url: string
}

export class DegateClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getLatestBlockNumber() {
    const block = await this.call('latest')
    return block.blockId
  }

  async getBlock(blockNumber: number) {
    return await this.call(blockNumber)
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

  private async call(block: Block) {
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
}
