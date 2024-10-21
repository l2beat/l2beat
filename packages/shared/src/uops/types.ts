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

export type Transaction = GenericTransaction | StarknetTransaction

export type GenericTransaction = {
  hash: string
  data: string
  to?: string
}

export type StarknetTransaction = {
  hash: string
  data: string[]
  type: string
  to?: string
}
