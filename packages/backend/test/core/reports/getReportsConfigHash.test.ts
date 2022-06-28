import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect } from 'earljs'

import { getReportsConfigHash } from '../../../src/core/reports/getReportsConfigHash'
import { BridgeInfo, ProjectInfo } from '../../../src/model'

describe(getReportsConfigHash.name, () => {
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
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
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
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
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
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
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
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
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
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
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
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
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
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
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
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
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
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
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
  sinceBlock: number,
  tokens: TokenInfo[],
): BridgeInfo {
  return {
    address: EthereumAddress('0x' + address + '0'.repeat(40 - address.length)),
    sinceBlock,
    tokens,
  }
}

function fakeToken(id: string, sinceBlock: number): TokenInfo {
  return {
    name: 'irrelevant',
    symbol: 'irrelevant',
    id: AssetId(id),
    coingeckoId: CoingeckoId('irrelevant'),
    decimals: 18,
    sinceBlock,
    category: 'ether', // irrelevant
  }
}
