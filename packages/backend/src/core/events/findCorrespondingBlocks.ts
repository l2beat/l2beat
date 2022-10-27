import { UnixTime } from '@l2beat/types'
import { sortBy } from 'lodash'

import { assert } from '../../tools/assert'

interface BlockInfo {
  timestamp: UnixTime
  blockNumber: number
}

export function findCorrespondingBlocks<T extends { blockNumber: number }>(
  blocks: BlockInfo[],
  logs: T[],
): { block: BlockInfo; value: T }[] {
  const sortedBlocks = sortBy(blocks, 'blockNumber')
  const sortedLogs = sortBy(logs, 'blockNumber')

  assert(
    !(
      sortedLogs.length > 0 &&
      sortedLogs[0].blockNumber < sortedBlocks[0].blockNumber
    ),
  )

  let blockIndex = 0
  const result = sortedLogs.map((log) => {
    for (; blockIndex < sortedBlocks.length; blockIndex++) {
      const curr = sortedBlocks[blockIndex]
      const next = sortedBlocks[blockIndex + 1] as BlockInfo | undefined

      if (!next) {
        assert(log.blockNumber >= curr.blockNumber)

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

    assert(false)
  })

  return result
}
