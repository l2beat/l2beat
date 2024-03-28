import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { BlockTimestampRepository } from './BlockTimestampRepository'

describeDatabase(BlockTimestampRepository.name, (database) => {
  const repository = new BlockTimestampRepository(database, Logger.SILENT)

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(BlockTimestampRepository.prototype.add.name, () => {
    it('adds new row', async () => {
      const newRow = {
        chain: 'chain',
        timestamp: UnixTime.ZERO,
        blockNumber: 0,
      }

      await repository.add(newRow)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([newRow])
    })
  })

  describe(BlockTimestampRepository.prototype.deleteAfterExclusive.name, () => {
    it('deletes all records after the given timestamp', async () => {
      const blocks = [
        {
          chain: 'chain',
          timestamp: new UnixTime(1),
          blockNumber: 1,
        },
        {
          chain: 'chain',
          timestamp: new UnixTime(2),
          blockNumber: 2,
        },
        {
          chain: 'chain-2',
          timestamp: new UnixTime(1),
          blockNumber: 1,
        },
      ]
      await Promise.all(blocks.map((b) => repository.add(b)))

      await repository.deleteAfterExclusive('chain', new UnixTime(1))

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([blocks[0], blocks[2]])
    })
  })

  it(BlockTimestampRepository.prototype.findByTimestamp.name, async () => {
    const records = [
      {
        chain: 'chain',
        timestamp: new UnixTime(0),
        blockNumber: 0,
      },
      {
        chain: 'chain',
        timestamp: new UnixTime(1),
        blockNumber: 0,
      },
      {
        chain: 'chain-1',
        timestamp: UnixTime.ZERO,
        blockNumber: 0,
      },
    ]
    for (const r of records) {
      await repository.add(r)
    }

    const results = await repository.findByTimestamp('chain', new UnixTime(0))

    expect(results).toEqual(records[0])
  })

  it(BlockTimestampRepository.prototype.deleteAll.name, async () => {
    await repository.add({
      chain: 'chain',
      timestamp: UnixTime.ZERO,
      blockNumber: 0,
    })

    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toEqual([])
  })
})
