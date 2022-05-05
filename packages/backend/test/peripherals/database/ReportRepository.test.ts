import { AssetId, EthereumAddress, Logger, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import {
  BalanceRecord,
  BalanceRepository,
} from '../../../src/peripherals/database/BalanceRepository'
import {
  ReportRecord,
  ReportRepository,
} from '../../../src/peripherals/database/ReportRepository'
import { setupDatabaseTestSuite } from './setup'

describe(ReportRepository.name, () => {
  const { knex } = setupDatabaseTestSuite()
  const repository = new ReportRepository(knex, Logger.SILENT)
  const balanceRepository = new BalanceRepository(knex, Logger.SILENT)

  const START_BLOCK_NUMBER = 123456n
  const MOCK_BRIDGE = EthereumAddress(
    '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'
  )
  const MOCK_BRIDGE_2 = EthereumAddress.random()
  const MOCK_ASSET = AssetId('dai-dai-stablecoin')
  const MOCK_USD_TVL = 100000000n
  const MOCK_ETH_TVL = 100000n

  const START = UnixTime.now().toStartOf('day')

  const DATA: ReportRecord[] = [
    {
      blockNumber: START_BLOCK_NUMBER,
      timestamp: START,
      bridge: MOCK_BRIDGE,
      asset: MOCK_ASSET,
      usdTVL: MOCK_USD_TVL,
      ethTVL: MOCK_ETH_TVL,
    },
    {
      blockNumber: START_BLOCK_NUMBER,
      timestamp: START,
      bridge: MOCK_BRIDGE_2,
      asset: MOCK_ASSET,
      usdTVL: 1000n,
      ethTVL: 1n,
    },
    {
      blockNumber: START_BLOCK_NUMBER + 100n,
      timestamp: START.add(1, 'hours'),
      bridge: MOCK_BRIDGE,
      asset: MOCK_ASSET,
      usdTVL: MOCK_USD_TVL + 1000n,
      ethTVL: MOCK_ETH_TVL + 2n,
    },
  ]

  const BALANCE_DATA: BalanceRecord[] = [
    {
      blockNumber: START_BLOCK_NUMBER,
      holderAddress: MOCK_BRIDGE,
      assetId: MOCK_ASSET,
      balance: 100000000n,
    },
    {
      blockNumber: START_BLOCK_NUMBER,
      holderAddress: MOCK_BRIDGE_2,
      assetId: MOCK_ASSET,
      balance: 1000n,
    },
    {
      blockNumber: START_BLOCK_NUMBER + 100n,
      holderAddress: MOCK_BRIDGE,
      assetId: MOCK_ASSET,
      balance: 100000000n,
    },
  ]

  beforeEach(async () => {
    await balanceRepository.deleteAll()
    await repository.deleteAll()
    await repository.addOrUpdate(DATA)
    await balanceRepository.addOrUpdate(BALANCE_DATA)
  })

  describe(ReportRepository.prototype.getDaily.name, () => {
    it('filters data to get only full days', async () => {
      const result = await repository.getDaily()

      expect(result).toBeAnArrayWith(
        { ...DATA[0], balance: 100000000n },
        { ...DATA[1], balance: 1000n }
      )
      expect(result).toBeAnArrayOfLength(2)
    })

    it('returns sorted data', async () => {
      const unsortedData = [
        {
          blockNumber: START_BLOCK_NUMBER + 1000n,
          timestamp: START.add(1, 'days'),
          bridge: MOCK_BRIDGE,
          asset: MOCK_ASSET,
          usdTVL: MOCK_USD_TVL,
          ethTVL: MOCK_ETH_TVL,
        },
        {
          blockNumber: START_BLOCK_NUMBER - 1000n,
          timestamp: START.add(-1, 'days'),
          bridge: MOCK_BRIDGE,
          asset: MOCK_ASSET,
          usdTVL: MOCK_USD_TVL,
          ethTVL: MOCK_ETH_TVL,
        },
        {
          blockNumber: START_BLOCK_NUMBER - 2000n,
          timestamp: START.add(-2, 'days'),
          bridge: MOCK_BRIDGE,
          asset: MOCK_ASSET,
          usdTVL: MOCK_USD_TVL,
          ethTVL: MOCK_ETH_TVL,
        },
      ]

      const balanceData = [
        {
          blockNumber: START_BLOCK_NUMBER + 1000n,
          holderAddress: MOCK_BRIDGE,
          assetId: MOCK_ASSET,
          balance: 100000000n,
        },
        {
          blockNumber: START_BLOCK_NUMBER - 1000n,
          holderAddress: MOCK_BRIDGE,
          assetId: MOCK_ASSET,
          balance: 100000000n,
        },
        {
          blockNumber: START_BLOCK_NUMBER - 2000n,
          holderAddress: MOCK_BRIDGE,
          assetId: MOCK_ASSET,
          balance: 100000000n,
        },
      ]

      await repository.addOrUpdate(unsortedData)
      await balanceRepository.addOrUpdate(balanceData)

      const result = await repository.getDaily()

      const bridgeExpected = [-2, -1, 0, 1].map((offset) => ({
        blockNumber: START_BLOCK_NUMBER + BigInt(offset) * 1000n,
        timestamp: START.add(offset, 'days'),
        bridge: MOCK_BRIDGE,
        asset: MOCK_ASSET,
        usdTVL: MOCK_USD_TVL,
        ethTVL: MOCK_ETH_TVL,
        balance: 100000000n,
      }))

      const bridgeTwoExpected = {
        blockNumber: START_BLOCK_NUMBER,
        timestamp: START,
        bridge: MOCK_BRIDGE_2,
        asset: MOCK_ASSET,
        usdTVL: 1000n,
        ethTVL: 1n,
        balance: 1000n,
      }

      expect(result).toEqual([
        ...bridgeExpected.slice(0, 3),
        bridgeTwoExpected,
        bridgeExpected[3],
      ])
    })
  })

  describe(ReportRepository.prototype.addOrUpdate.name, () => {
    it('new row', async () => {
      const newBridge = EthereumAddress(
        '0xcEe284F754E854890e311e3280b767F80797180d'
      )
      const newData = {
        blockNumber: START_BLOCK_NUMBER,
        timestamp: START,
        bridge: newBridge,
        asset: MOCK_ASSET,
        usdTVL: MOCK_USD_TVL,
        ethTVL: MOCK_ETH_TVL,
      }

      await repository.addOrUpdate([newData])

      const result = await repository.getAll()

      expect(result).toBeAnArrayWith(...DATA, newData)
      expect(result).toBeAnArrayOfLength(4)
    })

    it('update row', async () => {
      const modifiedData = {
        blockNumber: START_BLOCK_NUMBER,
        timestamp: START,
        bridge: MOCK_BRIDGE,
        asset: MOCK_ASSET,
        usdTVL: MOCK_USD_TVL + 1000n,
        ethTVL: MOCK_ETH_TVL + 1n,
      }

      await repository.addOrUpdate([modifiedData])

      const result = await repository.getAll()

      expect(result).toBeAnArrayWith(modifiedData, DATA[1], DATA[2])
      expect(result).toBeAnArrayOfLength(3)
    })
  })

  it(ReportRepository.prototype.getAll.name, async () => {
    const results = await repository.getAll()

    expect(results).toBeAnArrayWith(...DATA)
    expect(results).toBeAnArrayOfLength(3)
  })

  it(ReportRepository.prototype.deleteAll.name, async () => {
    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toBeAnArrayOfLength(0)
  })
})
