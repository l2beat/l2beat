import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { ProjectValueRepository } from './repository'

describeDatabase(ProjectValueRepository.name, (db) => {
  const repository = db.tvsProjectValue

  describe(ProjectValueRepository.prototype.upsertMany.name, () => {
    it('inserts new records', async () => {
      const records = [
        projectValue('ethereum', 'tvl', UnixTime(100), 1000),
        projectValue('arbitrum', 'tvl', UnixTime(100), 500),
      ]

      const inserted = await repository.upsertMany(records)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('updates existing records on conflict', async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'tvl', UnixTime(100), 1000),
        projectValue('arbitrum', 'tvl', UnixTime(100), 500),
      ])

      const updatedRecords = [
        projectValue('ethereum', 'tvl', UnixTime(100), 1500, {
          ...projectValue('ethereum', 'tvl', UnixTime(100), 1000),
          canonical: 800,
          external: 700,
        }),
        projectValue('arbitrum', 'tvl', UnixTime(100), 600),
      ]

      await repository.upsertMany(updatedRecords)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(updatedRecords)
    })

    it('handles empty array', async () => {
      const inserted = await repository.upsertMany([])
      expect(inserted).toEqual(0)
    })

    it('performs batch insert when more than 1000 records', async () => {
      const records = []
      for (let i = 0; i < 1500; i++) {
        records.push(
          projectValue(`project${i}`, 'tvl', UnixTime(100), 1000 + i),
        )
      }

      const inserted = await repository.upsertMany(records)
      expect(inserted).toEqual(1500)

      const result = await repository.getAll()
      expect(result.length).toEqual(1500)
    })

    it('handles complex breakdown values', async () => {
      const record = projectValue('ethereum', 'tvl', UnixTime(100), 1000, {
        canonical: 400,
        external: 300,
        native: 200,
        ether: 100,
        stablecoin: 0,
        other: 0,
        associated: 0,
      })

      await repository.upsertMany([record])

      const result = await repository.getAll()
      expect(result[0]).toEqual(record)
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function projectValue(
  project: string,
  type: string,
  timestamp: UnixTime,
  value: number,
  breakdown = {
    canonical: 0,
    external: 0,
    native: 0,
    ether: 0,
    stablecoin: 0,
    other: 0,
    associated: 0,
  },
) {
  return {
    project,
    type,
    timestamp,
    value,
    ...breakdown,
  }
}
