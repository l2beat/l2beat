import type { AllProviders, IProvider } from '@l2beat/discovery'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { getProvider } from './providers'

/**
 * Mocks `AllProviders` and checks which V1 entry point each target uses.
 * Benchmarks pin a block, so a block number must reach `getByBlockNumber`
 * unchanged rather than being turned into a timestamp and resolved back,
 * which could land on a different block.
 */
describe(getProvider.name, () => {
  const provider = { blockNumber: 25_789_575 } as IProvider

  it('resolves a block number through getByBlockNumber', async () => {
    const allProviders = mockObject<AllProviders>({
      get: mockFn().rejectsWith(new Error('must not resolve by timestamp')),
      getByBlockNumber: mockFn().resolvesTo(provider),
    })
    const result = await getProvider(allProviders, 'ethereum', {
      blockNumber: 25_789_575,
    })
    expect(result).toEqual(provider)
    expect(allProviders.getByBlockNumber).toHaveBeenOnlyCalledWith(
      'ethereum',
      25_789_575,
    )
  })

  it('resolves a timestamp through V1 get, as UnixTime', async () => {
    const allProviders = mockObject<AllProviders>({
      get: mockFn().resolvesTo(provider),
      getByBlockNumber: mockFn().rejectsWith(
        new Error('must not resolve by block'),
      ),
    })
    await getProvider(allProviders, 'ethereum', { timestamp: 1_787_147_569 })
    expect(allProviders.get).toHaveBeenOnlyCalledWith(
      'ethereum',
      UnixTime(1_787_147_569),
    )
  })
})
