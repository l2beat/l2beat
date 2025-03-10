import { createAmountId } from '@l2beat/backend-shared'
import { Logger } from '@l2beat/backend-tools'
import type { AmountRecord, Database } from '@l2beat/database'
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
import { expect, mockFn, mockObject } from 'earl'
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
        logger: Logger.SILENT,
        database: mockObject<Database>(),
      })

      const from = UnixTime(100)
      const to = UnixTime(300)
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

    it('returns DB record when CirculatingSupplyProvider fails', async () => {
      const to = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))
      const from = to - 1 * UnixTime.HOUR + 1 // indexer ticks
      const lastFetched = to - 1 * UnixTime.HOUR

      const coingeckoId = CoingeckoId('coingecko-id')
      const config = mockObject<CirculatingSupplyEntry>({
        chain: 'chain',
        project: ProjectId('project'),
        type: 'circulatingSupply',
        address: EthereumAddress.random(),
        coingeckoId,
        decimals: 18,
        category: 'other',
      })

      const configId = createAmountId(config)
      const configWithId = { ...config, id: configId }

      const circulatingSupplyProvider = mockObject<CirculatingSupplyProvider>({
        getCirculatingSupplies: mockFn().rejectsWith(new Error('error')),
      })

      const amountTable = mockObject<Database['amount']>({
        getLatestAmount: async () => ({
          configId,
          timestamp: lastFetched,
          amount: BigInt(lastFetched) * 10n ** 18n,
        }),
      })

      const service = new CirculatingSupplyService({
        circulatingSupplyProvider,
        database: mockObject<Database>({ amount: amountTable }),
        logger: Logger.SILENT,
      })

      const result = await service.fetchCirculatingSupplies(
        from,
        to,
        configWithId,
      )

      expect(result).toEqual([
        {
          configId,
          timestamp: to,
          amount: BigInt(lastFetched) * 10n ** 18n,
        },
      ])

      expect(
        circulatingSupplyProvider.getCirculatingSupplies,
      ).toHaveBeenOnlyCalledWith(coingeckoId, { from, to })
      expect(amountTable.getLatestAmount).toHaveBeenOnlyCalledWith(configId)
    })

    it('works only for latest hour', async () => {
      const coingeckoId = CoingeckoId('coingecko-id')
      const to = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))
      const from = to - 365 * UnixTime.DAY

      const config = mockObject<CirculatingSupplyEntry>({
        chain: 'chain',
        project: ProjectId('project'),
        type: 'circulatingSupply',
        address: EthereumAddress.random(),
        coingeckoId,
        decimals: 18,
        category: 'other',
      })

      const configId = createAmountId(config)
      const configWithId = { ...config, id: configId }

      const circulatingSupplyProvider = mockObject<CirculatingSupplyProvider>({
        getCirculatingSupplies: mockFn().rejectsWith(new Error('error')),
      })

      const service = new CirculatingSupplyService({
        circulatingSupplyProvider,
        database: mockObject<Database>(),
        logger: Logger.SILENT,
      })

      await expect(
        async () =>
          await service.fetchCirculatingSupplies(from, to, configWithId),
      ).toBeRejectedWith('error')
    })
  })

  describe(CirculatingSupplyService.prototype.getAdjustedTo.name, () => {
    it('adjust range for coingecko hourly query range', () => {
      const from = 0
      const to = 100

      const circulatingSupplyProvider = new CirculatingSupplyService({
        circulatingSupplyProvider: mockObject<CirculatingSupplyProvider>({}),
        logger: Logger.SILENT,
        database: mockObject<Database>(),
      })

      const result = circulatingSupplyProvider.getAdjustedTo(from, to)

      const expected = CoingeckoQueryService.calculateAdjustedTo(
        UnixTime(from),
        UnixTime(to),
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
    timestamp: UnixTime(timestamp),
    amount: BigInt(timestamp) * 10n ** BigInt(config.decimals), // for the sake of tests simplicity it is the same
  }
}

function coingeckoResponse(timestamp: number) {
  return {
    timestamp: UnixTime(timestamp),
    value: timestamp, // for the sake of tests simplicity it is the same
  }
}
