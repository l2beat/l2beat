import { HttpClient } from '@l2beat/shared'
import { assert, RateLimiter } from '@l2beat/shared-pure'

import { findMinedBlockOrThrow } from './findMinedBlockOrThrow'
import {
  AztecGetRollupResponseBody,
  AztecGetRollupsResponseBody,
  Block,
  parseWithSchema,
  toBlock,
} from './schemas'

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
    } = parseWithSchema(data, AztecGetRollupsResponseBody)

    return findMinedBlockOrThrow(rollups)
  }

  async getBlock(number: number): Promise<Block> {
    const data = await this.queryApi(`{rollup(id:${number}){id mined numTxs}}`)
    const {
      data: { rollup },
    } = parseWithSchema(data, AztecGetRollupResponseBody)
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
