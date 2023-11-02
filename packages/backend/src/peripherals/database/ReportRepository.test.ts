import { Logger } from '@l2beat/backend-tools'
import { AssetId, ChainId, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import { ReportRecord, ReportRepository } from './ReportRepository'

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

    it('throws if timestamps do not match', async () => {
      await expect(
        repository.addOrUpdateMany([
          fakeReport({ projectId: PROJECT_A, timestamp: TIME_0 }),
          fakeReport({ projectId: PROJECT_B, timestamp: TIME_0 }),
          fakeReport({ projectId: PROJECT_C, timestamp: TIME_1 }),
        ]),
      ).toBeRejectedWith('Assertion Error: Timestamps must match')
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
