import { UnixTime } from '@l2beat/types'

export interface Block {
  number: number
  timestamp: number
}

export async function getBlockAtOrBefore<T extends Block>(
  timestamp: UnixTime,
  start: number,
  end: number,
  getBlock: (number: number) => Promise<T>,
): Promise<T> {
  let [startBlock, endBlock]: T[] = await Promise.all([
    getBlock(start),
    getBlock(end),
  ])

  while (startBlock.number + 1 < endBlock.number) {
    const mid =
      startBlock.number + Math.floor((endBlock.number - startBlock.number) / 2)
    const midBlock = await getBlock(Number(mid))
    const midTimestamp = new UnixTime(midBlock.timestamp)
    if (midTimestamp.lte(timestamp)) {
      startBlock = midBlock
    } else {
      endBlock = midBlock
    }
  }

  return startBlock
}
