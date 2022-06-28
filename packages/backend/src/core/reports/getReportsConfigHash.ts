import { Hash256 } from '@l2beat/common'
import { createHash } from 'crypto'

import { ProjectInfo } from '../../model'

export function getReportsConfigHash(projects: ProjectInfo[]): Hash256 {
  const entries = []
  for (const { projectId, bridges } of projects) {
    for (const { tokens, address, sinceBlock } of bridges) {
      for (const token of tokens) {
        entries.push({
          projectId,
          holder: address,
          holderSinceBlock: sinceBlock,
          assetId: token.id,
          assetSinceBlock: token.sinceBlock,
        })
      }
    }
  }
  const string = JSON.stringify(entries.map((x) => JSON.stringify(x)).sort())
  return Hash256('0x' + createHash('sha256').update(string).digest('hex'))
}
