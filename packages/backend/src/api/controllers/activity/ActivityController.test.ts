import {
  ActivityApiChartPoint,
  ActivityApiResponse,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { TransactionCounter } from '../../../core/activity/TransactionCounter'
import { Clock } from '../../../core/Clock'
import {
  DailyTransactionCountRecord,
  DailyTransactionCountViewRepository,
} from '../../../peripherals/database/activity/DailyTransactionCountViewRepository'
import { ActivityController } from './ActivityController'

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')
const NOW = UnixTime.now()
const TODAY = NOW.toStartOf('day')

describe(ActivityController.name, () => {
  describe(ActivityController.prototype.getActivity.name, () => {
    it('throws if ethereum not present in db', async () => {
      const includedIds: ProjectId[] = [PROJECT_A, ProjectId.ETHEREUM]
      const counters: TransactionCounter[] = [
        mockCounter({
          projectId: PROJECT_A,
          hasProcessedAll: true,
        }),
        mockCounter({
          projectId: PROJECT_B,
          hasProcessedAll: true,
        }),
      ]
      const controller = new ActivityController(
        includedIds,
        counters,
        mockRepository([]),
        mockObject<Clock>({ getLastHour: () => NOW }),
      )

      await expect(controller.getActivity()).toBeRejectedWith(
        'Assertion Error: Ethereum missing in daily transaction count',
      )
    })

    it('returns only included projects', async () => {
      const includedIds: ProjectId[] = [ProjectId.ETHEREUM]
      const counters: TransactionCounter[] = [
        mockCounter({
          projectId: PROJECT_A,
          hasProcessedAll: true,
        }),
        mockCounter({
          projectId: PROJECT_B,
          hasProcessedAll: true,
        }),
        mockCounter({
          projectId: ProjectId.ETHEREUM,
          hasProcessedAll: false,
        }),
      ]

      const controller = new ActivityController(
        includedIds,
        counters,
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
            timestamp: TODAY.add(-3, 'days'),
            count: 2,
          },
        ]),
        mockObject<Clock>({ getLastHour: () => NOW }),
      )

      expect(await controller.getActivity()).toEqual(
        formatActivity({
          combined: [],
          projects: {},
          ethereum: [
            [TODAY.add(-2, 'days'), 2137],
            [TODAY.add(-1, 'days'), 420],
          ],
        }),
      )
    })

    it('groups data', async () => {
      const includedIds: ProjectId[] = [
        PROJECT_A,
        PROJECT_B,
        ProjectId.ETHEREUM,
      ]
      const counters: TransactionCounter[] = [
        mockCounter({
          projectId: PROJECT_A,
          hasProcessedAll: true,
        }),
        mockCounter({
          projectId: PROJECT_B,
          hasProcessedAll: true,
        }),
        mockCounter({
          projectId: ProjectId.ETHEREUM,
          hasProcessedAll: false,
        }),
      ]

      const controller = new ActivityController(
        includedIds,
        counters,
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
          combined: [
            [TODAY.add(-2, 'days'), 1339],
            [TODAY.add(-1, 'days'), 70],
          ],
          projects: {
            [PROJECT_A.toString()]: [
              [TODAY.add(-2, 'days'), 2],
              [TODAY.add(-1, 'days'), 1],
            ],
            [PROJECT_B.toString()]: [
              [TODAY.add(-2, 'days'), 1337],
              [TODAY.add(-1, 'days'), 69],
            ],
          },
          ethereum: [
            [TODAY.add(-2, 'days'), 2137],
            [TODAY.add(-1, 'days'), 420],
          ],
        }),
      )
    })
  })
})

function formatActivity({
  combined,
  projects,
  ethereum,
}: {
  combined: ActivityApiChartPoint[]
  projects: Record<string, ActivityApiChartPoint[]>
  ethereum: ActivityApiChartPoint[]
}): ActivityApiResponse {
  return {
    combined: {
      types: ['timestamp', 'daily tx count'],
      data: combined,
    },
    ethereum: {
      types: ['timestamp', 'daily tx count'],
      data: ethereum,
    },
    projects: Object.entries(projects).reduce((acc, cur) => {
      return {
        ...acc,
        [cur[0]]: {
          types: ['timestamp', 'daily tx count'],
          data: cur[1],
        },
      }
    }, {}),
  }
}

function mockCounter({
  hasProcessedAll,
  projectId,
}: {
  hasProcessedAll: boolean
  projectId: ProjectId
}) {
  return mockObject<TransactionCounter>({
    hasProcessedAll: () => hasProcessedAll,
    projectId,
  })
}

function mockRepository(counts: DailyTransactionCountRecord[]) {
  return mockObject<DailyTransactionCountViewRepository>({
    getDailyCounts: async () => counts,
  })
}
