import { readFileSync } from 'fs'
import path from 'path'

export const packageHash = readFileSync(
  path.join(__dirname, '../packageHash.txt'),
  'utf8',
)
