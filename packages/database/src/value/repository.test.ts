import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { Value } from './entity'
import { ValueRepository } from './repository'

describeDatabase(ValueRepository.name, (database) => {
  const repository = database.value

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(
    ValueRepository.prototype.getLatestValuesForProjects.name,
    async () => {
      it('returns latest value for projectId x data source combination', async () => {
        await repository.addOrUpdateMany([
          saved('Project-A', UnixTime.ZERO, 'sourceA', 1, 2, 3),
          saved('Project-A', UnixTime.ZERO, 'sourceB', 1, 2, 3),
          saved('Project-A', UnixTime.ZERO.add(1, 'days'), 'sourceC', 1, 2, 3),
          saved('Project-A', UnixTime.ZERO, 'sourceC', 1, 2, 3), // Should be discarded

          saved('Project-B', UnixTime.ZERO.add(1, 'days'), 'sourceA', 1, 2, 3),
          saved('Project-B', UnixTime.ZERO, 'sourceA', 1, 2, 3), // Should be discarded
        ])

        const latestForProjects = await repository.getLatestValuesForProjects([
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
    },
  )
})

function saved(
  id: string,
  timestamp: UnixTime,
  dataSource: string,
  canonical: number,
  external: number,
  native: number,
): Value {
  return {
    projectId: ProjectId(id),
    timestamp,
    dataSource,
    canonical: BigInt(canonical),
    canonicalForTotal: BigInt(canonical),
    external: BigInt(external),
    externalForTotal: BigInt(external),
    native: BigInt(native),
    nativeForTotal: BigInt(native),
  }
}
