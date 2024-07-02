import {
  EthereumAddress,
  L2CostsApiChart,
  L2CostsApiChartPoint,
  L2CostsProjectApiCharts,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import { range, times } from 'lodash'

import { BackendProject } from '@l2beat/config'
import { TrackedTxId } from '@l2beat/shared'
import {
  TrackedTxsConfigRecord,
  TrackedTxsConfigsRepository,
} from '../../../repositories/TrackedTxsConfigsRepository'
import {
  AggregatedL2CostsRecord,
  AggregatedL2CostsRepository,
} from '../repositories/AggregatedL2CostsRepository'
import {
  CHART_TYPES,
  L2CostsController,
  L2CostsControllerDeps,
} from './L2CostsController'

describe(L2CostsController.name, () => {
  let time: InstalledClock
  let START_OF_HOUR: UnixTime
  let START_OF_DAY: UnixTime

  beforeEach(() => {
    time = install()
    setTime('10:00:00')
    START_OF_HOUR = UnixTime.now().toStartOf('hour')
    START_OF_DAY = START_OF_HOUR.toStartOf('day')
  })

  afterEach(() => {
    time.uninstall()
  })

  describe(L2CostsController.prototype.getL2Costs.name, () => {
    it('correctly calculates l2costs', async () => {
      const aggregatedL2CostsRepository =
        mockObject<AggregatedL2CostsRepository>({
          getByProjectAndTimeRange: mockFn().resolvesTo([]),
        })

      const trackedTxsConfigsRepository =
        mockObject<TrackedTxsConfigsRepository>({
          getByProjectIdAndType: mockFn()
            .given(MOCK_PROJECTS[1].projectId, 'l2costs')
            .resolvesToOnce([
              mockObject<TrackedTxsConfigRecord>({
                id: TrackedTxId.unsafe('aaa'),
                projectId: MOCK_PROJECTS[1].projectId,
                untilTimestampExclusive: undefined,
                lastSyncedTimestamp: new UnixTime(1000),
              }),
            ])
            .given(MOCK_PROJECTS[2].projectId, 'l2costs')
            .resolvesToOnce([
              mockObject<TrackedTxsConfigRecord>({
                id: TrackedTxId.unsafe('bbb'),
                projectId: MOCK_PROJECTS[2].projectId,
                untilTimestampExclusive: undefined,
                lastSyncedTimestamp: new UnixTime(2000),
              }),
            ]),
        })

      const controller = getMockL2CostsController(
        aggregatedL2CostsRepository,
        trackedTxsConfigsRepository,
        MOCK_PROJECTS,
      )

      controller.aggregateL2Costs = mockFn().returns(
        mockObject<L2CostsProjectApiCharts>({
          hourly: mockObject<L2CostsApiChart>({
            data: [],
          }),
          daily: mockObject<L2CostsApiChart>({
            data: [],
          }),
        }),
      )

      const result = await controller.getL2Costs()

      expect(
        aggregatedL2CostsRepository.getByProjectAndTimeRange,
      ).toHaveBeenCalledTimes(2)
      expect(
        aggregatedL2CostsRepository.getByProjectAndTimeRange,
      ).toHaveBeenNthCalledWith(1, MOCK_PROJECTS[1].projectId, [
        START_OF_HOUR.add(-180, 'days'),
        START_OF_HOUR,
      ])
      expect(result.projects).toEqual({
        project2: {
          syncedUntil: new UnixTime(1000),
          daily: mockObject<L2CostsApiChart>({
            data: [],
          }),
          hourly: mockObject<L2CostsApiChart>({
            data: [],
          }),
        },
        project3: {
          syncedUntil: new UnixTime(2000),
          daily: mockObject<L2CostsApiChart>({
            data: [],
          }),
          hourly: mockObject<L2CostsApiChart>({
            data: [],
          }),
        },
      })
    })

    it('returns empty object if no data', async () => {
      const controller = getMockL2CostsController()

      const result = await controller.getL2Costs()
      expect(result).toEqual({
        projects: {},
        combined: {
          hourly: {
            types: CHART_TYPES,
            data: [],
          },
          daily: {
            types: CHART_TYPES,
            data: [],
          },
        },
      })
    })
  })

  describe(L2CostsController.prototype.aggregateL2Costs.name, () => {
    it('aggregates l2 costs hourly and daily with blobs', () => {
      const controller = getMockL2CostsController()
      const records = getMockAggregatedRecords(50)
      const combinedHourlyMap = new Map<number, L2CostsApiChartPoint>()
      const combinedDailyMap = new Map<number, L2CostsApiChartPoint>()
      const result = controller.aggregateL2Costs(
        records,
        combinedHourlyMap,
        combinedDailyMap,
        START_OF_HOUR,
      )

      // we mock a normal transaction every 30 minutes, and once per hour with blob
      expect(result.hourly.data).toEqual([
        datapoint(START_OF_HOUR, 1, 1),
        ...times(24, (i) =>
          datapoint(START_OF_HOUR.add(-(i + 1), 'hours'), 2, 1),
        ),
        datapoint(START_OF_HOUR.add(-25, 'hours'), 1, null),
      ])

      expect(result.daily.data).toEqual([
        datapoint(START_OF_DAY.add(-1, 'days'), 29, 14),
      ])

      // adds values to combined maps
      expect(Array.from(combinedHourlyMap.values())).toEqual([
        datapoint(START_OF_HOUR, 1, 1),
        ...times(24, (i) =>
          datapoint(START_OF_HOUR.add(-(i + 1), 'hours'), 2, 1),
        ),
        datapoint(START_OF_HOUR.add(-25, 'hours'), 1, null),
      ])
      expect(Array.from(combinedDailyMap.values())).toEqual([
        datapoint(START_OF_DAY.add(-1, 'days'), 29, 14),
      ])
    })
  })

  function setTime(hhmmss: string) {
    const newLocal = new Date(`2024-04-08T${hhmmss}.000Z`)
    const newTime = newLocal
    time.setSystemTime(newTime)
    return newTime
  }

  function getMockL2CostsController(
    aggregatedL2CostsRepository?: AggregatedL2CostsRepository,
    trackedTxsConfigsRepository?: TrackedTxsConfigsRepository,
    projects?: BackendProject[],
  ) {
    const deps: L2CostsControllerDeps = {
      aggregatedL2CostsRepository:
        aggregatedL2CostsRepository ??
        mockObject<AggregatedL2CostsRepository>({}),
      trackedTxsConfigsRepository:
        trackedTxsConfigsRepository ??
        mockObject<TrackedTxsConfigsRepository>({}),
      projects: projects ?? [],
    }

    return new L2CostsController(deps)
  }

  const MOCK_PROJECTS: BackendProject[] = [
    mockObject<BackendProject>({
      projectId: ProjectId('project1'),
      isArchived: false,
      trackedTxsConfig: undefined,
    }),
    mockObject<BackendProject>({
      projectId: ProjectId('project2'),
      isArchived: false,
      trackedTxsConfig: {
        entries: [
          {
            address: EthereumAddress.random(),
            formula: 'functionCall',
            projectId: ProjectId('project2'),
            selector: '0x1234',
            sinceTimestampInclusive: new UnixTime(1000),
            uses: [
              {
                id: TrackedTxId.unsafe('aaa'),
                type: 'liveness',
                subtype: 'batchSubmissions',
              },
              {
                id: TrackedTxId.unsafe('aaa'),
                type: 'l2costs',
                subtype: 'batchSubmissions',
              },
            ],
            costMultiplier: 0.6,
          },
        ],
      },
    }),
    mockObject<BackendProject>({
      projectId: ProjectId('project3'),
      isArchived: false,
      trackedTxsConfig: {
        entries: [
          {
            from: EthereumAddress.random(),
            to: EthereumAddress.random(),
            formula: 'transfer',
            projectId: ProjectId('project3'),
            sinceTimestampInclusive: new UnixTime(2000),
            uses: [
              {
                id: TrackedTxId.unsafe('bbb'),
                type: 'l2costs',
                subtype: 'stateUpdates',
              },
            ],
          },
        ],
      },
    }),
  ]

  function datapoint(
    timestamp: UnixTime,
    value: number,
    blobValue: number | null = null,
  ): L2CostsApiChartPoint {
    return [
      timestamp,
      value,
      value,
      value,
      value * 21_000,
      value,
      value,
      value,
      value,
      value,
      value,
      value,
      value,
      blobValue,
      blobValue,
      blobValue,
    ]
  }

  function getMockAggregatedRecords(amount: number): AggregatedL2CostsRecord[] {
    return range(amount).map((i: number): AggregatedL2CostsRecord => {
      const base = {
        timestamp: START_OF_HOUR.add(-i * 30, 'minutes'),
        projectId: ProjectId('random'),
        totalGas: 1,
        totalGasEth: 1,
        totalGasUsd: 1,
        overheadGas: 21000,
        overheadGasEth: 1,
        overheadGasUsd: 1,
        calldataGas: 1,
        calldataGasEth: 1,
        calldataGasUsd: 1,
        computeGas: 1,
        computeGasEth: 1,
        computeGasUsd: 1,
        blobsGas: null,
        blobsGasEth: null,
        blobsGasUsd: null,
      }

      if (i % 2 === 0) {
        return {
          ...base,
          blobsGas: 1,
          blobsGasEth: 1,
          blobsGasUsd: 1,
        }
      }

      return base
    })
  }
})
