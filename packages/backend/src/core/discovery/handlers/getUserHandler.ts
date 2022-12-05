import { Handler } from './Handler'
import { ArrayHandler } from './user/ArrayHandler'
import { StorageHandler } from './user/StorageHandler'
import { UserHandlerDefinition } from './UserHandlerDefinition'

export function getUserHandler(
  field: string,
  definition: UserHandlerDefinition,
): Handler {
  switch (definition.type) {
    case 'storage':
      return new StorageHandler(field, definition)
    case 'array':
      return new ArrayHandler(field, definition)
  }
}
