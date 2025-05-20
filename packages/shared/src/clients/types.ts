import type { Block } from '@l2beat/shared-pure'
import type { SvmBlock } from './rpc-svm/types'

export interface BlockClient {
  getLatestBlockNumber(): Promise<number>
  getBlockWithTransactions(blockNumber: number | 'latest'): Promise<Block>
  chain: string
}

export interface SvmBlockClient {
  getLatestSlotNumber(): Promise<number>
  getBlockWithTransactions(slot: number): Promise<SvmBlock | undefined>
  getSlotTime(slot: number): Promise<{ timestamp: number }>
  chain: string
}
