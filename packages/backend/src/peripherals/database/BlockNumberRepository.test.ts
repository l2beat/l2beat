import { Logger } from '@l2beat/backend-tools'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import {
  BlockNumberRecord,
  BlockNumberRepository,
} from './BlockNumberRepository'
import { testDeletingArchivedRecords } from './shared/deleteArchivedRecords'

describeDatabase(BlockNumberRepository.name, (database) => {
  const repository = new BlockNumberRepository(database, Logger.SILENT)

  afterEach(async () => {
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

    const resultsEth = await repository.getAllByChainId(ChainId.ETHEREUM)
    expect(resultsEth).toEqualUnsorted([itemA])

    const resultsArb = await repository.getAllByChainId(ChainId.ARBITRUM)
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

  it(BlockNumberRepository.prototype.getAllByChainId.name, async () => {
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

    const resultsEth = await repository.getAllByChainId(ChainId.ETHEREUM)
    expect(resultsEth).toEqualUnsorted([itemA, itemB])

    const resultsArb = await repository.getAllByChainId(ChainId.ARBITRUM)
    expect(resultsArb).toEqualUnsorted([itemC])
  })

  it(BlockNumberRepository.prototype.deleteAll.name, async () => {
    await repository.add({
      blockNumber: 1,
      timestamp: new UnixTime(1),
      chainId: ChainId.ETHEREUM,
    })
    await repository.deleteAll()

    const results = await repository.getAllByChainId(ChainId.ETHEREUM)
    expect(results).toEqual([])
  })

  testDeletingArchivedRecords(repository, fakeBlockRecord)
})

function fakeBlockRecord(timestamp: UnixTime): BlockNumberRecord {
  return {
    timestamp,
    blockNumber: 0,
    chainId: ChainId.ETHEREUM,
  }
}
