import { UnixTime } from '@l2beat/shared-pure'

export interface Fee {
  blockNumber: number
  minFeePerGas: number
  maxFeePerGas: number
  avgFeePerGas: number
  medianFeePerGas: number
  //   totalGasSpent: number
  //   totalGasCost: number
  //   baseFee?: number
}

export interface FeeDataPoint {
  timestamp: UnixTime
  gasPriceGwei: number
  gasPriceUsd: number
}

export interface FeeAnalyzer {
  getData: (blockNumber: number) => Promise<Fee>
}
