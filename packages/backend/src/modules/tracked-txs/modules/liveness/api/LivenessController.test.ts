import { assert, ProjectId, UnixTime, notUndefined } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'

import { TrackedTxConfigEntry, createTrackedTxId } from '@l2beat/shared'
import { Project } from '../../../../../model/Project'
import { Clock } from '../../../../../tools/Clock'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import {
  LivenessRecordWithProjectIdAndSubtype,
  LivenessRepository,
} from '../repositories/LivenessRepository'
import { LivenessController } from './LivenessController'
import {
  calculateDetailsFor,
  calculateIntervals,
} from './calculateIntervalWithAverages'

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
            }) as const,
        ),
      )
      RECORDS.push({
        projectId: ProjectId('project1'),
        timestamp: START.add(-500 - 1000, 'hours'),
        subtype: 'batchSubmissions',
      })

      const projects = mockProjectConfig(RECORDS)
      const livenessController = new LivenessController({
        clock: CLOCK,
        indexerService: mockObject<IndexerService>({
          getIndexerState: mockFn().resolvesTo({
            id: 1,
            indexerId: 'tracked_txs_indexer',
            safeHeight: CLOCK.getLastHour(),
          }),
          getSavedConfigurations: mockFn().resolvesTo(
            projects.flatMap((p) =>
              p.trackedTxsConfig?.map((t) => ({
                id: t.id,
                currentHeight: UnixTime.now().toNumber(),
                maxHeight: null,
              })),
            ),
          ),
        }),
        livenessRepository: getMockLivenessRepository(RECORDS),
        projects,
      })

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
            }) as const,
        ),
      )
      const projects = mockProjectConfig(RECORDS)
      const livenessController = new LivenessController({
        clock: CLOCK,
        indexerService: mockObject<IndexerService>({
          getIndexerState: mockFn().resolvesTo({
            id: 1,
            indexerId: 'tracked_txs_indexer',
            safeHeight: CLOCK.getLastHour(),
          }),
          getSavedConfigurations: mockFn().resolvesTo(
            projects.flatMap((p) =>
              p.trackedTxsConfig?.map((t) => ({
                id: t.id,
                currentHeight: UnixTime.now().toNumber(),
                maxHeight: null,
              })),
            ),
          ),
        }),
        livenessRepository: getMockLivenessRepository(RECORDS),
        projects: projects,
      })

      const result = await livenessController.getLiveness()
      if (result.type === 'success') {
        const project1Anomalies = result.data.projects.project1?.anomalies
        expect(project1Anomalies).toEqual([])
      }
    })

    it('returns empty object if no data', async () => {
      const livenessController = new LivenessController({
        clock: CLOCK,
        indexerService: mockObject<IndexerService>({
          getIndexerState: mockFn().resolvesTo({
            id: 1,
            indexerId: 'tracked_txs_indexer',
            safeHeight: CLOCK.getLastHour(),
          }),
          getSavedConfigurations: mockFn().resolvesTo([]),
        }),
        projects: [],
        livenessRepository: getMockLivenessRepository([]),
      })

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

      const projects = mockProjectConfig(RECORDS)

      const livenessController = new LivenessController({
        clock: getMockClock(),
        indexerService: mockObject<IndexerService>({
          getIndexerState: mockFn().resolvesTo({
            id: 1,
            indexerId: 'tracked_txs_indexer',
            safeHeight: CLOCK.getLastHour(),
          }),
          getSavedConfigurations: mockFn().resolvesTo(
            projects
              .flatMap((p) =>
                p.trackedTxsConfig?.map((t) => {
                  if (t.projectId === ProjectId('project1')) {
                    return {
                      id: t.id,
                      currentHeight: syncedUntil.toNumber(),
                      maxHeight: null,
                    }
                  }
                }),
              )
              .filter(notUndefined),
          ),
        }),
        livenessRepository: getMockLivenessRepository(RECORDS),
        projects,
      })

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
        syncedUntil,
      }

      const result = await livenessController.getLiveness()
      if (result.type === 'success') {
        const project1 = result.data.projects.project1
        expect(project1?.batchSubmissions).toEqual(expected)
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
        trackedTxsConfig: [
          mockObject<TrackedTxConfigEntry>({
            type: 'liveness',
            subtype: 'batchSubmissions',
            id: createTrackedTxId.random(),
            untilTimestamp: UnixTime.now(),
            projectId,
          }),
        ],

        livenessConfig: undefined,
      }),
    )
}
