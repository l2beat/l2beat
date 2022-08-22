import { TokenInfo } from '@l2beat/config'
import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/types'
import { expect } from 'earljs'

import { getConfigHash } from '../../src/core/getConfigHash'
import { BridgeInfo, ProjectInfo } from '../../src/model'

describe(getConfigHash.name, () => {
  it('hash changes if project added', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      ...projectsBefore,
      fakeProject('optimism', [
        fakeBridge('cc', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })
  it('hash changes if project is removed', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
      fakeProject('optimism', [
        fakeBridge('cc', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [projectsBefore[0]]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })
  it('hash changes if token is added', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123), fakeToken('usdc', 456)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })
  it('hash changes if token is removed', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })
  it('hash changes if bridge sinceBlock changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })
  it('hash changes if token sinceBlock changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 456)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })
  it('hash stays the same if the project order changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
      fakeProject('optimism', [
        fakeBridge('cc', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [projectsBefore[1], projectsBefore[0]]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })
  it('hash stays the same if the bridge order changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })
  it('hash stays the same if the token order changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', 1000, [fakeToken('eth', 0), fakeToken('dai', 123)]),
        fakeBridge('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })
})
function fakeProject(id: string, bridges: BridgeInfo[]): ProjectInfo {
  return {
    name: id[0].toUpperCase() + id.slice(1),
    projectId: ProjectId(id),
    bridges,
  }
}

function fakeBridge(
  address: string,
  timestamp: number,
  tokens: TokenInfo[],
): BridgeInfo {
  return {
    address: EthereumAddress('0x' + address + '0'.repeat(40 - address.length)),
    sinceTimestamp: new UnixTime(timestamp),
    tokens,
  }
}

function fakeToken(id: string, timestamp: number): TokenInfo {
  return {
    name: 'irrelevant',
    symbol: 'irrelevant',
    id: AssetId(id),
    coingeckoId: CoingeckoId('irrelevant'),
    decimals: 18,
    sinceTimestamp: new UnixTime(timestamp),
    category: 'ether', // irrelevant
  }
}
