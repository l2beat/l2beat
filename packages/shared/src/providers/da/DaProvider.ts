import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { DaBlob } from './types'

export interface LogsFilter {
  address: string
  topics: string[]
}

export interface DaBlobProvider {
  daLayer: string
  getBlobs(from: number, to: number): Promise<DaBlob[]>
  /** Same timestamp the blobs of that block carry as `blockTimestamp` */
  getBlockTimestamp(blockNumber: number): Promise<UnixTime>
}

export class DaProvider {
  providers: Map<string, DaBlobProvider>

  constructor(providers: DaBlobProvider[]) {
    this.providers = new Map(providers.map((p) => [p.daLayer, p]))
  }

  async getBlobs(daLayer: string, from: number, to: number): Promise<DaBlob[]> {
    const provider = this.providers.get(daLayer)
    assert(provider, `Missing DaProvider for ${daLayer}`)

    return await provider.getBlobs(from, to)
  }

  async getBlockTimestamp(
    daLayer: string,
    blockNumber: number,
  ): Promise<UnixTime> {
    return await this.getDaProvider(daLayer).getBlockTimestamp(blockNumber)
  }

  getDaProvider(daLayer: string): DaBlobProvider {
    const provider = this.providers.get(daLayer)
    assert(provider, `Missing DaProvider for ${daLayer}`)

    return provider
  }
}
