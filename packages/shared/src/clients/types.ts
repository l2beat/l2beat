import type { Block, Log } from '@l2beat/shared-pure'
import type { SvmBlock } from './rpc-svm/types'

export interface BlockClient {
  getLatestBlockNumber(): Promise<number>
  getBlockWithTransactions(blockNumber: number | 'latest'): Promise<Block>
  /** Optional capability: batch-fetch block timestamps. Implementations are
   *  expected to chunk requests internally. */
  getBlockTimestamps?(blockNumbers: number[]): Promise<Map<number, number>>
  chain: string
}

export interface SvmBlockClient {
  getLatestSlotNumber(): Promise<number>
  getBlockWithTransactions(slot: number): Promise<SvmBlock | undefined>
  getSlotTime(slot: number): Promise<{ timestamp: number }>
  chain: string
}

export interface LogsClient {
  getLogs(
    from: number,
    to: number,
    addresses?: string[],
    topics?: string[],
  ): Promise<Log[]>
  chain: string
}
