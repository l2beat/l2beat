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
import { EBVToken } from '../assets'
import { getEBVConfigHash } from './getEBVConfigHash'
import { ReportProject } from './ReportProject'

describe(getEBVConfigHash.name, () => {
  it('hash changes if tokens added', () => {
    const project = fakeProject('arbitrum', 'layer2', [
      fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
    ])

    const tokenConfigBefore: EBVToken[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
      fakeExternalToken(AssetId.ARB, new UnixTime(2000)),
    ]
    const tokenConfigAfter: EBVToken[] = [
      ...tokenConfigBefore,
      fakeExternalToken(AssetId.USDC, new UnixTime(2000)),
    ]

    const hashBefore = getEBVConfigHash(project, tokenConfigBefore)
    const hashAfter = getEBVConfigHash(project, tokenConfigAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if project is removed', () => {
    const project = fakeProject('arbitrum', 'layer2', [
      fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
    ])
    const tokenConfigBefore: EBVToken[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
      fakeExternalToken(AssetId.ARB, new UnixTime(2000)),
    ]
    const tokenConfigAfter: EBVToken[] = [tokenConfigBefore[0]]

    const hashBefore = getEBVConfigHash(project, tokenConfigBefore)
    const hashAfter = getEBVConfigHash(project, tokenConfigAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash stays the same if nothing changes', () => {
    const project = fakeProject('arbitrum', 'layer2', [
      fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
    ])
    const tokenConfigBefore: EBVToken[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
      fakeExternalToken(AssetId.ARB, new UnixTime(2000)),
    ]
    const tokenConfigAfter: EBVToken[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
      fakeExternalToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const hashBefore = getEBVConfigHash(project, tokenConfigBefore)
    const hashAfter = getEBVConfigHash(project, tokenConfigAfter)
    expect(hashBefore).toEqual(hashAfter)
  })

  it('hash changes if premint addresses changes', () => {
    const project = fakeProject('arbitrum', 'layer2', [
      fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
    ])
    const tokenConfigBefore: EBVToken[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
    ]
    const tokenConfigAfter: EBVToken[] = [
      { ...tokenConfigBefore[0], premintHolderAddresses: ['0x1234'] },
    ]

    const hashBefore = getEBVConfigHash(project, tokenConfigBefore)
    const hashAfter = getEBVConfigHash(project, tokenConfigAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash stays the same if only escrow changes', () => {
    const projectBefore = fakeProject('arbitrum', 'layer2', [
      fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
    ])
    const projectAfter = fakeProject('arbitrum', 'layer2', [
      fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
    ])

    const tokenConfig: EBVToken[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
      fakeExternalToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const hashBefore = getEBVConfigHash(projectBefore, tokenConfig)
    const hashAfter = getEBVConfigHash(projectAfter, tokenConfig)
    expect(hashBefore).toEqual(hashAfter)
  })

  it('hash changes if escrow stay the same but project id changes', () => {
    const projectBefore = fakeProject('arbitrum', 'layer2', [
      fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
    ])
    const projectAfter = fakeProject('arbitrum_with_blackjack', 'layer2', [
      fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
    ])

    const tokenConfig: EBVToken[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
      fakeExternalToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const hashBefore = getEBVConfigHash(projectBefore, tokenConfig)
    const hashAfter = getEBVConfigHash(projectAfter, tokenConfig)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if escrow stay the same but project type changes', () => {
    const projectBefore = fakeProject('arbitrum', 'layer2', [
      fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
    ])
    const projectAfter = fakeProject('arbitrum', 'bridge', [
      fakeEscrow('aa', 1000, [fakeToken('dai', 123), fakeToken('eth', 0)]),
      fakeEscrow('bb', 2000, [fakeToken('dai', 123)]),
    ])

    const tokenConfig: EBVToken[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
      fakeExternalToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const hashBefore = getEBVConfigHash(projectBefore, tokenConfig)
    const hashAfter = getEBVConfigHash(projectAfter, tokenConfig)
    expect(hashBefore).not.toEqual(hashAfter)
  })
})

function fakeProject(
  id: string,
  type: ReportProject['type'],
  escrows: ProjectEscrow[],
): ReportProject {
  return {
    projectId: ProjectId(id),
    type,
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

function fakeExternalToken(
  assetId: AssetId,
  sinceTimestamp: UnixTime,
): EBVToken {
  return {
    assetId,
    sinceTimestamp,
    decimals: 18,
    tokenAddress: '0x0000000000000000000000000000000000000000',
    premintHolderAddresses: [],
  }
}
