/**
 * The reply as a JSON schema, shown to the model in the prompt: V1's own
 * template field cut to what the model writes, `handler`, `edit` and
 * `reason`, with `handler` the union of V1's definitions of the seven
 * handler types the prompt documents. Each definition is named, so the
 * schema reads as a list of handler types rather than as one nested blob.
 *
 * `.check()` predicates (integer lengths, bytes32 role keys, blip programs)
 * have no JSON-schema form and come out as their base type; the rules and
 * handler docs in the prompt state them instead.
 */
import { type Parser, toJsonSchema, v } from '@l2beat/validate'
import { _StructureContractField } from '../../config/StructureConfig'
import { UserHandlers } from '../../handlers/user'

export const DOCUMENTED_HANDLER_TYPES = [
  'call',
  'array',
  'event',
  'accessControl',
  'storage',
  'constructorArgs',
  'hardcoded',
] as const

export function draftJsonSchema(): object {
  const definitions: Record<string, Parser<unknown>> = Object.fromEntries(
    DOCUMENTED_HANDLER_TYPES.map((type) => [
      `${type}Handler`,
      UserHandlers[type],
    ]),
  )
  const field = v.strictObject({
    handler: v.union(Object.values(definitions) as AtLeastTwo<Parser<unknown>>),
    edit: _StructureContractField.edit,
    reason: v.string(),
  })
  return toJsonSchema(
    v.strictObject({ fields: v.record(v.string(), field) }),
    definitions,
  )
}

type AtLeastTwo<T> = [T, T, ...T[]]
