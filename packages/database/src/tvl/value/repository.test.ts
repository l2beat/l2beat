import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { testDeletingArchivedRecords } from '../../utils/deleteArchivedRecords.test'
import type { ValueRecord } from './entity'
import { ValueRepository } from './repository'

describeDatabase(ValueRepository.name, (database) => {
  const repository = database.value

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(ValueRepository.prototype.getLatestValues.name, async () => {
    it('returns latest value for projectId x data source combination for given projects', async () => {
      await repository.upsertMany([
        saved('Project-A', UnixTime.ZERO, 'sourceA', 1, 2, 3),
        saved('Project-A', UnixTime.ZERO, 'sourceB', 1, 2, 3),
        saved('Project-A', UnixTime.ZERO.add(1, 'days'), 'sourceC', 1, 2, 3),
        saved('Project-A', UnixTime.ZERO, 'sourceC', 1, 2, 3), // Should be discarded

        saved('Project-B', UnixTime.ZERO.add(1, 'days'), 'sourceA', 1, 2, 3),
        saved('Project-B', UnixTime.ZERO, 'sourceA', 1, 2, 3), // Should be discarded
        saved('Project-C', UnixTime.ZERO.add(1, 'days'), 'sourceA', 1, 2, 3), // Should be discarded,
      ])

      const latestForProjects = await repository.getLatestValues([
        ProjectId('Project-A'),
        ProjectId('Project-B'),
      ])

      expect(latestForProjects.length).toEqual(4)
      expect(latestForProjects).toEqualUnsorted([
        saved('Project-A', UnixTime.ZERO, 'sourceA', 1, 2, 3),
        saved('Project-A', UnixTime.ZERO, 'sourceB', 1, 2, 3),
        saved('Project-A', UnixTime.ZERO.add(1, 'days'), 'sourceC', 1, 2, 3),
        saved('Project-B', UnixTime.ZERO.add(1, 'days'), 'sourceA', 1, 2, 3),
      ])
    })

    it('returns latest value for projectId x data source combination for all projects', async () => {
      await repository.upsertMany([
        saved('Project-A', UnixTime.ZERO, 'sourceA', 1, 2, 3),
        saved('Project-A', UnixTime.ZERO, 'sourceB', 1, 2, 3),
        saved('Project-A', UnixTime.ZERO.add(1, 'days'), 'sourceC', 1, 2, 3),
        saved('Project-A', UnixTime.ZERO, 'sourceC', 1, 2, 3), // Should be discarded

        saved('Project-B', UnixTime.ZERO.add(1, 'days'), 'sourceA', 1, 2, 3),
        saved('Project-B', UnixTime.ZERO, 'sourceA', 1, 2, 3), // Should be discarded
        saved('Project-C', UnixTime.ZERO.add(1, 'days'), 'sourceA', 1, 2, 3),
      ])

      const latestForProjects = await repository.getLatestValues()

      expect(latestForProjects.length).toEqual(5)
      expect(latestForProjects).toEqualUnsorted([
        saved('Project-A', UnixTime.ZERO, 'sourceA', 1, 2, 3),
        saved('Project-A', UnixTime.ZERO, 'sourceB', 1, 2, 3),
        saved('Project-A', UnixTime.ZERO.add(1, 'days'), 'sourceC', 1, 2, 3),
        saved('Project-B', UnixTime.ZERO.add(1, 'days'), 'sourceA', 1, 2, 3),
        saved('Project-C', UnixTime.ZERO.add(1, 'days'), 'sourceA', 1, 2, 3),
      ])
    })
  })

  describe(ValueRepository.prototype.upsertMany.name, () => {
    it('adds new rows', async () => {
      await repository.upsertMany([
        saved('a', UnixTime.ZERO, 'data_src', 1, 2, 3),
        saved('b', UnixTime.ZERO, 'data_src', 2, 3, 4),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        saved('a', UnixTime.ZERO, 'data_src', 1, 2, 3),
        saved('b', UnixTime.ZERO, 'data_src', 2, 3, 4),
      ])
    })

    it('upserts rows', async () => {
      await repository.upsertMany([
        saved('a', UnixTime.ZERO, 'data_src', 1, 2, 3),
        saved('b', UnixTime.ZERO, 'data_src', 2, 3, 4),
      ])

      await repository.upsertMany([
        saved('a', UnixTime.ZERO, 'data_src', 11, 22, 33),
        saved('b', UnixTime.ZERO, 'data_src', 22, 33, 44),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        saved('a', UnixTime.ZERO, 'data_src', 11, 22, 33),
        saved('b', UnixTime.ZERO, 'data_src', 22, 33, 44),
      ])
    })

    it('empty array', async () => {
      await expect(repository.upsertMany([])).not.toBeRejected()
    })

    it('performs batch insert with many records', async () => {
      const records: ValueRecord[] = []
      for (let i = 5; i < 5_000; i++) {
        records.push(saved('a', new UnixTime(i), 'data_src', i, i * 2, i + 1))
      }
      await expect(repository.upsertMany(records)).not.toBeRejected()
    })
  })

  it(ValueRepository.prototype.deleteAll.name, async () => {
    await repository.upsertMany([
      saved('a', UnixTime.ZERO, 'data_src', 1, 2, 3),
    ])

    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toEqual([])
  })

  // TvlCleaner test
  testDeletingArchivedRecords(repository, (timestamp) =>
    saved('a', timestamp, 'data_src', 1, 2, 3),
  )
})

function saved(
  id: string,
  timestamp: UnixTime,
  dataSource: string,
  canonical: number,
  external: number,
  native: number,
): ValueRecord {
  return {
    projectId: ProjectId(id),
    timestamp,
    dataSource,
    canonical: BigInt(canonical),
    canonicalAssociated: BigInt(canonical),
    canonicalForTotal: BigInt(canonical),
    canonicalAssociatedForTotal: BigInt(canonical),
    external: BigInt(external),
    externalAssociated: BigInt(external),
    externalForTotal: BigInt(external),
    externalAssociatedForTotal: BigInt(external),
    native: BigInt(native),
    nativeAssociated: BigInt(native),
    nativeForTotal: BigInt(native),
    nativeAssociatedForTotal: BigInt(native),
    ether: BigInt(0),
    stablecoin: BigInt(0),
  }
}
