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
    assetId: AssetId.create(v?.chain ?? 'chain', v?.address),
    chain: 'chain',
    dataSource: 'chain',
    project: ProjectId('project'),
    source: 'canonical' as const,
    sinceTimestamp: UnixTime.ZERO,
    untilTimestamp: UnixTime.ZERO,
    includeInTotal: true,
    decimals: 18,
    symbol: 'SYMBOL',
    type: 'totalSupply',
    address: EthereumAddress.ZERO,
    isAssociated: false,
    category: 'other',
    ...v,
  }
}

function mockPrice(v?: Partial<PriceConfigEntry>): PriceConfigEntry {
  return {
    assetId: AssetId.create(v?.chain ?? 'chain', v?.address),
    address: EthereumAddress.ZERO,
    chain: 'chain',
    type: 'coingecko',
    coingeckoId: CoingeckoId('id'),
    sinceTimestamp: UnixTime.ZERO,
    ...v,
  }
}
