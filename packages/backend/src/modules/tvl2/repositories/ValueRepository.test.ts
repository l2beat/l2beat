import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { ValueRecord, ValueRepository } from './ValueRepository'

describeDatabase(ValueRepository.name, (database) => {
  const repository = new ValueRepository(database, Logger.SILENT)

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(ValueRepository.prototype.addMany.name, () => {
    it('adds new rows', async () => {
      await repository.addMany([
        saved('a', UnixTime.ZERO, 1, 2, 3),
        saved('b', UnixTime.ZERO, 2, 3, 4),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        saved('a', UnixTime.ZERO, 1, 2, 3),
        saved('b', UnixTime.ZERO, 2, 3, 4),
      ])
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })

    it('performs batch insert when more than 10k records', async () => {
      const records: ValueRecord[] = []
      for (let i = 5; i < 15_000; i++) {
        records.push(saved('a', new UnixTime(i), i, i * 2, i + 1))
      }
      await expect(repository.addMany(records)).not.toBeRejected()
    })
  })

  it(ValueRepository.prototype.deleteAll.name, async () => {
    await repository.addMany([saved('a', UnixTime.ZERO, 1, 2, 3)])

    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toEqual([])
  })
})

function saved(
  id: string,
  timestamp: UnixTime,
  canonical: number,
  external: number,
  native: number,
): ValueRecord {
  return {
    projectId: ProjectId(id),
    timestamp,
    canonical,
    external,
    native,
  }
}
