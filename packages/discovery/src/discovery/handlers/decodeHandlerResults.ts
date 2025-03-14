import { getErrorMessage } from '@l2beat/shared-pure'
import type {
  DiscoveryContract,
  DiscoveryCustomType,
} from '../config/RawDiscoveryConfig'
import type { EntryParameters } from '../output/types'
import { TypeApplier } from '../type-casters/TypeApplier'
import type { HandlerResult } from './Handler'

export function decodeHandlerResults(
  results: HandlerResult[],
  fieldOverrides: DiscoveryContract['fields'],
  types: Record<string, DiscoveryCustomType>,
): {
  values: EntryParameters['values']
  errors: Record<string, string>
  usedTypes: DiscoveryCustomType[]
} {
  const values: EntryParameters['values'] = {}
  const errors: EntryParameters['errors'] = {}
  const typeApplier = new TypeApplier(types)

  for (const result of results) {
    if (result.value !== undefined) {
      const returnType = (fieldOverrides ?? {})[result.field]?.returnType
      try {
        if (returnType !== undefined) {
          values[result.field] = typeApplier.applyReturnType(
            result.value,
            returnType,
          )
        } else {
          values[result.field] = typeApplier.applyReturnFragment(
            result.value,
            result.fragment,
          )
        }
      } catch (e) {
        errors[result.field] = getErrorMessage(e)
      }
    }
    if (result.error !== undefined) {
      errors[result.field] = result.error
    }
  }
  return { values, errors, usedTypes: typeApplier.usedTypes }
}
