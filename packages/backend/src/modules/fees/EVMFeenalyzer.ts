import { notUndefined } from '@l2beat/shared-pure'
import { PublicClient } from 'viem'

import { Fee, Feenalyzer } from './types'

export class EVMFeenalyzer implements Feenalyzer {
  constructor(private readonly rpc: PublicClient) {}

  async getData(blockNumber: number): Promise<Fee> {
    const block = await this.rpc.getBlock({
      blockNumber: BigInt(blockNumber),
      includeTransactions: true,
    })

    const allGasFees = block.transactions
      .map((tx) => tx.gasPrice)
      .filter(notUndefined)

    return {
      blockNumber,
      avgFeePerGas: avg(allGasFees),
      maxFeePerGas: max(allGasFees),
      minFeePerGas: min(allGasFees),
      medianFeePerGas: median(allGasFees),
    }
  }
}

function avg(arr: bigint[]) {
  return arr.reduce((a, b) => a + b, 0n) / BigInt(arr.length)
}

function max(arr: bigint[]) {
  let m = 0n
  for (const a of arr) {
    if (a > m) {
      m = a
    }
  }
  return m
}

function min(arr: bigint[]) {
  let m = arr[0]
  for (const a of arr) {
    if (a < m) {
      m = a
    }
  }
  return m
}

function median(arr: bigint[]) {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => Number(a) - Number(b))

  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2n
}
