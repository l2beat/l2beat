import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { TvlCleanerRepository } from './repository'

describeDatabase(TvlCleanerRepository.name, (db) => {
  const repository = db.tvlCleaner

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(`${TvlCleanerRepository.prototype.upsert.name} and ${TvlCleanerRepository.prototype.findByRepositoryName.name}`, () => {
    it('adds or updates and finds record', async () => {
      const record = recordTemplate(
        new Date('2022-02-13'),
        new Date('2022-01-13'),
      )
      await repository.upsert(record)
      const foundRecord = await repository.findByRepositoryName(
        record.repositoryName,
      )
      expect(foundRecord).toEqual(record)

      const updatedRecord = recordTemplate(
        new Date('1999-03-19'),
        new Date('1999-02-13'),
      )
      await repository.upsert(updatedRecord)
      const foundUpdatedRecord = await repository.findByRepositoryName(
        record.repositoryName,
      )
      expect(foundUpdatedRecord).toEqual(updatedRecord)
    })
  })
})

const recordTemplate = (
  hourlyCleanedUntil: Date,
  sixHourlyCleanedUntil: Date,
) => ({
  repositoryName: 'example',
  hourlyCleanedUntil: UnixTime.fromDate(hourlyCleanedUntil),
  sixHourlyCleanedUntil: UnixTime.fromDate(sixHourlyCleanedUntil),
})
