import { CoingeckoQueryService } from '@l2beat/shared'
import {
  CirculatingSupplyEntry,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { AmountRecord } from '../repositories/AmountRepository'
import { createAmountId } from '../utils/createAmountId'
import { CirculatingSupplyService } from './CirculatingSupplyService'

describe(CirculatingSupplyService.name, () => {
  describe(
    CirculatingSupplyService.prototype.fetchCirculatingSupplies.name,
    () => {
      it('fetches circulating supplies and returns them as big integers', async () => {
        const coingeckoQueryService = mockObject<CoingeckoQueryService>({
          getCirculatingSupplies: async () => [
            coingeckoResponse(100),
            coingeckoResponse(200),
            coingeckoResponse(300),
          ],
        })

        const service = new CirculatingSupplyService({
          coingeckoQueryService,
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
        })

        const result = await service.fetchCirculatingSupplies(from, to, config)

        expect(result).toEqual([
          amount(config, 100),
          amount(config, 200),
          amount(config, 300),
        ])

        expect(
          coingeckoQueryService.getCirculatingSupplies,
        ).toHaveBeenOnlyCalledWith(coingeckoId, { from, to }, undefined)
      })
    },
  )

  describe(CirculatingSupplyService.prototype.getAdjustedTo.name, () => {
    it('adjust range for coingecko hourly query range', () => {
      const from = 0
      const to = 100

      const service = new CirculatingSupplyService({
        coingeckoQueryService: mockObject<CoingeckoQueryService>({}),
      })

      const result = service.getAdjustedTo(from, to)

      const expected = CoingeckoQueryService.getAdjustedTo(
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
    deltaMs: 0,
  }
}
