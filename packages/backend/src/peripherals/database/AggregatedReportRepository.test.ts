import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import {
  AggregatedReportRecord,
  AggregatedReportRepository,
} from './AggregatedReportRepository'

describe(AggregatedReportRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new AggregatedReportRepository(database, Logger.SILENT)

  const TIME_0 = UnixTime.now().toStartOf('day')
  const TIME_1 = TIME_0.add(1, 'hours')
  const TIME_2 = TIME_0.add(2, 'hours')

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(AggregatedReportRepository.prototype.getAggregateDaily.name, () => {
    it.only('works', async () => {
      const DAY_ONE = UnixTime.now().toStartOf('day')
      const DAY_TWO = DAY_ONE.add(1, 'days')
      const PROJECT_A = ProjectId('project-a')
      const PROJECT_B = ProjectId('project-b')

      const reports: AggregatedReportRecord[] = [
        {
          timestamp: DAY_ONE,
          projectId: PROJECT_A,
          usdValue: 100n,
          ethValue: 100_000n,
          reportType: 'TVL',
        },
        {
          timestamp: DAY_ONE,
          projectId: PROJECT_A,
          usdValue: 50n,
          ethValue: 50_000n,
          reportType: 'CBV',
        },
        {
          timestamp: DAY_ONE,
          projectId: PROJECT_A,
          usdValue: 20n,
          ethValue: 20_000n,
          reportType: 'EBV',
        },
        {
          timestamp: DAY_ONE,
          projectId: PROJECT_A,
          usdValue: 30n,
          ethValue: 30_000n,
          reportType: 'NMV',
        },
        {
          timestamp: DAY_ONE,
          projectId: PROJECT_B,
          usdValue: 100n,
          ethValue: 100_000n,
          reportType: 'TVL',
        },
        {
          timestamp: DAY_ONE,
          projectId: PROJECT_B,
          usdValue: 50n,
          ethValue: 50_000n,
          reportType: 'CBV',
        },
        {
          timestamp: DAY_ONE,
          projectId: PROJECT_B,
          usdValue: 20n,
          ethValue: 20_000n,
          reportType: 'EBV',
        },
        {
          timestamp: DAY_ONE,
          projectId: PROJECT_B,
          usdValue: 30n,
          ethValue: 30_000n,
          reportType: 'NMV',
        },
      ]

      const reports2: AggregatedReportRecord[] = [
        {
          timestamp: DAY_TWO,
          projectId: PROJECT_A,
          usdValue: 100n,
          ethValue: 100_000n,
          reportType: 'TVL',
        },
        {
          timestamp: DAY_TWO,
          projectId: PROJECT_A,
          usdValue: 50n,
          ethValue: 50_000n,
          reportType: 'CBV',
        },
        {
          timestamp: DAY_TWO,
          projectId: PROJECT_A,
          usdValue: 20n,
          ethValue: 20_000n,
          reportType: 'EBV',
        },
        {
          timestamp: DAY_TWO,
          projectId: PROJECT_A,
          usdValue: 30n,
          ethValue: 30_000n,
          reportType: 'NMV',
        },
        {
          timestamp: DAY_TWO,
          projectId: PROJECT_B,
          usdValue: 100n,
          ethValue: 100_000n,
          reportType: 'TVL',
        },
        {
          timestamp: DAY_TWO,
          projectId: PROJECT_B,
          usdValue: 50n,
          ethValue: 50_000n,
          reportType: 'CBV',
        },
        {
          timestamp: DAY_TWO,
          projectId: PROJECT_B,
          usdValue: 20n,
          ethValue: 20_000n,
          reportType: 'EBV',
        },
        {
          timestamp: DAY_TWO,
          projectId: PROJECT_B,
          usdValue: 30n,
          ethValue: 30_000n,
          reportType: 'NMV',
        },
      ]

      await repository.addOrUpdateMany(reports)
      await repository.addOrUpdateMany(reports2)

      const result = await repository.getAggregateDaily([PROJECT_A, PROJECT_B])

      expect(result).toEqual([
        {
          timestamp: DAY_TWO,
          tvlUsdValue: 2n * 100n,
          tvlEthValue: 2n * 100_000n,
          cbvUsdValue: 2n * 50n,
          cbvEthValue: 2n * 50_000n,
          ebvUsdValue: 2n * 20n,
          ebvEthValue: 2n * 20_000n,
          nmvUsdValue: 2n * 30n,
          nmvEthValue: 2n * 30_000n,
        },
        {
          timestamp: DAY_ONE,
          tvlUsdValue: 2n * 100n,
          tvlEthValue: 2n * 100_000n,
          cbvUsdValue: 2n * 50n,
          cbvEthValue: 2n * 50_000n,
          ebvUsdValue: 2n * 20n,
          ebvEthValue: 2n * 20_000n,
          nmvUsdValue: 2n * 30n,
          nmvEthValue: 2n * 30_000n,
        },
      ])
    })
  })

  describe(AggregatedReportRepository.prototype.getDaily.name, () => {
    it('returns only full days', async () => {
      const REPORT = fakeAggregateReport({ timestamp: TIME_0 })
      await repository.addOrUpdateMany([REPORT])
      await repository.addOrUpdateMany([
        fakeAggregateReport({ timestamp: TIME_1 }),
      ])
      const result = await repository.getDaily('TVL')
      expect(result).toEqual([REPORT])
    })

    it('returns sorted data', async () => {
      const REPORTS = [
        fakeAggregateReport({ timestamp: TIME_0.add(-2, 'days') }),
        fakeAggregateReport({ timestamp: TIME_0.add(-1, 'days') }),
        fakeAggregateReport({ timestamp: TIME_0 }),
      ]
      await repository.addOrUpdateMany([REPORTS[0]])
      await repository.addOrUpdateMany([REPORTS[1]])
      await repository.addOrUpdateMany([REPORTS[2]])
      const result = await repository.getDaily('TVL')
      expect(result).toEqual(REPORTS)
    })
  })

  describe(AggregatedReportRepository.prototype.getSixHourly.name, () => {
    it('returns only six hourly reports', async () => {
      const REPORT = fakeAggregateReport({ timestamp: TIME_0.add(-6, 'hours') })
      await repository.addOrUpdateMany([REPORT])
      await repository.addOrUpdateMany([
        fakeAggregateReport({ timestamp: TIME_0.add(-8, 'hours') }),
      ])
      await repository.addOrUpdateMany([
        fakeAggregateReport({
          timestamp: TIME_0.add(-90, 'days').add(-1, 'minutes'),
        }),
      ])
      const result = await repository.getSixHourly(
        TIME_0.add(-1, 'days'),
        'TVL',
      )
      expect(result).toEqual([REPORT])
    })

    it('returns sorted data', async () => {
      const REPORTS = [
        fakeAggregateReport({ timestamp: TIME_0.add(-12, 'hours') }),
        fakeAggregateReport({ timestamp: TIME_0.add(-6, 'hours') }),
        fakeAggregateReport({ timestamp: TIME_0 }),
      ]
      await repository.addOrUpdateMany([REPORTS[0]])
      await repository.addOrUpdateMany([REPORTS[1]])
      await repository.addOrUpdateMany([REPORTS[2]])
      const result = await repository.getSixHourly(
        TIME_0.add(-1, 'days'),
        'TVL',
      )
      expect(result).toEqual(REPORTS)
    })
  })

  describe(AggregatedReportRepository.prototype.getHourly.name, () => {
    it('returns only last 7 days', async () => {
      const REPORT = fakeAggregateReport({ timestamp: TIME_0 })
      await repository.addOrUpdateMany([REPORT])
      await repository.addOrUpdateMany([
        fakeAggregateReport({
          timestamp: TIME_0.add(-7, 'days').add(-1, 'minutes'),
        }),
      ])
      const result = await repository.getHourly(TIME_0.add(-1, 'days'), 'TVL')
      expect(result).toEqual([REPORT])
    })

    it('returns sorted data', async () => {
      const REPORTS = [
        fakeAggregateReport({ timestamp: TIME_0.add(-2, 'days') }),
        fakeAggregateReport({ timestamp: TIME_0.add(-1, 'days') }),
        fakeAggregateReport({ timestamp: TIME_0 }),
      ]
      await repository.addOrUpdateMany([REPORTS[0]])
      await repository.addOrUpdateMany([REPORTS[1]])
      await repository.addOrUpdateMany([REPORTS[2]])
      const result = await repository.getHourly(TIME_0.add(-7, 'days'), 'TVL')
      expect(result).toEqual(REPORTS)
    })
  })

  describe(AggregatedReportRepository.prototype.addOrUpdateMany.name, () => {
    it('replaces existing records', async () => {
      const REPORTS = [
        fakeAggregateReport({
          projectId: ProjectId('1'),
          timestamp: TIME_1,
          usdValue: 1n,
        }),
        fakeAggregateReport({
          projectId: ProjectId('2'),
          timestamp: TIME_1,
          usdValue: 2n,
        }),
        fakeAggregateReport({
          projectId: ProjectId('3'),
          timestamp: TIME_1,
          usdValue: 3n,
        }),
        fakeAggregateReport({
          projectId: ProjectId('4'),
          timestamp: TIME_1,
          usdValue: 4n,
        }),
      ]
      await repository.addOrUpdateMany(REPORTS.slice(0, 2))
      expect(await repository.getAll()).toEqual(REPORTS.slice(0, 2))
      await repository.addOrUpdateMany(REPORTS.slice(2))
      expect(await repository.getAll()).toEqual(REPORTS.slice(2))
    })

    it('handles empty array', async () => {
      await expect(repository.addOrUpdateMany([])).not.toBeRejected()
    })

    it('throws if timestamps do not match', async () => {
      await expect(
        repository.addOrUpdateMany([
          fakeAggregateReport({ timestamp: TIME_1 }),
          fakeAggregateReport({ timestamp: TIME_2 }),
        ]),
      ).toBeRejectedWith('Assertion Error: Timestamps must match')
    })
  })

  describe(AggregatedReportRepository.prototype.findLatest.name, () => {
    it('finds latest report', async () => {
      const reports = [
        fakeAggregateReport({ projectId: PROJECT_A, timestamp: TIME_0 }),
        fakeAggregateReport({ projectId: PROJECT_B, timestamp: TIME_0 }),
      ]
      const expected = fakeAggregateReport({
        projectId: PROJECT_A,
        timestamp: TIME_1,
      })
      await repository.addOrUpdateMany(reports)
      await repository.addOrUpdateMany([expected])
      const result = await repository.findLatest(PROJECT_A, 'TVL')
      expect(result).toEqual(expected)
    })
  })

  describe(AggregatedReportRepository.prototype.getAll.name, () => {
    it('returns all records', async () => {
      const reports = [
        fakeAggregateReport({ projectId: PROJECT_A, timestamp: TIME_0 }),
        fakeAggregateReport({ projectId: PROJECT_B, timestamp: TIME_0 }),
      ]
      await repository.addOrUpdateMany(reports)
      const results = await repository.getAll()
      expect(results).toEqual(reports)
    })
  })

  describe(AggregatedReportRepository.prototype.deleteAll.name, () => {
    it('deletes all reports', async () => {
      const reports = [
        fakeAggregateReport({ projectId: PROJECT_A, timestamp: TIME_0 }),
        fakeAggregateReport({ projectId: PROJECT_B, timestamp: TIME_0 }),
      ]
      await repository.addOrUpdateMany(reports)
      await repository.deleteAll()
      const results = await repository.getAll()
      expect(results).toEqual([])
    })
  })
})

function fakeAggregateReport(
  report?: Partial<AggregatedReportRecord>,
): AggregatedReportRecord {
  return {
    timestamp: UnixTime.now(),
    projectId: ProjectId('fake-project'),
    usdValue: 1234n,
    ethValue: 1234n,
    reportType: 'TVL',
    ...report,
  }
}
