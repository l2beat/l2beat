import { AssetId, EthereumAddress, Logger } from '@l2beat/common'
import { expect } from 'earljs'
import { parseUnits } from 'ethers/lib/utils'

import { BalanceRepository } from '../../../src/peripherals/database/BalanceRepository'
import { setupDatabaseTestSuite } from './setup'

describe(BalanceRepository.name, () => {
  const { knex } = setupDatabaseTestSuite()
  const repository = new BalanceRepository(knex, Logger.SILENT)

  const START_BLOCK_NUMBER = 123456
  const MOCK_HOLDER = EthereumAddress(
    '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'
  )
  const MOCK_ASSET = AssetId('dai-dai-stablecoin')
  const DATA = [
    {
      blockNumber: START_BLOCK_NUMBER,
      holderAddress: MOCK_HOLDER,
      assetId: MOCK_ASSET,
      balance: parseUnits('100', 18),
    },
    {
      blockNumber: START_BLOCK_NUMBER + 1,
      holderAddress: MOCK_HOLDER,
      assetId: MOCK_ASSET,
      balance: parseUnits('110', 18),
    },
  ]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.addOrUpdate(DATA)
  })

  describe(BalanceRepository.prototype.getDataBoundaries.name, () => {
    it('more than one row: latest != earliest', async () => {
      const { earliestBlockNumber, latestBlockNumber } =
        await repository.getDataBoundaries(MOCK_HOLDER, MOCK_ASSET)
      expect(earliestBlockNumber).toEqual(START_BLOCK_NUMBER)
      expect(latestBlockNumber).toEqual(START_BLOCK_NUMBER + 1)
    })

    it('one row: latest == earliest', async () => {
      const holder = EthereumAddress(
        '0xcEe284F754E854890e311e3280b767F80797180d'
      )
      const oneRow = [
        {
          blockNumber: 123456,
          holderAddress: holder,
          assetId: MOCK_ASSET,
          balance: parseUnits('100', 18),
        },
      ]
      await repository.addOrUpdate(oneRow)

      const { earliestBlockNumber, latestBlockNumber } =
        await repository.getDataBoundaries(holder, MOCK_ASSET)
      expect(earliestBlockNumber).toEqual(latestBlockNumber)
      expect(latestBlockNumber).not.toEqual(undefined)
    })

    it('nonexisting data', async () => {
      const nonexistingAsset = AssetId('nonexistent-token')

      const { earliestBlockNumber, latestBlockNumber } =
        await repository.getDataBoundaries(MOCK_HOLDER, nonexistingAsset)
      expect(earliestBlockNumber).toEqual(undefined)
      expect(latestBlockNumber).toEqual(undefined)
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
          blockNumber: START_BLOCK_NUMBER + 2,
          holderAddress: EthereumAddress(
            '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'
          ),
          assetId: AssetId('dai-dai-stablecoin'),
          balance: parseUnits('120', 18),
        },
        {
          blockNumber: START_BLOCK_NUMBER + 3,
          holderAddress: EthereumAddress(
            '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'
          ),
          assetId: AssetId('dai-dai-stablecoin'),
          balance: parseUnits('130', 18),
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
          balance: parseUnits('120', 18),
        },
        {
          blockNumber: DATA[1].blockNumber,
          holderAddress: DATA[1].holderAddress,
          assetId: DATA[1].assetId,
          balance: parseUnits('130', 18),
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
          balance: parseUnits('130', 18),
        },
        {
          blockNumber: START_BLOCK_NUMBER + 2,
          holderAddress: EthereumAddress(
            '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'
          ),
          assetId: AssetId('dai-dai-stablecoin'),
          balance: parseUnits('130', 18),
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
