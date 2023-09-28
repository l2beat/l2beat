import * as z from 'zod'

import { Reference } from './reference'
import { BytesFromString, NumberFromString } from './types'

export const SingleSlot = z.union([
  z.number().int().nonnegative(),
  BytesFromString,
  NumberFromString,
  Reference,
])
