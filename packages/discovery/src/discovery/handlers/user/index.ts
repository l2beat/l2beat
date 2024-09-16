import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
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
  logger: DiscoveryLogger,
): Handler {
  switch (definition.type) {
    case 'storage':
      return new StorageHandler(field, definition, logger)
    case 'dynamicArray':
      return new DynamicArrayHandler(field, definition, logger)
    case 'array':
      return new ArrayHandler(field, definition, abi, logger)
    case 'call':
      return new CallHandler(field, definition, abi, logger)
    case 'starkWareNamedStorage':
      return new StarkWareNamedStorageHandler(field, definition, logger)
    case 'accessControl':
      return new AccessControlHandler(field, definition, abi, logger)
    case 'scrollAccessControl':
      return new ScrollAccessControlHandler(field, definition, abi, logger)
    case 'lineaRolesModule':
      return new LineaRolesModuleHandler(field, definition, abi, logger)
    case 'arrayFromOneEvent':
      return new ArrayFromOneEventHandler(field, definition, abi, logger)
    case 'arrayFromOneEventWithArg':
      return new ArrayFromOneEventWithArgHandler(field, definition, abi, logger)
    case 'arrayFromTwoEvents':
      return new ArrayFromTwoEventsHandler(field, definition, abi, logger)
    case 'constructorArgs':
      return new ConstructorArgsHandler(field, definition, abi, logger)
    case 'eventCount':
      return new EventCountHandler(field, definition, logger)
    case 'hardcoded':
      return new HardCodedHandler(field, definition, logger)
    case 'starkWareGovernance':
      return new StarkWareGovernanceHandler(field, definition, abi, logger)
    case 'stateFromEvent':
      return new StateFromEventHandler(field, definition, abi, logger)
    case 'stateFromEventTuple':
      return new StateFromEventTupleHandler(field, definition, abi, logger)
    case 'layerZeroMultisig':
      return new LayerZeroMultisigHandler(field, abi, logger)
    case 'arbitrumActors':
      return new ArbitrumActorsHandler(field, definition, logger)
    case 'arbitrumScheduledTransactions':
      return new ArbitrumScheduledTransactionsHandler(field, abi, logger)
    case 'opStackDA':
      return new OpStackDAHandler(field, definition, logger)
    case 'opStackSequencerInbox':
      return new OpStackSequencerInboxHandler(field, definition, logger)
    case 'arbitrumSequencerVersion':
      return new ArbitrumSequencerVersionHandler(field, definition, logger)
    case 'arbitrumDACKeyset':
      return new ArbitrumDACKeysetHandler(field, definition, logger)
    case 'eip2535Facets':
      return new EIP2535FacetHandler(field, definition, logger)
    case 'zksynceraScheduledTransactions':
      return new ZKsyncEraScheduledTransactionHandler(field, abi, logger)
    case 'zksynceraValidators':
      return new ZKsyncEraValidatorsHandler(field, abi, logger)
    case 'orbitPostsBlobs':
      return new OrbitPostsBlobsHandler(field, definition, logger)
    case 'polygoncdkScheduledTransactions':
      return new PolygonCDKScheduledTransactionHandler(field, abi, logger)
  }
}
