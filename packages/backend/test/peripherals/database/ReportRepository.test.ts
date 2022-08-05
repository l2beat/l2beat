import { AssetId, Logger, ProjectId, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import {
  ReportRecord,
  ReportRepository,
} from '../../../src/peripherals/database/ReportRepository'
import { setupDatabaseTestSuite } from './shared/setup'

describe(ReportRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new ReportRepository(database, Logger.SILENT)

  const TIME_0 = UnixTime.now().toStartOf('day')
  const TIME_1 = TIME_0.add(1, 'hours')

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')
  const PROJECT_C = ProjectId('project-c')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(ReportRepository.prototype.getDaily.name, () => {
    it('returns only full days', async () => {
      const dailyReport = fakeReport({ timestamp: TIME_0 })
      await repository.addOrUpdateMany([dailyReport])
      await repository.addOrUpdateMany([
        fakeReport({ timestamp: TIME_0.add(1, 'hours') }),
      ])
      const result = await repository.getDaily()
      expect(result).toEqual([dailyReport])
    })

    it('returns sorted data', async () => {
      const REPORTS = [
        fakeReport({ timestamp: TIME_0.add(-2, 'days') }),
        fakeReport({ timestamp: TIME_0.add(-1, 'days') }),
        fakeReport({ timestamp: TIME_0 }),
      ]
      await repository.addOrUpdateMany([REPORTS[0]])
      await repository.addOrUpdateMany([REPORTS[1]])
      await repository.addOrUpdateMany([REPORTS[2]])
      const result = await repository.getDaily()
      expect(result).toEqual(REPORTS)
    })
  })

  describe(ReportRepository.prototype.addOrUpdateMany.name, () => {
    it('replaces existing records', async () => {
      const REPORTS_1 = [
        fakeReport({ asset: AssetId.DAI, timestamp: TIME_1, balance: 1n }),
        fakeReport({ asset: AssetId.ETH, timestamp: TIME_1, balance: 1n }),
        fakeReport({
          projectId: ProjectId('arbitrum'),
          asset: AssetId.ETH,
          timestamp: TIME_1,
          balance: 1n,
        }),
      ]
      await repository.addOrUpdateMany(REPORTS_1)
      expect(await repository.getAll()).toEqual(REPORTS_1)
      const REPORTS_2 = [
        fakeReport({ asset: AssetId.DAI, timestamp: TIME_1, balance: 2n }),
        fakeReport({
          projectId: ProjectId('dydx'),
          asset: AssetId.ETH,
          timestamp: TIME_1,
          balance: 2n,
        }),
      ]
      await repository.addOrUpdateMany(REPORTS_2)
      expect(await repository.getAll()).toEqual(REPORTS_2)
    })

    it('handles empty array', async () => {
      await expect(repository.addOrUpdateMany([])).not.toBeRejected()
    })

    it('throws if timestamps do not match', async () => {
      await expect(
        repository.addOrUpdateMany([
          fakeReport({ projectId: PROJECT_A, timestamp: TIME_0 }),
          fakeReport({ projectId: PROJECT_B, timestamp: TIME_0 }),
          fakeReport({ projectId: PROJECT_C, timestamp: TIME_1 }),
        ]),
      ).toBeRejected('Programmer error: Timestamps must match')
    })
  })

  describe(ReportRepository.prototype.getAll.name, () => {
    it('returns all reports', async () => {
      const reports = [
        fakeReport({ projectId: PROJECT_A, timestamp: TIME_0 }),
        fakeReport({ projectId: PROJECT_B, timestamp: TIME_0 }),
      ]
      await repository.addOrUpdateMany(reports)
      const results = await repository.getAll()
      expect(results).toEqual(reports)
    })
  })

  describe(ReportRepository.prototype.deleteAll.name, () => {
    it('deletes all reports', async () => {
      const reports = [
        fakeReport({ projectId: PROJECT_A, timestamp: TIME_0 }),
        fakeReport({ projectId: PROJECT_B, timestamp: TIME_0 }),
      ]
      await repository.addOrUpdateMany(reports)
      await repository.deleteAll()
      const results = await repository.getAll()
      expect(results).toEqual([])
    })
  })

  describe(ReportRepository.prototype.getDailyByProjectAndAsset.name, () => {
    it('returns all daily reports for a given asset and project', async () => {
      const asset = AssetId('my-asset')
      const report = fakeReport({
        projectId: PROJECT_A,
        asset,
        timestamp: TIME_0,
      })
      await repository.addOrUpdateMany([
        report,
        fakeReport({ projectId: PROJECT_B, timestamp: TIME_0 }),
      ])
      await repository.addOrUpdateMany([
        fakeReport({ projectId: PROJECT_A, timestamp: TIME_1 }),
        fakeReport({ projectId: PROJECT_B, timestamp: TIME_1 }),
      ])
      const result = await repository.getDailyByProjectAndAsset(
        PROJECT_A,
        asset,
      )
      expect(result).toEqual([report])
    })
  })

  describe(
    ReportRepository.prototype.getSixHourlyByProjectAndAsset.name,
    () => {
      it('returns six hourly reports for a given asset and project', async () => {
        const asset = AssetId('my-asset')
        const report = fakeReport({
          projectId: PROJECT_A,
          asset,
          timestamp: TIME_0.add(6, 'hours'),
        })
        await repository.addOrUpdateMany([
          report,
          fakeReport({
            projectId: PROJECT_B,
            timestamp: TIME_0.add(6, 'hours'),
          }),
        ])
        await repository.addOrUpdateMany([
          fakeReport({
            projectId: PROJECT_A,
            timestamp: TIME_0.add(16, 'hours'),
          }),
          fakeReport({
            projectId: PROJECT_B,
            timestamp: TIME_0.add(16, 'hours'),
          }),
        ])
        await repository.addOrUpdateMany([
          { ...report, timestamp: TIME_0.add(-90, 'days').add(-1, 'minutes') },
        ])
        const result = await repository.getSixHourlyByProjectAndAsset(
          PROJECT_A,
          asset,
          TIME_0.add(-1, 'days'),
        )
        expect(result).toEqual([report])
      })
    },
  )

  describe(ReportRepository.prototype.getHourlyByProjectAndAsset.name, () => {
    it('returns hourly reports for a given asset and project', async () => {
      const asset = AssetId('my-asset')
      const report = fakeReport({
        projectId: PROJECT_A,
        asset,
        timestamp: TIME_0.add(1, 'hours'),
      })
      await repository.addOrUpdateMany([
        report,
        fakeReport({
          projectId: PROJECT_B,
          timestamp: TIME_0.add(1, 'hours'),
        }),
      ])
      await repository.addOrUpdateMany([
        fakeReport({
          projectId: PROJECT_A,
          timestamp: TIME_0.add(3, 'hours'),
        }),
        fakeReport({
          projectId: PROJECT_B,
          timestamp: TIME_0.add(3, 'hours'),
        }),
      ])
      await repository.addOrUpdateMany([
        { ...report, timestamp: TIME_0.add(-7, 'days').add(-1, 'minutes') },
      ])
      const result = await repository.getHourlyByProjectAndAsset(
        PROJECT_A,
        asset,
        TIME_0.add(-1, 'days'),
      )
      expect(result).toEqual([report])
    })
  })
})

function fakeReport(report?: Partial<ReportRecord>): ReportRecord {
  return {
    timestamp: UnixTime.now(),
    projectId: ProjectId('fake-project'),
    asset: AssetId('fake-asset'),
    balance: 1234n,
    balanceUsd: 1234n,
    balanceEth: 1234n,
    ...report,
  }
}
