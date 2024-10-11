export type ApiError = {
  message: string
  code?: number
}

export type Transaction = {
  type: string
  hash: string
  operationsCount: number
  details?: CountedOperation
  includesBatch?: boolean
  includesUnknown?: boolean
}

export type Block = {
  number: number
  timestamp: number
  hash: string
  status: string
  transactions: Transaction[]
}

export type BlockRatio = {
  number: number
  ratio: number
  includesBatch?: boolean
  includesUnknown?: boolean
}

export interface CountedOperation {
  id: string
  level: number
  methodSelector: string
  methodSignature?: string
  methodName?: string
  contractAddress: string
  contractName?: string
  count: number
  children: CountedOperation[]
}

export type Operation = StaticOperation | RecursiveOperation

export interface StaticOperation {
  type: 'static'
  name: string
  count: number
}

export interface RecursiveOperation {
  type: 'recursive'
  calldata: string
  to: string
}

export interface Method {
  name: string
  contractName?: string
  selector: string
  signature: string
  count(calldata: string): Operation[]
}

export type StatParams = {
  startBlock: number
  endBlock: number
  numberOfBlocks: number
}

export type StatResults = {
  dateStart: Date
  dateEnd: Date
  numberOfTransactions: number
  numberOfOperations: number
  topBlocks: BlockRatio[]
  smartAccountUsage?: { signature: string; count: number }[]
}

export type Stats = StatParams & StatResults
