/**
 * One parsed view of a human-readable ABI, shared by the worklist builder
 * and the coverage check's hints.
 *
 * A stray token in a draft is explained by what it names: a function the
 * baseline already reads, one that changes state, or the nearest existing
 * signatures. Duplicate fragments are dropped before parsing because merged
 * proxy and implementation ABIs repeat signatures and ethers logs a warning
 * per repeat.
 */
import { utils } from 'ethers'
import { closest, nameOf } from '../closest'

export type Lookup<T> =
  | { fragment: T; inAbi: boolean; error?: undefined }
  | { fragment?: undefined; inAbi: false; error: string }

export class AbiIndex {
  readonly functions: utils.FunctionFragment[]
  readonly events: utils.EventFragment[]
  /** The ABI's first constructor, the one V1's `constructorArgs` handler decodes with; undefined when none is declared. */
  readonly deploy: utils.ConstructorFragment | undefined
  private readonly bySignature: Map<string, utils.FunctionFragment>

  private constructor(fragments: utils.Fragment[]) {
    const coder = new utils.Interface(fragments)
    this.functions = Object.values(coder.functions)
    this.events = Object.values(coder.events)
    this.deploy = fragments.find(
      (fragment): fragment is utils.ConstructorFragment =>
        fragment.type === 'constructor',
    )
    this.bySignature = new Map(
      this.functions.map((fragment) => [sighash(fragment), fragment]),
    )
  }

  static from(abi: readonly string[]): AbiIndex {
    const seen = new Set<string>()
    const fragments: utils.Fragment[] = []
    for (const entry of abi) {
      const fragment = utils.Fragment.from(entry)
      const key = identity(fragment)
      if (!seen.has(key)) {
        seen.add(key)
        fragments.push(fragment)
      }
    }
    return new AbiIndex(fragments)
  }

  /**
   * `owner`, `owner()` or `function owner() view returns (address)`. A full
   * fragment that is not in the ABI is still returned (with `inAbi: false`)
   * because a field may call another contract whose ABI we do not hold.
   */
  lookupFunction(reference: string): Lookup<utils.FunctionFragment> {
    const parsed = parseFragment(reference, 'function')
    if (parsed.kind === 'invalid') {
      return { inAbi: false, error: parsed.reason }
    }
    if (parsed.kind === 'fragment') {
      const known = this.bySignature.get(sighash(parsed.fragment))
      return known
        ? { fragment: known, inAbi: true }
        : { fragment: parsed.fragment as utils.FunctionFragment, inAbi: false }
    }
    if (parsed.kind === 'signature') {
      const known = this.bySignature.get(parsed.signature)
      return known
        ? { fragment: known, inAbi: true }
        : { inAbi: false, error: this.missingFunction(parsed.signature) }
    }
    return this.byName(
      this.functions,
      parsed.name,
      'function',
      this.missingFunction(parsed.name),
    )
  }

  private byName<T extends utils.FunctionFragment | utils.EventFragment>(
    fragments: T[],
    name: string,
    noun: string,
    missing: string,
  ): Lookup<T> {
    const matches = fragments.filter((fragment) => fragment.name === name)
    if (matches.length === 1) {
      return { fragment: matches[0] as T, inAbi: true }
    }
    if (matches.length === 0) {
      return { inAbi: false, error: missing }
    }
    const signatures = matches.map(sighash).join(', ')
    return {
      inAbi: false,
      error: `${noun} "${name}" is overloaded (${signatures}); use one of these full signatures`,
    }
  }

  private missingFunction(reference: string): string {
    const signatures = this.functions.map(sighash)
    return describeMiss('function', reference, signatures)
  }
}

/**
 * Deduplication key. A merged ABI can hold the proxy's constructor and an
 * implementation's; V1 decodes with the first, so every later one is dropped
 * like a repeat (ethers would keep the first too, with a warning per repeat).
 */
function identity(fragment: utils.Fragment): string {
  return fragment.type === 'constructor' ? 'constructor' : sighash(fragment)
}

export function sighash(fragment: utils.Fragment): string {
  return fragment.format(utils.FormatTypes.sighash)
}

type ParsedReference =
  | { kind: 'name'; name: string }
  | { kind: 'signature'; signature: string }
  | { kind: 'fragment'; fragment: utils.Fragment }
  | { kind: 'invalid'; reason: string }

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/
const FRAGMENT_KEYWORD =
  /^(function|event|constructor|error|fallback|receive)\b/

function parseFragment(
  reference: string,
  type: 'function' | 'event',
): ParsedReference {
  const trimmed = reference.trim()
  if (IDENTIFIER.test(trimmed)) {
    return { kind: 'name', name: trimmed }
  }
  const text = FRAGMENT_KEYWORD.test(trimmed) ? trimmed : `${type} ${trimmed}`
  let fragment: utils.Fragment
  try {
    fragment = utils.Fragment.from(text)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    return {
      kind: 'invalid',
      reason: `"${reference}" is not a ${type} name, a \`name(types)\` signature or a full fragment (${reason})`,
    }
  }
  if (fragment.type !== type) {
    return {
      kind: 'invalid',
      reason: `"${reference}" parses as a ${fragment.type}, expected a ${type}`,
    }
  }
  const isBareSignature = trimmed === sighash(fragment)
  return isBareSignature
    ? { kind: 'signature', signature: trimmed }
    : { kind: 'fragment', fragment }
}

function describeMiss(
  noun: string,
  reference: string,
  signatures: string[],
): string {
  if (signatures.length === 0) {
    return `${noun} "${reference}" is not in the ABI, which declares no ${noun}s`
  }
  const hints = closest(signatures, reference, 3, nameOf)
  return `${noun} "${reference}" is not in the ABI; closest: ${hints.join(', ')}`
}
