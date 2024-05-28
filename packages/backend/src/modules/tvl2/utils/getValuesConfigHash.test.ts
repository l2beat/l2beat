import {
  AmountConfigEntry,
  AssetId,
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  EthereumAddress,
  PriceConfigEntry,
  ProjectId,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getValuesConfigHash } from './getValuesConfigHash'

describe(getValuesConfigHash.name, () => {
  it('sorts input', () => {
    const ADDRESS_1 = EthereumAddress.random()

    const priceConfigs: CoingeckoPriceConfigEntry[] = [
      mockPrice(),
      mockPrice({ address: ADDRESS_1 }),
    ]

    const amountConfigs: AmountConfigEntry[] = [
      mockAmount(),
      mockAmount({ address: ADDRESS_1 }),
    ]

    const reorderedAmountConfigs: AmountConfigEntry[] = [
      mockAmount({ address: ADDRESS_1 }),
      mockAmount(),
    ]

    const hash = getValuesConfigHash(amountConfigs, priceConfigs)
    const hash2 = getValuesConfigHash(reorderedAmountConfigs, priceConfigs)

    expect(hash).toEqual(hash2)
  })
})

function mockAmount(v?: Partial<TotalSupplyEntry>): TotalSupplyEntry {
  return {
    chain: 'chain',
    project: ProjectId('project'),
    source: 'canonical' as const,
    sinceTimestamp: UnixTime.ZERO,
    untilTimestamp: UnixTime.ZERO,
    includeInTotal: true,
    decimals: 18,
    symbol: 'SYMBOL',
    type: 'totalSupply',
    address: EthereumAddress.ZERO,
    ...v,
  }
}

function mockPrice(v?: Partial<PriceConfigEntry>): PriceConfigEntry {
  return {
    address: EthereumAddress.ZERO,
    chain: 'chain',
    type: 'coingecko',
    coingeckoId: CoingeckoId('id'),
    sinceTimestamp: UnixTime.ZERO,
    assetId: AssetId.ARB,
    ...v,
  }
}
