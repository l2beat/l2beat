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

  describe(ProjectValueRepository.prototype.trimProject.name, () => {
    beforeEach(async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'tvl', UnixTime(50), 500),
        projectValue('ethereum', 'tvl', UnixTime(100), 1000),
        projectValue('ethereum', 'tvl', UnixTime(150), 1500),
        projectValue('ethereum', 'tvl', UnixTime(200), 2000),
        projectValue('ethereum', 'tvl', UnixTime(250), 2500),
        projectValue('arbitrum', 'tvl', UnixTime(100), 500),
        projectValue('arbitrum', 'tvl', UnixTime(200), 1000),
      ])
    })

    it('deletes records outside the specified time range for a project', async () => {
      const deleted = await repository.trimProject('ethereum', 100, 200)

      expect(deleted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted([
        projectValue('ethereum', 'tvl', UnixTime(100), 1000),
        projectValue('ethereum', 'tvl', UnixTime(150), 1500),
        projectValue('ethereum', 'tvl', UnixTime(200), 2000),
        projectValue('arbitrum', 'tvl', UnixTime(100), 500),
        projectValue('arbitrum', 'tvl', UnixTime(200), 1000),
      ])
    })

    it('only deletes records before sinceTimestamp when untilTimestamp is null', async () => {
      const deleted = await repository.trimProject('ethereum', 150, null)

      expect(deleted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted([
        projectValue('ethereum', 'tvl', UnixTime(150), 1500),
        projectValue('ethereum', 'tvl', UnixTime(200), 2000),
        projectValue('ethereum', 'tvl', UnixTime(250), 2500),
        projectValue('arbitrum', 'tvl', UnixTime(100), 500),
        projectValue('arbitrum', 'tvl', UnixTime(200), 1000),
      ])
    })

    it('only affects the specified project', async () => {
      await repository.trimProject('ethereum', 100, 200)

      const allRecords = await repository.getAll()
      const arbitrumRecords = allRecords.filter((r) => r.project === 'arbitrum')

      expect(arbitrumRecords).toEqualUnsorted([
        projectValue('arbitrum', 'tvl', UnixTime(100), 500),
        projectValue('arbitrum', 'tvl', UnixTime(200), 1000),
      ])
    })

    it('returns 0 when no records are deleted', async () => {
      const deleted = await repository.trimProject('ethereum', 0, 300)
      expect(deleted).toEqual(0)

      const allRecords = await repository.getAll()
      const ethereumRecords = allRecords.filter((r) => r.project === 'ethereum')
      expect(ethereumRecords.length).toEqual(5)
    })

    it('returns 0 when project does not exist', async () => {
      const deleted = await repository.trimProject('non-existent', 100, 200)
      expect(deleted).toEqual(0)
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
