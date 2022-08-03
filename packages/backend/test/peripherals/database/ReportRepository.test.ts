import { AssetId, Logger, ProjectId, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import {
  ReportRecord,
  ReportRepository,
} from '../../../src/peripherals/database/ReportRepository'
import { setupDatabaseTestSuite } from './shared/setup'

describe(ReportRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const reportsRepository = new ReportRepository(database, Logger.SILENT)

  const TIME_0 = UnixTime.now().toStartOf('day')
  const TIME_1 = TIME_0.add(1, 'hours')

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  beforeEach(async () => {
    await reportsRepository.deleteAll()
  })

  describe(ReportRepository.prototype.getDaily.name, () => {
    it('filters data to get only full days', async () => {
      const REPORT = fakeReport({ timestamp: TIME_0 })
      await reportsRepository.addOrUpdateMany([
        REPORT,
        fakeReport({ timestamp: TIME_1 }),
      ])
      const result = await reportsRepository.getDaily()

      expect(result).toBeAnArrayWith(REPORT)
      expect(result).toBeAnArrayOfLength(1)
    })

    it('returns sorted data', async () => {
      const REPORTS = [
        fakeReport({ timestamp: TIME_0.add(-2, 'days') }),
        fakeReport({ timestamp: TIME_0.add(-1, 'days') }),
        fakeReport({ timestamp: TIME_0 }),
      ]
      await reportsRepository.addOrUpdateMany(REPORTS)
      const result = await reportsRepository.getDaily()

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
      await reportsRepository.addOrUpdateMany(REPORTS_1)
      expect(await reportsRepository.getAll()).toEqual(REPORTS_1)
      const REPORTS_2 = [
        fakeReport({ asset: AssetId.DAI, timestamp: TIME_1, balance: 2n }),
        fakeReport({
          projectId: ProjectId('dydx'),
          asset: AssetId.ETH,
          timestamp: TIME_1,
          balance: 2n,
        }),
      ]
      await reportsRepository.addOrUpdateMany(REPORTS_2)
      expect(await reportsRepository.getAll()).toEqual(REPORTS_2)
    })

    it('handles empty array', async () => {
      await expect(reportsRepository.addOrUpdateMany([])).not.toBeRejected()
    })

    it('throws if timestamps do not match', async () => {
      await expect(
        reportsRepository.addOrUpdateMany([
          fakeReport({ projectId: ProjectId('arbitrum'), timestamp: TIME_0 }),
          fakeReport({ projectId: ProjectId('zksync'), timestamp: TIME_0 }),
          fakeReport({ projectId: ProjectId('optimism'), timestamp: TIME_1 }),
        ]),
      ).toBeRejected('Programmer error: Timestamps must match')
    })
  })

  it(ReportRepository.prototype.getAll.name, async () => {
    const reports = [
      fakeReport({ timestamp: TIME_0 }),
      fakeReport({ timestamp: TIME_1 }),
    ]
    await reportsRepository.addOrUpdateMany(reports)

    const results = await reportsRepository.getAll()

    expect(results).toBeAnArrayWith(reports[0], reports[1])
    expect(results).toBeAnArrayOfLength(2)
  })

  it(ReportRepository.prototype.deleteAll.name, async () => {
    await reportsRepository.addOrUpdateMany([
      fakeReport({ timestamp: TIME_0 }),
      fakeReport({ timestamp: TIME_1 }),
    ])

    await reportsRepository.deleteAll()

    const results = await reportsRepository.getAll()

    expect(results).toBeAnArrayOfLength(0)
  })

  it(ReportRepository.prototype.getDailyByProjectAndAsset.name, async () => {
    const asset = AssetId('my-asset')
    const report = fakeReport({
      projectId: PROJECT_A,
      asset,
      timestamp: TIME_0,
    })
    const reports = [
      report,
      fakeReport({ projectId: PROJECT_B, timestamp: TIME_0 }),
      fakeReport({ projectId: PROJECT_A, timestamp: TIME_1 }),
      fakeReport({ projectId: PROJECT_B, timestamp: TIME_1 }),
    ]
    await reportsRepository.addOrUpdateMany(reports)

    const result = await reportsRepository.getDailyByProjectAndAsset(
      PROJECT_A,
      asset,
    )

    expect(result).toEqual([report])
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
})
