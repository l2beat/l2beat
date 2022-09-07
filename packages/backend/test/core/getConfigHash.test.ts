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
import { EscrowInfo, ProjectInfo } from '../../src/model'

describe(getConfigHash.name, () => {
  it('hash changes if project added', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      ...projectsBefore,
      fakeProject('optimism', [
        fakeEscrow('cc', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })
  it('hash changes if project is removed', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
      fakeProject('optimism', [
        fakeEscrow('cc', 2000, [fakeToken('dai', 123)]),
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
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123), fakeToken('usdc', 456)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })
  it('hash changes if token is removed', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })
  it('hash changes if escrow sinceBlock changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })
  it('hash changes if token sinceBlock changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 456)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })
  it('hash stays the same if the project order changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
      fakeProject('optimism', [
        fakeEscrow('cc', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [projectsBefore[1], projectsBefore[0]]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })
  it('hash stays the same if the escrow order changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })
  it('hash stays the same if the token order changes', () => {
    const projectsBefore = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      fakeProject('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('eth', 0), fakeToken('dai', 123)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getConfigHash(projectsBefore)
    const hashAfter = getConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })
})
function fakeProject(id: string, escrows: EscrowInfo[]): ProjectInfo {
  return {
    name: id[0].toUpperCase() + id.slice(1),
    projectId: ProjectId(id),
    escrows,
    events: [],
  }
}

function fakeEscrow(
  address: string,
  timestamp: number,
  tokens: TokenInfo[],
): EscrowInfo {
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
