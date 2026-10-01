/**
 * The baseline: what V1 already read for an address before any template.
 *
 * The analyzer runs the system handlers either way, so the templatizer
 * takes their output instead of calling the chain again. Selection repeats
 * `getSystemHandlers` (same ABI filter, same `ignoreMethods`, same field
 * naming) so a name is in the baseline exactly when V1 would write it into
 * `values` or `errors` of an untemplatized entry. Fields a project override
 * configured are left out: they are the researcher's, not V1's defaults.
 */
import { utils } from 'ethers'
import { rewriteSolidityIdentifier } from '../handlers/utils/rewriteSolidityIdentifier'
import type { ContractValue } from '../output/types'
import type { Baseline, BaselineField } from './facts'
import { isProbed } from './worklist'

export function buildBaseline(
  abi: readonly string[],
  ignoreMethods: readonly string[],
  values: Record<string, ContractValue | undefined>,
  errors: Record<string, string>,
): Baseline {
  const fields: [string, BaselineField][] = []
  for (const [name, kind] of systemFieldNames(abi, ignoreMethods)) {
    const value = values[name]
    const error = errors[name]
    if (value === undefined && error === undefined) {
      continue
    }
    fields.push([name, withoutEmpty({ kind, value, error })])
  }
  fields.sort(([a], [b]) => a.localeCompare(b))
  return { fields: Object.fromEntries(fields) }
}

function systemFieldNames(
  abi: readonly string[],
  ignoreMethods: readonly string[],
): Map<string, BaselineField['kind']> {
  const names = new Map<string, BaselineField['kind']>()
  const coder = new utils.Interface(dedupe(abi))
  for (const fragment of Object.values(coder.functions)) {
    if (!fragment.constant || (fragment.outputs?.length ?? 0) === 0) {
      continue
    }
    if (ignoreMethods.includes(fragment.name)) {
      continue
    }
    const name = rewriteSolidityIdentifier(fragment.name)
    if (fragment.inputs.length === 0) {
      names.set(name, 'getter')
    } else if (isProbed(fragment) && !names.has(name)) {
      names.set(name, 'probe')
    }
  }
  return names
}

function dedupe(abi: readonly string[]): string[] {
  return [...new Set(abi)]
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
