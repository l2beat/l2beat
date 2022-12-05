import * as z from 'zod'

import { ArrayHandlerDefinition } from './user/ArrayHandler'
import { StorageHandlerDefinition } from './user/StorageHandler'

export type UserHandlerDefinition = z.infer<typeof UserHandlerDefinition>
export const UserHandlerDefinition = z.union([
  StorageHandlerDefinition,
  ArrayHandlerDefinition,
])
