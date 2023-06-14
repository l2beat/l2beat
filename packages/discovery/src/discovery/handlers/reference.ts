import { ContractValue } from '@l2beat/shared-pure'
import * as z from 'zod'

import { HandlerResult } from './Handler'

const REFERENCE_REGEX = /^\{\{ [a-z_][a-z\d_]* \}\}$/i
export const Reference = z.string().regex(REFERENCE_REGEX)

export function getReferencedName(value: unknown) {
  if (typeof value === 'string' && REFERENCE_REGEX.test(value)) {
    return value.slice(3, -3)
  }
}

export function resolveReference<T extends string | unknown>(
  value: T,
  previousResults: Record<string, HandlerResult | undefined>,
): T | ContractValue {
  const dependency = getReferencedName(value)
  if (!dependency) {
    return value
  }
  const result = previousResults[dependency]
  if (!result) {
    throw new Error(`Missing dependency: ${dependency}`)
  }
  if (result.error) {
    throw new Error(`Dependency error: ${result.error}`)
  }
  if (!result.value) {
    throw new Error(`Dependency error: missing value`)
  }
  return result.value
}
