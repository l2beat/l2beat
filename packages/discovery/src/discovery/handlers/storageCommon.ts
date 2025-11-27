import { v } from '@l2beat/validate'

import { Reference } from './reference.js'
import { BytesFromString, NumberFromString } from './types.js'

export const SingleSlot = v.union([
  v.number().check((x) => Number.isInteger(x) && x >= 0),
  BytesFromString,
  NumberFromString,
  Reference,
])
