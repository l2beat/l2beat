import type { ApiAddressType, FieldValue } from './types'

export function parseFieldValue(
  value: unknown,
  meta: Record<string, { name?: string; type: ApiAddressType }> = {},
): FieldValue {
  if (typeof value === 'string') {
    if (/^0x[a-f\d]*$/i.test(value)) {
      if (value.length === 42) {
        return {
          type: 'address',
          name: meta[value]?.name,
          addressType: meta[value]?.type ?? 'Unknown',
          address: value,
        }
      } else {
        return { type: 'hex', value }
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
      values: value.map((v) => parseFieldValue(v, meta)),
    }
  }

  if (typeof value === 'object' && value !== null) {
    return {
      type: 'object',
      value: Object.fromEntries(
        Object.entries(value).map(([key, value]) => [
          key,
          parseFieldValue(value, meta),
        ]),
      ),
    }
  }

  return {
    type: 'unknown',
    value: `${value}`,
  }
}
