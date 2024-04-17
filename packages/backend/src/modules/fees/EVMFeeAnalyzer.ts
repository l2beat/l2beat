import { mean } from 'lodash'
import { PublicClient } from 'viem'

import { Fee, FeeAnalyzer } from './types'
import { gasToGwei } from './utils/gasToGwei'
import { median } from './utils/median'

export class EVMFeeAnalyzer implements FeeAnalyzer {
  constructor(private readonly rpc: PublicClient) {}

  async getData(blockNumber: number): Promise<Fee> {
    const block = await this.rpc.getBlock({
      blockNumber: BigInt(blockNumber),
      includeTransactions: true,
    })

    const allGasFees = block.transactions.map((tx) => gasToGwei(tx.gasPrice))

    return {
      blockNumber,
      avgFeePerGas: mean(allGasFees),
      maxFeePerGas: Math.max(...allGasFees),
      minFeePerGas: Math.min(...allGasFees),
      medianFeePerGas: median(allGasFees),
    }
  }
}
