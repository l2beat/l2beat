import { Hash256 } from '@l2beat/types'
import { createHash } from 'crypto'

import { ProjectInfo } from '../model'

const FORCED_RESYNC_ID = 0

export function getConfigHash(
  projects: ProjectInfo[],
  forcedResyncId = FORCED_RESYNC_ID,
): string {
  const entries = []
  for (const { projectId, escrows } of projects) {
    for (const { tokens, address, sinceTimestamp } of escrows) {
      for (const token of tokens) {
        entries.push({
          projectId,
          holder: address,
          holderSinceTimestamp: sinceTimestamp,
          assetId: token.id,
          assetSinceTimestamp: token.sinceTimestamp,
        })
      }
    }
  }
  const string = JSON.stringify(entries.map((x) => JSON.stringify(x)).sort())
  const hash = Hash256('0x' + createHash('sha256').update(string).digest('hex'))
  return `${hash.toString()}-${forcedResyncId}`
}
