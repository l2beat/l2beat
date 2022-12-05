import { Logger } from '@l2beat/common'
import { AssetId, EthereumAddress, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { setupDatabaseTestSuite } from '../../test/database'
import { BalanceRecord, BalanceRepository } from './BalanceRepository'

const START = UnixTime.fromDate(new Date('2022-05-17'))
const mockBalance = (
  holderAddress: EthereumAddress,
  offset: number,
  assetId: AssetId,
  balance: bigint,
) => {
  return {
    timestamp: START.add(offset, 'hours'),
    holderAddress: holderAddress,
    assetId,
    balance,
  }
}

describe(BalanceRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new BalanceRepository(database, Logger.SILENT)

  const HOLDER_A = EthereumAddress.random()
  const HOLDER_B = EthereumAddress.random()
  const ASSET_1 = AssetId('dai-dai-stablecoin')
  const ASSET_2 = AssetId('asset-2')
  const BALANCE = 1000000000000000000n
  const DATA: BalanceRecord[] = [
    mockBalance(HOLDER_A, 0, ASSET_1, BALANCE),
    mockBalance(HOLDER_A, 1, ASSET_1, BALANCE),
  ]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.addOrUpdateMany(DATA)
  })

  describe(BalanceRepository.prototype.getByTimestamp.name, () => {
    it('known timestamp', async () => {
      const additionalData = [
        mockBalance(HOLDER_A, 0, AssetId('asset-a'), BALANCE),
        mockBalance(HOLDER_A, 0, AssetId('asset-b'), BALANCE),
        mockBalance(HOLDER_A, 0, AssetId('asset-c'), BALANCE),
      ]
      await repository.addOrUpdateMany(additionalData)

      const result = await repository.getByTimestamp(START)

      expect(result).toBeAnArrayWith(DATA[0], ...additionalData)
      expect(result).toBeAnArrayOfLength(4)
    })

    it('unknown timestamp', async () => {
      const result = await repository.getByTimestamp(START.add(1, 'days'))
      expect(result).toEqual([])
    })

    it('one project one asset', async () => {
      await repository.deleteAll()
      const data = [
        mockBalance(HOLDER_A, 0, ASSET_1, 1n),
        mockBalance(HOLDER_A, 1, ASSET_1, 1n),
        mockBalance(HOLDER_A, 2, ASSET_1, 1n),
      ]

      await repository.addOrUpdateMany(data)

      const result = await repository.getByTimestamp(START)
      expect(result).toEqual([
        {
          holderAddress: HOLDER_A,
          timestamp: START,
          assetId: ASSET_1,
          balance: 1n,
        },
      ])
    })

    it('many projects many assets', async () => {
      await repository.deleteAll()
      const data = [
        mockBalance(HOLDER_A, 0, ASSET_1, 1n),
        mockBalance(HOLDER_A, 1, ASSET_1, 1n),
        mockBalance(HOLDER_A, 2, ASSET_1, 1n),

        mockBalance(HOLDER_A, 0, ASSET_2, 3000n),
        mockBalance(HOLDER_A, 1, ASSET_2, 1000n),

        mockBalance(HOLDER_B, 0, ASSET_2, 1n),
        mockBalance(HOLDER_B, 1, ASSET_2, 3n),
        mockBalance(HOLDER_B, 2, ASSET_2, 5n),
      ]

      await repository.addOrUpdateMany(data)

      const result = await repository.getByTimestamp(START)
      expect(result).toBeAnArrayOfLength(3)
      expect(result).toBeAnArrayWith(
        {
          holderAddress: HOLDER_A,
          timestamp: START,
          assetId: ASSET_1,
          balance: 1n,
        },
        {
          holderAddress: HOLDER_A,
          timestamp: START,
          assetId: ASSET_2,
          balance: 3000n,
        },
        {
          holderAddress: HOLDER_B,
          timestamp: START,
          assetId: ASSET_2,
          balance: 1n,
        },
      )
    })
  })

  describe(BalanceRepository.prototype.getByHolderAndAsset.name, () => {
    it('entries exist in the DB', async () => {
      const result = await repository.getByHolderAndAsset(HOLDER_A, ASSET_1)

      expect(result).toEqual(DATA)
    })

    it('nonexisting holder', async () => {
      const nonexistingHolder = EthereumAddress(
        '0xcEe284F754E854890e311e3280b767F80797180d',
      )
      const result = await repository.getByHolderAndAsset(
        nonexistingHolder,
        ASSET_1,
      )

      expect(result).toEqual([])
    })

    it('nonexisting asset', async () => {
      const nonexistingAsset = AssetId('nonexistent-token')
      const result = await repository.getByHolderAndAsset(
        HOLDER_A,
        nonexistingAsset,
      )

      expect(result).toEqual([])
    })
  })

  describe(BalanceRepository.prototype.addOrUpdateMany.name, () => {
    it('new rows only', async () => {
      const newRows = [
        {
          timestamp: START.add(2, 'hours'),
          holderAddress: EthereumAddress(
            '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
          ),
          assetId: AssetId('dai-dai-stablecoin'),
          balance: BALANCE,
        },
        {
          timestamp: START.add(3, 'hours'),
          holderAddress: EthereumAddress(
            '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
          ),
          assetId: AssetId('dai-dai-stablecoin'),
          balance: BALANCE,
        },
      ]
      await repository.addOrUpdateMany(newRows)

      const result = await repository.getAll()
      expect(result).toBeAnArrayWith(...DATA, ...newRows)
      expect(result).toBeAnArrayOfLength(4)
    })

    it('existing rows only', async () => {
      const existingRows = [
        {
          timestamp: DATA[0].timestamp,
          holderAddress: DATA[0].holderAddress,
          assetId: DATA[0].assetId,
          balance: BALANCE,
        },
        {
          timestamp: DATA[1].timestamp,
          holderAddress: DATA[1].holderAddress,
          assetId: DATA[1].assetId,
          balance: BALANCE,
        },
      ]
      await repository.addOrUpdateMany(existingRows)

      const result = await repository.getAll()
      expect(result).toBeAnArrayWith(...existingRows)
      expect(result).toBeAnArrayOfLength(2)
    })

    it('mixed: existing and new rows', async () => {
      const mixedRows = [
        {
          timestamp: DATA[1].timestamp,
          holderAddress: DATA[1].holderAddress,
          assetId: DATA[1].assetId,
          balance: BALANCE,
        },
        {
          timestamp: START.add(2, 'hours'),
          holderAddress: EthereumAddress(
            '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
          ),
          assetId: AssetId('dai-dai-stablecoin'),
          balance: BALANCE,
        },
      ]
      await repository.addOrUpdateMany(mixedRows)

      const result = await repository.getAll()
      expect(result).toBeAnArrayWith(DATA[0], ...mixedRows)
      expect(result).toBeAnArrayOfLength(3)
    })

    it('empty array', async () => {
      await expect(repository.addOrUpdateMany([])).not.toBeRejected()
    })
  })

  it(BalanceRepository.prototype.getAll.name, async () => {
    const result = await repository.getAll()

    expect(result).toEqual(DATA)
  })

  it(BalanceRepository.prototype.deleteAll.name, async () => {
    await repository.deleteAll()

    const result = await repository.getAll()

    expect(result).toEqual([])
  })
})
