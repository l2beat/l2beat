import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  EthereumAddress,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { Clock } from '../../../core/Clock'
import { LivenessTransfer } from '../../../core/liveness/types/LivenessConfig'
import { LivenessConfigurationIdentifier } from '../../../core/liveness/types/LivenessConfigurationIdentifier'
import { Project } from '../../../model'
import {
  LivenessConfigurationRecord,
  LivenessConfigurationRepository,
} from '../../../peripherals/database/LivenessConfigurationRepository'
import {
  LivenessRecordWithProjectIdAndType,
  LivenessRepository,
} from '../../../peripherals/database/LivenessRepository'
import {
  calculateDetailsFor,
  calculateIntervals,
} from './calculateIntervalWithAverages'
import { LivenessController } from './LivenessController'

describe(LivenessController.name, () => {
  describe(LivenessController.prototype.getLiveness.name, () => {
    // TODO: unskip it
    it.skip('correctly finds anomalies', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndType[] = []

      RECORDS.push(
        ...Array.from({ length: 500 }).map((_, i) => ({
          projectId: ProjectId('project1'),
          timestamp: START.add(-i, 'hours'),
          type: LivenessType('DA'),
        })),
      )
      RECORDS.push({
        projectId: ProjectId('project1'),
        timestamp: START.add(-1000, 'hours'),
        type: LivenessType('DA'),
      })

      const livenessController = new LivenessController(
        getMockLivenessRepository(RECORDS),
        mockProjectConfig(RECORDS),
        getMockClock(),
        getMockLivenessConfigurationRepository(),
        getMockLogger(),
      )

      const result = await livenessController.getLiveness()
      if (result.type === 'success') {
        const project1Anomalies = result.data.projects.project1?.anomalies

        expect(project1Anomalies).toEqual([
          {
            timestamp: RECORDS.at(-2)!.timestamp,
            durationInSeconds: 501 * 3600,
            type: LivenessType('DA'),
          },
        ])
      }
    })

    it('returns empty array if no anomalies', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndType[] = []

      RECORDS.push(
        ...Array.from({ length: 10 }).map((_, i) => ({
          projectId: ProjectId('project1'),
          timestamp: START.add(-i, 'hours'),
          type: LivenessType('DA'),
        })),
      )
      const livenessController = new LivenessController(
        getMockLivenessRepository(RECORDS),
        mockProjectConfig(RECORDS),
        getMockClock(),
        getMockLivenessConfigurationRepository(),
        getMockLogger(),
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
        [],
        getMockClock(),
        getMockLivenessConfigurationRepository(),
        getMockLogger(),
      )

      const result = await livenessController.getLiveness()
      if (result.type === 'success') {
        expect(result.data).toEqual({ projects: {} })
      }
    })

    it('correctly calculate avg, min and max', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndType[] = []

      RECORDS.push(
        ...Array.from({ length: 30 + 60 / 2 + 30 / 3 }).map((_, i) => {
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
            type: LivenessType('DA'),
          }
        }),
      )
      const livenessController = new LivenessController(
        getMockLivenessRepository(RECORDS),
        mockProjectConfig(RECORDS),
        getMockClock(),
        getMockLivenessConfigurationRepository(),
        getMockLogger(),
      )

      const records = [...RECORDS]
      calculateIntervals(records)

      const last30Days = calculateDetailsFor(records, '30d')
      const last90Days = calculateDetailsFor(records, '90d')
      const allTime = calculateDetailsFor(records, 'allTime')

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
        const project1BatchSubmissions =
          result.data.projects.project1?.batchSubmissions
        expect(project1BatchSubmissions).toEqual(expected)
      }
    })
  })

  it('return error when data is not fully synced', async () => {
    const projectId = ProjectId('test')
    const type = LivenessType('STATE')
    const sinceTimestamp = new UnixTime(0)
    const from = EthereumAddress.random()
    const to = EthereumAddress.random()

    const config: LivenessTransfer = {
      livenessConfigurationId: Math.floor(Math.random() * 100),
      projectId,
      type,
      sinceTimestamp,
      from,
      to,
    }
    const clock = getMockClock()

    const logger = getMockLogger()

    const livenessController = new LivenessController(
      getMockLivenessRepository([]),
      mockProjectConfig([]),
      clock,
      getMockLivenessConfigurationRepository([
        {
          id: 1,
          projectId,
          type,
          identifier: LivenessConfigurationIdentifier(config),
          params: JSON.stringify(
            LivenessConfigurationIdentifier.params(config),
          ),
          sinceTimestamp,
          lastSyncedTimestamp: clock.getLastHour().add(-3, 'hours'),
        },
      ]),
      logger,
    )
    const result = await livenessController.getLiveness()

    expect(result.type).toEqual('error')
    if (result.type === 'error') {
      expect(result.error).toEqual('DATA_NOT_SYNCED')
      expect(logger.error).toHaveBeenCalled()
    }
  })
})

const START = UnixTime.now()

function getMockClock() {
  return mockObject<Clock>({
    getLastHour: () => UnixTime.now().toStartOf('hour').add(-1, 'hours'),
  })
}

function getMockLogger() {
  const wrappedLogger = mockObject<Logger>({
    error: () => {},
    debug: () => {},
    trace: () => {},
    info: () => {},
  })

  const logger = mockObject<Logger>({
    for: () => wrappedLogger,
    error: () => {},
  })
  return logger
}

function getMockLivenessConfigurationRepository(
  data?: LivenessConfigurationRecord[],
) {
  return mockObject<LivenessConfigurationRepository>({
    getAll: async () => data ?? [],
    addMany: async () => [],
    deleteMany: async () => -1,
  })
}

function getMockLivenessRepository(
  records: LivenessRecordWithProjectIdAndType[],
) {
  return mockObject<LivenessRepository>({
    getAllWithProjectIdAndType() {
      return Promise.resolve(records)
    },
    getWithTypeDistinctTimestamp(projectId: ProjectId) {
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
  records: LivenessRecordWithProjectIdAndType[],
): Project[] {
  return records
    .map((x) => x.projectId)
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((projectId) =>
      mockObject<Project>({
        projectId,
        isArchived: false,
        livenessConfig: mockObject<Project['livenessConfig']>({
          duplicateData: [],
          functionCalls: [],
          transfers: [],
        }),
      }),
    )
}
