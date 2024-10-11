import { providers } from 'ethers'

export interface AnalyzedBlock {
  transactionsLength: number
  uopsLength: number
}

export interface Analyzer {
  analyzeBlock(rpcBlock: {
    number: number
    timestamp: number
    hash: string
    transactions: providers.TransactionResponse[]
  }): Promise<AnalyzedBlock>
}
