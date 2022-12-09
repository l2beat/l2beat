import { Bytes, HEX_REGEX } from '@l2beat/types'
import * as z from 'zod'

export const BytesFromString = z
  .string()
  .regex(HEX_REGEX)
  .transform((x) => Bytes.fromHex(x))

export const NumberFromString = z
  .string()
  .regex(/^[1-9]\d*$/)
  .transform((x) => BigInt(x))
