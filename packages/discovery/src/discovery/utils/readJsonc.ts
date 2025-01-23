import { readFileSync } from 'fs'
import { type ParseError, parse } from 'jsonc-parser'

export function readJsonc(path: string): JSON {
  const contents = readFileSync(path, 'utf-8')
  const errors: ParseError[] = []
  const parsed = parse(contents, errors, {
    allowTrailingComma: true,
  }) as JSON
  if (errors.length !== 0) {
    throw new Error(`Cannot parse file ${path}`)
  }
  return parsed
}
