import { isChainShortName } from '@l2beat/discovery'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ApiAddressType, FieldValue } from './types'

export function parseFieldValue(
  value: unknown,
  meta: Record<string, { name?: string; type: ApiAddressType }>,
): FieldValue {
  if (typeof value === 'string') {
    if (/^0x[a-f\d]*$/i.test(value)) {
      assert(
        value.length !== 42,
        'Addresses need to already have the chain prefix',
      )
      return { type: 'hex', value }
    }
    if (/^[\w-]*:0x[a-f\d]*$/i.test(value)) {
      const [prefix, rawAddress] = value.split(':')

      if (isChainShortName(prefix) && rawAddress.length === 42) {
        const address = ChainSpecificAddress.from(prefix, rawAddress)
        return {
          type: 'address',
          name: meta[address]?.name,
          addressType: meta[address]?.type ?? 'Unknown',
          address,
        }
      }
      return { type: 'string', value }
    }
    if (/^-?\d+$/.test(value)) {
      return { type: 'number', value: BigInt(value).toString(10) }
    }
    return { type: 'string', value }
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return { type: 'number', value: BigInt(value).toString(10) }
  }

  if (typeof value === 'boolean') {
    return { type: 'boolean', value }
  }

  if (Array.isArray(value)) {
    return {
      type: 'array',
      values: value.map((v) => parseFieldValue(v, meta)),
    }
  }

  if (typeof value === 'object' && value !== null) {
    return {
      type: 'object',
      values: Object.entries(value).map(([key, value]) => [
        parseFieldValue(key, meta),
        parseFieldValue(value, meta),
      ]),
    }
  }

  return {
    type: 'unknown',
    value: `${value}`,
  }
}
