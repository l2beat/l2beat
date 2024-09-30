import { Database } from '@l2beat/database'
import {
  AggLayerL2Token,
  AggLayerNativeEtherPreminted,
  AggLayerNativeEtherWrapped,
  AmountConfigEntry,
  CirculatingSupplyEntry,
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  ElasticChainL2Token,
  EscrowEntry,
  PremintedEntry,
  PriceConfigEntry,
  ProjectId,
  TotalSupplyEntry,
} from '@l2beat/shared-pure'
import { ManagedChildIndexerOptions } from '../../../tools/uif/ManagedChildIndexer'
import { ManagedMultiIndexerOptions } from '../../../tools/uif/multi/types'
import { AggLayerService } from '../services/AggLayerService'
import { AmountService } from '../services/AmountService'
import { BlockTimestampProvider } from '../services/BlockTimestampProvider'
import { CirculatingSupplyService } from '../services/CirculatingSupplyService'
import { ElasticChainService } from '../services/ElasticChainService'
import { PriceService } from '../services/PriceService'
import { ValueService } from '../services/ValueService'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface BlockTimestampIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  blockTimestampProvider: BlockTimestampProvider
  db: Database
  chain: string
  syncOptimizer: SyncOptimizer
}

export type ChainAmountConfig = EscrowEntry | TotalSupplyEntry

export interface ChainAmountIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<ChainAmountConfig>, 'name'> {
  amountService: AmountService
  db: Database
  syncOptimizer: SyncOptimizer
  chain: string
}

export type AggLayerAmountConfig =
  | AggLayerL2Token
  | AggLayerNativeEtherPreminted
  | AggLayerNativeEtherWrapped

export interface AggLayerAmountIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<AggLayerAmountConfig>, 'name'> {
  aggLayerService: AggLayerService
  db: Database
  syncOptimizer: SyncOptimizer
  chain: string
}

export type ElasticChainAmountConfig = ElasticChainL2Token

export interface ElasticChainAmountIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<ElasticChainAmountConfig>, 'name'> {
  elasticChainService: ElasticChainService
  db: Database
  syncOptimizer: SyncOptimizer
  chain: string
}

export interface PriceIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<CoingeckoPriceConfigEntry>, 'name'> {
  priceService: PriceService
  syncOptimizer: SyncOptimizer
  coingeckoId: CoingeckoId
}

export interface CirculatingSupplyIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  circulatingSupplyService: CirculatingSupplyService
  db: Database
  syncOptimizer: SyncOptimizer
  configuration: CirculatingSupplyEntry
}

export interface PremintedIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  circulatingSupplyService: CirculatingSupplyService
  amountService: AmountService
  db: Database
  syncOptimizer: SyncOptimizer
  configuration: PremintedEntry
}

export interface ValueIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  valueService: ValueService
  db: Database
  priceConfigs: PriceConfigEntry[]
  amountConfigs: AmountConfigEntry[]
  project: ProjectId
  dataSource: string
  syncOptimizer: SyncOptimizer
  maxTimestampsToProcessAtOnce: number
  minHeight: number
  maxHeight: number | undefined
}
