import { CoingeckoId, Logger, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { PriceRepository } from '../../../src/peripherals/database/PriceRepository'
import { setupDatabaseTestSuite } from './setup'

describe(PriceRepository.name, () => {
  const { knex } = setupDatabaseTestSuite()
  const repository = new PriceRepository(knex, Logger.SILENT)

  const DATA = [
    {
      priceUsd: 3000,
      timestamp: UnixTime.fromDate(new Date()).add(-1, 'hours'),
      coingeckoId: CoingeckoId('ethereum'),
    },
    {
      priceUsd: 3100,
      timestamp: UnixTime.fromDate(new Date()).add(-2, 'hours'),
      coingeckoId: CoingeckoId('ethereum'),
    },
    {
      priceUsd: 20,
      timestamp: UnixTime.fromDate(new Date()).add(-1, 'hours'),
      coingeckoId: CoingeckoId('uniswap'),
    },
    {
      priceUsd: 22,
      timestamp: UnixTime.fromDate(new Date()).add(-2, 'hours'),
      coingeckoId: CoingeckoId('uniswap'),
    },
  ]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.addOrUpdate(DATA)
  })

  describe(PriceRepository.prototype.addOrUpdate.name, () => {
    it('only new rows', async () => {
      const newRows = [
        {
          priceUsd: 3300,
          timestamp: UnixTime.fromDate(new Date()).add(-3, 'hours'),
          coingeckoId: CoingeckoId('ethereum'),
        },
        {
          priceUsd: 3500,
          timestamp: UnixTime.fromDate(new Date()).add(-4, 'hours'),
          coingeckoId: CoingeckoId('ethereum'),
        },
      ]
      await repository.addOrUpdate(newRows)

      const results = await repository.getAll()
      expect(results).toBeAnArrayWith(...DATA, ...newRows)
      expect(results).toBeAnArrayOfLength(6)
    })

    it('only existing rows', async () => {
      const existingRows = [
        {
          priceUsd: 3000.1,
          timestamp: DATA[0].timestamp,
          coingeckoId: DATA[0].coingeckoId,
        },
        {
          priceUsd: 3100.1,
          timestamp: DATA[1].timestamp,
          coingeckoId: DATA[1].coingeckoId,
        },
      ]
      await repository.addOrUpdate(existingRows)

      const results = await repository.getAll()
      expect(results).toBeAnArrayWith(DATA[2], DATA[3], ...existingRows)
      expect(results).toBeAnArrayOfLength(4)
    })

    it('mixed: new and existing rows', async () => {
      const mixedRows = [
        {
          priceUsd: 3000.1,
          timestamp: DATA[1].timestamp,
          coingeckoId: DATA[1].coingeckoId,
        },
        {
          priceUsd: 3300.1,
          timestamp: UnixTime.fromDate(new Date()).add(-3, 'hours'),
          coingeckoId: CoingeckoId('ethereum'),
        },
      ]

      await repository.addOrUpdate(mixedRows)
      const results = await repository.getAll()
      expect(results).toBeAnArrayWith(DATA[0], DATA[2], DATA[3], ...mixedRows)
      expect(results).toBeAnArrayOfLength(5)
    })
  })

  it(PriceRepository.prototype.getAll.name, async () => {
    const results = await repository.getAll()

    expect(results).toBeAnArrayWith(...DATA)
    expect(results).toBeAnArrayOfLength(4)
  })

  it(PriceRepository.prototype.getAllByToken.name, async () => {
    const token = CoingeckoId('uniswap')
    const results = await repository.getAllByToken(token)

    expect(results).toBeAnArrayWith(
      ...DATA.filter((d) => d.coingeckoId === token)
    )
    expect(results).toBeAnArrayOfLength(2)
  })

  it(PriceRepository.prototype.deleteAll.name, async () => {
    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toBeAnArrayOfLength(0)
  })
})
