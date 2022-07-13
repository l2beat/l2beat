import { ApiMain, AssetId, Logger, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { ReportOutput } from '../../../src/api/controllers/report/generateReportOutput'
import { CachedDataRepository } from '../../../src/peripherals/database/CachedDataRepository'
import { setupDatabaseTestSuite } from './shared/setup'

const mockReport: ReportOutput = {
  aggregate: {
    types: ['date', 'usd', 'eth'],
    data: [],
  },
  byProject: {
    Arbitrum: {
      aggregate: {
        types: ['date', 'usd', 'eth'],
        data: [],
      },
      byToken: {
        DAI: {
          types: ['date', 'dai', 'usd'],
          data: [],
        },
      },
    },
  },
}

const mockApiMain: ApiMain = {
  charts: {
    daily: {
      types: ['timestamp', 'usd', 'eth'],
      data: [],
    },
  },
  projects: {
    Arbitrum: {
      charts: {
        daily: {
          types: ['timestamp', 'usd', 'eth'],
          data: [],
        },
      },
      tokens: [
        {
          assetId: AssetId.DAI,
          tvl: 0,
        },
      ],
    },
  },
}
describe(CachedDataRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new CachedDataRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.saveData(mockReport)
    await repository.saveMain(mockApiMain)
  })

  describe(CachedDataRepository.prototype.getData.name, () => {
    it('gets cached data', async () => {
      const data = await repository.getData()
      expect(data).toEqual(mockReport)
    })
  })

  describe(CachedDataRepository.prototype.getMain.name, () => {
    it('gets cached data', async () => {
      const data = await repository.getMain()
      expect(data).toEqual(mockApiMain)
    })
  })

  describe(CachedDataRepository.prototype.saveData.name, () => {
    it('saves data', async () => {
      const data: ReportOutput = {
        aggregate: {
          types: ['date', 'usd', 'eth'],
          data: [
            ['2022-06-01', 10_000, 100],
            ['2022-06-02', 20_000, 200],
            ['2022-06-03', 30_000, 300],
          ],
        },
        byProject: {
          Arbitrum: {
            aggregate: {
              types: ['date', 'usd', 'eth'],
              data: [],
            },
            byToken: {
              DAI: {
                types: ['date', 'dai', 'usd'],
                data: [],
              },
            },
          },
        },
      }

      await repository.saveData(data)
      const result = await repository.getData()
      expect(result).toEqual(data)
    })
  })

  describe(CachedDataRepository.prototype.saveMain.name, () => {
    it('saves main', async () => {
      const main: ApiMain = {
        charts: {
          daily: {
            types: ['timestamp', 'usd', 'eth'],
            data: [
              [UnixTime.fromDate(new Date('2022-06-01')), 10_000, 100],
              [UnixTime.fromDate(new Date('2022-06-02')), 20_000, 200],
              [UnixTime.fromDate(new Date('2022-06-03')), 30_000, 300],
            ],
          },
        },
        projects: {
          Arbitrum: {
            charts: {
              daily: {
                types: ['timestamp', 'usd', 'eth'],
                data: [],
              },
            },
            tokens: [
              {
                assetId: AssetId.DAI,
                tvl: 0,
              },
            ],
          },
        },
      }

      await repository.saveMain(main)
      const result = await repository.getMain()
      expect(result).toEqual(main)
    })
  })
})
