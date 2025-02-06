// TODO(radomski): This is duplicated in the l2b package, shouldn't be
import { readFileSync } from 'fs'
import { Hash160 } from '@l2beat/shared-pure'

const HASH_LINE_PREFIX = 'Generated with discovered.json: '

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
