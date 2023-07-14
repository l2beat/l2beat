import { Logger } from '@l2beat/shared'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import { TotalSupplyStatusRepository } from './TotalSupplyStatusRepository'

describe(TotalSupplyStatusRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new TotalSupplyStatusRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  const HASH_ONE = Hash256.random()
  const HASH_TWO = Hash256.random()

  const TIME_ONE = UnixTime.now().toStartOf('hour')
  const TIME_TWO = TIME_ONE.add(-1, 'hours')
  const TIME_THREE = TIME_ONE.add(-2, 'hours')

  const CHAIN_ID = ChainId.ETHEREUM

  it('stores a single timestamp', async () => {
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_ONE,
      chainId: CHAIN_ID,
    })

    const timestamps = await repository.getByConfigHash(CHAIN_ID, HASH_ONE)
    expect(timestamps).toEqual([TIME_ONE])
  })

  it('stores many timestamps across many hashes, but only latest', async () => {
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_ONE,
      chainId: CHAIN_ID,
    })
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_TWO,
      chainId: CHAIN_ID,
    })
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_THREE,
      chainId: CHAIN_ID,
    })
    await repository.add({
      configHash: HASH_TWO,
      timestamp: TIME_ONE,
      chainId: CHAIN_ID,
    })
    await repository.add({
      configHash: HASH_TWO,
      timestamp: TIME_TWO,
      chainId: CHAIN_ID,
    })

    const timestampsOne = await repository.getByConfigHash(CHAIN_ID, HASH_ONE)
    expect(timestampsOne).toEqual([TIME_THREE])

    const timestampsTwo = await repository.getByConfigHash(CHAIN_ID, HASH_TWO)
    expect(timestampsTwo).toEqualUnsorted([TIME_ONE, TIME_TWO])
  })

  it('can add the same value multiple times ', async () => {
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_ONE,
      chainId: CHAIN_ID,
    })
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_ONE,
      chainId: CHAIN_ID,
    })
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_ONE,
      chainId: CHAIN_ID,
    })

    const timestamps = await repository.getByConfigHash(CHAIN_ID, HASH_ONE)
    expect(timestamps).toEqual([TIME_ONE])
  })

  describe(TotalSupplyStatusRepository.prototype.getBetween.name, () => {
    it('gets statuses between timestamps', async () => {
      await repository.add({
        configHash: HASH_ONE,
        timestamp: TIME_ONE,
        chainId: CHAIN_ID,
      })
      await repository.add({
        configHash: HASH_ONE,
        timestamp: TIME_TWO,
        chainId: CHAIN_ID,
      })

      const result = await repository.getBetween(CHAIN_ID, TIME_THREE, TIME_TWO)

      expect(result).toEqual([
        { configHash: HASH_ONE, timestamp: TIME_TWO, chainId: CHAIN_ID },
      ])
    })
  })
})
