import { ContractParameters } from '@l2beat/discovery-types'

import { HandlerResult } from './Handler'

export function getValuesAndErrors(results: HandlerResult[]): {
  values: ContractParameters['values']
  errors: ContractParameters['errors']
} {
  const values: ContractParameters['values'] = {}
  const errors: ContractParameters['errors'] = {}
  for (const result of results) {
    if (result.value !== undefined) {
      values[result.field] = result.value
    }
    if (result.error !== undefined) {
      errors[result.field] = result.error
    }
  }
  return { values, errors }
}
