import { providers } from 'ethers'
import { StarknetGetBlockWithTxsResponseBodySchema } from '../../../../peripherals/starknet/schemas'

export interface AnalyzedBlock {
  transactionsLength: number
  uopsLength: number
}

export interface Analyzer {
  analyzeBlock(block: {
    transactions:
      | providers.TransactionResponse[]
      | StarknetGetBlockWithTxsResponseBodySchema['result']['transactions']
  }): AnalyzedBlock
}

export type Operation = StaticOperation | RecursiveOperation

export interface StaticOperation {
  type: 'static'
  count: number
}

export interface RecursiveOperation {
  type: 'recursive'
  calldata: string
}

export interface Method {
  selector: string
  count(calldata: string): Operation[]
}
