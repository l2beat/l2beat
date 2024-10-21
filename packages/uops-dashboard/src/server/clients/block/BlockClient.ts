import { Block } from '@l2beat/shared'

export interface BlockClient {
  getBlockNumber(): Promise<number>
  getBlock(blockNumber: number): Promise<Block>
}
