import * as z from 'zod'

import { Handler } from '../Handler'
import { ArrayHandler, ArrayHandlerDefinition } from './ArrayHandler'
import { CallHandler, CallHandlerDefinition } from './CallHandler'
import {
  StarkWareNamedStorageHandler,
  StarkWareNamedStorageHandlerDefinition,
} from './StarkWareNamedStorageHandler'
import { StorageHandler, StorageHandlerDefinition } from './StorageHandler'

export type UserHandlerDefinition = z.infer<typeof UserHandlerDefinition>
export const UserHandlerDefinition = z.union([
  StorageHandlerDefinition,
  ArrayHandlerDefinition,
  CallHandlerDefinition,
  StarkWareNamedStorageHandlerDefinition,
])

export function getUserHandler(
  field: string,
  definition: UserHandlerDefinition,
  abi: string[],
): Handler {
  switch (definition.type) {
    case 'storage':
      return new StorageHandler(field, definition)
    case 'array':
      return new ArrayHandler(field, definition, abi)
    case 'call':
      return new CallHandler(field, definition, abi)
    case 'starkWareNamedStorage':
      return new StarkWareNamedStorageHandler(field, definition)
  }
}
