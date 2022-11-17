import { assert } from '@l2beat/common'

import { Block, Rollup, Rollups, toBlock } from './schemas'

export function findLatestBlock(rollups: Rollups): Block {
  const latestMined = rollups.find((r): r is Rollup => r.mined !== null)
  assert(latestMined, 'No mined block found in first 10 blocks')
  return toBlock(latestMined)
}
