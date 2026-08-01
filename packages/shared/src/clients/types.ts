import type { Block, Log, UnixTime } from '@l2beat/shared-pure'
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

export const AZTEC_MAX_BLOCKS_PER_REQUEST = 50

export interface AztecBlockHeader {
  number: number
  timestamp: UnixTime
}

export interface AztecBlock extends AztecBlockHeader {
  txEffectsCount: number
}

export interface AztecBlockClient {
  getLatestBlockNumber(): Promise<number>
  getBlocks(start: number, limit: number): Promise<AztecBlock[]>
  getBlockHeaders(start: number, limit: number): Promise<AztecBlockHeader[]>
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
