import { v } from '@l2beat/validate'

import { type Handler, mapTuple } from '../Handler'
import {
  AccessControlHandler,
  AccessControlHandlerBundle,
} from './AccessControlHandler'
import {
  ArbitrumActorsHandler,
  ArbitrumActorsHandlerBundle,
} from './ArbitrumActorsHandler'
import {
  ArbitrumDACKeysetHandler,
  ArbitrumDACKeysetHandlerBundle,
} from './ArbitrumDACKeysetHandler'
import {
  ArbitrumScheduledTransactionsHandler,
  ArbitrumScheduledTransactionsHandlerBundle,
} from './ArbitrumScheduledTransactionsHandler'
import {
  ArbitrumSequencerVersionHandler,
  ArbitrumSequencerVersionHandlerBundle,
} from './ArbitrumSequencerVersionHandler'
import { ArrayHandler, ArrayHandlerBundle } from './ArrayHandler'
import { CallHandler, CallHandlerBundle } from './CallHandler'
import {
  ConstructorArgsHandler,
  ConstructorArgsHandlerBundle,
} from './ConstructorArgsHandler'
import {
  CrossChainAccessControlHandler,
  CrossChainAccessControlHandlerBundle,
} from './CrossChainAccessControlHandler'
import {
  DynamicArrayHandler,
  DynamicArrayHandlerBundle,
} from './DynamicArrayHandler'
import {
  EIP2535FacetHandler,
  EIP2535FacetHandlerBundle,
} from './EIP2535FacetHandler'
import {
  ERC20DataHandler,
  ERC20DataHandlerBundle,
} from './ERC20DataHandler/ERC20DataHandler'
import { EventCountHandler, EventCountHandlerBundle } from './EventCountHandler'
import { EventHandler, EventHandlerBundle } from './EventHandler'
import { EventTraceHandler, EventTraceHandlerBundle } from './EventTraceHandler'
import { HardCodedHandler, HardCodedHandlerBundle } from './HardcodedHandler'
import {
  KintoAccessControlHandler,
  KintoAccessControlHandlerBundle,
} from './KintoAccessControlHandler'
import {
  LayerZeroMultisigHandler,
  LayerZeroMultisigHandlerBundle,
} from './LayerZeroMultisigHandler'
import {
  LineaRolesModuleHandler,
  LineaRolesModuleHandlerBundle,
} from './LineaRolesModuleHandler'
import {
  OpStackDAHandler,
  OpStackDAHandlerBundle,
} from './OpDaHandler/OpDAHandler'
import {
  OpStackSequencerInboxHandler,
  OpStackSequencerInboxHandlerBundle,
} from './OpSequencerInboxHandler'
import {
  OrbitPostsBlobsHandler,
  OrbitPostsBlobsHandlerBundle,
} from './OrbitPostsBlobsHandler'
import {
  PolygonCDKScheduledTransactionHandler,
  PolygonCDKScheduledTransactionHandlerBundle,
} from './PolygonCDKScheduledTransactionHandler'
import {
  ScrollAccessControlHandler,
  ScrollAccessControlHandlerBundle,
} from './ScrollAccessControlHandler'
import {
  StarkWareGovernanceHandler,
  StarkWareGovernanceHandlerBundle,
} from './StarkWareGovernanceHandler'
import {
  StarkWareNamedStorageHandler,
  StarkWareNamedStorageHandlerBundle,
} from './StarkWareNamedStorageHandler'
import { StorageHandler, StorageHandlerBundle } from './StorageHandler'
import {
  TradableHandler,
  TradableHandlerBundle,
} from './TradableHandler/TradableHandler'
import {
  YieldFiMintersHandler,
  YieldFiMintersHandlerBundle,
} from './YieldFiMintersHandler'
import {
  ZKsyncEraScheduledTransactionHandler,
  ZKsyncEraScheduledTransactionHandlerBundle,
} from './ZKsyncEraScheduledTransactionHandler'
import {
  ZKsyncEraValidatorsHandler,
  ZKsyncEraValidatorsHandlerBundle,
} from './ZKsyncEraValidatorsHandler'

export const HANDLER_BUNDLES = [
  StorageHandlerBundle,
  DynamicArrayHandlerBundle,
  ArrayHandlerBundle,
  CallHandlerBundle,
  EventHandlerBundle,
  StarkWareNamedStorageHandlerBundle,
  AccessControlHandlerBundle,
  ScrollAccessControlHandlerBundle,
  KintoAccessControlHandlerBundle,
  LineaRolesModuleHandlerBundle,
  ConstructorArgsHandlerBundle,
  EventCountHandlerBundle,
  HardCodedHandlerBundle,
  StarkWareGovernanceHandlerBundle,
  LayerZeroMultisigHandlerBundle,
  ArbitrumActorsHandlerBundle,
  ArbitrumScheduledTransactionsHandlerBundle,
  OpStackDAHandlerBundle,
  OpStackSequencerInboxHandlerBundle,
  ArbitrumSequencerVersionHandlerBundle,
  ArbitrumDACKeysetHandlerBundle,
  EIP2535FacetHandlerBundle,
  ZKsyncEraScheduledTransactionHandlerBundle,
  ZKsyncEraValidatorsHandlerBundle,
  OrbitPostsBlobsHandlerBundle,
  PolygonCDKScheduledTransactionHandlerBundle,
  ERC20DataHandlerBundle,
  TradableHandlerBundle,
  YieldFiMintersHandlerBundle,
  EventTraceHandlerBundle,
  CrossChainAccessControlHandlerBundle,
] as const

const DEFINITIONS = mapTuple(HANDLER_BUNDLES, (bundle) => bundle.definition)

export type UserHandlerDefinition = v.infer<typeof UserHandlerDefinition>
export const UserHandlerDefinition = v.union([...DEFINITIONS])

export const UserHandlers = Object.fromEntries(
  HANDLER_BUNDLES.map((bundle) => [bundle.type, bundle]),
)

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
    case 'event':
      return new EventHandler(field, definition, abi)
    case 'starkWareNamedStorage':
      return new StarkWareNamedStorageHandler(field, definition)
    case 'accessControl':
      return new AccessControlHandler(field, definition, abi)
    case 'kintoAccessControl':
      return new KintoAccessControlHandler(field, definition, abi)
    case 'scrollAccessControl':
      return new ScrollAccessControlHandler(field, definition, abi)
    case 'lineaRolesModule':
      return new LineaRolesModuleHandler(field, definition, abi)
    case 'constructorArgs':
      return new ConstructorArgsHandler(field, definition, abi)
    case 'eventCount':
      return new EventCountHandler(field, definition)
    case 'hardcoded':
      return new HardCodedHandler(field, definition)
    case 'starkWareGovernance':
      return new StarkWareGovernanceHandler(field, definition, abi)
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
    case 'ERC20Data':
      return new ERC20DataHandler(field, definition)
    case 'tradable':
      return new TradableHandler(field)
    case 'YieldFiMinters':
      return new YieldFiMintersHandler(field, definition, abi)
    case 'eventTrace':
      return new EventTraceHandler(field, definition, abi)
    case 'crossChainAccessControl':
      return new CrossChainAccessControlHandler(field, definition, abi)
  }
}
