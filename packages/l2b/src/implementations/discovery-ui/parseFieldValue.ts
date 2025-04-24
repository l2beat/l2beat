import { isChainShortName } from '@l2beat/discovery'
import { getChainFullName } from '@l2beat/discovery/dist/config/config.discovery'
import { toAddress } from './toAddress'
import type { ApiAddressType, FieldValue } from './types'

export function parseFieldValue(
  value: unknown,
  meta: Record<string, { name?: string; type: ApiAddressType }> = {},
  chain: string,
): FieldValue {
  if (typeof value === 'string') {
    if (/^0x[a-f\d]*$/i.test(value)) {
      if (value.length === 42) {
        const address = toAddress(chain, value)
        return {
          type: 'address',
          name: meta[address]?.name,
          addressType: meta[address]?.type ?? 'Unknown',
          address,
        }
      } else {
        return { type: 'hex', value }
      }
    } else if (/^\w*:0x[a-f\d]*$/i.test(value)) {
      const [prefix, rawAddress] = value.split(':')

      if (isChainShortName(prefix) && rawAddress.length === 42) {
        const address = toAddress(getChainFullName(prefix), rawAddress)
        return {
          type: 'address',
          name: meta[address]?.name,
          addressType: meta[address]?.type ?? 'Unknown',
          address,
        }
      } else {
        return { type: 'string', value }
      }
    } else if (/^-?\d+$/.test(value)) {
      return { type: 'number', value: BigInt(value).toString(10) }
    } else {
      return { type: 'string', value }
    }
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
      values: value.map((v) => parseFieldValue(v, meta, chain)),
    }
  }

  if (typeof value === 'object' && value !== null) {
    return {
      type: 'object',
      value: Object.fromEntries(
        Object.entries(value).map(([key, value]) => [
          key,
          parseFieldValue(value, meta, chain),
        ]),
      ),
    }
  }

  return {
    type: 'unknown',
    value: `${value}`,
  }
}
