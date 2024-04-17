import { mean } from 'lodash'
import { PublicClient } from 'viem'

import { Fee, Feenalyzer } from './types'
import { gasToGwei } from './utils/gasToGwei'
import { median } from './utils/median'

export class ArbitrumFeenalyzer implements Feenalyzer {
  constructor(private readonly rpc: PublicClient) {}

  async getData(blockNumber: number): Promise<Fee> {
    const block = await this.rpc.getBlock({
      blockNumber: BigInt(blockNumber),
      includeTransactions: true,
    })

    const txPromises: Promise<number>[] = block.transactions.map(async (tx) => {
      const txReceipt = await this.rpc.getTransactionReceipt({
        hash: tx.hash,
      })
      return gasToGwei(txReceipt.effectiveGasPrice)
    })

    const allGasFees = await Promise.all(txPromises)

    return {
      blockNumber: Number(block.number),
      avgFeePerGas: mean(allGasFees),
      maxFeePerGas: Math.max(...allGasFees),
      minFeePerGas: Math.min(...allGasFees),
      medianFeePerGas: median(allGasFees),
    }
  }
}
