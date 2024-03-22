import { L2CostsDetails, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'

import { Project } from '../../../../../model/Project'
import { IndexerStateRepository } from '../../../../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../../../../tools/Clock'
import { PriceRepository } from '../../../../tvl/repositories/PriceRepository'
import { TrackedTxsConfigsRepository } from '../../../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../../../types/TrackedTxId'
import {
  L2CostsRecord,
  L2CostsRepository,
} from '../repositories/L2CostsRepository'
import { DetailedTransaction, L2CostsController } from './L2CostsController'

const NOW = UnixTime.now()

describe(L2CostsController.name, () => {
  describe(L2CostsController.prototype.makeTransactionCalculations.name, () => {
    it('calculates transaction costs', async () => {
      const controller = getMockL2CostsController({})

      const results = await controller.makeTransactionCalculations(
        getMockL2CostRecords(),
      )

      const expected = [
        {
          timestamp: NOW.add(-1, 'hours'),
          calldataGasUsed: 27284,
          computeGasUsed: 370583,
          overheadGasUsed: 21000 as const,
          totalGas: 418867,
          gasCost: 0.01682842475182969,
          calldataGasCost: 0.0010961635577138359,
          computeGasCost: 0.014888563982856855,
          totalGasCost: 0.01682842475182969,
          totalOverheadGasCost: 0.0008436972112589999,
          gasCostUsd: 50.485274255489074,
          totalGasCostUsd: 50.485274255489074,
          calldataGasCostUsd: 3.288490673141508,
          computeGasCostUsd: 44.66569194857057,
          totalOverheadGasCostUsd: 2.5310916337769997,
          type: 2 as const,
        },
        {
          timestamp: NOW.add(-2, 'hours'),
          calldataGasUsed: 0,
          computeGasUsed: 0,
          overheadGasUsed: 21000 as const,
          totalGas: 807432,
          gasCost: 0.000618364191711,
          calldataGasCost: 0,
          computeGasCost: 0,
          totalGasCost: 0.000618364192497432,
          totalOverheadGasCost: 0.000618364191711,
          gasCostUsd: 1.9169289943041,
          totalGasCostUsd: 1.916928996742039,
          calldataGasCostUsd: 0,
          computeGasCostUsd: 0,
          totalOverheadGasCostUsd: 1.9169289943041,
          type: 3 as const,
          blobGasCost: 7.864320000000001e-13,
          blobGasUsed: 786432,
          blobGasCostUsd: 2.4379392e-9,
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
        totalCost: 30,
        totalGas: 30,
        totalCostUsd: 30,
        totalCalldataGas: 3,
        totalComputeGas: 3,
        totalBlobGas: 2,
        totalCalldataCost: 30,
        totalComputeCost: 3,
        totalBlobCost: 2,
        totalCalldataCostUsd: 300,
        totalComputeCostUsd: 3,
        totalBlobCostUsd: 2,
        totalOverheadGas: 42_000,
        totalOverheadCost: 420_020,
        totalOverheadCostUsd: 4_200_200,
      }

      expect(result).toEqual(expected)
    })

    it('sums details without blobs', () => {
      const transactions = getMockDetailedTransactions(1)
      const result = getMockL2CostsController({}).sumDetails(transactions)

      const expected: L2CostsDetails = {
        totalCalldataCost: 10,
        totalCalldataCostUsd: 100,
        totalCalldataGas: 1,
        totalComputeCost: 1,
        totalComputeCostUsd: 1,
        totalComputeGas: 1,
        totalCost: 10,
        totalCostUsd: 10,
        totalGas: 10,
        totalOverheadGas: 21_000,
        totalOverheadCost: 210_010,
        totalOverheadCostUsd: 2_100_100,
      }

      expect(result).toEqual(expected)
    })
  })
})

function getMockL2CostsController(params: {
  l2CostsRepository?: L2CostsRepository
  trackedTxsConfigsRepository?: TrackedTxsConfigsRepository
  priceRepository?: PriceRepository
  indexerStateRepository?: IndexerStateRepository
  projects?: Project[]
}) {
  const {
    l2CostsRepository,
    trackedTxsConfigsRepository,
    priceRepository,
    indexerStateRepository,
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
    indexerStateRepository ?? mockObject<IndexerStateRepository>({}),
    projects ?? [],
    mockObject<Clock>({}),
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
        gasUsed: 418867,
        gasPrice: 40176057679,
        calldataLength: 2084,
        calldataGasUsed: 27284,
      },
    },
    {
      txHash: '0x2',
      timestamp: NOW.add(-2, 'hours'),
      trackedTxId: TrackedTxId.unsafe('bbb'),
      data: {
        type: 3,
        gasUsed: 21000,
        gasPrice: 29445913891,
        blobGasPrice: 1,
        blobGasUsed: 786432,
        calldataGasUsed: 0,
        calldataLength: 0,
      },
    },
  ]
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
