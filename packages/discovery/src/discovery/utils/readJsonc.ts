import { readFile } from 'fs/promises'
import { ParseError, parse } from 'jsonc-parser'

export async function readJsonc(path: string): Promise<JSON> {
  const contents = await readFile(path, 'utf-8')
  const errors: ParseError[] = []
  const parsed = parse(contents, errors, {
    allowTrailingComma: true,
  }) as JSON
  if (errors.length !== 0) {
    throw new Error(`Cannot parse file ${path}`)
  }
  return parsed
}
