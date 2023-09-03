import { CoingeckoClient } from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { CoingeckoCirculatingSupplyProvider } from './CoingeckoCirculatingSupplyProvider'

describe(CoingeckoCirculatingSupplyProvider.name, () => {
  describe(
    CoingeckoCirculatingSupplyProvider.prototype.getCirculatingSupplies.name,
    () => {
      it('works for single token', async () => {
        const queryTimestamp = new UnixTime(123456)
        const coingeckoClient = mockObject<CoingeckoClient>({
          getCoinMarketChartRange: mockFn().resolvesToOnce({
            prices: [
              {
                date: queryTimestamp.add(-1, 'days').toDate(),
                price: 1.5,
              },
              { date: queryTimestamp.toDate(), price: 2.5 },
              {
                date: queryTimestamp.add(1, 'days').toDate(),
                price: 3.5,
              },
            ],
            marketCaps: [
              {
                date: queryTimestamp.add(-1, 'days').toDate(),
                marketCap: 10,
              },
              { date: queryTimestamp.toDate(), marketCap: 10 },
              {
                date: queryTimestamp.add(1, 'days').toDate(),
                marketCap: 10,
              },
            ],
          }),
        })
        const provider = new CoingeckoCirculatingSupplyProvider(
          coingeckoClient,
          ChainId.ARBITRUM,
        )

        const result = await provider.getCirculatingSupplies(
          [
            {
              assetId: AssetId('fake1'),
              decimals: 18,
              coingeckoId: CoingeckoId('fake1'),
              address: EthereumAddress.random(),
            },
          ],
          queryTimestamp,
        )
        expect(result).toEqual([
          {
            assetId: AssetId('fake1'),
            chainId: ChainId.ARBITRUM,
            circulatingSupply: 4000000000000000000n,
            timestamp: queryTimestamp,
          },
        ])
      })

      it('works for empty query', async () => {
        const coingeckoClient = mockObject<CoingeckoClient>()
        const provider = new CoingeckoCirculatingSupplyProvider(
          coingeckoClient,
          ChainId.ARBITRUM,
        )

        const result = await provider.getCirculatingSupplies(
          [],
          new UnixTime(123456),
        )
        expect(result).toEqual([])
      })
    },
  )
})
