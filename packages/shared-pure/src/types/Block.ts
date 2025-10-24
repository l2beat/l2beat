import type { Transaction } from './Transaction.js'

export interface Block {
  number: number
  hash: string
  logsBloom: string
  timestamp: number
  transactions: Transaction[]
}
