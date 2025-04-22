import { getErrorMessage } from '@l2beat/shared-pure'
import type {
  DiscoveryCustomType,
  StructureContract,
} from '../config/StructureConfig'
import type { EntryParameters } from '../output/types'
import { TypeApplier } from '../type-casters/TypeApplier'
import type { HandlerResult } from './Handler'
import { EditRuntime } from './edit'

export async function decodeHandlerResults(
  results: HandlerResult[],
  fieldOverrides: StructureContract['fields'],
  types: Record<string, DiscoveryCustomType>,
): Promise<{
  values: EntryParameters['values']
  errors: Record<string, string>
  usedTypes: DiscoveryCustomType[]
}> {
  const values: EntryParameters['values'] = {}
  const errors: EntryParameters['errors'] = {}
  const typeApplier = new TypeApplier(types)
  const runtime = new EditRuntime(types)

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

  for (const fieldName in fieldOverrides) {
    const copy = (fieldOverrides ?? {})[fieldName]?.copy
    if (copy !== undefined) {
      try {
        values[fieldName] = values[copy]
      } catch (e) {
        errors[fieldName] = getErrorMessage(e)
      }
    }

    const edit = (fieldOverrides ?? {})[fieldName]?.edit
    if (edit !== undefined) {
      try {
        values[fieldName] = await runtime.evaluateEdit(values[fieldName], edit)
      } catch (e) {
        console.log(e)
        errors[fieldName] = getErrorMessage(e)
      }
    }
  }

  return {
    values,
    errors,
    usedTypes: [...typeApplier.usedTypes, ...runtime.usedTypes],
  }
}
