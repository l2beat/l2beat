import { ProjectId, type ProjectValueType, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { ProjectValueRepository } from './repository'

describeDatabase(ProjectValueRepository.name, (db) => {
  const repository = db.tvsProjectValue

  describe(ProjectValueRepository.prototype.upsertMany.name, () => {
    it('inserts new records', async () => {
      const records = [
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 500),
      ]

      const inserted = await repository.upsertMany(records)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('updates existing records on primary key conflict', async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(100), 1500),
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 500),
      ])

      const updatedRecords = [
        projectValue('ethereum', 'PROJECT', UnixTime(100), 2000),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(100), 2500),
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 1500),
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
          projectValue(`project${i}`, 'PROJECT', UnixTime(100), 1000 + i),
        )
      }

      const inserted = await repository.upsertMany(records)
      expect(inserted).toEqual(1500)

      const result = await repository.getAll()
      expect(result.length).toEqual(1500)
    })

    it('updates only specified fields on conflict', async () => {
      const initialRecord = projectValue(
        'ethereum',
        'PROJECT',
        UnixTime(100),
        1000,
        {
          canonical: 400,
          external: 300,
          native: 200,
          ether: 100,
          stablecoin: 50,
          other: 25,
          associated: 25,
        },
      )

      await repository.upsertMany([initialRecord])

      const partialUpdate = {
        ...initialRecord,
        value: 1500,
        canonical: 800,
        external: 700,
      }

      await repository.upsertMany([partialUpdate])

      const result = await repository.getAll()
      expect(result[0]).toEqual({
        ...initialRecord,
        value: 1500,
        canonical: 800,
        external: 700,
      })
    })
  })

  describe(ProjectValueRepository.prototype.getProjectValuesAtTimestamps
    .name, () => {
    it('returns records at the specified timestamps for given types', async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'PROJECT', UnixTime(50), 500),
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
        projectValue('ethereum', 'PROJECT', UnixTime(150), 1500),
        projectValue('ethereum', 'PROJECT', UnixTime(200), 2000),
        projectValue('ethereum', 'PROJECT', UnixTime(250), 2500),
        projectValue('ethereum', 'SUMMARY', UnixTime(50), 550),
        projectValue('ethereum', 'SUMMARY', UnixTime(100), 1050),
        projectValue('ethereum', 'SUMMARY', UnixTime(200), 2050),
        projectValue('ethereum', 'SUMMARY_WA', UnixTime(50), 1100),
        projectValue('ethereum', 'SUMMARY_WA', UnixTime(200), 2100),
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 500),
        projectValue('arbitrum', 'PROJECT', UnixTime(200), 1000),
        projectValue('arbitrum', 'SUMMARY', UnixTime(50), 250),
        projectValue('arbitrum', 'SUMMARY', UnixTime(150), 750),
      ])

      const result = await repository.getProjectValuesAtTimestamps(100, 200, [
        'SUMMARY',
        'SUMMARY_WA',
      ])

      expect(result).toEqualUnsorted([
        // Latest records at timestamp 200
        projectValue('ethereum', 'SUMMARY', UnixTime(200), 2050),
        projectValue('ethereum', 'SUMMARY_WA', UnixTime(200), 2100),
        projectValue('arbitrum', 'SUMMARY', UnixTime(150), 750),

        // Oldest records at timestamp 100
        projectValue('ethereum', 'SUMMARY', UnixTime(100), 1050),
        projectValue('ethereum', 'SUMMARY_WA', UnixTime(50), 1100),
        projectValue('arbitrum', 'SUMMARY', UnixTime(50), 250),
      ])
    })

    it('returns records sorted by timestamp in ascending order', async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'SUMMARY', UnixTime(50), 550),
        projectValue('ethereum', 'SUMMARY', UnixTime(200), 2050),
        projectValue('ethereum', 'SUMMARY_WA', UnixTime(50), 1100),
        projectValue('ethereum', 'SUMMARY_WA', UnixTime(200), 2100),
        projectValue('arbitrum', 'SUMMARY', UnixTime(50), 250),
        projectValue('arbitrum', 'SUMMARY', UnixTime(150), 750),
      ])

      const result = await repository.getProjectValuesAtTimestamps(50, 200, [
        'SUMMARY',
        'SUMMARY_WA',
      ])

      expect(result.map((r) => r.timestamp)).toEqual([
        50, 50, 50, 150, 200, 200,
      ])
    })

    it('returns empty array when no matching records exist', async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'PROJECT', UnixTime(50), 500),
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
      ])

      const result = await repository.getProjectValuesAtTimestamps(100, 200, [
        'SUMMARY',
      ])
      expect(result).toEqual([])
    })

    it('returns empty array when types array is empty', async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'PROJECT', UnixTime(50), 500),
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
      ])

      const result = await repository.getProjectValuesAtTimestamps(100, 200, [])
      expect(result).toEqual([])
    })
  })

  describe(ProjectValueRepository.prototype.trimProject.name, () => {
    it('deletes records outside the specified time range for a project', async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'PROJECT', UnixTime(50), 500),
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
        projectValue('ethereum', 'PROJECT', UnixTime(150), 1500),
        projectValue('ethereum', 'PROJECT', UnixTime(200), 2000),
        projectValue('ethereum', 'PROJECT', UnixTime(250), 2500),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(100), 1100),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(200), 2100),
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 500),
        projectValue('arbitrum', 'PROJECT', UnixTime(200), 1000),
      ])

      const deleted = await repository.trimProject('ethereum', 100, 200)

      expect(deleted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted([
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
        projectValue('ethereum', 'PROJECT', UnixTime(150), 1500),
        projectValue('ethereum', 'PROJECT', UnixTime(200), 2000),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(100), 1100),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(200), 2100),
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 500),
        projectValue('arbitrum', 'PROJECT', UnixTime(200), 1000),
      ])
    })

    it('only deletes records before sinceTimestamp when untilTimestamp is null', async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'PROJECT', UnixTime(50), 500),
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
        projectValue('ethereum', 'PROJECT', UnixTime(150), 1500),
        projectValue('ethereum', 'PROJECT', UnixTime(200), 2000),
        projectValue('ethereum', 'PROJECT', UnixTime(250), 2500),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(100), 1100),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(200), 2100),
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 500),
        projectValue('arbitrum', 'PROJECT', UnixTime(200), 1000),
      ])

      const deleted = await repository.trimProject('ethereum', 150, null)

      expect(deleted).toEqual(3)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted([
        projectValue('ethereum', 'PROJECT', UnixTime(150), 1500),
        projectValue('ethereum', 'PROJECT', UnixTime(200), 2000),
        projectValue('ethereum', 'PROJECT', UnixTime(250), 2500),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(200), 2100),
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 500),
        projectValue('arbitrum', 'PROJECT', UnixTime(200), 1000),
      ])
    })

    it('only affects the specified project', async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'PROJECT', UnixTime(50), 500),
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
        projectValue('ethereum', 'PROJECT', UnixTime(150), 1500),
        projectValue('ethereum', 'PROJECT', UnixTime(200), 2000),
        projectValue('ethereum', 'PROJECT', UnixTime(250), 2500),
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 500),
        projectValue('arbitrum', 'PROJECT', UnixTime(200), 1000),
      ])

      await repository.trimProject('ethereum', 100, 200)

      const allRecords = await repository.getAll()
      const arbitrumRecords = allRecords.filter((r) => r.project === 'arbitrum')

      expect(arbitrumRecords).toEqualUnsorted([
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 500),
        projectValue('arbitrum', 'PROJECT', UnixTime(200), 1000),
      ])
    })

    it('deletes all types for a project within the time range', async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'PROJECT', UnixTime(50), 500),
        projectValue('ethereum', 'SUMMARY', UnixTime(50), 550),
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(100), 1100),
        projectValue('ethereum', 'PROJECT', UnixTime(150), 1500),
        projectValue('ethereum', 'PROJECT', UnixTime(200), 2000),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(200), 2100),
        projectValue('ethereum', 'PROJECT', UnixTime(250), 2500),
        projectValue('ethereum', 'SUMMARY', UnixTime(250), 2550),
      ])

      const deleted = await repository.trimProject('ethereum', 100, 200)

      expect(deleted).toEqual(4)

      const result = await repository.getAll()
      const ethereumRecords = result.filter((r) => r.project === 'ethereum')

      expect(ethereumRecords.length).toEqual(5)
    })
  })

  describe(ProjectValueRepository.prototype.getByProjectsForType.name, () => {
    beforeEach(async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
        projectValue('ethereum', 'PROJECT', UnixTime(200), 2000),
        projectValue('ethereum', 'PROJECT', UnixTime(300), 3000),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(100), 1100),
        projectValue('ethereum', 'PROJECT_WA', UnixTime(200), 2100),
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 500),
        projectValue('arbitrum', 'PROJECT', UnixTime(200), 1000),
        projectValue('arbitrum', 'PROJECT', UnixTime(300), 1500),
        projectValue('optimism', 'SUMMARY', UnixTime(100), 5000),
        projectValue('optimism', 'SUMMARY', UnixTime(200), 10000),
        projectValue('optimism', 'SUMMARY', UnixTime(300), 10000),
      ])
    })

    it('returns all records of the specified type within the range for a given projects', async () => {
      const result = await repository.getByProjectsForType(
        [ProjectId('ethereum'), ProjectId('arbitrum')],
        'PROJECT',
        [100, 200],
      )

      expect(result).toEqualUnsorted([
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
        projectValue('ethereum', 'PROJECT', UnixTime(200), 2000),
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 500),
        projectValue('arbitrum', 'PROJECT', UnixTime(200), 1000),
      ])
    })

    it('returns records in ascending timestamp order', async () => {
      const result = await repository.getByProjectsForType(
        [ProjectId('optimism')],
        'SUMMARY',
        [null, 300],
      )

      expect(result).toEqualUnsorted([
        projectValue('optimism', 'SUMMARY', UnixTime(100), 5000),
        projectValue('optimism', 'SUMMARY', UnixTime(200), 10000),
        projectValue('optimism', 'SUMMARY', UnixTime(300), 10000),
      ])
    })

    it('handles null start timestamp correctly', async () => {
      const result = await repository.getByProjectsForType(
        [ProjectId('ethereum'), ProjectId('arbitrum')],
        'PROJECT',
        [null, 150],
      )

      expect(result).toEqualUnsorted([
        projectValue('ethereum', 'PROJECT', UnixTime(100), 1000),
        projectValue('arbitrum', 'PROJECT', UnixTime(100), 500),
      ])
    })

    it('returns empty array when no records match the criteria', async () => {
      const result = await repository.getByProjectsForType(
        [ProjectId('arbitrum')],
        'NON_EXISTENT_TYPE' as ProjectValueType,
        [100, 300],
      )

      expect(result).toEqual([])
    })

    it('returns empty array when projects array is empty', async () => {
      const result = await repository.getByProjectsForType(
        [],
        'PROJECT',
        [100, 300],
      )

      expect(result).toEqual([])
    })
  })

  describe(ProjectValueRepository.prototype.getLatestValues.name, () => {
    it('returns the latest values for a given type', async () => {
      await repository.upsertMany([
        projectValue('ethereum', 'SUMMARY', UnixTime(100), 1000),
        projectValue('ethereum', 'SUMMARY', UnixTime(200), 2000),
        projectValue('ethereum', 'PROJECT', UnixTime(200), 2000),
        projectValue('arbitrum', 'PROJECT', UnixTime(200), 3000),
        projectValue('arbitrum', 'PROJECT', UnixTime(300), 4000),
      ])

      const result = await repository.getLatestValues('PROJECT')

      expect(result).toEqualUnsorted([
        projectValue('ethereum', 'PROJECT', UnixTime(200), 2000),
        projectValue('arbitrum', 'PROJECT', UnixTime(300), 4000),
      ])
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function projectValue(
  project: string,
  type: ProjectValueType,
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
