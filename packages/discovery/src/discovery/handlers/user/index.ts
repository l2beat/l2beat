import * as z from 'zod'

import { Handler } from '../Handler'
import {
  AccessControlHandler,
  AccessControlHandlerDefinition,
} from './AccessControlHandler'
import {
  ArbitrumActorsHandler,
  ArbitrumActorsHandlerDefinition,
} from './ArbitrumActorsHandler'
import {
  ArbitrumDACKeysetHandler,
  ArbitrumDACKeysetHandlerDefinition,
} from './ArbitrumDACKeysetHandler'
import {
  ArbitrumScheduledTransactionsHandler,
  ArbitrumScheduledTransactionsHandlerDefinition,
} from './ArbitrumScheduledTransactionsHandler'
import {
  ArbitrumSequencerVersionDefinition,
  ArbitrumSequencerVersionHandler,
} from './ArbitrumSequencerVersionHandler'
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
  DynamicArrayHandler,
  DynamicArrayHandlerDefinition,
} from './DynamicArrayHandler'
import {
  EIP2535FacetHandler,
  EIP2535FacetHandlerDefinition,
} from './EIP2535FacetHandler'
import {
  EventCountHandler,
  EventCountHandlerDefinition,
} from './EventCountHandler'
import { HardCodedDefinition, HardCodedHandler } from './HardcodedHandler'
import {
  LayerZeroMultisigHandler,
  LayerZeroMultisigHandlerDefinition,
} from './LayerZeroMultisigHandler'
import {
  LineaRolesModuleHandler,
  LineaRolesModuleHandlerDefinition,
} from './LineaRolesModuleHandler'
import { OpStackDAHandler, OpStackDAHandlerDefinition } from './OpDAHandler'
import {
  OpStackSequencerInboxHandler,
  OpStackSequencerInboxHandlerDefinition,
} from './OpSequencerInboxHandler'
import {
  OrbitPostsBlobsDefinition,
  OrbitPostsBlobsHandler,
} from './OrbitPostsBlobsHandler'
import {
  PolygonCDKScheduledTransactionHandler,
  PolygonCDKScheduledTransactionsHandlerDefinition,
} from './PolygonCDKScheduledTransactionHandler'
import {
  ScrollAccessControlHandler,
  ScrollAccessControlHandlerDefinition,
} from './ScrollAccessControlHandler'
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
import {
  StateFromEventTupleDefinition,
  StateFromEventTupleHandler,
} from './StateFromEventTupleHandler'
import { StorageHandler, StorageHandlerDefinition } from './StorageHandler'
import {
  ZKsyncEraScheduledTransactionHandler,
  ZKsyncEraScheduledTransactionsHandlerDefinition,
} from './ZKsyncEraScheduledTransactionHandler'
import {
  ZKsyncEraValidatorsHandler,
  ZKsyncEraValidatorsHandlerDefinition,
} from './ZKsyncEraValidatorsHandler'

export type UserHandlerDefinition = z.infer<typeof UserHandlerDefinition>
export const UserHandlerDefinition = z.union([
  StorageHandlerDefinition,
  DynamicArrayHandlerDefinition,
  DynamicArrayHandlerDefinition,
  ArrayHandlerDefinition,
  CallHandlerDefinition,
  StarkWareNamedStorageHandlerDefinition,
  AccessControlHandlerDefinition,
  ScrollAccessControlHandlerDefinition,
  LineaRolesModuleHandlerDefinition,
  ArrayFromOneEventHandlerDefinition,
  ArrayFromOneEventWithArgHandlerDefinition,
  ArrayFromTwoEventsHandlerDefinition,
  ConstructorArgsDefinition,
  EventCountHandlerDefinition,
  StateFromEventDefinition,
  StateFromEventTupleDefinition,
  HardCodedDefinition,
  StarkWareGovernanceHandlerDefinition,
  LayerZeroMultisigHandlerDefinition,
  ArbitrumActorsHandlerDefinition,
  ArbitrumScheduledTransactionsHandlerDefinition,
  OpStackDAHandlerDefinition,
  OpStackSequencerInboxHandlerDefinition,
  ArbitrumSequencerVersionDefinition,
  ArbitrumDACKeysetHandlerDefinition,
  EIP2535FacetHandlerDefinition,
  ZKsyncEraScheduledTransactionsHandlerDefinition,
  ZKsyncEraValidatorsHandlerDefinition,
  OrbitPostsBlobsDefinition,
  PolygonCDKScheduledTransactionsHandlerDefinition,
])

export function getUserHandler(
  field: string,
  definition: UserHandlerDefinition,
  abi: string[],
): Handler {
  switch (definition.type) {
    case 'storage':
      return new StorageHandler(field, definition)
    case 'dynamicArray':
      return new DynamicArrayHandler(field, definition)
    case 'array':
      return new ArrayHandler(field, definition, abi)
    case 'call':
      return new CallHandler(field, definition, abi)
    case 'starkWareNamedStorage':
      return new StarkWareNamedStorageHandler(field, definition)
    case 'accessControl':
      return new AccessControlHandler(field, definition, abi)
    case 'scrollAccessControl':
      return new ScrollAccessControlHandler(field, definition, abi)
    case 'lineaRolesModule':
      return new LineaRolesModuleHandler(field, definition, abi)
    case 'arrayFromOneEvent':
      return new ArrayFromOneEventHandler(field, definition, abi)
    case 'arrayFromOneEventWithArg':
      return new ArrayFromOneEventWithArgHandler(field, definition, abi)
    case 'arrayFromTwoEvents':
      return new ArrayFromTwoEventsHandler(field, definition, abi)
    case 'constructorArgs':
      return new ConstructorArgsHandler(field, definition, abi)
    case 'eventCount':
      return new EventCountHandler(field, definition)
    case 'hardcoded':
      return new HardCodedHandler(field, definition)
    case 'starkWareGovernance':
      return new StarkWareGovernanceHandler(field, definition, abi)
    case 'stateFromEvent':
      return new StateFromEventHandler(field, definition, abi)
    case 'layerZeroMultisig':
      return new LayerZeroMultisigHandler(field, abi)
    case 'arbitrumActors':
      return new ArbitrumActorsHandler(field, definition)
    case 'arbitrumScheduledTransactions':
      return new ArbitrumScheduledTransactionsHandler(field, abi)
    case 'opStackDA':
      return new OpStackDAHandler(field, definition)
    case 'opStackSequencerInbox':
      return new OpStackSequencerInboxHandler(field, definition)
    case 'arbitrumSequencerVersion':
      return new ArbitrumSequencerVersionHandler(field, definition)
    case 'arbitrumDACKeyset':
      return new ArbitrumDACKeysetHandler(field, definition)
    case 'eip2535Facets':
      return new EIP2535FacetHandler(field, definition)
    case 'zksynceraScheduledTransactions':
      return new ZKsyncEraScheduledTransactionHandler(field, abi)
    case 'zksynceraValidators':
      return new ZKsyncEraValidatorsHandler(field, abi)
    case 'orbitPostsBlobs':
      return new OrbitPostsBlobsHandler(field, definition)
    case 'polygoncdkScheduledTransactions':
      return new PolygonCDKScheduledTransactionHandler(field, abi)
  }
}
