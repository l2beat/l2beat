import type { ConfigReader } from '@l2beat/discovery'
import { readFileSync, writeFileSync } from 'fs'

const HASH_LINE_PREFIX = 'Generated with discovered.json: '

export function updateDiffHistoryHash(
  configReader: ConfigReader,
  diffHistoryPath: string,
  projectName: string,
  chain: string,
) {
  let content = readFileSync(diffHistoryPath, 'utf-8')

  if (content.startsWith(HASH_LINE_PREFIX)) {
    content = content.split('\n').slice(2).join('\n')
  }

  const hash = configReader.readDiscoveryHash(projectName, chain)
  const hashLine = `${HASH_LINE_PREFIX}${hash.toString()}\n`

  writeFileSync(diffHistoryPath, `${hashLine}\n${content}`)
}
