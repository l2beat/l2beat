import {
  AbiParameter,
  decodeAbiParameters,
  decodeFunctionData,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiItem,
  parseAbiParameters,
} from 'viem'

export type DecodedResult = DecodedFunction | DecodedParameters | DecodedError

export interface DecodedFunction {
  type: 'function'
  name: string
  selector: `0x${string}`
  values: Value[]
}

export interface DecodedParameters {
  type: 'parameters'
  abi: string
  values: Value[]
}

export interface DecodedError {
  type: 'error'
  error: string
}

export function decode(
  data: `0x${string}`,
  abi: string[],
): DecodedResult | undefined {
  const selector = data.slice(0, 10).toLowerCase()

  for (const fn of abi) {
    try {
      const abiItem = parseAbiItem(fn)
      if (abiItem.type !== 'function') {
        continue
      }
      const decoded = decodeFunctionData({
        abi: [abiItem],
        data,
      })

      const encoded = encodeFunctionData({
        abi: [abiItem],
        ...decoded,
      })
      const extra = data.slice(encoded.length).toLowerCase()

      const values = mix(abiItem.inputs, decoded.args)
      if (extra.length > 0) {
        values.push({
          stack: ['unexpected extra data'],
          type: 'bytes',
          value: `0x${extra}`,
        })
      }

      return {
        type: 'function',
        name: abiItem.name,
        selector: selector as `0x${string}`,
        values,
      }
    } catch (e) {
      console.error(e)
      continue
    }
  }
}

export function decodeCustom(
  data: `0x${string}`,
  abi: string,
): DecodedResult | undefined {
  abi = abi.trim()
  if (abi.startsWith('function')) {
    return decode(data, [abi])
  } else if (abi.startsWith('(')) {
    try {
      const parameters = parseAbiParameters(abi.slice(1, -1))

      const decoded = decodeAbiParameters(parameters, data)
      const values = mix(parameters, decoded)

      const encoded = encodeAbiParameters(parameters, decoded)
      const extra = data.slice(encoded.length).toLowerCase()
      if (extra.length > 0) {
        values.push({
          stack: ['unexpected extra data'],
          type: 'bytes',
          value: `0x${extra}`,
        })
      }

      return {
        type: 'parameters',
        abi: abi,
        values,
      }
    } catch (e) {
      console.error(e)
      return {
        type: 'error',
        error: 'Cannot decode data. See console for details.',
      }
    }
  } else {
    return {
      type: 'error',
      error: 'Cannot decode data. See console for details.',
    }
  }
}

export interface Value {
  stack: string[]
  type: string
  value: string | boolean | bigint | Value[]
}

function mix(
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
