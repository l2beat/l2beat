import { AssetId, Logger, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import {
  PriceRecord,
  PriceRepository,
} from '../../../src/peripherals/database/PriceRepository'
import { setupDatabaseTestSuite } from './setup'

describe(PriceRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new PriceRepository(database, Logger.SILENT)

  const START = UnixTime.now()
  const DATA = [
    {
      priceUsd: 3000,
      timestamp: START.add(-1, 'hours'),
      assetId: AssetId.ETH,
    },
    {
      priceUsd: 3100,
      timestamp: START.add(-2, 'hours'),
      assetId: AssetId.ETH,
    },
    {
      priceUsd: 20,
      timestamp: START.add(-1, 'hours'),
      assetId: AssetId('uni-uniswap'),
    },
    {
      priceUsd: 22,
      timestamp: START.add(-2, 'hours'),
      assetId: AssetId('uni-uniswap'),
    },
    {
      priceUsd: 1,
      timestamp: START,
      assetId: AssetId.DAI,
    },
  ]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.addMany(DATA)
  })

  describe(PriceRepository.prototype.addMany.name, () => {
    it('only new rows', async () => {
      const newRows = [
        {
          priceUsd: 3300,
          timestamp: UnixTime.fromDate(new Date()).add(-3, 'hours'),
          assetId: AssetId.ETH,
        },
        {
          priceUsd: 3500,
          timestamp: UnixTime.fromDate(new Date()).add(-4, 'hours'),
          assetId: AssetId.ETH,
        },
      ]
      await repository.addMany(newRows)

      const results = await repository.getAll()
      expect(results).toBeAnArrayWith(...DATA, ...newRows)
      expect(results).toBeAnArrayOfLength(7)
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })

    it('big query', async () => {
      const records: PriceRecord[] = []
      const now = UnixTime.now()
      for (let i = 5; i < 35_000; i++) {
        records.push({
          priceUsd: Math.random() * 1000,
          timestamp: now.add(-i, 'hours'),
          assetId: AssetId('fake-coin'),
        })
      }
      await expect(repository.addMany(records)).not.toBeRejected()
    })
  })

  it(PriceRepository.prototype.getAll.name, async () => {
    const results = await repository.getAll()

    expect(results).toBeAnArrayWith(...DATA)
    expect(results).toBeAnArrayOfLength(5)
  })

  it(PriceRepository.prototype.getByTimestamp.name, async () => {
    const timestamp = START.add(-1, 'hours')

    const results = await repository.getByTimestamp(timestamp)

    expect(results).toBeAnArrayWith(DATA[0], DATA[2])
  })

  it(PriceRepository.prototype.getByToken.name, async () => {
    const token = AssetId('uni-uniswap')
    const results = await repository.getByToken(token)

    expect(results).toBeAnArrayWith(...DATA.filter((d) => d.assetId === token))
    expect(results).toBeAnArrayOfLength(2)
  })

  it(PriceRepository.prototype.deleteAll.name, async () => {
    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toBeAnArrayOfLength(0)
  })

  describe(PriceRepository.prototype.calcDataBoundaries.name, () => {
    it('boundary of single and multi row data', async () => {
      const result = await repository.calcDataBoundaries()

      expect(result).toEqual(
        new Map([
          [
            AssetId.ETH,
            {
              earliest: START.add(-2, 'hours'),
              latest: START.add(-1, 'hours'),
            },
          ],
          [
            AssetId('uni-uniswap'),
            {
              earliest: START.add(-2, 'hours'),
              latest: START.add(-1, 'hours'),
            },
          ],
          [
            AssetId.DAI,
            {
              earliest: START,
              latest: START,
            },
          ],
        ]),
      )
    })
  })
})
