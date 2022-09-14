import { UnixTime } from '@l2beat/types'
import { sortBy } from 'lodash'

interface BlockInfo {
  timestamp: UnixTime
  blockNumber: bigint
}

export function findCorrespondingBlocks<T extends { blockNumber: number }>(
  _blocks: BlockInfo[],
  _logs: T[],
): { block: BlockInfo; value: T }[] {
  const blocks = sortBy(_blocks, 'blockNumber')
  const logs = sortBy(_logs, 'blockNumber')

  if (logs.length > 0 && logs[0].blockNumber < blocks[0].blockNumber) {
    throw new Error('Programmer error')
  }

  let blockIndex = 0
  const result = logs.map((log) => {
    for (; blockIndex < blocks.length; blockIndex++) {
      const curr = blocks[blockIndex]
      const next = blocks[blockIndex + 1] as BlockInfo | undefined

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
