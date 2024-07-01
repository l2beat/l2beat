import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { TvlCleanerRepository } from './TvlCleanerRepository'

describeDatabase(TvlCleanerRepository.name, (knex, kysely) => {
  const oldRepo = new TvlCleanerRepository(knex, Logger.SILENT)
  const newRepo = kysely.tvlCleaner

  suite(oldRepo)
  suite(newRepo)

  function suite(repository: typeof oldRepo | typeof newRepo) {
    beforeEach(async () => {
      await repository.deleteAll()
    })

    describe(`${TvlCleanerRepository.prototype.addOrUpdate.name} and ${TvlCleanerRepository.prototype.find.name}`, () => {
      it('adds or updates and finds record', async () => {
        const record = recordTemplate(
          new Date('2022-02-13'),
          new Date('2022-01-13'),
        )
        await repository.addOrUpdate(record)
        const foundRecord = await repository.find(record.repositoryName)
        expect(foundRecord).toEqual(record)

        const updatedRecord = recordTemplate(
          new Date('1999-03-19'),
          new Date('1999-02-13'),
        )
        await repository.addOrUpdate(updatedRecord)
        const foundUpdatedRecord = await repository.find(record.repositoryName)
        expect(foundUpdatedRecord).toEqual(updatedRecord)
      })
    })
  }
})

const recordTemplate = (
  hourlyCleanedUntil: Date,
  sixHourlyCleanedUntil: Date,
) => ({
  repositoryName: 'example',
  hourlyCleanedUntil: UnixTime.fromDate(hourlyCleanedUntil),
  sixHourlyCleanedUntil: UnixTime.fromDate(sixHourlyCleanedUntil),
})
