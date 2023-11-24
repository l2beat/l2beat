import { Logger } from '@l2beat/backend-tools'
import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import { ReportStatusRepository } from './ReportStatusRepository'

describe(ReportStatusRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new ReportStatusRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  const HASH_ONE = Hash256.random()
  const HASH_TWO = Hash256.random()

  const TIME_ONE = UnixTime.now().toStartOf('hour')
  const TIME_TWO = TIME_ONE.add(-1, 'hours')
  const TIME_THREE = TIME_ONE.add(-2, 'hours')

  const ETH_ID = ChainId.ETHEREUM

  it('stores a single timestamp', async () => {
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_ONE,
      chainId: ETH_ID,
    })

    const timestamps = await repository.getByConfigHash(HASH_ONE, ETH_ID)
    expect(timestamps).toEqual([TIME_ONE])
  })

  it('stores many timestamps across many hashes, but only latest', async () => {
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_ONE,
      chainId: ETH_ID,
    })
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_TWO,
      chainId: ETH_ID,
    })
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_THREE,
      chainId: ETH_ID,
    })
    await repository.add({
      configHash: HASH_TWO,
      timestamp: TIME_ONE,
      chainId: ETH_ID,
    })
    await repository.add({
      configHash: HASH_TWO,
      timestamp: TIME_TWO,
      chainId: ETH_ID,
    })

    const timestampsOne = await repository.getByConfigHash(HASH_ONE, ETH_ID)
    expect(timestampsOne).toEqual([TIME_THREE])

    const timestampsTwo = await repository.getByConfigHash(HASH_TWO, ETH_ID)
    expect(timestampsTwo).toEqualUnsorted([TIME_ONE, TIME_TWO])
  })

  it('can add the same value multiple times', async () => {
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_ONE,
      chainId: ETH_ID,
    })
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_ONE,
      chainId: ETH_ID,
    })
    await repository.add({
      configHash: HASH_ONE,
      timestamp: TIME_ONE,
      chainId: ETH_ID,
    })

    const timestamps = await repository.getByConfigHash(HASH_ONE, ETH_ID)
    expect(timestamps).toEqual([TIME_ONE])
  })

  it('gets statuses between timestamps', async () => {
    await repository.add({
      configHash: HASH_TWO,
      timestamp: TIME_ONE,
      chainId: ETH_ID,
    })
    await repository.add({
      configHash: HASH_TWO,
      timestamp: TIME_TWO,
      chainId: ETH_ID,
    })

    const result = await repository.getBetween(TIME_THREE, TIME_TWO, ETH_ID)
    expect(result).toEqual([{ configHash: HASH_TWO, timestamp: TIME_TWO }])
  })

  it('finds latest timestamp', async () => {
    await repository.add({
      configHash: HASH_TWO,
      timestamp: TIME_ONE,
      chainId: ETH_ID,
    })
    await repository.add({
      configHash: HASH_TWO,
      timestamp: TIME_TWO,
      chainId: ETH_ID,
    })

    const result = await repository.findLatestTimestamp(ETH_ID)
    expect(result).toEqual(TIME_ONE)
  })

  it('finds latest timestamp when database is empty', async () => {
    const result = await repository.findLatestTimestamp(ETH_ID)
    expect(result).toEqual(undefined)
  })
})
