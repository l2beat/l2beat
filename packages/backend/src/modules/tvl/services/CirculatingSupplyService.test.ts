import { createAmountId } from '@l2beat/backend-shared'
import type { AmountRecord } from '@l2beat/database'
import {
  type CirculatingSupplyProvider,
  CoingeckoQueryService,
} from '@l2beat/shared'
import {
  type CirculatingSupplyEntry,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { CirculatingSupplyService } from './CirculatingSupplyService'

describe(CirculatingSupplyService.name, () => {
  describe(CirculatingSupplyService.prototype.fetchCirculatingSupplies
    .name, () => {
    it('fetches circulating supplies and returns them as big integers', async () => {
      const circulatingSupplyProvider = mockObject<CirculatingSupplyProvider>({
        getCirculatingSupplies: async () => [
          coingeckoResponse(100),
          coingeckoResponse(200),
          coingeckoResponse(300),
        ],
      })

      const service = new CirculatingSupplyService({
        circulatingSupplyProvider: circulatingSupplyProvider,
      })

      const from = new UnixTime(100)
      const to = new UnixTime(300)
      const coingeckoId = CoingeckoId('id')
      const config = mockObject<CirculatingSupplyEntry>({
        chain: 'chain',
        project: ProjectId('project'),
        type: 'circulatingSupply',
        address: EthereumAddress.random(),
        coingeckoId,
        decimals: 18,
        category: 'other',
      })

      const result = await service.fetchCirculatingSupplies(from, to, {
        ...config,
        id: createAmountId(config),
      })

      expect(result).toEqual([
        amount(config, 100),
        amount(config, 200),
        amount(config, 300),
      ])

      expect(
        circulatingSupplyProvider.getCirculatingSupplies,
      ).toHaveBeenOnlyCalledWith(coingeckoId, { from, to })
    })
  })

  describe(CirculatingSupplyService.prototype.getAdjustedTo.name, () => {
    it('adjust range for coingecko hourly query range', () => {
      const from = 0
      const to = 100

      const circulatingSupplyProvider = new CirculatingSupplyService({
        circulatingSupplyProvider: mockObject<CirculatingSupplyProvider>({}),
      })

      const result = circulatingSupplyProvider.getAdjustedTo(from, to)

      const expected = CoingeckoQueryService.calculateAdjustedTo(
        new UnixTime(from),
        new UnixTime(to),
      )

      expect(result).toEqual(expected)
    })
  })
})

function amount(
  config: CirculatingSupplyEntry,
  timestamp: number,
): AmountRecord {
  return {
    configId: createAmountId(config),
    timestamp: new UnixTime(timestamp),
    amount: BigInt(timestamp) * 10n ** BigInt(config.decimals), // for the sake of tests simplicity it is the same
  }
}

function coingeckoResponse(timestamp: number) {
  return {
    timestamp: new UnixTime(timestamp),
    value: timestamp, // for the sake of tests simplicity it is the same
  }
}
