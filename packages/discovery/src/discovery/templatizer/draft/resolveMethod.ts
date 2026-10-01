/**
 * Which function a `call` or `array` field reads, decided exactly as V1
 * decides it at run time.
 *
 * V1's `getFunctionFragment` treats a method containing a space as a full
 * fragment and anything else as the start of an ABI entry
 * (`function <method>`), taking the first entry the handler accepts. The
 * prefix match is what makes innocent spellings fail or, worse, succeed
 * wrongly: `isSequencer(address)` only matches while the ABI omits
 * parameter names, and `version` can resolve to `versionHash`. So V1's own
 * lookup is run and its answer compared with the function the model meant.
 */
import type { utils } from 'ethers'
import { getFunctionFragment } from '../../handlers/utils/getFunctionFragment'
import { toFunctionFragment } from '../../handlers/utils/toFunctionFragment'
import { type AbiIndex, fullSignature, sighash } from '../abi/AbiIndex'
import { closest, nameOf } from '../closest'

export interface MethodRequest {
  /** `definition.method ?? field`, as the V1 handlers pass it. */
  method: string
  /** `method` was absent, so the field name stands in for it. */
  defaulted: boolean
  /** `address` is set: the function lives in another contract. */
  foreign: boolean
  /** Why the handler's V1 predicate rejects a fragment; undefined when it accepts it. */
  rejects: (fragment: utils.FunctionFragment) => string | undefined
}

export type MethodResolution =
  | { fragment: utils.FunctionFragment; error?: undefined }
  | { fragment?: undefined; error: string }

export function resolveMethod(
  request: MethodRequest,
  abi: readonly string[],
  index: AbiIndex,
): MethodResolution {
  const resolution = request.method.includes(' ')
    ? resolveFullFragment(request, index)
    : resolveBareName(request, abi, index)
  if (resolution.fragment === undefined) {
    return resolution
  }
  if ((resolution.fragment.outputs?.length ?? 0) === 0) {
    return {
      error: `${sighash(resolution.fragment)} returns nothing, so there is no value to read`,
    }
  }
  return resolution
}

function resolveBareName(
  request: MethodRequest,
  abi: readonly string[],
  index: AbiIndex,
): MethodResolution {
  const { method } = request
  if (method.includes('(')) {
    return { error: signatureSpelling(method, index) }
  }
  if (request.foreign) {
    return { error: foreignNeedsFragment(method, index) }
  }
  const named = index.functions.filter((fragment) => fragment.name === method)
  if (named.length === 0) {
    return {
      error: withPrefixTrap(missingFunction(request, index), request, abi),
    }
  }
  const accepted = named.filter((fragment) => !request.rejects(fragment))
  if (accepted.length === 0) {
    const rejections = named.map((fragment) => request.rejects(fragment))
    return { error: withPrefixTrap(rejections.join('; '), request, abi) }
  }
  if (accepted.length > 1) {
    return { error: ambiguousOverloads(method, accepted) }
  }
  const wanted = accepted[0] as utils.FunctionFragment
  const picked = v1Lookup(request, abi)
  if (picked === undefined || sighash(picked) !== sighash(wanted)) {
    return { error: prefixMismatch(method, wanted, picked) }
  }
  return { fragment: wanted }
}

function resolveFullFragment(
  request: MethodRequest,
  index: AbiIndex,
): MethodResolution {
  let fragment: utils.FunctionFragment
  try {
    fragment = toFunctionFragment(request.method)
  } catch (error) {
    return { error: unparsableFragment(request.method, error) }
  }
  const rejection = request.rejects(fragment)
  if (rejection !== undefined) {
    return { error: rejection }
  }
  if (request.foreign) {
    return { fragment }
  }
  const known = index.functions.find(
    (candidate) => sighash(candidate) === sighash(fragment),
  )
  if (known === undefined) {
    return { error: fragmentNotInAbi(fragment, index) }
  }
  if (outputTypes(known) !== outputTypes(fragment)) {
    return {
      error: `${sighash(fragment)} returns (${outputTypes(known)}) in this ABI, not (${outputTypes(fragment)}); copy "${fullSignature(known)}"`,
    }
  }
  return { fragment }
}

/** What V1's `getFunctionFragment` returns for a bare name, or undefined when it throws. */
function v1Lookup(
  request: MethodRequest,
  abi: readonly string[],
): utils.FunctionFragment | undefined {
  try {
    return getFunctionFragment(
      request.method,
      abi as string[],
      (fragment) => request.rejects(fragment) === undefined,
    )
  } catch {
    return undefined
  }
}

/**
 * When the name does not resolve, V1 may still find a longer name starting
 * with it (`owner` with one argument finds `owners(uint256)`); saying so
 * keeps the model from "fixing" the arity into the wrong function.
 */
function withPrefixTrap(
  message: string,
  request: MethodRequest,
  abi: readonly string[],
): string {
  const picked = v1Lookup(request, abi)
  if (picked === undefined || picked.name === request.method) {
    return message
  }
  return `${message}; V1 matches \`method\` as the start of an ABI entry, so it would silently call ${sighash(picked)} instead`
}

function signatureSpelling(method: string, index: AbiIndex): string {
  const lookup = index.lookupFunction(method)
  if (lookup.fragment === undefined) {
    return `"${method}" is not a function of this ABI (${lookup.error}); write a bare function name or a full "function …" fragment`
  }
  const name = lookup.fragment.name
  return `"${method}" is a signature, which V1 matches as the start of an ABI entry and so only finds while the ABI omits parameter names; write the bare name "${name}" (the number of args picks the overload) or the full fragment "${fullSignature(lookup.fragment)}"`
}

function foreignNeedsFragment(method: string, index: AbiIndex): string {
  const local = index.functions.find((fragment) => fragment.name === method)
  const example = local
    ? fullSignature(local)
    : `function ${method}() view returns (address)`
  return `\`address\` points at another contract, whose ABI V1 does not have, so \`method\` must be a full fragment such as "${example}"`
}

function missingFunction(request: MethodRequest, index: AbiIndex): string {
  const hints = closest(
    readableFunctions(index).map((f) => f.name),
    request.method,
  )
  const prefix = request.defaulted
    ? 'no `method` is given, so V1 calls the function named like the field, and there '
    : 'there '
  return `${prefix}is no function "${request.method}" in the ABI; closest: ${hints.join(', ')}`
}

function ambiguousOverloads(
  method: string,
  accepted: utils.FunctionFragment[],
): string {
  const fragments = accepted.map((fragment) => `"${fullSignature(fragment)}"`)
  return `"${method}" matches ${accepted.length} overloads with this many arguments and V1 would take whichever the ABI lists first; use the full fragment of the one you mean: ${fragments.join(' or ')}`
}

function prefixMismatch(
  method: string,
  wanted: utils.FunctionFragment,
  picked: utils.FunctionFragment | undefined,
): string {
  const got = picked === undefined ? 'nothing' : sighash(picked)
  return `V1 matches \`method\` as the start of an ABI entry and resolves "${method}" to ${got}, not ${sighash(wanted)}; use the full fragment "${fullSignature(wanted)}"`
}

function unparsableFragment(method: string, error: unknown): string {
  const reason = error instanceof Error ? error.message : String(error)
  return `"${method}" contains a space, so V1 parses it as a full fragment, and it does not parse (${reason}); write a bare function name or "function name(types) view returns (types)"`
}

function fragmentNotInAbi(
  fragment: utils.FunctionFragment,
  index: AbiIndex,
): string {
  const hints = closest(
    readableFunctions(index).map(sighash),
    sighash(fragment),
    3,
    nameOf,
  )
  return `${sighash(fragment)} is not in this contract's ABI; to read another contract set \`address\` to a reference holding its address, otherwise call a function this ABI declares (closest: ${hints.join(', ')})`
}

/** Hints only name functions a handler could read. */
function readableFunctions(index: AbiIndex): utils.FunctionFragment[] {
  return index.functions.filter(
    (fragment) =>
      fragment.stateMutability === 'view' ||
      fragment.stateMutability === 'pure',
  )
}

function outputTypes(fragment: utils.FunctionFragment): string {
  return (fragment.outputs ?? []).map((output) => output.format()).join(',')
}
