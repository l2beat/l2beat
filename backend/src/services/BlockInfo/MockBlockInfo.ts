import { SimpleDate } from '../SimpleDate'
import { IBlockInfo } from './IBlockInfo'

const REFERENCE_TIMESTAMP = 1623153999
const REFERENCE_BLOCK = 12594332
const SECONDS_PER_BLOCK = 15

export class MockBlockInfo implements IBlockInfo {
  async getMaxBlock(date: SimpleDate) {
    const timestamp = date.addDays(1).toUnixTimestamp() - 1
    const timestampDiff = timestamp - REFERENCE_TIMESTAMP
    const blockDiff = Math.floor(timestampDiff / SECONDS_PER_BLOCK)
    return REFERENCE_BLOCK + blockDiff
  }

  async getBlockDate(block: number) {
    const blockDiff = block - REFERENCE_BLOCK
    const timestampDiff = blockDiff * SECONDS_PER_BLOCK
    return SimpleDate.fromUnixTimestamp(REFERENCE_TIMESTAMP + timestampDiff)
  }
}
