import { Logger } from '@l2beat/backend-tools'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import {
  BlockNumberRecord,
  BlockNumberRepository,
} from './BlockNumberRepository'
import { PriceRepository } from './PriceRepository'

describeDatabase(BlockNumberRepository.name, (database) => {
  const repository = new BlockNumberRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

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

  describe(PriceRepository.prototype.deleteHourlyUntil.name, () => {
    it('deletes hourly reports', async () => {
      const start = UnixTime.now().toStartOf('day')
      const until = start.add(25, 'hours')

      const entries = []
      for (
        let i = start.toNumber();
        i <= until.toNumber();
        i += UnixTime.HOUR
      ) {
        entries.push(fakeBlockRecord({ timestamp: new UnixTime(i) }))
      }

      await Promise.all(entries.map((e) => repository.add(e)))
      await repository.deleteHourlyUntil(until)
      const results = await repository.getAll(ChainId.ETHEREUM)

      expect(results).toEqualUnsorted([
        fakeBlockRecord({ timestamp: start }),
        fakeBlockRecord({ timestamp: start.add(6, 'hours') }),
        fakeBlockRecord({ timestamp: start.add(12, 'hours') }),
        fakeBlockRecord({ timestamp: start.add(18, 'hours') }),
        fakeBlockRecord({ timestamp: start.add(24, 'hours') }),
        fakeBlockRecord({ timestamp: start.add(25, 'hours') }),
      ])
    })
  })

  describe(PriceRepository.prototype.deleteSixHourlyUntil.name, () => {
    it('deletes six hourly reports', async () => {
      const start = UnixTime.now().toStartOf('day')
      const until = start.add(7, 'hours')

      const entries = []
      for (
        let i = start.toNumber();
        i <= until.toNumber();
        i += UnixTime.HOUR
      ) {
        entries.push(fakeBlockRecord({ timestamp: new UnixTime(i) }))
      }

      await Promise.all(entries.map((e) => repository.add(e)))
      await repository.deleteSixHourlyUntil(until)
      const results = await repository.getAll(ChainId.ETHEREUM)

      expect(results).toEqualUnsorted([
        fakeBlockRecord({ timestamp: start }),
        fakeBlockRecord({ timestamp: start.add(1, 'hours') }),
        fakeBlockRecord({ timestamp: start.add(2, 'hours') }),
        fakeBlockRecord({ timestamp: start.add(3, 'hours') }),
        fakeBlockRecord({ timestamp: start.add(4, 'hours') }),
        fakeBlockRecord({ timestamp: start.add(5, 'hours') }),
        fakeBlockRecord({ timestamp: start.add(7, 'hours') }),
      ])
    })
  })
})

function fakeBlockRecord(
  report?: Partial<BlockNumberRecord>,
): BlockNumberRecord {
  return {
    timestamp: UnixTime.now(),
    blockNumber: 0,
    chainId: ChainId.ETHEREUM,
    ...report,
  }
}
