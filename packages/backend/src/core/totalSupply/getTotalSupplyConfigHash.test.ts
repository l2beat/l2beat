import { AssetId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getTotalSupplyConfigHash } from './getTotalSupplyConfigHash'
import { TotalSupplyTokensConfig } from './TotalSupplyTokensConfig'

describe(getTotalSupplyConfigHash.name, () => {
  it('produces different hash if token is added', () => {
    const tokenConfigBefore: TotalSupplyTokensConfig[] = [
      fakeToken(AssetId.ETH, new UnixTime(1000)),
      fakeToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const tokenConfigAfter: TotalSupplyTokensConfig[] = [
      ...tokenConfigBefore,
      fakeToken(AssetId.USDC, new UnixTime(2000)),
    ]

    const hashBefore = getTotalSupplyConfigHash(tokenConfigBefore)
    const hashAfter = getTotalSupplyConfigHash(tokenConfigAfter)

    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('produces different hash if token is removed', () => {
    const tokenConfigBefore: TotalSupplyTokensConfig[] = [
      fakeToken(AssetId.ETH, new UnixTime(1000)),
      fakeToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const tokenConfigAfter = [tokenConfigBefore[0]]

    const hashBefore = getTotalSupplyConfigHash(tokenConfigBefore)
    const hashAfter = getTotalSupplyConfigHash(tokenConfigAfter)

    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('produces different hash if token timestamp changes', () => {
    const tokenConfigBefore: TotalSupplyTokensConfig[] = [
      fakeToken(AssetId.ETH, new UnixTime(1000)),
      fakeToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const tokenConfigAfter: TotalSupplyTokensConfig[] = [
      fakeToken(AssetId.ETH, new UnixTime(2000)),
      fakeToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const hashBefore = getTotalSupplyConfigHash(tokenConfigBefore)
    const hashAfter = getTotalSupplyConfigHash(tokenConfigAfter)

    expect(hashBefore).not.toEqual(hashAfter)
  })

  it('produces same hash in case of different token order', () => {
    const tokenConfigBefore: TotalSupplyTokensConfig[] = [
      fakeToken(AssetId.ETH, new UnixTime(1000)),
      fakeToken(AssetId.ARB, new UnixTime(2000)),
    ]

    const tokenConfigAfter: TotalSupplyTokensConfig[] = [
      fakeToken(AssetId.ARB, new UnixTime(2000)),
      fakeToken(AssetId.ETH, new UnixTime(1000)),
    ]

    const hashBefore = getTotalSupplyConfigHash(tokenConfigBefore)
    const hashAfter = getTotalSupplyConfigHash(tokenConfigAfter)

    expect(hashBefore).toEqual(hashAfter)
  })
})

function fakeToken(
  assetId: AssetId,
  sinceTimestamp: UnixTime,
): TotalSupplyTokensConfig {
  return {
    assetId,
    sinceTimestamp,
    decimals: 18,
    tokenAddress: '0x0000000000000000000000000000000000000000',
  }
}
