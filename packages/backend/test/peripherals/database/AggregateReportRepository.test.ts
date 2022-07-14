import { Logger, ProjectId, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import {
  AggregateReportRecord,
  AggregateReportRepository,
} from '../../../src/peripherals/database/AggregateReportRepository'
import { setupDatabaseTestSuite } from './shared/setup'

describe(AggregateReportRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new AggregateReportRepository(database, Logger.SILENT)

  const TIME_0 = UnixTime.now().toStartOf('day')
  const TIME_1 = TIME_0.add(1, 'hours')
  const TIME_2 = TIME_0.add(2, 'hours')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(AggregateReportRepository.prototype.getDaily.name, () => {
    it('filters data to get only full days', async () => {
      const REPORT = fakeAggregateReport({ timestamp: TIME_0 })
      await repository.addOrUpdateMany([
        REPORT,
        fakeAggregateReport({ timestamp: TIME_1 }),
      ])
      const result = await repository.getDaily()

      expect(result).toBeAnArrayWith(REPORT)
      expect(result).toBeAnArrayOfLength(1)
    })

    it('returns sorted data', async () => {
      const REPORTS = [
        fakeAggregateReport({ timestamp: TIME_0.add(-2, 'days') }),
        fakeAggregateReport({ timestamp: TIME_0.add(-1, 'days') }),
        fakeAggregateReport({ timestamp: TIME_0 }),
      ]
      await repository.addOrUpdateMany(REPORTS)
      const result = await repository.getDaily()

      expect(result).toEqual(REPORTS)
    })
  })

  describe(AggregateReportRepository.prototype.addOrUpdateMany.name, () => {
    it('add or update', async () => {
      const REPORTS_1 = [
        fakeAggregateReport({ timestamp: TIME_0 }),
        fakeAggregateReport({ timestamp: TIME_1 }),
      ]

      const REPORTS_2 = [
        fakeAggregateReport({ timestamp: TIME_1 }),
        fakeAggregateReport({ timestamp: TIME_2 }),
      ]
      await repository.addOrUpdateMany(REPORTS_1)

      await repository.addOrUpdateMany(REPORTS_2)

      const result = await repository.getAll()

      expect(result).toBeAnArrayWith(REPORTS_1[0], REPORTS_2[0], REPORTS_2[1])

      expect(result).toBeAnArrayOfLength(3)
    })

    it('empty array', async () => {
      await expect(repository.addOrUpdateMany([])).not.toBeRejected()
    })
  })

  it(AggregateReportRepository.prototype.getAll.name, async () => {
    const reports = [
      fakeAggregateReport({ timestamp: TIME_0 }),
      fakeAggregateReport({ timestamp: TIME_1 }),
    ]
    await repository.addOrUpdateMany(reports)

    const results = await repository.getAll()

    expect(results).toBeAnArrayWith(reports[0], reports[1])
    expect(results).toBeAnArrayOfLength(2)
  })

  it(AggregateReportRepository.prototype.deleteAll.name, async () => {
    await repository.addOrUpdateMany([
      fakeAggregateReport({ timestamp: TIME_0 }),
      fakeAggregateReport({ timestamp: TIME_1 }),
    ])

    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toBeAnArrayOfLength(0)
  })

  function fakeAggregateReport(
    report?: Partial<AggregateReportRecord>,
  ): AggregateReportRecord {
    return {
      timestamp: UnixTime.now(),
      projectId: ProjectId('fake-project'),
      tvlUsd: 1234n,
      tvlEth: 1234n,
      ...report,
    }
  }
})
