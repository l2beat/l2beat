export interface Fee {
  blockNumber: number
  minFeePerGas: bigint
  maxFeePerGas: bigint
  avgFeePerGas: bigint
  medianFeePerGas: bigint
  //   totalGasSpent: number
  //   totalGasCost: number
  //   baseFee?: number
}

export interface Feenalyzer {
  getData: (blockNumber: number) => Promise<Fee>
}
