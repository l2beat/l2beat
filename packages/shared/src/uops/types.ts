import { EVMTransaction } from '../clients'

export type Operation = StaticOperation | RecursiveOperation

export interface StaticOperation {
  type: 'static'
  name?: string
  count: number
}

export interface RecursiveOperation {
  type: 'recursive'
  calldata: string
  to?: string
}

export interface Method {
  name?: string
  contractName?: string
  selector: string
  signature?: string
  count(calldata: string): Operation[]
}

export type Block = {
  number: number
  timestamp: number
  hash: string
  status?: string
  transactions: Transaction[]
}

export type Transaction = EVMTransaction | StarknetTransaction

export type StarknetTransaction = {
  hash: string
  data: string[]
  type: string
  to?: string
}
