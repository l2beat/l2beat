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
