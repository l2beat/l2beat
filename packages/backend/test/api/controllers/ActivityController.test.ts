import { mock } from '@l2beat/common'
import {
  ActivityApiChartPoint,
  ActivityApiResponse,
  ProjectId,
  UnixTime,
} from '@l2beat/types'
import { expect } from 'earljs'

import { ActivityController } from '../../../src/api/controllers/ActivityController'
import { RpcTransactionUpdater } from '../../../src/core/transaction-count/RpcTransactionUpdater'
import { StarkexTransactionCountUpdater } from '../../../src/core/transaction-count/StarkexTransactionCountUpdater'
import { ZksyncTransactionUpdater } from '../../../src/core/transaction-count/ZksyncTransactionUpdater'

describe(ActivityController.name, () => {
  it('returns empty if no projects track activity', async () => {
    const controller = new ActivityController([])
    expect(await controller.getTransactionActivity()).toEqual(
      formatActivity({ combined: [], projects: {} }),
    )
  })

  it('groups data', async () => {
    const controller = new ActivityController([
      mock<RpcTransactionUpdater>({
        async getDailyTransactionCounts() {
          return {
            projectId: ProjectId('optimism'),
            counts: [
              { count: 1, timestamp: new UnixTime(0).add(1, 'days') },
              { count: 2, timestamp: new UnixTime(0).add(2, 'days') },
              { count: 3, timestamp: new UnixTime(0).add(3, 'days') },
            ],
          }
        },
      }),
      mock<StarkexTransactionCountUpdater>({
        async getDailyTransactionCounts() {
          return {
            projectId: ProjectId('dydx'),
            counts: [
              { count: 4, timestamp: new UnixTime(0) },
              { count: 5, timestamp: new UnixTime(0).add(1, 'days') },
              { count: 6, timestamp: new UnixTime(0).add(2, 'days') },
            ],
          }
        },
      }),
      mock<ZksyncTransactionUpdater>({
        async getDailyTransactionCounts() {
          return {
            projectId: ProjectId('zksync'),
            counts: [
              { count: 7, timestamp: new UnixTime(0).add(2, 'days') },
              { count: 8, timestamp: new UnixTime(0).add(3, 'days') },
              { count: 9, timestamp: new UnixTime(0).add(4, 'days') },
            ],
          }
        },
      }),
    ])

    expect(await controller.getTransactionActivity()).toEqual(
      formatActivity({
        combined: [
          [new UnixTime(0), 4],
          [new UnixTime(0).add(1, 'days'), 6],
          [new UnixTime(0).add(2, 'days'), 15],
          [new UnixTime(0).add(3, 'days'), 11],
          [new UnixTime(0).add(4, 'days'), 9],
        ],
        projects: {
          dydx: [
            [new UnixTime(0), 4],
            [new UnixTime(0).add(1, 'days'), 5],
            [new UnixTime(0).add(2, 'days'), 6],
          ],
          optimism: [
            [new UnixTime(0).add(1, 'days'), 1],
            [new UnixTime(0).add(2, 'days'), 2],
            [new UnixTime(0).add(3, 'days'), 3],
          ],
          zksync: [
            [new UnixTime(0).add(2, 'days'), 7],
            [new UnixTime(0).add(3, 'days'), 8],
            [new UnixTime(0).add(4, 'days'), 9],
          ],
        },
      }),
    )
  })
})

function formatActivity({
  combined,
  projects,
}: {
  combined: ActivityApiChartPoint[]
  projects: Record<string, ActivityApiChartPoint[]>
}): ActivityApiResponse {
  return {
    combined: {
      types: ['timestamp', 'daily tx count'],
      data: combined,
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
