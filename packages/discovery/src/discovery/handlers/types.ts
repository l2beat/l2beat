import * as z from 'zod'

import { Bytes, HEX_REGEX } from '../../utils/Bytes'

export const BytesFromString = z
  .string()
  .regex(HEX_REGEX)
  .transform((x) => Bytes.fromHex(x))

export const NumberFromString = z
  .string()
  .regex(/^([1-9]\d*|0)$/)
  .transform((x) => BigInt(x))
