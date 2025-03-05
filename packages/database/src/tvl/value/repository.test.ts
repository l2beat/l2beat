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
        saved('Project-A', 0, 'sourceA', 1, 2, 3),
        saved('Project-A', 0, 'sourceB', 1, 2, 3),
        saved('Project-A', 0 + UnixTime(1, 'days'), 'sourceC', 1, 2, 3),
        saved('Project-A', 0, 'sourceC', 1, 2, 3), // Should be discarded

        saved('Project-B', 0 + UnixTime(1, 'days'), 'sourceA', 1, 2, 3),
        saved('Project-B', 0, 'sourceA', 1, 2, 3), // Should be discarded
        saved('Project-C', 0 + UnixTime(1, 'days'), 'sourceA', 1, 2, 3), // Should be discarded,
      ])

      const latestForProjects = await repository.getLatestValues([
        ProjectId('Project-A'),
        ProjectId('Project-B'),
      ])

      expect(latestForProjects.length).toEqual(4)
      expect(latestForProjects).toEqualUnsorted([
        saved('Project-A', 0, 'sourceA', 1, 2, 3),
        saved('Project-A', 0, 'sourceB', 1, 2, 3),
        saved('Project-A', 0 + UnixTime(1, 'days'), 'sourceC', 1, 2, 3),
        saved('Project-B', 0 + UnixTime(1, 'days'), 'sourceA', 1, 2, 3),
      ])
    })

    it('returns latest value for projectId x data source combination for all projects', async () => {
      await repository.upsertMany([
        saved('Project-A', 0, 'sourceA', 1, 2, 3),
        saved('Project-A', 0, 'sourceB', 1, 2, 3),
        saved('Project-A', 0 + UnixTime(1, 'days'), 'sourceC', 1, 2, 3),
        saved('Project-A', 0, 'sourceC', 1, 2, 3), // Should be discarded

        saved('Project-B', 0 + UnixTime(1, 'days'), 'sourceA', 1, 2, 3),
        saved('Project-B', 0, 'sourceA', 1, 2, 3), // Should be discarded
        saved('Project-C', 0 + UnixTime(1, 'days'), 'sourceA', 1, 2, 3),
      ])

      const latestForProjects = await repository.getLatestValues()

      expect(latestForProjects.length).toEqual(5)
      expect(latestForProjects).toEqualUnsorted([
        saved('Project-A', 0, 'sourceA', 1, 2, 3),
        saved('Project-A', 0, 'sourceB', 1, 2, 3),
        saved('Project-A', 0 + UnixTime(1, 'days'), 'sourceC', 1, 2, 3),
        saved('Project-B', 0 + UnixTime(1, 'days'), 'sourceA', 1, 2, 3),
        saved('Project-C', 0 + UnixTime(1, 'days'), 'sourceA', 1, 2, 3),
      ])
    })
  })

  describe(ValueRepository.prototype.upsertMany.name, () => {
    it('adds new rows', async () => {
      await repository.upsertMany([
        saved('a', 0, 'data_src', 1, 2, 3),
        saved('b', 0, 'data_src', 2, 3, 4),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        saved('a', 0, 'data_src', 1, 2, 3),
        saved('b', 0, 'data_src', 2, 3, 4),
      ])
    })

    it('upserts rows', async () => {
      await repository.upsertMany([
        saved('a', 0, 'data_src', 1, 2, 3),
        saved('b', 0, 'data_src', 2, 3, 4),
      ])

      await repository.upsertMany([
        saved('a', 0, 'data_src', 11, 22, 33),
        saved('b', 0, 'data_src', 22, 33, 44),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        saved('a', 0, 'data_src', 11, 22, 33),
        saved('b', 0, 'data_src', 22, 33, 44),
      ])
    })

    it('empty array', async () => {
      await expect(repository.upsertMany([])).not.toBeRejected()
    })

    it('performs batch insert with many records', async () => {
      const records: ValueRecord[] = []
      for (let i = 5; i < 5_000; i++) {
        records.push(saved('a', UnixTime(i), 'data_src', i, i * 2, i + 1))
      }
      await expect(repository.upsertMany(records)).not.toBeRejected()
    })
  })

  describe(ValueRepository.prototype.getValuesByProjectIdsAndTimeRange
    .name, () => {
    const to = UnixTime.toStartOf(UnixTime.now(), 'hour')
    const from = to - UnixTime(7, 'days')
    it('returns empty array when no projectIds', async () => {
      const result = await repository.getValuesByProjectIdsAndTimeRange(
        [],
        [from, to],
      )
      expect(result).toEqual([])
    })

    it('returns values for single project within time range', async () => {
      const projectId = ProjectId('project1')
      await repository.insertMany([
        // within range
        saved(projectId, from, 'ds1', 100, 200, 300),
        saved(projectId, to, 'ds2', 150, 250, 350),
        // outside range
        saved(projectId, from - UnixTime(1, 'hours'), 'ds1', 150, 250, 350),
        saved(projectId, to + UnixTime(1, 'hours'), 'ds2', 150, 250, 350),
      ])

      const result = await repository.getValuesByProjectIdsAndTimeRange(
        [projectId],
        [from, to],
      )

      // Assert
      expect(result).toEqualUnsorted([
        saved(projectId, from, 'ds1', 100, 200, 300),
        saved(projectId, to, 'ds2', 150, 250, 350),
      ])
    })

    it('filters multiple projects correctly', async () => {
      const targetProject = ProjectId('target-project')
      const otherProject = ProjectId('other-project')

      const targetRecords = [
        saved(targetProject, from + UnixTime(1, 'hours'), 'ds1', 100, 200, 300),
        saved(targetProject, to - UnixTime(1, 'hours'), 'ds2', 150, 250, 350),
      ]
      const otherRecords = [
        saved(otherProject, from + UnixTime(1, 'hours'), 'ds1', 200, 300, 400),
      ]

      await repository.insertMany([...targetRecords, ...otherRecords])

      const result = await repository.getValuesByProjectIdsAndTimeRange(
        [targetProject],
        [from, to],
      )

      expect(result).toEqualUnsorted(targetRecords)
    })

    it('respects time range boundaries', async () => {
      const projectId = ProjectId('boundary-test')
      const edgeCases = [
        saved(projectId, from, 'ds1', 100, 200, 300),
        saved(projectId, to, 'ds2', 200, 300, 400),
      ]
      const outsideCases = [
        saved(projectId, from - UnixTime(1, 'seconds'), 'ds1', 50, 150, 250),
        saved(projectId, to + UnixTime(1, 'seconds'), 'ds1', 250, 350, 450),
      ]

      await repository.insertMany([...edgeCases, ...outsideCases])

      const result = await repository.getValuesByProjectIdsAndTimeRange(
        [projectId],
        [from, to],
      )

      expect(result).toEqual(edgeCases)
    })

    it('returns empty array when no matching records', async () => {
      const projectId = ProjectId('no-data-project')
      await repository.insertMany([
        saved(projectId, to + UnixTime(1, 'hours'), 'ds1', 100, 200, 300),
      ])

      const result = await repository.getValuesByProjectIdsAndTimeRange(
        [projectId],
        [from, to],
      )

      expect(result).toEqual([])
    })
  })

  it(ValueRepository.prototype.deleteAll.name, async () => {
    await repository.upsertMany([saved('a', 0, 'data_src', 1, 2, 3)])

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
