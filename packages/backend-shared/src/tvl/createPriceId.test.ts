import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  type PriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { createPriceId } from './createPriceId'

describe(createPriceId.name, () => {
  const fields = [
    {
      key: 'address',
      newValue: EthereumAddress.random(),
      shouldUpdateHash: true,
    },
    {
      key: 'chain',
      newValue: 'new-chain',
      shouldUpdateHash: true,
    },
    {
      key: 'sinceTimestamp',
      newValue: new UnixTime(1),
      shouldUpdateHash: false,
    },
    {
      key: 'untilTimestamp',
      newValue: new UnixTime(2),
      shouldUpdateHash: false,
    },
    {
      key: 'coingeckoId',
      newValue: CoingeckoId('new-id'),
      shouldUpdateHash: true,
    },
  ]

  for (const f of fields) {
    it(f.key, () => {
      const pre = createPriceId(mock())

      const post = createPriceId(mock({ [f.key]: f.newValue }))

      if (f.shouldUpdateHash) {
        expect(pre).not.toEqual(post)
      } else {
        expect(pre).toEqual(post)
      }
    })
  }
})

function mock(v?: Partial<PriceConfigEntry>): PriceConfigEntry {
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
