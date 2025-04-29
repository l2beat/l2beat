import type { AbiParameter } from 'abitype'
import type { Value } from './DecodedResult'

const INT_COMPLEMENT =
  0x8000000000000000000000000000000000000000000000000000000000000000n

export function decodeType(
  type: AbiParameter,
  value: string,
  name = '',
): Value {
  const common = { name, abi: type.type, encoded: value }
  if (type.type.startsWith('uint')) {
    return {
      ...common,
      decoded: {
        type: 'number',
        value: BigInt(value).toString(),
      },
    }
  }
  if (type.type.startsWith('int')) {
    const uint = BigInt(value)
    return {
      ...common,
      decoded: {
        type: 'number',
        value: (uint > INT_COMPLEMENT
          ? uint - INT_COMPLEMENT * 2n
          : uint
        ).toString(),
      },
    }
  }
  throw new Error('Unknown type')
}
