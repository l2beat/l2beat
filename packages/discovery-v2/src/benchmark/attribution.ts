/**
 * Where a V1 field came from, decided from the effective V1 config.
 *
 * V1 writes four kinds of fields into `values`: proxy facts from the
 * `ProxyDetector` (`$implementation`, `$admin`, but also the Gnosis Safe
 * detector's `$members`), 0-arg getters read by the system handlers, handler
 * fields a researcher configured, and *projections* of other fields that
 * exist for presentation: `pickRoleMembers` lifts one role's members out of
 * an `accessControl` result, `copy` + `edit` derives a field from another,
 * and a `call` handler with an `edit` re-reads a getter only to format it
 * (`getMinDelayFormatted`). V2 produces the first three kinds and leaves the
 * fourth to consumers, so a v1-only projection is expected and a v1-only
 * handler field is a miss. Telling them apart is what this module is for.
 *
 * Proxy names are taken from what V2's `prepare` produced for the same
 * address rather than from a `$` prefix alone, because the Safe detector's
 * `GnosisSafe_modules` carries no prefix.
 */
import type { EffectiveConfig } from './loadProject'
import type { V1Attribution } from './types'

export function attributeV1Field(
  name: string,
  config: Pick<EffectiveConfig, 'fields'>,
  proxyNames: ReadonlySet<string> = new Set(),
): V1Attribution {
  if (name.startsWith('$') || proxyNames.has(name)) {
    return { kind: 'proxy' }
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
  return { kind: 'handler', handlerType: handler.type }
}

/** `handler (event)`, `template-projection (pickRoleMembers)`, `getter`, … for tables and lists. */
export function describeAttribution(attribution: V1Attribution): string {
  switch (attribution.kind) {
    case 'proxy':
      return 'proxy'
    case 'getter':
      return attribution.edited ? 'getter (edited)' : 'getter'
    case 'handler':
      return `handler (${attribution.handlerType})`
    case 'template-projection':
      return attribution.handlerType === undefined
        ? `template-projection (${attribution.via})`
        : `template-projection (${attribution.via} on ${attribution.handlerType})`
  }
}
