/**
 * The baseline: what V1 reads for an address without the model's help.
 *
 * The templatizer runs discovery's own handler executor with the address's
 * config (every 0-argument getter, the probe of single-`uint256`
 * getters, the fields of the address override), and, when a template is
 * being extended, with that template pushed, because override fields may
 * reference its fields. Which handler produced which name comes from V1's
 * own `getHandlers` over the same config, so a name is a getter, a probe or
 * an override field exactly when V1 made it one; nothing here repeats V1's
 * selection. A value no handler produced (a `copy` field of the override)
 * is an override field too.
 */
import type {
  StructureContract,
  StructureContractField,
} from '../config/StructureConfig'
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

/**
 * When a template is extended, the values it computes are its existing
 * fields, which the prompt shows as such, so they leave the baseline: a
 * field with its own handler or `copy`, and one that only `edit`s a getter,
 * because discovery runs the edit and the value is no longer the getter's.
 * A template field that only annotates a getter (`severity`,
 * `description`) leaves the getter's value as it is, and stays. So does a
 * field the address override computes itself: the override's handler and
 * edit are the ones that run.
 */
export function withoutTemplateValues(
  baseline: Baseline,
  template: StructureContract,
  override: Pick<StructureContract, 'fields'>,
): Baseline {
  const fields = Object.entries(baseline.fields).filter(
    ([name]) =>
      !computesValue(template.fields[name]) ||
      computesValue(override.fields[name]),
  )
  return { fields: Object.fromEntries(fields) }
}

function computesValue(field: StructureContractField | undefined): boolean {
  return (
    field?.handler !== undefined ||
    field?.copy !== undefined ||
    field?.edit !== undefined
  )
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
