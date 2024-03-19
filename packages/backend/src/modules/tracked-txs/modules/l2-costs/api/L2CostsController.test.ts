import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'

import { Project } from '../../../../../model/Project'
import { IndexerStateRepository } from '../../../../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../../../../tools/Clock'
import { PriceRepository } from '../../../../tvl/repositories/PriceRepository'
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
          calldataGasUsed: 100,
          computeGasUsed: -21000,
          totalGas: 100,
          gasCost: 100,
          calldataGasCost: 100,
          computeGasCost: -21000,
          totalGasCost: 100,
          gasCostUsd: 300000,
          totalGasCostUsd: 300000,
          calldataGasCostUsd: 300000,
          computeGasCostUsd: -63000000,
          type: 2 as const,
        },
        {
          timestamp: NOW.add(-2, 'hours'),
          calldataGasUsed: 100,
          computeGasUsed: -21000,
          totalGas: 200,
          gasCost: 100,
          calldataGasCost: 100,
          computeGasCost: -21000,
          totalGasCost: 200,
          gasCostUsd: 310000,
          totalGasCostUsd: 620000,
          calldataGasCostUsd: 310000,
          computeGasCostUsd: -65100000,
          type: 3 as const,
          blobGasCost: 100,
          blobGasUsed: 100,
          blobGasCostUsd: 310000,
        },
      ]
      expect(results).toEqualUnsorted(expected)
    })
  })

  describe(L2CostsController.prototype.sumDetails.name, () => {
    it('sums details', () => {
      const transactions = getMockDetailedTransactions(2)
      const result = getMockL2CostsController({}).sumDetails(transactions)

      const expected = {
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
      }

      expect(result).toEqual(expected)
    })

    it('sums details without blobs', () => {
      const transactions = getMockDetailedTransactions(1)
      const result = getMockL2CostsController({}).sumDetails(transactions)

      const expected = {
        totalCalldataCost: 10,
        totalCalldataCostUsd: 100,
        totalCalldataGas: 1,
        totalComputeCost: 1,
        totalComputeCostUsd: 1,
        totalComputeGas: 1,
        totalCost: 10,
        totalCostUsd: 10,
        totalGas: 10,
      }

      expect(result).toEqual(expected)
    })
  })
})

function getMockL2CostsController(params: {
  l2CostsRepository?: L2CostsRepository
  priceRepository?: PriceRepository
  indexerStateRepository?: IndexerStateRepository
  projects?: Project[]
}) {
  const {
    l2CostsRepository,
    priceRepository,
    indexerStateRepository,
    projects,
  } = params

  return new L2CostsController(
    l2CostsRepository ?? mockObject<L2CostsRepository>({}),
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
        gasUsed: 100,
        gasPrice: 1,
        calldataLength: 100,
        calldataGasUsed: 100,
      },
    },
    {
      txHash: '0x2',
      timestamp: NOW.add(-2, 'hours'),
      trackedTxId: TrackedTxId.unsafe('bbb'),
      data: {
        type: 3,
        gasUsed: 100,
        gasPrice: 1,
        calldataLength: 100,
        calldataGasUsed: 100,
        blobGasPrice: 1,
        blobGasUsed: 100,
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
