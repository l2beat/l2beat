import { DiscoveryCache as DiscoveryCacheInterface } from '@l2beat/discovery'

import { DiscoveryCacheRepository } from './repositories/DiscoveryCacheRepository'

export class DiscoveryCache implements DiscoveryCacheInterface {
  constructor(private readonly repository: DiscoveryCacheRepository) {}

  async get(key: string): Promise<string | undefined> {
    const record = await this.repository.findByKey(key)
    return record?.value
  }

  async set(
    key: string,
    value: string,
    chain: string,
    blockNumber: number,
  ): Promise<void> {
    await this.repository.addOrUpdate({ key, value, chain, blockNumber })
  }
}
