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

export interface FeeAnalyzer {
  getData: (blockNumber: number) => Promise<Fee>
}
