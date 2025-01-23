import { BinaryReader } from './BinaryReader'
import type { DecodedResult, Value } from './DecodedResult'

export function decodeMultisend(data: `0x${string}`): DecodedResult {
  const reader = new BinaryReader(data)
  const values: Value[] = []
  while (!reader.isAtEnd()) {
    reader.read(1) // operation: call or delegatecall, ignored
    const to = reader.read(20)
    const value = BigInt(reader.read(32))
    const length = Number(reader.read(32))
    const data = reader.read(length)

    const n = values.length.toString()
    values.push({
      stack: [n],
      type: 'transaction',
      value: [
        { stack: [n, '0'], type: 'address', value: to },
        { stack: [n, '1'], type: 'uint256', value: value },
        { stack: [n, '2'], type: 'bytes', value: data },
      ],
    })
  }
  return {
    type: 'parameters',
    abi: 'multiSend',
    values: values,
  }
}
