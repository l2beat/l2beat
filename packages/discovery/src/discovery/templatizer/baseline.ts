/**
 * The baseline: what V1 already read for an address before any template.
 *
 * The analyzer runs the handlers of the untemplatized config either way
 * (every 0-argument getter, the 0–4 probe of single-`uint256` getters, and
 * the fields of the address override) and hands their values and errors
 * over, so the templatizer takes that output instead of calling the chain
 * again. Which handler produced which name comes from V1's own
 * `getHandlers` over the same config, so a name is a getter, a probe or an
 * override field exactly when V1 made it one; nothing here repeats V1's
 * selection. A value no handler produced (a `copy` field of the override)
 * is an override field too.
 */
import type { Handler } from '../handlers/Handler'
import { LimitedArrayHandler } from '../handlers/system/LimitedArrayHandler'
import { SimpleMethodHandler } from '../handlers/system/SimpleMethodHandler'
import type { ContractValue } from '../output/types'
import type { Baseline, BaselineField } from './facts'

export function buildBaseline(
  values: Record<string, ContractValue | undefined>,
  errors: Record<string, string>,
  handlers: readonly Handler[],
): Baseline {
  const byField = new Map(handlers.map((handler) => [handler.field, handler]))
  const names = new Set([...Object.keys(values), ...Object.keys(errors)])
  const fields: [string, BaselineField][] = []
  for (const name of names) {
    const value = values[name]
    const error = errors[name]
    if (value === undefined && error === undefined) {
      continue
    }
    const kind = kindOf(byField.get(name))
    fields.push([name, withoutEmpty({ kind, value, error })])
  }
  fields.sort(([a], [b]) => a.localeCompare(b))
  return { fields: Object.fromEntries(fields) }
}

function kindOf(handler: Handler | undefined): BaselineField['kind'] {
  if (handler instanceof LimitedArrayHandler) {
    return 'probe'
  }
  if (handler instanceof SimpleMethodHandler) {
    return 'getter'
  }
  return 'override'
}

function withoutEmpty(field: BaselineField): BaselineField {
  const result: BaselineField = { kind: field.kind }
  if (field.value !== undefined) {
    result.value = field.value
  }
  if (field.error !== undefined) {
    result.error = field.error
  }
  return result
}
