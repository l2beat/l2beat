import { Block } from "@l2beat/shared-pure"

export interface BlockClient {
  getBlockNumber(): Promise<number>
  getBlock(blockNumber: number): Promise<Block>
}
