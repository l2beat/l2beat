import { v } from '@l2beat/validate'

import { Reference } from './reference'
import { BytesFromString, NumberFromString } from './types'

export const SingleSlot = v.union([
  v.number().check((x) => Number.isInteger(x) && x >= 0),
  BytesFromString,
  NumberFromString,
  Reference,
])
