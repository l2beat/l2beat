import {
  EthereumAddress,
  L2CostsApiChart,
  L2CostsApiChartPoint,
  L2CostsApiCharts,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range, times } from 'lodash'

import { Project } from '../../../../../model/Project'
import { PriceRepository } from '../../../../tvl/repositories/PriceRepository'
import {
  TrackedTxsConfigRecord,
  TrackedTxsConfigsRepository,
} from '../../../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../../../types/TrackedTxId'
import {
  L2CostsRecord,
  L2CostsRepository,
} from '../repositories/L2CostsRepository'
import { DetailedTransaction } from '../types/DetailedTransaction'
import { CHART_TYPES, L2CostsController } from './L2CostsController'

const START = UnixTime.fromDate(new Date('2024-04-02T09:00:00.000Z')).toStartOf(
  'hour',
)
const NOW_TO_FULL_HOUR = UnixTime.now().toStartOf('hour')

describe(L2CostsController.name, () => {
  describe(L2CostsController.prototype.getL2Costs.name, () => {
    it('correctly calculates l2costs', async () => {
      const l2CostsRepository = mockObject<L2CostsRepository>({
        getByProjectAndTimeRange: mockFn().resolvesTo([]),
      })
      const controller = getMockL2CostsController({
        projects: MOCK_PROJECTS,
        trackedTxsConfigsRepository: mockObject<TrackedTxsConfigsRepository>({
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
        }),
        l2CostsRepository,
      })

      controller.makeTransactionCalculations = mockFn().returns([
        mockObject<DetailedTransaction>({
          timestamp: START.add(-1, 'hours'),
        }),
        mockObject<DetailedTransaction>({
          timestamp: START.add(-2, 'hours'),
        }),
      ])

      controller.aggregateL2Costs = mockFn().returns(
        mockObject<L2CostsApiCharts>({
          hourly: mockObject<L2CostsApiChart>({}),
          daily: mockObject<L2CostsApiChart>({}),
        }),
      )

      const result = await controller.getL2Costs()

      expect(
        l2CostsRepository.getByProjectAndTimeRange,
      ).toHaveBeenNthCalledWith(1, MOCK_PROJECTS[1].projectId, [
        NOW_TO_FULL_HOUR.add(-180, 'days'),
        NOW_TO_FULL_HOUR,
      ])
      expect(
        l2CostsRepository.getByProjectAndTimeRange,
      ).toHaveBeenNthCalledWith(2, MOCK_PROJECTS[2].projectId, [
        NOW_TO_FULL_HOUR.add(-180, 'days'),
        NOW_TO_FULL_HOUR,
      ])
      expect(result.type).toEqual('success')
      expect(result.data.projects).toEqual({
        project2: {
          syncedUntil: new UnixTime(1000),
          daily: mockObject<L2CostsApiChart>({}),
          hourly: mockObject<L2CostsApiChart>({}),
        },
        project3: {
          syncedUntil: new UnixTime(2000),
          daily: mockObject<L2CostsApiChart>({}),
          hourly: mockObject<L2CostsApiChart>({}),
        },
      })
    })
    it('returns empty object if no data', async () => {
      const controller = getMockL2CostsController({})

      const result = await controller.getL2Costs()
      if (result.type === 'success') {
        expect(result.data).toEqual({
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
      }
    })
  })
  describe(L2CostsController.prototype.makeTransactionCalculations.name, () => {
    it('calculates transaction costs', async () => {
      const controller = getMockL2CostsController({})

      const results = await controller.makeTransactionCalculations(
        getMockL2CostRecords(),
      )

      const TX1_GAS_PRICE_ETH = getGasPriceETH(41_000_000_000)
      const TX2_GAS_PRICE_ETH = getGasPriceETH(29_000_000_000)
      const expected = [
        {
          timestamp: START.add(-1, 'hours'),
          calldataGasUsed: 2700,
          computeGasUsed: 400_000 - 2700 - 21_000,
          overheadGasUsed: 21000 as const,
          totalGas: 400_000,
          gasCost: 400_000 * TX1_GAS_PRICE_ETH,
          calldataGasCost: 2700 * TX1_GAS_PRICE_ETH,
          computeGasCost: (400_000 - 2700 - 21_000) * TX1_GAS_PRICE_ETH,
          totalGasCost: 400_000 * TX1_GAS_PRICE_ETH,
          totalOverheadGasCost: 21000 * TX1_GAS_PRICE_ETH,
          gasCostUsd: 400_000 * TX1_GAS_PRICE_ETH * 3000,
          totalGasCostUsd: 400_000 * TX1_GAS_PRICE_ETH * 3000,
          calldataGasCostUsd: 2700 * TX1_GAS_PRICE_ETH * 3000,
          computeGasCostUsd:
            (400_000 - 2700 - 21_000) * TX1_GAS_PRICE_ETH * 3000,
          totalOverheadGasCostUsd: 21000 * TX1_GAS_PRICE_ETH * 3000,
          type: 2 as const,
        },
        {
          timestamp: START.add(-2, 'hours'),
          calldataGasUsed: 0,
          computeGasUsed: 0,
          overheadGasUsed: 21000 as const,
          totalGas: 21000 + 780_000,
          gasCost: 21000 * TX2_GAS_PRICE_ETH,
          calldataGasCost: 0,
          computeGasCost: 0,
          totalGasCost: 21000 * TX2_GAS_PRICE_ETH + getGasPriceETH(1) * 780_000,
          totalOverheadGasCost: 21000 * TX2_GAS_PRICE_ETH,
          gasCostUsd: 21000 * TX2_GAS_PRICE_ETH * 3100,
          totalGasCostUsd:
            (21000 * TX2_GAS_PRICE_ETH + getGasPriceETH(1) * 780_000) * 3100,
          calldataGasCostUsd: 0,
          computeGasCostUsd: 0,
          totalOverheadGasCostUsd: 21000 * TX2_GAS_PRICE_ETH * 3100,
          type: 3 as const,
          blobGasCost: getGasPriceETH(1) * 780_000,
          blobGasUsed: 780_000,
          blobGasCostUsd: getGasPriceETH(1) * 780_000 * 3100,
        },
      ]
      expect(results).toEqualUnsorted(expected)
    })
  })

  describe(L2CostsController.prototype.aggregateL2Costs.name, () => {
    it('aggregates l2 costs hourly and daily', () => {
      const controller = getMockL2CostsController({})
      const transactions = getMockDetailedTransactions(50)
      const combinedHourlyMap = new Map<number, L2CostsApiChartPoint>()
      const combinedDailyMap = new Map<number, L2CostsApiChartPoint>()
      const result = controller.aggregateL2Costs(
        transactions,
        combinedHourlyMap,
        combinedDailyMap,
      )
      expect(result.hourly.data).toEqualUnsorted([
        ...times(26, (i) =>
          datapoint(START.add(-i, 'hours'), i === 0 || i === 25 ? 1 : 2),
        ),
      ])
      expect(result.daily.data).toEqualUnsorted([
        ...times(2, (i) =>
          datapoint(START.toStartOf('day').add(-i, 'days'), i === 0 ? 19 : 31),
        ),
      ])
    })
  })
})

function getMockL2CostsController(params: {
  l2CostsRepository?: L2CostsRepository
  trackedTxsConfigsRepository?: TrackedTxsConfigsRepository
  priceRepository?: PriceRepository
  projects?: Project[]
}) {
  const {
    l2CostsRepository,
    trackedTxsConfigsRepository,
    priceRepository,
    projects,
  } = params

  return new L2CostsController(
    l2CostsRepository ?? mockObject<L2CostsRepository>({}),
    trackedTxsConfigsRepository ?? mockObject<TrackedTxsConfigsRepository>({}),
    priceRepository ??
      mockObject<PriceRepository>({
        findByTimestampRange: mockFn().resolvesToOnce(
          new Map([
            [START.add(-1, 'hours').toNumber(), 3000],
            [START.add(-2, 'hours').toNumber(), 3100],
          ]),
        ),
      }),
    projects ?? [],
  )
}

function getMockL2CostRecords(): L2CostsRecord[] {
  return [
    {
      txHash: '0x1',
      timestamp: START.add(-1, 'hours'),
      trackedTxId: TrackedTxId.unsafe('aaa'),
      data: {
        type: 2,
        gasUsed: 400000,
        gasPrice: 41000000000,
        calldataLength: 2000,
        calldataGasUsed: 2700,
      },
    },
    {
      txHash: '0x2',
      timestamp: START.add(-2, 'hours'),
      trackedTxId: TrackedTxId.unsafe('bbb'),
      data: {
        type: 3,
        gasUsed: 21000,
        gasPrice: 29_000_000_000,
        blobGasPrice: 1,
        blobGasUsed: 780_000,
        calldataGasUsed: 0,
        calldataLength: 0,
      },
    },
  ]
}

const MOCK_PROJECTS: Project[] = [
  mockObject<Project>({
    projectId: ProjectId('project1'),
    isArchived: false,
    trackedTxsConfig: undefined,
  }),
  mockObject<Project>({
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
        },
      ],
    },
  }),
  mockObject<Project>({
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

function getGasPriceETH(gasPrice: number) {
  const gasPriceGwei = parseFloat((gasPrice * 1e-9).toFixed(9))
  return parseFloat((gasPriceGwei * 1e-9).toFixed(18))
}

function datapoint(timestamp: UnixTime, value: number): L2CostsApiChartPoint {
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
    null,
    null,
    null,
  ]
}

function getMockDetailedTransactions(
  amount: number,
  withBlobs: boolean = false,
): DetailedTransaction[] {
  return range(amount).map((i) => {
    const base = {
      timestamp: START.add(-i * 30, 'minutes'),
      calldataGasUsed: 1,
      computeGasUsed: 1,
      totalGas: 1,
      gasCost: 1,
      calldataGasCost: 1,
      computeGasCost: 1,
      calldataGasCostUsd: 1,
      computeGasCostUsd: 1,
      totalGasCost: 1,
      gasCostUsd: 1,
      totalGasCostUsd: 1,
      overheadGasUsed: 21_000 as const,
      totalOverheadGasCost: 1,
      totalOverheadGasCostUsd: 1,
      type: 2 as const,
    }
    if (withBlobs) {
      return {
        ...base,
        type: 3 as const,
        blobGasCost: 1,
        blobGasCostUsd: 1,
        blobGasUsed: 1,
      }
    }
    return base
  })
}
