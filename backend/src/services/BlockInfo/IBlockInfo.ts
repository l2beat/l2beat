import { SimpleDate } from '../../model'

export interface IBlockInfo {
  getMaxBlock(date: SimpleDate): Promise<number>
  getBlockDate(block: number): Promise<SimpleDate>
}
