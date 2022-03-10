import { AssetId, EthereumAddress, Logger } from '@l2beat/common'
import { expect } from 'earljs'

import { BalanceRepository } from '../../../src/peripherals/database/BalanceRepository'
import { setupDatabaseTestSuite } from './setup'

describe(BalanceRepository.name, () => {
  const { knex } = setupDatabaseTestSuite()
  const repository = new BalanceRepository(knex, Logger.SILENT)

  const START_BLOCK_NUMBER = 123456n
  const MOCK_HOLDER = EthereumAddress(
    '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'
  )
  const MOCK_ASSET = AssetId('dai-dai-stablecoin')
  const MOCK_BALANCE = 1000000000000000000n
  const DATA = [
    {
      blockNumber: START_BLOCK_NUMBER,
      holderAddress: MOCK_HOLDER,
      assetId: MOCK_ASSET,
      balance: MOCK_BALANCE,
    },
    {
      blockNumber: START_BLOCK_NUMBER + 1n,
      holderAddress: MOCK_HOLDER,
      assetId: MOCK_ASSET,
      balance: MOCK_BALANCE,
    },
  ]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.addOrUpdate(DATA)
  })

  describe(BalanceRepository.prototype.getDataBoundaries.name, () => {
    it('multiple records', async () => {
      const record = (
        block: bigint,
        holder: EthereumAddress,
        asset: AssetId
      ) => ({
        blockNumber: block,
        holderAddress: holder,
        assetId: asset,
        balance: MOCK_BALANCE,
      })

      const HOLDER_A = EthereumAddress.random()
      const HOLDER_B = EthereumAddress.random()
      const ASSET_A = AssetId('ass-a')
      const ASSET_B = AssetId('ass-b')

      await repository.deleteAll()
      await repository.addOrUpdate([
        record(1000n, HOLDER_A, ASSET_A),
        record(1001n, HOLDER_A, ASSET_A),
        record(1002n, HOLDER_A, ASSET_A),
        record(1000n, HOLDER_A, ASSET_B),
        record(1000n, HOLDER_B, ASSET_B),
        record(1001n, HOLDER_B, ASSET_B),
      ])

      const boundaries = await repository.getDataBoundaries()
      expect(boundaries.length).toEqual(3)
      expect(boundaries).toBeAnArrayWith(
        {
          assetId: ASSET_A,
          holderAddress: HOLDER_A,
          earliestBlockNumber: 1000n,
          latestBlockNumber: 1002n,
        },
        {
          assetId: ASSET_B,
          holderAddress: HOLDER_A,
          earliestBlockNumber: 1000n,
          latestBlockNumber: 1000n,
        },
        {
          assetId: ASSET_B,
          holderAddress: HOLDER_B,
          earliestBlockNumber: 1000n,
          latestBlockNumber: 1001n,
        }
      )
    })

    it('nonexisting data', async () => {
      await repository.deleteAll()
      const boundaries = await repository.getDataBoundaries()
      expect(boundaries).toEqual([])
    })
  })

  describe(BalanceRepository.prototype.getAllByHolderAndAsset.name, () => {
    it('entries exist in the DB', async () => {
      const result = await repository.getAllByHolderAndAsset(
        MOCK_HOLDER,
        MOCK_ASSET
      )

      expect(result).toEqual(DATA)
    })

    it('nonexisting holder', async () => {
      const nonexistingHolder = EthereumAddress(
        '0xcEe284F754E854890e311e3280b767F80797180d'
      )
      const result = await repository.getAllByHolderAndAsset(
        nonexistingHolder,
        MOCK_ASSET
      )

      expect(result).toEqual([])
    })

    it('nonexisting asset', async () => {
      const nonexistingAsset = AssetId('nonexistent-token')
      const result = await repository.getAllByHolderAndAsset(
        MOCK_HOLDER,
        nonexistingAsset
      )

      expect(result).toEqual([])
    })
  })

  describe(BalanceRepository.prototype.addOrUpdate.name, () => {
    it('new rows only', async () => {
      const newRows = [
        {
          blockNumber: START_BLOCK_NUMBER + 2n,
          holderAddress: EthereumAddress(
            '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'
          ),
          assetId: AssetId('dai-dai-stablecoin'),
          balance: MOCK_BALANCE,
        },
        {
          blockNumber: START_BLOCK_NUMBER + 3n,
          holderAddress: EthereumAddress(
            '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'
          ),
          assetId: AssetId('dai-dai-stablecoin'),
          balance: MOCK_BALANCE,
        },
      ]
      await repository.addOrUpdate(newRows)

      const result = await repository.getAll()
      expect(result).toBeAnArrayWith(...DATA, ...newRows)
      expect(result).toBeAnArrayOfLength(4)
    })

    it('existing rows only', async () => {
      const existingRows = [
        {
          blockNumber: DATA[0].blockNumber,
          holderAddress: DATA[0].holderAddress,
          assetId: DATA[0].assetId,
          balance: MOCK_BALANCE,
        },
        {
          blockNumber: DATA[1].blockNumber,
          holderAddress: DATA[1].holderAddress,
          assetId: DATA[1].assetId,
          balance: MOCK_BALANCE,
        },
      ]
      await repository.addOrUpdate(existingRows)

      const result = await repository.getAll()
      expect(result).toBeAnArrayWith(...existingRows)
      expect(result).toBeAnArrayOfLength(2)
    })

    it('mixed: existing and new rows', async () => {
      const mixedRows = [
        {
          blockNumber: DATA[1].blockNumber,
          holderAddress: DATA[1].holderAddress,
          assetId: DATA[1].assetId,
          balance: MOCK_BALANCE,
        },
        {
          blockNumber: START_BLOCK_NUMBER + 2n,
          holderAddress: EthereumAddress(
            '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'
          ),
          assetId: AssetId('dai-dai-stablecoin'),
          balance: MOCK_BALANCE,
        },
      ]
      await repository.addOrUpdate(mixedRows)

      const result = await repository.getAll()
      expect(result).toBeAnArrayWith(DATA[0], ...mixedRows)
      expect(result).toBeAnArrayOfLength(3)
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
