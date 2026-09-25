import type { Transaction } from './Transaction.js'

export interface Block {
  number: number
  hash: string
  logsBloom: string
  timestamp: number
  transactions: Transaction[]
  /**
   * Present on chains with asynchronous execution (Avalanche C-Chain since
   * Helicon / ACP-194). When set, `logsBloom` describes the receipts of the
   * blocks settled by this block, not the receipts of this block.
   */
  settledHeight?: number
}
