/**
 * What a running step can see: baseline values, finished steps and the
 * contract's own address.
 *
 * References are the only way a step reaches outside itself, and the values
 * they yield are V1-formatted (addresses carry a chain prefix). ethers needs
 * raw addresses to encode call data, so this module also owns the one place
 * where a formatted value is turned back into call arguments.
 */
import type { ContractValue } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { isAddressLiteral } from '../abi/literals'
import { parseReference } from '../plan/references'
import type { Baseline } from '../types/Baseline'
import type { Prepared } from '../types/Prepared'

export class Scope {
  constructor(
    private readonly prepared: Prepared,
    private readonly baseline: Baseline,
    private readonly stepValues: ReadonlyMap<string, ContractValue | undefined>,
  ) {}

  /** The literal itself, or the value a reference points at. */
  resolve(value: unknown): unknown {
    const reference = parseReference(value)
    if (reference === undefined) {
      return value
    }
    switch (reference.kind) {
      case 'self':
        return this.prepared.address
      case 'baseline': {
        const field = this.baseline.fields[reference.field]
        if (field === undefined) {
          throw new Error(`baseline has no field "${reference.field}"`)
        }
        if (field.value === undefined) {
          throw new Error(
            `baseline field "${reference.field}" has no value (${field.error ?? 'no error recorded'})`,
          )
        }
        return field.value
      }
      case 'step': {
        if (!this.stepValues.has(reference.id)) {
          throw new Error(`step "${reference.id}" has not produced a value`)
        }
        const value = this.stepValues.get(reference.id)
        if (value === undefined) {
          throw new Error(`step "${reference.id}" produced no value`)
        }
        return value
      }
    }
  }

  /** The contract to read: `at` resolved to a chain-specific address, or this contract. */
  resolveTarget(at: string | undefined): ChainSpecificAddress {
    if (at === undefined) {
      return this.prepared.address
    }
    const value = this.resolve(at)
    if (typeof value !== 'string') {
      throw new Error(
        `at: ${at} resolved to ${JSON.stringify(value)}, not an address`,
      )
    }
    if (ChainSpecificAddress.check(value)) {
      return ChainSpecificAddress(value)
    }
    if (isAddressLiteral(value)) {
      return ChainSpecificAddress.fromLong(
        this.prepared.chain,
        value.toLowerCase(),
      )
    }
    throw new Error(`at: ${at} resolved to "${value}", not an address`)
  }
}

/** A formatted value as ethers wants it: chain prefixes stripped, recursively. */
export function toCallArgument(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(toCallArgument)
  }
  if (typeof value === 'string' && ChainSpecificAddress.check(value)) {
    return ChainSpecificAddress.address(ChainSpecificAddress(value)).toString()
  }
  return value
}

export function toInteger(value: unknown, what: string): number {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
    return value
  }
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const parsed = Number(value)
    if (Number.isSafeInteger(parsed)) {
      return parsed
    }
  }
  throw new Error(
    `${what} must be a non-negative integer, got ${JSON.stringify(value)}`,
  )
}
