import type { AbiParameter } from 'viem'
import type { Value } from './DecodedResult'

export function mix(
  items: readonly AbiParameter[],
  values: readonly unknown[],
): Value[] {
  return items.map((item, i) =>
    mixValue(item, values[i], item.name ?? i.toString()),
  )
}

function mixValue(item: AbiParameter, value: unknown, name: string): Value {
  if (Array.isArray(value)) {
    const index = item.type.lastIndexOf('[')
    const innerType = index !== -1 ? item.type.slice(0, index) : item.type
    const innerItem = { ...item, type: innerType }

    if ('components' in innerItem && index === -1) {
      return {
        name,
        abi: item.type,
        encoded: '0x', // TODO:
        decoded: {
          type: 'array',
          values: innerItem.components.map((c, i) =>
            mixValue(c, value[i], c.name ?? i.toString()),
          ),
        },
      }
    }

    return {
      name,
      abi: item.type,
      encoded: '0x', // TODO:
      decoded: {
        type: 'array',
        values: value.map((c, i) =>
          mixValue(c, value[i], c.name ?? i.toString()),
        ),
      },
    }
  }

  if (typeof value === 'boolean') {
    return {
      name,
      abi: item.type,
      encoded: '0x', // TODO:
      decoded: { type: 'boolean', value },
    }
  }

  if (typeof value === 'string') {
    return {
      name,
      abi: item.type,
      encoded: '0x', // TODO:
      decoded: { type: 'string', value },
    }
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return {
      name,
      abi: item.type,
      encoded: '0x', // TODO:
      decoded: { type: 'number', value: value.toString() },
    }
  }

  throw new Error()
}
