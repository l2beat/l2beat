import { TokenInfo } from '@l2beat/config'
import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { ProjectEscrow } from '../../model'
import { BalanceProject } from './BalanceProject'
import { getBalanceConfigHash } from './getBalanceConfigHash'

describe(getBalanceConfigHash.name, () => {
  it('hash changes if project added', () => {
    const projectsBefore = [
      project('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      ...projectsBefore,
      project('optimism', [fakeEscrow('cc', 2000, [fakeToken('dai', 123)])]),
    ]
    const hashBefore = getBalanceConfigHash(projectsBefore)
    const hashAfter = getBalanceConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if project is removed', () => {
    const projectsBefore = [
      project('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
      project('optimism', [fakeEscrow('cc', 2000, [fakeToken('dai', 123)])]),
    ]
    const projectsAfter = [projectsBefore[0]]
    const hashBefore = getBalanceConfigHash(projectsBefore)
    const hashAfter = getBalanceConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if token is added', () => {
    const projectsBefore = [
      project('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      project('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123), fakeToken('usdc', 456)]),
      ]),
    ]
    const hashBefore = getBalanceConfigHash(projectsBefore)
    const hashAfter = getBalanceConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if token is removed', () => {
    const projectsBefore = [
      project('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      project('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getBalanceConfigHash(projectsBefore)
    const hashAfter = getBalanceConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if escrow sinceBlock changes', () => {
    const projectsBefore = [
      project('arbitrum', [fakeEscrow('aa', 1000, [fakeToken('dai', 123)])]),
    ]
    const projectsAfter = [
      project('arbitrum', [fakeEscrow('aa', 2000, [fakeToken('dai', 123)])]),
    ]
    const hashBefore = getBalanceConfigHash(projectsBefore)
    const hashAfter = getBalanceConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if token sinceBlock changes', () => {
    const projectsBefore = [
      project('arbitrum', [fakeEscrow('aa', 1000, [fakeToken('dai', 123)])]),
    ]
    const projectsAfter = [
      project('arbitrum', [fakeEscrow('aa', 1000, [fakeToken('dai', 456)])]),
    ]
    const hashBefore = getBalanceConfigHash(projectsBefore)
    const hashAfter = getBalanceConfigHash(projectsAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash stays the same if the project order changes', () => {
    const projectsBefore = [
      project('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
      project('optimism', [fakeEscrow('cc', 2000, [fakeToken('dai', 123)])]),
    ]
    const projectsAfter = [projectsBefore[1], projectsBefore[0]]
    const hashBefore = getBalanceConfigHash(projectsBefore)
    const hashAfter = getBalanceConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })

  it('hash stays the same if the escrow order changes', () => {
    const projectsBefore = [
      project('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      project('arbitrum', [
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      ]),
    ]
    const hashBefore = getBalanceConfigHash(projectsBefore)
    const hashAfter = getBalanceConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })

  it('hash stays the same if the token order changes', () => {
    const projectsBefore = [
      project('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const projectsAfter = [
      project('arbitrum', [
        fakeEscrow('aa', 1000, [fakeToken('eth', 0), fakeToken('dai', 123)]),
        fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
      ]),
    ]
    const hashBefore = getBalanceConfigHash(projectsBefore)
    const hashAfter = getBalanceConfigHash(projectsAfter)
    expect(hashBefore).toEqual(hashAfter)
  })
})

function project(id: string, escrows: ProjectEscrow[]): BalanceProject {
  return {
    projectId: ProjectId(id),
    escrows,
  }
}

function fakeEscrow(
  address: string,
  timestamp: number,
  tokens: TokenInfo[],
): ProjectEscrow {
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
