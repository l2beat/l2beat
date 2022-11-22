import { mock } from '@l2beat/common'
import {
  ActivityApiChartPoint,
  ActivityApiResponse,
  ProjectId,
  UnixTime,
} from '@l2beat/types'
import { expect } from 'earljs'

import { ActivityV2Controller } from '../../../../src/api/controllers/activity-v2/ActivityV2Controller'
import { DailyTransactionCountService } from '../../../../src/core/activity/DailyTransactionCountService'
import { DailyTransactionCount } from '../../../../src/core/transaction-count/TransactionCounter'

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')
const YESTERDAY = UnixTime.now().toStartOf('day').add(-1, 'days')
const YESTERDAY_2 = YESTERDAY.add(-1, 'days')

describe(ActivityV2Controller.name, () => {
  describe(ActivityV2Controller.prototype.getActivity.name, () => {
    it('throws if ethereum not present', async () => {
      const controller = new ActivityV2Controller(
        [],
        mock<DailyTransactionCountService>({
          async getDailyCounts() {
            return new Map()
          },
        }),
      )
      await expect(controller.getActivity()).toBeRejected(
        'Assertion Error: Ethereum missing in daily transaction count',
      )
    })

    it('returns empty if no projects track activity', async () => {
      const controller = new ActivityV2Controller(
        [],
        mock<DailyTransactionCountService>({
          async getDailyCounts() {
            const result = new Map()
            result.set(ProjectId.ETHEREUM, [
              { timestamp: YESTERDAY_2.add(-1, 'days'), count: 1 },
              { timestamp: YESTERDAY_2, count: 0 },
            ])
            result.set(PROJECT_A, [
              { timestamp: YESTERDAY_2.add(-2, 'days'), count: 2 },
              { timestamp: YESTERDAY_2.add(-1, 'days'), count: 0 },
            ])
            return result
          },
        }),
      )
      expect(await controller.getActivity()).toEqual(
        formatActivity({
          combined: [],
          projects: {},
          ethereum: [
            [YESTERDAY_2.add(-1, 'days'), 1],
            [YESTERDAY_2, 0],
          ],
        }),
      )
    })

    it('groups data', async () => {
      const controller = new ActivityV2Controller(
        [PROJECT_A, PROJECT_B],
        mock<DailyTransactionCountService>({
          async getDailyCounts() {
            const result = new Map<ProjectId, DailyTransactionCount[]>()
            result.set(PROJECT_A, [
              {
                timestamp: YESTERDAY_2,
                count: 420,
              },
              {
                timestamp: YESTERDAY,
                count: 69,
              },
            ])
            result.set(PROJECT_B, [
              {
                timestamp: YESTERDAY_2,
                count: 1337,
              },
              {
                timestamp: YESTERDAY,
                count: 2137,
              },
            ])
            result.set(ProjectId.ETHEREUM, [
              { timestamp: YESTERDAY_2, count: 1 },
              { timestamp: YESTERDAY, count: 2 },
            ])

            return result
          },
        }),
      )

      expect(await controller.getActivity()).toEqual(
        formatActivity({
          combined: [
            [YESTERDAY_2, 1757],
            [YESTERDAY, 2206],
          ],
          projects: {
            [PROJECT_A.toString()]: [
              [YESTERDAY_2, 420],
              [YESTERDAY, 69],
            ],
            [PROJECT_B.toString()]: [
              [YESTERDAY_2, 1337],
              [YESTERDAY, 2137],
            ],
          },
          ethereum: [
            [YESTERDAY_2, 1],
            [YESTERDAY, 2],
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
