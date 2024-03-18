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

  describe(
    BlockTimestampRepository.prototype.deleteBeforeInclusive.name,
    () => {
      it('deletes all records before the given timestamp', async () => {
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

        await repository.deleteBeforeInclusive('chain', new UnixTime(1))

        const results = await repository.getAll()
        expect(results).toEqualUnsorted(blocks.slice(1))
      })
    },
  )

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
