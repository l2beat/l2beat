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
  name: string
  fromBlock: number
  toBlock: number
  getData: (blockNumber: number) => Promise<Fee>
}
