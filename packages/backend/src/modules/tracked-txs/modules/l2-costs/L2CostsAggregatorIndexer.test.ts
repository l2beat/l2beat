import { Logger } from '@l2beat/backend-tools'
import { AssetId, Hash256, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { IndexerService } from '../../../../tools/uif/IndexerService'
import { PriceRepository } from '../../../tvl/repositories/PriceRepository'
import { TrackedTxId } from '../../types/TrackedTxId'
import {
  L2CostsAggregatorIndexer,
  L2CostsAggregatorIndexerDeps,
} from './L2CostsAggregatorIndexer'
import {
  AggregatedL2CostsRecord,
  AggregatedL2CostsRepository,
} from './repositories/AggregatedL2CostsRepository'
import {
  L2CostsRecordWithProjectId,
  L2CostsRepository,
} from './repositories/L2CostsRepository'

const MIN = new UnixTime(1682899200)
const NOW = new UnixTime(1714662000)

describe(L2CostsAggregatorIndexer.name, () => {
  describe(L2CostsAggregatorIndexer.prototype.update.name, () => {
    it('clamps to day', async () => {
      const txs = [
        tx({
          timestamp: MIN.add(1, 'minutes'),
        }),
      ]

      const ethPrices = new Map([
        // 2023-05-01 00:00:00
        [MIN.toNumber(), 2000],
        // 2023-05-01 23:00:00
        [MIN.add(23, 'hours').toNumber(), 2000],
      ])

      const l2CostsRepository = mockObject<L2CostsRepository>({
        getWithProjectIdByTimeRange: mockFn().resolvesTo(txs),
      })

      const priceRepository = mockObject<PriceRepository>({
        findByTimestampRange: mockFn().resolvesTo(ethPrices),
      })

      const indexer = createIndexer({
        tag: 'update-day',
        l2CostsRepository,
        priceRepository,
      })

      // from 2023-05-01 00:00:00 to 2024-05-02 15:00:00
      const to = await indexer.update(MIN.toNumber(), NOW.toNumber())

      // should get records between 2023-05-02 00:00:00 and 2023-05-02 23:59:59
      expect(
        l2CostsRepository.getWithProjectIdByTimeRange,
      ).toHaveBeenOnlyCalledWith([MIN, new UnixTime(1682985599)])

      // should get prices records between 2023-05-02 00:00:00 and 2023-05-02 23:59:59
      expect(priceRepository.findByTimestampRange).toHaveBeenOnlyCalledWith(
        AssetId.ETH,
        MIN,
        new UnixTime(1682985599),
      )

      // 2023-05-02 00:00:00
      expect(to).toEqual(1682985600)
    })

    it('clamps to hour', async () => {
      // 2024-05-02 14:00:01
      const from = NOW.add(-1, 'hours').add(1, 'seconds')

      const txs = [
        tx({
          timestamp: from,
        }),
      ]

      const ethPrices = new Map([
        // 2024-05-02 14:00:00
        [from.add(-1, 'seconds').toNumber(), 2000],
      ])

      const l2CostsRepository = mockObject<L2CostsRepository>({
        getWithProjectIdByTimeRange: mockFn().resolvesTo(txs),
      })

      const priceRepository = mockObject<PriceRepository>({
        findByTimestampRange: mockFn().resolvesTo(ethPrices),
      })

      const indexer = createIndexer({
        tag: 'update-hour',
        l2CostsRepository,
        priceRepository,
      })

      // from 2024-05-02 14:00:01 to 2024-05-02 15:00:00
      const to = await indexer.update(from.toNumber(), NOW.toNumber())

      // should get records between 2024-05-02 14:00:00 and 2023-05-02 14:59:59
      expect(
        l2CostsRepository.getWithProjectIdByTimeRange,
      ).toHaveBeenOnlyCalledWith([
        from.add(-1, 'seconds'),
        NOW.add(-1, 'seconds'),
      ])

      // should get prices records between 2024-05-02 14:00:00 and 2023-05-02 14:59:59
      expect(priceRepository.findByTimestampRange).toHaveBeenOnlyCalledWith(
        AssetId.ETH,
        from.add(-1, 'seconds'),
        NOW.add(-1, 'seconds'),
      )

      // 2023-05-02 00:00:00
      expect(to).toEqual(NOW.toNumber())
    })

    it('returns from if prices not available', async () => {
      const txs = [
        tx({
          timestamp: MIN.add(1, 'minutes'),
        }),
      ]

      const ethPrices = new Map([
        // 2023-05-01 00:00:00
        [MIN.toNumber(), 2000],
      ])

      const l2CostsRepository = mockObject<L2CostsRepository>({
        getWithProjectIdByTimeRange: mockFn().resolvesTo(txs),
      })

      const priceRepository = mockObject<PriceRepository>({
        findByTimestampRange: mockFn().resolvesTo(ethPrices),
      })

      const indexer = createIndexer({
        tag: 'update',
        l2CostsRepository,
        priceRepository,
      })

      // from 2023-05-01 00:00:00 to 2024-05-02 15:00:00
      const to = await indexer.update(MIN.toNumber(), NOW.toNumber())

      // 2023-05-01 00:00:00
      expect(to).toEqual(MIN.toNumber())
    })
  })

  describe(L2CostsAggregatorIndexer.prototype.aggregate.name, () => {
    it('aggregates correctly', () => {
      const indexer = createIndexer({ tag: 'aggregate' })

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
        overheadGasEth: 1,
        overheadGasUsd: 1,
      })
      indexer.calculate = mockedCalculate

      const txs = [
        tx(),
        tx(),
        tx(),
        tx({
          projectId: ProjectId('random2'),
        }),
        tx({
          timestamp: NOW.add(1, 'hours'),
        }),
      ]
      const ethPrices = new Map([
        [NOW.toNumber(), 2000],
        [NOW.add(1, 'hours').toNumber(), 2100],
      ])
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
          overheadGasEth: 1,
          overheadGasUsd: 1,
        },
        {
          timestamp: NOW.add(1, 'hours'),
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
          overheadGasEth: 1,
          overheadGasUsd: 1,
        },
      ])
    })
  })

  describe(L2CostsAggregatorIndexer.prototype.calculate.name, () => {
    const indexer = createIndexer({ tag: 'calculate' })

    it('calculates correctly for non blob tx', () => {
      const result = indexer.calculate(tx(), 2000)
      expect(result).toEqual({
        totalGas: 601201,
        totalGasEth: 0.00979787072883506,
        totalGasUsd: 19.59574145767012,
        blobsGas: null,
        blobsGasEth: null,
        blobsGasUsd: null,
        calldataGas: 450980,
        calldataGasEth: 0.007349694596798801,
        calldataGasUsd: 14.699389193597602,
        computeGas: 129221,
        computeGasEth: 0.00210593570777626,
        computeGasUsd: 4.21187141555252,
        overheadGasEth: 0.00034224042426,
        overheadGasUsd: 0.68448084852,
      })
    })

    it('calculates correctly for blob tx', () => {
      const result = indexer.calculate(txWithBlob(), 2000)
      expect(result).toEqual({
        totalGas: 732273,
        totalGasEth: 0.009797870728966132,
        totalGasUsd: 19.595741457932263,
        blobsGas: 131072,
        blobsGasEth: 1.31072e-13,
        blobsGasUsd: 2.62144e-10,
        calldataGas: 450980,
        calldataGasEth: 0.007349694596798801,
        calldataGasUsd: 14.699389193597602,
        computeGas: 129221,
        computeGasEth: 0.00210593570777626,
        computeGasUsd: 4.21187141555252,
        overheadGasEth: 0.00034224042426,
        overheadGasUsd: 0.68448084852,
      })
    })
  })
})

function createIndexer(deps?: Partial<L2CostsAggregatorIndexerDeps>) {
  return new L2CostsAggregatorIndexer({
    indexerService: mockObject<IndexerService>(),
    logger: Logger.SILENT,
    minHeight: 0,
    parents: [],
    aggregatedL2CostsRepository: mockObject<AggregatedL2CostsRepository>({
      addMany: mockFn().resolvesTo(1),
    }),
    l2CostsRepository: mockObject<L2CostsRepository>(),
    priceRepository: mockObject<PriceRepository>(),
    ...deps,
  })
}

function tx(
  data?: Partial<AggregatedL2CostsRecord>,
): L2CostsRecordWithProjectId {
  return {
    timestamp: NOW,
    projectId: ProjectId('random'),
    data: {
      type: 2,
      gasUsed: 601201,
      gasPrice: 16297163060,
      calldataLength: 40772,
      calldataGasUsed: 450980,
    },
    trackedTxId: TrackedTxId.random(),
    txHash: Hash256.random().toString(),
    ...data,
  }
}

function txWithBlob(
  data?: Partial<AggregatedL2CostsRecord>,
): L2CostsRecordWithProjectId {
  return {
    timestamp: NOW,
    projectId: ProjectId('random'),
    data: {
      type: 3,
      gasUsed: 601201,
      gasPrice: 16297163060,
      calldataLength: 40772,
      calldataGasUsed: 450980,
      blobGasUsed: 131072,
      blobGasPrice: 1,
    },
    trackedTxId: TrackedTxId.random(),
    txHash: Hash256.random().toString(),
    ...data,
  }
}
