import {
  EthereumAddress,
  L2CostsApiProject,
  L2CostsDetails,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { isArray, range } from 'lodash'

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
import {
  DetailedTransaction,
  L2CostsController,
  SummedL2Costs,
} from './L2CostsController'

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
          timestamp: NOW_TO_FULL_HOUR.add(-1, 'hours'),
        }),
        mockObject<DetailedTransaction>({
          timestamp: NOW_TO_FULL_HOUR.add(-2, 'hours'),
        }),
      ])

      controller.sumDetails = mockFn().returns(
        mockObject<Omit<L2CostsApiProject, 'syncedUntil'>>({
          last24h: mockObject<L2CostsDetails>({}),
          last7d: mockObject<L2CostsDetails>({}),
          last30d: mockObject<L2CostsDetails>({}),
          last90d: mockObject<L2CostsDetails>({}),
        }),
      )

      const result = await controller.getL2Costs()

      expect(
        l2CostsRepository.getByProjectAndTimeRange,
      ).toHaveBeenNthCalledWith(1, MOCK_PROJECTS[1].projectId, [
        NOW_TO_FULL_HOUR.add(-90, 'days'),
        NOW_TO_FULL_HOUR,
      ])
      expect(
        l2CostsRepository.getByProjectAndTimeRange,
      ).toHaveBeenNthCalledWith(2, MOCK_PROJECTS[2].projectId, [
        NOW_TO_FULL_HOUR.add(-90, 'days'),
        NOW_TO_FULL_HOUR,
      ])

      expect(result.type).toEqual('success')
      expect(result.data.projects).toEqual({
        project2: {
          syncedUntil: new UnixTime(1000),
          last24h: mockObject<L2CostsDetails>({}),
          last7d: mockObject<L2CostsDetails>({}),
          last30d: mockObject<L2CostsDetails>({}),
          last90d: mockObject<L2CostsDetails>({}),
        },
        project3: {
          syncedUntil: new UnixTime(2000),
          last24h: mockObject<L2CostsDetails>({}),
          last7d: mockObject<L2CostsDetails>({}),
          last30d: mockObject<L2CostsDetails>({}),
          last90d: mockObject<L2CostsDetails>({}),
        },
      })
    })
    it('returns empty object if no data', async () => {
      const controller = getMockL2CostsController({})

      const result = await controller.getL2Costs()
      if (result.type === 'success') {
        expect(result.data).toEqual({ projects: {} })
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
          timestamp: NOW_TO_FULL_HOUR.add(-1, 'hours'),
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
          timestamp: NOW_TO_FULL_HOUR.add(-2, 'hours'),
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

  describe(L2CostsController.prototype.sumDetails.name, () => {
    it('sums details', () => {
      const transactions = getMockDetailedTransactions(2)
      const result = getMockL2CostsController({}).sumDetails(transactions)

      const expected: SummedL2Costs = {
        last24h: EMPTY_SUM,
        last7d: {
          total: costBreakdown(1),
          calldata: costBreakdown(1),
          compute: costBreakdown(1),
          overhead: costBreakdown([21_000 * 1, 1, 1]),
          blobs: undefined,
        },
        last30d: {
          total: costBreakdown(3),
          calldata: costBreakdown(3),
          compute: costBreakdown(3),
          overhead: costBreakdown([21_000 * 2, 3, 3]),
          blobs: undefined,
        },
        last90d: {
          total: costBreakdown(3),
          calldata: costBreakdown(3),
          compute: costBreakdown(3),
          overhead: costBreakdown([21_000 * 2, 3, 3]),
          blobs: undefined,
        },
      }

      expect(result).toEqual(expected)
    })

    it('sums details with blobs', () => {
      const transactions = getMockDetailedTransactions(2, true)
      const result = getMockL2CostsController({}).sumDetails(transactions)

      const expected: SummedL2Costs = {
        last24h: EMPTY_SUM,
        last7d: {
          total: costBreakdown(1),
          calldata: costBreakdown(1),
          compute: costBreakdown(1),
          overhead: costBreakdown([21_000 * 1, 1, 1]),
          blobs: costBreakdown(1),
        },
        last30d: {
          total: costBreakdown(3),
          calldata: costBreakdown(3),
          compute: costBreakdown(3),
          overhead: costBreakdown([21_000 * 2, 3, 3]),
          blobs: costBreakdown(3),
        },
        last90d: {
          total: costBreakdown(3),
          calldata: costBreakdown(3),
          compute: costBreakdown(3),
          overhead: costBreakdown([21_000 * 2, 3, 3]),
          blobs: costBreakdown(3),
        },
      }

      expect(result).toEqual(expected)
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
            [NOW_TO_FULL_HOUR.add(-1, 'hours').toNumber(), 3000],
            [NOW_TO_FULL_HOUR.add(-2, 'hours').toNumber(), 3100],
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
      timestamp: NOW_TO_FULL_HOUR.add(-1, 'hours'),
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
      timestamp: NOW_TO_FULL_HOUR.add(-2, 'hours'),
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

function getMockDetailedTransactions(
  amount: number,
  withBlobs: boolean = false,
): DetailedTransaction[] {
  return range(amount).map((i) => {
    let time = 0
    switch (i) {
      case 0:
        time = 1
        break
      case 1:
        time = 7
        break
      case 2:
        time = 30
        break
      case 3:
        time = 90
        break
      default:
        break
    }

    const base = {
      timestamp: NOW_TO_FULL_HOUR.add(-time, 'days'),
      calldataGasUsed: i + 1,
      computeGasUsed: i + 1,
      totalGas: i + 1,
      gasCost: i + 1,
      calldataGasCost: i + 1,
      computeGasCost: i + 1,
      calldataGasCostUsd: i + 1,
      computeGasCostUsd: i + 1,
      totalGasCost: i + 1,
      gasCostUsd: i + 1,
      totalGasCostUsd: i + 1,
      overheadGasUsed: 21_000 as const,
      totalOverheadGasCost: i + 1,
      totalOverheadGasCostUsd: i + 1,
      type: 2 as const,
    }
    if (withBlobs) {
      return {
        ...base,
        type: 3 as const,
        blobGasCost: i + 1,
        blobGasCostUsd: i + 1,
        blobGasUsed: i + 1,
      }
    }
    return base
  })
}

function costBreakdown(value: number | [number, number, number]) {
  if (isArray(value)) {
    return {
      gas: value[0],
      ethCost: value[1],
      usdCost: value[2],
    }
  }
  return {
    gas: value,
    ethCost: value,
    usdCost: value,
  }
}

const EMPTY_SUM = {
  total: costBreakdown(0),
  calldata: costBreakdown(0),
  compute: costBreakdown(0),
  overhead: costBreakdown(0),
  blobs: undefined,
}
