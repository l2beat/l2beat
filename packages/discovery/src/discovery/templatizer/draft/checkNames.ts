/**
 * A field the draft adds does not replace a value discovery already
 * produces.
 *
 * `getHandlers` keeps the first field of a name and puts template fields
 * before the system ones, so a field that computes a value under the name
 * of a baseline value (a getter, a probe, a field of the project config) or
 * of a proxy value replaces that value. Such a name may only be described:
 * `severity`, `description`, `permissions`. The one sanctioned replacement
 * is an `array` field over the single-`uint256` getter V1 probes under that
 * name, which replaces the probe with the whole array, as researchers
 * write it. Which function that field reads is resolved as V1's
 * `ArrayHandler` resolves it, not taken from the name: an overload keyed by
 * a narrower integer (`foo(uint32)` beside the probed `foo(uint256)`) would
 * take the name and drop the probe.
 */
import type { utils } from 'ethers'
import { isArrayFragment } from '../../handlers/user/ArrayHandler'
import { getFunctionFragment } from '../../handlers/utils/getFunctionFragment'
import { rewriteSolidityIdentifier } from '../../handlers/utils/rewriteSolidityIdentifier'
import { sighash } from '../abi/AbiIndex'
import { type BaselineField, type ContractFacts, PROBE_RANGE } from '../facts'
import { KEYS_ADDED_TO_EXISTING_FIELDS } from '../write/mergeTemplate'
import { type Findings, fieldPath } from './Finding'
import { show } from './schemaProblems'

export function checkNames(
  entries: [name: string, entry: Record<string, unknown>][],
  facts: Pick<ContractFacts, 'abi' | 'baseline' | 'proxyValues'>,
  findings: Findings,
): void {
  for (const [name, entry] of entries) {
    const problem = nameProblem(name, entry, facts)
    if (problem !== undefined) {
      findings.error(fieldPath(name), problem)
    }
  }
}

function nameProblem(
  name: string,
  entry: Record<string, unknown>,
  facts: Pick<ContractFacts, 'abi' | 'baseline' | 'proxyValues'>,
): string | undefined {
  const changes = Object.keys(entry).filter(
    (key) => !KEYS_ADDED_TO_EXISTING_FIELDS.includes(key),
  )
  if (changes.length === 0) {
    return undefined
  }
  if (Object.hasOwn(facts.proxyValues, name)) {
    return `"${name}" is produced by the proxy detector; pick another name so this field does not replace it`
  }
  const baseline = Object.hasOwn(facts.baseline.fields, name)
    ? facts.baseline.fields[name]
    : undefined
  if (baseline === undefined) {
    return undefined
  }
  if (baseline.kind === 'probe') {
    const read = arrayRead(name, entry.handler, facts.abi)
    if (read !== undefined && replacesProbe(name, read)) {
      return undefined
    }
    const rule = `"${name}" is V1's probe of ${name}(uint256) at indices ${PROBE_RANGE}; only an \`array\` field reading ${name}(uint256) may take this name (it replaces the probe with the whole array)`
    if (read === undefined) {
      return `${rule}, so pick another name`
    }
    return `${rule}, and this one reads ${sighash(read)}: write the method as the full fragment of ${name}(uint256), or pick another name`
  }
  return `"${name}" is ${describeBaseline(baseline)}; V1 keeps the first field of a name and template fields come first, so ${changes.join(', ')} would replace that value: pick another name and reference it as {{ ${name} }} if you need it, or give this entry only ${KEYS_ADDED_TO_EXISTING_FIELDS.join(', ')}`
}

/**
 * The function V1's `ArrayHandler` reads for the field, resolved as its
 * constructor resolves it: a full fragment as written, a bare name by
 * prefix over the ABI, first array-keyed match. Absent for other handler
 * types and when the handler would not construct (construction reports
 * that).
 */
function arrayRead(
  name: string,
  handler: unknown,
  abi: string[],
): utils.FunctionFragment | undefined {
  if (!isArrayHandler(handler)) {
    return undefined
  }
  const method = typeof handler.method === 'string' ? handler.method : name
  try {
    return getFunctionFragment(method, abi, isArrayFragment)
  } catch {
    return undefined
  }
}

function isArrayHandler(
  handler: unknown,
): handler is { type: 'array'; method?: unknown } {
  return (
    typeof handler === 'object' &&
    handler !== null &&
    (handler as { type?: unknown }).type === 'array'
  )
}

/** An `array` over the probe's own function, `name(uint256)`, takes the probe over. */
function replacesProbe(name: string, read: utils.FunctionFragment): boolean {
  return (
    rewriteSolidityIdentifier(read.name) === name &&
    read.inputs[0]?.type === 'uint256'
  )
}

function describeBaseline(field: BaselineField): string {
  const origin =
    field.kind === 'getter'
      ? 'a baseline getter'
      : 'a field of the project config'
  const value =
    field.value !== undefined
      ? `V1 reads it as ${show(field.value)}`
      : `V1 reads it, currently with an error: ${field.error ?? 'unknown'}`
  return `${origin} (${value})`
}
