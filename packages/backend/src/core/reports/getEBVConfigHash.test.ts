import {
  AssetId,
  ChainId,
  EthereumAddress,
  Token,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getMockToken } from '../../test/token'
import { getEBVConfigHash } from './getEBVConfigHash'

describe(getEBVConfigHash.name, () => {
  it('hash changes if tokens added', () => {
    const tokenConfigBefore: Token[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
      fakeExternalToken(AssetId.ARB, new UnixTime(2000)),
    ]
    const tokenConfigAfter: Token[] = [
      ...tokenConfigBefore,
      fakeExternalToken(AssetId.USDC, new UnixTime(2000)),
    ]

    const hashBefore = getEBVConfigHash(tokenConfigBefore)
    const hashAfter = getEBVConfigHash(tokenConfigAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash changes if project is removed', () => {
    const tokenConfigBefore: Token[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
      fakeExternalToken(AssetId.ARB, new UnixTime(2000)),
    ]
    const tokenConfigAfter: Token[] = [tokenConfigBefore[0]]

    const hashBefore = getEBVConfigHash(tokenConfigBefore)
    const hashAfter = getEBVConfigHash(tokenConfigAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash stays the same if nothing changes', () => {
    const tokenConfigBefore: Token[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
      fakeExternalToken(AssetId.ARB, new UnixTime(2000)),
    ]
    const tokenConfigAfter: Token[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
      fakeExternalToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const hashBefore = getEBVConfigHash(tokenConfigBefore)
    const hashAfter = getEBVConfigHash(tokenConfigAfter)
    expect(hashBefore).toEqual(hashAfter)
  })

  it('hash changes if premint addresses changes', () => {
    const tokenConfigBefore: Token[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
    ]
    const tokenConfigAfter: Token[] = [
      {
        ...tokenConfigBefore[0],
        premintHolderAddresses: [EthereumAddress.random()],
      },
    ]

    const hashBefore = getEBVConfigHash(tokenConfigBefore)
    const hashAfter = getEBVConfigHash(tokenConfigAfter)
    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('hash stays the same if only escrow changes', () => {
    const tokenConfig: Token[] = [
      fakeExternalToken(AssetId.ETH, new UnixTime(1000)),
      fakeExternalToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const hashBefore = getEBVConfigHash(tokenConfig)
    const hashAfter = getEBVConfigHash(tokenConfig)
    expect(hashBefore).toEqual(hashAfter)
  })
})

function fakeExternalToken(assetId: AssetId, sinceTimestamp: UnixTime): Token {
  return {
    ...getMockToken(),
    id: assetId,
    sinceTimestamp,
    premintHolderAddresses: [],
    chainId: ChainId.ARBITRUM,
    type: ValueType.EBV,
  }
}
