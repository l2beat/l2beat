import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type UpdateNotifierRecord,
  UpdateNotifierRepository,
} from './UpdateNotifierRepository'

const PROJECT1 = 'project1'
const PROJECT2 = 'project2'

describeDatabase(UpdateNotifierRepository.name, (db) => {
  const repository = db.updateNotifier
  const NOW = UnixTime.now()

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(UpdateNotifierRepository.prototype.findLatestId.name, async () => {
    const record = mockRecord(PROJECT1)

    await repository.insert(record)
    await repository.insert(record)
    const latestId = await repository.insert(record)

    const result = await repository.findLatestId()

    expect(result).toEqual(latestId)
  })

  it(UpdateNotifierRepository.prototype.insert.name, async () => {
    const record = mockRecord(PROJECT1)

    const latestId = await repository.insert(record)

    const latest = await repository.findLatestId()

    expect(latest).toEqual(latestId)
  })

  describe(UpdateNotifierRepository.prototype.getNewerThan.name, () => {
    it('finds two records newly added', async () => {
      const ethRecord = mockRecord(PROJECT2)
      const arbRecord1 = mockRecord(PROJECT1)
      const arbRecord2 = mockRecord(PROJECT1)

      await repository.insert(ethRecord)
      const secondId = await repository.insert(arbRecord1)
      const thirdId = await repository.insert(arbRecord2)
      const result = await repository.getNewerThan(
        NOW - 2 * UnixTime.DAY,
        PROJECT1,
      )

      expect(result.length).toEqual(2)
      expect(result[0]!).toHaveSubset({ id: secondId, ...arbRecord1 })
      expect(result[1]!).toHaveSubset({ id: thirdId, ...arbRecord2 })
    })

    it('does not return if does not match the range', async () => {
      const ethRecord = mockRecord(PROJECT1)

      await repository.insert(ethRecord)
      const result = await repository.getNewerThan(
        NOW + 2 * UnixTime.DAY,
        PROJECT1,
      )

      expect(result.length).toEqual(0)
    })

    it('does not return if does not match any projectId', async () => {
      const ethRecord = mockRecord(PROJECT2)

      await repository.insert(ethRecord)
      const result = await repository.getNewerThan(
        NOW - 2 * UnixTime.DAY,
        PROJECT1,
      )

      expect(result.length).toEqual(0)
    })
  })
})

function mockRecord(
  projectId: string,
): Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    projectId,
    timestamp: -1,
    diff: [
      {
        name: 'Contract',
        address: ChainSpecificAddress.random(),
        addressType: 'Contract',
        diff: [
          {
            key: 'key',
            before: 'before',
            after: 'after',
          },
        ],
      },
    ],
  }
}
