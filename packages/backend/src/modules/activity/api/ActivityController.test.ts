import {
  ActivityApiChartPoint,
  ActivityApiResponse,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { range } from 'lodash'

import { Clock } from '../../../tools/Clock'
import {
  ActivityViewRepository,
  DailyTransactionCountRecord,
} from '../repositories/ActivityViewRepository'
import { SequenceProcessor } from '../SequenceProcessor'
import { ActivityController } from './ActivityController'

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')
const NOW = UnixTime.now()
const TODAY = NOW.toStartOf('day')

describe(ActivityController.name, () => {
  describe(ActivityController.prototype.getActivity.name, () => {
    it('throws if ethereum not present in db', async () => {
      const includedIds: ProjectId[] = [PROJECT_A, ProjectId.ETHEREUM]
      const processors: SequenceProcessor[] = [
        mockProcessor({
          projectId: PROJECT_A,
          hasProcessedAll: true,
        }),
        mockProcessor({
          projectId: PROJECT_B,
          hasProcessedAll: true,
        }),
      ]
      const controller = new ActivityController(
        includedIds,
        processors,
        mockRepository([]),
        mockObject<Clock>({ getLastHour: () => NOW }),
      )

      await expect(controller.getActivity()).toBeRejectedWith(
        'Assertion Error: Ethereum missing in daily transaction count',
      )
    })

    it('returns only included projects', async () => {
      const includedIds: ProjectId[] = [ProjectId.ETHEREUM, PROJECT_A]
      const processors: SequenceProcessor[] = [
        mockProcessor({
          projectId: PROJECT_A,
          hasProcessedAll: true,
        }),
        mockProcessor({
          projectId: PROJECT_B,
          hasProcessedAll: true,
        }),
        mockProcessor({
          projectId: ProjectId.ETHEREUM,
          hasProcessedAll: false,
        }),
      ]

      const controller = new ActivityController(
        includedIds,
        processors,
        mockRepository([
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: TODAY.add(-2, 'days'),
            count: 2137,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: TODAY.add(-1, 'days'),
            count: 420,
          },
          { projectId: ProjectId.ETHEREUM, timestamp: TODAY, count: 100 },
          {
            projectId: PROJECT_A,
            timestamp: TODAY.add(-2, 'days'),
            count: 2,
          },
          {
            projectId: PROJECT_A,
            timestamp: TODAY.add(-1, 'days'),
            count: 1,
          },
          {
            projectId: PROJECT_A,
            timestamp: TODAY,
            count: 2,
          },
          {
            projectId: PROJECT_B,
            timestamp: TODAY.add(-2, 'days'),
            count: 2,
          },
          {
            projectId: PROJECT_B,
            timestamp: TODAY.add(-1, 'days'),
            count: 1,
          },
          {
            projectId: PROJECT_B,
            timestamp: TODAY,
            count: 2,
          },
        ]),
        mockObject<Clock>({ getLastHour: () => NOW }),
      )

      expect(await controller.getActivity()).toEqual(
        formatActivity({
          combined: {
            data: [
              [TODAY.add(-2, 'days'), 2, 2137],
              [TODAY.add(-1, 'days'), 1, 420],
            ],
            estimatedImpact: 0,
            estimatedSince: TODAY,
          },
          projects: {
            'project-a': [
              [TODAY.add(-2, 'days'), 2, 2137],
              [TODAY.add(-1, 'days'), 1, 420],
            ],
          },
        }),
      )
    })

    it('groups data', async () => {
      const includedIds: ProjectId[] = [
        PROJECT_A,
        PROJECT_B,
        ProjectId.ETHEREUM,
      ]
      const processors: SequenceProcessor[] = [
        mockProcessor({
          projectId: PROJECT_A,
          hasProcessedAll: true,
        }),
        mockProcessor({
          projectId: PROJECT_B,
          hasProcessedAll: true,
        }),
        mockProcessor({
          projectId: ProjectId.ETHEREUM,
          hasProcessedAll: false,
        }),
      ]

      const controller = new ActivityController(
        includedIds,
        processors,
        mockRepository([
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: TODAY.add(-2, 'days'),
            count: 2137,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: TODAY.add(-1, 'days'),
            count: 420,
          },
          { projectId: ProjectId.ETHEREUM, timestamp: TODAY, count: 100 },
          {
            projectId: PROJECT_A,
            timestamp: TODAY.add(-2, 'days'),
            count: 2,
          },
          {
            projectId: PROJECT_A,
            timestamp: TODAY.add(-1, 'days'),
            count: 1,
          },
          {
            projectId: PROJECT_B,
            timestamp: TODAY.add(-2, 'days'),
            count: 1337,
          },
          {
            projectId: PROJECT_B,
            timestamp: TODAY.add(-1, 'days'),
            count: 69,
          },
        ]),
        mockObject<Clock>({ getLastHour: () => NOW }),
      )

      expect(await controller.getActivity()).toEqual(
        formatActivity({
          combined: {
            data: [
              [TODAY.add(-2, 'days'), 1339, 2137],
              [TODAY.add(-1, 'days'), 70, 420],
            ],
            estimatedImpact: 0,
            estimatedSince: TODAY,
          },
          projects: {
            [PROJECT_A.toString()]: [
              [TODAY.add(-2, 'days'), 2, 2137],
              [TODAY.add(-1, 'days'), 1, 420],
            ],
            [PROJECT_B.toString()]: [
              [TODAY.add(-2, 'days'), 1337, 2137],
              [TODAY.add(-1, 'days'), 69, 420],
            ],
          },
        }),
      )
    })

    it('excludes data for projects that have not synced once', async () => {
      const includedIds: ProjectId[] = [
        PROJECT_A,
        PROJECT_B,
        ProjectId.ETHEREUM,
      ]
      const processors: SequenceProcessor[] = [
        mockProcessor({
          projectId: PROJECT_A,
          hasProcessedAll: true,
        }),
        mockProcessor({
          projectId: PROJECT_B,
          hasProcessedAll: false,
          syncedOnce: false,
        }),
        mockProcessor({
          projectId: ProjectId.ETHEREUM,
          hasProcessedAll: true,
        }),
      ]

      const controller = new ActivityController(
        includedIds,
        processors,
        mockRepository([
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: TODAY.add(-2, 'days'),
            count: 2137,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: TODAY.add(-1, 'days'),
            count: 420,
          },
          { projectId: ProjectId.ETHEREUM, timestamp: TODAY, count: 100 },
          {
            projectId: PROJECT_A,
            timestamp: TODAY.add(-2, 'days'),
            count: 2,
          },
          {
            projectId: PROJECT_A,
            timestamp: TODAY.add(-1, 'days'),
            count: 1,
          },
          {
            projectId: PROJECT_B,
            timestamp: TODAY.add(-2, 'days'),
            count: 1337,
          },
        ]),
        mockObject<Clock>({ getLastHour: () => NOW }),
      )

      expect(await controller.getActivity()).toEqual(
        formatActivity({
          combined: {
            data: [
              [TODAY.add(-2, 'days'), 2, 2137],
              [TODAY.add(-1, 'days'), 1, 420],
            ],
            estimatedImpact: 0,
            estimatedSince: TODAY,
          },
          projects: {
            [PROJECT_A.toString()]: [
              [TODAY.add(-2, 'days'), 2, 2137],
              [TODAY.add(-1, 'days'), 1, 420],
            ],
          },
        }),
      )
    })

    it('makes correct estimations for combined', async () => {
      const fullySyncedProjectsCount = 3

      const fullySyncedProjectIds = range(fullySyncedProjectsCount).map((i) =>
        ProjectId(`synced-${i.toString()}`),
      )
      const notSyncedProjectIds = range(fullySyncedProjectsCount).map((i) =>
        ProjectId(`not-synced-${i.toString()}`),
      )

      const includedIds: ProjectId[] = [
        ...fullySyncedProjectIds,
        ...notSyncedProjectIds,
        ProjectId.ETHEREUM,
      ]
      const processors: SequenceProcessor[] = [
        mockProcessor({
          projectId: ProjectId.ETHEREUM,
          hasProcessedAll: true,
        }),
        ...fullySyncedProjectIds.map((projectId) =>
          mockProcessor({
            projectId,
            hasProcessedAll: true,
          }),
        ),
        ...notSyncedProjectIds.map((projectId) =>
          mockProcessor({
            projectId,
            hasProcessedAll: false,
          }),
        ),
      ]

      const txPerDay = {
        eth: 100,
        synced: 4,
        notSynced: 1,
      } as const

      const data = [
        ...range(0, 5)
          .map((i) => [
            {
              projectId: ProjectId.ETHEREUM,
              timestamp: TODAY.add(-i, 'days'),
              count: txPerDay.eth,
            },
            ...fullySyncedProjectIds.map((projectId) => ({
              projectId,
              timestamp: TODAY.add(-i, 'days'),
              count: txPerDay.synced,
            })),
          ])
          .flat(),
        ...range(3, 5)
          .map((i) =>
            notSyncedProjectIds.map((projectId) => ({
              projectId,
              timestamp: TODAY.add(-i, 'days'),
              count: txPerDay.notSynced,
            })),
          )
          .flat(),
      ].sort((a, b) => a.timestamp.toNumber() - b.timestamp.toNumber())

      const controller = new ActivityController(
        includedIds,
        processors,
        mockRepository(data),
        mockObject<Clock>({ getLastHour: () => NOW }),
      )

      expect(await controller.getActivity()).toEqual(
        formatActivity({
          combined: {
            data: [
              [TODAY.add(-4, 'days'), 15, txPerDay.eth],
              [TODAY.add(-3, 'days'), 15, txPerDay.eth],
              [TODAY.add(-2, 'days'), 15, txPerDay.eth],
              [TODAY.add(-1, 'days'), 15, txPerDay.eth],
            ],
            estimatedImpact: 0.2,
            estimatedSince: TODAY.add(-3, 'days'),
          },
          projects: {
            'synced-0': [
              [TODAY.add(-4, 'days'), 4, txPerDay.eth],
              [TODAY.add(-3, 'days'), 4, txPerDay.eth],
              [TODAY.add(-2, 'days'), 4, txPerDay.eth],
              [TODAY.add(-1, 'days'), 4, txPerDay.eth],
            ],
            'synced-1': [
              [TODAY.add(-4, 'days'), 4, txPerDay.eth],
              [TODAY.add(-3, 'days'), 4, txPerDay.eth],
              [TODAY.add(-2, 'days'), 4, txPerDay.eth],
              [TODAY.add(-1, 'days'), 4, txPerDay.eth],
            ],
            'synced-2': [
              [TODAY.add(-4, 'days'), 4, txPerDay.eth],
              [TODAY.add(-3, 'days'), 4, txPerDay.eth],
              [TODAY.add(-2, 'days'), 4, txPerDay.eth],
              [TODAY.add(-1, 'days'), 4, txPerDay.eth],
            ],
            'not-synced-0': [[TODAY.add(-4, 'days'), 1, txPerDay.eth]],
            'not-synced-1': [[TODAY.add(-4, 'days'), 1, txPerDay.eth]],
            'not-synced-2': [[TODAY.add(-4, 'days'), 1, txPerDay.eth]],
          },
        }),
      )
    })
  })
})

function formatActivity({
  combined,
  projects,
}: {
  combined: {
    data: ActivityApiChartPoint[]
    estimatedSince: UnixTime
    estimatedImpact: number
  }
  projects: Record<string, ActivityApiChartPoint[]>
}): ActivityApiResponse {
  return {
    combined: {
      daily: {
        types: ['timestamp', 'transactions', 'ethereumTransactions'],
        data: combined.data,
      },
      estimatedImpact: combined.estimatedImpact,
      estimatedSince: combined.estimatedSince,
    },
    projects: Object.entries(projects).reduce((acc, cur) => {
      return {
        ...acc,
        [cur[0]]: {
          daily: {
            types: ['timestamp', 'transactions', 'ethereumTransactions'],
            data: cur[1],
          },
        },
      }
    }, {}),
  }
}

function mockProcessor({
  hasProcessedAll,
  projectId,
  syncedOnce,
}: {
  hasProcessedAll: boolean
  projectId: ProjectId
  syncedOnce?: boolean
}) {
  return mockObject<SequenceProcessor>({
    hasProcessedAll: () => hasProcessedAll,
    getStatus: () => ({
      latest: 5,
      lastProcessed: hasProcessedAll ? 5 : 4,
      syncedOnce: syncedOnce ?? true,
      isProcessing: false,
    }),
    projectId,
  })
}

function mockRepository(counts: DailyTransactionCountRecord[]) {
  return mockObject<ActivityViewRepository>({
    getDailyCounts: async () => counts,
  })
}
