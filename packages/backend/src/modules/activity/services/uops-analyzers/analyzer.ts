import { providers } from 'ethers'
import { Block } from './types'

export interface Analyzer {
  analyzeBlock(rpcBlock: {
    number: number
    timestamp: number
    hash: string
    transactions: providers.TransactionResponse[]
  }): Promise<Block>
}
