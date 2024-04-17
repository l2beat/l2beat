import { mean } from 'lodash'
import { PublicClient } from 'viem'

import { Fee, Feenalyzer } from './types'

export class EVMFeenalyzer implements Feenalyzer {
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

function gasToGwei(gas: bigint | null | undefined): number {
  return parseFloat((Number(gas) * 1e-9).toFixed(9))
}

function median(arr: number[]) {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b)
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
}
