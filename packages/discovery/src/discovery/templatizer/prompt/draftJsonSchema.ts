/**
 * The draft as a JSON schema, shown to the model in the prompt.
 *
 * `DraftShape` leaves `handler` open because the validator checks each
 * handler against the single definition its `type` selects: an error
 * against a union cannot say which key was wrong. The model, however,
 * needs to see every key a handler may have, so the schema it is shown
 * closes `handler` with the union of those same definitions. Each
 * definition is named, so the schema reads as a list of handler types
 * rather than as one nested blob.
 *
 * `.check()` predicates (integer lengths, bytes32 role keys, the `edit` and
 * `where` whitelists) have no JSON-schema form and come out as their base
 * type; the rules and handler docs in the prompt state them instead.
 */
import { type Parser, toJsonSchema, v } from '@l2beat/validate'
import {
  HANDLER_SCHEMAS,
  HANDLER_TYPES,
  type HandlerType,
  SKIP_REASONS,
  StrictEventAction,
  StrictEventAddRemoveDefinition,
  StrictEventSetDefinition,
} from '../draft/Draft'

export function draftJsonSchema(): object {
  const definitions = handlerDefinitions()
  return toJsonSchema(promptDraftSchema(Object.values(definitions)), {
    ...definitions,
    eventAction: StrictEventAction,
  })
}

/**
 * In `HANDLER_TYPES` order, so the schema lists handlers in the order the
 * handler docs describe them. The event handler contributes both of its
 * forms because the key present (`set` or `add`) decides which applies.
 */
function handlerDefinitions(): Record<string, Parser<unknown>> {
  return Object.fromEntries(HANDLER_TYPES.flatMap(definitionsOfType))
}

function definitionsOfType(type: HandlerType): [string, Parser<unknown>][] {
  if (type === 'event') {
    return [
      ['eventSetHandler', StrictEventSetDefinition],
      ['eventAddRemoveHandler', StrictEventAddRemoveDefinition],
    ]
  }
  return [[`${type}Handler`, HANDLER_SCHEMAS[type]]]
}

/** `DraftShape` with `handler` closed; the test pins that nothing else differs. */
function promptDraftSchema(handlers: Parser<unknown>[]): Parser<unknown> {
  return v.strictObject({
    fields: v.record(
      v.string(),
      v.strictObject({
        handler: v.union(handlers as AtLeastTwo<Parser<unknown>>),
        edit: v.unknown().optional(),
        covers: v.array(v.string()),
        reason: v.string(),
      }),
    ),
    skips: v.array(
      v.strictObject({
        item: v.string(),
        reason: v.enum([...SKIP_REASONS]),
      }),
    ),
  })
}

type AtLeastTwo<T> = [T, T, ...T[]]
