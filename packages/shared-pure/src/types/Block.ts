import type { Transaction } from './Transaction'

export interface Block {
  number: number
  hash: string
  timestamp: number
  transactions: Transaction[]
}
