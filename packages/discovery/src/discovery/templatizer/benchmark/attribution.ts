/**
 * Where a committed (V1) field came from, decided from the effective config
 * the committed template produced.
 *
 * V1 writes four kinds of fields into `values`: proxy facts from the
 * `ProxyDetector` (`$implementation`, `$admin`, but also the Gnosis Safe
 * detector's `GnosisSafe_modules`), 0-arg getters read by the system
 * handlers, handler fields a researcher configured, and *projections* of
 * other fields that exist for presentation: `pickRoleMembers` lifts one
 * role's members out of an `accessControl` result, `copy` + `edit` derives a
 * field from another, and a `call` handler with an `edit` re-reads a getter
 * only to format it (`getMinDelayFormatted`). The templatizer authors the
 * first three kinds and not the fourth, so a v1-only projection is expected
 * and a v1-only handler field is a miss. Telling them apart is what this
 * module is for.
 *
 * Proxy names come from what the proxy detector returned for the same
 * address rather than from a `$` prefix alone, because the Safe detector's
 * `GnosisSafe_modules` carries no prefix. Override fields are told apart
 * because the effective config merges the template under the override and
 * cannot say by itself which side a handler came from.
 *
 * A handler field is *unreachable* when the model is not offered its
 * handler type, when the type is `hardcoded` (a researcher's knowledge,
 * not the chain's), when a `call` reads another contract (the model is
 * asked about this contract's worklist, and which other contract holds
 * related state is protocol knowledge), or when the suite says so for this
 * contract with a reason (a storage slot nobody could derive). A miss there
 * is expected, not a miss of the model.
 */
import {
  type EffectiveConfig,
  REACHABLE_HANDLER_TYPES,
  type V1Attribution,
} from './types'

export function attributeV1Field(
  name: string,
  config: Pick<EffectiveConfig, 'fields' | 'overrideFields'>,
  proxyNames: ReadonlySet<string> = new Set(),
  unreachable: Record<string, string> = {},
): V1Attribution {
  if (name.startsWith('$') || proxyNames.has(name)) {
    return { kind: 'proxy' }
  }
  if (config.overrideFields.includes(name)) {
    return { kind: 'override' }
  }
  const field = config.fields[name]
  if (field === undefined) {
    return { kind: 'getter' }
  }
  if (field.copy !== undefined) {
    return { kind: 'template-projection', via: 'copy' }
  }
  const handler = field.handler
  if (handler === undefined) {
    return field.edit === undefined
      ? { kind: 'getter' }
      : { kind: 'getter', edited: true }
  }
  if ('pickRoleMembers' in handler && handler.pickRoleMembers !== undefined) {
    return {
      kind: 'template-projection',
      via: 'pickRoleMembers',
      handlerType: handler.type,
    }
  }
  if (handler.type === 'call' && field.edit !== undefined) {
    return { kind: 'template-projection', via: 'edit', handlerType: 'call' }
  }
  const reason = unreachableReason(name, handler, unreachable)
  return reason === undefined
    ? { kind: 'handler', handlerType: handler.type }
    : { kind: 'handler', handlerType: handler.type, unreachable: reason }
}

function unreachableReason(
  name: string,
  handler: { type: string; address?: unknown },
  unreachable: Record<string, string>,
): string | undefined {
  const marked = unreachable[name]
  if (marked !== undefined) {
    return marked
  }
  if (!(REACHABLE_HANDLER_TYPES as readonly string[]).includes(handler.type)) {
    return `${handler.type} handler`
  }
  if (handler.type === 'call' && handler.address !== undefined) {
    return 'reads another contract'
  }
  return undefined
}

/** `handler (event)`, `template-projection (pickRoleMembers)`, `getter`, … for tables and lists. */
export function describeAttribution(attribution: V1Attribution): string {
  switch (attribution.kind) {
    case 'proxy':
      return 'proxy'
    case 'getter':
      return attribution.edited ? 'getter (edited)' : 'getter'
    case 'override':
      return 'override'
    case 'handler':
      return attribution.unreachable === undefined
        ? `handler (${attribution.handlerType})`
        : `handler (${attribution.handlerType}), unreachable: ${attribution.unreachable}`
    case 'template-projection':
      return attribution.handlerType === undefined
        ? `template-projection (${attribution.via})`
        : `template-projection (${attribution.via} on ${attribution.handlerType})`
  }
}
