import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { Handler } from '../Handler'
import {
  AccessControlHandler,
  AccessControlHandlerDefinition,
} from './AccessControlHandler'
import {
  ArrayFromOneEventHandler,
  ArrayFromOneEventHandlerDefinition,
} from './ArrayFromOneEventHandler'
import {
  ArrayFromOneEventWithArgHandler,
  ArrayFromOneEventWithArgHandlerDefinition,
} from './ArrayFromOneEventWithArgHandler'
import {
  ArrayFromTwoEventsHandler,
  ArrayFromTwoEventsHandlerDefinition,
} from './ArrayFromTwoEventsHandler'
import { ArrayHandler, ArrayHandlerDefinition } from './ArrayHandler'
import { CallHandler, CallHandlerDefinition } from './CallHandler'
import {
  ConstructorArgsDefinition,
  ConstructorArgsHandler,
} from './ConstructorArgsHandler'
import {
  EventCountHandler,
  EventCountHandlerDefinition,
} from './EventCountHandler'
import { HardCodedDefinition, HardCodedHandler } from './HardcodedHandler'
import {
  StarkWareGovernanceHandler,
  StarkWareGovernanceHandlerDefinition,
} from './StarkWareGovernanceHandler'
import {
  StarkWareNamedStorageHandler,
  StarkWareNamedStorageHandlerDefinition,
} from './StarkWareNamedStorageHandler'
import {
  StateFromEventDefinition,
  StateFromEventHandler,
} from './StateFromEventHandler'
import { StorageHandler, StorageHandlerDefinition } from './StorageHandler'

export type UserHandlerDefinition = z.infer<typeof UserHandlerDefinition>
export const UserHandlerDefinition = z.union([
  StorageHandlerDefinition,
  ArrayHandlerDefinition,
  CallHandlerDefinition,
  StarkWareNamedStorageHandlerDefinition,
  AccessControlHandlerDefinition,
  ArrayFromOneEventHandlerDefinition,
  ArrayFromOneEventWithArgHandlerDefinition,
  ArrayFromTwoEventsHandlerDefinition,
  ConstructorArgsDefinition,
  EventCountHandlerDefinition,
  StateFromEventDefinition,
  HardCodedDefinition,
  StarkWareGovernanceHandlerDefinition,
])

export function getUserHandler(
  field: string,
  definition: UserHandlerDefinition,
  abi: string[],
  logger: DiscoveryLogger,
): Handler {
  switch (definition.type) {
    case 'storage':
      return new StorageHandler(field, definition, logger)
    case 'array':
      return new ArrayHandler(field, definition, abi, logger)
    case 'call':
      return new CallHandler(field, definition, abi, logger)
    case 'starkWareNamedStorage':
      return new StarkWareNamedStorageHandler(field, definition, logger)
    case 'accessControl':
      return new AccessControlHandler(field, definition, abi, logger)
    case 'arrayFromOneEvent':
      return new ArrayFromOneEventHandler(field, definition, abi, logger)
    case 'arrayFromOneEventWithArg':
      return new ArrayFromOneEventWithArgHandler(field, definition, abi, logger)
    case 'arrayFromTwoEvents':
      return new ArrayFromTwoEventsHandler(field, definition, abi, logger)
    case 'constructorArgs':
      return new ConstructorArgsHandler(field, abi, logger)
    case 'eventCount':
      return new EventCountHandler(field, definition, logger)
    case 'hardcoded':
      return new HardCodedHandler(field, definition, logger)
    case 'starkWareGovernance':
      return new StarkWareGovernanceHandler(field, definition, abi, logger)
    case 'stateFromEvent':
      return new StateFromEventHandler(field, definition, abi, logger)
  }
}
