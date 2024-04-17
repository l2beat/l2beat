import { mean } from 'lodash'
import { PublicClient } from 'viem'

import { ViemRpcClient } from '../../peripherals/viem-rpc-client/ViemRpcClient'
import { Fee, FeeAnalyzer } from './types'
import { gasToGwei } from './utils/gasToGwei'
import { median } from './utils/median'

export class EVMFeeAnalyzer implements FeeAnalyzer {
  constructor(private readonly rpc: PublicClient | ViemRpcClient) {}

  async getData(blockNumber: number): Promise<Fee> {
    let currentBlockNumber = blockNumber

    while (true) {
      const block = await this.rpc.getBlock({
        blockNumber: BigInt(currentBlockNumber),
        includeTransactions: true,
      })

      if (block.transactions.length === 0) {
        currentBlockNumber--
        continue
      }

      // @ts-expect-error too lazy to fix this
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
}
