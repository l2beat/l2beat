import { mock } from '@l2beat/common'
import {
  ActivityChartPoint,
  ApiActivity,
  ProjectId,
  UnixTime,
} from '@l2beat/types'
import { expect } from 'earljs'

import { ActivityController } from '../../../src/api/controllers/ActivityController'
import { Project } from '../../../src/model'
import { RpcTransactionCountRepository } from '../../../src/peripherals/database/RpcTransactionCountRepository'
import { StarkexTransactionCountRepository } from '../../../src/peripherals/database/StarkexTransactionCountRepository'

const DYDX: Pick<Project, 'projectId' | 'transactionApi'> = {
  projectId: ProjectId('dydx'),
  transactionApi: {
    type: 'starkex',
    product: 'dydx',
    sinceTimestamp: new UnixTime(0),
  },
}

describe(ActivityController.name, () => {
  it('returns empty if no projects track activity', async () => {
    const controller = new ActivityController(
      [],
      mock<RpcTransactionCountRepository>(),
      mock<StarkexTransactionCountRepository>(),
    )
    expect(await controller.getTransactionActivity()).toEqual(
      formatActivity({ combined: [], projects: {} }),
    )
  })

  it('favors config over database', async () => {
    const controller = new ActivityController(
      [DYDX],
      mock<RpcTransactionCountRepository>({
        async getDailyTransactionCount(_projectId) {
          return [{ count: 1, timestamp: new UnixTime(0) }]
        },
      }),
      mock<StarkexTransactionCountRepository>({
        async getDailyTransactionCount(_projectId) {
          return [{ count: 1, timestamp: new UnixTime(0) }]
        },
      }),
    )
    expect(await controller.getTransactionActivity()).toEqual(
      formatActivity({
        combined: [[new UnixTime(0), 1]],
        projects: { dydx: [[new UnixTime(0), 1]] },
      }),
    )
  })

  it('groups data', async () => {
    const controller = new ActivityController(
      [
        DYDX,
        {
          projectId: ProjectId('optimism'),
          transactionApi: {
            type: 'rpc',
            provider: 'jsonRpc',
            url: '',
            callsPerMinute: 100,
          },
        },
      ],
      mock<RpcTransactionCountRepository>({
        async getDailyTransactionCount(_projectId) {
          return [
            { count: 1, timestamp: new UnixTime(0).add(1, 'days') },
            { count: 2, timestamp: new UnixTime(0).add(2, 'days') },
            { count: 3, timestamp: new UnixTime(0).add(3, 'days') },
          ]
        },
      }),
      mock<StarkexTransactionCountRepository>({
        async getDailyTransactionCount(_projectId) {
          return [
            { count: 4, timestamp: new UnixTime(0) },
            { count: 5, timestamp: new UnixTime(0).add(1, 'days') },
            { count: 6, timestamp: new UnixTime(0).add(2, 'days') },
          ]
        },
      }),
    )

    expect(await controller.getTransactionActivity()).toEqual(
      formatActivity({
        combined: [
          [new UnixTime(0), 4],
          [new UnixTime(0).add(1, 'days'), 6],
          [new UnixTime(0).add(2, 'days'), 8],
          [new UnixTime(0).add(3, 'days'), 3],
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
        },
      }),
    )
  })
})

function formatActivity({
  combined,
  projects,
}: {
  combined: ActivityChartPoint[]
  projects: Record<string, ActivityChartPoint[]>
}): ApiActivity {
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
