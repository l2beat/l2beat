import { EVMTransaction } from '@l2beat/shared/build/clients/rpc/types'
import { StarknetGetBlockWithTxsResponseBodySchema } from '../../../../peripherals/starknet/schemas'

export interface AnalyzedBlock {
  transactionsLength: number
  uopsLength: number
}

export interface Analyzer {
  analyzeBlock(block: {
    transactions:
      | EVMTransaction[]
      | StarknetGetBlockWithTxsResponseBodySchema['result']['transactions']
  }): AnalyzedBlock
}
