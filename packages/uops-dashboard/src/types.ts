import type { Chain } from './chains'

export type UserOperationsApiRequest = {
  chainId: string
  blockNumber: number
}

export type LatestBlockApiRequest = {
  chainId: string
}

export type StatsApiRequest = {
  chainId: string
  count: number
  lastFetched?: number
}

export type ApiError = {
  message: string
  code?: number
}

export type CountedTransaction = {
  from: string
  type: string
  hash: string
  operationsCount: number
  details?: CountedOperation
  includesBatch?: boolean
  includesUnknown?: boolean
}

export type CountedBlock = {
  number: number
  timestamp: number
  hash: string
  status?: string
  transactions: CountedTransaction[]
}

export type BlockRatio = {
  number: number
  ratio: number
  includesBatch?: boolean
  includesUnknown?: boolean
}

export type BlockWithChain = CountedBlock & { chain: Chain }

export interface CountedOperation {
  id: string
  level: number
  methodSelector: string
  methodSignature?: string
  methodName?: string
  contractAddress?: string
  contractName?: string
  count: number
  children: CountedOperation[]
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

export type StatsWithChain = Stats & { chain: Chain }
