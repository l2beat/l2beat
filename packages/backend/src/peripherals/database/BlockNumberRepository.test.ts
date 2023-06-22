import { Logger } from '@l2beat/shared'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import { BlockNumberRepository } from './BlockNumberRepository'

const ETH = ChainId.ETHEREUM
const ARB = ChainId.ARBITRUM

describe(BlockNumberRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new BlockNumberRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it('can add new records', async () => {
    const itemA = {
      blockNumber: 1234,
      timestamp: new UnixTime(5678),
      chainId: ETH,
    }
    const itemB = {
      blockNumber: 7777,
      timestamp: new UnixTime(222222),
      chainId: ARB,
    }

    await repository.add(itemA)
    await repository.add(itemB)

    const results = await repository.getAll()

    expect(results).toEqualUnsorted([itemA, itemB])
  })

  it('can find by timestamp', async () => {
    const itemA = {
      blockNumber: 1234,
      timestamp: new UnixTime(5678),
      chainId: ETH,
    }
    const itemB = {
      blockNumber: 7777,
      timestamp: new UnixTime(222222),
      chainId: ETH,
    }
    const itemC = {
      blockNumber: 7777,
      timestamp: new UnixTime(222222),
      chainId: ARB,
    }

    await repository.add(itemA)
    await repository.add(itemB)
    await repository.add(itemC)

    const resultEth = await repository.findByTimestamp(
      ETH,
      new UnixTime(222222),
    )
    expect(resultEth).toEqual(itemB)

    const resultArb = await repository.findByTimestamp(
      ARB,
      new UnixTime(222222),
    )
    expect(resultArb).toEqual(itemC)
  })

  it('can delete all records', async () => {
    await repository.add({
      blockNumber: 1,
      timestamp: new UnixTime(1),
      chainId: ETH,
    })
    await repository.deleteAll()

    const results = await repository.getAll()
    expect(results).toEqual([])
  })
})
