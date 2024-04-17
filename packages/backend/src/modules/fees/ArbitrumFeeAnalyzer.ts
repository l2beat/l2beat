import { mean } from 'lodash'

import { ViemRpcClient } from '../../peripherals/viem-rpc-client/ViemRpcClient'
import { Fee, FeeAnalyzer } from './types'
import { gasToGwei } from './utils/gasToGwei'
import { median } from './utils/median'

export class ArbitrumFeeAnalyzer implements FeeAnalyzer {
  constructor(private readonly rpc: ViemRpcClient) {}

  async getData(blockNumber: number): Promise<Fee> {
    const block = await this.rpc.getBlock({
      blockNumber: BigInt(blockNumber),
      includeTransactions: true,
    })

    const txPromises: Promise<number>[] = block.transactions.map(async (tx) => {
      const txReceipt = await this.rpc.getTransactionReceipt(
        // @ts-expect-error too lazy to fix
        tx.hash as `0x${string}`,
      )

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
