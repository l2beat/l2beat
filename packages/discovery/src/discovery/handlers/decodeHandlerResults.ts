import { ChainSpecificAddress, getErrorMessage } from '@l2beat/shared-pure'
import merge from 'lodash/merge'
import { BlipRuntime } from '../../blip/BlipRuntime'
import type {
  DiscoveryCustomType,
  StructureContract,
} from '../config/StructureConfig'
import type { ContractValue, EntryParameters } from '../output/types'
import { applyReturnFragment } from '../type-casters/applyReturnFragment'
import type { HandlerResult } from './Handler'
import { orderByCopyDependencies } from './orderByCopyDependencies'

export function decodeHandlerResults(
  longChain: string,
  results: HandlerResult[],
  fieldOverrides: StructureContract['fields'],
  types: Record<string, DiscoveryCustomType>,
): {
  values: EntryParameters['values']
  errors: Record<string, string>
  usedTypes: DiscoveryCustomType[]
} {
  const values: EntryParameters['values'] = {}
  const errors: EntryParameters['errors'] = {}

  for (const { value, field, fragment, error } of results) {
    if (value !== undefined) {
      try {
        values[field] = applyReturnFragment(
          prefixAddresses(longChain, value),
          fragment,
        )
      } catch (e) {
        errors[field] = getErrorMessage(e)
      }
    }

    if (error !== undefined) {
      errors[field] = error
    }
  }

  const runtime = new BlipRuntime(types)
  const fields = merge({}, values, fieldOverrides)
  const copyBatches = orderByCopyDependencies(fields)
  for (const batch of copyBatches) {
    for (const fieldName of batch) {
      const copy = (fieldOverrides ?? {})[fieldName]?.copy
      if (copy !== undefined) {
        if (values[copy] === undefined) {
          errors[fieldName] = `Field ${copy} not found`
          continue
        }

        values[fieldName] = values[copy]
      }
    }
  }

  for (const fieldName in fieldOverrides) {
    const edit = (fieldOverrides ?? {})[fieldName]?.edit
    if (edit !== undefined) {
      // biome-ignore lint/style/noNonNullAssertion: It's fine
      values[fieldName] = runtime.executeBlip(values[fieldName]!, edit)
    }
  }

  return {
    values,
    errors,
    usedTypes: runtime.usedTypes,
  }
}

// TODO(radomski): We need to test this
function prefixAddresses(
  longChain: string,
  value: ContractValue,
): ContractValue {
  if (Array.isArray(value)) {
    return value.map((v) => prefixAddresses(longChain, v))
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        prefixAddresses(longChain, key),
        prefixAddresses(longChain, value as ContractValue),
      ]),
    )
  }

  if (typeof value === 'string') {
    try {
      return ChainSpecificAddress.fromLong(longChain, value).toString()
    } catch {
      return value
    }
  }

  return value
}
