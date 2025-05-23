import * as z from 'zod/v4'

import { Reference } from './reference'
import { BytesFromString, NumberFromString } from './types'

export const SingleSlot = z.union([
  z.number().int().nonnegative(),
  BytesFromString,
  NumberFromString,
  Reference,
])
