import { Logger } from '@l2beat/common'
import { expect } from 'earljs'

import { ReportOutput } from '../../../src/api/controllers/report/generateReportOutput'
import { CachedDataRepository } from '../../../src/peripherals/database/CachedDataRepository'
import { setupDatabaseTestSuite } from './setup'

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

describe(CachedDataRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new CachedDataRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.saveData(mockReport)
  })

  describe(CachedDataRepository.prototype.getData.name, () => {
    it('gets cached data', async () => {
      const data = await repository.getData()
      expect(data).toEqual(mockReport)
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
})
