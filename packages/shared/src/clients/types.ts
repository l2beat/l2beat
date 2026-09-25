import type { Block, Log, UnixTime } from '@l2beat/shared-pure'
import type { SvmBlock } from './rpc-svm/types'

export interface BlockClient {
  getLatestBlockNumber(): Promise<number>
  getBlockWithTransactions(blockNumber: number | 'latest'): Promise<Block>
  /** Optional capability: fetch a block timestamp without transaction bodies.
   *  Optional only for compatibility with clients that have no header-only
   *  call (Fuel, Starknet); RpcClient, which backs every EVM chain, implements
   *  it, so BlockProvider timestamp probes use it wherever it matters. */
  getBlockTimestamp?(blockNumber: number): Promise<number>
  /** Optional capability: batch-fetch block timestamps. Implementations are
   *  expected to chunk requests internally. */
  getBlockTimestamps?(blockNumbers: number[]): Promise<Map<number, number>>
  /** Optional capability: fetch a transaction receipt. Block sync uses it to
   *  confirm that a block genuinely has no logs on chains where the header
   *  logsBloom does not describe the block itself (see Block.settledHeight). */
  getTransactionReceipt?(txHash: string): Promise<TransactionReceipt>
  chain: string
}

export interface TransactionReceipt {
  blockHash?: string
  logs: unknown[]
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

/**
 * eth_getLogs topic filter: entries are positional starting at topic0, an
 * array entry matches any of its values at that position and null matches
 * anything at that position.
 */
export type LogsTopicFilter = (string | string[] | null)[]

export interface LogsClient {
  getLogs(
    from: number,
    to: number,
    addresses?: string[],
    topics?: LogsTopicFilter,
  ): Promise<Log[]>
  chain: string
}
