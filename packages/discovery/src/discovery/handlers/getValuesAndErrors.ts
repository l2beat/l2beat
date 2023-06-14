import { ContractParameters } from '@l2beat/shared-pure'

import { HandlerResult } from './Handler'

export function getValuesAndErrors(results: HandlerResult[]) {
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
