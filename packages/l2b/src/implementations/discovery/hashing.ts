import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import { ConfigReader } from '@l2beat/discovery'
import { Hash160 } from '@l2beat/shared-pure'

const HASH_LINE_PREFIX = 'Generated with discovered.json: '

export function getDiscoveryHash(projectName: string, chain: string): Hash160 {
  const configReader = new ConfigReader()
  const curDiscovery = configReader.readDiscovery(projectName, chain)
  const hasher = createHash('sha1')
  hasher.update(JSON.stringify(curDiscovery))
  return Hash160(`0x${hasher.digest('hex')}`)
}

export function updateDiffHistoryHash(
  diffHistoryPath: string,
  projectName: string,
  chain: string,
) {
  let content = readFileSync(diffHistoryPath, 'utf-8')

  if (content.startsWith(HASH_LINE_PREFIX)) {
    content = content.split('\n').slice(2).join('\n')
  }

  const hash = getDiscoveryHash(projectName, chain)
  const hashLine = `${HASH_LINE_PREFIX}${hash.toString()}\n`

  writeFileSync(diffHistoryPath, `${hashLine}\n${content}`)
}

export function getDiffHistoryHash(
  diffHistoryPath: string,
): Hash160 | undefined {
  const content = readFileSync(diffHistoryPath, 'utf-8')
  const hashLine = content.split('\n')[0]
  if (hashLine.startsWith(HASH_LINE_PREFIX)) {
    const hashString = hashLine.slice(HASH_LINE_PREFIX.length)
    return Hash160(hashString)
  }
}
