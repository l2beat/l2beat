import { Logger } from '@l2beat/shared'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../test/database'
import { BlockNumberRepository } from './BlockNumberRepository'

describe(BlockNumberRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new BlockNumberRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(BlockNumberRepository.prototype.add.name, async () => {
    const itemA = {
      blockNumber: 1234,
      timestamp: new UnixTime(5678),
      chainId: ChainId.ETHEREUM,
    }
    const itemB = {
      blockNumber: 7777,
      timestamp: new UnixTime(222222),
      chainId: ChainId.ARBITRUM,
    }

    await repository.add(itemA)
    await repository.add(itemB)

    const resultsEth = await repository.getAll(ChainId.ETHEREUM)
    expect(resultsEth).toEqualUnsorted([itemA])

    const resultsArb = await repository.getAll(ChainId.ARBITRUM)
    expect(resultsArb).toEqualUnsorted([itemB])
  })

  it(BlockNumberRepository.prototype.findByTimestamp.name, async () => {
    const itemA = {
      blockNumber: 1234,
      timestamp: new UnixTime(5678),
      chainId: ChainId.ETHEREUM,
    }
    const itemB = {
      blockNumber: 7777,
      timestamp: new UnixTime(222222),
      chainId: ChainId.ETHEREUM,
    }
    const itemC = {
      blockNumber: 7777,
      timestamp: new UnixTime(222222),
      chainId: ChainId.ARBITRUM,
    }

    await repository.add(itemA)
    await repository.add(itemB)
    await repository.add(itemC)

    const resultEth = await repository.findByTimestamp(
      ChainId.ETHEREUM,
      new UnixTime(222222),
    )
    expect(resultEth).toEqual(itemB)

    const resultArb = await repository.findByTimestamp(
      ChainId.ARBITRUM,
      new UnixTime(222222),
    )
    expect(resultArb).toEqual(itemC)
  })

  it(BlockNumberRepository.prototype.getAll.name, async () => {
    const itemA = {
      blockNumber: 1234,
      timestamp: new UnixTime(5678),
      chainId: ChainId.ETHEREUM,
    }
    const itemB = {
      blockNumber: 7777,
      timestamp: new UnixTime(222222),
      chainId: ChainId.ETHEREUM,
    }
    const itemC = {
      blockNumber: 7777,
      timestamp: new UnixTime(222222),
      chainId: ChainId.ARBITRUM,
    }

    await repository.add(itemA)
    await repository.add(itemB)
    await repository.add(itemC)

    const resultsEth = await repository.getAll(ChainId.ETHEREUM)
    expect(resultsEth).toEqualUnsorted([itemA, itemB])

    const resultsArb = await repository.getAll(ChainId.ARBITRUM)
    expect(resultsArb).toEqualUnsorted([itemC])
  })

  it(BlockNumberRepository.prototype.deleteAll.name, async () => {
    await repository.add({
      blockNumber: 1,
      timestamp: new UnixTime(1),
      chainId: ChainId.ETHEREUM,
    })
    await repository.deleteAll()

    const results = await repository.getAll(ChainId.ETHEREUM)
    expect(results).toEqual([])
  })
})
