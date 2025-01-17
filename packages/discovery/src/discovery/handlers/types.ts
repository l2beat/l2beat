import { Bytes, HEX_REGEX } from '@l2beat/shared-pure'
import * as z from 'zod'

export const BytesFromString = z
  .string()
  .regex(HEX_REGEX)
  .transform((x) => Bytes.fromHex(x).toString())

export const NumberFromString = z
  .string()
  .regex(/^([1-9]\d*|0)$/)
  .transform((x) => BigInt(x))
