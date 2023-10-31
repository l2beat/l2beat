import { UrlPath } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { parse, ParseError } from 'jsonc-parser'
import { once } from 'lodash'
import path from 'path'
import * as z from 'zod'

export type ManuallyVerfiedContracts = z.infer<typeof ManuallyVerfiedContracts>
const ManuallyVerfiedContracts = z.record(UrlPath)

const jsonFilePath = path.resolve(__dirname, 'manuallyVerified.jsonc')

function parseManuallyVerifiedContracts(
  content: string,
): ManuallyVerfiedContracts {
  const errors: ParseError[] = []
  const parsed = parse(content, errors, {
    allowTrailingComma: true,
  }) as Record<string, string>
  if (errors.length !== 0) {
    throw new Error('Cannot parse manuallyVerified.jsonc')
  }

  delete parsed.$schema

  return ManuallyVerfiedContracts.parse(parsed)
}

export async function getManuallyVerified(): Promise<ManuallyVerfiedContracts> {
  const content = await readFile(jsonFilePath, 'utf-8')
  return parseManuallyVerifiedContracts(content)
}

export const getManuallyVerifiedSynced: () => ManuallyVerfiedContracts = once(
  () => {
    const content = readFileSync(jsonFilePath, 'utf-8')
    return parseManuallyVerifiedContracts(content)
  },
)
