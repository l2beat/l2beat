/**
 * Static type-check of a plan literal against an ABI parameter type.
 *
 * The executor would only discover a mistyped literal by an ethers encoding
 * error at run time, after RPC calls were spent; checking here turns it into
 * a validator finding with the exact expectation, which is what a repair
 * round needs. Accepted spellings deliberately match what the model sees in
 * the prompt: addresses raw or chain-prefixed, integers as numbers or decimal
 * strings (the baseline renders values above 2^53 as decimal strings).
 */
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import type { utils } from 'ethers'

/** A problem description, or undefined when `value` encodes as `type`. */
export function checkLiteral(
  value: unknown,
  type: utils.ParamType,
): string | undefined {
  if (type.baseType === 'array') {
    return checkArray(value, type)
  }
  if (type.baseType === 'tuple') {
    return checkTuple(value, type)
  }
  return checkBase(value, type.type)
}

export function isAddressLiteral(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false
  }
  if (ChainSpecificAddress.check(value)) {
    return true
  }
  return (
    /^0x[0-9a-fA-F]{40}$/.test(value) &&
    (value === value.toLowerCase() || EthereumAddress.check(value))
  )
}

function checkArray(value: unknown, type: utils.ParamType): string | undefined {
  if (!Array.isArray(value)) {
    return `expected an array for ${type.format()}, got ${show(value)}`
  }
  if (type.arrayLength !== -1 && value.length !== type.arrayLength) {
    return `expected ${type.arrayLength} element(s) for ${type.format()}, got ${value.length}`
  }
  return firstProblem(value, (element, i) =>
    prefixed(`[${i}]`, checkLiteral(element, type.arrayChildren)),
  )
}

function checkTuple(value: unknown, type: utils.ParamType): string | undefined {
  if (!Array.isArray(value)) {
    return `expected an array of ${type.components.length} component(s) for ${type.format()}, got ${show(value)}`
  }
  if (value.length !== type.components.length) {
    return `expected ${type.components.length} component(s) for ${type.format()}, got ${value.length}`
  }
  return firstProblem(value, (element, i) =>
    prefixed(
      `[${i}]`,
      checkLiteral(element, type.components[i] as utils.ParamType),
    ),
  )
}

function checkBase(value: unknown, type: string): string | undefined {
  if (type === 'address') {
    return isAddressLiteral(value)
      ? undefined
      : `expected an address (0x + 40 hex digits, lowercase or checksummed, optionally chain-prefixed), got ${show(value)}`
  }
  if (type === 'bool') {
    return typeof value === 'boolean'
      ? undefined
      : `expected a boolean, got ${show(value)}`
  }
  if (type === 'string') {
    return typeof value === 'string'
      ? undefined
      : `expected a string, got ${show(value)}`
  }
  if (type === 'bytes') {
    return isHex(value) && value.length % 2 === 0
      ? undefined
      : `expected a 0x-prefixed hex string of even length, got ${show(value)}`
  }
  const fixedBytes = /^bytes(\d+)$/.exec(type)
  if (fixedBytes) {
    const length = Number(fixedBytes[1])
    return isHex(value) && value.length === 2 + 2 * length
      ? undefined
      : `expected ${type} as 0x + ${2 * length} hex digits, got ${show(value)}`
  }
  const integer = /^(u?)int(\d*)$/.exec(type)
  if (integer) {
    return checkInteger(value, integer[1] === 'u', Number(integer[2] || 256))
  }
  return `unsupported ABI type ${type}`
}

function checkInteger(
  value: unknown,
  unsigned: boolean,
  bits: number,
): string | undefined {
  const parsed = toBigInt(value)
  const name = `${unsigned ? 'uint' : 'int'}${bits}`
  if (parsed === undefined) {
    return `expected ${name} as an integer number or a decimal string, got ${show(value)}`
  }
  const min = unsigned ? 0n : -(1n << BigInt(bits - 1))
  const max = unsigned
    ? (1n << BigInt(bits)) - 1n
    : (1n << BigInt(bits - 1)) - 1n
  if (parsed < min || parsed > max) {
    return `${show(value)} is out of range for ${name}`
  }
  return undefined
}

function toBigInt(value: unknown): bigint | undefined {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) ? BigInt(value) : undefined
  }
  if (typeof value === 'string' && /^-?\d+$/.test(value)) {
    return BigInt(value)
  }
  return undefined
}

function isHex(value: unknown): value is string {
  return typeof value === 'string' && /^0x[0-9a-fA-F]*$/.test(value)
}

function firstProblem(
  values: unknown[],
  check: (value: unknown, index: number) => string | undefined,
): string | undefined {
  for (const [i, value] of values.entries()) {
    const problem = check(value, i)
    if (problem !== undefined) {
      return problem
    }
  }
  return undefined
}

function prefixed(
  location: string,
  problem: string | undefined,
): string | undefined {
  return problem === undefined ? undefined : `${location}: ${problem}`
}

function show(value: unknown): string {
  const json = JSON.stringify(value)
  if (json === undefined) {
    return 'nothing'
  }
  return json.length > 60 ? `${json.slice(0, 57)}...` : json
}
