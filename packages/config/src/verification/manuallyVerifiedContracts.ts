import { ManuallyVerifiedContracts } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { parse, ParseError } from 'jsonc-parser'
import path from 'path'

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

export function getManuallyVerifiedContracts(
  devId: string,
): ManuallyVerifiedContracts {
  const jsonFilePath = path.resolve(
    __dirname,
    `/${devId}/manuallyVerified.jsonc`,
  )

  if (!existsSync(jsonFilePath)) {
    return ManuallyVerifiedContracts.parse({})
  }

  const content = readFileSync(jsonFilePath, 'utf-8')
  return parseManuallyVerifiedContracts(content)
}
