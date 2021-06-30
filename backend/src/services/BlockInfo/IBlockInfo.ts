import { SimpleDate } from '../../utils/SimpleDate'

export interface IBlockInfo {
  getMaxBlock(date: SimpleDate): Promise<number>
  getBlockDate(block: number): Promise<SimpleDate>
}
