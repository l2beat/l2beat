import { BlockscoutClient, EtherscanClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { PublicClient } from 'viem'

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

export type AnalyzerType = 'evm' | 'arbitrum'

export interface FeeAnalyzerConfig {
  name: string
  rpc: PublicClient
  blockTimestampClient: EtherscanClient | BlockscoutClient
  type: AnalyzerType
}
