import { v } from '@l2beat/validate'

import { type Handler, type HandlerFactoryDeps, mapTuple } from '../Handler'
import { AccessControlHandlerBundle } from './AccessControlHandler'
import { ArbitrumActorsHandlerBundle } from './ArbitrumActorsHandler'
import { ArbitrumDACKeysetHandlerBundle } from './ArbitrumDACKeysetHandler'
import { ArbitrumScheduledTransactionsHandlerBundle } from './ArbitrumScheduledTransactionsHandler'
import { ArbitrumSequencerVersionHandlerBundle } from './ArbitrumSequencerVersionHandler'
import { ArrayHandlerBundle } from './ArrayHandler'
import { CallHandlerBundle } from './CallHandler'
import { ConstructorArgsHandlerBundle } from './ConstructorArgsHandler'
import { CrossChainAccessControlHandlerBundle } from './CrossChainAccessControlHandler'
import { DynamicArrayHandlerBundle } from './DynamicArrayHandler'
import { EIP2535FacetHandlerBundle } from './EIP2535FacetHandler'
import { ERC20DataHandlerBundle } from './ERC20DataHandler/ERC20DataHandler'
import { EventCountHandlerBundle } from './EventCountHandler'
import { EventHandlerBundle } from './EventHandler'
import { EventTraceHandlerBundle } from './EventTraceHandler'
import { HardCodedHandlerBundle } from './HardcodedHandler'
import { KintoAccessControlHandlerBundle } from './KintoAccessControlHandler'
import { LayerZeroMultisigHandlerBundle } from './LayerZeroMultisigHandler'
import { LineaRolesModuleHandlerBundle } from './LineaRolesModuleHandler'
import { OpStackDAHandlerBundle } from './OpDaHandler/OpDAHandler'
import { OpStackSequencerInboxHandlerBundle } from './OpSequencerInboxHandler'
import { OrbitPostsBlobsHandlerBundle } from './OrbitPostsBlobsHandler'
import { PolygonCDKScheduledTransactionHandlerBundle } from './PolygonCDKScheduledTransactionHandler'
import { ScrollAccessControlHandlerBundle } from './ScrollAccessControlHandler'
import { StarkWareGovernanceHandlerBundle } from './StarkWareGovernanceHandler'
import { StarkWareNamedStorageHandlerBundle } from './StarkWareNamedStorageHandler'
import { StorageHandlerBundle } from './StorageHandler'
import { TradableHandlerBundle } from './TradableHandler/TradableHandler'
import { YieldFiMintersHandlerBundle } from './YieldFiMintersHandler'
import { ZKsyncEraScheduledTransactionHandlerBundle } from './ZKsyncEraScheduledTransactionHandler'
import { ZKsyncEraValidatorsHandlerBundle } from './ZKsyncEraValidatorsHandler'

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

type UserHandlerBundle = (typeof HANDLER_BUNDLES)[number]
type UserHandlerBundleByType = {
  [K in UserHandlerBundle['type']]: Extract<UserHandlerBundle, { type: K }>
}

type BundleDefinition<TBundle extends UserHandlerBundle> = v.infer<
  TBundle['definition']
>

export type UserHandlerDefinition = BundleDefinition<UserHandlerBundle>
export const UserHandlerDefinition = v.union([
  ...mapTuple(HANDLER_BUNDLES, (bundle) => bundle.definition),
])

type UserHandlerDefinitionByType = {
  [K in UserHandlerBundle['type']]: BundleDefinition<UserHandlerBundleByType[K]>
}

export const UserHandlers = Object.fromEntries(
  HANDLER_BUNDLES.map((bundle) => [bundle.type, bundle]),
)

export function getUserHandler<T extends UserHandlerDefinition['type']>(
  field: string,
  definition: UserHandlerDefinitionByType[T],
  abi: string[],
): Handler {
  const bundle = UserHandlers[definition.type]
  if (!bundle) {
    throw new Error(`Handler bundle not found for type: ${definition.type}`)
  }

  const create = bundle.create as (
    deps: HandlerFactoryDeps<UserHandlerDefinitionByType[T]>,
  ) => Handler
  return create({ field, definition, abi })
}
