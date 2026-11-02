import type { Block } from '@l2beat/shared-pure'
import type { CountedBlock, StatResults } from '../types'
import type { Counter } from './Counter'
import type { NameService } from './NameService'

export interface BlockClient {
  getLatestBlockNumber(): Promise<number>
  getBlockWithTransactions(blockNumber: number): Promise<Block>
}

export class ChainService {
  constructor(
    private readonly client: BlockClient,
    private readonly counter: Counter,
    private readonly nameService?: NameService,
  ) {}

  async getBlockNumber(): Promise<number> {
    return await this.client.getLatestBlockNumber()
  }

  async getBlock(blockNumber: number): Promise<CountedBlock> {
    const block = await this.client.getBlockWithTransactions(blockNumber)
    const countedBlock = this.counter.countForBlock(block)
    await this.nameService?.fillNames(countedBlock)
    return countedBlock
  }

  async analyzeBlocks(startBlock: number, count: number): Promise<StatResults> {
    const blocks: Block[] = []
    for (let i = 0; i < count; i++) {
      blocks.push(await this.client.getBlockWithTransactions(startBlock + i))
    }
    return this.counter.countForBlocks(blocks)
  }
}
