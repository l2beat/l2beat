import { Logger } from '@l2beat/backend-tools'
import { AssetId, ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import {
  CirculatingSupplyRecord,
  CirculatingSupplyRepository,
} from './CirculatingSupplyRepository'

const START = UnixTime.fromDate(new Date('2022-05-17'))

const mockCirculatingSupply = (
  circulatingSupply: number,
  offset: number,
  assetId: AssetId,
  chainId: ChainId,
) => {
  return {
    timestamp: START.add(offset, 'hours'),
    circulatingSupply,
    assetId,
    chainId,
  }
}

describeDatabase(CirculatingSupplyRepository.name, (database) => {
  const repository = new CirculatingSupplyRepository(database, Logger.SILENT)

  const ASSET_1 = AssetId('dai-dai-stablecoin')
  const ASSET_2 = AssetId('asset-2')
  const C_SUPPLY = 1000000000000000000
  const DATA: CirculatingSupplyRecord[] = [
    mockCirculatingSupply(C_SUPPLY, 0, ASSET_1, ChainId.ETHEREUM),
    mockCirculatingSupply(C_SUPPLY, 1, ASSET_2, ChainId.ETHEREUM),
  ]

  beforeEach(async () => {
    // TODO: get rid of this, adding new tests is tricky because of it
    await repository.addMany(DATA)
  })

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(CirculatingSupplyRepository.prototype.getByTimestamp.name, () => {
    it('returns matching data for given timestamp', async () => {
      const additionalData = [
        mockCirculatingSupply(
          C_SUPPLY,
          0,
          AssetId('asset-a'),
          ChainId.ETHEREUM,
        ),
        mockCirculatingSupply(
          C_SUPPLY,
          0,
          AssetId('asset-b'),
          ChainId.ETHEREUM,
        ),
        mockCirculatingSupply(
          C_SUPPLY,
          0,
          AssetId('asset-c'),
          ChainId.ETHEREUM,
        ),
      ]
      await repository.addMany(additionalData)

      const result = await repository.getByTimestamp(ChainId.ETHEREUM, START)

      expect(result).toEqualUnsorted([DATA[0], ...additionalData])
    })

    it('returns empty list if no data exists for given timestamp', async () => {
      const result = await repository.getByTimestamp(
        ChainId.ETHEREUM,
        START.add(1, 'days'),
      )
      expect(result).toEqual([])
    })

    it('one project one asset', async () => {
      await repository.deleteAll()
      const data = [
        mockCirculatingSupply(C_SUPPLY, 0, ASSET_1, ChainId.ETHEREUM),
        mockCirculatingSupply(C_SUPPLY, 1, ASSET_1, ChainId.ETHEREUM),
        mockCirculatingSupply(C_SUPPLY, 2, ASSET_1, ChainId.ETHEREUM),
      ]

      await repository.addMany(data)

      const result = await repository.getByTimestamp(ChainId.ETHEREUM, START)
      expect(result).toEqual([
        {
          circulatingSupply: C_SUPPLY,
          timestamp: START,
          assetId: ASSET_1,
          chainId: ChainId.ETHEREUM,
        },
      ])
    })

    it('many projects many assets', async () => {
      await repository.deleteAll()
      const data = [
        mockCirculatingSupply(C_SUPPLY, 0, ASSET_1, ChainId.ETHEREUM),
        mockCirculatingSupply(C_SUPPLY, 1, ASSET_1, ChainId.ETHEREUM),
        mockCirculatingSupply(C_SUPPLY, 2, ASSET_1, ChainId.ETHEREUM),

        mockCirculatingSupply(C_SUPPLY, 0, ASSET_2, ChainId.ETHEREUM),
        mockCirculatingSupply(C_SUPPLY, 1, ASSET_2, ChainId.ETHEREUM),
        mockCirculatingSupply(C_SUPPLY, 2, ASSET_2, ChainId.ETHEREUM),
      ]

      await repository.addMany(data)

      const result = await repository.getByTimestamp(ChainId.ETHEREUM, START)
      expect(result).toEqualUnsorted([
        {
          circulatingSupply: C_SUPPLY,
          timestamp: START,
          assetId: ASSET_1,
          chainId: ChainId.ETHEREUM,
        },
        {
          circulatingSupply: C_SUPPLY,
          timestamp: START,
          assetId: ASSET_2,
          chainId: ChainId.ETHEREUM,
        },
      ])
    })

    it('take chainId into consideration', async () => {
      const resultEth = await repository.getByTimestamp(ChainId.ETHEREUM, START)
      expect(resultEth).toEqual([DATA[0]])

      const resultArb = await repository.getByTimestamp(ChainId.ARBITRUM, START)
      expect(resultArb).toEqual([])
    })
  })

  describe(
    CirculatingSupplyRepository.prototype.findDataBoundaries.name,
    () => {
      it('boundary of single and multi row data', async () => {
        await repository.deleteAll()

        const DATA: CirculatingSupplyRecord[] = [
          mockCirculatingSupply(C_SUPPLY, 0, ASSET_1, ChainId.ETHEREUM),
          mockCirculatingSupply(C_SUPPLY, 1, ASSET_1, ChainId.ETHEREUM),
          mockCirculatingSupply(C_SUPPLY, 0, ASSET_2, ChainId.ETHEREUM),
          mockCirculatingSupply(C_SUPPLY, 1, ASSET_2, ChainId.ETHEREUM),
        ]

        await repository.addMany(DATA)
        const result = await repository.findDataBoundaries()

        expect(result).toEqual(
          new Map([
            [
              ASSET_1,
              {
                earliest: START.add(0, 'hours'),
                latest: START.add(1, 'hours'),
              },
            ],
            [
              ASSET_2,
              {
                earliest: START.add(0, 'hours'),
                latest: START.add(1, 'hours'),
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
    },
  )

  describe(CirculatingSupplyRepository.prototype.addMany.name, () => {
    it('new rows only', async () => {
      const newRows: CirculatingSupplyRecord[] = [
        {
          circulatingSupply: C_SUPPLY,
          timestamp: START.add(2, 'hours'),
          assetId: AssetId('dai-dai-stablecoin'),
          chainId: ChainId.ETHEREUM,
        },
        {
          circulatingSupply: C_SUPPLY,
          timestamp: START.add(3, 'hours'),
          assetId: AssetId('dai-dai-stablecoin'),
          chainId: ChainId.ETHEREUM,
        },
      ]
      await repository.addMany(newRows)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted([...DATA, ...newRows])
    })

    it('skips empty row modification', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })

    it('batches inserts', async () => {
      const records: CirculatingSupplyRecord[] = []
      const now = UnixTime.now()
      for (let i = 5; i < 15_000; i++) {
        records.push({
          circulatingSupply: Math.floor(Math.random() * 1000),
          chainId: ChainId.ETHEREUM,
          timestamp: now.add(-i, 'hours'),
          assetId: AssetId('fake-coin'),
        })
      }
      await expect(repository.addMany(records)).not.toBeRejected()
    })
  })

  it(CirculatingSupplyRepository.prototype.getAll.name, async () => {
    const result = await repository.getAll()

    expect(result).toEqual(DATA)
  })

  it(CirculatingSupplyRepository.prototype.deleteAll.name, async () => {
    await repository.deleteAll()

    const result = await repository.getAll()

    expect(result).toEqual([])
  })

  describe(CirculatingSupplyRepository.prototype.deleteHourlyUntil.name, () => {
    it('deletes hourly reports', async () => {
      await repository.deleteAll()

      const start = UnixTime.now().toStartOf('day')
      const until = start.add(25, 'hours')

      const reports = []
      for (
        let i = start.toNumber();
        i <= until.toNumber();
        i += UnixTime.HOUR
      ) {
        reports.push(fakeCirculatingSupply({ timestamp: new UnixTime(i) }))
      }

      await repository.addMany(reports)
      await repository.deleteHourlyUntil(until)
      const results = await repository.getAll()

      expect(results).toEqualUnsorted([
        fakeCirculatingSupply({ timestamp: start }),
        fakeCirculatingSupply({ timestamp: start.add(6, 'hours') }),
        fakeCirculatingSupply({ timestamp: start.add(12, 'hours') }),
        fakeCirculatingSupply({ timestamp: start.add(18, 'hours') }),
        fakeCirculatingSupply({ timestamp: start.add(24, 'hours') }),
        fakeCirculatingSupply({ timestamp: start.add(25, 'hours') }),
      ])
    })
  })

  describe(
    CirculatingSupplyRepository.prototype.deleteSixHourlyUntil.name,
    () => {
      it('deletes six hourly reports', async () => {
        await repository.deleteAll()

        const start = UnixTime.now().toStartOf('day')
        const until = start.add(7, 'hours')

        const reports = []
        for (
          let i = start.toNumber();
          i <= until.toNumber();
          i += UnixTime.HOUR
        ) {
          reports.push(fakeCirculatingSupply({ timestamp: new UnixTime(i) }))
        }

        await repository.addMany(reports)
        await repository.deleteSixHourlyUntil(until)
        const results = await repository.getAll()

        expect(results).toEqualUnsorted([
          fakeCirculatingSupply({ timestamp: start }),
          fakeCirculatingSupply({ timestamp: start.add(1, 'hours') }),
          fakeCirculatingSupply({ timestamp: start.add(2, 'hours') }),
          fakeCirculatingSupply({ timestamp: start.add(3, 'hours') }),
          fakeCirculatingSupply({ timestamp: start.add(4, 'hours') }),
          fakeCirculatingSupply({ timestamp: start.add(5, 'hours') }),
          fakeCirculatingSupply({ timestamp: start.add(7, 'hours') }),
        ])
      })
    },
  )
})

function fakeCirculatingSupply(
  report?: Partial<CirculatingSupplyRecord>,
): CirculatingSupplyRecord {
  return {
    timestamp: UnixTime.ZERO,
    circulatingSupply: 0,
    assetId: AssetId('fake'),
    chainId: ChainId.ARBITRUM,
    ...report,
  }
}
