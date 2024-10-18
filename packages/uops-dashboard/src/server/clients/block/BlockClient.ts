import { Block } from '../../../types'

export interface BlockClient {
  getBlockNumber(): Promise<number>
  getBlock(blockNumber: number): Promise<Block>
}
