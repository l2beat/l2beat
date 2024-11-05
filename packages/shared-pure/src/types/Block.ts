import { Transaction } from "./Transaction"

export interface Block {
  number: number
  timestamp?: number
  transactions: Transaction[]
}
