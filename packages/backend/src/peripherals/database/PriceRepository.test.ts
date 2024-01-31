import { Logger } from '@l2beat/backend-tools'
import { AssetId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { PriceRecord, PriceRepository } from './PriceRepository'

describeDatabase(PriceRepository.name, (database) => {
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
    await repository.addMany(DATA)
  })

  afterEach(async () => {
    await repository.deleteAll()
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
      expect(results).toEqualUnsorted([...DATA, ...newRows])
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })

    it('big query', async () => {
      const records: PriceRecord[] = []
      const now = UnixTime.now()
      for (let i = 5; i < 15_000; i++) {
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

    expect(results).toEqualUnsorted(DATA)
  })

  it(PriceRepository.prototype.getByTimestamp.name, async () => {
    const timestamp = START.add(-1, 'hours')

    const results = await repository.getByTimestamp(timestamp)

    expect(results).toEqualUnsorted([DATA[0], DATA[2]])
  })

  it(PriceRepository.prototype.getByToken.name, async () => {
    const token = AssetId('uni-uniswap')
    const results = await repository.getByToken(token)

    expect(results).toEqualUnsorted(DATA.filter((d) => d.assetId === token))
  })

  it(PriceRepository.prototype.deleteAll.name, async () => {
    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toEqual([])
  })

  describe(PriceRepository.prototype.findDataBoundaries.name, () => {
    it('boundary of single and multi row data', async () => {
      const result = await repository.findDataBoundaries()

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

    it('works with empty database', async () => {
      await repository.deleteAll()

      const result = await repository.findDataBoundaries()

      expect(result).toEqual(new Map())
    })
  })

  describe(PriceRepository.prototype.findLatestByTokenBetween.name, () => {
    it('gets most recent record of each token', async () => {
      await repository.deleteAll()
      await repository.addMany([
        {
          priceUsd: 3000,
          timestamp: START.add(-1, 'days'),
          assetId: AssetId.ETH,
        },
        {
          priceUsd: 1,
          timestamp: START,
          assetId: AssetId.DAI,
        },
      ])

      const result = await repository.findLatestByTokenBetween(
        START.add(-1, 'days'),
        START.add(-1, 'hours'),
      )

      expect(result).toEqual(new Map([[AssetId.ETH, START.add(-1, 'days')]]))
    })

    it('works with empty database', async () => {
      await repository.deleteAll()

      const result = await repository.findLatestByTokenBetween(
        START.add(-1, 'days'),
        START.add(-1, 'hours'),
      )

      expect(result).toEqual(new Map())
    })
  })

  describe(PriceRepository.prototype.deleteHourlyUntil.name, () => {
    it('deletes hourly reports', async () => {
      await repository.deleteAll()

      const start = UnixTime.now().toStartOf('day')
      const until = start.add(25, 'hours')

      const entries = []
      for (
        let i = start.toNumber();
        i <= until.toNumber();
        i += UnixTime.HOUR
      ) {
        entries.push(fakePriceRecord({ timestamp: new UnixTime(i) }))
      }

      await repository.addMany(entries)
      await repository.deleteHourlyUntil(until)
      const results = await repository.getAll()

      expect(results).toEqualUnsorted([
        fakePriceRecord({ timestamp: start }),
        fakePriceRecord({ timestamp: start.add(6, 'hours') }),
        fakePriceRecord({ timestamp: start.add(12, 'hours') }),
        fakePriceRecord({ timestamp: start.add(18, 'hours') }),
        fakePriceRecord({ timestamp: start.add(24, 'hours') }),
        fakePriceRecord({ timestamp: start.add(25, 'hours') }),
      ])
    })
  })

  describe(PriceRepository.prototype.deleteSixHourlyUntil.name, () => {
    it('deletes six hourly reports', async () => {
      await repository.deleteAll()

      const start = UnixTime.now().toStartOf('day')
      const until = start.add(7, 'hours')

      const entries = []
      for (
        let i = start.toNumber();
        i <= until.toNumber();
        i += UnixTime.HOUR
      ) {
        entries.push(fakePriceRecord({ timestamp: new UnixTime(i) }))
      }

      await repository.addMany(entries)
      await repository.deleteSixHourlyUntil(until)
      const results = await repository.getAll()

      expect(results).toEqualUnsorted([
        fakePriceRecord({ timestamp: start }),
        fakePriceRecord({ timestamp: start.add(1, 'hours') }),
        fakePriceRecord({ timestamp: start.add(2, 'hours') }),
        fakePriceRecord({ timestamp: start.add(3, 'hours') }),
        fakePriceRecord({ timestamp: start.add(4, 'hours') }),
        fakePriceRecord({ timestamp: start.add(5, 'hours') }),
        fakePriceRecord({ timestamp: start.add(7, 'hours') }),
      ])
    })
  })
})

function fakePriceRecord(report?: Partial<PriceRecord>): PriceRecord {
  return {
    timestamp: UnixTime.ZERO,
    assetId: AssetId.ETH,
    priceUsd: 0,
    ...report,
  }
}
