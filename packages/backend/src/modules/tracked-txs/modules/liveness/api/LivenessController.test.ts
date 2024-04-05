import { assert, Hash256, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'

import { Project } from '../../../../../model/Project'
import { IndexerStateRepository } from '../../../../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../../../../tools/Clock'
import {
  TrackedTxsConfigRecord,
  TrackedTxsConfigsRepository,
} from '../../../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../../../types/TrackedTxId'
import { TrackedTxConfigEntry } from '../../../types/TrackedTxsConfig'
import {
  LivenessRecordWithProjectIdAndSubtype,
  LivenessRepository,
} from '../repositories/LivenessRepository'
import {
  calculateDetailsFor,
  calculateIntervals,
} from './calculateIntervalWithAverages'
import { LivenessController } from './LivenessController'

describe(LivenessController.name, () => {
  describe(LivenessController.prototype.getLiveness.name, () => {
    const CLOCK = getMockClock()

    // TODO: unskip it
    it.skip('correctly finds anomalies', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndSubtype[] = []

      RECORDS.push(
        ...range(500).map(
          (_, i) =>
            ({
              projectId: ProjectId('project1'),
              timestamp: START.add(-i, 'hours'),
              subtype: 'batchSubmissions',
            } as const),
        ),
      )
      RECORDS.push({
        projectId: ProjectId('project1'),
        timestamp: START.add(-1000, 'hours'),
        subtype: 'batchSubmissions',
      })

      const livenessController = new LivenessController(
        getMockLivenessRepository(RECORDS),
        mockObject<TrackedTxsConfigsRepository>({
          getByProjectIdAndType: mockFn().resolvesTo([
            mockObject<TrackedTxsConfigRecord>({
              untilTimestampExclusive: undefined,
              lastSyncedTimestamp: undefined,
            }),
          ]),
        }),
        getMockIndexerStateRepository(CLOCK.getLastHour()),
        mockProjectConfig(RECORDS),
        CLOCK,
      )

      const result = await livenessController.getLiveness()
      if (result.type === 'success') {
        const project1Anomalies = result.data.projects.project1?.anomalies

        expect(project1Anomalies).toEqual([
          {
            timestamp: RECORDS.at(-2)!.timestamp,
            durationInSeconds: 501 * 3600,
            type: 'batchSubmissions',
          },
        ])
      }
    })

    it('returns empty array if no anomalies', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndSubtype[] = []

      RECORDS.push(
        ...range(10).map(
          (_, i) =>
            ({
              projectId: ProjectId('project1'),
              timestamp: START.add(-i, 'hours'),
              subtype: 'batchSubmissions',
            } as const),
        ),
      )
      const livenessController = new LivenessController(
        getMockLivenessRepository(RECORDS),
        mockObject<TrackedTxsConfigsRepository>({
          getByProjectIdAndType: mockFn().resolvesTo([
            mockObject<TrackedTxsConfigRecord>({
              untilTimestampExclusive: undefined,
              lastSyncedTimestamp: UnixTime.now(),
            }),
          ]),
        }),
        getMockIndexerStateRepository(CLOCK.getLastHour()),
        mockProjectConfig(RECORDS),
        CLOCK,
      )

      const result = await livenessController.getLiveness()
      if (result.type === 'success') {
        const project1Anomalies = result.data.projects.project1?.anomalies
        expect(project1Anomalies).toEqual([])
      }
    })

    it('returns empty object if no data', async () => {
      const livenessController = new LivenessController(
        getMockLivenessRepository([]),
        mockObject<TrackedTxsConfigsRepository>(),
        getMockIndexerStateRepository(CLOCK.getLastHour()),
        [],
        CLOCK,
      )

      const result = await livenessController.getLiveness()
      if (result.type === 'success') {
        expect(result.data).toEqual({ projects: {} })
      }
    })

    it('correctly calculate avg, min and max', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndSubtype[] = []

      RECORDS.push(
        ...range(30 + 60 / 2 + 30 / 3).map((_, i) => {
          let daysToAdd = 0
          if (i < 30) {
            daysToAdd = i
          } else if (i < 30 + 60 / 2) {
            daysToAdd = 30 + (i - 30) * 2
          } else {
            daysToAdd = 30 + 60 + (i - (30 + 60 / 2)) * 3
          }

          return {
            projectId: ProjectId('project1'),
            timestamp: START.add(-daysToAdd, 'days'),
            subtype: 'batchSubmissions' as const,
          }
        }),
      )
      RECORDS.push(
        ...range(30 + 60 / 2 + 30 / 3).map((_, i) => {
          let daysToAdd = 0
          if (i < 30) {
            daysToAdd = i
          } else if (i < 30 + 60 / 2) {
            daysToAdd = 30 + (i - 30) * 2
          } else {
            daysToAdd = 30 + 60 + (i - (30 + 60 / 2)) * 3
          }

          return {
            projectId: ProjectId('project2'),
            timestamp: START.add(-daysToAdd, 'days'),
            subtype: 'batchSubmissions' as const,
          }
        }),
      )
      const syncedUntil = UnixTime.now()

      const livenessController = new LivenessController(
        getMockLivenessRepository(RECORDS),
        mockObject<TrackedTxsConfigsRepository>({
          getByProjectIdAndType: mockFn()
            .given(ProjectId('project1'), 'liveness')
            .resolvesToOnce([
              mockObject<TrackedTxsConfigRecord>({
                untilTimestampExclusive: undefined,
                lastSyncedTimestamp: syncedUntil,
              }),
            ])
            .resolvesTo([]),
        }),
        getMockIndexerStateRepository(CLOCK.getLastHour()),
        mockProjectConfig(RECORDS),
        getMockClock(),
      )

      const project1Records = RECORDS.filter(
        (r) => r.projectId === ProjectId('project1'),
      )
      calculateIntervals(project1Records)

      const last30Days = calculateDetailsFor(project1Records, '30d')
      const last90Days = calculateDetailsFor(project1Records, '90d')
      const allTime = calculateDetailsFor(project1Records, 'allTime')

      assert(last30Days, 'last30Days is undefined')
      assert(last90Days, 'last90Days is undefined')
      assert(allTime, 'allTime is undefined')

      const expected = {
        last30Days,
        last90Days,
        allTime,
      }

      const result = await livenessController.getLiveness()
      if (result.type === 'success') {
        const project1 = result.data.projects.project1
        expect(project1?.batchSubmissions).toEqual(expected)
        expect(project1?.syncedUntil).toEqual(syncedUntil)
        expect(result.data.projects.project2).toEqual(undefined)
      }
    })
  })
})

const START = UnixTime.now()

function getMockClock() {
  return mockObject<Clock>({
    getLastHour: () => UnixTime.now().toStartOf('hour').add(-1, 'hours'),
  })
}

function getMockIndexerStateRepository(data: UnixTime) {
  return mockObject<IndexerStateRepository>({
    findIndexerState: async () => {
      return {
        id: 1,
        configHash: Hash256.random(),
        indexerId: 'liveness_indexer',
        safeHeight: data.toNumber(),
      }
    },
  })
}

function getMockLivenessRepository(
  records: LivenessRecordWithProjectIdAndSubtype[],
) {
  return mockObject<LivenessRepository>({
    getWithSubtypeDistinctTimestamp(projectId: ProjectId) {
      return Promise.resolve(records.filter((x) => x.projectId === projectId))
    },
    addMany() {
      return Promise.resolve(1)
    },
    deleteAll() {
      return Promise.resolve(1)
    },
  })
}

function mockProjectConfig(
  records: LivenessRecordWithProjectIdAndSubtype[],
): Project[] {
  return records
    .map((x) => x.projectId)
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((projectId) =>
      mockObject<Project>({
        projectId,
        isArchived: false,
        trackedTxsConfig: {
          entries: [
            mockObject<TrackedTxConfigEntry>({
              uses: [
                {
                  type: 'liveness',
                  subtype: 'batchSubmissions',
                  id: TrackedTxId.random(),
                },
              ],
              untilTimestampExclusive: UnixTime.now(),
            }),
          ],
        },
        livenessConfig: undefined,
      }),
    )
}
