import { Logger } from '@l2beat/backend-tools'
import type {
  AggregatedL2CostRecord,
  Database,
  IndexerConfigurationRecord,
  L2CostPriceRecord,
  L2CostRecord,
} from '@l2beat/database'
import { createTrackedTxId, type TrackedTxId } from '@l2beat/shared'
import {
  EthereumAddress,
  Hash256,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { TrackedTxProject } from '../../../../../config/Config'
import type { IndexerService } from '../../../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../../../tools/uif/ids'
import {
  L2CostsAggregatorIndexer,
  type L2CostsAggregatorIndexerDeps,
  type ProjectL2Cost,
  type TrackedTxMultiplier,
} from './L2CostsAggregatorIndexer'

const MIN = UnixTime(1682899200)
const NOW = UnixTime(1714662000)

const MOCK_PROJECTS: TrackedTxProject[] = [
  {
    id: ProjectId('project1'),
    isArchived: false,
    configurations: [],
  },
  {
    id: ProjectId('project2'),
    isArchived: false,
    configurations: [
      {
        projectId: ProjectId('project2'),
        params: {
          formula: 'functionCall',
          address: EthereumAddress.random(),
          selector: '0x1234',
          signature: 'function foo()',
        },
        sinceTimestamp: 1000,
        id: 'p2-t1',
        type: 'liveness',
        subtype: 'batchSubmissions',
      },
      {
        projectId: ProjectId('project2'),
        params: {
          address: EthereumAddress.random(),
          formula: 'functionCall',
          selector: '0x1234',
          signature: 'function foo()',
        },
        sinceTimestamp: 1000,
        id: 'p2-t2',
        type: 'l2costs',
        subtype: 'batchSubmissions',
        costMultiplier: 0.6,
      },
    ],
  },
  {
    id: ProjectId('project3'),
    isArchived: false,
    configurations: [
      {
        projectId: ProjectId('project3'),
        params: {
          from: EthereumAddress.random(),
          to: EthereumAddress.random(),
          formula: 'transfer',
        },
        sinceTimestamp: 2000,
        id: 'p3-t1',
        type: 'l2costs',
        subtype: 'stateUpdates',
      },
    ],
  },
]

describe(L2CostsAggregatorIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
  describe(L2CostsAggregatorIndexer.prototype.update.name, () => {
    it('updates correctly', async () => {
      // 2023-05-01 00:01:00
      const txTime = MIN + 1 * UnixTime.MINUTE

      const trackedTxId = 'adaw'

      const txs = [
        tx(trackedTxId, {
          timestamp: txTime,
        }),
      ]

      const ethPrices: L2CostPriceRecord[] = [
        { timestamp: UnixTime.toStartOf(txTime, 'hour'), priceUsd: 2000 },
      ]

      const l2CostsRepositoryMock = mockObject<Database['l2Cost']>({
        getByTimeRange: mockFn().resolvesTo(txs),
      })

      const l2CostsPricesRepositoryMock = mockObject<Database['l2CostPrice']>({
        getByTimestampRange: mockFn().resolvesTo(ethPrices),
      })

      const indexerConfigurationRepositoryMock = mockObject<
        Database['indexerConfiguration']
      >({
        getByConfigurationIds: mockFn().resolvesTo([
          mockObject<IndexerConfigurationRecord>({
            id: txs[0].configurationId,
            properties: JSON.stringify({
              projectId: txs[0].projectId,
            }),
          }),
        ]),
      })

      const indexer = createIndexer({
        tags: { tag: 'update-correct' },
        db: mockObject<Database>({
          l2Cost: l2CostsRepositoryMock,
          l2CostPrice: l2CostsPricesRepositoryMock,
          indexerConfiguration: indexerConfigurationRepositoryMock,
          aggregatedL2Cost: mockObject<Database['aggregatedL2Cost']>({
            upsertMany: mockFn().resolvesTo(1),
          }),
        }),
      })

      const multipliers: TrackedTxMultiplier[] = [
        {
          id: trackedTxId,
          factor: 1,
        },
      ]
      indexer.findTxConfigsWithMultiplier = mockFn().returns(multipliers)

      // 2023-05-02 23:59:59
      const endOfFirstDay = NOW + 1 * UnixTime.DAY - 1
      indexer.shift = mockFn().returns([MIN, endOfFirstDay])

      // from 2023-05-01 00:00:00 to 2024-05-02 15:00:00
      const to = await indexer.update(MIN, NOW)

      // should get records between 2023-05-02 00:00:00 and 2023-05-02 23:59:59
      expect(l2CostsRepositoryMock.getByTimeRange).toHaveBeenOnlyCalledWith([
        MIN,
        endOfFirstDay,
      ])

      // should get prices records between 2023-05-02 00:00:00 and 2023-05-02 23:59:59
      expect(
        l2CostsPricesRepositoryMock.getByTimestampRange,
      ).toHaveBeenOnlyCalledWith(MIN, endOfFirstDay)

      // 2023-05-02 00:00:00
      expect(to).toEqual(endOfFirstDay + 1)
    })

    it('does nothing if range shorter than hour', async () => {
      // 2023-05-01 00:30:00
      const to = MIN + 30 * UnixTime.MINUTE

      const indexer = createIndexer({ tags: { tag: 'update-nothing' } })

      indexer.shift = mockFn().returns([MIN, MIN])

      // from 2023-05-01 00:00:00 to 2023-05-01 00:30:00
      const result = await indexer.update(MIN, to)

      // 2023-05-01 00:30:00
      expect(result).toEqual(to)
    })
  })

  describe(L2CostsAggregatorIndexer.prototype.aggregate.name, () => {
    it('aggregates correctly', () => {
      const indexer = createIndexer({ tags: { tag: 'aggregate' } })

      const mockedCalculate = mockFn().returns({
        totalGas: 1,
        totalGasEth: 1,
        totalGasUsd: 1,
        blobsGas: 1,
        blobsGasEth: 1,
        blobsGasUsd: 1,
        calldataGas: 1,
        calldataGasEth: 1,
        calldataGasUsd: 1,
        computeGas: 1,
        computeGasEth: 1,
        computeGasUsd: 1,
        overheadGas: 1,
        overheadGasEth: 1,
        overheadGasUsd: 1,
      })
      indexer.calculate = mockedCalculate

      const trackedTxId = 'adad'
      const multipliers: TrackedTxMultiplier[] = [
        {
          id: trackedTxId,
          factor: 1,
        },
      ]
      indexer.findTxConfigsWithMultiplier = mockFn().returns(multipliers)

      const txs = [
        tx(trackedTxId),
        tx(trackedTxId),
        tx(trackedTxId),
        tx(trackedTxId, {
          projectId: ProjectId('random2'),
        }),
        tx(trackedTxId, {
          timestamp: NOW + 1 * UnixTime.HOUR,
        }),
      ]

      const ethPrices: L2CostPriceRecord[] = [
        { timestamp: NOW, priceUsd: 2000 },
        { timestamp: NOW + 1 * UnixTime.HOUR, priceUsd: 2100 },
      ]

      const result = indexer.aggregate(txs, ethPrices)

      expect(result).toEqualUnsorted([
        {
          timestamp: NOW,
          projectId: ProjectId('random'),
          totalGas: 3,
          totalGasEth: 3,
          totalGasUsd: 3,
          blobsGas: 3,
          blobsGasEth: 3,
          blobsGasUsd: 3,
          calldataGas: 3,
          calldataGasEth: 3,
          calldataGasUsd: 3,
          computeGas: 3,
          computeGasEth: 3,
          computeGasUsd: 3,
          overheadGas: 3,
          overheadGasEth: 3,
          overheadGasUsd: 3,
        },
        {
          timestamp: NOW,
          projectId: ProjectId('random2'),
          totalGas: 1,
          totalGasEth: 1,
          totalGasUsd: 1,
          blobsGas: 1,
          blobsGasEth: 1,
          blobsGasUsd: 1,
          calldataGas: 1,
          calldataGasEth: 1,
          calldataGasUsd: 1,
          computeGas: 1,
          computeGasEth: 1,
          computeGasUsd: 1,
          overheadGas: 1,
          overheadGasEth: 1,
          overheadGasUsd: 1,
        },
        {
          timestamp: NOW + 1 * UnixTime.HOUR,
          projectId: ProjectId('random'),
          totalGas: 1,
          totalGasEth: 1,
          totalGasUsd: 1,
          blobsGas: 1,
          blobsGasEth: 1,
          blobsGasUsd: 1,
          calldataGas: 1,
          calldataGasEth: 1,
          calldataGasUsd: 1,
          computeGas: 1,
          computeGasEth: 1,
          computeGasUsd: 1,
          overheadGas: 1,
          overheadGasEth: 1,
          overheadGasUsd: 1,
        },
      ])
    })

    it('throws if multiplier missing', async () => {
      const indexer = createIndexer({
        tags: { tag: 'aggregate-throws-no-multiplier' },
      })

      const trackedTxId = 'dwadad'
      indexer.findTxConfigsWithMultiplier = mockFn().returns([])

      const txs = [tx(trackedTxId)]

      const ethPrices: L2CostPriceRecord[] = [
        { timestamp: NOW, priceUsd: 2000 },
      ]

      expect(() => indexer.aggregate(txs, ethPrices)).toThrow(
        `Assertion Error: Multiplier not found for ${trackedTxId}`,
      )
    })

    it('throws if prices not available', async () => {
      const indexer = createIndexer({
        tags: { tag: 'aggregate-throws-no-price' },
      })
      const txs = [tx('wada')]

      const ethPrices: L2CostPriceRecord[] = [
        { timestamp: NOW + 1 * UnixTime.HOUR, priceUsd: 2100 },
      ]

      expect(() => indexer.aggregate(txs, ethPrices)).toThrow(
        `Assertion Error: [${
          L2CostsAggregatorIndexer.name
        }]: ETH price not found: ${UnixTime.toStartOf(NOW, 'hour')}`,
      )
    })
  })

  describe(
    L2CostsAggregatorIndexer.prototype.getL2CostRecordsWithProjectId.name,
    () => {
      it('match records with projectIds', async () => {
        const id1 = createTrackedTxId.random()
        const id2 = createTrackedTxId.random()

        const project1 = ProjectId('project1')
        const project2 = ProjectId('project2')

        const txs = [
          mockObject<L2CostRecord>({
            timestamp: UnixTime(1),
            configurationId: id1,
          }),
          mockObject<L2CostRecord>({
            timestamp: UnixTime(2),
            configurationId: id1,
          }),
          mockObject<L2CostRecord>({
            timestamp: UnixTime(3),
            configurationId: id2,
          }),
        ]
        const l2CostsRepositoryMock = mockObject<Database['l2Cost']>({
          getByTimeRange: mockFn().resolvesTo(txs),
        })
        const indexerConfigurationRepositoryMock = mockObject<
          Database['indexerConfiguration']
        >({
          getByConfigurationIds: mockFn().resolvesTo([
            mockObject<IndexerConfigurationRecord>({
              id: id1,
              properties: JSON.stringify({
                projectId: project1,
              }),
            }),
            mockObject<IndexerConfigurationRecord>({
              id: id2,
              properties: JSON.stringify({
                projectId: project2,
              }),
            }),
          ]),
        })

        const indexer = createIndexer({
          tags: { tag: 'update-correct' },
          db: mockObject<Database>({
            l2Cost: l2CostsRepositoryMock,
            l2CostPrice: mockObject<Database['l2CostPrice']>(),
            indexerConfiguration: indexerConfigurationRepositoryMock,
            aggregatedL2Cost: mockObject<Database['aggregatedL2Cost']>({
              upsertMany: mockFn().resolvesTo(1),
            }),
          }),
        })

        const result = await indexer.getL2CostRecordsWithProjectId([
          0,
          UnixTime(4),
        ])

        expect(result).toEqual([
          mockObject<ProjectL2Cost>({
            timestamp: UnixTime(1),
            projectId: project1,
            configurationId: id1,
          }),
          mockObject<ProjectL2Cost>({
            timestamp: UnixTime(2),
            projectId: project1,
            configurationId: id1,
          }),
          mockObject<ProjectL2Cost>({
            timestamp: UnixTime(3),
            projectId: project2,
            configurationId: id2,
          }),
        ])
      })
    },
  )

  describe(
    L2CostsAggregatorIndexer.prototype.findTxConfigsWithMultiplier.name,
    () => {
      it('finds transactions with multipliers', () => {
        const indexer = createIndexer()
        const result = indexer.findTxConfigsWithMultiplier()

        expect(result).toEqual([
          { id: 'p2-t2', factor: 0.6 },
          { id: 'p3-t1', factor: 1 },
        ])
      })
    },
  )

  describe(L2CostsAggregatorIndexer.prototype.calculate.name, () => {
    const indexer = createIndexer({ tags: { tag: 'calculate' } })

    it('calculates correctly for non blob tx', () => {
      const result = indexer.calculate(tx('dwada'), 2000, 1)

      expect(result).toEqual({
        totalGas: 601201,
        totalGasEth: 0.009797870728835058,
        totalGasUsd: 19.595741457670115,
        blobsGas: null,
        blobsGasEth: null,
        blobsGasUsd: null,
        calldataGas: 450980,
        calldataGasEth: 0.007349694596798799,
        calldataGasUsd: 14.699389193597598,
        computeGas: 129221,
        computeGasEth: 0.0021059357077762597,
        computeGasUsd: 4.211871415552519,
        overheadGas: 21000,
        overheadGasEth: 0.00034224042425999996,
        overheadGasUsd: 0.6844808485199999,
      })
    })

    it('calculates correctly with multiplier', () => {
      const result = indexer.calculate(tx('dwadad'), 2000, 0.6)

      expect(result).toEqual({
        totalGas: 360721,
        totalGasEth: 0.00587872895616626,
        totalGasUsd: 11.75745791233252,
        blobsGas: null,
        blobsGasEth: null,
        blobsGasUsd: null,
        calldataGas: 270588,
        calldataGasEth: 0.0044098167580792795,
        calldataGasUsd: 8.819633516158559,
        computeGas: 77533,
        computeGasEth: 0.0012635679435309799,
        computeGasUsd: 2.52713588706196,
        overheadGas: 12600,
        overheadGasEth: 0.00020534425455599997,
        overheadGasUsd: 0.41068850911199994,
      })
    })

    it('calculates correctly for blob tx', () => {
      const result = indexer.calculate(txWithBlob(), 2000, 1)

      expect(result).toEqual({
        totalGas: 732273,
        totalGasEth: 0.00979787072896613,
        totalGasUsd: 19.59574145793226,
        blobsGas: 131072,
        blobsGasEth: 1.31072e-13,
        blobsGasUsd: 2.62144e-10,
        calldataGas: 450980,
        calldataGasEth: 0.007349694596798799,
        calldataGasUsd: 14.699389193597598,
        computeGas: 129221,
        computeGasEth: 0.0021059357077762597,
        computeGasUsd: 4.211871415552519,
        overheadGas: 21000,
        overheadGasEth: 0.00034224042425999996,
        overheadGasUsd: 0.6844808485199999,
      })
    })
  })

  describe(L2CostsAggregatorIndexer.prototype.shift.name, () => {
    const indexer = createIndexer({ tags: { tag: 'shift' } })

    it('shift to a single day if range longer than day', async () => {
      // 2023-05-01 00:00:01
      const from = MIN + 1
      // 2024-05-02 15:00:00
      const to = NOW

      const result = indexer.shift(from, to)

      // from 2023-05-01 00:00:00 to 2023-05-01 23:59:59
      expect(result).toEqual([
        UnixTime.toStartOf(from, 'hour'),
        UnixTime.toStartOf(from, 'hour') + 1 * UnixTime.DAY - 1,
      ])
    })

    it('shift to include full hours only', async () => {
      // 2023-05-01 00:0:01
      const from = MIN + 1
      // 2023-05-01 01:30:00
      const to = MIN + 1 * UnixTime.HOUR + 1 * UnixTime.MINUTE

      const result = indexer.shift(from, to)

      // from 2023-05-01 00:00:00 to 2023-05-01 00:59:59
      expect(result).toEqual([
        UnixTime.toStartOf(from, 'hour'),
        UnixTime.toStartOf(to, 'hour') - 1,
      ])
    })

    it('shift zero span if less than an hour', async () => {
      // 2023-05-01 00:0:01
      const from = MIN + 1
      // 2023-05-01 00:30:00
      const to = MIN + 1 * UnixTime.MINUTE

      const result = indexer.shift(from, to)

      // from 2023-05-01 00:00:00 to 2023-05-01 00:00:00
      expect(result).toEqual([
        UnixTime.toStartOf(from, 'hour'),
        UnixTime.toStartOf(from, 'hour'),
      ])
    })
  })
})

function createIndexer(deps?: Partial<L2CostsAggregatorIndexerDeps>) {
  return new L2CostsAggregatorIndexer({
    indexerService: mockObject<IndexerService>(),
    logger: Logger.SILENT,
    minHeight: 0,
    parents: [],
    db: mockObject<Database>({
      l2Cost: mockObject<Database['l2Cost']>(),
      l2CostPrice: mockObject<Database['l2CostPrice']>(),
      aggregatedL2Cost: mockObject<Database['aggregatedL2Cost']>({
        upsertMany: mockFn().resolvesTo(1),
      }),
      indexerConfiguration: mockObject<Database['indexerConfiguration']>(),
    }),
    projects: MOCK_PROJECTS,
    ...deps,
  })
}

function tx(
  configurationId: TrackedTxId,
  data?: Partial<AggregatedL2CostRecord>,
): ProjectL2Cost {
  return {
    timestamp: NOW,
    projectId: ProjectId('random'),
    gasUsed: 601201,
    gasPrice: 16297163060n,
    calldataLength: 40772,
    calldataGasUsed: 450980,
    blobGasPrice: null,
    blobGasUsed: null,
    configurationId,
    txHash: Hash256.random().toString(),
    ...data,
  }
}

function txWithBlob(data?: Partial<AggregatedL2CostRecord>): ProjectL2Cost {
  return {
    timestamp: NOW,
    projectId: ProjectId('random'),
    gasUsed: 601201,
    gasPrice: 16297163060n,
    calldataLength: 40772,
    calldataGasUsed: 450980,
    blobGasUsed: 131072,
    blobGasPrice: 1n,
    configurationId: 'wdada',
    txHash: Hash256.random().toString(),
    ...data,
  }
}
