import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { ActivityHeadBlockRepository } from './ActivityHeadBlockRepository'

describeDatabase(ActivityHeadBlockRepository.name, (db) => {
  const repository = db.activityHeadBlock
  const START = UnixTime.toStartOf(UnixTime.now(), 'hour')

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(ActivityHeadBlockRepository.prototype.replaceForProject.name, () => {
    it("replaces the project's blocks and keeps other projects'", async () => {
      await repository.replaceForProject(ProjectId('a'), [block(1), block(2)])
      await repository.replaceForProject(ProjectId('b'), [block(7)])

      await repository.replaceForProject(ProjectId('a'), [block(3)])

      expect(await repository.getByProject(ProjectId('a'))).toEqual([
        { projectId: ProjectId('a'), ...block(3) },
      ])
      expect(await repository.getByProject(ProjectId('b'))).toEqual([
        { projectId: ProjectId('b'), ...block(7) },
      ])
    })

    it("clears the project's blocks when given none", async () => {
      await repository.replaceForProject(ProjectId('a'), [block(1)])

      await repository.replaceForProject(ProjectId('a'), [])

      expect(await repository.getByProject(ProjectId('a'))).toEqual([])
    })
  })

  function block(number: number) {
    return {
      number,
      timestamp: START + number * 12,
      count: number * 10,
      uopsCount: number * 11,
    }
  }
})
