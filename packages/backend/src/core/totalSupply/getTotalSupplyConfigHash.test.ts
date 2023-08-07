import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  Token,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getTotalSupplyConfigHash } from './getTotalSupplyConfigHash'

describe(getTotalSupplyConfigHash.name, () => {
  it('produces different hash if token is added', () => {
    const tokenConfigBefore: Token[] = [
      fakeToken(AssetId.ETH, new UnixTime(1000)),
      fakeToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const tokenConfigAfter: Token[] = [
      ...tokenConfigBefore,
      fakeToken(AssetId.USDC, new UnixTime(2000)),
    ]

    const hashBefore = getTotalSupplyConfigHash(tokenConfigBefore)
    const hashAfter = getTotalSupplyConfigHash(tokenConfigAfter)

    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('produces different hash if token is removed', () => {
    const tokenConfigBefore: Token[] = [
      fakeToken(AssetId.ETH, new UnixTime(1000)),
      fakeToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const tokenConfigAfter = [tokenConfigBefore[0]]

    const hashBefore = getTotalSupplyConfigHash(tokenConfigBefore)
    const hashAfter = getTotalSupplyConfigHash(tokenConfigAfter)

    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('produces different hash if token timestamp changes', () => {
    const tokenConfigBefore: Token[] = [
      fakeToken(AssetId.ETH, new UnixTime(1000)),
      fakeToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const tokenConfigAfter: Token[] = [
      fakeToken(AssetId.ETH, new UnixTime(2000)),
      fakeToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const hashBefore = getTotalSupplyConfigHash(tokenConfigBefore)
    const hashAfter = getTotalSupplyConfigHash(tokenConfigAfter)

    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('produces same hash in case of different token order', () => {
    const tokenConfigBefore: Token[] = [
      fakeToken(AssetId.ETH, new UnixTime(1000)),
      fakeToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const tokenConfigAfter: Token[] = [
      fakeToken(AssetId.ARB, new UnixTime(2000)),
      fakeToken(AssetId.ETH, new UnixTime(1000)),
    ]

    const hashBefore = getTotalSupplyConfigHash(tokenConfigBefore)
    const hashAfter = getTotalSupplyConfigHash(tokenConfigAfter)

    expect(hashBefore).toEqual(hashAfter)
  })
})

function fakeToken(assetId: AssetId, sinceTimestamp: UnixTime): Token {
  return {
    id: assetId,
    name: 'Fake',
    coingeckoId: CoingeckoId('fake-token'),
    symbol: 'FKT',
    sinceTimestamp,
    decimals: 18,
    address: EthereumAddress.ZERO,
    category: 'other',
    chainId: ChainId.ETHEREUM,
    type: ValueType.CBV,
  }
}
