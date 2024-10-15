import type { Chain } from '@/chains'
import type { Block, StatResults } from '@/types'
import type { Analyzer } from '../analyzers/analyzer'
import { RpcAnalyzer } from '../analyzers/rpc/RpcAnalyzer'
import { StarknetAnalyzer } from '../analyzers/starknet/StarknetAnalyzer'
import type { DB } from '../db/db'

export class ChainService {
  private readonly analyzer: Analyzer

  constructor(chain: Chain, db: DB) {
    switch (chain.id) {
      case 'starknet':
        this.analyzer = new StarknetAnalyzer(chain)
        break
      case 'base':
      case 'ethereum':
      case 'xai':
      case 'taiko':
      case 'arbitrum':
      case 'gravity':
      case 'optimism': {
        this.analyzer = new RpcAnalyzer(chain, db)
        break
      }
      default:
        throw new Error(`Unsupported chain: ${chain.id}`)
    }
  }

  async getBlockNumber(): Promise<number> {
    return await this.analyzer.getBlockNumber()
  }

  async getBlock(blockNumber: number): Promise<Block> {
    return await this.analyzer.analyzeBlock(blockNumber)
  }

  async analyzeBlocks(startBlock: number, count: number): Promise<StatResults> {
    return await this.analyzer.analyzeBlocks(startBlock, count)
  }
}
