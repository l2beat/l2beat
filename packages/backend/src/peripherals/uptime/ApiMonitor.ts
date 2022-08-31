import { HttpClient } from '@l2beat/common'
import { ApiCheck, ApiCheckWithBody } from '@l2beat/config'
import { UnixTime } from '@l2beat/types'
import { z } from 'zod'

import { makeHandler, UptimeHandlers } from './handler'
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
  handlers: UptimeHandlers = []

  constructor(private http: HttpClient) {
    this.handlers = [
      makeHandler('aztec_checkBlock', this.aztecCheckBlock),
      makeHandler('dydx_checkTrades', this.dydxCheckTrades),
      makeHandler('immutablex_checkTrades', this.immutablexCheckTrades),
      makeHandler('loopring_checkTrades', this.loopringCheckTrades),
      makeHandler('starknet_checkBlock', this.starknetCheckBlock),
      makeHandler('zkspace_checkTrades', this.zkspaceCheckTrades),
      makeHandler('zksync_checkBlock', this.zksyncCheckBlock),
    ]
  }

  aztecCheckBlock = async ({ url, body }: ApiCheckWithBody) => {
    const { response, time } = await this.http.timedFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    const data = await response
      .json()
      .then((data) => aztecBlocksSchema.parse(data))

    const active = isActive(data.data.blocks[0].created)

    return { active, time }
  }

  dydxCheckTrades = async ({ url }: ApiCheck) => {
    const { data, time } = await this.fetchAndParse(url, dydxTradesSchema)
    const active = isActive(data.trades[0].createdAt)

    return { active, time }
  }

  immutablexCheckTrades = async ({ url }: ApiCheck) => {
    const { data, time } = await this.fetchAndParse(url, immutablexTradesSchema)
    const active = isActive(data.result[0].timestamp)

    return { active, time }
  }

  loopringCheckTrades = async ({ url }: ApiCheck) => {
    const { data, time } = await this.fetchAndParse(url, loopringTradesSchema)
    const lastUpdate = new UnixTime(Math.floor(+data.trades[0][0] / 1000))
    const active = isActive(lastUpdate)

    return { active, time }
  }

  starknetCheckBlock = async ({ url }: ApiCheck) => {
    const { data, time } = await this.fetchAndParse(url, starknetBlockSchema)
    const active = isActive(data.timestamp)

    return { active, time }
  }

  zkspaceCheckTrades = async ({ url }: ApiCheck) => {
    const { data, time } = await this.fetchAndParse(url, zkspaceTradesSchema)
    const active = isActive(data.data.data[0].created_at)

    return { active, time }
  }

  zksyncCheckBlock = async ({ url }: ApiCheck) => {
    const { data, time } = await this.fetchAndParse(url, zksyncBlockSchema)
    const active =
      data.status === 'success' && isActive(data.result.list[0].committedAt)

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

const maxSinceLastUpdate = 3600 * 4 // TODO what is the longest we should wait since the last trade? This will be a fn argument

function isActive(lastUpdate: UnixTime) {
  const now = UnixTime.now()

  const active = now.add(-maxSinceLastUpdate, 'seconds').lte(lastUpdate)
  return active
}
