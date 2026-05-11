import { parseJsonc } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'

export function readJsonc(path: string): JSON {
  const contents = readFileSync(path, 'utf-8')
  return parseJsonc<JSON>(contents)
}
