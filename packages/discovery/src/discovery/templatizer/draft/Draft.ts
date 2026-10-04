/**
 * The draft: the model's reply for one contract.
 *
 * It is a V1 template's `fields` plus the verdicts a template file cannot
 * hold (`covers`, `skips`, `reason`), so the file is derived from it by
 * dropping the verdicts and turning reasons into comments, nothing else.
 * The handler vocabulary is closed on purpose: seven handler types
 * researchers use for 97% of committed handler fields (the census behind
 * that choice is in docs/ai-templatizer.md). `edit` and `where` are any
 * blip program V1 parses; what a program does at the block is the dry
 * run's to report.
 *
 * Handler definitions are V1's own schemas, so a draft that passes here is
 * a template V1 parses. They are applied one type at a time rather than
 * through V1's 33-member union, because a union failure cannot say which
 * key was wrong. The event handler is the one V1 defines with non-strict
 * objects; it is restated strictly so a misspelt key is an error here
 * instead of being ignored at run time.
 */
import { type Parser, v } from '@l2beat/validate'
import type { BlipSexp } from '../../../blip/type'
import { AccessControlHandlerDefinition } from '../../handlers/user/AccessControlHandler'
import { ArrayHandlerDefinition } from '../../handlers/user/ArrayHandler'
import { CallHandlerDefinition } from '../../handlers/user/CallHandler'
import { ConstructorArgsDefinition } from '../../handlers/user/ConstructorArgsHandler'
import { HardCodedDefinition } from '../../handlers/user/HardcodedHandler'
import { StorageHandlerDefinition } from '../../handlers/user/StorageHandler'

export const HANDLER_TYPES = [
  'call',
  'array',
  'event',
  'accessControl',
  'storage',
  'constructorArgs',
  'hardcoded',
] as const
export type HandlerType = (typeof HANDLER_TYPES)[number]

export const SKIP_REASONS = [
  'user-activity',
  'computation',
  'unbounded',
  'covered',
  'not-state',
] as const
export type SkipReason = (typeof SKIP_REASONS)[number]

export interface DraftField {
  handler: DraftHandler
  edit?: BlipSexp
  /** Worklist tokens (function signatures and event names) this field answers. */
  covers: string[]
  /** One sentence naming the writer function and its modifier; becomes a comment. */
  reason: string
}

export interface DraftSkip {
  item: string
  reason: SkipReason
}

export interface Draft {
  fields: Record<string, DraftField>
  skips: DraftSkip[]
}

export type DraftHandler = { type: HandlerType } & Record<string, unknown>

/** The shape around the handlers; each handler is checked by `handlerSchemaFor`. */
export const DraftShape = v.strictObject({
  fields: v.record(
    v.string(),
    v.strictObject({
      handler: v.unknown(),
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

const oneOrMany = <T>(schema: Parser<T>) => v.union([schema, v.array(schema)])

export const StrictEventAction = v.strictObject({
  event: oneOrMany(v.string()),
  where: v.unknown().optional(),
})

const eventCommon = {
  type: v.literal('event'),
  select: oneOrMany(v.string()).optional(),
  groupBy: v.string().optional(),
  ignoreRelative: v.boolean().optional(),
}

export const StrictEventSetDefinition = v.strictObject({
  ...eventCommon,
  set: oneOrMany(StrictEventAction),
})

export const StrictEventAddRemoveDefinition = v.strictObject({
  ...eventCommon,
  add: oneOrMany(StrictEventAction),
  remove: oneOrMany(StrictEventAction).optional(),
  flatten: v.boolean().optional(),
  dedupBy: oneOrMany(v.string()).optional(),
})

export const HANDLER_SCHEMAS: Record<
  Exclude<HandlerType, 'event'>,
  Parser<unknown>
> = {
  call: CallHandlerDefinition,
  array: ArrayHandlerDefinition,
  accessControl: AccessControlHandlerDefinition,
  storage: StorageHandlerDefinition,
  constructorArgs: ConstructorArgsDefinition,
  hardcoded: HardCodedDefinition,
}

/**
 * An event handler either keeps the latest log (`set`) or replays logs into
 * a set (`add`/`remove`); the key present decides which schema applies, so
 * the error names a key of the form the model meant.
 */
export function handlerSchemaFor(handler: DraftHandler): Parser<unknown> {
  if (handler.type === 'event') {
    return 'set' in handler
      ? StrictEventSetDefinition
      : StrictEventAddRemoveDefinition
  }
  return HANDLER_SCHEMAS[handler.type]
}

export function isHandlerType(value: unknown): value is HandlerType {
  return (HANDLER_TYPES as readonly unknown[]).includes(value)
}

/**
 * Event actions of an event handler in `set`, `add`, `remove` order, each
 * with its path inside the handler (`add` for a single action, `add[1]` in
 * a list), so findings point where the model wrote the action.
 */
export function eventActions(handler: DraftHandler): LocatedEventAction[] {
  const result: LocatedEventAction[] = []
  for (const key of ['set', 'add', 'remove'] as const) {
    const value = handler[key]
    if (value === undefined) {
      continue
    }
    if (!Array.isArray(value)) {
      result.push({ key, path: key, action: value as EventAction })
      continue
    }
    value.forEach((action, i) =>
      result.push({ key, path: `${key}[${i}]`, action: action as EventAction }),
    )
  }
  return result
}

export interface LocatedEventAction {
  key: 'set' | 'add' | 'remove'
  path: string
  action: EventAction
}

export interface EventAction {
  event: string | string[]
  where?: unknown
}

export function eventNamesOf(action: EventAction): string[] {
  return Array.isArray(action.event) ? action.event : [action.event]
}
