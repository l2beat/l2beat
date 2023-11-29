import { ManuallyVerifiedContracts } from '@l2beat/shared-pure'
import { readFile } from 'fs/promises'
import { parse, ParseError } from 'jsonc-parser'
import path from 'path'

const jsonFilePath = path.resolve(__dirname, '../manuallyVerified.jsonc')

export function parseManuallyVerifiedContracts(
  content: string,
): ManuallyVerifiedContracts {
  const errors: ParseError[] = []
  const parsed = parse(content, errors, {
    allowTrailingComma: true,
  }) as Record<string, string>
  if (errors.length !== 0) {
    throw new Error('Cannot parse manuallyVerified.jsonc')
  }

  delete parsed.$schema

  return ManuallyVerifiedContracts.parse(parsed)
}

export async function getManuallyVerifiedContracts(): Promise<ManuallyVerifiedContracts> {
  const content = await readFile(jsonFilePath, 'utf-8')
  return parseManuallyVerifiedContracts(content)
}
