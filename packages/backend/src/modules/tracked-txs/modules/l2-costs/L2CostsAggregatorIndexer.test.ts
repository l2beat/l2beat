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
    it('updates correctly', async () => {
      // 2023-05-01 00:01:00
      const txTime = MIN.add(1, 'minutes')

      const txs = [
        tx({
          timestamp: txTime,
        }),
      ]

      const ethPrices = new Map([[txTime.toStartOf('hour').toNumber(), 2000]])

      const l2CostsRepositoryMock = mockObject<L2CostsRepository>({
        getWithProjectIdByTimeRange: mockFn().resolvesTo(txs),
      })

      const priceRepositoryMock = mockObject<PriceRepository>({
        findByTimestampRange: mockFn().resolvesTo(ethPrices),
      })

      const indexer = createIndexer({
        tag: 'update-correct',
        l2CostsRepository: l2CostsRepositoryMock,
        priceRepository: priceRepositoryMock,
      })

      // 2023-05-02 23:59:59
      const endOfFirstDay = NOW.add(1, 'days').add(-1, 'seconds')
      indexer.shift = mockFn().returns([MIN, endOfFirstDay])

      // from 2023-05-01 00:00:00 to 2024-05-02 15:00:00
      const to = await indexer.update(MIN.toNumber(), NOW.toNumber())

      // should get records between 2023-05-02 00:00:00 and 2023-05-02 23:59:59
      expect(
        l2CostsRepositoryMock.getWithProjectIdByTimeRange,
      ).toHaveBeenOnlyCalledWith([MIN, endOfFirstDay])

      // should get prices records between 2023-05-02 00:00:00 and 2023-05-02 23:59:59
      expect(priceRepositoryMock.findByTimestampRange).toHaveBeenOnlyCalledWith(
        AssetId.ETH,
        MIN,
        endOfFirstDay,
      )

      // 2023-05-02 00:00:00
      expect(to).toEqual(endOfFirstDay.add(1, 'seconds').toNumber())
    })

    it('does nothing if range shorter than hour', async () => {
      // 2023-05-01 00:30:00
      const to = MIN.add(30, 'minutes')

      const indexer = createIndexer({
        tag: 'update-nothing',
      })

      indexer.shift = mockFn().returns([MIN, MIN])

      // from 2023-05-01 00:00:00 to 2023-05-01 00:30:00
      const result = await indexer.update(MIN.toNumber(), to.toNumber())

      // 2023-05-01 00:30:00
      expect(result).toEqual(to.toNumber())
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

    it('throws if prices not available', async () => {
      const indexer = createIndexer({ tag: 'aggregate-throw' })
      const txs = [tx()]
      const ethPrices = new Map([[NOW.add(1, 'hours').toNumber(), 2100]])

      expect(() => indexer.aggregate(txs, ethPrices)).toThrow(
        `Assertion Error: [${
          L2CostsAggregatorIndexer.name
        }]: ETH price not found: ${NOW.toStartOf('hour').toNumber()}`,
      )
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

  describe(L2CostsAggregatorIndexer.prototype.shift.name, () => {
    const indexer = createIndexer({ tag: 'shift' })

    it('shift to a single day if range longer than day', async () => {
      // 2023-05-01 00:00:01
      const from = MIN.add(1, 'seconds')
      // 2024-05-02 15:00:00
      const to = NOW

      const result = indexer.shift(from.toNumber(), to.toNumber())

      // from 2023-05-01 00:00:00 to 2023-05-01 23:59:59
      expect(result).toEqual([
        from.toStartOf('hour'),
        from.toStartOf('hour').add(1, 'days').add(-1, 'seconds'),
      ])
    })

    it('shift to include full hours only', async () => {
      // 2023-05-01 00:0:01
      const from = MIN.add(1, 'seconds')
      // 2023-05-01 01:30:00
      const to = MIN.add(1, 'hours').add(1, 'minutes')

      const result = indexer.shift(from.toNumber(), to.toNumber())

      // from 2023-05-01 00:00:00 to 2023-05-01 00:59:59
      expect(result).toEqual([
        from.toStartOf('hour'),
        to.toStartOf('hour').add(-1, 'seconds'),
      ])
    })

    it('shift zero span if less than an hour', async () => {
      // 2023-05-01 00:0:01
      const from = MIN.add(1, 'seconds')
      // 2023-05-01 00:30:00
      const to = MIN.add(1, 'minutes')

      const result = indexer.shift(from.toNumber(), to.toNumber())

      // from 2023-05-01 00:00:00 to 2023-05-01 00:00:00
      expect(result).toEqual([from.toStartOf('hour'), from.toStartOf('hour')])
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
