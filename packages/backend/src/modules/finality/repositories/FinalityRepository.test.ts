import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { FinalityRecord, FinalityRepository } from './FinalityRepository'

describeDatabase(FinalityRepository.name, (knex, kysely) => {
  const oldRepo = new FinalityRepository(knex, Logger.INFO)
  const newRepo = kysely.finality

  suite(oldRepo)
  suite(newRepo)

  function suite(repository: typeof oldRepo | typeof newRepo) {
    const START = UnixTime.now().add(-1, 'days').toStartOf('day')
    const BASE = START.add(-30, 'days')

    const DATA: FinalityRecord[] = [
      {
        projectId: ProjectId('project-a'),
        timestamp: BASE,
        minimumTimeToInclusion: 1,
        maximumTimeToInclusion: 3,
        averageTimeToInclusion: 2,
        averageStateUpdate: 2,
      },
      {
        projectId: ProjectId('project-a'),
        timestamp: BASE.add(1, 'days'),
        minimumTimeToInclusion: 2,
        maximumTimeToInclusion: 4,
        averageTimeToInclusion: 3,
        averageStateUpdate: 3,
      },
      {
        projectId: ProjectId('project-a'),
        timestamp: BASE.add(2, 'days'),
        minimumTimeToInclusion: 4,
        maximumTimeToInclusion: 8,
        averageTimeToInclusion: 6,
        averageStateUpdate: null,
      },
    ]

    beforeEach(async function () {
      this.timeout(10000)
      await repository.deleteAll()
      await repository.addMany(DATA)
    })

    describe(FinalityRepository.prototype.add.name, () => {
      it('adds new row', async () => {
        const newRecord = {
          projectId: ProjectId('project-c'),
          timestamp: UnixTime.fromDate(new Date('2021-01-01T03:00:00Z')),
          minimumTimeToInclusion: 1,
          averageTimeToInclusion: 2,
          maximumTimeToInclusion: 3,
          averageStateUpdate: null,
        }

        await repository.add(newRecord)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([...DATA, newRecord])
      })
    })

    describe(FinalityRepository.prototype.addMany.name, () => {
      it('adds new rows', async () => {
        const newRows = [
          {
            projectId: ProjectId('project-c'),
            timestamp: BASE.add(3, 'days'),
            minimumTimeToInclusion: 1,
            maximumTimeToInclusion: 3,
            averageTimeToInclusion: 2,
            averageStateUpdate: 2,
          },
          {
            projectId: ProjectId('project-c'),
            timestamp: BASE.add(4, 'days'),
            minimumTimeToInclusion: 2,
            maximumTimeToInclusion: 4,
            averageTimeToInclusion: 3,
            averageStateUpdate: 3,
          },
        ]
        await repository.addMany(newRows)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([...DATA, ...newRows])
      })

      it('empty array', async () => {
        await expect(repository.addMany([])).not.toBeRejected()
      })

      it('big query', async () => {
        const FROM = UnixTime.fromDate(new Date('2021-01-01T03:00:00Z'))
        await repository.deleteAll()
        const records: FinalityRecord[] = []
        for (let i = 0; i < 5_000; i++) {
          records.push({
            timestamp: FROM.add(-i, 'hours'),
            projectId: ProjectId('project-a'),
            averageTimeToInclusion: i,
            maximumTimeToInclusion: i + 1,
            minimumTimeToInclusion: i - 1,
            averageStateUpdate: i,
          })
        }
        await repository.addMany(records)
      })
    })

    describe(FinalityRepository.prototype.getAll.name, () => {
      it('should return all rows', async () => {
        const results = await repository.getAll()

        expect(results).toEqualUnsorted(DATA)
      })
    })

    describe(
      FinalityRepository.prototype.findProjectFinalityOnTimestamp.name,
      () => {
        it('finds a record', async () => {
          const target = BASE.add(1, 'days')
          const result = await repository.findProjectFinalityOnTimestamp(
            ProjectId('project-a'),
            target,
          )

          expect(result).toEqual({
            minimumTimeToInclusion: 2,
            maximumTimeToInclusion: 4,
            averageTimeToInclusion: 3,
          })
        })

        it('returns undefined if not found', async () => {
          const target = BASE.add(300, 'days')

          const result = await repository.findProjectFinalityOnTimestamp(
            ProjectId('project-a'),
            target,
          )
          expect(result).toEqual(undefined)
        })
      },
    )

    describe(
      FinalityRepository.prototype.getLatestGroupedByProjectId.name,
      () => {
        it('returns empty array if no records', async () => {
          await repository.deleteAll()

          const result = await repository.getLatestGroupedByProjectId([
            ProjectId('project-a'),
          ])

          expect(result).toEqual([])
        })

        it('returns latest rows grouped by projectId', async () => {
          const latestProjectAFinality = {
            projectId: ProjectId('project-a'),
            timestamp: BASE.add(7, 'days'),
            minimumTimeToInclusion: 4,
            maximumTimeToInclusion: 8,
            averageTimeToInclusion: 6,
            averageStateUpdate: 6,
          }

          const latestProjectBFinality = {
            projectId: ProjectId('project-b'),
            timestamp: BASE.add(7, 'days'),
            minimumTimeToInclusion: 1,
            maximumTimeToInclusion: 3,
            averageTimeToInclusion: 2,
            averageStateUpdate: 2,
          }

          const latestProjectCFinality = [
            {
              projectId: ProjectId('project-c'),
              timestamp: BASE.add(6, 'days'),
              minimumTimeToInclusion: 2,
              maximumTimeToInclusion: 4,
              averageTimeToInclusion: 3,
              averageStateUpdate: 3,
            },
            {
              projectId: ProjectId('project-c'),
              timestamp: BASE.add(7, 'days'),
              minimumTimeToInclusion: 4,
              maximumTimeToInclusion: 8,
              averageTimeToInclusion: 6,
              averageStateUpdate: 6,
            },
          ]

          const latestProjectDFinality = {
            projectId: ProjectId('project-d'),
            timestamp: BASE.add(7, 'days'),
            minimumTimeToInclusion: 4,
            maximumTimeToInclusion: 8,
            averageTimeToInclusion: 6,
            averageStateUpdate: 6,
          }

          const additionalRows = [
            latestProjectAFinality,
            latestProjectBFinality,
            ...latestProjectCFinality,
            latestProjectDFinality,
          ]

          await repository.addMany(additionalRows)

          const result = await repository.getLatestGroupedByProjectId([
            ProjectId('project-a'),
            ProjectId('project-b'),
            ProjectId('project-c'),
          ])

          expect(result).toEqualUnsorted([
            latestProjectAFinality,
            latestProjectBFinality,
            latestProjectCFinality[1],
          ])
        })
      },
    )

    describe(FinalityRepository.prototype.findLatestByProjectId.name, () => {
      it('finds a latest record by timestamp', async () => {
        const newRows = [
          {
            projectId: ProjectId('project-c'),
            timestamp: UnixTime.fromDate(new Date('2021-01-01T03:00:00Z')),
            minimumTimeToInclusion: 1,
            maximumTimeToInclusion: 3,
            averageTimeToInclusion: 2,
            averageStateUpdate: null,
          },
          {
            projectId: ProjectId('project-c'),
            timestamp: UnixTime.fromDate(new Date('2021-01-01T04:00:00Z')),
            minimumTimeToInclusion: 2,
            maximumTimeToInclusion: 4,
            averageTimeToInclusion: 3,
            averageStateUpdate: null,
          },
          {
            projectId: ProjectId('project-h'),
            timestamp: UnixTime.fromDate(new Date('2024-01-01T04:00:00Z')),
            minimumTimeToInclusion: 2,
            maximumTimeToInclusion: 4,
            averageTimeToInclusion: 3,
            averageStateUpdate: null,
          },
        ]
        await repository.addMany(newRows)

        const result = await repository.findLatestByProjectId(
          ProjectId('project-c'),
        )

        expect(result).toEqual(newRows[1])
      })
    })

    describe(FinalityRepository.prototype.deleteAll.name, () => {
      it('should delete all rows', async () => {
        await repository.deleteAll()

        const results = await repository.getAll()

        expect(results).toEqual([])
      })
    })
  }
})
