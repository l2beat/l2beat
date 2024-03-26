import {
  EthereumAddress,
  L2CostsDetails,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'

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
import { DetailedTransaction, L2CostsController } from './L2CostsController'

const NOW = UnixTime.now()

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
          timestamp: NOW.add(-1, 'hours'),
        }),
        mockObject<DetailedTransaction>({ timestamp: NOW.add(-2, 'hours') }),
      ])

      controller.sumDetails = mockFn().returns(mockObject<L2CostsDetails>({}))

      const result = await controller.getL2Costs()

      expect(
        l2CostsRepository.getByProjectAndTimeRange,
      ).toHaveBeenNthCalledWith(1, MOCK_PROJECTS[1].projectId, [
        NOW.add(-90, 'days').toStartOf('hour'),
        NOW.toStartOf('hour'),
      ])
      expect(
        l2CostsRepository.getByProjectAndTimeRange,
      ).toHaveBeenNthCalledWith(2, MOCK_PROJECTS[2].projectId, [
        NOW.add(-90, 'days').toStartOf('hour'),
        NOW.toStartOf('hour'),
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
          timestamp: NOW.add(-1, 'hours'),
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
          timestamp: NOW.add(-2, 'hours'),
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

      const expected: L2CostsDetails = {
        total: {
          gas: 30,
          ethCost: 30,
          usdCost: 30,
        },
        calldata: {
          gas: 3,
          ethCost: 30,
          usdCost: 300,
        },
        compute: {
          gas: 3,
          ethCost: 3,
          usdCost: 3,
        },
        overhead: {
          gas: 42_000,
          ethCost: 420_020,
          usdCost: 4_200_200,
        },
        blobs: {
          gas: 2,
          ethCost: 2,
          usdCost: 2,
        },
      }

      expect(result).toEqual(expected)
    })

    it('sums details without blobs', () => {
      const transactions = getMockDetailedTransactions(1)
      const result = getMockL2CostsController({}).sumDetails(transactions)

      const expected: L2CostsDetails = {
        total: {
          gas: 10,
          ethCost: 10,
          usdCost: 10,
        },
        calldata: {
          gas: 1,
          ethCost: 10,
          usdCost: 100,
        },
        compute: {
          gas: 1,
          ethCost: 1,
          usdCost: 1,
        },
        overhead: {
          gas: 21_000,
          ethCost: 210_010,
          usdCost: 2_100_100,
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
            [NOW.add(-1, 'hours').toStartOf('hour').toNumber(), 3000],
            [NOW.add(-2, 'hours').toStartOf('hour').toNumber(), 3100],
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
      timestamp: NOW.add(-1, 'hours'),
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
      timestamp: NOW.add(-2, 'hours'),
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

function getMockDetailedTransactions(amount: number): DetailedTransaction[] {
  return range(amount).map((i) => {
    const base = {
      timestamp: NOW.add(-i, 'hours'),
      calldataGasUsed: i + 1,
      computeGasUsed: i + 1,
      totalGas: (i + 1) * 10,
      gasCost: (i + 1) * 100,
      calldataGasCost: (i + 1) * 10,
      computeGasCost: i + 1,
      calldataGasCostUsd: (i + 1) * 100,
      computeGasCostUsd: i + 1,
      totalGasCost: (i + 1) * 10,
      gasCostUsd: (i + 1) * 100,
      totalGasCostUsd: (i + 1) * 10,
      overheadGasUsed: 21_000 as const,
      totalOverheadGasCost: (21_000 + 1) * 10,
      totalOverheadGasCostUsd: (21_000 + 1) * 100,
    }
    if (i % 2 === 0) {
      return {
        ...base,
        type: 2,
      }
    } else {
      return {
        ...base,
        type: 3,
        blobGasCost: i + 1,
        blobGasCostUsd: i + 1,
        blobGasUsed: i + 1,
      }
    }
  })
}
