import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { TvlCleanerRepository } from './TvlCleanerRepository'

describeDatabase(TvlCleanerRepository.name, (database) => {
  const repository = new TvlCleanerRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(`${TvlCleanerRepository.prototype.addOrUpdate.name} and ${TvlCleanerRepository.prototype.find.name}`, () => {
    it('adds or updates and finds record', async () => {
      const recordTemplate = (cleanedUntil: Date) => ({
        repositoryName: 'example',
        cleanedUntil: UnixTime.fromDate(cleanedUntil),
      })

      const record = recordTemplate(new Date('2022-02-13'))
      await repository.addOrUpdate(record)
      const foundRecord = await repository.find(record.repositoryName)
      expect(foundRecord).toEqual(record)

      const updatedRecord = recordTemplate(new Date('1999-03-19'))
      await repository.addOrUpdate(updatedRecord)
      const foundUpdatedRecord = await repository.find(record.repositoryName)
      expect(foundUpdatedRecord).toEqual(updatedRecord)
    })
  })
})
