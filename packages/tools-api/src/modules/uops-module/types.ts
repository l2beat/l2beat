import { v } from '@l2beat/validate'

export interface UopsChain {
  id: string
  name: string
  blockchainApi: {
    type: 'rpc' | 'starknet'
    url: string
    callsPerMinute?: number
  }
  etherscanChainId?: number
  explorerUrl?: string
}

export type UopsChainInfo = Pick<UopsChain, 'id' | 'name' | 'explorerUrl'>

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

export interface CountedTransaction {
  from: string
  type: string
  hash: string
  operationsCount: number
  details?: CountedOperation
  includesBatch?: boolean
  includesUnknown?: boolean
}

export interface CountedBlock {
  number: number
  timestamp: number
  hash: string
  status?: string
  transactions: CountedTransaction[]
}

export interface BlockRatio {
  number: number
  ratio: number
  includesBatch?: boolean
  includesUnknown?: boolean
}

export interface SmartAccountUsage {
  signature: string
  count: number
}

export interface StatResults {
  dateStart: Date
  dateEnd: Date
  numberOfTransactions: number
  numberOfOperations: number
  topBlocks: BlockRatio[]
  smartAccountUsage?: SmartAccountUsage[]
}

export interface Stats extends StatResults {
  startBlock: number
  endBlock: number
  numberOfBlocks: number
}

const BlockNumber = v
  .number()
  .check((n) => Number.isInteger(n) && n >= 0, 'Expected a block number')

const BlockCount = v
  .number()
  .check(
    (n) => Number.isInteger(n) && n > 0 && n <= STATS_BLOCK_COUNT_MAX,
    'Expected a block count',
  )

export const STATS_BLOCK_COUNT_MAX = 100

export type LatestRequest = v.infer<typeof LatestRequest>
export const LatestRequest = v.object({ chainId: v.string() })

export type BlockRequest = v.infer<typeof BlockRequest>
export const BlockRequest = v.object({
  chainId: v.string(),
  blockNumber: BlockNumber,
})

export type StatsRequest = v.infer<typeof StatsRequest>
export const StatsRequest = v.object({
  chainId: v.string(),
  count: BlockCount,
  lastFetched: BlockNumber.optional(),
})
