import { Logger } from '@l2beat/backend-tools'
import { AssetId, ChainId, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { ReportRecord, ReportRepository } from './ReportRepository'

describeDatabase(ReportRepository.name, (database) => {
  const repository = new ReportRepository(database, Logger.SILENT)

  const TIME_0 = UnixTime.now().toStartOf('day')
  const TIME_1 = TIME_0.add(1, 'hours')

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(ReportRepository.prototype.addOrUpdateMany.name, () => {
    it('handles inserts', async () => {
      const REPORTS_1 = [
        fakeReport({ asset: AssetId.DAI, timestamp: TIME_1, amount: 1n }),
        fakeReport({ asset: AssetId.ETH, timestamp: TIME_1, amount: 1n }),
      ]
      await repository.addOrUpdateMany(REPORTS_1)
      expect(await repository.getAll()).toEqual(REPORTS_1)
    })

    it('handles records updates', async () => {
      const REPORTS_1 = [
        fakeReport({ asset: AssetId.DAI, timestamp: TIME_1, amount: 1n }),
        fakeReport({ asset: AssetId.ETH, timestamp: TIME_1, amount: 1n }),
      ]
      await repository.addOrUpdateMany(REPORTS_1)
      expect(await repository.getAll()).toEqual(REPORTS_1)
      const REPORTS_2 = [
        fakeReport({ asset: AssetId.DAI, timestamp: TIME_1, amount: 2n }),
        fakeReport({ asset: AssetId.ETH, timestamp: TIME_1, amount: 2n }),
      ]
      await repository.addOrUpdateMany(REPORTS_2)
      expect(await repository.getAll()).toEqual(REPORTS_2)
    })

    it('handles empty array', async () => {
      await expect(repository.addOrUpdateMany([])).not.toBeRejected()
    })

    it('batches insert', async () => {
      const records: ReportRecord[] = []
      for (let i = 1; i < 10_000; i++) {
        records.push(
          fakeReport({
            asset: AssetId('asset' + i.toString()),
            timestamp: TIME_0,
            amount: 1n,
          }),
        )
      }
      await repository.addOrUpdateMany(records)
      const expected = await repository.getAll()

      expect(expected).toEqualUnsorted(records)
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

  describe(ReportRepository.prototype.deleteHourlyUntil.name, () => {
    it('deletes hourly reports', async () => {
      const start = UnixTime.now().toStartOf('day')

      const reports = []

      const end = 25

      for (let i = 0; i <= end; i++) {
        reports.push(fakeReport({ timestamp: start.add(i, 'hours') }))
      }

      await repository.addOrUpdateMany(reports)
      await repository.deleteHourlyUntil(start.add(end, 'hours'))
      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        fakeReport({ timestamp: start }),
        fakeReport({ timestamp: start.add(6, 'hours') }),
        fakeReport({ timestamp: start.add(12, 'hours') }),
        fakeReport({ timestamp: start.add(18, 'hours') }),
        fakeReport({ timestamp: start.add(24, 'hours') }),
        fakeReport({ timestamp: start.add(25, 'hours') }),
      ])
    })
  })

  describe(ReportRepository.prototype.deleteSixHourlyUntil.name, () => {
    it('deletes six hourly reports', async () => {
      const start = UnixTime.now().toStartOf('day')
      const end = 25

      const reports = [
        fakeReport({ timestamp: start }),
        fakeReport({ timestamp: start.add(1, 'hours') }),
        fakeReport({ timestamp: start.add(6, 'hours') }),
        fakeReport({ timestamp: start.add(12, 'hours') }),
        fakeReport({ timestamp: start.add(18, 'hours') }),
        fakeReport({ timestamp: start.add(24, 'hours') }),
        fakeReport({ timestamp: start.add(25, 'hours') }),
      ]
      await repository.addOrUpdateMany(reports)

      await repository.deleteSixHourlyUntil(start.add(end, 'hours'))
      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        fakeReport({ timestamp: start }),
        // keeps hourly
        fakeReport({ timestamp: start.add(1, 'hours') }),
        fakeReport({ timestamp: start.add(24, 'hours') }),
        fakeReport({ timestamp: start.add(25, 'hours') }),
      ])
    })
  })
})

function fakeReport(report?: Partial<ReportRecord>): ReportRecord {
  return {
    timestamp: UnixTime.now(),
    projectId: ProjectId('fake-project'),
    asset: AssetId('fake-asset'),
    reportType: 'CBV',
    chainId: ChainId.ETHEREUM,
    amount: 1234n,
    usdValue: 1234n,
    ethValue: 1234n,
    ...report,
  }
}
