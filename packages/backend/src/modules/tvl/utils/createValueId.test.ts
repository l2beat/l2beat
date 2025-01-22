import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  type PriceConfigEntry,
  ProjectId,
  type TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { createValueId } from './createValueId'

describe(createValueId.name, () => {
  const amountFields = [
    {
      key: 'source',
      newValue: 'external',
      shouldUpdateHash: true,
    },
    {
      key: 'includeInTotal',
      newValue: false,
      shouldUpdateHash: true,
    },
    {
      key: 'decimals',
      newValue: 66,
      shouldUpdateHash: true,
    },
    {
      key: 'address',
      newValue: EthereumAddress.random(),
      shouldUpdateHash: true,
    },
    {
      key: 'category',
      newValue: 'ether',
      shouldUpdateHash: true,
    },
  ]

  const priceFields = [
    {
      key: 'coingeckoId',
      newValue: CoingeckoId('new-id'),
      shouldUpdateHash: true,
    },
    {
      key: 'address',
      newValue: EthereumAddress.random(),
      shouldUpdateHash: true,
    },
  ]

  describe('amount change', () => {
    for (const f of amountFields) {
      it(f.key, () => {
        const pre = createValueId(mockAmount(), mockPrice())

        const post = createValueId(
          mockAmount({ [f.key]: f.newValue }),
          mockPrice(),
        )

        if (f.shouldUpdateHash) {
          expect(pre).not.toEqual(post)
        } else {
          expect(pre).toEqual(post)
        }
      })
    }
  })

  describe('price change', () => {
    for (const f of priceFields) {
      it(f.key, () => {
        const pre = createValueId(mockAmount(), mockPrice())

        const post = createValueId(
          mockAmount(),
          mockPrice({ [f.key]: f.newValue }),
        )

        if (f.shouldUpdateHash) {
          expect(pre).not.toEqual(post)
        } else {
          expect(pre).toEqual(post)
        }
      })
    }
  })
})

function mockAmount(v?: Partial<TotalSupplyEntry>): TotalSupplyEntry {
  return {
    assetId: AssetId('assetId'),
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
    address: EthereumAddress.ZERO,
    chain: 'chain',
    type: 'coingecko',
    coingeckoId: CoingeckoId('id'),
    sinceTimestamp: UnixTime.ZERO,
    assetId: AssetId('test'),
    ...v,
  }
}
