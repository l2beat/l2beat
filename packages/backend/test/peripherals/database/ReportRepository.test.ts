import { AssetId, EthereumAddress, Logger, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { BalanceRepository } from '../../../src/peripherals/database/BalanceRepository'
import { ReportRepository } from '../../../src/peripherals/database/ReportRepository'
import { fakeBalance } from '../../fakes'
import { setupDatabaseTestSuite } from './setup'

describe(ReportRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const reportsRepository = new ReportRepository(database, Logger.SILENT)
  const balancesRepository = new BalanceRepository(database, Logger.SILENT)

  const TODAY = UnixTime.now().toStartOf('day')
  const BLOCK = 123456n
  const BRIDGE_A = EthereumAddress.random()
  const BRIDGE_B = EthereumAddress.random()
  const ASSET_A = AssetId('asset-a')
  const BALANCE = 100000n

  const mockReport = (
    bridge: EthereumAddress,
    timestampOffset: number,
    blockOffset: bigint,
  ) => {
    return {
      blockNumber: BLOCK + blockOffset,
      timestamp: TODAY.add(timestampOffset, 'hours'),
      bridge,
      asset: ASSET_A,
      balance: BALANCE,
      balanceUsd: 1000000n,
      balanceEth: 100000n,
    }
  }

  beforeEach(async () => {
    await balancesRepository.deleteAll()
    await reportsRepository.deleteAll()
  })

  describe(ReportRepository.prototype.getDaily.name, () => {
    it('filters data to get only full days', async () => {
      await reportsRepository.addOrUpdateMany([
        mockReport(BRIDGE_A, 0, 0n),
        mockReport(BRIDGE_A, 1, 100n),
      ])

      await balancesRepository.addOrUpdateMany([
        fakeBalance({
          holderAddress: BRIDGE_A,
          assetId: ASSET_A,
          timestamp: TODAY,
        }),
        fakeBalance({
          holderAddress: BRIDGE_A,
          assetId: ASSET_A,
          timestamp: TODAY.add(1, 'hours'),
        }),
      ])

      const result = await reportsRepository.getDaily()

      expect(result).toBeAnArrayWith({
        ...mockReport(BRIDGE_A, 0, 0n),
        balance: BALANCE,
      })
      expect(result).toBeAnArrayOfLength(1)
    })

    it('returns sorted data', async () => {
      await reportsRepository.addOrUpdateMany([
        mockReport(BRIDGE_A, 48, 2000n),
        mockReport(BRIDGE_A, 0, 0n),
        mockReport(BRIDGE_A, 24, 1000n),
      ])

      await balancesRepository.addOrUpdateMany([
        fakeBalance({
          holderAddress: BRIDGE_A,
          assetId: ASSET_A,
          timestamp: TODAY,
        }),
        fakeBalance({
          holderAddress: BRIDGE_A,
          assetId: ASSET_A,
          timestamp: TODAY.add(1, 'hours'),
        }),
        fakeBalance({
          holderAddress: BRIDGE_A,
          assetId: ASSET_A,
          timestamp: TODAY.add(2, 'hours'),
        }),
      ])
      const result = await reportsRepository.getDaily()

      expect(result).toEqual([
        { ...mockReport(BRIDGE_A, 0, 0n), balance: BALANCE },
        { ...mockReport(BRIDGE_A, 24, 1000n), balance: BALANCE },
        { ...mockReport(BRIDGE_A, 48, 2000n), balance: BALANCE },
      ])
    })
  })

  describe(ReportRepository.prototype.addOrUpdateMany.name, () => {
    it('add or update', async () => {
      await reportsRepository.addOrUpdateMany([
        mockReport(BRIDGE_A, 0, 0n),
        mockReport(BRIDGE_A, 1, 100n),
      ])

      await reportsRepository.addOrUpdateMany([
        mockReport(BRIDGE_A, 2, 100n),
        mockReport(BRIDGE_A, 3, 300n),
      ])

      const result = await reportsRepository.getAll()

      expect(result).toBeAnArrayWith(
        mockReport(BRIDGE_A, 0, 0n),
        mockReport(BRIDGE_A, 2, 100n),
        mockReport(BRIDGE_A, 3, 300n),
      )

      expect(result).toBeAnArrayOfLength(3)
    })

    it('empty array', async () => {
      await expect(reportsRepository.addOrUpdateMany([])).not.toBeRejected()
    })
  })

  it(ReportRepository.prototype.getAll.name, async () => {
    await reportsRepository.addOrUpdateMany([
      mockReport(BRIDGE_A, 0, 0n),
      mockReport(BRIDGE_A, 1, 100n),
    ])

    const results = await reportsRepository.getAll()

    expect(results).toBeAnArrayWith(
      mockReport(BRIDGE_A, 0, 0n),
      mockReport(BRIDGE_A, 1, 100n),
    )
    expect(results).toBeAnArrayOfLength(2)
  })

  it(ReportRepository.prototype.deleteAll.name, async () => {
    await reportsRepository.addOrUpdateMany([
      mockReport(BRIDGE_A, 0, 0n),
      mockReport(BRIDGE_A, 1, 100n),
    ])

    await reportsRepository.deleteAll()

    const results = await reportsRepository.getAll()

    expect(results).toBeAnArrayOfLength(0)
  })

  it(ReportRepository.prototype.getLatestPerBridge.name, async () => {
    await reportsRepository.addOrUpdateMany([
      mockReport(BRIDGE_A, 0, 0n),
      mockReport(BRIDGE_A, 1, 100n),
      mockReport(BRIDGE_B, 0, 0n),
      mockReport(BRIDGE_B, 1, 100n),
    ])

    const result = await reportsRepository.getLatestPerBridge()

    expect(result).toEqual(
      new Map([
        [BRIDGE_A, [mockReport(BRIDGE_A, 1, 100n)]],
        [BRIDGE_B, [mockReport(BRIDGE_B, 1, 100n)]],
      ]),
    )
  })
})
