import { Logger, ProjectId, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { BalanceRepository } from '../../../src/peripherals/database/BalanceRepository'
import { ReportRepository } from '../../../src/peripherals/database/ReportRepository'
import { fakeBalance, fakeReport } from '../../fakes'
import { setupDatabaseTestSuite } from './shared/setup'

describe(ReportRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const reportsRepository = new ReportRepository(database, Logger.SILENT)
  const balancesRepository = new BalanceRepository(database, Logger.SILENT)

  const TODAY = UnixTime.now().toStartOf('day')
  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  beforeEach(async () => {
    await balancesRepository.deleteAll()
    await reportsRepository.deleteAll()
  })

  describe(ReportRepository.prototype.getDaily.name, () => {
    it('filters data to get only full days', async () => {
      const REPORT = fakeReport({ timestamp: TODAY })
      await reportsRepository.addOrUpdateMany([REPORT])

      await balancesRepository.addOrUpdateMany([
        fakeBalance({
          timestamp: TODAY,
        }),
        fakeBalance({
          timestamp: TODAY.add(1, 'hours'),
        }),
      ])

      const result = await reportsRepository.getDaily()

      expect(result).toBeAnArrayWith(REPORT)
      expect(result).toBeAnArrayOfLength(1)
    })

    it('returns sorted data', async () => {
      const REPORTS = [
        fakeReport({ timestamp: TODAY }),
        fakeReport({ timestamp: TODAY.add(1, 'days') }),
        fakeReport({ timestamp: TODAY.add(2, 'days') }),
      ]
      await reportsRepository.addOrUpdateMany(REPORTS)

      await balancesRepository.addOrUpdateMany([
        fakeBalance({
          timestamp: TODAY,
        }),
        fakeBalance({
          timestamp: TODAY.add(1, 'days'),
        }),
        fakeBalance({
          timestamp: TODAY.add(2, 'days'),
        }),
      ])
      const result = await reportsRepository.getDaily()

      expect(result).toEqual(REPORTS)
    })
  })

  describe(ReportRepository.prototype.addOrUpdateMany.name, () => {
    it('add or update', async () => {
      const REPORTS_1 = [
        fakeReport({ timestamp: TODAY }),
        fakeReport({ timestamp: TODAY.add(1, 'hours') }),
      ]

      const REPORTS_2 = [
        fakeReport({ timestamp: TODAY.add(1, 'hours') }),
        fakeReport({ timestamp: TODAY.add(2, 'hours') }),
      ]
      await reportsRepository.addOrUpdateMany(REPORTS_1)

      await reportsRepository.addOrUpdateMany(REPORTS_2)

      const result = await reportsRepository.getAll()

      expect(result).toBeAnArrayWith(REPORTS_1[0], REPORTS_2[0], REPORTS_2[1])

      expect(result).toBeAnArrayOfLength(3)
    })

    it('empty array', async () => {
      await expect(reportsRepository.addOrUpdateMany([])).not.toBeRejected()
    })
  })

  it(ReportRepository.prototype.getAll.name, async () => {
    const reports = [fakeReport(), fakeReport()]
    await reportsRepository.addOrUpdateMany(reports)

    const results = await reportsRepository.getAll()

    expect(results).toBeAnArrayWith(reports[0], reports[1])
    expect(results).toBeAnArrayOfLength(2)
  })

  it(ReportRepository.prototype.deleteAll.name, async () => {
    await reportsRepository.addOrUpdateMany([fakeReport(), fakeReport()])

    await reportsRepository.deleteAll()

    const results = await reportsRepository.getAll()

    expect(results).toBeAnArrayOfLength(0)
  })

  it(ReportRepository.prototype.getLatestPerProject.name, async () => {
    const reports = [
      fakeReport({ projectId: PROJECT_A, timestamp: TODAY }),
      fakeReport({ projectId: PROJECT_B, timestamp: TODAY }),
      fakeReport({ projectId: PROJECT_A, timestamp: TODAY.add(1, 'hours') }),
      fakeReport({ projectId: PROJECT_B, timestamp: TODAY.add(1, 'hours') }),
    ]
    await reportsRepository.addOrUpdateMany(reports)

    const result = await reportsRepository.getLatestPerProject()

    expect(result).toEqual(
      new Map([
        [PROJECT_A, [reports[2]]],
        [PROJECT_B, [reports[3]]],
      ]),
    )
  })
})
