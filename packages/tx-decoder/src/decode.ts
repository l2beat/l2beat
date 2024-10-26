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

// if abi = multiSend, decode multiSend

export function decodeCustom(
  data: `0x${string}`,
  abi: string,
): DecodedResult | undefined {
  abi = abi.trim()
  if (abi.startsWith('function')) {
    return decode(data, [abi])
  } 
  else if (abi.startsWith('multiSend')) {
    // operationByte + 20 address bytes + 32 value bytes + 32 data length bytes + data = 85 bytes + data
    const transactions = data.slice(2); // Remove the '0x' prefix
    const values: Value[] = [];
    let i = 0; 
    let j=0;
    while (i < transactions.length) {
      const operation = `0x${transactions.slice(i, i + 2)}`; // call or delegatecall, ignored
      const to = `0x${transactions.slice(i + 2, i + 42)}`;
      const value = BigInt(`0x${transactions.slice(i + 42, i + 106)}`);
      const dataLength = parseInt(transactions.slice(i + 106, i + 170), 16);
      const data = `0x${transactions.slice(i + 170, i + 170 + dataLength * 2)}`;
      const singleOp: Value[] = [];
      singleOp.push({
        stack: ['0'],
        type: 'address',
        value: to,
      });
      singleOp.push({
        stack: ['1'],
        type: 'uint256',
        value: value,
      }); 
      singleOp.push({
        stack: ['2'],
        type: 'bytes',
        value: data,
      });
      values.push({
        stack: [j],
        type: '(address,uint256,bytes)',
        value: singleOp,
      });

      i += 170 + dataLength * 2;
      j++;
    }

    return {
      type: 'parameters',
      abi: abi,
      values: values
    };
  }
  else if (abi.startsWith('(')) {
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
