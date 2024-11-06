import { Transaction } from './Transaction'

export interface Block {
  number: number
  hash: 'UNSUPPORTED' | (string & {})
  timestamp: number
  transactions: Transaction[]
}
