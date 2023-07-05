import { Logger } from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import { BalanceRecord, BalanceRepository } from './BalanceRepository'

const START = UnixTime.fromDate(new Date('2022-05-17'))
const mockBalance = (
  holderAddress: EthereumAddress,
  offset: number,
  assetId: AssetId,
  balance: bigint,
  chainId: ChainId,
) => {
  return {
    timestamp: START.add(offset, 'hours'),
    holderAddress: holderAddress,
    assetId,
    balance,
    chainId,
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
    mockBalance(HOLDER_A, 0, ASSET_1, BALANCE, ChainId.ETHEREUM),
    mockBalance(HOLDER_A, 1, ASSET_1, BALANCE, ChainId.ETHEREUM),
  ]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.addOrUpdateMany(DATA)
  })

  describe(BalanceRepository.prototype.getByTimestamp.name, () => {
    it('known timestamp', async () => {
      const additionalData = [
        mockBalance(HOLDER_A, 0, AssetId('asset-a'), BALANCE, ChainId.ETHEREUM),
        mockBalance(HOLDER_A, 0, AssetId('asset-b'), BALANCE, ChainId.ETHEREUM),
        mockBalance(HOLDER_A, 0, AssetId('asset-c'), BALANCE, ChainId.ETHEREUM),
      ]
      await repository.addOrUpdateMany(additionalData)

      const result = await repository.getByTimestamp(ChainId.ETHEREUM, START)

      expect(result).toEqualUnsorted([DATA[0], ...additionalData])
    })

    it('unknown timestamp', async () => {
      const result = await repository.getByTimestamp(
        ChainId.ETHEREUM,
        START.add(1, 'days'),
      )
      expect(result).toEqual([])
    })

    it('one project one asset', async () => {
      await repository.deleteAll()
      const data = [
        mockBalance(HOLDER_A, 0, ASSET_1, 1n, ChainId.ETHEREUM),
        mockBalance(HOLDER_A, 1, ASSET_1, 1n, ChainId.ETHEREUM),
        mockBalance(HOLDER_A, 2, ASSET_1, 1n, ChainId.ETHEREUM),
      ]

      await repository.addOrUpdateMany(data)

      const result = await repository.getByTimestamp(ChainId.ETHEREUM, START)
      expect(result).toEqual([
        {
          holderAddress: HOLDER_A,
          timestamp: START,
          assetId: ASSET_1,
          balance: 1n,
          chainId: ChainId.ETHEREUM,
        },
      ])
    })

    it('many projects many assets', async () => {
      await repository.deleteAll()
      const data = [
        mockBalance(HOLDER_A, 0, ASSET_1, 1n, ChainId.ETHEREUM),
        mockBalance(HOLDER_A, 1, ASSET_1, 1n, ChainId.ETHEREUM),
        mockBalance(HOLDER_A, 2, ASSET_1, 1n, ChainId.ETHEREUM),

        mockBalance(HOLDER_A, 0, ASSET_2, 3000n, ChainId.ETHEREUM),
        mockBalance(HOLDER_A, 1, ASSET_2, 1000n, ChainId.ETHEREUM),

        mockBalance(HOLDER_B, 0, ASSET_2, 1n, ChainId.ETHEREUM),
        mockBalance(HOLDER_B, 1, ASSET_2, 3n, ChainId.ETHEREUM),
        mockBalance(HOLDER_B, 2, ASSET_2, 5n, ChainId.ETHEREUM),
      ]

      await repository.addOrUpdateMany(data)

      const result = await repository.getByTimestamp(ChainId.ETHEREUM, START)
      expect(result).toEqualUnsorted([
        {
          holderAddress: HOLDER_A,
          timestamp: START,
          assetId: ASSET_1,
          balance: 1n,
          chainId: ChainId.ETHEREUM,
        },
        {
          holderAddress: HOLDER_A,
          timestamp: START,
          assetId: ASSET_2,
          balance: 3000n,
          chainId: ChainId.ETHEREUM,
        },
        {
          holderAddress: HOLDER_B,
          timestamp: START,
          assetId: ASSET_2,
          balance: 1n,
          chainId: ChainId.ETHEREUM,
        },
      ])
    })

    it('take chainId into consideration', async () => {
      const resultEth = await repository.getByTimestamp(ChainId.ETHEREUM, START)
      expect(resultEth).toEqual([DATA[0]])

      const resultArb = await repository.getByTimestamp(ChainId.ARBITRUM, START)
      expect(resultArb).toEqual([])
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
          chainId: ChainId.ETHEREUM,
        },
        {
          timestamp: START.add(3, 'hours'),
          holderAddress: EthereumAddress(
            '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
          ),
          assetId: AssetId('dai-dai-stablecoin'),
          balance: BALANCE,
          chainId: ChainId.ETHEREUM,
        },
      ]
      await repository.addOrUpdateMany(newRows)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted([...DATA, ...newRows])
    })

    it('existing rows only', async () => {
      const existingRows = [
        {
          timestamp: DATA[0].timestamp,
          holderAddress: DATA[0].holderAddress,
          assetId: DATA[0].assetId,
          balance: BALANCE,
          chainId: ChainId.ETHEREUM,
        },
        {
          timestamp: DATA[1].timestamp,
          holderAddress: DATA[1].holderAddress,
          assetId: DATA[1].assetId,
          balance: BALANCE,
          chainId: ChainId.ETHEREUM,
        },
      ]
      await repository.addOrUpdateMany(existingRows)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(existingRows)
    })

    it('mixed: existing and new rows', async () => {
      const mixedRows = [
        {
          timestamp: DATA[1].timestamp,
          holderAddress: DATA[1].holderAddress,
          assetId: DATA[1].assetId,
          balance: BALANCE,
          chainId: ChainId.ETHEREUM,
        },
        {
          timestamp: START.add(2, 'hours'),
          holderAddress: EthereumAddress(
            '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
          ),
          assetId: AssetId('dai-dai-stablecoin'),
          balance: BALANCE,
          chainId: ChainId.ETHEREUM,
        },
      ]
      await repository.addOrUpdateMany(mixedRows)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted([DATA[0], ...mixedRows])
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
