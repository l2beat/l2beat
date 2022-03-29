import { AssetId, EthereumAddress, Logger, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import {
  ReportRecord,
  ReportRepository,
} from '../../../src/peripherals/database/ReportRepository'
import { setupDatabaseTestSuite } from './setup'

describe(ReportRepository.name, () => {
  const { knex } = setupDatabaseTestSuite()
  const repository = new ReportRepository(knex, Logger.SILENT)

  const START_BLOCK_NUMBER = 123456n
  const MOCK_BRIDGE = EthereumAddress(
    '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'
  )
  const MOCK_ASSET = AssetId('dai-dai-stablecoin')
  const MOCK_USD_TVL = 100000000n
  const MOCK_ETH_TVL = 100000n

  const START = UnixTime.now()

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
      blockNumber: START_BLOCK_NUMBER + 100n,
      timestamp: START.add(1, 'hours'),
      bridge: MOCK_BRIDGE,
      asset: MOCK_ASSET,
      usdTVL: MOCK_USD_TVL + 1000n,
      ethTVL: MOCK_ETH_TVL + 2n,
    },
  ]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.addOrUpdate(DATA)
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
      expect(result).toBeAnArrayOfLength(3)
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

      expect(result).toBeAnArrayWith(modifiedData, DATA[1])
      expect(result).toBeAnArrayOfLength(2)
    })
  })

  it(ReportRepository.prototype.getAll.name, async () => {
    const results = await repository.getAll()

    expect(results).toBeAnArrayWith(...DATA)
    expect(results).toBeAnArrayOfLength(2)
  })

  it(ReportRepository.prototype.deleteAll.name, async () => {
    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toBeAnArrayOfLength(0)
  })
})
