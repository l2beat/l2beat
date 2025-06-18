import { Bytes, HEX_REGEX } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export const BytesFromString = v
  .string()
  .check((x) => HEX_REGEX.test(x))
  .transform((x) => Bytes.fromHex(x).toString())

export const NumberFromString = v
  .string()
  .check((x) => /^([1-9]\d*|0)$/.test(x))
  .transform((x) => BigInt(x))
