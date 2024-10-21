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
