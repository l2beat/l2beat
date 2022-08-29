import { HttpClient } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { z } from 'zod'

import {
  aztecBlocksSchema,
  dydxTradesSchema,
  immutablexTradesSchema,
  loopringTradesSchema,
  starknetBlockSchema,
  zkspaceTradesSchema,
  zksyncBlockSchema,
} from './schemas'

export class ApiMonitor {
  constructor(private http: HttpClient) {}

  async aztecCheckBlock(url: string, body: string, maxSinceLastUpdate: number) {
    const { response, time } = await this.http.timedFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    const data = await response
      .json()
      .then((data) => aztecBlocksSchema.parse(data))

    const active = isActive(data.data.blocks[0].created, maxSinceLastUpdate)

    return { active, time }
  }

  async dydxCheckTrades(url: string, maxSinceLastUpdate: number) {
    const { data, time } = await this.fetchAndParse(url, dydxTradesSchema)
    const active = isActive(data.trades[0].createdAt, maxSinceLastUpdate)

    return { active, time }
  }

  async immutablexCheckTrades(url: string, maxSinceLastUpdate: number) {
    const { data, time } = await this.fetchAndParse(url, immutablexTradesSchema)
    const active = isActive(data.result[0].timestamp, maxSinceLastUpdate)

    return { active, time }
  }

  async loopringCheckTrades(url: string, maxSinceLastUpdate: number) {
    const { data, time } = await this.fetchAndParse(url, loopringTradesSchema)
    const lastUpdate = new UnixTime(Math.floor(+data.trades[0][0] / 1000))
    const active = isActive(lastUpdate, maxSinceLastUpdate)

    return { active, time }
  }

  async starknetCheckBlock(url: string, maxSinceLastUpdate: number) {
    const { data, time } = await this.fetchAndParse(url, starknetBlockSchema)
    const active = isActive(data.timestamp, maxSinceLastUpdate)

    return { active, time }
  }

  async zkspaceCheckTrades(url: string, maxSinceLastUpdate: number) {
    const { data, time } = await this.fetchAndParse(url, zkspaceTradesSchema)
    const active = isActive(data.data.data[0].created_at, maxSinceLastUpdate)

    return { active, time }
  }

  async zksyncCheckBlock(url: string, maxSinceLastUpdate: number) {
    const { data, time } = await this.fetchAndParse(url, zksyncBlockSchema)
    const active =
      data.status === 'success' &&
      isActive(data.result.list[0].committedAt, maxSinceLastUpdate)

    return { active, time }
  }

  private async fetchAndParse<T extends z.AnyZodObject>(
    url: string,
    schema: T,
  ): Promise<{ data: z.infer<T>; time: bigint }> {
    const { response, time } = await this.http.timedFetch(url)
    const data = await response.json().then((data) => schema.parse(data))

    return { data, time }
  }
}

function isActive(lastUpdate: UnixTime, maxSinceLastUpdate: number) {
  const now = UnixTime.now()

  const active = now.add(-maxSinceLastUpdate, 'seconds').lte(lastUpdate)
  return active
}
