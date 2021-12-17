import { providers } from 'ethers'

import { Cache } from './Cache'

const cache = new Cache<number>('timestamps.json')

export async function getBlockTimestamp(
  provider: providers.Provider,
  blockNumber: number
) {
  const key = blockNumber.toString()
  if (!cache.has(key)) {
    const { timestamp } = await provider.getBlock(blockNumber)
    cache.set(key, timestamp)
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return cache.get(key)!
}
