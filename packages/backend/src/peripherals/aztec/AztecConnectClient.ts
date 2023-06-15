import { HttpClient } from '@l2beat/shared'
import { RateLimiter } from '@l2beat/shared-pure'
import assert from 'assert'

import { findMinedBlockOrThrow } from './findMinedBlockOrThrow'
import { Block, parseWithSchema, Rollup, Rollups, toBlock } from './schemas'

export class AztecConnectClient {
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
    const data = await this.queryApi(`rollups?take=10&skip=0`)
    const rollups = parseWithSchema(data, Rollups)
    return findMinedBlockOrThrow(rollups)
  }

  async getBlock(number: number): Promise<Block> {
    const data = await this.queryApi(`rollup/${number}`)
    const rollup = parseWithSchema(data, Rollup)
    return toBlock(rollup)
  }

  private async queryApi(query: string): Promise<unknown> {
    const url = `${this.url}/${query}`
    const response = await this.httpClient.fetch(url)
    assert(
      response.ok,
      `AztecClient request to ${url} failed with status: ${response.status}`,
    )
    const data: unknown = await response.json()
    return data
  }
}
