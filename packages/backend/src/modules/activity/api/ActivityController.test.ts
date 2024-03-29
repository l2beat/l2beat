import {
  ActivityApiChartPoint,
  ActivityApiResponse,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

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
          combined: [
            [TODAY.add(-2, 'days'), 2, 2137],
            [TODAY.add(-1, 'days'), 1, 420],
          ],
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
          combined: [
            [TODAY.add(-2, 'days'), 1339, 2137],
            [TODAY.add(-1, 'days'), 70, 420],
          ],
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
      daily: {
        types: ['timestamp', 'transactions', 'ethereumTransactions'],
        data: combined,
      },
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
}: {
  hasProcessedAll: boolean
  projectId: ProjectId
}) {
  return mockObject<SequenceProcessor>({
    hasProcessedAll: () => hasProcessedAll,
    projectId,
  })
}

function mockRepository(counts: DailyTransactionCountRecord[]) {
  return mockObject<ActivityViewRepository>({
    getDailyCounts: async () => counts,
  })
}
