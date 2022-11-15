import { HttpClient, RateLimiter } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import assert from 'assert'

import {
  GetRollupResponseBodySchema,
  GetRollupsResponseBodySchema,
  Rollup,
} from './schemas'

export interface Block {
  number: number
  timestamp: UnixTime
  transactionCount: number
}

export class AztecClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
    callsPerMinute?: number,
  ) {
    const rateLimiter = new RateLimiter({
      callsPerMinute: callsPerMinute ?? 60,
    })
    this.queryApi = rateLimiter.wrap(this.queryApi.bind(this))
  }

  async getLatestBlock(): Promise<Block> {
    const data = await this.queryApi(
      '{rollups(take:10,skip:0){id mined numTxs}}',
    )
    const {
      data: { rollups },
    } = GetRollupsResponseBodySchema.parse(data)
    const latestMined = rollups.find((r): r is Rollup => r.mined !== null)
    assert(latestMined, 'No mined block found in first 10 blocks')
    return toBlock(latestMined)
  }

  async getBlock(number: number): Promise<Block> {
    const data = await this.queryApi(`{rollup(id:${number}){id mined numTxs}}`)
    const {
      data: { rollup },
    } = GetRollupResponseBodySchema.parse(data)
    return toBlock(rollup)
  }

  private async queryApi(query: string): Promise<unknown> {
    const url = `${this.url}/graphql?query=${query}`
    const response = await this.httpClient.fetch(url)
    assert(
      response.ok,
      `AztecClient request to ${url} failed with status: ${response.status}`,
    )
    const data: unknown = await response.json()
    return data
  }
}

function toBlock(rollup: Rollup): Block {
  return {
    number: rollup.id,
    timestamp: rollup.mined,
    transactionCount: rollup.numTxs,
  }
}
