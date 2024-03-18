import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { range } from 'lodash'

import { Project } from '../../../model/Project'
import { IndexerStateRepository } from '../../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../../tools/Clock'
import { PriceRepository } from '../../tvl/repositories/PriceRepository'
import { L2CostsRepository } from '../repositories/L2CostsRepository'
import { DetailedTransaction, L2CostsController } from './L2CostsController'

const NOW = UnixTime.now()

describe(L2CostsController.name, () => {
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
    priceRepository ?? mockObject<PriceRepository>({}),
    indexerStateRepository ?? mockObject<IndexerStateRepository>({}),
    projects ?? [],
    mockObject<Clock>({}),
  )
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
