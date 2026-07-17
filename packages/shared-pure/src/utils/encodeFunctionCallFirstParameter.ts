import { Address32 } from '../types/Address32.js'

/** Encodes a number or hex value as the first 32-byte ABI call parameter. */
export function encodeFunctionCallFirstParameter(
  value: string | number,
): Address32 {
  const valueAsHex =
    typeof value === 'number' ? `0x${BigInt(value).toString(16)}` : value

  return Address32.from(valueAsHex)
}
