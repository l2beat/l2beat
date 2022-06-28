import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect } from 'earljs'

import { getReportsConfigHash } from '../../../src/core/reports/getReportsConfigHash'
import { BridgeInfo, ProjectInfo } from '../../../src/model'

describe(getReportsConfigHash.name, () => {
  const SINCE_0 = new UnixTime(0)
  const SINCE_1 = new UnixTime(123)
  const SINCE_2 = new UnixTime(456)

  const SINCE_3 = new UnixTime(1000)
  const SINCE_4 = new UnixTime(2000)

  it('hash changes if project added', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', SINCE_3, [
          fakeToken('dai', SINCE_1),
          fakeToken('eth', SINCE_0),
        ]),
        fakeBridge('bb', SINCE_4, [fakeToken('dai', SINCE_1)]),
      ]),
    ]
    const projectsAfter = [
      ...projectsBefore,
      fakeProject('optimism', [
        fakeBridge('cc', SINCE_4, [fakeToken('dai', SINCE_1)]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if project is removed', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', SINCE_3, [
          fakeToken('dai', SINCE_1),
          fakeToken('eth', SINCE_0),
        ]),
        fakeBridge('bb', SINCE_4, [fakeToken('dai', SINCE_1)]),
      ]),
      fakeProject('optimism', [
        fakeBridge('cc', SINCE_4, [fakeToken('dai', SINCE_1)]),
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
        fakeBridge('aa', SINCE_3, [
          fakeToken('dai', SINCE_1),
          fakeToken('eth', SINCE_0),
        ]),
        fakeBridge('bb', SINCE_4, [fakeToken('dai', SINCE_1)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', SINCE_3, [
          fakeToken('dai', SINCE_1),
          fakeToken('eth', SINCE_0),
        ]),
        fakeBridge('bb', SINCE_4, [
          fakeToken('dai', SINCE_1),
          fakeToken('usdc', SINCE_2),
        ]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if token is removed', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', SINCE_3, [
          fakeToken('dai', SINCE_1),
          fakeToken('eth', SINCE_0),
        ]),
        fakeBridge('bb', SINCE_4, [fakeToken('dai', SINCE_1)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', SINCE_3, [fakeToken('eth', SINCE_0)]),
        fakeBridge('bb', SINCE_4, [fakeToken('dai', SINCE_1)]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if bridge sinceBlock changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', SINCE_3, [fakeToken('dai', SINCE_1)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', SINCE_4, [fakeToken('dai', SINCE_1)]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if token sinceBlock changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', SINCE_3, [fakeToken('dai', SINCE_1)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', SINCE_3, [fakeToken('dai', SINCE_2)]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash stays the same if the project order changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', SINCE_3, [
          fakeToken('dai', SINCE_1),
          fakeToken('eth', SINCE_0),
        ]),
        fakeBridge('bb', SINCE_4, [fakeToken('dai', SINCE_1)]),
      ]),
      fakeProject('optimism', [
        fakeBridge('cc', SINCE_4, [fakeToken('dai', SINCE_1)]),
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
        fakeBridge('aa', SINCE_3, [
          fakeToken('dai', SINCE_1),
          fakeToken('eth', SINCE_0),
        ]),
        fakeBridge('bb', SINCE_4, [fakeToken('dai', SINCE_1)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('bb', SINCE_4, [fakeToken('dai', SINCE_1)]),
        fakeBridge('aa', SINCE_3, [
          fakeToken('dai', SINCE_1),
          fakeToken('eth', SINCE_0),
        ]),
      ]),
    ]
    const hashBefore = getReportsConfigHash(projectsBefore)
    const hashAfter = getReportsConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })

  it('hash stays the same if the token order changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeBridge('aa', SINCE_3, [
          fakeToken('dai', SINCE_1),
          fakeToken('eth', SINCE_0),
        ]),
        fakeBridge('bb', SINCE_4, [fakeToken('dai', SINCE_1)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeBridge('aa', SINCE_3, [
          fakeToken('eth', SINCE_0),
          fakeToken('dai', SINCE_1),
        ]),
        fakeBridge('bb', SINCE_4, [fakeToken('dai', SINCE_1)]),
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
  sinceTimestamp: UnixTime,
  tokens: TokenInfo[],
): BridgeInfo {
  return {
    address: EthereumAddress('0x' + address + '0'.repeat(40 - address.length)),
    sinceTimestamp,
    tokens,
  }
}

function fakeToken(id: string, sinceTimestamp: UnixTime): TokenInfo {
  return {
    name: 'irrelevant',
    symbol: 'irrelevant',
    id: AssetId(id),
    coingeckoId: CoingeckoId('irrelevant'),
    decimals: 18,
    sinceTimestamp,
    category: 'ether', // irrelevant
  }
}
