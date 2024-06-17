import { ContractParameters } from '@l2beat/discovery-types'

import {
  DiscoveryContract,
  DiscoveryCustomType,
} from '../config/RawDiscoveryConfig'
import { TypeApplier } from '../type-casters/TypeApplier'
import { HandlerResult } from './Handler'

export function getValuesAndErrors(
  results: HandlerResult[],
  fieldOverrides?: DiscoveryContract['fields'],
  types?: Record<string, DiscoveryCustomType>,
): {
  values: ContractParameters['values']
  errors: ContractParameters['errors']
  usedTypes: DiscoveryCustomType[]
} {
  const values: ContractParameters['values'] = {}
  const errors: ContractParameters['errors'] = {}
  const typeApplier = new TypeApplier(types ?? {})

  for (const result of results) {
    if (result.value !== undefined) {
      const returnType = (fieldOverrides ?? {})[result.field]?.returnType
      if (returnType !== undefined && returnType !== null) {
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
    }
    if (result.error !== undefined) {
      errors[result.field] = result.error
    }
  }
  return { values, errors, usedTypes: typeApplier.usedTypes }
}
