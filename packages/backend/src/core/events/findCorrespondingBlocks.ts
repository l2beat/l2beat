import { UnixTime } from '@l2beat/types'
import { sortBy } from 'lodash'

interface BlockInfo {
  timestamp: UnixTime
  blockNumber: bigint
}

export function findCorrespondingBlocks<T extends { blockNumber: number }>(
  blocks: BlockInfo[],
  logs: T[],
): { block: BlockInfo; value: T }[] {
  const sortedBlocks = sortBy(blocks, 'blockNumber')
  const sortedLogs = sortBy(logs, 'blockNumber')

  if (
    sortedLogs.length > 0 &&
    sortedLogs[0].blockNumber < sortedBlocks[0].blockNumber
  ) {
    throw new Error('Programmer error')
  }

  let blockIndex = 0
  const result = sortedLogs.map((log) => {
    for (; blockIndex < sortedBlocks.length; blockIndex++) {
      const curr = sortedBlocks[blockIndex]
      const next = sortedBlocks[blockIndex + 1] as BlockInfo | undefined

      if (!next) {
        if (log.blockNumber < curr.blockNumber) {
          throw new Error('Programmer error')
        }
        return {
          block: curr,
          value: log,
        }
      }

      if (next.blockNumber > log.blockNumber) {
        return {
          block: curr,
          value: log,
        }
      }
    }

    throw new Error('Programmer error')
  })

  return result
}
