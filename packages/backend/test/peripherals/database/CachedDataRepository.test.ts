import { Logger } from '@l2beat/common'
import { expect } from 'earljs'

import { ReportOutput } from '../../../src/api/controllers/report/generateReportOutput'
import { CachedDataRepository } from '../../../src/peripherals/database/CachedDataRepository'
import { setupDatabaseTestSuite } from './setup'

describe(CachedDataRepository.name, () => {
  const { knex } = setupDatabaseTestSuite()

  const repository = new CachedDataRepository(knex, Logger.SILENT)

  const DATA: ReportOutput = {
    aggregate: {
      types: ['date', 'usd', 'eth'],
      data: [],
    },
    byProject: {
      ['Arbitrum']: {
        aggregate: {
          types: ['date', 'usd', 'eth'],
          data: [],
        },
        byToken: {
          ['DAI']: {
            types: ['date', 'dai', 'usd'],
            data: [],
          },
        },
      },
    },
  }

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.saveData(DATA)
  })

  it(CachedDataRepository.prototype.getData.name, async () => {
    const data = await repository.getData()

    expect(data).toEqual(DATA)
  })

  it(CachedDataRepository.prototype.saveData.name, async () => {
    const DATA2: ReportOutput = {
      aggregate: {
        types: ['date', 'usd', 'eth'],
        data: [
          ['1', 1, 1],
          ['1', 1, 1],
          ['1', 1, 1],
        ],
      },
      byProject: {
        ['Arbitrum']: {
          aggregate: {
            types: ['date', 'usd', 'eth'],
            data: [],
          },
          byToken: {
            ['DAI']: {
              types: ['date', 'dai', 'usd'],
              data: [],
            },
          },
        },
      },
    }

    await repository.saveData(DATA2)

    const data = await repository.getData()

    expect(data).toEqual(DATA2)
  })
})
