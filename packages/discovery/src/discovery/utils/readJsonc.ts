import { readFileSync } from 'fs'
import { parseJsonc } from '@l2beat/shared-pure'

export function readJsonc(path: string): JSON {
  const contents = readFileSync(path, 'utf-8')
  return parseJsonc<JSON>(contents)
}
