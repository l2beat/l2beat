import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { AssetUpdater } from '../assets'
import { getAggregatedConfigHash } from './getAggregatedConfigHash'

describe(getAggregatedConfigHash.name, () => {
  it('hash changes if updaters added', () => {
    const updatersBefore = [
      fakeUpdater('aa', ChainId.ETHEREUM),
      fakeUpdater('bb', ChainId.ARBITRUM),
    ]
    const updatersAfter = [
      ...updatersBefore,
      fakeUpdater('cc', ChainId.ARBITRUM),
    ]
    const hashBefore = getAggregatedConfigHash(updatersBefore)
    const hashAfter = getAggregatedConfigHash(updatersAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if updaters is removed', () => {
    const updatersBefore = [
      fakeUpdater('aa', ChainId.ETHEREUM),
      fakeUpdater('bb', ChainId.ARBITRUM),
      fakeUpdater('cc', ChainId.ARBITRUM),
    ]
    const updatersAfter = [updatersBefore[0]]
    const hashBefore = getAggregatedConfigHash(updatersBefore)
    const hashAfter = getAggregatedConfigHash(updatersAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash stays the same if nothing changes', () => {
    const updatersBefore = [fakeUpdater('aa', ChainId.ETHEREUM)]
    const updatersAfter = [fakeUpdater('aa', ChainId.ETHEREUM)]
    const hashBefore = getAggregatedConfigHash(updatersBefore)
    const hashAfter = getAggregatedConfigHash(updatersAfter)
    expect(hashBefore).toEqual(hashAfter)
  })

  it('hash changes if updater chainId changes', () => {
    const updatersBefore = [fakeUpdater('aa', ChainId.ETHEREUM)]
    const updatersAfter = [fakeUpdater('aa', ChainId.ARBITRUM)]
    const hashBefore = getAggregatedConfigHash(updatersBefore)
    const hashAfter = getAggregatedConfigHash(updatersAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if updater hash changes', () => {
    const updatersBefore = [fakeUpdater('aa', ChainId.ETHEREUM)]
    const updatersAfter = [fakeUpdater('bb', ChainId.ETHEREUM)]
    const hashBefore = getAggregatedConfigHash(updatersBefore)
    const hashAfter = getAggregatedConfigHash(updatersAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash stays the same if the updater order changes', () => {
    const updatersBefore = [
      fakeUpdater('aa', ChainId.ETHEREUM),
      fakeUpdater('bb', ChainId.ARBITRUM),
    ]
    const updatersAfter = [updatersBefore[1], updatersBefore[0]]
    const hashBefore = getAggregatedConfigHash(updatersBefore)
    const hashAfter = getAggregatedConfigHash(updatersAfter)
    expect(hashBefore).toEqual(hashAfter)
  })
})

function fakeUpdater(hash: string, chainId: ChainId): AssetUpdater {
  return {
    getChainId: () => chainId,
    getConfigHash: () => Hash256('0x' + hash + '0'.repeat(64 - hash.length)),
    getReportsWhenReady: async () => [],
    getMinTimestamp: () => new UnixTime(0),
  }
}
