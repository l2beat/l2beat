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

export interface Feenalyzer {
  getData: (blockNumber: number) => Promise<Fee>
}
