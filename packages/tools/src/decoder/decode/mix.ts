import type { AbiParameter } from 'viem'
import type { Value } from './DecodedResult'

export function mix(
  items: readonly AbiParameter[],
  values: readonly unknown[],
): Value[] {
  return items.map((item, i) =>
    mixValue(item, values[i], [item.name ?? i.toString()]),
  )
}

function mixValue(item: AbiParameter, value: unknown, stack: string[]): Value {
  if (Array.isArray(value)) {
    const index = item.type.lastIndexOf('[')
    const innerType = index !== -1 ? item.type.slice(0, index) : item.type
    const innerItem = { ...item, type: innerType }

    if ('components' in innerItem && index === -1) {
      return {
        stack,
        type: 'tuple',
        value: innerItem.components.map((c, i) =>
          mixValue(c, value[i], [...stack, c.name ?? i.toString()]),
        ),
      }
    }

    return {
      stack,
      type: `array(${value.length})`,
      value: value.map((v, i) =>
        mixValue(innerItem, v, [...stack, i.toString()]),
      ),
    }
  }

  if (
    typeof value === 'string' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean'
  ) {
    return {
      stack,
      type: item.type,
      value,
    }
  }

  if (typeof value === 'number') {
    return {
      stack,
      type: item.type,
      value: BigInt(value),
    }
  }

  throw new Error()
}
