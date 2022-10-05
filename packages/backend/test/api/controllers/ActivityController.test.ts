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
import { StarkexTransactionUpdater } from '../../../src/core/transaction-count/StarkexTransactionCountUpdater'
import { TransactionCounter } from '../../../src/core/transaction-count/TransactionCounter'
import { ZksyncTransactionUpdater } from '../../../src/core/transaction-count/ZksyncTransactionUpdater'

describe(ActivityController.name, () => {
  it('returns empty if no projects track activity', async () => {
    const controller = new ActivityController(
      [],
      mock<TransactionCounter>({
        async getDailyTransactionCounts() {
          return []
        },
      }),
    )
    expect(await controller.getTransactionActivity()).toEqual(
      formatActivity({ combined: [], projects: {}, ethereum: [] }),
    )
  })

  it('groups data', async () => {
    const controller = new ActivityController(
      [
        mock<RpcTransactionUpdater>({
          projectId: ProjectId('optimism'),
          async getDailyTransactionCounts() {
            return [
              { count: 1, timestamp: new UnixTime(0).add(1, 'days') },
              { count: 2, timestamp: new UnixTime(0).add(2, 'days') },
              { count: 3, timestamp: new UnixTime(0).add(3, 'days') },
            ]
          },
        }),
        mock<StarkexTransactionUpdater>({
          projectId: ProjectId('dydx'),
          async getDailyTransactionCounts() {
            return [
              { count: 4, timestamp: new UnixTime(0) },
              { count: 5, timestamp: new UnixTime(0).add(1, 'days') },
              { count: 6, timestamp: new UnixTime(0).add(2, 'days') },
            ]
          },
        }),
        mock<ZksyncTransactionUpdater>({
          projectId: ProjectId('zksync'),
          async getDailyTransactionCounts() {
            return [
              { count: 7, timestamp: new UnixTime(0).add(2, 'days') },
              { count: 8, timestamp: new UnixTime(0).add(3, 'days') },
              { count: 9, timestamp: new UnixTime(0).add(4, 'days') },
            ]
          },
        }),
      ],
      mock<TransactionCounter>({
        async getDailyTransactionCounts() {
          return [
            { count: 100, timestamp: new UnixTime(0) },
            { count: 200, timestamp: new UnixTime(0).add(1, 'days') },
            { count: 300, timestamp: new UnixTime(0).add(2, 'days') },
            { count: 400, timestamp: new UnixTime(0).add(3, 'days') },
            { count: 500, timestamp: new UnixTime(0).add(4, 'days') },
          ]
        },
      }),
    )

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
        ethereum: [
          [new UnixTime(0), 100],
          [new UnixTime(0).add(1, 'days'), 200],
          [new UnixTime(0).add(2, 'days'), 300],
          [new UnixTime(0).add(3, 'days'), 400],
          [new UnixTime(0).add(4, 'days'), 500],
        ],
      }),
    )
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
