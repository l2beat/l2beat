import { mock } from '@l2beat/common'
import {
  ActivityApiChartPoint,
  ActivityApiResponse,
  ProjectId,
  UnixTime,
} from '@l2beat/types'
import { expect } from 'earljs'

import { ActivityV2Controller } from '../../../../src/api/controllers/activity-v2/ActivityV2Controller'
import { TransactionCounter } from '../../../../src/core/activity/TransactionCounter'
import {
  DailyTransactionCountRecord,
  DailyTransactionCountViewRepository,
} from '../../../../src/peripherals/database/activity-v2/DailyTransactionCountViewRepository'

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')
const TODAY = UnixTime.now().toStartOf('day')

describe(ActivityV2Controller.name, () => {
  describe(ActivityV2Controller.prototype.getActivity.name, () => {
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
      const controller = new ActivityV2Controller(
        includedIds,
        counters,
        mockRepository([]),
      )

      await expect(controller.getActivity()).toBeRejected(
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

      const controller = new ActivityV2Controller(
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

      const controller = new ActivityV2Controller(
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
  return mock<TransactionCounter>({
    hasProcessedAll: () => hasProcessedAll,
    projectId,
  })
}

function mockRepository(counts: DailyTransactionCountRecord[]) {
  return mock<DailyTransactionCountViewRepository>({
    getDailyCounts: async () => counts,
  })
}
